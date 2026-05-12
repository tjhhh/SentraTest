'use client';

import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Settings, 
  Cpu, 
  Loader2,
  Terminal as TerminalIcon,
  Eye,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TestTimeline } from '@/components/TestTimeline';
import { EvidenceGallery } from '@/components/EvidenceGallery';
import TestResults, { TestStats, TestResult } from '@/components/TestResults';

const coverageTypes = [
  { id: 'statement', name: 'Statement Coverage', description: 'Ensures every line of code is executed.' },
  { id: 'branch', name: 'Branch Coverage', description: 'Tests all possible paths through conditional branches.' },
  { id: 'path', name: 'Path Coverage', description: 'Tests every possible combination of paths.' },
];

interface TestStep {
  type: string;
  description: string;
  status: 'pending' | 'success' | 'failure';
}

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
  const [steps, setSteps] = useState<TestStep[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{ stats: TestStats; tests: TestResult[] } | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const sandboxSrcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; background: #f8fafc; }
            button { padding: 8px 16px; background: #4f46e5; color: white; border: none; rounded: 4px; cursor: pointer; }
            #result { margin-top: 10px; padding: 10px; background: white; border: 1px solid #e2e8f0; min-height: 20px; }
          </style>
        </head>
        <body>
          ${uiCode}
          <script>${logicCode}</script>
        </body>
      </html>
    `;
  }, [uiCode, logicCode]);

  const handleProcess = async () => {
    setIsProcessing(true);
    setSteps([]);
    setScreenshots([]);
    setTestResults(null);
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

      const envelope = await response.json();
      const data = envelope.data || envelope;
      
      if (data.testTitles) {
        setTestResults({
          stats: { total: data.testTitles.length, passed: 0, failed: 0, skipped: 0, duration: 0 },
          tests: data.testTitles.map((title: string) => ({ title, status: 'pending', duration: 0 }))
        });
      }

      setOutput(prev => [...prev, `> Analysis complete. ${data.testTitles?.length || 0} test cases generated.`]);
    } catch (error: any) {
      console.error(error);
      setOutput(prev => [...prev, `[ERROR] ${error.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setSteps([]);
    setScreenshots([]);
    setTestResults(null);
    setOutput(['> Starting Playwright Runner...']);
    
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
        const lines = chunk.split('\n');
        
        lines.forEach(line => {
          if (line.trim() === '') return;
          
          setOutput(prev => [...prev, line]);

          // Parse Steps
          const stepMatch = line.match(/\[STEP: (.*?)\] (.*)/);
          if (stepMatch) {
            setSteps(prev => [...prev, {
              type: stepMatch[1],
              description: stepMatch[2],
              status: 'success'
            }]);
          }

          // Detect Failures in Logs
          if (line.includes('✘') || line.includes('FAILED')) {
            setSteps(prev => {
              if (prev.length > 0) {
                const last = [...prev];
                last[last.length - 1].status = 'failure';
                return last;
              }
              return prev;
            });
          }

          // Parse Screenshots
          const evidenceMatch = line.match(/\[EVIDENCE: SCREENSHOTS\] (.*)/);
          if (evidenceMatch) {
            const files = evidenceMatch[1].split(',').filter(f => f.trim() !== '');
            if (files.length === 0 && steps.some(s => s.status === 'failure')) {
               setOutput(prev => [...prev, '[SYSTEM] No screenshots captured due to test failure.']);
            }
            setScreenshots(files);
          }

          // Parse JSON Results
          const resultMatch = line.match(/\[RESULT: JSON\] (.*)/);
          if (resultMatch) {
            try {
              const envelope = JSON.parse(resultMatch[1]);
              if (envelope.data && envelope.data.results) {
                setTestResults(envelope.data.results);
              } else {
                setTestResults(envelope);
              }
            } catch (err) {
              console.error('Failed to parse result JSON', err);
            }
          }
        });
      }
    } catch (error: any) {
      console.error(error);
      setOutput(prev => [...prev, `[ERROR] ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sentra Sandbox</h1>
          <p className="text-slate-500 mt-1">Visual Automated Testing for Logic & UI.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            Generate Tests
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning || output.length <= 2}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run Suite
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editors */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logic & UI Editor</span>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="h-1/2 border-b border-slate-100 relative">
                <span className="absolute top-3 right-4 text-[10px] font-bold text-slate-400 uppercase z-10 bg-slate-900/50 px-2 py-1 rounded text-white">JavaScript</span>
                <textarea
                  value={logicCode}
                  onChange={(e) => setLogicCode(e.target.value)}
                  className="w-full h-full p-6 bg-slate-900 text-indigo-300 font-mono text-sm outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
              <div className="h-1/2 relative">
                <span className="absolute top-3 right-4 text-[10px] font-bold text-slate-400 uppercase z-10 bg-slate-800/50 px-2 py-1 rounded text-white">HTML / UI</span>
                <textarea
                  value={uiCode}
                  onChange={(e) => setUiCode(e.target.value)}
                  className="w-full h-full p-6 bg-slate-800 text-emerald-300 font-mono text-sm outline-none resize-none leading-relaxed"
                  spellCheck={false}
                  placeholder="Paste UI snippet here..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              Coverage Settings
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {coverageTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedCoverage(type.id)}
                  className={cn(
                    "text-left p-3 rounded-xl border transition-all duration-200",
                    selectedCoverage === type.id
                      ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <p className={cn("font-semibold text-sm", selectedCoverage === type.id ? "text-indigo-700" : "text-slate-900")}>
                    {type.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Sandbox Preview</span>
            </div>
            <div className="flex-1 bg-slate-100 p-4">
              <iframe 
                srcDoc={sandboxSrcDoc}
                className="w-full h-full bg-white rounded-lg border border-slate-200 shadow-inner"
                title="Sandbox"
              />
            </div>
          </div>

          {testResults && (
            <div className="h-[400px]">
              <TestResults results={testResults} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[500px]">
              <TestTimeline steps={steps} />
            </div>
            <div className="h-[500px]">
              <EvidenceGallery screenshots={screenshots} />
            </div>
          </div>

          {/* Collapsible Terminal */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <button 
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="w-full p-4 flex items-center justify-between text-slate-400 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Full Execution Logs</span>
              </div>
              {isTerminalOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isTerminalOpen && (
              <div className="p-6 h-48 overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar border-t border-slate-800">
                {output.length === 0 ? (
                  <p className="text-slate-600 italic">Waiting for execution...</p>
                ) : (
                  output.map((line, i) => (
                    <p key={i} className={cn(
                      line.startsWith('>') ? "text-indigo-400" : 
                      line.includes('PASS') ? "text-green-400" : 
                      line.includes('FAIL') ? "text-red-400" : "text-slate-500"
                    )}>
                      {line}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}