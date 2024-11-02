import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface Account {
  id: string;
  name: string;
  type: 'agency' | 'client';
  logo?: string;
  userIds: string[];
  parentAccountId?: string;
  industry?: string;
  website?: string;
  branding?: {
    primaryColor?: string;
    logo?: string;
    companyName?: string;
  };
}

interface AccountContextType {
  currentAccount: Account | null;
  accounts: Account[];
  switchAccount: (account: Account) => void;
  loading: boolean;
  error: string | null;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First try to get the user's primary account
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const primaryAccountId = userDoc.data()?.primaryAccountId;

        // Get all accounts the user has access to
        const accountsRef = collection(db, 'accounts');
        const q = query(accountsRef, where('userIds', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        
        const loadedAccounts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Account[];

        // For testing purposes, create mock sub-accounts if none exist
        if (loadedAccounts.length === 1 && loadedAccounts[0].type === 'agency') {
          const mockSubAccounts: Account[] = [
            {
              id: 'sub-account-1',
              name: 'Client A - Marketing Agency',
              type: 'client',
              industry: 'Marketing',
              userIds: [user.uid],
              parentAccountId: loadedAccounts[0].id,
              website: 'https://clienta.com',
              branding: {
                primaryColor: '#2563eb',
                companyName: 'Client A Marketing'
              }
            },
            {
              id: 'sub-account-2',
              name: 'Client B - Tech Solutions',
              type: 'client',
              industry: 'Technology',
              userIds: [user.uid],
              parentAccountId: loadedAccounts[0].id,
              website: 'https://clientb.com',
              branding: {
                primaryColor: '#7c3aed',
                companyName: 'Client B Solutions'
              }
            }
          ];

          setAccounts([...loadedAccounts, ...mockSubAccounts]);
          
          // Set current account to the primary agency account
          setCurrentAccount(loadedAccounts[0]);
        } else {
          setAccounts(loadedAccounts);
          
          // Set current account based on primary account or first available
          if (loadedAccounts.length > 0) {
            const primaryAccount = loadedAccounts.find(acc => acc.id === primaryAccountId);
            setCurrentAccount(primaryAccount || loadedAccounts[0]);
          }
        }
      } catch (err) {
        console.error('Error loading accounts:', err);
        setError('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, [user?.uid]);

  const switchAccount = (account: Account) => {
    setCurrentAccount(account);
    // Store the last selected account in localStorage
    localStorage.setItem('lastSelectedAccountId', account.id);
  };

  return (
    <AccountContext.Provider 
      value={{ 
        currentAccount, 
        accounts, 
        switchAccount,
        loading,
        error
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}