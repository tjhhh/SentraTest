'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  ArrowRight,
  Zap,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { stats: apiStats, recentActivity, isLoading } = useDashboardStats();
  const [selectedExecution, setSelectedExecution] = useState<any>(null);

  const displayStats = [
    { label: 'Total Test Cases', value: apiStats?.totalTestCases || '0', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Successful Runs', value: apiStats?.successRate || '0%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Reviews', value: apiStats?.pendingReviews || '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Projects', value: apiStats?.activeProjects || '1', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Detail Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl shadow-sm",
                  selectedExecution.exitCode === 0 ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                )}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-2xl text-slate-900 tracking-tight">Execution Details</h2>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    {selectedExecution.testCase.type} • {selectedExecution.testCase.coverageType || 'DEFAULT'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedExecution(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900"
              >
                <Plus className="w-8 h-8 rotate-45" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</span>
                  <p className={cn(
                    "text-xl font-black mt-1",
                    selectedExecution.exitCode === 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {selectedExecution.exitCode === 0 ? 'SUCCESSFUL RUN' : 'EXECUTION FAILED'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Run At</span>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    {formatDistanceToNow(new Date(selectedExecution.createdAt))} ago
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generated Test Script
                </h3>
                <div className="bg-slate-950 rounded-2xl p-8 overflow-x-auto border border-slate-800 shadow-2xl group relative">
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">PLAYWRIGHT SPEC</span>
                   </div>
                  <pre className="text-indigo-300 font-mono text-xs leading-relaxed">
                    {selectedExecution.testCase.payload?.script || '// No script source available in database'}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    Input Logic
                  </h3>
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-64 overflow-y-auto">
                    <pre className="text-indigo-100/70 font-mono text-[11px] leading-relaxed">
                      {selectedExecution.testCase.payload?.logicCode || '// Logic source missing'}
                    </pre>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    HTML Structure
                  </h3>
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-64 overflow-y-auto">
                    <pre className="text-emerald-100/70 font-mono text-[11px] leading-relaxed">
                      {selectedExecution.testCase.payload?.uiCode || '// UI snippet missing'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
               <Link 
                href="/dashboard/whitebox"
                className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                Open in Sandbox
              </Link>
              <button 
                onClick={() => setSelectedExecution(null)}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 font-medium italic">SentraTest Engine Status & Recent Reports.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-5">
              <div className={cn(stat.bg, stat.color, "p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-sm")}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full tracking-widest border border-emerald-100">LIVE</span>
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-slate-900 tracking-tighter">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-200" /> : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h2 className="font-black text-xl text-slate-900 tracking-tight">Recent Test Executions</h2>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-widest transition-colors">View All History</button>
            </div>
            <div className="divide-y divide-slate-100 min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-80 text-slate-400 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-200" />
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-300">Synchronizing with Postgres...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 text-slate-400 group">
                  <FileText className="w-16 h-16 mb-4 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-sm font-bold uppercase tracking-widest">No activity data found.</p>
                  <p className="text-xs mt-1 opacity-60">Run your first Whitebox test to populate this list.</p>
                </div>
              ) : (
                recentActivity.map((execution) => (
                  <div 
                    key={execution.id} 
                    onClick={() => setSelectedExecution(execution)}
                    className="p-6 hover:bg-indigo-50/30 transition-all flex items-center justify-between group cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "p-3 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform",
                        execution.exitCode === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-indigo-700 transition-colors tracking-tight text-lg">
                          Test Case #{execution.testCaseId.split('-')[0].toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                          {execution.testCase.type} • <span className="text-indigo-400">{execution.testCase.coverageType || 'BRANCH'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                        {execution.createdAt ? formatDistanceToNow(new Date(execution.createdAt)) + ' ago' : 'JUST NOW'}
                      </p>
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] mt-2 px-3 py-1 rounded-full border",
                        execution.exitCode === 0 
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
                          : "text-rose-600 bg-rose-50 border-rose-100"
                      )}>
                        {execution.exitCode === 0 ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <Zap className="absolute -right-8 -bottom-8 w-56 h-56 text-indigo-400 opacity-20 rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-700" />
            <h2 className="text-2xl font-black mb-4 relative z-10 tracking-tight">AI Assistant</h2>
            <p className="text-indigo-100 text-sm mb-8 relative z-10 leading-relaxed font-bold opacity-80">
              Need help with your test strategy? Ask Gemini to analyze your requirements and suggest the best methods.
            </p>
            <Link 
              href="/dashboard/assistant"
              className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-3.5 rounded-[1.2rem] text-sm font-black hover:bg-indigo-50 transition-all relative z-10 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Chatting
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <h2 className="font-black text-lg text-slate-900 mb-6 tracking-tight flex items-center gap-2">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link href="/dashboard/blackbox" className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 group">
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Generate BVA Test</span>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/dashboard/whitebox" className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 group">
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Scan Code for Coverage</span>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/dashboard/bug-explainer" className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 group">
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Explain Stack Trace</span>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
