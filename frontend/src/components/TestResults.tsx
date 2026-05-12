'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';

export interface TestResult {
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted' | 'pending';
  duration: number;
  error?: {
    message: string;
    stack?: string;
  } | null;
}

export interface TestStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

interface TestResultsProps {
  results: {
    stats: TestStats;
    tests: TestResult[];
  } | null;
  onSelectTestCase?: (title: string) => void;
}

const TestCaseItem = ({ test, onSelect }: { test: TestResult; onSelect?: (title: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-400 animate-pulse" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div 
        className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => {
          setIsOpen(!isOpen);
          if (onSelect) onSelect(test.title);
        }}
      >
        <div className="flex items-center gap-3">
          {test.error ? (
            isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <div className="w-4" />
          )}
          {getStatusIcon(test.status)}
          <span className="font-medium text-gray-700">{test.title}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <Clock className="w-3 h-3" />
          {(test.duration / 1000).toFixed(2)}s
        </div>
      </div>
      
      {isOpen && test.error && (
        <div className="bg-red-50 p-4 border-l-4 border-red-500 mx-3 mb-3 rounded-r-md">
          <div className="text-sm font-bold text-red-800 mb-1">Error: {test.error.message.split('\n')[0]}</div>
          <pre className="text-xs text-red-700 overflow-x-auto whitespace-pre-wrap font-mono mt-2">
            {test.error.stack || test.error.message}
          </pre>
        </div>
      )}
    </div>
  );
};

export default function TestResults({ results, onSelectTestCase }: TestResultsProps) {
  if (!results || !results.stats || !results.tests) return null;

  const { stats, tests } = results;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          Test Summary
        </h3>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total</div>
            <div className="text-xl font-bold text-blue-800">{stats.total}</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600 font-medium uppercase tracking-wider">Passed</div>
            <div className="text-xl font-bold text-green-800">{stats.passed}</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-xs text-red-600 font-medium uppercase tracking-wider">Failed</div>
            <div className="text-xl font-bold text-red-800">{stats.failed}</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wider">Time</div>
            <div className="text-xl font-bold text-gray-800">{(stats.duration / 1000).toFixed(1)}s</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tests.map((test, idx) => (
          <TestCaseItem key={idx} test={test} onSelect={onSelectTestCase} />
        ))}
      </div>
    </div>
  );
}
