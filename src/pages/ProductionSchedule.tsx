import React, { useState } from 'react';
import { Plus, Calendar, Users } from 'lucide-react';
import GanttView from '../components/scheduling/GanttView';
import ResourceAllocation from '../components/scheduling/ResourceAllocation';
import ProductionRunForm from '../components/scheduling/ProductionRunForm';
import { ProductionRun, ProductionStatus } from '../types/scheduling';

// Mock data - replace with API calls
const mockProductionRuns: ProductionRun[] = [
  {
    id: '1',
    recipeId: '1',
    recipe: {
      name: 'Single Malt Whiskey',
      spiritType: 'Whiskey',
    },
    batchNumber: 'B2024-001',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    status: ProductionStatus.IN_PROGRESS,
    currentStage: 'Distillation',
    batchSize: 500,
    expectedYield: 450,
    assignedStaff: ['John Smith', 'Jane Doe'],
    resources: [
      { id: '1', type: 'STILL', name: 'Still 1' },
      { id: '3', type: 'FERMENTER', name: 'Fermenter 1' },
    ],
    stages: [],
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z',
  },
];

function ProductionSchedule() {
  const [productionRuns, setProductionRuns] = useState<ProductionRun[]>(mockProductionRuns);
  const [selectedRun, setSelectedRun] = useState<ProductionRun | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'gantt' | 'resources'>('gantt');

  const handleRunClick = (run: ProductionRun) => {
    setSelectedRun(run);
    setShowForm(true);
  };

  const handleRunUpdate = (runId: string, updates: Partial<ProductionRun>) => {
    setProductionRuns(prev =>
      prev.map(run => run.id === runId ? { ...run, ...updates } : run)
    );
  };

  const handleFormSubmit = (data: Partial<ProductionRun>) => {
    if (selectedRun) {
      setProductionRuns(prev =>
        prev.map(run => run.id === selectedRun.id ? { ...run, ...data } : run)
      );
    } else {
      const newRun: ProductionRun = {
        id: Date.now().toString(),
        ...data as ProductionRun,
        stages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProductionRuns(prev => [...prev, newRun]);
    }
    setShowForm(false);
    setSelectedRun(null);
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Production Schedule</h1>
            <div className="flex space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('gantt')}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    view === 'gantt' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </button>
                <button
                  onClick={() => setView('resources')}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    view === 'resources' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Resources
                </button>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Production Run
              </button>
            </div>
          </div>

          {view === 'gantt' ? (
            <GanttView
              productionRuns={productionRuns}
              onRunClick={handleRunClick}
              onRunUpdate={handleRunUpdate}
            />
          ) : (
            <ResourceAllocation
              productionRuns={productionRuns}
              onRunClick={handleRunClick}
            />
          )}
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedRun ? 'Edit Production Run' : 'New Production Run'}
          </h1>
          <ProductionRunForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedRun(null);
            }}
            initialData={selectedRun}
          />
        </div>
      )}
    </div>
  );
}

export default ProductionSchedule;