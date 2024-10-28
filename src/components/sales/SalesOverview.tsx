import React from 'react';
import { DollarSign, ShoppingCart, ArrowUpRight, Store } from 'lucide-react';
import { SalesMetrics } from '../../types/sales';

interface SalesOverviewProps {
  metrics: SalesMetrics;
}

function SalesOverview({ metrics }: SalesOverviewProps) {
  const overviewMetrics = [
    {
      title: 'Total Sales',
      value: `$${metrics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      subtitle: 'Current period'
    },
    {
      title: 'Orders',
      value: metrics.orderCount.toString(),
      icon: ShoppingCart,
      subtitle: `${metrics.onlineOrders} online, ${metrics.inPersonOrders} in-person`
    },
    {
      title: 'Average Order',
      value: `$${metrics.averageOrder.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      subtitle: 'Per transaction'
    },
    {
      title: 'Channel Split',
      value: `${((metrics.onlineOrders / metrics.orderCount) * 100).toFixed(1)}% Online`,
      icon: Store,
      subtitle: `${metrics.onlineOrders} online vs ${metrics.inPersonOrders} in-store`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewMetrics.map((metric) => (
        <div key={metric.title} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <metric.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">{metric.title}</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">{metric.value}</p>
            <p className="mt-1 text-sm text-gray-500">{metric.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SalesOverview;