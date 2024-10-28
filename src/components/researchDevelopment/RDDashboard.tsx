import React from 'react';
import { Beaker, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Experiment, ExperimentStatus } from '../../types/researchDevelopment';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RDDashboardProps {
  experiments: Experiment[];
}

function RDDashboard({ experiments }: RDDashboardProps) {
  // Calculate metrics
  const metrics = {
    activeExperiments: experiments.filter(e => e.status === ExperimentStatus.IN_PROGRESS).length,
    completedExperiments: experiments.filter(e => e.status === ExperimentStatus.COMPLETED).length,
    totalBudget: experiments.reduce((sum, e) => sum + e.budget, 0),
    totalSpent: experiments.reduce((sum, e) => sum + (e.actualCost || 0), 0),
  };

  // Calculate experiment progress over time
  const progressData = experiments.reduce((acc: any[], exp) => {
    const month = new Date(exp.startDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      existing.experiments += 1;
      existing.completed += exp.status === ExperimentStatus.COMPLETED ? 1 : 0;
    } else {
      acc.push({
        month,
        experiments: 1,
        completed: exp.status === ExperimentStatus.COMPLETED ? 1 : 0,
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Beaker className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Active Experiments</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.activeExperiments}
            </p>
            <p className="mt-1 text-sm text-gray-500">In progress</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Success Rate</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {((metrics.completedExperiments / experiments.length) * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">Completion rate</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Budget Utilization</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {((metrics.totalSpent / metrics.totalBudget) * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">
              ${metrics.totalSpent.toLocaleString()} / ${metrics.totalBudget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Avg Duration</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">45</p>
            <p className="mt-1 text-sm text-gray-500">Days per experiment</p>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Experiment Progress</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="experiments"
                stroke="#8b5cf6"
                name="Total Experiments"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                name="Completed"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RDDashboard;