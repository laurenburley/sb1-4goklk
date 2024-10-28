import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction } from '../../types/sales';

interface SalesAnalyticsProps {
  transactions: Transaction[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

function SalesAnalytics({ transactions }: SalesAnalyticsProps) {
  // Calculate sales by channel
  const channelData = transactions.reduce((acc: any[], transaction) => {
    const existingChannel = acc.find(item => item.name === transaction.channel);
    if (existingChannel) {
      existingChannel.value += transaction.total;
    } else {
      acc.push({
        name: transaction.channel,
        value: transaction.total
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Sales by Channel</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SalesAnalytics;