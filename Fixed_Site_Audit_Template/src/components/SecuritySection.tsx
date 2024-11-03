import React from 'react';
import { Security } from '../types/audit';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface Props {
  security: Security;
}

export const SecuritySection: React.FC<Props> = ({ security }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Security Analysis</h2>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          {security.ssl ? (
            <ShieldCheckIcon className="w-6 h-6 text-green-500" />
          ) : (
            <ShieldExclamationIcon className="w-6 h-6 text-red-500" />
          )}
          <span className="text-lg">
            SSL/TLS Status: <span className={security.ssl ? 'text-green-500' : 'text-red-500'}>
              {security.ssl ? 'Secure' : 'Not Secure'}
            </span>
          </span>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Security Protocols</h3>
          <div className="flex flex-wrap gap-2">
            {security.protocols.map((protocol, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {protocol}
              </span>
            ))}
          </div>
        </div>

        {security.vulnerabilities && security.vulnerabilities.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-red-600">Known Vulnerabilities</h3>
            <ul className="list-disc list-inside space-y-2">
              {security.vulnerabilities.map((vulnerability, index) => (
                <li key={index} className="text-red-600">
                  {vulnerability}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};