'use client';

import React, { useState } from 'react';
import { ChevronDown, Download, FileText, CheckCircle2, XCircle, Info } from 'lucide-react';

interface Condition {
  id: string;
  name: string;
  description: string;
}

interface Action {
  id: string;
  name: string;
  description: string;
}

interface DTTestCase {
  id: string;
  name: string;
  conditions: Record<string, boolean | string>;
  expectedActions: string[];
  description: string;
  category: string;
}

interface DecisionTableData {
  conditions: Condition[];
  actions: Action[];
  testCases: DTTestCase[];
}

interface DecisionTableDisplayProps {
  data: DecisionTableData;
  isLoading: boolean;
}

export default function DecisionTableDisplay({ data, isLoading }: DecisionTableDisplayProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Mapping logic combinations and generating Decision Table...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.testCases || data.testCases.length === 0) {
    return null;
  }

  const { conditions, actions, testCases } = data;

  return (
    <div className="space-y-8">
      {/* Logic Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conditions Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              Identified Conditions
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {conditions.map((cond) => (
                <li key={cond.id} className="flex items-start gap-3">
                  <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 min-w-[32px] text-center">
                    {cond.id.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cond.name}</p>
                    <p className="text-xs text-slate-500">{cond.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Expected Actions
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {actions.map((action) => (
                <li key={action.id} className="flex items-start gap-3">
                  <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 min-w-[32px] text-center">
                    {action.id.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{action.name}</p>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decision Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Truth Table & Combinations</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            {testCases.length} Rules Identified
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Rule</th>
                {conditions.map(c => (
                  <th key={c.id} className="px-4 py-3 text-center font-medium text-slate-700 bg-amber-50/30">
                    <span title={c.name}>{c.id.toUpperCase()}</span>
                  </th>
                ))}
                <th className="px-6 py-3 text-left font-medium text-slate-700 bg-indigo-50/30">Expected Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {testCases.map((tc, idx) => (
                <React.Fragment key={tc.id}>
                  <tr 
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${expandedId === tc.id ? 'bg-indigo-50/20' : ''}`}
                    onClick={() => setExpandedId(expandedId === tc.id ? null : tc.id)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedId === tc.id ? 'rotate-180' : ''}`} />
                        R{idx + 1}
                      </div>
                    </td>
                    {conditions.map(c => {
                      const val = tc.conditions[c.id];
                      return (
                        <td key={c.id} className="px-4 py-4 text-center">
                          {val === true ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                          ) : val === false ? (
                            <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                          ) : (
                            <span className="text-xs font-mono text-slate-600">{val || '-'}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tc.expectedActions.map(aid => (
                          <span key={aid} className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {aid.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                  {expandedId === tc.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={conditions.length + 2} className="px-8 py-4 border-t border-slate-100">
                        <div className="flex items-start gap-4">
                          <div className="bg-white p-3 rounded-lg border border-slate-200 flex-1 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rule Description</p>
                            <p className="text-sm text-slate-700">{tc.description}</p>
                          </div>
                          <div className="w-48 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              tc.category === 'error' ? 'bg-red-100 text-red-700' : 
                              tc.category === 'edge' ? 'bg-amber-100 text-amber-700' : 
                              'bg-green-100 text-green-700'
                            }`}>
                              {tc.category.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
        <button className="flex items-center gap-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors font-medium">
          <FileText className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>
    </div>
  );
}
