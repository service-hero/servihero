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
import type { User } from '../../types';

export class UserService {
  private static readonly COLLECTION = 'users';

  static async getAll(accountId: string): Promise<User[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('accountId', '==', accountId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertFromFirestore<User>(doc));
  }

  static async getById(id: string): Promise<User | null> {
    const docRef = doc(db, this.COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return convertFromFirestore<User>(docSnap);
  }

  static async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return convertFromFirestore<User>(newDoc);
  }

  static async update(id: string, data: Partial<User>): Promise<void> {
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