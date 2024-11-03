import React, { useState } from 'react';
import { CrawlerForm } from './components/CrawlerForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import type { AnalysisResult } from './types';

function App() {
  const [results, setResults] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Site Audit Tool
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and audit any website
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!results ? (
            <CrawlerForm onAnalysisComplete={setResults} />
          ) : (
            <ResultsDisplay results={results} onReset={() => setResults(null)} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;