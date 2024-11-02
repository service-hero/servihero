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
import type { Account } from '../../types';

export class AccountService {
  private static readonly COLLECTION = 'accounts';

  static async getAll(parentAccountId?: string): Promise<Account[]> {
    const q = parentAccountId
      ? query(
          collection(db, this.COLLECTION),
          where('parentAccountId', '==', parentAccountId)
        )
      : query(
          collection(db, this.COLLECTION),
          where('parentAccountId', '==', null)
        );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertFromFirestore<Account>(doc));
  }

  static async getById(id: string): Promise<Account | null> {
    const docRef = doc(db, this.COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return convertFromFirestore<Account>(docSnap);
  }

  static async create(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return convertFromFirestore<Account>(newDoc);
  }

  static async update(id: string, data: Partial<Account>): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await deleteDoc(docRef);
  }
}