
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-700 p-2 rounded-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">আইন-সেবা <span className="text-emerald-700">এআই</span></h1>
          <p className="text-xs text-gray-500">বাংলাদেশ লিগ্যাল অ্যাডভাইজার</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-xs font-medium text-gray-600">অনলাইন</span>
      </div>
    </header>
  );
};

export default Header;
