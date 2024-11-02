import React from 'react';
import { motion } from 'framer-motion';
import { X, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ContactFiltersProps {
  filters: {
    status?: 'active' | 'inactive' | 'all';
    tags?: string[];
    type?: 'lead' | 'contact' | 'all';
  };
  onChange: (filters: any) => void;
  onClose: () => void;
}

const CONTACT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'lead', label: 'Leads' },
  { value: 'contact', label: 'Contacts' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

// Common tags for demonstration - in a real app, these might come from your backend
const COMMON_TAGS = [
  'customer',
  'prospect',
  'vip',
  'cold',
  'hot',
  'qualified',
  'unqualified'
];

export default function ContactFilters({ filters, onChange, onClose }: ContactFiltersProps) {
  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onChange({ ...filters, tags: newTags });
  };

  return (
    <div className="p-4 bg-white border-b">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contact Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Type
          </label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => onChange({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => onChange({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range (placeholder for future implementation) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <Input type="date" placeholder="Select date" disabled />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTagToggle(tag)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                filters.tags?.includes(tag)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => onChange({ status: 'all', type: 'all', tags: [] })}
        >
          Reset Filters
        </Button>
        <Button
          onClick={onClose}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}