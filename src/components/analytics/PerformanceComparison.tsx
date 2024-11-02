import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { Analytics } from '../../types';

interface ComparisonData {
  current: Analytics;
  previous: Analytics;
  target?: Analytics;
}

interface PerformanceComparisonProps {
  data: ComparisonData;
  period: 'week' | 'month' | 'quarter' | 'year';
}

export default function PerformanceComparison({ data, period }: PerformanceComparisonProps) {
  const calculateChange = (current: number, previous: number): number => {
    return ((current - previous) / previous) * 100;
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatValue = (value: number): string => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const metrics = [
    {
      label: 'Revenue',
      current: data.current.revenue.current,
      previous: data.current.revenue.previous,
      target: data.target?.revenue.current,
    },
    {
      label: 'Deals Won',
      current: data.current.deals.won,
      previous: data.previous.deals.won,
      target: data.target?.deals.won,
    },
    {
      label: 'Conversion Rate',
      current: data.current.deals.conversion,
      previous: data.previous.deals.conversion,
      target: data.target?.deals.conversion,
      format: (value: number) => `${value}%`,
    },
    {
      label: 'Active Clients',
      current: data.current.clients.active,
      previous: data.previous.clients.active,
      target: data.target?.clients.active,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Performance Comparison ({period})
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {metrics.map((metric) => {
            const change = calculateChange(metric.current, metric.previous);
            const changeColor = getChangeColor(change);
            const formatter = metric.format || formatValue;

            return (
              <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                  <div className={`flex items-center ${changeColor}`}>
                    {change > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(change).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatter(metric.current)}
                  </p>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="text-gray-500">vs {formatter(metric.previous)}</span>
                    {metric.target && (
                      <span className="ml-2 text-gray-500">
                        • Target: {formatter(metric.target)}
                      </span>
                    )}
                  </div>
                </div>

                {metric.target && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (metric.current / metric.target) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}