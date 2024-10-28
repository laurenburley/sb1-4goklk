import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { Experiment } from '../types/researchDevelopment';
import { InventoryItem, InventoryCategory, StockStatus } from '../types/inventory';

interface InitialDataContextType {
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  experiments: Experiment[];
  setExperiments: (experiments: Experiment[]) => void;
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
  loading: boolean;
}

const InitialDataContext = createContext<InitialDataContextType | undefined>(undefined);

const defaultInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Juniper Berries',
    sku: 'JB-001',
    category: InventoryCategory.RAW_MATERIALS,
    description: 'Premium quality juniper berries for gin production',
    quantity: 100,
    unitOfMeasurement: 'kg',
    location: 'Warehouse A',
    reorderPoint: 25,
    costPerUnit: 45.00,
    supplier: 'Premium Botanicals Ltd',
    status: StockStatus.IN_STOCK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Glass Bottles 750ml',
    sku: 'BTL-750',
    category: InventoryCategory.PACKAGING,
    description: 'Standard 750ml glass bottles',
    quantity: 5000,
    unitOfMeasurement: 'units',
    location: 'Warehouse B',
    reorderPoint: 1000,
    costPerUnit: 2.50,
    supplier: 'Glass Solutions Inc',
    status: StockStatus.IN_STOCK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Coriander Seeds',
    sku: 'CS-001',
    category: InventoryCategory.BOTANICALS,
    description: 'Organic coriander seeds',
    quantity: 50,
    unitOfMeasurement: 'kg',
    location: 'Warehouse A',
    reorderPoint: 15,
    costPerUnit: 35.00,
    supplier: 'Premium Botanicals Ltd',
    status: StockStatus.IN_STOCK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function InitialDataProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load recipes from localStorage
        const savedRecipes = localStorage.getItem('recipes');
        if (savedRecipes) {
          setRecipes(JSON.parse(savedRecipes));
        }

        // Load experiments from localStorage
        const savedExperiments = localStorage.getItem('experiments');
        if (savedExperiments) {
          setExperiments(JSON.parse(savedExperiments));
        }

        // Load inventory from localStorage or use default
        const savedInventory = localStorage.getItem('inventory');
        if (savedInventory) {
          setInventory(JSON.parse(savedInventory));
        } else {
          setInventory(defaultInventory);
          localStorage.setItem('inventory', JSON.stringify(defaultInventory));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('recipes', JSON.stringify(recipes));
      localStorage.setItem('experiments', JSON.stringify(experiments));
      localStorage.setItem('inventory', JSON.stringify(inventory));
    }
  }, [recipes, experiments, inventory, loading]);

  return (
    <InitialDataContext.Provider
      value={{
        recipes,
        setRecipes,
        experiments,
        setExperiments,
        inventory,
        setInventory,
        loading,
      }}
    >
      {children}
    </InitialDataContext.Provider>
  );
}

export function useInitialData() {
  const context = useContext(InitialDataContext);
  if (context === undefined) {
    throw new Error('useInitialData must be used within an InitialDataProvider');
  }
  return context;
}