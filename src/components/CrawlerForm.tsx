import React, { useState } from 'react';
import type { AnalysisResult } from '../types';

interface Props {
  onAnalysisComplete: (results: AnalysisResult) => void;
}

interface ErrorDetails {
  message: string;
  details?: string;
}

export const CrawlerForm: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateUrl(url)) {
      setError({
        message: 'Invalid URL format',
        details: 'Please enter a valid URL including the protocol (http:// or https://)'
      });
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/.netlify/functions/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        setError({
          message: data.error || 'Failed to analyze URL',
          details: data.details || 'An unexpected error occurred'
        });
        return;
      }

      onAnalysisComplete(data);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError({
            message: 'Request timeout',
            details: 'The analysis took too long to complete. Please try again.'
          });
        } else {
          setError({
            message: 'Failed to analyze URL',
            details: err.message || 'Please try again or contact support if the problem persists'
          });
        }
      } else {
        setError({
          message: 'Failed to analyze URL',
          details: 'Please try again or contact support if the problem persists'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="url"
              id="url"
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-700 font-medium">{error.message}</p>
            {error.details && (
              <p className="text-red-600 text-sm mt-1">{error.details}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Site...
            </span>
          ) : (
            'Start Analysis'
          )}
        </button>
      </form>
    </div>
  );
};