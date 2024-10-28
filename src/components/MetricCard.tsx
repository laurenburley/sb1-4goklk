import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  subtitle?: string;
}

function MetricCard({ title, value, change, icon: Icon, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {change && (
          <p className={`mt-1 text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change.isPositive ? '↑' : '↓'} {change.value} from last month
          </p>
        )}
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export default MetricCard;