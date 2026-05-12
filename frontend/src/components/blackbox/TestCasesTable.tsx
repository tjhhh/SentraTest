'use client';

import React, { useState } from 'react';
import { ChevronDown, Download, FileText, Loader } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  input: Record<string, any>;
  expectedOutput: string;
  boundaryType: 'lower' | 'upper' | 'exact' | 'invalid';
  category: 'valid' | 'boundary' | 'invalid';
}

interface TestCasesTableProps {
  testCases: TestCase[];
  isLoading: boolean;
  requirement: string;
}

const boundaryTypeColors = {
  lower: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  upper: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  exact: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  invalid: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const categoryColors = {
  valid: 'bg-green-100 text-green-800',
  boundary: 'bg-amber-100 text-amber-800',
  invalid: 'bg-red-100 text-red-800',
};

export default function TestCasesTable({ testCases, isLoading, requirement }: TestCasesTableProps) {
  const [sortKey, setSortKey] = useState<keyof TestCase>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<'csv' | 'pdf' | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Analyzing requirement and generating test cases...</p>
        </div>
      </div>
    );
  }

  if (testCases.length === 0) {
    return null;
  }

  const handleSort = (key: keyof TestCase) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedTestCases = [...testCases].sort((a, b) => {
    const aVal = String(a[sortKey]);
    const bVal = String(b[sortKey]);
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(format);
    try {
      const response = await fetch('http://localhost:3001/api/bva/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement, testCases, format }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bva_testcases_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export test cases. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Test Cases</p>
          <p className="text-2xl font-bold text-slate-900">{testCases.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Boundary Cases</p>
          <p className="text-2xl font-bold text-slate-900">{testCases.filter(tc => tc.category === 'boundary').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Valid Cases</p>
          <p className="text-2xl font-bold text-slate-900">{testCases.filter(tc => tc.category === 'valid').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Invalid Cases</p>
          <p className="text-2xl font-bold text-slate-900">{testCases.filter(tc => tc.category === 'invalid').length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-slate-700 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('id')}>Test ID</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>Test Name</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Input</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Expected Output</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('boundaryType')}>Boundary Type</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('category')}>Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedTestCases.map((testCase) => (
                <React.Fragment key={testCase.id}>
                  <tr 
                    className={`hover:bg-slate-50 cursor-pointer ${expandedId === testCase.id ? 'bg-slate-50' : ''}`}
                    onClick={() => setExpandedId(expandedId === testCase.id ? null : testCase.id)}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{testCase.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{testCase.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {JSON.stringify(testCase.input).slice(0, 30)}...
                      </code>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{testCase.expectedOutput}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${boundaryTypeColors[testCase.boundaryType].text} ${boundaryTypeColors[testCase.boundaryType].bg} border ${boundaryTypeColors[testCase.boundaryType].border}`}>
                        {testCase.boundaryType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[testCase.category]}`}>
                        {testCase.category}
                      </span>
                    </td>
                  </tr>
                  {expandedId === testCase.id && (
                    <tr className="bg-slate-50 border-t border-slate-100">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg border border-slate-200">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Input Payload</p>
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-auto max-h-48 shadow-inner">
                              {JSON.stringify(testCase.input, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Behavior</p>
                            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                              <p className="text-sm text-slate-900 leading-relaxed">{testCase.expectedOutput}</p>
                            </div>
                            <div className="mt-4 flex gap-4">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Boundary Type</p>
                                <p className="text-sm font-semibold text-slate-700 capitalize">{testCase.boundaryType}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Risk Level</p>
                                <p className={`text-sm font-semibold ${testCase.category === 'invalid' ? 'text-red-600' : 'text-green-600'} capitalize`}>
                                  {testCase.category === 'invalid' ? 'High' : 'Low'}
                                </p>
                              </div>
                            </div>
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

      {/* Export Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={() => handleExport('csv')}
          disabled={isExporting !== null}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm disabled:opacity-50"
        >
          {isExporting === 'csv' ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Export CSV</span>
        </button>
        <button 
          onClick={() => handleExport('pdf')}
          disabled={isExporting !== null}
          className="flex items-center gap-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors font-medium disabled:opacity-50"
        >
          {isExporting === 'pdf' ? <Loader className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          <span>Export PDF</span>
        </button>
      </div>
    </div>
  );
}
