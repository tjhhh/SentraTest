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
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id?: string;
  role: 'assistant' | 'user';
  content: string;
  time: string;
  feedback?: 'up' | 'down';
}

const DEMO_USER_ID = "eaa9b63d-25bd-4e8f-adfd-73718053574c";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const BUG_TEMPLATE = "Tolong jelaskan error berikut:\n";
const STRATEGY_TEMPLATE = "Tolong berikan strategi pengujian untuk fitur:\n";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your SentraTest AI Assistant. I can help you with test strategies, explain bugs, or answer questions about your test cases. How can I help you today?",
      time: '10:00 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await fetch(`${API_BASE}/chats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: DEMO_USER_ID, title: 'New Conversation' })
        });
        if (res.ok) {
          const data = await res.json();
          setChatId(data.id);
          if (data.welcomeMessage) {
            setMessages([{ role: 'assistant', content: data.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
          }
        }
      } catch (err) {
        console.error('Failed to init chat:', err);
      }
    };
    if (!chatId) {
      initChat();
    }
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      let res;
      if (currentInput.startsWith(BUG_TEMPLATE.trim())) {
        const errorLog = currentInput.replace(BUG_TEMPLATE.trim(), '').trim();
        res = await fetch(`${API_BASE}/chats/${chatId}/explain-bug`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: DEMO_USER_ID, errorLog })
        });
      } else {
        res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: DEMO_USER_ID, content: currentInput })
        });
      }

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();

      let replyContent = '';
      if (data.explanation) {
        if (typeof data.explanation === 'string') {
          replyContent = data.explanation;
        } else if (typeof data.explanation === 'object') {
          const exp = data.explanation;
          replyContent = `Summary:\n${exp.summary || 'N/A'}\n\nError Explanation:\n${exp.errorExplanation || 'N/A'}\n\nPossible Causes:\n${exp.possibleCauses?.join('\n') || 'N/A'}\n\nDebugging Steps:\n${exp.debuggingSteps?.join('\n') || 'N/A'}`;
        } else {
          replyContent = JSON.stringify(data.explanation, null, 2);
        }
      } else {
        replyContent = data.assistantReply || 'No reply received';
      }

      if (replyContent) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: replyContent,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while communicating with the server. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
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
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Online & Ready to Help</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          title="Reset Conversation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, i) => (
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
        ))}
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
              disabled={!input.trim() || isTyping}
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
  );
}
