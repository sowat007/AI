
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, LegalTopic } from './types';
import { geminiService } from './geminiService';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import Header from './components/Header';

const SUGGESTED_TOPICS: LegalTopic[] = [
  { id: '1', title: 'মৌলিক অধিকার', description: 'বাংলাদেশের সংবিধানে বর্ণিত আপনার অধিকারসমূহ।', icon: '⚖️' },
  { id: '2', title: 'পারিবারিক আইন', description: 'বিবাহ, বিচ্ছেদ ও উত্তরাধিকার সংক্রান্ত আইন।', icon: '🏠' },
  { id: '3', title: 'দণ্ডবিধি ও শাস্তি', description: 'বিভিন্ন অপরাধের জন্য নির্ধারিত আইন ও শাস্তি।', icon: '📜' },
  { id: '4', title: 'সম্পত্তি আইন', description: 'জমি ক্রয়-বিক্রয় ও দলিল সংক্রান্ত তথ্যাদি।', icon: '🚜' },
  { id: '5', title: 'ট্রাফিক আইন', description: 'সড়ক পরিবহন আইন, লাইসেন্স এবং ট্রাফিক জরিমানা।', icon: '🚦' },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.MODEL,
      text: "আসসালামু আলাইকুম। আমি 'আইন-সেবা' এআই এজেন্ট। আমি আপনাকে বাংলাদেশের আইন সম্পর্কে তথ্য দিয়ে সাহায্য করতে পারি। আপনি লিখে অথবা মাইক্রোফোন আইকনে ক্লিক করে কথা বলে প্রশ্ন করতে পারেন।",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'bn-BD'; // Set language to Bengali
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onstart = () => setIsRecording(true);
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const playAudio = async (audioData: Uint8Array) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      
      // The API returns raw PCM 16-bit mono at 24kHz
      const dataInt16 = new Int16Array(audioData.buffer);
      const frameCount = dataInt16.length;
      const buffer = ctx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      setIsSpeaking(true);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (err) {
      console.error("Audio Playback Error:", err);
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (text?: string) => {
    const query = text || inputText;
    if (!query.trim() || isLoading) return;

    setInputText('');
    const userMsg: Message = {
      role: Role.USER,
      text: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(messages, query);
      const botMsg: Message = {
        role: Role.MODEL,
        text: response.text,
        timestamp: new Date(),
        sources: response.sources,
      };
      setMessages(prev => [...prev, botMsg]);

      // Automatically speak the response
      const audioBuffer = await geminiService.textToSpeech(response.text);
      if (audioBuffer) {
        botMsg.audioData = audioBuffer;
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? botMsg : m));
        await playAudio(audioBuffer);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: Role.MODEL,
        text: "দুঃখিত, কোনো টেকনিক্যাল সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-['Hind_Siliguri']">
      {/* Sidebar without Community Feed */}
      <Sidebar 
        topics={SUGGESTED_TOPICS} 
        onTopicSelect={(query) => handleSendMessage(query)} 
      />

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col relative w-full">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <ChatBox messages={messages} isLoading={isLoading} onPlayAudio={playAudio} />
          
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl text-xs flex items-center space-x-2 border border-emerald-100 shadow-sm animate-pulse">
                <span className="flex space-x-0.5">
                  <span className="w-1 h-3 bg-emerald-500 rounded-full animate-grow-shrink" style={{animationDelay: '0s'}}></span>
                  <span className="w-1 h-3 bg-emerald-500 rounded-full animate-grow-shrink" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-1 h-3 bg-emerald-500 rounded-full animate-grow-shrink" style={{animationDelay: '0.2s'}}></span>
                </span>
                <span className="font-semibold">আইন-সেবা কথা বলছে...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Improved Input Area with Voice Button */}
        <div className="p-4 bg-white border-t border-gray-200 shadow-2xl z-20">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            <div className="relative flex-1 group">
              <input
                disabled={isLoading}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? "শুনছি... আপনার প্রশ্নটি বলুন" : "আপনার আইনি প্রশ্নটি এখানে লিখুন..."}
                className={`w-full px-6 py-4 pr-16 bg-gray-50 border-2 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 placeholder-gray-400 ${
                  isRecording 
                    ? 'border-red-400 bg-red-50 text-red-900 animate-pulse' 
                    : 'border-gray-200 focus:border-emerald-600'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendMessage();
                  }
                }}
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`absolute right-2 top-2 p-3 rounded-2xl transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-lg scale-110' 
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
                title="ভয়েস ইনপুট"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isRecording ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  )}
                </svg>
              </button>
            </div>
            
            <button
              disabled={isLoading || (!inputText.trim() && !isRecording)}
              onClick={() => handleSendMessage()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white p-4 rounded-3xl transition-all shadow-lg hover:shadow-emerald-900/20 disabled:bg-gray-300 disabled:shadow-none active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
            আইন-সেবা এআই ভুল করতে পারে। সঠিক তথ্যের জন্য রেজিস্টার্ড আইনজীবীর সহায়তা নিন।
          </p>
        </div>
      </main>

      <style>{`
        @keyframes grow-shrink {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.2); }
        }
        .animate-grow-shrink {
          animation: grow-shrink 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
