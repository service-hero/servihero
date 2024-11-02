import { useState, useEffect } from 'react';
import { MetricsService } from '../services/metrics/MetricsService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import type { Metric } from '../types/dashboard';

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.accountId) return;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await MetricsService.getMetrics(user.accountId);
        setMetrics(data.sort((a, b) => a.position - b.position));
      } catch (err) {
        console.error('Error loading metrics:', err);
        setError('Failed to load metrics');
        toast({
          title: "Error",
          description: "Failed to load metrics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [user?.accountId, toast]);

  const updateMetric = async (metricId: string, value: number, previousValue: number) => {
    try {
      const { change, changeType } = MetricsService.calculateChange(value, previousValue);
      await MetricsService.updateMetric(metricId, {
        value,
        change,
        changeType,
        updatedAt: new Date(),
      });

      setMetrics(prev =>
        prev.map(metric =>
          metric.id === metricId
            ? { ...metric, value, change, changeType, updatedAt: new Date() }
            : metric
        )
      );

      toast({
        title: "Success",
        description: "Metric updated successfully",
      });
    } catch (err) {
      console.error('Error updating metric:', err);
      toast({
        title: "Error",
        description: "Failed to update metric",
        variant: "destructive",
      });
    }
  };

  return {
    metrics,
    loading,
    error,
    updateMetric,
  };
}