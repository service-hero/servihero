import React from 'react';
import { format, addDays, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CustomDatePickerProps {
  initialRange: {
    start: Date;
    end: Date;
  };
  onChange: (range: { start: Date; end: Date }) => void;
  onClose: () => void;
}

export default function CustomDatePicker({
  initialRange,
  onChange,
  onClose
}: CustomDatePickerProps) {
  const presets = [
    {
      label: 'Last 7 days',
      range: {
        start: subDays(new Date(), 7),
        end: new Date()
      }
    },
    {
      label: 'Last 30 days',
      range: {
        start: subDays(new Date(), 30),
        end: new Date()
      }
    },
    {
      label: 'This month',
      range: {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      }
    },
    {
      label: 'Last month',
      range: {
        start: startOfMonth(subDays(new Date(), 30)),
        end: endOfMonth(subDays(new Date(), 30))
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64">
      <div className="space-y-4">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => {
              onChange(preset.range);
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            {preset.label}
          </button>
        ))}
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Custom Range
          </button>
        </div>
      </div>
    </div>
  );
}