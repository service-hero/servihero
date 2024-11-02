import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import LeadList from '../components/leads/LeadList';
import LeadForm from '../components/leads/LeadForm';
import { LeadScoringService } from '../services/leads/LeadScoringService';
import type { Lead } from '../types/leads';

const leadScoringService = new LeadScoringService();

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    position: 'CTO',
    source: 'website',
    status: 'new',
    score: 75,
    tags: ['hot', 'enterprise'],
    notes: 'Interested in our enterprise solution',
    lastContactDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');

  const handleAddLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      ...leadData,
      score: leadScoringService.calculateTotalScore({
        ...leadData,
        id: '',
        status: 'new',
        score: 0,
        tags: [],
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Lead).total,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Lead;

    setLeads([newLead, ...leads]);
    setShowForm(false);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = (
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your leads
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <LeadForm onSubmit={handleAddLead} />
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Lead['status'] | 'all')}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="unqualified">Unqualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      <LeadList
        leads={filteredLeads}
        onLeadSelect={(lead) => console.log('Selected lead:', lead)}
      />
    </div>
  );
}