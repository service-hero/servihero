import React from 'react';
import { format } from 'date-fns';
import { User, Building2, Phone, Mail, Tag, Calendar, TrendingUp } from 'lucide-react';
import type { Lead } from '../../types/leads';

interface LeadDetailsProps {
  lead: Lead;
  onStatusChange: (status: Lead['status']) => void;
  onUpdate: (lead: Partial<Lead>) => void;
}

export default function LeadDetails({ lead, onStatusChange, onUpdate }: LeadDetailsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lead Details
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(e.target.value as Lead['status'])}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.score)} bg-gray-100`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {lead.score} points
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <User className="h-4 w-4 mr-1" />
              Name
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {lead.firstName} {lead.lastName}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Email
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{lead.email}</dd>
          </div>

          {lead.phone && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{lead.phone}</dd>
            </div>
          )}

          {lead.company && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                Company
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {lead.company}
                {lead.position && ` • ${lead.position}`}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              Tags
            </dt>
            <dd className="mt-1">
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Last Contact
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {lead.lastContactDate
                ? format(lead.lastContactDate, 'PPP')
                : 'Not contacted yet'}
            </dd>
          </div>
        </dl>

        {lead.notes && (
          <div className="mt-6">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {lead.notes}
            </dd>
          </div>
        )}
      </div>
    </div>
  );
}</content>