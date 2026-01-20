
import React from 'react';
import { LegalTopic } from '../types';

interface SidebarProps {
  topics: LegalTopic[];
  onTopicSelect: (title: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ topics, onTopicSelect }) => {
  return (
    <aside className="hidden lg:flex w-[250px] flex-col bg-white border-r border-gray-200 h-full p-5 shadow-sm overflow-y-auto shrink-0">
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
          <span className="mr-2 text-sm">📁</span> আইনি বিষয়সমূহ
        </h2>
        <div className="space-y-1.5">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic.title)}
              className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 transition-all border border-transparent hover:border-emerald-100 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{topic.icon}</span>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-700 text-sm group-hover:text-emerald-800 truncate">{topic.title}</h3>
                  <p className="text-[10px] text-gray-400 line-clamp-1 group-hover:text-emerald-600">{topic.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl text-white shadow-lg">
        <h4 className="font-bold text-xs mb-3 flex items-center">
          <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
          লিংকসমূহ
        </h4>
        <ul className="text-[10px] space-y-2.5 opacity-90 font-medium">
          <li><a href="http://bdlaws.minlaw.gov.bd/" target="_blank" className="hover:text-emerald-300 transition-colors flex items-center"><span className="mr-1.5 text-emerald-500">▪</span> বাংলাদেশ লজ</a></li>
          <li><a href="https://supremecourt.gov.bd/" target="_blank" className="hover:text-emerald-300 transition-colors flex items-center"><span className="mr-1.5 text-emerald-500">▪</span> সুপ্রিম কোর্ট</a></li>
          <li><a href="https://bangladesh.gov.bd" target="_blank" className="hover:text-emerald-300 transition-colors flex items-center"><span className="mr-1.5 text-emerald-500">▪</span> জাতীয় বাতায়ন</a></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
