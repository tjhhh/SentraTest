'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Settings2, 
  Play, 
  FileJson, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader,
  Table,
} from 'lucide-react';
import { cn, parseApiResponse } from '@/lib/utils';
import TestCasesTable from '@/components/blackbox/TestCasesTable';
import DecisionTableDisplay from '@/components/blackbox/DecisionTableDisplay';

const testMethods = [
  { id: 'bva', name: 'Boundary Value Analysis (BVA)', description: 'Focuses on values at the boundaries of input domains.' },
  { id: 'eqp', name: 'Equivalence Partitioning (EQP)', description: 'Divides input data into partitions of equivalent data.' },
  { id: 'dt', name: 'Decision Table (DT)', description: 'Ideal for complex business logic with multiple conditions.' },
];

export default function BlackboxPage() {
  const [requirement, setRequirement] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bva');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [dtResults, setDtResults] = useState<any>(null);

  const handleGenerate = async () => {
    if (!requirement.trim() || requirement.length < 50) {
      setError('Requirement must be at least 50 characters long');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults([]);
    setDtResults(null);

    try {
      const endpoint = selectedMethod === 'dt' 
        ? 'http://localhost:3001/api/decision-table/generate' 
        : 'http://localhost:3001/api/bva';
      
      const payload = selectedMethod === 'dt'
        ? { requirementText: requirement }
        : { requirement };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await parseApiResponse(response);

      if (!data.success) {
        throw new Error(data.message || 'Generation failed');
      }

      if (selectedMethod === 'dt') {
        setDtResults(data.data);
        // Also set results to something to trigger the "results view"
        setResults(data.data.testCases || []);
      } else {
        setResults(data.data);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Generation error:', errorMsg);
      setError(`Failed to generate test cases: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Blackbox <span className="text-indigo-600 font-black italic">GEN</span>
          </h1>
          <p className="text-slate-500 mt-1">Generate systematic test cases based on functional requirements using Gemini AI.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI Powered Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-indigo-600" />
                Feature Requirement
              </h2>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                requirement.length >= 50 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              )}>
                {requirement.length} / 2000
              </span>
            </div>
            <div className="p-8">
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value.slice(0, 2000))}
                placeholder="Paste your feature description or requirements here... (e.g., 'The age field must accept integers between 1 and 100.')"
                className="w-full h-48 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400 font-medium text-sm leading-relaxed"
              />
              <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                  <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    Our AI models specialize in identifying {selectedMethod.toUpperCase()} constraints. 
                    {requirement.length < 50 && " Enter at least 50 characters for best accuracy."}
                  </span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={requirement.length < 50 || isGenerating}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Analysing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Generate {selectedMethod.toUpperCase()} Cases</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-red-900 mb-1">Generation Failed</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
          )}

          {/* Results Section */}
          {selectedMethod === 'dt' && dtResults && !isGenerating && !error && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <DecisionTableDisplay data={dtResults} isLoading={false} />
            </div>
          )}

          {selectedMethod !== 'dt' && results.length > 0 && !isGenerating && !error && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <TestCasesTable testCases={results} isLoading={false} requirement={requirement} />
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && !error && results.length === 0 && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Awaiting Requirement</h3>
              <p className="text-slate-400 text-sm max-w-xs mt-2">
                Your generated test suite will appear here after AI processing.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-600" />
              Method Selection
            </h2>
            <div className="space-y-3">
              {testMethods.map((method) => {
                const isActive = selectedMethod === method.id;
                const isComingSoon = method.id === 'eqp';
                
                return (
                  <button
                    key={method.id}
                    onClick={() => !isComingSoon && setSelectedMethod(method.id)}
                    disabled={isComingSoon}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 relative group",
                      isActive && !isComingSoon
                        ? "bg-indigo-50 border-indigo-600 shadow-md shadow-indigo-100"
                        : isComingSoon
                        ? "bg-slate-50 border-slate-100 opacity-75"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={cn(
                        "font-bold text-sm tracking-tight",
                        isActive && !isComingSoon ? "text-indigo-900" : "text-slate-900"
                      )}>
                        {method.name}
                      </p>
                      {isActive && !isComingSoon && <CheckCircle2 className="w-4 h-4 text-indigo-600 animate-in zoom-in" />}
                      {isComingSoon && <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase tracking-tighter">Soon</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      {method.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-16 h-16" />
            </div>
            <h3 className="font-black text-xl mb-3 tracking-tight relative z-10">Did You Know?</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium relative z-10">
              Boundary Value Analysis (BVA) typically identifies <span className="text-indigo-400 font-bold">40%</span> of all input-related defects in production.
            </p>
            <div className="h-[4px] w-12 bg-indigo-500 rounded-full relative z-10"></div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl">
             <h3 className="font-bold text-lg mb-2">Export Results</h3>
             <p className="text-indigo-100 text-xs leading-relaxed mb-4 font-medium">
               Once generated, you can export your test cases to CSV format for further analysis.
             </p>
             <div className="flex gap-2">
                <div className="bg-white/10 p-2 rounded-lg"><FileSpreadsheet className="w-4 h-4" /></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
