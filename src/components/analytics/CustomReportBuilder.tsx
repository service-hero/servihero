import React, { useState } from 'react';
import { Plus, Filter, Calendar, Download } from 'lucide-react';
import type { Analytics } from '../../types';

interface ReportConfig {
  metrics: string[];
  filters: {
    field: string;
    operator: 'equals' | 'greater' | 'less' | 'between';
    value: string | number | [number, number];
  }[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

interface CustomReportBuilderProps {
  onGenerate: (config: ReportConfig) => void;
}

export default function CustomReportBuilder({ onGenerate }: CustomReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>({
    metrics: [],
    filters: [],
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
  });

  const availableMetrics = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'deals_won', label: 'Deals Won' },
    { id: 'conversion_rate', label: 'Conversion Rate' },
    { id: 'avg_deal_size', label: 'Average Deal Size' },
    { id: 'sales_cycle', label: 'Sales Cycle Length' },
    { id: 'pipeline_value', label: 'Pipeline Value' },
    { id: 'client_retention', label: 'Client Retention' },
    { id: 'task_completion', label: 'Task Completion Rate' },
  ];

  const handleAddMetric = (metricId: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: [...prev.metrics, metricId],
    }));
  };

  const handleAddFilter = () => {
    setConfig(prev => ({
      ...prev,
      filters: [...prev.filters, { field: '', operator: 'equals', value: '' }],
    }));
  };

  const handleGenerate = () => {
    onGenerate(config);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Custom Report Builder</h2>

      {/* Metrics Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Metrics
        </label>
        <div className="grid grid-cols-2 gap-4">
          {availableMetrics.map(metric => (
            <div key={metric.id} className="flex items-center">
              <input
                type="checkbox"
                id={metric.id}
                checked={config.metrics.includes(metric.id)}
                onChange={() => handleAddMetric(metric.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={metric.id} className="ml-2 text-sm text-gray-700">
                {metric.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-xs text-gray-500">Start Date</label>
            <input
              type="date"
              value={config.dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  start: new Date(e.target.value),
                },
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">End Date</label>
            <input
              type="date"
              value={config.dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  end: new Date(e.target.value),
                },
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Filters
          </label>
          <button
            onClick={handleAddFilter}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Filter
          </button>
        </div>
        <div className="space-y-2">
          {config.filters.map((filter, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                value={filter.field}
                onChange={(e) => {
                  const newFilters = [...config.filters];
                  newFilters[index].field = e.target.value;
                  setConfig(prev => ({ ...prev, filters: newFilters }));
                }}
                className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select field</option>
                {availableMetrics.map(metric => (
                  <option key={metric.id} value={metric.id}>
                    {metric.label}
                  </option>
                ))}
              </select>
              <select
                value={filter.operator}
                onChange={(e) => {
                  const newFilters = [...config.filters];
                  newFilters[index].operator = e.target.value as any;
                  setConfig(prev => ({ ...prev, filters: newFilters }));
                }}
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="equals">Equals</option>
                <option value="greater">Greater than</option>
                <option value="less">Less than</option>
                <option value="between">Between</option>
              </select>
              <input
                type="text"
                value={filter.value as string}
                onChange={(e) => {
                  const newFilters = [...config.filters];
                  newFilters[index].value = e.target.value;
                  setConfig(prev => ({ ...prev, filters: newFilters }));
                }}
                className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Value"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleGenerate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Filter className="h-4 w-4 mr-2" />
          Generate Report
        </button>
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  );
}