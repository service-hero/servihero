import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, convertFromFirestore } from '../../lib/firebase';
import type { Lead } from '../../types/leads';

export class LeadService {
  private static readonly COLLECTION = 'leads';

  static async getAll(accountId: string): Promise<Lead[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('accountId', '==', accountId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertFromFirestore<Lead>(doc));
  }

  static async getById(id: string): Promise<Lead | null> {
    const docRef = doc(db, this.COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return convertFromFirestore<Lead>(docSnap);
  }

  static async create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return convertFromFirestore<Lead>(newDoc);
  }

  static async update(id: string, data: Partial<Lead>): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async updateStatus(id: string, status: Lead['status']): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await deleteDoc(docRef);
  }
}