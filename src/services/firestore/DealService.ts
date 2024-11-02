import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Deal } from '../../types';
import type { UserRole } from '../../types/auth';

export class DealService {
  private static readonly COLLECTION = 'deals';

  static async getAll(accountId: string, pipelineId: string): Promise<Deal[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('accountId', '==', accountId),
        where('pipelineId', '==', pipelineId),
        orderBy('stage'),
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        expectedCloseDate: doc.data().expectedCloseDate?.toDate()
      })) as Deal[];
    } catch (error) {
      console.error('Error getting deals:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Deal | null> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
        expectedCloseDate: docSnap.data().expectedCloseDate?.toDate()
      } as Deal;
    } catch (error) {
      console.error('Error getting deal:', error);
      throw error;
    }
  }

  static async create(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return {
        id: docRef.id,
        ...newDoc.data(),
        createdAt: newDoc.data()?.createdAt?.toDate(),
        updatedAt: newDoc.data()?.updatedAt?.toDate(),
        expectedCloseDate: newDoc.data()?.expectedCloseDate?.toDate()
      } as Deal;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  static async update(id: string, data: Partial<Deal>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  }

  static async updateStage(id: string, stage: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      await updateDoc(docRef, {
        stage,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating deal stage:', error);
      throw error;
    }
  }

  static async delete(id: string, accountId: string, userRole: UserRole): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Get and verify the deal
      const dealRef = doc(db, this.COLLECTION, id);
      const dealDoc = await getDoc(dealRef);
      
      if (!dealDoc.exists()) {
        throw new Error('Deal not found');
      }

      // First update the deal with the accountId to satisfy security rules
      await updateDoc(dealRef, {
        accountId,
        updatedAt: serverTimestamp()
      });

      // Get associated contact deals
      const contactDealsQuery = query(
        collection(db, 'contactDeals'),
        where('dealId', '==', id),
        where('accountId', '==', accountId)
      );
      
      const contactDealsSnapshot = await getDocs(contactDealsQuery);

      // Delete the deal
      batch.delete(dealRef);

      // Delete all associated contact deals
      contactDealsSnapshot.docs.forEach(doc => {
        // Update each contact deal with accountId before deletion
        batch.update(doc.ref, { accountId, updatedAt: serverTimestamp() });
        batch.delete(doc.ref);
      });

      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }
}
