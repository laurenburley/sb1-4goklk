import React from 'react';
import { Package, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { InventoryMetrics } from '../../types/inventory';

interface InventoryDashboardProps {
  metrics: InventoryMetrics;
}

function InventoryDashboard({ metrics }: InventoryDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">Total Value</h3>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-semibold text-gray-900">
            ${metrics.totalValue.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-500">Current inventory value</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-50 rounded-lg">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">Products</h3>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-semibold text-gray-900">
            {metrics.uniqueProducts}
          </p>
          <p className="mt-1 text-sm text-gray-500">Unique items</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">Low Stock</h3>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-semibold text-gray-900">
            {metrics.lowStockItems}
          </p>
          <p className="mt-1 text-sm text-gray-500">Items below reorder point</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-50 rounded-lg">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">Expiring Soon</h3>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-semibold text-gray-900">
            {metrics.expiringItems}
          </p>
          <p className="mt-1 text-sm text-gray-500">Items expiring in 30 days</p>
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard;