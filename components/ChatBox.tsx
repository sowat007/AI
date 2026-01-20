
import React from 'react';
import { Message, Role } from '../types';

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm ${
              msg.role === Role.USER
                ? 'bg-emerald-700 text-white rounded-tr-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}
          >
            <div className="flex items-center mb-2 space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                msg.role === Role.USER ? 'bg-emerald-500' : 'bg-gray-200 text-gray-600'
              }`}>
                {msg.role === Role.USER ? 'U' : 'AI'}
              </div>
              <span className={`text-[10px] ${msg.role === Role.USER ? 'text-emerald-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {msg.text}
            </div>

            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                <p className="font-semibold text-gray-500 mb-2">আরও তথ্যের উৎস:</p>
                <div className="flex flex-wrap gap-2">
                  {msg.sources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-50 border border-gray-200 rounded hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-emerald-800"
                    >
                      {src.title}
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
          <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-gray-500 font-medium italic">আইন-সেবা চিন্তা করছে...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
