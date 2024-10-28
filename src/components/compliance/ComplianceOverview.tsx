import React from 'react';
import { FileText, Calendar, AlertTriangle, DollarSign } from 'lucide-react';
import MetricCard from '../MetricCard';
import { ExciseReportType } from '../../types/compliance';

interface ComplianceMetrics {
  upcomingDeadlines: number;
  pendingReports: number;
  totalExcise: number;
  complianceRate: number;
}

interface ComplianceOverviewProps {
  metrics: ComplianceMetrics;
}

function ComplianceOverview({ metrics }: ComplianceOverviewProps) {
  const overviewMetrics = [
    {
      title: 'Upcoming Deadlines',
      value: metrics.upcomingDeadlines.toString(),
      icon: Calendar,
      subtitle: 'Due in next 7 days',
      change: metrics.upcomingDeadlines > 0 ? { value: metrics.upcomingDeadlines.toString(), isPositive: false } : undefined
    },
    {
      title: 'Pending Reports',
      value: metrics.pendingReports.toString(),
      icon: FileText,
      subtitle: 'Awaiting review',
      change: metrics.pendingReports > 0 ? { value: metrics.pendingReports.toString(), isPositive: false } : undefined
    },
    {
      title: 'Total Excise',
      value: `$${metrics.totalExcise.toLocaleString()}`,
      icon: DollarSign,
      subtitle: 'Current period'
    },
    {
      title: 'Compliance Rate',
      value: `${metrics.complianceRate}%`,
      icon: AlertTriangle,
      subtitle: 'Last 12 months',
      change: { value: '2%', isPositive: true }
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

export default ComplianceOverview;