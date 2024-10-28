import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { UnitOfMeasurement } from '../../types/recipe';

interface RecipeScalerProps {
  currentBatchSize: number;
  currentUnit: UnitOfMeasurement;
  onScale: (scaleFactor: number) => void;
  onCancel: () => void;
}

function RecipeScaler({ currentBatchSize, currentUnit, onScale, onCancel }: RecipeScalerProps) {
  const [newBatchSize, setNewBatchSize] = useState(currentBatchSize.toString());
  const [scaleMethod, setScaleMethod] = useState<'size' | 'factor'>('size');
  const [scaleFactor, setScaleFactor] = useState('1');

  const handleScale = () => {
    if (scaleMethod === 'size') {
      const factor = parseFloat(newBatchSize) / currentBatchSize;
      onScale(factor);
    } else {
      onScale(parseFloat(scaleFactor));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Scale className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="ml-3 text-xl font-semibold text-gray-900">Scale Recipe</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Batch Size
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentBatchSize}
                disabled
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
              />
              <span className="text-gray-700">{currentUnit}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scaling Method
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="size"
                  checked={scaleMethod === 'size'}
                  onChange={(e) => setScaleMethod(e.target.value as 'size' | 'factor')}
                  className="mr-2"
                />
                New Batch Size
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="factor"
                  checked={scaleMethod === 'factor'}
                  onChange={(e) => setScaleMethod(e.target.value as 'size' | 'factor')}
                  className="mr-2"
                />
                Scale Factor
              </label>
            </div>
          </div>

          {scaleMethod === 'size' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Batch Size
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={newBatchSize}
                  onChange={(e) => setNewBatchSize(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
                <span className="text-gray-700">{currentUnit}</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scale Factor
              </label>
              <input
                type="number"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                step="0.01"
                min="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a factor to multiply all quantities (e.g., 2 for double, 0.5 for half)
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleScale}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Scale Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeScaler;