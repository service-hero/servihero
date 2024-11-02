import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Query, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import type { Contact } from '../types';

interface ContactFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  tags?: string[];
  type?: 'lead' | 'contact' | 'all';
  company?: string;
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContactFilters>({
    status: 'all',
    type: 'all'
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.accountId) return;

    setLoading(true);
    setError(null);

    try {
      // Base query with account filter and ordering
      let baseQuery = query(
        collection(db, 'contacts'),
        where('accountId', '==', user.accountId),
        orderBy('updatedAt', 'desc')
      );

      // Add status filter if not 'all'
      if (filters.status && filters.status !== 'all') {
        baseQuery = query(
          collection(db, 'contacts'),
          where('accountId', '==', user.accountId),
          where('status', '==', filters.status),
          orderBy('updatedAt', 'desc')
        );
      }

      // Add type filter if not 'all'
      if (filters.type && filters.type !== 'all') {
        baseQuery = query(
          collection(db, 'contacts'),
          where('accountId', '==', user.accountId),
          where('type', '==', filters.type),
          orderBy('updatedAt', 'desc')
        );
      }

      // Subscribe to query
      const unsubscribe = onSnapshot(
        baseQuery,
        (snapshot) => {
          let loadedContacts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            lastActivity: doc.data().lastActivity?.toDate()
          })) as Contact[];

          // Apply search filter in memory
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            loadedContacts = loadedContacts.filter(contact =>
              contact.firstName.toLowerCase().includes(searchLower) ||
              contact.lastName.toLowerCase().includes(searchLower) ||
              contact.email.toLowerCase().includes(searchLower) ||
              contact.company?.name?.toLowerCase().includes(searchLower) ||
              contact.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
          }

          // Apply tag filters in memory
          if (filters.tags && filters.tags.length > 0) {
            loadedContacts = loadedContacts.filter(contact =>
              filters.tags!.some(tag => contact.tags.includes(tag))
            );
          }

          // Apply company filter in memory
          if (filters.company) {
            loadedContacts = loadedContacts.filter(contact =>
              contact.company?.name.toLowerCase().includes(filters.company!.toLowerCase())
            );
          }

          setContacts(loadedContacts);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading contacts:', error);
          setError('Failed to load contacts');
          toast({
            title: "Error",
            description: "Failed to load contacts. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up contacts subscription:', error);
      setError('Failed to set up contacts subscription');
      setLoading(false);
    }
  }, [user?.accountId, filters, toast]);

  const getFilteredContacts = () => {
    return contacts;
  };

  const getContactsByTag = (tag: string) => {
    return contacts.filter(contact => contact.tags.includes(tag));
  };

  const getContactsByCompany = (companyId: string) => {
    return contacts.filter(contact => contact.company?.id === companyId);
  };

  const getActiveContacts = () => {
    return contacts.filter(contact => contact.status === 'active');
  };

  const getInactiveContacts = () => {
    return contacts.filter(contact => contact.status === 'inactive');
  };

  const getLeads = () => {
    return contacts.filter(contact => contact.type === 'lead');
  };

  const getContactStats = () => {
    return {
      total: contacts.length,
      active: getActiveContacts().length,
      inactive: getInactiveContacts().length,
      leads: getLeads().length
    };
  };

  return {
    contacts: getFilteredContacts(),
    loading,
    error,
    filters,
    setFilters,
    stats: getContactStats(),
    getContactsByTag,
    getContactsByCompany,
    getActiveContacts,
    getInactiveContacts,
    getLeads
  };
}