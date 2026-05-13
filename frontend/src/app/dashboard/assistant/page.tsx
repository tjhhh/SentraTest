'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Zap,
  Loader2,
  Plus,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  time: string;
}

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

export default function AssistantPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const activeConversation = chats.find(c => c.id === chatId) || null;
  const BUG_TEMPLATE = 'Please describe the bug you would like analyzed.';
  const STRATEGY_TEMPLATE = 'Please suggest a testing strategy for the current scenario.';
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chats on mount
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      api.get<Chat[]>('/chats')
        .then(data => {
          setChats(data);
        })
        .catch(err => {
          console.error("Failed to fetch chats", err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  // Create chat if none exists
  useEffect(() => {
    if (user?.id && !chatId) {
      setIsLoading(true);
      api.post<{ id: string; welcomeMessage: string }>('/chats', {})
        .then(data => {
          setChatId(data.id);
          setMessages([
            {
              role: 'assistant',
              content: data.welcomeMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          return api.get<Chat[]>('/chats');
        })
        .then(data => {
          if (data) setChats(data);
        })
        .catch(err => {
          console.error("Failed to create chat", err);
          setMessages([
            {
              role: 'assistant',
              content: "Hello! I'm your SentraTest AI Assistant. I failed to connect to the server, but I'm still here to help.",
              time: '10:00 AM'
            }
          ]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatId || !user?.id) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await api.post<{ assistantReply: string }>(`/chats/${chatId}/messages`, {
        content: input
      });

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.assistantReply || "No reply received.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Failed to send message", error);
      const errorMsg: Message = {
        role: 'assistant',
        content: "Sorry, I encountered an error while processing your request.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const loadChat = (id: string) => {
    setChatId(id);
    setIsLoading(true);
    api.get<any[]>(`/chats/${id}/messages`)
      .then(data => {
        const mappedMessages: Message[] = data.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(mappedMessages);
      })
      .catch(err => {
        console.error("Failed to load messages", err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
  };

  return (
    <div className="flex h-[calc(100vh-160px)] max-w-6xl mx-auto animate-in fade-in duration-500">

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Gemini Assistant</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {activeConversation ? activeConversation.title : 'Online & Ready to Help'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Clear Conversation"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-4 animate-in slide-in-from-bottom-2 duration-300",
                  msg.role === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  msg.role === 'assistant' ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-600"
                )}>
                  {msg.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "max-w-[80%] space-y-2",
                  msg.role === 'user' ? "items-end" : ""
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'assistant'
                      ? "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
                      : "bg-indigo-600 text-white rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                  <div className={cn(
                    "flex items-center gap-3 px-1",
                    msg.role === 'user' ? "flex-row-reverse" : ""
                  )}>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{msg.time}</span>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2">
                        <button className="text-slate-300 hover:text-indigo-500 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                        <button className="text-slate-300 hover:text-red-500 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Type your message here... (Shift+Enter for new line)"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 pr-32 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-24 shadow-sm"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <button
              onClick={() => setInput(BUG_TEMPLATE)}
              className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest group"
            >
              <Zap className="w-3 h-3 group-hover:animate-pulse" />
              Analyze Error
            </button>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <button
              onClick={() => setInput(STRATEGY_TEMPLATE)}
              className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest group"
            >
              <Sparkles className="w-3 h-3 group-hover:animate-pulse" />
              Suggest Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
