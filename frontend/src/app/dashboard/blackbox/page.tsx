'use client';

import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { 
  Search, 
  Settings2, 
  Play, 
  Download, 
  FileJson, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Code2,
  Copy,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversationStore } from '@/store/conversationStore';
import { bbService } from '@/services/bb.service';
import type { BBMethod } from '@/types/blackbox';

const testMethods = [
  { 
    id: 'bva', 
    name: 'Boundary Value Analysis (BVA)', 
    description: 'Fokus pada nilai di boundary input domains. Test min, min+1, max-1, max, dan edge cases.' 
  },
  { 
    id: 'eqp', 
    name: 'Equivalence Partitioning (EQP)', 
    description: 'Bagi input menjadi valid dan invalid partitions. Test satu representative per partition.' 
  },
  { 
    id: 'dt', 
    name: 'Decision Table (DT)', 
    description: 'Test kombinasi multiple conditions dan actions. Ideal untuk complex business logic.' 
  },
];

const methodCodeMap: Record<'bva' | 'eqp' | 'dt', BBMethod> = {
  bva: 'BVA',
  eqp: 'EQP',
  dt: 'DT',
};

export default function BlackboxPage() {
  const { activeConversation } = useConversationStore();

  const [requirement, setRequirement] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bva');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [rawTestCases, setRawTestCases] = useState<any[]>([]);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptCopyFeedback, setScriptCopyFeedback] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      await Promise.resolve();
      // Reset state before loading new conversation
      setRequirement('');
      setSelectedMethod('bva');
      setResults([]);

      if (!activeConversation) return;

      try {
        setIsGenerating(true);
        const history = await bbService.getHistory(activeConversation.id);
        
        if (history && history.payload) {
          if (history.payload.requirement) {
            setRequirement(history.payload.requirement);
          }
          
          if (history.type) {
            const method = history.type.replace('BLACKBOX_', '').toLowerCase();
            setSelectedMethod(method);
          }

          if (history.payload.content && Array.isArray(history.payload.content.testCases)) {
            const loadedResults = history.payload.content.testCases.map((tc: any, index: number) => ({
              id: index + 1,
              case: tc.description || tc.scenario || `Test Case ${index + 1}`,
              input: typeof tc.inputs === 'object' ? JSON.stringify(tc.inputs, null, 2) : (tc.input || '-'),
              expected: tc.expectedOutput || tc.expectedResult || 'Expected Result',
              notes: tc.notes || '',
              status: 'Loaded'
            }));
            setRawTestCases(history.payload.content.testCases);
            setResults(loadedResults);
          } else {
            setRawTestCases([]);
            setResults([]);
          }
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setIsGenerating(false);
      }
    }

    loadHistory();
  }, [activeConversation]);

  const parseTestCases = (content: any) => {
    // If testCases is already an array, use it directly
    if (Array.isArray(content.testCases)) {
      return content.testCases.map((tc: any, index: number) => ({
        id: index + 1,
        case: tc.description || tc.scenario || `Test Case ${index + 1}`,
        input: typeof tc.inputs === 'object' ? JSON.stringify(tc.inputs, null, 2) : (tc.input || '-'),
        expected: tc.expectedOutput || tc.expectedResult || 'Expected Result',
        notes: tc.notes || '',
        status: 'Generated',
      }));
    }

    // Fallback: try to extract from raw text
    if (content.raw && typeof content.raw === 'string') {
      try {
        const parsed = JSON.parse(content.raw);
        if (Array.isArray(parsed.testCases)) {
          return parsed.testCases.map((tc: any, index: number) => ({
            id: index + 1,
            case: tc.description || tc.scenario || `Test Case ${index + 1}`,
            input: typeof tc.inputs === 'object' ? JSON.stringify(tc.inputs, null, 2) : (tc.input || '-'),
            expected: tc.expectedOutput || tc.expectedResult || 'Expected Result',
            notes: tc.notes || '',
            status: 'Generated',
          }));
        }
      } catch (e) {
        // Continue to display raw response
        return [{
          id: 1,
          case: "AI Response",
          input: "-",
          expected: content.raw.substring(0, 500) + (content.raw.length > 500 ? '...' : ''),
          notes: content.note || 'Raw response from AI',
          status: 'Raw',
        }];
      }
    }

    // Last resort: show error message
    return [{
      id: 1,
      case: "Format Error",
      input: "-",
      expected: content.note || "Response format tidak sesuai. Silakan coba lagi.",
      notes: '',
      status: 'Error',
    }];
  };

  const handleGenerate = async () => {
    if (!requirement) return;
    setIsGenerating(true);
    const methodCode = methodCodeMap[selectedMethod as keyof typeof methodCodeMap];

    try {
      const response = await bbService.generate({
        requirement,
        method: methodCode,
        conversationId: activeConversation?.id || undefined,
      });

      if (response && response.content) {
        // Store raw test cases for script generation
        if (Array.isArray(response.content.testCases)) {
          setRawTestCases(response.content.testCases);
        }
        
        const mappedResults = parseTestCases(response.content);
        setResults(mappedResults);
      }
    } catch (error) {
      console.error("Failed to generate test cases:", error);
      alert("Failed to generate test cases. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateScript = async () => {
    if (rawTestCases.length === 0) {
      alert("No test cases available. Generate test cases first.");
      return;
    }

    setIsGeneratingScript(true);
    const methodCode = methodCodeMap[selectedMethod as keyof typeof methodCodeMap];
    try {
      const response = await bbService.script({
        method: methodCode,
        testCases: rawTestCases,
      });

      if (response && response.script) {
        setGeneratedScript(response.script);
        setShowScriptModal(true);
      }
    } catch (error) {
      console.error("Failed to generate script:", error);
      alert("Failed to generate test script. Please try again.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript);
      setScriptCopyFeedback(true);
      setTimeout(() => setScriptCopyFeedback(false), 2000);
    } catch (error) {
      console.error("Failed to copy script:", error);
      alert("Failed to copy script to clipboard.");
    }
  };

  const handleDownloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedScript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `test-${selectedMethod}-${Date.now()}.spec.ts`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateCSV = () => {
    if (results.length === 0) {
      alert("No test cases to export. Generate test cases first.");
      return;
    }

    // Prepare CSV headers
    const headers = ['Test Case ID', 'Test Case Name', 'Mock Input', 'Expected Output', 'Notes', 'Status'];
    
    // Prepare CSV rows
    const rows = results.map((item) => [
      item.id,
      item.case,
      typeof item.input === 'string' ? item.input.replace(/"/g, '""') : item.input,
      typeof item.expected === 'string' ? item.expected.replace(/"/g, '""') : item.expected,
      typeof item.notes === 'string' ? item.notes.replace(/"/g, '""') : (item.notes || ''),
      item.status,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Add BOM for proper UTF-8 encoding
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    // Download CSV
    const element = document.createElement('a');
    const file = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `blackbox-testcases-${selectedMethod}-${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setShowExportModal(false);
    alert('Test cases exported as CSV successfully!');
  };

  const generateXLSX = async () => {
    if (results.length === 0) {
      alert("No test cases to export. Generate test cases first.");
      return;
    }

    try {
      setIsExporting(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Test Cases');

      worksheet.columns = [
        { header: 'Test Case ID', key: 'id', width: 12 },
        { header: 'Test Case Name', key: 'case', width: 28 },
        { header: 'Mock Input', key: 'input', width: 40 },
        { header: 'Expected Output', key: 'expected', width: 40 },
        { header: 'Notes', key: 'notes', width: 28 },
        { header: 'Status', key: 'status', width: 14 },
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' },
      };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

      results.forEach((item) => {
        worksheet.addRow({
          id: item.id,
          case: item.case,
          input: item.input,
          expected: item.expected,
          notes: item.notes || '',
          status: item.status,
        });
      });

      const metaSheet = workbook.addWorksheet('Metadata');
      metaSheet.columns = [
        { header: 'Property', key: 'property', width: 22 },
        { header: 'Value', key: 'value', width: 60 },
      ];

      const metaHeader = metaSheet.getRow(1);
      metaHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      metaHeader.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' },
      };

      metaSheet.addRow({ property: 'Method', value: selectedMethod.toUpperCase() });
      metaSheet.addRow({ property: 'Requirement', value: requirement || '-' });
      metaSheet.addRow({ property: 'Generated At', value: new Date().toISOString() });
      metaSheet.addRow({ property: 'Test Case Count', value: results.length });

      const buffer = await workbook.xlsx.writeBuffer();
      const file = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = `blackbox-testcases-${selectedMethod}-${Date.now()}.xlsx`;
      document.body.appendChild(element);
      element.click();
      element.remove();

      setShowExportModal(false);
      alert('Test cases exported as XLSX successfully!');
    } catch (error) {
      console.error('Failed to export XLSX:', error);
      alert('Failed to export as XLSX. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blackbox Test Generator</h1>
          <p className="text-slate-500">Generate test cases based on functional requirements using Gemini AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-indigo-600" />
                Feature Requirement
              </h2>
            </div>
            <div className="p-6">
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Paste your feature description or requirements here... (e.g., 'The age field must accept integers between 1 and 100.')"
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400"
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {selectedMethod === 'bva' && 'AI akan menganalisis boundary conditions dan edge cases secara otomatis.'}
                    {selectedMethod === 'eqp' && 'AI akan membagi input menjadi valid dan invalid partitions.'}
                    {selectedMethod === 'dt' && 'AI akan membuat decision matrix untuk kombinasi kondisi.'}
                  </span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!requirement || isGenerating}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Generate Test Cases</span>
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
                    onClick={handleGenerateScript}
                    disabled={results.length === 0 || isGeneratingScript}
                    className="flex items-center gap-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium px-3 py-1.5 rounded-lg"
                  >
                    {isGeneratingScript ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Code2 className="w-4 h-4" />
                        <span>Generate Test Script</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    disabled={results.length === 0}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="px-6 py-4 font-semibold min-w-max">Test Case</th>
                      <th className="px-6 py-4 font-semibold min-w-80">Mock Input</th>
                      <th className="px-6 py-4 font-semibold min-w-80">Expected</th>
                      <th className="px-6 py-4 font-semibold min-w-40">Notes</th>
                      <th className="px-6 py-4 font-semibold min-w-max">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.case}</td>
                        <td className="px-6 py-4 text-xs font-mono text-indigo-600 bg-slate-50 rounded whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                          {item.input}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 break-words max-h-40 overflow-y-auto">
                          {item.expected}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {item.notes || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap",
                            item.status === 'Error'
                              ? "text-red-700 bg-red-50"
                              : item.status === 'Raw'
                                ? "text-amber-700 bg-amber-50"
                                : "text-green-700 bg-green-50"
                          )}>
                            {item.status === 'Error' ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : item.status === 'Raw' ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {item.status}
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
            <h3 className="font-bold text-lg mb-2">💡 Testing Insight</h3>
            {selectedMethod === 'bva' && (
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Boundary Value Analysis menemukan ~40% defects terkait input processing. Fokus pada nilai min/max dan edge cases di luar batas.
              </p>
            )}
            {selectedMethod === 'eqp' && (
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Equivalence Partitioning mengurangi test cases dengan membagi domain menjadi partitions. Satu test per partisi sudah cukup.
              </p>
            )}
            {selectedMethod === 'dt' && (
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Decision Table ideal untuk logic kompleks dengan banyak kondisi. Test combinations of conditions mengungkap interaction bugs.
              </p>
            )}
            <div className="h-[2px] w-12 bg-indigo-500"></div>
          </div>
        </div>
      </div>

      {/* Test Script Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Generated Test Script</h3>
                  <p className="text-xs text-slate-500">Playwright TypeScript</p>
                </div>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto font-mono whitespace-pre-wrap break-words">
                {generatedScript}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-white flex items-center gap-3 justify-end sticky bottom-0">
              <button
                onClick={() => setShowScriptModal(false)}
                className="px-4 py-2 text-slate-700 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyScript}
                className={cn(
                  "px-4 py-2 font-medium rounded-lg transition-all flex items-center gap-2",
                  scriptCopyFeedback
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Copy className="w-4 h-4" />
                {scriptCopyFeedback ? "Copied!" : "Copy to Clipboard"}
              </button>
              <button
                onClick={handleDownloadScript}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Export Test Cases</h3>
                  <p className="text-xs text-slate-500">Choose export format</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3">
              <div className="bg-slate-50 p-4 rounded-lg text-center space-y-1">
                <p className="text-sm font-semibold text-slate-900">Test Cases: {results.length}</p>
                <p className="text-xs text-slate-600">Method: {selectedMethod.toUpperCase()}</p>
              </div>

              <button
                onClick={generateCSV}
                disabled={isExporting}
                className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors flex flex-col items-center justify-center gap-2"
              >
                <FileJson className="w-5 h-5" />
                <div className="text-center">
                  <p className="text-sm font-medium">Export as CSV</p>
                  <p className="text-xs text-blue-600">Comma-separated values (Excel compatible)</p>
                </div>
              </button>

              <button
                onClick={generateXLSX}
                disabled={isExporting}
                className="w-full px-4 py-3 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors flex flex-col items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-green-700/30 border-t-green-700 rounded-full animate-spin" />
                    <span className="text-sm">Generating...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-5 h-5" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Export as XLSX</p>
                      <p className="text-xs text-green-600">Excel spreadsheet format</p>
                    </div>
                  </>
                )}
              </button>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-slate-700 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
