import React from 'react';
import { Package, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react';
import MetricCard from '../MetricCard';

interface InventoryMetrics {
  totalValue: number;
  uniqueProducts: number;
  lowStockItems: number;
  expiringItems: number;
}

interface InventoryOverviewProps {
  metrics: InventoryMetrics;
}

function InventoryOverview({ metrics }: InventoryOverviewProps) {
  const overviewMetrics = [
    {
      title: 'Total Value',
      value: `$${metrics.totalValue.toLocaleString()}`,
      icon: DollarSign,
      subtitle: 'Current inventory value'
    },
    {
      title: 'Products',
      value: metrics.uniqueProducts.toString(),
      icon: Package,
      subtitle: 'Unique items'
    },
    {
      title: 'Low Stock',
      value: metrics.lowStockItems.toString(),
      icon: AlertTriangle,
      subtitle: 'Items below reorder point',
      change: metrics.lowStockItems > 0 ? { value: metrics.lowStockItems.toString(), isPositive: false } : undefined
    },
    {
      title: 'Expiring Soon',
      value: metrics.expiringItems.toString(),
      icon: BarChart3,
      subtitle: 'Items expiring in 30 days',
      change: metrics.expiringItems > 0 ? { value: metrics.expiringItems.toString(), isPositive: false } : undefined
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewMetrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}

export default InventoryOverview;