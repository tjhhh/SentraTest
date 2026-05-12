'use client';

import React, { useState } from 'react';
import { Table, AlertCircle, Loader } from 'lucide-react';

interface DecisionTableInputFormProps {
  onGenerate: (requirement: string) => void;
  isLoading: boolean;
}

export default function DecisionTableInputForm({ onGenerate, isLoading }: DecisionTableInputFormProps) {
  const [requirement, setRequirement] = useState('');
  const [error, setError] = useState('');

  const charCount = requirement.length;
  const minChars = 50;
  const maxChars = 2000;
  const isValid = charCount >= minChars && charCount <= maxChars;

  const handleGenerate = () => {
    if (!isValid) {
      setError(`Please enter between ${minChars} and ${maxChars} characters`);
      return;
    }
    setError('');
    onGenerate(requirement);
  };

  const handleClear = () => {
    setRequirement('');
    setError('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Decision Table Testing</h2>
        <p className="text-slate-600 text-sm">Input your complex business logic requirements, and we'll generate a comprehensive Decision Table covering all logical paths.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Business Logic / Requirement
          </label>
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Example: If user is premium and has more than 100 points, offer 20% discount. If user is basic and has more than 100 points, offer 10% discount..."
            className="w-full h-40 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between mt-2">
            <div className={`text-xs font-medium ${charCount < minChars ? 'text-red-600' : charCount > maxChars ? 'text-orange-600' : 'text-green-600'}`}>
              {charCount}/{maxChars} characters
            </div>
            <div className="text-xs text-slate-500">
              {charCount < minChars ? `${minChars - charCount} more characters needed` : 'Ready to analyze'}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleGenerate}
            disabled={!isValid || isLoading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Analyzing Logic...</span>
              </>
            ) : (
              <>
                <Table className="w-4 h-4" />
                <span>Generate Decision Table</span>
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
