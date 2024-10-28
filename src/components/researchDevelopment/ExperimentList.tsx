import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Experiment, ExperimentType, ExperimentStatus } from '../../types/researchDevelopment';

interface ExperimentListProps {
  experiments: Experiment[];
  onExperimentClick: (experiment: Experiment) => void;
}

function ExperimentList({ experiments, onExperimentClick }: ExperimentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredExperiments = experiments.filter(experiment => {
    const matchesSearch = 
      experiment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || experiment.type === filterType;
    const matchesStatus = !filterStatus || experiment.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search experiments..."
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
            {Object.values(ExperimentType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            {Object.values(ExperimentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiments.map((experiment) => (
          <div
            key={experiment.id}
            onClick={() => onExperimentClick(experiment)}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{experiment.name}</h3>
                  <p className="text-sm text-gray-500">{experiment.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  experiment.status === ExperimentStatus.IN_PROGRESS ? 'bg-green-100 text-green-800' :
                  experiment.status === ExperimentStatus.COMPLETED ? 'bg-blue-100 text-blue-800' :
                  experiment.status === ExperimentStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {experiment.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {experiment.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Start Date:</span>
                  <span>{new Date(experiment.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Budget:</span>
                  <span>${experiment.budget.toLocaleString()}</span>
                </div>
                {experiment.actualCost && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Spent:</span>
                    <span>${experiment.actualCost.toLocaleString()}</span>
                  </div>
                )}
                {experiment.equipment && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Equipment:</span>
                    <span>{experiment.equipment}</span>
                  </div>
                )}
                {experiment.initialVolume && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Initial Volume:</span>
                    <span>{experiment.initialVolume}L</span>
                  </div>
                )}
                {experiment.initialABV && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Initial ABV:</span>
                    <span>{experiment.initialABV}%</span>
                  </div>
                )}
                {experiment.ethanolVolume && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Ethanol Volume:</span>
                    <span>{experiment.ethanolVolume}L</span>
                  </div>
                )}
                {experiment.finishedVolume && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Finished Volume:</span>
                    <span>{experiment.finishedVolume}L</span>
                  </div>
                )}
                {experiment.finishedABV && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Finished ABV:</span>
                    <span>{experiment.finishedABV}%</span>
                  </div>
                )}
              </div>

              {experiment.assignedTeam.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {experiment.assignedTeam.map((member, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperimentList;