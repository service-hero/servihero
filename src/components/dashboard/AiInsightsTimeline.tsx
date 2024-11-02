import React from 'react';
import { format } from 'date-fns';
import { Brain, TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
  timestamp: Date;
}

interface AiInsightsTimelineProps {
  insights: Insight[];
}

export default function AiInsightsTimeline({ insights }: AiInsightsTimelineProps) {
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColor = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {insights.map((insight, idx) => (
          <li key={insight.id}>
            <div className="relative pb-8">
              {idx !== insights.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getColor(insight.type)}`}>
                    {getIcon(insight.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{insight.description}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {format(insight.timestamp, 'h:mm a')}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}