'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  Code2, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Search, label: 'Blackbox Generator', href: '/blackbox' },
  { icon: Code2, label: 'Whitebox Generator', href: '/whitebox' },
  { icon: MessageSquare, label: 'AI Assistant', href: '/assistant' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Search className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SentraTest</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 font-medium" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-slate-800 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
        >
          <Settings className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          <span>Settings</span>
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/10 hover:text-red-400 transition-all group text-left"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
