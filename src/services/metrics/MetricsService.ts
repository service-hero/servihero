import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Metric, MetricUpdate } from '../../types/dashboard';

export class MetricsService {
  private static readonly COLLECTION = 'metrics';

  static async getMetrics(accountId: string): Promise<Metric[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('accountId', '==', accountId)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Metric[];
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  static async updateMetric(metricId: string, update: MetricUpdate): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, metricId);
      await updateDoc(docRef, {
        value: update.value,
        change: update.change,
        changeType: update.changeType,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating metric:', error);
      throw error;
    }
  }

  static calculateChange(currentValue: number, previousValue: number): {
    change: number;
    changeType: 'increase' | 'decrease';
  } {
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return {
      change: Math.abs(Number(change.toFixed(1))),
      changeType: change >= 0 ? 'increase' : 'decrease',
    };
  }
}