import React from 'react';
import { Shield } from 'lucide-react';
import type { UserRole } from '../../types';

interface RoleSelectProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

export default function RoleSelect({ value, onChange, disabled }: RoleSelectProps) {
  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Full system access and control'
    },
    {
      value: 'manager',
      label: 'Manager',
      description: 'Team and resource management'
    },
    {
      value: 'sales',
      label: 'Sales Representative',
      description: 'Deal and contact management'
    },
    {
      value: 'marketing',
      label: 'Marketing Specialist',
      description: 'Campaign and analytics access'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Role
      </label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Shield className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as UserRole)}
          disabled={disabled}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {roles.find(r => r.value === value)?.description}
      </p>
    </div>
  );
}