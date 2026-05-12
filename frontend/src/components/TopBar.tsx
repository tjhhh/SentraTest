'use client';

import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 lg:hidden text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative flex-1 max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for test cases..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative text-slate-500 hover:text-indigo-600 transition-colors hidden xs:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'QA Engineer'}</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm md:text-base">
            {user?.name?.[0].toUpperCase() || <User className="w-4 h-4 md:w-5 md:h-5" />}
          </div>
        </div>
      </div>
    </header>
  );
}
