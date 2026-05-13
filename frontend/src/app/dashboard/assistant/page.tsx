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
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';

export default function AssistantPage() {
  const { messages, sendMessage, isLoading, isStreaming, activeConversation, setMessages } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="bg-white rounded-t-2xl border-x border-t border-slate-200 p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Bot className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Gemini Assistant</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                {activeConversation ? activeConversation.title : 'Online & Ready to Help'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          title="Clear Conversation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {isLoading && messages.length === 0 ? (
           <div className="flex items-center justify-center h-full">
             <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
           </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <Bot className="w-16 h-16 text-slate-200" />
            <p className="text-sm">Start a conversation by typing a message below.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div 
              key={msg.id || i} 
              className={cn(
                "flex gap-4 animate-in slide-in-from-bottom-2 duration-300",
                msg.role === 'USER' ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                msg.role === 'ASSISTANT' ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-600"
              )}>
                {msg.role === 'ASSISTANT' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={cn(
                "max-w-[80%] space-y-2",
                msg.role === 'USER' ? "items-end" : ""
              )}>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words",
                  msg.role === 'ASSISTANT' 
                    ? "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100" 
                    : "bg-indigo-600 text-white rounded-tr-none"
                )}>
                  {msg.content || (isStreaming && msg.role === 'ASSISTANT' ? '...' : '')}
                </div>
                <div className={cn(
                  "flex items-center gap-3 px-1",
                  msg.role === 'USER' ? "flex-row-reverse" : ""
                )}>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'ASSISTANT' && !isStreaming && (
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
        {isLoading && !isStreaming && messages.length > 0 && (
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

      <div className="p-6 bg-slate-50 border border-slate-200 rounded-b-2xl shadow-inner">
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
          <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest group">
            <Zap className="w-3 h-3 group-hover:animate-pulse" />
            Analyze Error
          </button>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest group">
            <Sparkles className="w-3 h-3 group-hover:animate-pulse" />
            Suggest Strategy
          </button>
        </div>
      </div>
    </div>
  );
}
