import React from 'react';
import { Calendar, Droplet, Percent } from 'lucide-react';
import { Barrel } from '../../types/barrelManagement';

interface FillHistoryProps {
  barrel: Barrel;
}

function FillHistory({ barrel }: FillHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Current Fill */}
      {barrel.currentFill && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Current Fill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Spirit Type</p>
              <p className="mt-1">{barrel.currentFill.spiritType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Batch Number</p>
              <p className="mt-1">{barrel.currentFill.batchNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Fill Date</p>
              <p className="mt-1">{new Date(barrel.currentFill.fillDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Target Age</p>
              <p className="mt-1">{barrel.currentFill.targetAge} years</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Volume</p>
              <div className="mt-1 flex items-center space-x-2">
                <span>{barrel.currentFill.currentVolume}L</span>
                <span className="text-gray-500">
                  (Original: {barrel.currentFill.originalVolume}L)
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">ABV</p>
              <div className="mt-1 flex items-center space-x-2">
                <span>{barrel.currentFill.currentAbv}%</span>
                <span className="text-gray-500">
                  (Original: {barrel.currentFill.originalAbv}%)
                </span>
              </div>
            </div>
            {barrel.currentFill.notes && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700">Notes</p>
                <p className="mt-1 text-gray-600">{barrel.currentFill.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fill History */}
      {barrel.previousFills.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Fill History</h3>
          <div className="space-y-6">
            {barrel.previousFills.map((fill, index) => (
              <div
                key={index}
                className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Spirit Type</p>
                    <p className="mt-1">{fill.spiritType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Batch Number</p>
                    <p className="mt-1">{fill.batchNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="mt-1">
                      {new Date(fill.fillDate).toLocaleDateString()} - {new Date(fill.emptyDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Volume Change</p>
                    <p className="mt-1">
                      {fill.finalVolume}L / {fill.originalVolume}L
                      ({((fill.finalVolume / fill.originalVolume) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">ABV Change</p>
                    <p className="mt-1">
                      {fill.finalAbv}% / {fill.originalAbv}%
                      ({(fill.finalAbv - fill.originalAbv).toFixed(1)}%)
                    </p>
                  </div>
                  {fill.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Notes</p>
                      <p className="mt-1 text-gray-600">{fill.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FillHistory;