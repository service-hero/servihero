import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  getFirestore
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ALL_METRICS } from '../../components/dashboard/MetricSelector';
import type { Metric } from '../../types/dashboard';

export class MetricService {
  private static readonly COLLECTION = 'metrics';

  static async seedInitialMetrics(accountId: string): Promise<void> {
    try {
      const metricsRef = collection(db, this.COLLECTION);
      const q = query(metricsRef, where('accountId', '==', accountId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const batch = writeBatch(db);
        
        ALL_METRICS.slice(0, 10).forEach((metric, index) => {
          const docRef = doc(collection(db, this.COLLECTION));
          batch.set(docRef, {
            ...metric,
            id: docRef.id,
            accountId,
            position: index,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });

        await batch.commit();
        console.log('Initial metrics seeded successfully');
      }
    } catch (error: any) {
      console.error('Error seeding initial metrics:', error);
      // Check if the error is due to missing index
      if (error.code === 'failed-precondition') {
        console.error('Missing required index. Please create the composite index for metrics collection.');
      }
      throw error;
    }
  }

  static async getMetrics(accountId: string): Promise<Metric[]> {
    try {
      const metricsRef = collection(db, this.COLLECTION);
      const q = query(
        metricsRef,
        where('accountId', '==', accountId),
        orderBy('position', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Metric[];
    } catch (error: any) {
      console.error('Error getting metrics:', error);
      // Check if the error is due to missing index
      if (error.code === 'failed-precondition') {
        console.error('Missing required index. Please create the composite index for metrics collection.');
      }
      throw error;
    }
  }

  static async updateMetric(metricId: string, data: Partial<Metric>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, metricId);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating metric:', error);
      throw error;
    }
  }

  static async updateMetricPositions(metrics: Metric[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      metrics.forEach((metric, index) => {
        const docRef = doc(db, this.COLLECTION, metric.id);
        batch.update(docRef, {
          position: index,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error updating metric positions:', error);
      throw error;
    }
  }

  // Helper method to check if required indexes exist
  static async checkRequiredIndexes(): Promise<boolean> {
    try {
      // Try to fetch metrics with the required index
      const metricsRef = collection(db, this.COLLECTION);
      const q = query(
        metricsRef,
        where('accountId', '==', 'test'),
        orderBy('position', 'asc')
      );
      await getDocs(q);
      return true;
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        return false;
      }
      throw error;
    }
  }
}