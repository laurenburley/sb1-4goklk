import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BatchList from '../components/production/BatchList';
import BatchForm from '../components/production/BatchForm';
import ProductionAnalytics from '../components/production/ProductionAnalytics';
import { ProductionBatch, BatchStatus } from '../types/production';
import { Recipe } from '../types/recipe';

function Production() {
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Load batches and recipes from localStorage
    const savedBatches = localStorage.getItem('productionBatches');
    const savedRecipes = localStorage.getItem('recipes');
    
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    }
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  const handleBatchClick = (batch: ProductionBatch) => {
    setSelectedBatch(batch);
    setShowForm(true);
  };

  const handleFormSubmit = (data: Partial<ProductionBatch>) => {
    if (selectedBatch) {
      // Update existing batch
      const updatedBatches = batches.map(batch =>
        batch.id === selectedBatch.id
          ? { ...batch, ...data, updatedAt: new Date().toISOString() }
          : batch
      );
      setBatches(updatedBatches);
      localStorage.setItem('productionBatches', JSON.stringify(updatedBatches));
    } else {
      // Create new batch
      const newBatch: ProductionBatch = {
        ...data as ProductionBatch,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedBatches = [...batches, newBatch];
      setBatches(updatedBatches);
      localStorage.setItem('productionBatches', JSON.stringify(updatedBatches));
    }
    setShowForm(false);
    setSelectedBatch(null);
  };

  return (
    <div className="space-y-8">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Production</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Production Run
            </button>
          </div>

          <ProductionAnalytics batches={batches} />

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Production Batches</h2>
            <BatchList
              batches={batches}
              onBatchClick={handleBatchClick}
            />
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedBatch ? 'Edit Production Batch' : 'New Production Batch'}
          </h1>
          <BatchForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedBatch(null);
            }}
            initialData={selectedBatch}
            recipes={recipes}
          />
        </div>
      )}
    </div>
  );
}

export default Production;