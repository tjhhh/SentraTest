'use client';

import React, { useState } from 'react';
import { 
  Bug, 
  Terminal, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Trash2,
  Copy,
  ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { bugService } from '@/services/bug.service';
import { useNotificationStore } from '@/store/notificationStore';

export default function BugExplainerPage() {
  const [stackTrace, setStackTrace] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!stackTrace.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await bugService.explain({ stackTrace });
      setResult(response);
      
      useNotificationStore.getState().addNotification({
        type: "success",
        title: "Analysis Complete",
        message: "Gemini has successfully analyzed the bug.",
      });
    } catch (err: any) {
      console.error('Bug analysis error:', err);
      setError(err.message || 'Failed to analyze the bug. Please check your stack trace.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setStackTrace('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bug Explainer</h1>
        <p className="text-slate-500">Paste your error logs or stack traces to get AI-powered explanations and fixes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Error Log / Stack Trace</span>
              </div>
              <button 
                onClick={handleClear}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-0">
              <textarea
                value={stackTrace}
                onChange={(e) => setStackTrace(e.target.value)}
                placeholder="TypeError: Cannot read properties of undefined (reading 'map')..."
                className="w-full h-96 p-6 bg-slate-900 text-red-400 font-mono text-sm outline-none resize-none leading-relaxed placeholder:text-slate-700"
                spellCheck={false}
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Characters: {stackTrace.length}</span>
              <button
                onClick={handleExplain}
                disabled={!stackTrace.trim() || isAnalyzing}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Explain Bug</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {!result && !error && !isAnalyzing && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Bug className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="max-w-xs mx-auto">
                <h3 className="text-indigo-900 font-bold">No Analysis Yet</h3>
                <p className="text-indigo-700/60 text-sm mt-2">
                  Enter an error log on the left to let Gemini decode the root cause and provide solutions.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="text-red-900 font-bold">Analysis Failed</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-5 border-b border-slate-100 bg-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="font-bold">Gemini Analysis</h2>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result.content?.analysis || result.content?.explanation || '');
                    alert('Analysis copied!');
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 prose prose-slate max-w-none prose-sm prose-headings:text-slate-900 prose-p:text-slate-600 prose-code:text-indigo-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.content?.analysis || result.content?.explanation || 'No detailed analysis provided.'}
                </ReactMarkdown>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-6">
                <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolved
                </div>
                <button 
                  className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  onClick={() => window.open('https://stackoverflow.com/search?q=' + encodeURIComponent(stackTrace.slice(0, 50)), '_blank')}
                >
                  Search StackOverflow
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
