import React from 'react';
import type { AnalysisResult } from '../types';

interface Props {
  results: AnalysisResult;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<Props> = ({ results, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            New Analysis
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Basic Information</h3>
            <p><strong>URL:</strong> {results.url}</p>
            <p><strong>Response Time:</strong> {results.responseTime}ms</p>
            <p><strong>Status:</strong> {results.status}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">SEO</h3>
            <p><strong>Title:</strong> {results.seo.title}</p>
            <p><strong>Description:</strong> {results.seo.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Security</h3>
            <p>
              <strong>HTTPS:</strong>{' '}
              <span className={results.security.https ? 'text-green-600' : 'text-red-600'}>
                {results.security.https ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </p>
            <p>
              <strong>HSTS:</strong>{' '}
              <span className={results.security.hsts ? 'text-green-600' : 'text-red-600'}>
                {results.security.hsts ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </p>
          </div>

          {results.technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {results.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};