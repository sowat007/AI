
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
      text: "আসসালামু আলাইকুম। আমি 'আইন-সেবা' এআই এজেন্ট। আমি আপনাকে বাংলাদেশের আইন, সংবিধান এবং বিচারিক কার্যক্রম সম্পর্কে তথ্য দিয়ে সাহায্য করতে পারি। আপনি কি সম্পর্কে জানতে চান?",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      role: Role.USER,
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(messages, text);
      const botMsg: Message = {
        role: Role.MODEL,
        text: response.text,
        timestamp: new Date(),
        sources: response.sources,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        role: Role.MODEL,
        text: "দুঃখিত, সার্ভারের সাথে সংযোগ স্থাপনে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার ইন্টারনেট চেক করুন এবং পুনরায় চেষ্টা করুন।",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-['Hind_Siliguri']">
      {/* Sidebar for desktop */}
      <Sidebar topics={SUGGESTED_TOPICS} onTopicSelect={(title) => handleSendMessage(`${title} সম্পর্কে বিস্তারিত বলুন।`)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <ChatBox messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input area is sticky to bottom */}
        <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-4xl mx-auto relative">
            <input
              disabled={isLoading}
              type="text"
              placeholder="আপনার আইনি প্রশ্নটি এখানে লিখুন... (যেমন: চুরির শাস্তি কী?)"
              className="w-full px-5 py-4 pr-16 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-lg transition-all disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              disabled={isLoading}
              onClick={(e) => {
                const input = e.currentTarget.previousSibling as HTMLInputElement;
                handleSendMessage(input.value);
                input.value = '';
              }}
              className="absolute right-3 top-2.5 bg-emerald-700 hover:bg-emerald-800 text-white p-2.5 rounded-xl transition-colors disabled:bg-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            আইন-সেবা এআই ভুল তথ্য দিতে পারে। গুরুত্বপূর্ণ প্রয়োজনে রেজিস্টার্ড আইনজীবীর পরামর্শ নিন।
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
