import React, { useState } from 'react';
import { DollarSign, Users, Briefcase, Target } from 'lucide-react';
import MetricsCard from '../components/analytics/MetricsCard';
import CustomReportBuilder from '../components/analytics/CustomReportBuilder';
import AdvancedCharts from '../components/analytics/AdvancedCharts';
import PerformanceComparison from '../components/analytics/PerformanceComparison';
import type { Analytics } from '../types';

const MOCK_ANALYTICS: Analytics = {
  revenue: {
    current: 125000,
    previous: 100000,
    change: 25
  },
  deals: {
    won: 12,
    lost: 3,
    active: 25,
    conversion: 80
  },
  tasks: {
    completed: 145,
    pending: 32,
    overdue: 5
  },
  clients: {
    active: 48,
    new: 8,
    churn: 2
  }
};

const MOCK_CHART_DATA = [
  { name: 'Jan', revenue: 65000, deals: 8, conversion: 75 },
  { name: 'Feb', revenue: 75000, deals: 10, conversion: 78 },
  { name: 'Mar', revenue: 90000, deals: 12, conversion: 82 },
  { name: 'Apr', revenue: 125000, deals: 15, conversion: 85 },
];

export default function Analytics() {
  const [selectedChart, setSelectedChart] = useState<'area' | 'line' | 'bar' | 'pie'>('area');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'deals']);

  const handleGenerateReport = (config: any) => {
    console.log('Generating report with config:', config);
  };

  return (
    <div className="p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricsCard
          title="Monthly Revenue"
          value={`$${MOCK_ANALYTICS.revenue.current.toLocaleString()}`}
          change={MOCK_ANALYTICS.revenue.change}
          changeLabel={`vs last month ($${MOCK_ANALYTICS.revenue.previous.toLocaleString()})`}
          icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
        />
        <MetricsCard
          title="Active Clients"
          value={MOCK_ANALYTICS.clients.active}
          change={(MOCK_ANALYTICS.clients.new - MOCK_ANALYTICS.clients.churn) / MOCK_ANALYTICS.clients.active * 100}
          changeLabel={`${MOCK_ANALYTICS.clients.new} new, ${MOCK_ANALYTICS.clients.churn} churned`}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
        />
        <MetricsCard
          title="Deal Success Rate"
          value={`${MOCK_ANALYTICS.deals.conversion}%`}
          change={MOCK_ANALYTICS.deals.conversion - 75}
          changeLabel={`${MOCK_ANALYTICS.deals.won} won, ${MOCK_ANALYTICS.deals.lost} lost`}
          icon={<Target className="h-5 w-5 text-indigo-600" />}
        />
        <MetricsCard
          title="Task Completion"
          value={`${Math.round((MOCK_ANALYTICS.tasks.completed / (MOCK_ANALYTICS.tasks.completed + MOCK_ANALYTICS.tasks.pending + MOCK_ANALYTICS.tasks.overdue)) * 100)}%`}
          change={-1 * (MOCK_ANALYTICS.tasks.overdue / (MOCK_ANALYTICS.tasks.completed + MOCK_ANALYTICS.tasks.pending + MOCK_ANALYTICS.tasks.overdue)) * 100}
          changeLabel={`${MOCK_ANALYTICS.tasks.overdue} tasks overdue`}
          icon={<Briefcase className="h-5 w-5 text-indigo-600" />}
        />
      </div>

      {/* Custom Report Builder */}
      <div className="mb-6">
        <CustomReportBuilder onGenerate={handleGenerateReport} />
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <AdvancedCharts
          data={MOCK_CHART_DATA}
          type="area"
          metrics={selectedMetrics}
        />
        <AdvancedCharts
          data={MOCK_CHART_DATA}
          type="bar"
          metrics={selectedMetrics}
        />
      </div>

      {/* Performance Comparison */}
      <PerformanceComparison
        data={{
          current: MOCK_ANALYTICS,
          previous: {
            ...MOCK_ANALYTICS,
            revenue: { current: 100000, previous: 90000, change: 11 },
            deals: { ...MOCK_ANALYTICS.deals, conversion: 75 }
          },
          target: {
            ...MOCK_ANALYTICS,
            revenue: { current: 150000, previous: 100000, change: 50 },
            deals: { ...MOCK_ANALYTICS.deals, conversion: 85 }
          }
        }}
        period="month"
      />
    </div>
  );
}