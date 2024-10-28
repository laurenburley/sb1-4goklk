import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { WasteRecord, WasteType, DisposalMethod } from '../../types/sustainability';

interface WasteTrackerProps {
  wasteRecords: WasteRecord[];
  onWasteClick: (waste: WasteRecord) => void;
}

function WasteTracker({ wasteRecords, onWasteClick }: WasteTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterDisposal, setFilterDisposal] = useState<string>('');

  const filteredRecords = wasteRecords.filter(record => {
    const matchesSearch = 
      record.disposalPartner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || record.wasteType === filterType;
    const matchesDisposal = !filterDisposal || record.disposalMethod === filterDisposal;
    return matchesSearch && matchesType && matchesDisposal;
  });

  // Calculate diversion rate
  const totalWaste = wasteRecords.reduce((sum, record) => sum + record.amount, 0);
  const divertedWaste = wasteRecords
    .filter(record => record.disposalMethod !== DisposalMethod.LANDFILL)
    .reduce((sum, record) => sum + record.amount, 0);
  const diversionRate = (divertedWaste / totalWaste) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Waste</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {totalWaste.toLocaleString()} kg
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Diverted from Landfill</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {divertedWaste.toLocaleString()} kg
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Diversion Rate</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {diversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by disposal partner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            {Object.values(WasteType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filterDisposal}
            onChange={(e) => setFilterDisposal(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Methods</option>
            {Object.values(DisposalMethod).map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waste Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disposal Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr
                key={record.id}
                onClick={() => onWasteClick(record)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    record.wasteType === WasteType.ORGANIC ? 'bg-green-100 text-green-800' :
                    record.wasteType === WasteType.RECYCLABLE ? 'bg-blue-100 text-blue-800' :
                    record.wasteType === WasteType.HAZARDOUS ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.wasteType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.amount} {record.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    record.disposalMethod === DisposalMethod.RECYCLE ? 'bg-blue-100 text-blue-800' :
                    record.disposalMethod === DisposalMethod.COMPOST ? 'bg-green-100 text-green-800' :
                    record.disposalMethod === DisposalMethod.LANDFILL ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.disposalMethod}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.disposalPartner}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${record.cost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WasteTracker;