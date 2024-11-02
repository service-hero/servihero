import React from 'react';
import { Building2, Users, Briefcase, ExternalLink } from 'lucide-react';
import type { Agency } from '../../types';

interface AgencyCardProps {
  agency: Agency;
  onSelect: (agency: Agency) => void;
}

export default function AgencyCard({ agency, onSelect }: AgencyCardProps) {
  return (
    <div 
      onClick={() => onSelect(agency)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {agency.logo ? (
              <img
                src={agency.logo}
                alt={agency.name}
                className="h-12 w-12 rounded-lg object-contain bg-gray-50"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{agency.name}</h3>
              <p className="text-sm text-gray-500">{agency.industry}</p>
            </div>
          </div>
          {agency.website && (
            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            {agency.clientCount} Clients
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
            {agency.activeProjects} Projects
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Monthly Revenue</span>
            <span className="font-medium text-gray-900">
              ${agency.monthlyRevenue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${(agency.monthlyRevenue / agency.revenueTarget) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}