'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Settings2, 
  Play, 
  Download, 
  FileJson, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { bbService } from '@/services/bb.service';
import { exportService } from '@/services/export.service';
import { useConversationStore } from '@/store/conversationStore';
import { downloadFromBase64 } from '@/utils/download';
import { BBMethod } from '@/types/blackbox';
import { useNotificationStore } from '@/store/notificationStore';

const testMethods: { id: BBMethod; name: string; description: string }[] = [
  { id: 'BVA', name: 'Boundary Value Analysis (BVA)', description: 'Focuses on values at the boundaries of input domains.' },
  { id: 'EQP', name: 'Equivalence Partitioning (EQP)', description: 'Divides input data into partitions of equivalent data.' },
  { id: 'DT', name: 'Decision Table (DT)', description: 'Ideal for complex business logic with multiple conditions.' },
];

export default function BlackboxPage() {
  const { activeConversation, createConversation } = useConversationStore();
  const [requirement, setRequirement] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<BBMethod>('BVA');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!requirement) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      let conversationId = activeConversation?.id;
      
      if (!conversationId) {
        const newConv = await createConversation(`BB: ${requirement.slice(0, 20)}...`);
        conversationId = newConv.id;
      }

      const response = await bbService.generate({
        conversationId,
        method: selectedMethod,
        requirement
      });
      
      // Access data from response.content
      const newResults = response.content?.testCases || response.content?.scenarios || [];
      setResults(newResults);

      useNotificationStore.getState().addNotification({
        type: "success",
        title: "Generation Complete",
        message: `Successfully generated ${newResults.length} test cases.`,
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate test cases.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'JSON' | 'PDF') => {
    if (results.length === 0) return;
    setIsExporting(true);
    try {
      const service = format === 'JSON' ? exportService.json : exportService.pdf;
      const res = await service({
        format,
        fileName: `blackbox-results-${Date.now()}`,
        payload: {
          requirement,
          method: selectedMethod,
          testCases: results
        }
      });
      downloadFromBase64(res.base64, res.fileName, res.contentType);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Failed to export results.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Blackbox Test Generator</h1>
          <p className="text-sm text-slate-500">Generate test cases based on functional requirements using Gemini AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 text-sm md:text-base">
                <FileJson className="w-5 h-5 text-indigo-600" />
                Feature Requirement
              </h2>
            </div>
            <div className="p-4 md:p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Paste your feature description or requirements here..."
                className="w-full h-40 md:h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm md:text-base text-slate-700 placeholder:text-slate-400"
              />
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Gemini AI will analyze constraints automatically.</span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!requirement || isGenerating}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100 text-sm md:text-base"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {results.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Generated Results</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleExport('JSON')}
                    disabled={isExporting}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Export JSON
                  </button>
                  <button 
                    onClick={() => handleExport('PDF')}
                    disabled={isExporting}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Export PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Test Case</th>
                      <th className="px-6 py-4 font-semibold">Mock Input</th>
                      <th className="px-6 py-4 font-semibold">Expected</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.title || item.case}</td>
                        <td className="px-6 py-4 text-sm font-mono text-indigo-600">{item.input || JSON.stringify(item.payload)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.expected}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Generated
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-600" />
              Generation Method
            </h2>
            <div className="space-y-3">
              {testMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200",
                    selectedMethod === method.id
                      ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <p className={cn(
                    "font-semibold text-sm",
                    selectedMethod === method.id ? "text-indigo-700" : "text-slate-900"
                  )}>
                    {method.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {method.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-2">Did You Know?</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Boundary Value Analysis (BVA) typically finds 40% of all software defects related to input processing.
            </p>
            <div className="h-[2px] w-12 bg-indigo-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}