'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Play, 
  Settings, 
  Cpu, 
  CheckCircle2, 
  XCircle,
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
  const [code, setCode] = useState(`function calculateDiscount(price, type) {
  if (price > 100) {
    if (type === 'VIP') {
      return price * 0.8;
    }
    return price * 0.9;
  }
  return price;
}`);
  const [selectedCoverage, setSelectedCoverage] = useState('branch');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setOutput(prev => [...prev, '> Analysis complete. Identified 3 logical branches.']);
      setOutput(prev => [...prev, '> Generating Playwright script...']);
      setIsProcessing(false);
    }, 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput(prev => [...prev, '> Starting Playwright Runner...']);
    
    setTimeout(() => {
      setOutput(prev => [...prev, '[INFO] Running test case 1: Price > 100 & Type = VIP... PASS']);
      setOutput(prev => [...prev, '[INFO] Running test case 2: Price > 100 & Type != VIP... PASS']);
      setOutput(prev => [...prev, '[INFO] Running test case 3: Price <= 100... PASS']);
      setOutput(prev => [...prev, '> Execution Finished. Total: 3, Failed: 0.']);
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Whitebox Test Generator</h1>
        <p className="text-slate-500">Analyze source code and generate automated Playwright scripts.</p>
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
                <span className="ml-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source Code Editor</span>
              </div>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="p-0">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-6 bg-slate-900 text-indigo-300 font-mono text-sm outline-none resize-none leading-relaxed"
                spellCheck={false}
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
                  Generate Script
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
              <span className="text-xs text-slate-400">Lines: {code.split('\\n').length} | Language: JavaScript</span>
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
