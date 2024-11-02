import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Contact } from '../../types';

interface HighLevelContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  dateAdded: string;
  dateUpdated: string;
}

interface HighLevelApiError {
  code: string;
  message: string;
  status: number;
}

export class HighLevelService {
  private static readonly BASE_URL = 'https://rest.gohighlevel.com/v1';
  private apiKey: string;
  private accountId: string;

  constructor(apiKey: string, accountId: string) {
    if (!apiKey) throw new Error('API key is required');
    if (!accountId) throw new Error('Account ID is required');
    
    this.apiKey = apiKey;
    this.accountId = accountId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${HighLevelService.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const error: HighLevelApiError = {
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || 'An unknown error occurred',
          status: response.status
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to HighLevel API. Please check your internet connection.');
      }
      
      const apiError = error as HighLevelApiError;
      if (apiError.status === 401) {
        throw new Error('Invalid API key. Please check your credentials.');
      } else if (apiError.status === 403) {
        throw new Error('Access denied. Please check your API key permissions.');
      }
      
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test the API key by making a simple request to get location info
      await this.request('/locations/me');
      return true;
    } catch (error) {
      console.error('HighLevel connection test failed:', error);
      
      if (error instanceof Error) {
        // Re-throw with more specific error message
        throw new Error(`HighLevel API connection failed: ${error.message}`);
      }
      
      throw new Error('Failed to connect to HighLevel API');
    }
  }

  async syncContacts(): Promise<void> {
    try {
      // Get contacts from HighLevel with pagination
      const pageSize = 100;
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await this.request<{ contacts: HighLevelContact[]; meta: { total: number } }>(
          `/contacts/search?limit=${pageSize}&page=${page}`
        );
        
        const highLevelContacts = response.contacts;
        const total = response.meta.total;

        // Get existing contacts from Firestore
        const existingContactsQuery = query(
          collection(db, 'contacts'),
          where('accountId', '==', this.accountId),
          where('source', '==', 'highlevel')
        );
        
        const existingContactsSnapshot = await getDocs(existingContactsQuery);
        const existingContacts = new Map(
          existingContactsSnapshot.docs.map(doc => [
            doc.data().customFields?.highLevelId,
            { ref: doc.ref, data: doc.data() }
          ])
        );

        // Process each contact
        for (const hlContact of highLevelContacts) {
          const contactData: Partial<Contact> = {
            accountId: this.accountId,
            firstName: hlContact.firstName,
            lastName: hlContact.lastName,
            email: hlContact.email,
            phone: hlContact.phone,
            tags: hlContact.tags,
            type: 'contact',
            status: 'active',
            source: 'highlevel',
            customFields: {
              highLevelId: hlContact.id
            }
          };

          const existingContact = existingContacts.get(hlContact.id);
          
          if (existingContact) {
            // Update existing contact
            await updateDoc(existingContact.ref, {
              ...contactData,
              updatedAt: serverTimestamp()
            });
          } else {
            // Create new contact
            await addDoc(collection(db, 'contacts'), {
              ...contactData,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        }

        // Check if there are more pages
        hasMore = highLevelContacts.length === pageSize && page * pageSize < total;
        page++;
      }
    } catch (error) {
      console.error('Error syncing HighLevel contacts:', error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to sync contacts: ${error.message}`);
      }
      
      throw new Error('Failed to sync contacts from HighLevel');
    }
  }

  async getContactCount(): Promise<number> {
    try {
      const response = await this.request<{ meta: { total: number } }>('/contacts/search?limit=1');
      return response.meta.total;
    } catch (error) {
      console.error('Error getting contact count:', error);
      throw new Error('Failed to get contact count from HighLevel');
    }
  }
}