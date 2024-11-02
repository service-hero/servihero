import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface PipelineConfig {
  id: string;
  accountId: string;
  pipelineId: string;
  name: string;
  layout: 'default' | 'compact';
  visibleFields: string[];
  showProgress: boolean;
  showProbability: boolean;
  showValue: boolean;
  showDates: boolean;
  showOwner: boolean;
  showCompany: boolean;
}

export class PipelineConfigService {
  private static readonly COLLECTION = 'pipelineConfigs';

  static async getConfig(accountId: string, pipelineId: string): Promise<PipelineConfig | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('accountId', '==', accountId),
        where('pipelineId', '==', pipelineId)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const docData = snapshot.docs[0];
      return {
        id: docData.id,
        ...docData.data()
      } as PipelineConfig;
    } catch (error) {
      console.error('Error getting pipeline config:', error);
      throw error;
    }
  }

  static async saveConfig(config: Omit<PipelineConfig, 'id'>): Promise<PipelineConfig> {
    try {
      // Validate required fields
      if (!config.accountId || !config.pipelineId) {
        throw new Error('accountId and pipelineId are required');
      }

      // Clean and validate the data
      const configData = {
        accountId: String(config.accountId),
        pipelineId: String(config.pipelineId),
        name: String(config.name || 'Default Configuration'),
        layout: (config.layout === 'compact' ? 'compact' : 'default') as 'default' | 'compact',
        visibleFields: Array.isArray(config.visibleFields) ? 
          config.visibleFields.filter(field => typeof field === 'string') : 
          [],
        showProgress: Boolean(config.showProgress),
        showProbability: Boolean(config.showProbability),
        showValue: Boolean(config.showValue),
        showDates: Boolean(config.showDates),
        showOwner: Boolean(config.showOwner),
        showCompany: Boolean(config.showCompany)
      };

      // Check if config already exists
      const existingConfig = await this.getConfig(config.accountId, config.pipelineId);

      let docId: string;
      if (existingConfig) {
        // Update existing config
        docId = existingConfig.id;
        const docRef = doc(db, this.COLLECTION, docId);
        await setDoc(docRef, configData);
      } else {
        // Create new config
        const docRef = await addDoc(collection(db, this.COLLECTION), configData);
        docId = docRef.id;
      }

      // Return the complete config with the document ID
      return {
        id: docId,
        ...configData
      };
    } catch (error) {
      console.error('Error saving pipeline config:', error);
      throw error;
    }
  }

  static getDefaultConfig(pipelineId: string): Omit<PipelineConfig, 'id'> {
    return {
      accountId: '',
      pipelineId,
      name: 'Default Configuration',
      layout: 'default',
      visibleFields: ['value', 'probability', 'dates', 'owner', 'company'],
      showProgress: true,
      showProbability: true,
      showValue: true,
      showDates: true,
      showOwner: true,
      showCompany: true
    };
  }
}