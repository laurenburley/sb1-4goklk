import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ComplianceOverview from '../components/compliance/ComplianceOverview';
import ReportList from '../components/compliance/ReportList';
import ReportForm from '../components/compliance/ReportForm';
import { ExciseReport, ExciseStatus } from '../types/compliance';
import { exciseService } from '../services/excise';

function Compliance() {
  const [selectedReport, setSelectedReport] = useState<ExciseReport | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState<ExciseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      // In a real app, this would fetch from an API
      const savedReports = localStorage.getItem('exciseReports');
      if (savedReports) {
        setReports(JSON.parse(savedReports));
      }
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const metrics = {
    upcomingDeadlines: reports.filter(r => 
      new Date(r.dueDate) > new Date() && r.status !== ExciseStatus.SUBMITTED
    ).length,
    pendingReports: reports.filter(r => r.status === ExciseStatus.PENDING_REVIEW).length,
    totalExcise: reports.reduce((sum, r) => sum + (r.exciseAmount || 0), 0),
    complianceRate: 95 // Calculate based on submission history
  };

  const handleReportClick = (report: ExciseReport) => {
    setSelectedReport(report);
    setShowForm(true);
  };

  const handleFormSubmit = (data: Partial<ExciseReport>) => {
    if (selectedReport) {
      setReports(prev =>
        prev.map(report =>
          report.id === selectedReport.id
            ? { ...report, ...data, updatedAt: new Date().toISOString() }
            : report
        )
      );
    } else {
      const newReport: ExciseReport = {
        ...data as ExciseReport,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setReports(prev => [...prev, newReport]);
    }

    // Save to localStorage for persistence
    localStorage.setItem('exciseReports', JSON.stringify(reports));
    
    setShowForm(false);
    setSelectedReport(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">ATO Compliance</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Report
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <ComplianceOverview metrics={metrics} />

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Excise Reports</h2>
              <div className="flex space-x-4">
                <button className="btn-secondary">
                  Export Reports
                </button>
              </div>
            </div>
            <ReportList
              reports={reports}
              onReportClick={handleReportClick}
            />
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedReport ? 'Edit Report' : 'New Excise Report'}
          </h1>
          <ReportForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedReport(null);
            }}
            initialData={selectedReport}
          />
        </div>
      )}
    </div>
  );
}

export default Compliance;