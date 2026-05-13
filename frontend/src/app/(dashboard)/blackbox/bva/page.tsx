'use client';

import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import BVAInputForm from '@/components/blackbox/BVAInputForm';
import TestCasesTable from '@/components/blackbox/TestCasesTable';
import { parseApiResponse } from '@/lib/utils';

interface TestCase {
    id: string;
    name: string;
    input: Record<string, any>;
    expectedOutput: string;
    boundaryType: 'lower' | 'upper' | 'exact' | 'invalid';
    category: 'valid' | 'boundary' | 'invalid';
}

// Mock data untuk demo
const mockTestCases: TestCase[] = [
    {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
        name: 'Minimum valid age',
        input: { age: 18 },
        expectedOutput: 'Valid - At lower boundary',
        boundaryType: 'lower',
        category: 'boundary',
    },
    {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
        name: 'Maximum valid age',
        input: { age: 65 },
        expectedOutput: 'Valid - At upper boundary',
        boundaryType: 'upper',
        category: 'boundary',
    },
    {
        id: '3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
        name: 'Just below minimum',
        input: { age: 17 },
        expectedOutput: 'Invalid - Below minimum age',
        boundaryType: 'invalid',
        category: 'invalid',
    },
    {
        id: '4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9',
        name: 'Just above maximum',
        input: { age: 66 },
        expectedOutput: 'Invalid - Exceeds maximum age',
        boundaryType: 'invalid',
        category: 'invalid',
    },
    {
        id: '5e6f7g8h-9i0j-1k2l-3m4n-o5p6q7r8s9t0',
        name: 'Middle valid value',
        input: { age: 40 },
        expectedOutput: 'Valid - Within range',
        boundaryType: 'exact',
        category: 'valid',
    },
];

export default function BVAPage() {
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requirement, setRequirement] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (requirementText: string) => {
        setRequirement(requirementText);
        setIsLoading(true);
        setError(null);
        setTestCases([]);
        setShowResults(false);

        try {
            const response = await fetch("http://localhost:3001/api/bva/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requirement: requirementText,
                }),
            });

            const data = await parseApiResponse(response);

            console.log("API Response:", data);

            if (!data.success) {
                throw new Error(data.message || "Failed to generate test cases");
            }

            // Parse test cases from response
            let testCasesData = data.data;

            // If data is a string (JSON string), parse it
            if (typeof testCasesData === "string") {
                testCasesData = JSON.parse(testCasesData);
            }

            // Ensure it's an array
            if (!Array.isArray(testCasesData)) {
                throw new Error("Invalid response format - expected array of test cases");
            }

            // Format test cases to match TypeScript interface
            const formattedCases: TestCase[] = testCasesData.map((tc: any) => ({
                id: tc.id || Math.random().toString(36).substr(2, 9),
                name: tc.name || "Test Case",
                input: typeof tc.input === "string" ? JSON.parse(tc.input) : tc.input,
                expectedOutput: tc.expectedOutput || "",
                boundaryType: tc.boundaryType || "exact",
                category: tc.category || "valid",
            }));

            setTestCases(formattedCases);
            setShowResults(true);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            console.error("Error:", errorMessage);
            setError(errorMessage);
            setShowResults(false);
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
                            <Zap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Boundary Value Analysis</h1>
                    </div>
                    <p className="text-slate-600">Generate comprehensive BVA test cases using AI-powered requirement analysis</p>
                </div>
            </div>

            {/* Form */}
            <BVAInputForm onGenerate={handleGenerate} isLoading={isLoading} />

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <p className="font-semibold">Error: {error}</p>
                </div>
            )}

            {/* Results */}
            {showResults && (
                <TestCasesTable testCases={testCases} isLoading={isLoading} requirement={requirement} />
            )}
        </div>
    );
}
