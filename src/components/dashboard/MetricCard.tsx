import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import * as LucideIcons from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  category: string;
  format?: (value: number) => string;
  special?: boolean;
  aiSuggestion?: string;
  position: number;
  onClick?: () => void;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  category,
  format = (value: number) => value.toString(),
  special = false,
  position,
  onClick
}: MetricCardProps) {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as Record<string, React.ComponentType>)[icon] || LucideIcons.Plus;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative cursor-pointer"
      onClick={onClick}
    >
      <div className={cn(
        "p-6 rounded-lg border transition-all duration-200 h-[160px] flex flex-col justify-between",
        category === 'empty' ? "border-dashed" : "border-solid",
        special ? "bg-gradient-to-br from-blue-600 to-indigo-600" : "bg-white",
        "border-gray-200 hover:shadow-md"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={cn(
              "h-5 w-5",
              special ? "text-white/80" : color || "text-gray-400"
            )} />
            <h3 className={cn(
              "text-sm font-medium",
              special ? "text-white/90" : "text-gray-600"
            )}>
              {title}
            </h3>
          </div>
        </div>

        {category !== 'empty' && (
          <>
            {/* Value */}
            <div className={cn(
              "text-2xl font-bold",
              special ? "text-white" : color || "text-gray-900"
            )}>
              {format(value)}
            </div>

            {/* Change */}
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex items-center",
                special
                  ? changeType === 'increase' ? "text-emerald-200" : "text-rose-200"
                  : changeType === 'increase' ? "text-emerald-600" : "text-rose-600"
              )}>
                {changeType === 'increase' ? (
                  <LucideIcons.TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <LucideIcons.TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {change}%
                </span>
              </div>
              <span className={cn(
                "text-sm",
                special ? "text-white/60" : "text-gray-500"
              )}>
                vs. last month
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}