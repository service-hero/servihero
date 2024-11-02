import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 65000, target: 60000 },
  { month: 'Feb', revenue: 75000, target: 65000 },
  { month: 'Mar', revenue: 90000, target: 70000 },
  { month: 'Apr', revenue: 85000, target: 75000 },
  { month: 'May', revenue: 110000, target: 80000 },
  { month: 'Jun', revenue: 125000, target: 85000 },
];

export default function RevenueChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 shadow-lg rounded-lg border">
                    <p className="text-sm font-medium text-gray-900">
                      {payload[0].payload.month}
                    </p>
                    <p className="text-sm text-indigo-600">
                      Revenue: ${payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-sm text-emerald-600">
                      Target: ${payload[1].value.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4F46E5"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#targetGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}