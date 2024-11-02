import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  type: 'currency' | 'number' | 'percentage' | 'hours';
}

interface MetricsRowProps {
  title: string;
  metrics: Metric[];
}

const formatValue = (value: number, type: Metric['type']) => {
  switch (type) {
    case 'currency':
      return `$${value.toLocaleString()}`;
    case 'percentage':
      return `${value}%`;
    case 'hours':
      return `${value}h`;
    default:
      return value.toLocaleString();
  }
};

export default function MetricsRow({ title, metrics }: MetricsRowProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col h-full justify-between">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <div className="mt-2">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatValue(metric.value, metric.type)}
                </div>
                <div className="mt-2 flex items-center">
                  <div className={`flex items-center ${
                    metric.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {metric.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}