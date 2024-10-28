import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Sample, SampleStatus } from '../../types/quality';

interface SampleListProps {
  samples: Sample[];
  onSampleClick: (sample: Sample) => void;
}

function SampleList({ samples, onSampleClick }: SampleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = 
      sample.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || sample.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by batch number or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Status</option>
          {Object.values(SampleStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collection Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Storage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSamples.map((sample) => (
              <tr
                key={sample.id}
                onClick={() => onSampleClick(sample)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {sample.productName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Batch: {sample.batchNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(sample.collectionDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    By: {sample.collectedBy}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {sample.storageLocation}
                  </div>
                  <div className="text-sm text-gray-500">
                    {sample.storageConditions.temperature}°C
                    {sample.storageConditions.humidity && 
                      ` / ${sample.storageConditions.humidity}% RH`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${sample.status === SampleStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                      sample.status === SampleStatus.IN_TESTING ? 'bg-yellow-100 text-yellow-800' :
                      sample.status === SampleStatus.DISPOSED ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'}`}>
                    {sample.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sample.expirationDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SampleList;