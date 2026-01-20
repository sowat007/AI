
import React from 'react';
import { LegalTopic } from '../types';

interface SidebarProps {
  topics: LegalTopic[];
  onTopicSelect: (title: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ topics, onTopicSelect }) => {
  return (
    <aside className="hidden lg:flex w-80 flex-col bg-white border-right border-gray-200 h-full p-6 shadow-sm overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">আইনি বিষয়সমূহ</h2>
        <div className="space-y-3">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic.title)}
              className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-all border border-transparent hover:border-emerald-100 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">{topic.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-700 group-hover:text-emerald-800">{topic.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{topic.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 bg-emerald-900 rounded-2xl text-white">
        <h4 className="font-bold mb-1">প্রয়োজনীয় লিংক</h4>
        <ul className="text-xs space-y-2 opacity-80">
          <li><a href="http://bdlaws.minlaw.gov.bd/" target="_blank" className="underline hover:opacity-100">বাংলাদেশ লজ (BD Laws)</a></li>
          <li><a href="https://supremecourt.gov.bd/" target="_blank" className="underline hover:opacity-100">সুপ্রিম কোর্ট অফ বাংলাদেশ</a></li>
          <li><a href="https://bangladesh.gov.bd" target="_blank" className="underline hover:opacity-100">বাংলাদেশ জাতীয় তথ্য বাতায়ন</a></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
