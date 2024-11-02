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
  type DocumentData,
  type QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Integration, IntegrationType } from '../../types/integrations';

export class IntegrationService {
  private static readonly COLLECTION = 'integrations';
  private static readonly SYNC_LOGS_COLLECTION = 'integrationSyncLogs';

  static async createIntegration(
    type: IntegrationType,
    name: string,
    config: Record<string, any>
  ): Promise<Integration> {
    try {
      // Encrypt sensitive data like API keys
      const encryptedConfig = await this.encryptSensitiveData(config);

      const docRef = await addDoc(collection(db, this.COLLECTION), {
        type,
        name,
        config: encryptedConfig,
        status: 'active',
        lastSync: null,
        error: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return this.convertToIntegration(newDoc);
    } catch (error) {
      console.error('Error creating integration:', error);
      throw error;
    }
  }

  static async getIntegrations(accountId: string): Promise<Integration[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('accountId', '==', accountId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.convertToIntegration(doc));
    } catch (error) {
      console.error('Error getting integrations:', error);
      throw error;
    }
  }

  static async updateIntegrationStatus(
    id: string,
    status: 'active' | 'inactive' | 'error',
    error?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      await updateDoc(docRef, {
        status,
        ...(error && { error }),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating integration status:', error);
      throw error;
    }
  }

  static async logSync(
    integrationId: string,
    accountId: string,
    success: boolean,
    details: Record<string, any>
  ): Promise<void> {
    try {
      await addDoc(collection(db, this.SYNC_LOGS_COLLECTION), {
        integrationId,
        accountId,
        success,
        details,
        timestamp: serverTimestamp(),
      });

      // Update last sync timestamp on integration
      const docRef = doc(db, this.COLLECTION, integrationId);
      await updateDoc(docRef, {
        lastSync: serverTimestamp(),
        ...(success ? { error: null } : { error: details.error }),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error logging sync:', error);
      throw error;
    }
  }

  private static async encryptSensitiveData(
    config: Record<string, any>
  ): Promise<Record<string, any>> {
    // In a real app, implement proper encryption
    // For now, we'll just add a marker to indicate it should be encrypted
    const encrypted = { ...config };
    if (encrypted.apiKey) {
      encrypted.apiKey = `encrypted:${encrypted.apiKey}`;
    }
    return encrypted;
  }

  private static async decryptSensitiveData(
    config: Record<string, any>
  ): Promise<Record<string, any>> {
    // In a real app, implement proper decryption
    // For now, we'll just remove the marker
    const decrypted = { ...config };
    if (decrypted.apiKey?.startsWith('encrypted:')) {
      decrypted.apiKey = decrypted.apiKey.replace('encrypted:', '');
    }
    return decrypted;
  }

  private static convertToIntegration(
    doc: QueryDocumentSnapshot<DocumentData>
  ): Integration {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      name: data.name,
      config: data.config,
      status: data.status,
      lastSync: data.lastSync?.toDate(),
      error: data.error,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Integration;
  }
}