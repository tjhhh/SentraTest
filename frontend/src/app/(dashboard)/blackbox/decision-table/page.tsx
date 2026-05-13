'use client';

import React, { useState } from 'react';
import { Table } from 'lucide-react';
import DecisionTableInputForm from '@/components/blackbox/DecisionTableInputForm';
import DecisionTableDisplay from '@/components/blackbox/DecisionTableDisplay';
import { parseApiResponse } from '@/lib/utils';

export default function DecisionTablePage() {
  const [dtData, setDtData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (requirement: string) => {
    setIsLoading(true);
    setError(null);
    setDtData(null);

    try {
      const response = await fetch('http://localhost:3001/api/decision-table/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requirement }),
      });

      const result = await parseApiResponse(response);
      
      if (result.success) {
        const finalData = result.data.decisionTable || result.data;
        setDtData(finalData);
      } else {
        throw new Error(result.message || 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Table className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Decision Table Generator</h1>
          </div>
          <p className="text-slate-600">Analyze complex business rules and generate exhaustive logic combinations</p>
        </div>
      </div>

      {/* Input Form */}
      <DecisionTableInputForm onGenerate={handleGenerate} isLoading={isLoading} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <Table className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-bold">Generation Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      <DecisionTableDisplay data={dtData} isLoading={isLoading} />
    </div>
  );
}
