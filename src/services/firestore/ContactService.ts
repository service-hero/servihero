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
import type { Contact } from '../../types';

export class ContactService {
  private static readonly COLLECTION = 'contacts';

  static async getAll(accountId: string): Promise<Contact[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('accountId', '==', accountId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertFromFirestore<Contact>(doc));
  }

  static async getById(id: string): Promise<Contact | null> {
    const docRef = doc(db, this.COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return convertFromFirestore<Contact>(docSnap);
  }

  static async create(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return convertFromFirestore<Contact>(newDoc);
  }

  static async update(id: string, data: Partial<Contact>): Promise<void> {
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