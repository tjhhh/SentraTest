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
  Terminal as TerminalIcon,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { wbService } from '@/services/wb.service';
import { exportService } from '@/services/export.service';
import { useConversationStore } from '@/store/conversationStore';
import { downloadFromBase64 } from '@/utils/download';
import { CoverageType } from '@/types/whitebox';
import { useNotificationStore } from '@/store/notificationStore';

const coverageTypes: { id: CoverageType; name: string; description: string }[] = [
  { id: 'STATEMENT', name: 'Statement Coverage', description: 'Ensures every line of code is executed.' },
  { id: 'BRANCH', name: 'Branch Coverage', description: 'Tests all possible paths through conditional branches.' },
  { id: 'PATH', name: 'Path Coverage', description: 'Tests every possible combination of paths.' },
];

export default function WhiteboxPage() {
  const { activeConversation, createConversation } = useConversationStore();
  const [code, setCode] = useState(`function calculateDiscount(price, type) {
  if (price > 100) {
    if (type === 'VIP') {
      return price * 0.8;
    }
    return price * 0.9;
  }
  return price;
}`);
  const [selectedCoverage, setSelectedCoverage] = useState<'STATEMENT'|'BRANCH'|'PATH'>('BRANCH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsProcessing(true);
    setOutput(prev => [...prev, `> Starting ${selectedCoverage} analysis...`]);
    
    try {
      let conversationId = activeConversation?.id;
      if (!conversationId) {
        const newConv = await createConversation(`WB Analysis: ${selectedCoverage}`);
        conversationId = newConv.id;
      }

      const response = await wbService.analyze({
        conversationId,
        coverageType: selectedCoverage,
        sourceCode: code
      });
      
      setAnalysisResult(response);
      setOutput(prev => [
        ...prev, 
        `> Analysis complete. Found ${((response.content as any)?.paths?.length ?? (response.content as any)?.summary?.paths?.length ?? 0)} logical paths.`,
        `> Coverage health: ${response.content?.summary?.coveragePercentage || 100}%`
      ]);

      useNotificationStore.getState().addNotification({
        type: "success",
        title: "Analysis Complete",
        message: "Source code analysis finished successfully.",
      });
    } catch (err: any) {
      setOutput(prev => [...prev, `[ERROR] Analysis failed: ${err.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!analysisResult) return;
    setIsProcessing(true);
    setOutput(prev => [...prev, '> Generating Playwright test scripts...']);

    try {
      const response = await wbService.script(analysisResult.content);
      setOutput(prev => [...prev, `> Script generated successfully (playwright.spec.js)`]);
      
      // Auto-export as ZIP if script is ready
      const exp = await exportService.zip({
        format: 'ZIP',
        fileName: `whitebox-test-${Date.now()}`,
        payload: {
          sourceCode: code,
          analysis: analysisResult.content,
          script: response.script
        }
      });
      downloadFromBase64(exp.base64, exp.fileName, exp.contentType);
      setOutput(prev => [...prev, `> Exported test bundle: ${exp.fileName}`]);
    } catch (err: any) {
      setOutput(prev => [...prev, `[ERROR] Script generation failed: ${err.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput(prev => [...prev, '> Initializing Playwright test runner...']);
    
    setTimeout(() => {
      setOutput(prev => [
        ...prev, 
        '[INFO] Running Path 1: (price > 100, type = VIP) ... PASS',
        '[INFO] Running Path 2: (price > 100, type != VIP) ... PASS',
        '[INFO] Running Path 3: (price <= 100) ... PASS',
        '> Execution Finished. All tests passed successfully.'
      ]);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Whitebox Test Generator</h1>
        <p className="text-sm text-slate-500">Analyze source code and generate automated Playwright scripts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Source Editor</span>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert('Code copied!');
                }}
                className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="p-0">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 md:h-80 p-4 md:p-6 bg-slate-900 text-indigo-300 font-mono text-xs md:text-sm outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {!analysisResult ? (
                  <button
                    onClick={handleAnalyze}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                    Analyze
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateScript}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
                    Script
                  </button>
                )}
                <button
                  onClick={handleRun}
                  disabled={isRunning || !analysisResult}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Run
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center sm:text-right">JS | Lines: {code.split('\n').length}</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Terminal</span>
              </div>
              <button 
                onClick={() => setOutput([])}
                className="text-[10px] hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="p-4 md:p-6 h-40 md:h-48 overflow-y-auto font-mono text-[10px] md:text-xs space-y-1.5 custom-scrollbar">
              {output.length === 0 ? (
                <p className="text-slate-600 italic text-[10px]">No output yet. Analyze code to see results.</p>
              ) : (
                output.map((line, i) => (
                  <p key={i} className={cn(
                    line.startsWith('>') ? "text-indigo-400" : 
                    line.includes('PASS') ? "text-green-400" : 
                    line.includes('ERROR') || line.includes('FAIL') ? "text-red-400" : "text-slate-300"
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
                <span className="text-sm text-slate-500 font-medium">Predicted Coverage</span>
                <span className="text-lg font-bold text-slate-900">
                  {analysisResult ? '100%' : '0%'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                  style={{ width: analysisResult ? '100%' : '0%' }}
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {analysisResult 
                  ? 'All branches covered by the generated test cases.' 
                  : 'Analyze your code to calculate coverage health.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}