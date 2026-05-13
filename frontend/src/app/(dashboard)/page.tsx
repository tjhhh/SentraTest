'use client';

import React from 'react';
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

  const displayStats = [
    { label: 'Total Test Cases', value: apiStats?.totalTestCases || '0', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Successful Runs', value: apiStats?.successRate || '0%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Reviews', value: apiStats?.pendingReviews || '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Projects', value: apiStats?.activeProjects || '1', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time metrics from your automated testing suites.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">LIVE</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900 tracking-tight">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h2 className="font-bold text-slate-900 tracking-tight">Recent Test Executions</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">View All</button>
            </div>
            <div className="divide-y divide-slate-100 min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm font-medium">Fetching latest activity...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <FileText className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No test executions found yet.</p>
                  <p className="text-xs mt-1">Run a whitebox or blackbox test to see activity here.</p>
                </div>
              ) : (
                recentActivity.map((execution) => (
                  <div key={execution.id} className="p-5 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-xl",
                        execution.exitCode === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-red-600"
                      )}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                          Test Case #{execution.testCaseId.split('-')[0]}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {execution.testCase.type} • {execution.testCase.coverageType || 'Default'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">
                        {execution.createdAt ? formatDistanceToNow(new Date(execution.createdAt)) + ' ago' : 'Just now'}
                      </p>
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest mt-1",
                        execution.exitCode === 0 ? "text-emerald-600" : "text-rose-600"
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
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-400 opacity-20 rotate-12 group-hover:scale-110 transition-transform duration-500" />
            <h2 className="text-xl font-black mb-3 relative z-10 tracking-tight">AI Assistant</h2>
            <p className="text-indigo-100 text-sm mb-6 relative z-10 leading-relaxed font-medium">
              Need help with your test strategy? Ask Gemini to analyze your requirements and suggest the best methods.
            </p>
            <Link 
              href="/assistant"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all relative z-10 shadow-sm"
            >
              Start Chatting
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-5 tracking-tight">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/blackbox" className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 group">
                <span className="text-sm font-semibold text-slate-700">Generate BVA Test</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/whitebox" className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 group">
                <span className="text-sm font-semibold text-slate-700">Scan Code for Coverage</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
