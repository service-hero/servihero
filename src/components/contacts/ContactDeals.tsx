// src/components/contacts/ContactDeals.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  getDocs, 
  writeBatch,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowUpRight, Trash2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import type { ContactDeal } from '../../types';

interface ContactDealsProps {
  contactId: string;
}

export default function ContactDeals({ contactId }: ContactDealsProps) {
  const [deals, setDeals] = useState<ContactDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.accountId || !contactId) return;

    const q = query(
      collection(db, 'contactDeals'),
      where('contactId', '==', contactId),
      where('accountId', '==', user.accountId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedDeals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        closingDate: doc.data().closingDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ContactDeal[];

      setDeals(loadedDeals);
      setLoading(false);
    }, (error) => {
      console.error('Error loading deals:', error);
      toast({
        title: "Error",
        description: "Failed to load deals",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [contactId, user?.accountId, toast]);

  const handleDeleteDeal = async (dealId: string) => {
    if (!user?.accountId) return;

    try {
      setDeleting(dealId);
      
      const batch = writeBatch(db);

      // First, get the contact deal document
      const contactDealQuery = query(
        collection(db, 'contactDeals'),
        where('dealId', '==', dealId),
        where('accountId', '==', user.accountId)
      );
      
      const contactDealSnapshot = await getDocs(contactDealQuery);
      
      if (contactDealSnapshot.empty) {
        throw new Error('Contact deal not found');
      }

      // Delete all related contact deal documents
      contactDealSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
        
        // Update the document with accountId and timestamp for security rules
        batch.update(doc.ref, {
          accountId: user.accountId,
          updatedAt: serverTimestamp()
        });
      });

      // Delete the main deal document
      const dealRef = doc(db, 'deals', dealId);
      // Update the deal with accountId for security rules
      batch.update(dealRef, {
        accountId: user.accountId,
        updatedAt: serverTimestamp()
      });
      batch.delete(dealRef);

      // Commit the batch
      await batch.commit();

      toast({
        title: "Success",
        description: "Deal deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error deleting deal:', error);
      toast({
        title: "Error",
        description: error.code === 'permission-denied' 
          ? "You don't have permission to delete this deal"
          : "Failed to delete deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No deals found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <motion.div
          key={deal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{deal.title}</h4>
              <p className="text-sm text-gray-500">
                Closing: {deal.closingDate.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${deal.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{deal.status}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteDeal(deal.dealId)}
                disabled={deleting === deal.dealId}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${deal.probability}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
