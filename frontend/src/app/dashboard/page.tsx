import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  ArrowRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Test Cases', value: '1,284', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Successful Runs', value: '98.2%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Pending Reviews', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Active Projects', value: '8', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const recentTests = [
  { id: 1, name: 'Login Authentication Flow', type: 'Blackbox - BVA', status: 'Passed', time: '2 mins ago' },
  { id: 2, name: 'Checkout Logic Validation', type: 'Whitebox - Path', status: 'Passed', time: '1 hour ago' },
  { id: 3, name: 'API Rate Limiting Test', type: 'System', status: 'Failed', time: '3 hours ago' },
  { id: 4, name: 'User Profile Update', type: 'Blackbox - EQP', status: 'Passed', time: 'Yesterday' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, John!</h1>
          <p className="text-slate-500">Here's what's happening with your projects today.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Recent Test Executions</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentTests.map((test) => (
                <div key={test.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={test.status === 'Passed' ? 'text-green-500' : 'text-red-500'}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{test.name}</p>
                      <p className="text-xs text-slate-500">{test.type}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p>{test.time}</p>
                    <p className={test.status === 'Passed' ? 'text-green-600' : 'text-red-600'}>{test.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500 opacity-20 rotate-12" />
            <h2 className="text-lg font-bold mb-2 relative z-10">AI Assistant</h2>
            <p className="text-indigo-100 text-sm mb-4 relative z-10 leading-relaxed">
              Need help with your test strategy? Ask Gemini to analyze your requirements and suggest the best methods.
            </p>
            <Link 
              href="/dashboard/assistant"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors relative z-10"
            >
              Start Chatting
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/dashboard/blackbox" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
                <span className="text-sm text-slate-700">Generate BVA Test</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </Link>
              <Link href="/dashboard/whitebox" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
                <span className="text-sm text-slate-700">Scan Code for Coverage</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
