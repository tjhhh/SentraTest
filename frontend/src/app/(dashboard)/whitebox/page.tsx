'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Settings, 
  Cpu, 
  CheckCircle2, 
  Loader2,
  Copy,
  Terminal as TerminalIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const coverageTypes = [
  { id: 'statement', name: 'Statement Coverage', description: 'Ensures every line of code is executed.' },
  { id: 'branch', name: 'Branch Coverage', description: 'Tests all possible paths through conditional branches.' },
  { id: 'path', name: 'Path Coverage', description: 'Tests every possible combination of paths.' },
];

export default function WhiteboxPage() {
  const [logicCode, setLogicCode] = useState(`function calculateDiscount(price, type) {
  if (price > 100) {
    if (type === 'VIP') {
      return price * 0.8;
    }
    return price * 0.9;
  }
  return price;
}`);
  const [uiCode, setUiCode] = useState(`<button id="calculate-btn">Calculate</button>
<div id="result"></div>`);
  const [selectedCoverage, setSelectedCoverage] = useState('branch');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const handleProcess = async () => {
    setIsProcessing(true);
    setOutput(['> Analysis starting...', '> Sending logic and UI code to Gemini API...']);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/whitebox/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logicCode, uiCode, coverageType: selectedCoverage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.error || 'Failed to generate script');
      }

      const data = await response.json();
      setOutput(prev => [...prev, '> Analysis complete. UI-aware Playwright script generated.']);
      console.log('Generated Script:', data.script);
    } catch (error: any) {
      console.error(error);
      setOutput(prev => [...prev, `[ERROR] ${error.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(prev => [...prev, '> Starting Playwright Runner...']);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/whitebox/run`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to run tests');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        setOutput(prev => [...prev, ...lines]);
      }
    } catch (error: any) {
      console.error(error);
      setOutput(prev => [...prev, `[ERROR] ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Universal Whitebox Sandbox</h1>
        <p className="text-slate-500">Analyze logic and UI to generate automated interaction tests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Logic (JavaScript)</span>
              </div>
            </div>
            <div className="p-0">
              <textarea
                value={logicCode}
                onChange={(e) => setLogicCode(e.target.value)}
                className="w-full h-48 p-6 bg-slate-900 text-indigo-300 font-mono text-sm outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
            
            <div className="p-4 border-b border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-400" />
                </div>
                <span className="ml-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">UI (HTML / Framework Snippets)</span>
              </div>
            </div>
            <div className="p-0">
              <textarea
                value={uiCode}
                onChange={(e) => setUiCode(e.target.value)}
                className="w-full h-48 p-6 bg-slate-800 text-emerald-300 font-mono text-sm outline-none resize-none leading-relaxed"
                spellCheck={false}
                placeholder="Paste HTML or Framework snippets here..."
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                  Generate Interaction Script
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning || output.length === 0}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Run Tests
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center gap-2 text-slate-400">
              <TerminalIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Execution Terminal</span>
            </div>
            <div className="p-6 h-48 overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar">
              {output.length === 0 ? (
                <p className="text-slate-600 italic">No output yet. Process code to see results.</p>
              ) : (
                output.map((line, i) => (
                  <p key={i} className={cn(
                    line.startsWith('>') ? "text-indigo-400" : 
                    line.includes('PASS') ? "text-green-400" : 
                    line.includes('FAIL') ? "text-red-400" : "text-slate-300"
                  )}>
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              Coverage Settings
            </h2>
            <div className="space-y-3">
              {coverageTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedCoverage(type.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200",
                    selectedCoverage === type.id
                      ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <p className={cn(
                    "font-semibold text-sm",
                    selectedCoverage === type.id ? "text-indigo-700" : "text-slate-900"
                  )}>
                    {type.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Test Health
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-500 font-medium">Branch Coverage</span>
                <span className="text-lg font-bold text-slate-900">85%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[85%] rounded-full transition-all duration-1000" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Increase coverage by adding tests for the remaining 2 unvisited branches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
