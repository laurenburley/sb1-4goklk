import React, { useState } from 'react';
import { Search, Filter, Calendar, Droplet } from 'lucide-react';
import { Barrel, BarrelStatus, BarrelType } from '../../types/barrelManagement';

interface BarrelListProps {
  barrels: Barrel[];
  onBarrelClick: (barrel: Barrel) => void;
}

function BarrelList({ barrels, onBarrelClick }: BarrelListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredBarrels = barrels.filter(barrel => {
    const matchesSearch = 
      barrel.barrelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barrel.currentFill?.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || barrel.type === filterType;
    const matchesStatus = !filterStatus || barrel.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getAgingDuration = (fillDate: string) => {
    const start = new Date(fillDate);
    const now = new Date();
    const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return years.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search barrels..."
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
            {Object.values(BarrelType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            {Object.values(BarrelStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarrels.map((barrel) => (
          <div
            key={barrel.id}
            onClick={() => onBarrelClick(barrel)}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Barrel #{barrel.barrelNumber}
                  </h3>
                  <p className="text-sm text-gray-500">{barrel.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  barrel.status === BarrelStatus.AGING ? 'bg-green-100 text-green-800' :
                  barrel.status === BarrelStatus.READY ? 'bg-amber-100 text-amber-800' :
                  barrel.status === BarrelStatus.MAINTENANCE ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {barrel.status}
                </span>
              </div>

              {barrel.currentFill && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Aging: {getAgingDuration(barrel.currentFill.fillDate)} years
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Droplet className="w-4 h-4 mr-2" />
                    Volume: {barrel.currentFill.currentVolume}L ({barrel.currentFill.currentAbv || barrel.currentFill.originalAbv}% ABV)
                  </div>
                  <div className="text-sm text-gray-500">
                    {barrel.currentFill.spiritType} - Batch {barrel.currentFill.batchNumber}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Location: {barrel.warehouse} - {barrel.rack}</span>
                  <span>Fills: {barrel.totalFills}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarrelList;