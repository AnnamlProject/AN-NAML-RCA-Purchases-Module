import React from 'react';
import { SearchIcon, BellIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions, items..."
              className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors">
                <BellIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
                <img
                    className="h-9 w-9 rounded-full object-cover"
                    src="https://i.pravatar.cc/150?u=nike-eka"
                    alt="User"
                />
                <div>
                    <div className="text-sm font-medium text-white">Nike Eka F.</div>
                    <div className="text-xs text-gray-400">Administrator</div>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
