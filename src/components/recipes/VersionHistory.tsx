import React, { useState } from 'react';
import { History, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { Recipe } from '../../types/recipe';

interface Version {
  version: number;
  date: string;
  author: string;
  changes: string[];
  recipe: Recipe;
}

interface VersionHistoryProps {
  recipeId: string;
  onClose: () => void;
}

// Mock data - replace with API calls
const mockVersions: Version[] = [
  {
    version: 2,
    date: '2024-03-15T14:30:00Z',
    author: 'John Smith',
    changes: [
      'Updated juniper quantity from 2.0kg to 2.5kg',
      'Adjusted maceration time to 24 hours',
    ],
    recipe: {} as Recipe, // Add mock recipe data as needed
  },
  {
    version: 1,
    date: '2024-03-01T09:00:00Z',
    author: 'John Smith',
    changes: ['Initial recipe creation'],
    recipe: {} as Recipe, // Add mock recipe data as needed
  },
];

function VersionHistory({ recipeId, onClose }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [versions] = useState<Version[]>(mockVersions);

  const handleRestore = (version: Version) => {
    // In a real app, implement version restoration logic
    console.log('Restoring version:', version.version);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <History className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="ml-3 text-xl font-semibold text-gray-900">Version History</h2>
        </div>

        <div className="space-y-6">
          {versions.map((version) => (
            <div
              key={version.version}
              className={`p-4 rounded-lg border ${
                selectedVersion?.version === version.version
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              } cursor-pointer`}
              onClick={() => setSelectedVersion(version)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Version {version.version}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(version.date).toLocaleString()} by {version.author}
                  </p>
                </div>
                {selectedVersion?.version === version.version && (
                  <button
                    onClick={() => handleRestore(version)}
                    className="flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Restore
                  </button>
                )}
              </div>
              {version.changes.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Changes:</h4>
                  <ul className="space-y-1">
                    {version.changes.map((change, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VersionHistory;