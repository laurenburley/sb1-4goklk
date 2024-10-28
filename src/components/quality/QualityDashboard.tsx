import React from 'react';
import { TestTube, Beaker, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { Test, Sample, TestStatus, SampleStatus } from '../../types/quality';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface QualityDashboardProps {
  tests: Test[];
  samples: Sample[];
}

function QualityDashboard({ tests, samples }: QualityDashboardProps) {
  // Calculate metrics
  const metrics = {
    pendingTests: tests.filter(t => t.status === TestStatus.PENDING).length,
    completedTests: tests.filter(t => t.status === TestStatus.COMPLETED).length,
    failedTests: tests.filter(t => t.status === TestStatus.FAILED).length,
    activeSamples: samples.filter(s => s.status === SampleStatus.IN_TESTING).length,
  };

  // Calculate test results trend
  const trendData = tests.reduce((acc: any[], test) => {
    const date = new Date(test.scheduledDate).toLocaleDateString('default', { month: 'short' });
    const existing = acc.find(item => item.month === date);
    
    if (existing) {
      existing.total += 1;
      if (test.status === TestStatus.COMPLETED) existing.passed += 1;
    } else {
      acc.push({
        month: date,
        total: 1,
        passed: test.status === TestStatus.COMPLETED ? 1 : 0,
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
            <div className="p-2 bg-blue-50 rounded-lg">
              <TestTube className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Pending Tests</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.pendingTests}
            </p>
            <p className="mt-1 text-sm text-gray-500">Tests awaiting completion</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <ClipboardCheck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Completed Tests</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.completedTests}
            </p>
            <p className="mt-1 text-sm text-gray-500">Successfully completed</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Failed Tests</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.failedTests}
            </p>
            <p className="mt-1 text-sm text-gray-500">Require attention</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Beaker className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Active Samples</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.activeSamples}
            </p>
            <p className="mt-1 text-sm text-gray-500">Samples in testing</p>
          </div>
        </div>
      </div>

      {/* Test Results Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Test Results Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                name="Total Tests"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="passed"
                stroke="#10b981"
                name="Passed Tests"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default QualityDashboard;