import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  Grid, 
  List,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ContactTable from './ContactTable';
import ContactGrid from './ContactGrid';
import ContactFilters from './ContactFilters';
import ContactFormModal from '../modals/ContactFormModal';
import { useContacts } from '../../hooks/useContacts';
import type { Contact } from '../../types';

interface ContactListViewProps {
  onContactSelect: (contact: Contact) => void;
}

export default function ContactListView({ onContactSelect }: ContactListViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const { contacts, loading, filters, setFilters } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setShowAddContact(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search contacts..."
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-gray-100' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimateFilters show={showFilters}>
        <ContactFilters
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      </AnimateFilters>

      {/* Contact List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : viewMode === 'list' ? (
          <ContactTable contacts={contacts} onContactSelect={onContactSelect} />
        ) : (
          <ContactGrid contacts={contacts} onContactSelect={onContactSelect} />
        )}
      </div>

      {/* Add Contact Modal */}
      <ContactFormModal 
        open={showAddContact} 
        onOpenChange={setShowAddContact} 
      />
    </div>
  );
}

function AnimateFilters({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: show ? 'auto' : 0,
        opacity: show ? 1 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      className="overflow-hidden border-b"
    >
      {children}
    </motion.div>
  );
}