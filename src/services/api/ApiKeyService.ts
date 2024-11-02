import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { generateSecureKey } from '../../utils/crypto';

interface ApiKey {
  id: string;
  key: string;
  name: string;
  accountId: string;
  permissions: string[];
  lastUsed?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ApiKeyService {
  private static readonly COLLECTION = 'apiKeys';

  static async createApiKey(data: {
    name: string;
    accountId: string;
    permissions: string[];
    expiresAt?: Date;
  }): Promise<ApiKey> {
    const key = await generateSecureKey();
    
    const apiKey = {
      key,
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, this.COLLECTION), apiKey);
    return { ...apiKey, id: docRef.id } as ApiKey;
  }

  static async validateApiKey(key: string): Promise<ApiKey | null> {
    const q = query(
      collection(db, this.COLLECTION),
      where('key', '==', key)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const apiKey = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as ApiKey;

    // Check if key is expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Update last used timestamp
    await updateDoc(doc(db, this.COLLECTION, apiKey.id), {
      lastUsed: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return apiKey;
  }

  static async getApiKeys(accountId: string): Promise<ApiKey[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('accountId', '==', accountId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApiKey[];
  }

  static async revokeApiKey(id: string): Promise<void> {
    await deleteDoc(doc(db, this.COLLECTION, id));
  }
}