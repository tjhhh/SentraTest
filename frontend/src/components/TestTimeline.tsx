import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestStep {
  type: string;
  description: string;
  status: 'pending' | 'success' | 'failure';
}

interface TestTimelineProps {
  steps: TestStep[];
}

export const TestTimeline: React.FC<TestTimelineProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <History className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interaction Timeline</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
        {steps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <History className="w-8 h-8 opacity-20" />
            <p className="text-xs italic">No interactions recorded.</p>
          </div>
        ) : (
          steps.map((step, i) => (
            <div 
              key={i} 
              className="flex gap-3 group animate-in fade-in slide-in-from-left-2 duration-300" 
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                  step.status === 'success' ? "bg-emerald-100 text-emerald-600" : 
                  step.status === 'failure' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
                )}>
                  {step.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                   step.status === 'failure' ? <span className="text-xs font-bold">!</span> :
                   <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>
                {i !== steps.length - 1 && <div className="w-px h-full bg-slate-100 my-1" />}
              </div>
              <div className="pb-4">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{step.type}</span>
                <p className="text-sm text-slate-700 font-medium leading-tight">{step.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
