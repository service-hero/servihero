import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Brain,
  BarChart,
  Calculator,
  TrendingDown,
  LineChart
} from 'lucide-react';
import type { Metric } from '../../types/dashboard';

export const AVAILABLE_METRICS = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 0,
    change: 0,
    changeType: 'increase' as const,
    icon: DollarSign,
    color: 'text-emerald-600',
    category: 'revenue',
    format: (value: number) => `$${value.toLocaleString()}`,
    aiSuggestion: 'Track your revenue growth and trends'
  },
  {
    id: 'leads',
    title: 'Total Leads',
    value: 0,
    change: 0,
    changeType: 'increase' as const,
    icon: Users,
    color: 'text-blue-600',
    category: 'leads',
    aiSuggestion: 'Monitor your lead generation performance'
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: 0,
    change: 0,
    changeType: 'increase' as const,
    icon: Target,
    color: 'text-purple-600',
    category: 'performance',
    format: (value: number) => `${value}%`
  },
  {
    id: 'deals',
    title: 'Deals Closed',
    value: 0,
    change: 0,
    changeType: 'increase' as const,
    icon: TrendingUp,
    color: 'text-indigo-600',
    category: 'performance'
  },
  {
    id: 'avg_deal_size',
    title: 'Average Deal Size',
    value: 0,
    change: 0,
    changeType: 'increase' as const,
    icon: Calculator,
    color: 'text-pink-600',
    category: 'revenue',
    format: (value: number) => `$${value.toLocaleString()}`
  },
  {
    id: 'pipeline_value',
    title: 'Pipeline Value',
    value: 0,
    change: 0,
    changeType: 'increase' as const,
    icon: BarChart,
    color: 'text-orange-600',
    category: 'revenue',
    format: (value: number) => `$${value.toLocaleString()}`
  },
  {
    id: 'win_rate',
    title: 'Win Rate',
    value: 0,
    change: 0,
    changeType: 'increase' as const,
    icon: Target,
    color: 'text-green-600',
    category: 'performance',
    format: (value: number) => `${value}%`
  },
  {
    id: 'sales_cycle',
    title: 'Sales Cycle',
    value: 0,
    change: 0,
    changeType: 'decrease' as const,
    icon: LineChart,
    color: 'text-blue-600',
    category: 'performance',
    format: (value: number) => `${value} days`
  }
];

interface MetricSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (metric: typeof AVAILABLE_METRICS[0]) => void;
  selectedMetricIds: string[];
}

export default function MetricSelector({
  isOpen,
  onClose,
  onSelect,
  selectedMetricIds
}: MetricSelectorProps) {
  const categories = ['revenue', 'leads', 'performance'];
  const categoryLabels = {
    revenue: 'Revenue Metrics',
    leads: 'Lead Metrics',
    performance: 'Performance Metrics'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Metric to Dashboard</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_METRICS
                    .filter((metric) => metric.category === category)
                    .map((metric) => {
                      const isSelected = selectedMetricIds.includes(metric.id);
                      const Icon = metric.icon;

                      return (
                        <motion.button
                          key={metric.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (!isSelected) {
                              onSelect(metric);
                              onClose();
                            }
                          }}
                          disabled={isSelected}
                          className={`
                            p-4 rounded-lg text-left transition-all
                            ${isSelected
                              ? 'bg-gray-100 cursor-not-allowed opacity-50'
                              : 'bg-white hover:bg-gray-50 border border-gray-200'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-5 w-5 ${metric.color}`} />
                            <div className="font-medium text-gray-900">{metric.title}</div>
                          </div>
                          {metric.aiSuggestion && (
                            <p className="mt-2 text-sm text-gray-500">
                              {metric.aiSuggestion}
                            </p>
                          )}
                        </motion.button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}