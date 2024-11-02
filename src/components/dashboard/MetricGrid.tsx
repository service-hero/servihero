import React from 'react';
import MetricCard from './MetricCard';
import { 
  DollarSign, 
  Users, 
  Target, 
  Briefcase, 
  LineChart 
} from 'lucide-react';

const METRICS = [
  {
    label: 'Total Revenue',
    value: 125000,
    change: 15.8,
    icon: DollarSign,
    color: 'indigo',
    category: 'revenue',
    format: (value: number) => `$${value.toLocaleString()}`,
    aiInsight: 'Revenue is growing faster than industry average'
  },
  {
    label: 'Total Leads',
    value: 145,
    change: 12.5,
    icon: Users,
    color: 'blue',
    category: 'leads',
    aiInsight: 'Lead quality has improved by 15%'
  },
  {
    label: 'Conversion Rate',
    value: 68,
    change: -2.3,
    icon: Target,
    color: 'green',
    category: 'performance',
    format: (value: number) => `${value}%`
  },
  {
    label: 'Deals Closed',
    value: 28,
    change: 5.2,
    icon: Briefcase,
    color: 'purple',
    category: 'performance'
  },
  {
    label: 'Avg. Deal Size',
    value: 4464,
    change: 8.1,
    icon: LineChart,
    color: 'orange',
    category: 'revenue',
    format: (value: number) => `$${value.toLocaleString()}`,
    special: true,
    aiInsight: 'Deal sizes trending upward'
  }
];

export default function MetricGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {METRICS.map((metric, index) => (
        <MetricCard
          key={metric.label}
          {...metric}
        />
      ))}
    </div>
  );
}