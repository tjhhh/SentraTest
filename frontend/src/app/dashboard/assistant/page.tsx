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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useConversationStore } from '@/store/conversationStore';
import { conversationService } from '@/services/conversation.service';

export default function AssistantPage() {
  const { 
    messages, 
    setMessages, 
    sendMessage, 
    isLoading, 
    isStreaming, 
    error,
    activeConversation 
  } = useChat();
  
  const { setActiveConversation } = useConversationStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history when active conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      conversationService.getMessages(activeConversation.id)
        .then(hist => setMessages(hist))
        .catch(err => console.error('Failed to load messages', err));
    } else {
      setMessages([]);
    }
  }, [activeConversation?.id, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const content = input;
    setInput('');
    await sendMessage(content);
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="bg-white rounded-t-2xl border-x border-t border-slate-200 p-4 md:p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Bot className="text-white w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">
              {activeConversation?.title || 'Gemini Assistant'}
            </h1>
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full animate-pulse shrink-0",
                isStreaming ? "bg-amber-500" : "bg-green-500"
              )} />
              <span className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider truncate">
                {isStreaming ? 'Generating Response...' : 'Online'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setActiveConversation(null)}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all shrink-0"
          title="New Conversation"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 p-8">
            <Sparkles className="w-12 h-12 text-indigo-400" />
            <div>
              <p className="text-slate-900 font-bold">Start a new conversation</p>
              <p className="text-sm text-slate-500">Ask me anything about your test cases or strategies.</p>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div 
            key={msg.id || i} 
            className={cn(
              "flex gap-3 md:gap-4 animate-in slide-in-from-bottom-2 duration-300",
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
              "max-w-[90%] md:max-w-[85%] space-y-2",
              msg.role === 'USER' ? "items-end" : ""
            )}>
              <div className={cn(
                "p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm prose prose-slate max-w-none break-words",
                msg.role === 'ASSISTANT' 
                  ? "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100" 
                  : "bg-indigo-600 text-white rounded-tr-none prose-invert"
              )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
              <div className={cn(
                "flex items-center gap-3 px-1",
                msg.role === 'USER' ? "flex-row-reverse" : ""
              )}>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                  {formatTime(msg.createdAt)}
                </span>
                {msg.role === 'ASSISTANT' && (
                  <div className="flex items-center gap-2">
                    <button className="text-slate-300 hover:text-indigo-500 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                    <button className="text-slate-300 hover:text-red-500 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.content === '' && (
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

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-slate-50 border border-slate-200 rounded-b-2xl shadow-inner">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type your message here..."
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 md:py-4 pr-12 md:pr-32 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-20 md:h-24 shadow-sm disabled:opacity-50"
            disabled={isLoading && !isStreaming}
          />
          <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 flex items-center gap-1 md:gap-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 hidden md:block">
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || (isLoading && !isStreaming)}
              className="bg-indigo-600 text-white p-2 md:p-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100"
            >
              {isLoading && !isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="mt-3 md:mt-4 flex items-center justify-center gap-3 md:gap-6">
          <button className="flex items-center gap-1.5 md:gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest group">
            <Zap className="w-3 h-3 group-hover:animate-pulse" />
            <span className="hidden xs:inline">Analyze Error</span>
            <span className="xs:hidden">Analyze</span>
          </button>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <button className="flex items-center gap-1.5 md:gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest group">
            <Sparkles className="w-3 h-3 group-hover:animate-pulse" />
            <span className="hidden xs:inline">Suggest Strategy</span>
            <span className="xs:hidden">Suggest</span>
          </button>
        </div>
      </div>
    </div>
  );

}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}