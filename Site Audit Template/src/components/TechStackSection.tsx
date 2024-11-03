import React from 'react';
import { TechnologyStack } from '../types/audit';

interface Props {
  stack: TechnologyStack;
}

export const TechStackSection: React.FC<Props> = ({ stack }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {stack.languages.map((lang, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Frameworks</h3>
          <div className="flex flex-wrap gap-2">
            {stack.frameworks.map((framework, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {framework}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Libraries</h3>
          <div className="flex flex-wrap gap-2">
            {stack.libraries.map((lib, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {lib}
              </span>
            ))}
          </div>
        </div>

        {stack.cms && (
          <div>
            <h3 className="text-lg font-medium mb-2">CMS</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {stack.cms}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};