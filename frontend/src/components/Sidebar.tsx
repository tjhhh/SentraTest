'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Box, 
  Cpu, 
  Bug, 
  Settings, 
  LogOut, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Loader2
} from 'lucide-react';
import { useConversationStore } from '@/store/conversationStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Conversation } from '@/types/conversation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Assistant', href: '/dashboard/assistant', icon: MessageSquare },
  { label: 'Black Box', href: '/dashboard/blackbox', icon: Box },
  { label: 'White Box', href: '/dashboard/whitebox', icon: Cpu },
  { label: 'Bug Explainer', href: '/dashboard/bug-explainer', icon: Bug },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: Readonly<SidebarProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { 
    conversations, 
    activeConversation, 
    isLoading, 
    fetchConversations, 
    setActiveConversation, 
    createConversation, 
    renameConversation, 
    deleteConversation 
  } = useConversationStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
    return () => setIsMounted(false);
  }, []);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    onClose();
  }, [pathname]);

  const handleCreate = async () => {
    try {
      await createConversation('New Conversation');
      router.push('/dashboard/assistant');
    } catch (err) {
      console.error('Failed to create conversation', err);
    }
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await renameConversation(id, editTitle);
      setEditingId(null);
    } catch (err) {
      console.error('Failed to rename', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(id);
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
    setMenuOpenId(null);
  };

  const startEditing = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
    setMenuOpenId(null);
  };

  const handleConversationClick = (conv: Conversation) => {
    setActiveConversation(conv);
    
    const latestTestCase = conv.testCases?.[0];
    
    if (latestTestCase?.type === 'WHITEBOX') {
      router.push('/dashboard/whitebox');
    } else if (latestTestCase?.type.startsWith('BLACKBOX_')) {
      router.push('/dashboard/blackbox');
    } else {
      router.push('/dashboard/assistant');
    }
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLogoutModalOpen(false);
      await Promise.resolve(logout());
      addNotification({
        type: 'success',
        title: 'Sign Out Success',
        message: 'You have been successfully signed out.'
      });
      router.replace('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed', err);
      addNotification({
        type: 'error',
        title: 'Sign Out Failed',
        message: 'An error occurred while signing out. Please try again.'
      });
    }
  };

  const logoutModal = (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <button
        type="button"
        aria-label="Close logout modal"
        className="absolute inset-0"
        onClick={() => setIsLogoutModalOpen(false)}
      />
      <div
        className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-6"
      >
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Sign Out</h3>
          <p className="text-slate-400 text-sm">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmLogout}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-all shadow-lg shadow-red-900/20"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8 lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SentraTest</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                pathname === item.href 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40' 
                  : 'hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-h-0 border-t border-white/5 pt-4 px-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Recent Chats</h3>
          <button 
            onClick={handleCreate}
            className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pb-4">
          {isLoading && conversations.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
            </div>
          ) : (
            conversations.map((conv) => (
              <div key={conv.id} className="relative group">
                {editingId === conv.id ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-lg border border-indigo-500/50">
                    <input
                      autoFocus
                      className="bg-transparent border-none focus:outline-none text-sm w-full py-1 text-white"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(conv.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <button onClick={() => handleRename(conv.id)} className="p-1 text-green-400 hover:text-green-300">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-slate-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => handleConversationClick(conv)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all",
                      activeConversation?.id === conv.id 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                        : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <MessageSquare className={cn(
                        "w-4 h-4 shrink-0",
                        activeConversation?.id === conv.id ? 'text-indigo-400' : 'text-slate-500'
                      )} />
                      <span className="text-sm font-medium truncate">{conv.title}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                      }}
                      className={cn(
                        "p-1 rounded-md hover:bg-white/10 transition-all",
                        menuOpenId === conv.id ? 'opacity-100 bg-white/10' : 'opacity-0 lg:group-hover:opacity-100'
                      )}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {menuOpenId === conv.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 py-1">
                    <button 
                      onClick={() => startEditing(conv)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 text-slate-300 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Rename
                    </button>
                    <button 
                      onClick={() => handleDelete(conv.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 border-t border-white/5 mt-auto bg-slate-900/50 backdrop-blur-sm">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-sm font-medium mb-1">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

    </aside>
    {isLogoutModalOpen && isMounted && createPortal(logoutModal, document.body)}
    </>
  );
}
