import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BarrelDashboard from '../components/barrelManagement/BarrelDashboard';
import BarrelList from '../components/barrelManagement/BarrelList';
import BarrelForm from '../components/barrelManagement/BarrelForm';
import { Barrel, BarrelStatus } from '../types/barrelManagement';

// Mock data - replace with API calls
const mockBarrels: Barrel[] = [
  {
    id: '1',
    barrelNumber: 'B2024-001',
    type: 'BOURBON',
    size: 'STANDARD',
    status: BarrelStatus.AGING,
    location: 'Warehouse A',
    warehouse: 'A',
    rack: 'R1',
    position: 'P1',
    manufacturer: 'Independent Stave Co.',
    purchaseDate: '2024-01-15',
    totalFills: 1,
    currentFill: {
      spiritType: 'Bourbon Whiskey',
      batchNumber: 'BWH-2024-001',
      fillDate: '2024-01-20',
      originalVolume: 200,
      currentVolume: 195,
      originalAbv: 62.5,
      currentAbv: 61.8,
      targetAge: 4,
    },
    previousFills: [],
    maintenanceHistory: [],
    qualityChecks: [],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
];

function BarrelManagement() {
  const [selectedBarrel, setSelectedBarrel] = useState<Barrel | null>(null);
  const [showForm, setShowForm] = useState(false);

  const metrics = {
    totalBarrels: mockBarrels.length,
    activeBarrels: mockBarrels.filter(b => b.status === BarrelStatus.AGING).length,
    averageAge: 2.5, // Calculate based on actual data
    projectedReadyCount: 5,
    totalVolume: mockBarrels.reduce((sum, b) => sum + (b.currentFill?.currentVolume || 0), 0),
    angelShare: 2.5, // Calculate based on actual data
  };

  const handleBarrelClick = (barrel: Barrel) => {
    setSelectedBarrel(barrel);
    setShowForm(true);
  };

  const handleFormSubmit = (data: Partial<Barrel>) => {
    console.log('Form submitted:', data);
    setShowForm(false);
    setSelectedBarrel(null);
  };

  return (
    <div className="space-y-8">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Barrel Management</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Barrel
            </button>
          </div>

          <BarrelDashboard metrics={metrics} barrels={mockBarrels} />

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Barrel Inventory</h2>
            <BarrelList
              barrels={mockBarrels}
              onBarrelClick={handleBarrelClick}
            />
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedBarrel ? 'Edit Barrel' : 'New Barrel'}
          </h1>
          <BarrelForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedBarrel(null);
            }}
            initialData={selectedBarrel}
          />
        </div>
      )}
    </div>
  );
}

export default BarrelManagement;