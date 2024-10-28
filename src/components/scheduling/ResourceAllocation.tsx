import React, { useState } from 'react';
import { Users, Factory } from 'lucide-react';
import { ProductionRun, ResourceType } from '../../types/scheduling';

interface ResourceAllocationProps {
  productionRuns: ProductionRun[];
  onRunClick: (run: ProductionRun) => void;
}

// Mock data - replace with API calls
const mockStaff = [
  { id: '1', name: 'John Smith', role: 'Distiller' },
  { id: '2', name: 'Jane Doe', role: 'Production Manager' },
];

const mockEquipment = [
  { id: '1', type: ResourceType.STILL, name: 'Still 1', capacity: '500L' },
  { id: '2', type: ResourceType.STILL, name: 'Still 2', capacity: '500L' },
  { id: '3', type: ResourceType.FERMENTER, name: 'Fermenter 1', capacity: '1000L' },
  { id: '4', type: ResourceType.FERMENTER, name: 'Fermenter 2', capacity: '1000L' },
];

function ResourceAllocation({ productionRuns, onRunClick }: ResourceAllocationProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getRunsForResource = (resourceId: string) => {
    return productionRuns.filter(run => {
      const runDate = new Date(run.startDate).toISOString().split('T')[0];
      return (
        runDate === selectedDate &&
        (run.assignedStaff.includes(resourceId) ||
          run.resources.some(r => r.id === resourceId))
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Resource Allocation</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-8">
          {/* Staff Allocation */}
          <div>
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-base font-medium text-gray-900">Staff</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStaff.map((staff) => {
                const assignedRuns = getRunsForResource(staff.id);
                return (
                  <div
                    key={staff.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{staff.name}</h4>
                      <p className="text-sm text-gray-500">{staff.role}</p>
                    </div>
                    <div className="space-y-2">
                      {assignedRuns.length > 0 ? (
                        assignedRuns.map(run => (
                          <button
                            key={run.id}
                            onClick={() => onRunClick(run)}
                            className="w-full text-left px-3 py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {run.recipe.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {run.batchNumber}
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Available</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment Allocation */}
          <div>
            <div className="flex items-center mb-4">
              <Factory className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-base font-medium text-gray-900">Equipment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEquipment.map((equipment) => {
                const assignedRuns = getRunsForResource(equipment.id);
                return (
                  <div
                    key={equipment.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{equipment.name}</h4>
                      <p className="text-sm text-gray-500">
                        {equipment.type} • {equipment.capacity}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {assignedRuns.length > 0 ? (
                        assignedRuns.map(run => (
                          <button
                            key={run.id}
                            onClick={() => onRunClick(run)}
                            className="w-full text-left px-3 py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {run.recipe.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {run.batchNumber}
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Available</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceAllocation;