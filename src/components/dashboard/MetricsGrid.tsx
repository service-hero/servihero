import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MetricCard from './MetricCard';
import MetricModal from './MetricModal';
import { useMetrics } from '../../hooks/useMetrics';
import { AVAILABLE_METRICS } from './MetricSelector';

// Create a 5x5 grid of empty metric slots
const GRID_SIZE = 25;

export default function MetricsGrid() {
  const { metrics, loading, updateMetric } = useMetrics();
  const [selectedMetric, setSelectedMetric] = useState<typeof AVAILABLE_METRICS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMetricClick = (metric: typeof AVAILABLE_METRICS[0]) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
  };

  const handleUpdateMetric = async (id: string, newValue: number) => {
    const metric = metrics.find(m => m.id === id);
    if (metric) {
      await updateMetric(id, newValue, metric.value);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {[...Array(GRID_SIZE)].map((_, index) => (
          <div
            key={index}
            className="h-[160px] bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Create array of 25 slots, filled with metrics where available
  const gridSlots = Array(GRID_SIZE).fill(null).map((_, index) => {
    return metrics[index] || {
      id: `empty-${index}`,
      title: 'Add Metric',
      value: 0,
      change: 0,
      changeType: 'increase' as const,
      icon: 'Plus',
      color: 'text-gray-400',
      category: 'empty',
      position: index,
      special: false
    };
  });

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {gridSlots.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
          >
            <MetricCard
              {...metric}
              position={index}
              onClick={() => handleMetricClick(metric)}
            />
          </motion.div>
        ))}
      </div>

      <MetricModal
        metric={selectedMetric}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateMetric}
      />
    </>
  );
}