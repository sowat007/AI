
import React from 'react';
import { Message, Role } from '../types';

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  onPlayAudio?: (data: Uint8Array) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading, onPlayAudio }) => {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 py-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`group relative max-w-[90%] md:max-w-[80%] p-5 rounded-3xl shadow-sm transition-all ${
              msg.role === Role.USER
                ? 'bg-emerald-700 text-white rounded-tr-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none hover:shadow-md'
            }`}
          >
            {/* Play Audio Button for Model responses */}
            {msg.role === Role.MODEL && msg.audioData && onPlayAudio && (
              <button 
                onClick={() => onPlayAudio(msg.audioData!)}
                className="absolute -right-12 top-0 p-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-all opacity-0 group-hover:opacity-100"
                title="উত্তরটি আবার শুনুন"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828 2.828a9 9 0 01-12.728 0M12 21l-8.228-8.228a9 9 0 010-12.728L12 3m0 18v-18" />
                </svg>
              </button>
            )}

            <div className="flex items-center mb-3 space-x-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner ${
                msg.role === Role.USER ? 'bg-emerald-500 text-emerald-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {msg.role === Role.USER ? 'ইউজার' : 'এআই'}
              </div>
              <span className={`text-[10px] font-bold tracking-tight ${msg.role === Role.USER ? 'text-emerald-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium">
              {msg.text}
            </div>

            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-5 pt-4 border-t border-emerald-50/20 text-xs">
                <p className={`font-bold uppercase tracking-wider mb-3 ${msg.role === Role.USER ? 'text-emerald-200' : 'text-emerald-800'}`}>
                  আরও তথ্যের উৎস:
                </p>
                <div className="flex flex-wrap gap-2">
                  {msg.sources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-2 rounded-xl border transition-all flex items-center space-x-1 ${
                        msg.role === Role.USER 
                          ? 'bg-emerald-800/50 border-emerald-600 text-white hover:bg-emerald-600' 
                          : 'bg-emerald-50 border-emerald-100 text-emerald-900 hover:bg-emerald-100'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      <span className="truncate max-w-[150px] font-semibold">{src.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-100 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-emerald-700 font-bold italic">আইন-সেবা বিশ্লেষণ করছে...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
