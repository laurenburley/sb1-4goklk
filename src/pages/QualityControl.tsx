import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import QualityDashboard from '../components/quality/QualityDashboard';
import TestList from '../components/quality/TestList';
import TestForm from '../components/quality/TestForm';
import SampleList from '../components/quality/SampleList';
import SampleForm from '../components/quality/SampleForm';
import { Test, Sample, TestType, TestStatus, SampleStatus } from '../types/quality';

// Mock data - replace with API calls
const mockTests: Test[] = [
  {
    id: '1',
    name: 'ABV Analysis',
    type: TestType.CHEMICAL,
    status: TestStatus.COMPLETED,
    batchNumber: 'B2024-001',
    sampleId: 'S2024-001',
    scheduledDate: '2024-03-15T10:00:00Z',
    completedDate: '2024-03-15T11:30:00Z',
    parameters: [
      {
        name: 'ABV',
        value: 63.5,
        unit: '%',
        minRange: 60,
        maxRange: 65,
        result: 'PASS',
      }
    ],
    performedBy: 'John Smith',
    reviewedBy: 'Jane Doe',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T11:30:00Z',
  }
];

const mockSamples: Sample[] = [
  {
    id: '1',
    batchNumber: 'B2024-001',
    productName: 'Single Malt Whiskey',
    status: SampleStatus.IN_TESTING,
    collectionDate: '2024-03-15T09:00:00Z',
    collectionLocation: 'Still 1',
    collectedBy: 'John Smith',
    storageLocation: 'Lab Storage A',
    storageConditions: {
      temperature: 20,
      humidity: 45,
    },
    expirationDate: '2024-04-15T09:00:00Z',
    chainOfCustody: [
      {
        date: '2024-03-15T09:00:00Z',
        action: 'Sample Collected',
        performedBy: 'John Smith',
      }
    ],
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z',
  }
];

function QualityControl() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'samples'>('tests');

  const handleTestClick = (test: Test) => {
    setSelectedTest(test);
    setShowTestForm(true);
  };

  const handleSampleClick = (sample: Sample) => {
    setSelectedSample(sample);
    setShowSampleForm(true);
  };

  const handleTestSubmit = (data: Partial<Test>) => {
    console.log('Test submitted:', data);
    setShowTestForm(false);
    setSelectedTest(null);
  };

  const handleSampleSubmit = (data: Partial<Sample>) => {
    console.log('Sample submitted:', data);
    setShowSampleForm(false);
    setSelectedSample(null);
  };

  return (
    <div className="space-y-8">
      {!showTestForm && !showSampleForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quality Control</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSampleForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Sample
              </button>
              <button
                onClick={() => setShowTestForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Test
              </button>
            </div>
          </div>

          <QualityDashboard tests={mockTests} samples={mockSamples} />

          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'tests'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tests
                </button>
                <button
                  onClick={() => setActiveTab('samples')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'samples'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Samples
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'tests' ? (
                <TestList
                  tests={mockTests}
                  onTestClick={handleTestClick}
                />
              ) : (
                <SampleList
                  samples={mockSamples}
                  onSampleClick={handleSampleClick}
                />
              )}
            </div>
          </div>
        </>
      ) : showTestForm ? (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedTest ? 'Edit Test' : 'New Test'}
          </h1>
          <TestForm
            onSubmit={handleTestSubmit}
            onCancel={() => {
              setShowTestForm(false);
              setSelectedTest(null);
            }}
            initialData={selectedTest}
          />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedSample ? 'Edit Sample' : 'New Sample'}
          </h1>
          <SampleForm
            onSubmit={handleSampleSubmit}
            onCancel={() => {
              setShowSampleForm(false);
              setSelectedSample(null);
            }}
            initialData={selectedSample}
          />
        </div>
      )}
    </div>
  );
}

export default QualityControl;