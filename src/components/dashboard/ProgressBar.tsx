import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export default function ProgressBar({ value, max, className = '' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`rounded-full transition-all duration-500 ${className}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}