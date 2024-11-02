import React from 'react';
import { User, Building2, Phone, Mail, Tag, TrendingUp } from 'lucide-react';
import type { Lead } from '../../types/leads';

interface LeadListProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

export default function LeadList({ leads, onLeadSelect }: LeadListProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      new: 'text-blue-600 bg-blue-100',
      contacted: 'text-yellow-600 bg-yellow-100',
      qualified: 'text-green-600 bg-green-100',
      unqualified: 'text-gray-600 bg-gray-100',
      converted: 'text-purple-600 bg-purple-100',
      lost: 'text-red-600 bg-red-100'
    };
    return colors[status];
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {leads.map((lead) => (
          <li
            key={lead.id}
            onClick={() => onLeadSelect(lead)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <div className="mt-1 flex items-center">
                      {lead.company && (
                        <span className="flex items-center text-sm text-gray-500">
                          <Building2 className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {lead.company}
                          {lead.position && ` • ${lead.position}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                    <TrendingUp className="mr-1 h-4 w-4" />
                    {lead.score}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {lead.phone}
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <Tag className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span className="truncate">
                    {lead.tags.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}