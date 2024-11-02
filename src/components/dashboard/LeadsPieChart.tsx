import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const INITIAL_DATA = [
  { name: 'Website', value: 45, color: '#4F46E5' },
  { name: 'Referral', value: 30, color: '#10B981' },
  { name: 'Social', value: 15, color: '#F59E0B' },
  { name: 'Email', value: 10, color: '#EC4899' }
];

export default function LeadsPieChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [data] = useState(INITIAL_DATA);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="h-[300px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                strokeWidth={activeIndex === index ? 2 : 0}
                stroke="#fff"
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 shadow-lg rounded-lg border">
                    <p className="text-sm font-medium">{data.name}</p>
                    <p className="text-sm text-gray-500">
                      {data.value} leads ({Math.round(data.value)}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex justify-center items-center space-x-4">
          {data.map((entry, index) => (
            <motion.div
              key={entry.name}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              animate={{
                opacity: activeIndex === null || activeIndex === index ? 1 : 0.5
              }}
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}