import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Subscription, Usage, Invoice } from '../../types/billing';

export class SubscriptionService {
  private static readonly SUBSCRIPTIONS_COLLECTION = 'subscriptions';
  private static readonly USAGE_COLLECTION = 'usage';
  private static readonly INVOICES_COLLECTION = 'invoices';

  static async createSubscription(data: Partial<Subscription>): Promise<Subscription> {
    try {
      const docRef = await addDoc(collection(db, this.SUBSCRIPTIONS_COLLECTION), {
        ...data,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return {
        id: docRef.id,
        ...newDoc.data(),
        createdAt: newDoc.data()?.createdAt?.toDate(),
        updatedAt: newDoc.data()?.updatedAt?.toDate(),
        currentPeriodStart: newDoc.data()?.currentPeriodStart?.toDate(),
        currentPeriodEnd: newDoc.data()?.currentPeriodEnd?.toDate(),
      } as Subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async trackUsage(subscriptionId: string, feature: string, quantity: number): Promise<Usage> {
    try {
      const docRef = await addDoc(collection(db, this.USAGE_COLLECTION), {
        subscriptionId,
        feature,
        quantity,
        timestamp: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return {
        id: docRef.id,
        ...newDoc.data(),
        timestamp: newDoc.data()?.timestamp?.toDate(),
      } as Usage;
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw error;
    }
  }

  static async generateInvoice(subscriptionId: string): Promise<Invoice> {
    try {
      // Get subscription
      const subscriptionDoc = await getDoc(doc(db, this.SUBSCRIPTIONS_COLLECTION, subscriptionId));
      if (!subscriptionDoc.exists()) throw new Error('Subscription not found');
      
      const subscription = {
        id: subscriptionDoc.id,
        ...subscriptionDoc.data()
      } as Subscription;

      // Get usage data
      const usageQuery = query(
        collection(db, this.USAGE_COLLECTION),
        where('subscriptionId', '==', subscriptionId)
      );
      const usageSnapshot = await getDocs(usageQuery);
      const usage = usageSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate line items
      const lineItems = [
        {
          description: 'Base Subscription',
          quantity: subscription.quantity,
          unitPrice: 99, // Base price per seat
          amount: subscription.quantity * 99,
          type: 'subscription' as const,
        },
        ...subscription.addons.map(addon => ({
          description: `Addon: ${addon.name}`,
          quantity: addon.quantity,
          unitPrice: addon.unitPrice,
          amount: addon.quantity * addon.unitPrice,
          type: 'addon' as const,
        })),
      ];

      // Create invoice
      const docRef = await addDoc(collection(db, this.INVOICES_COLLECTION), {
        customerId: subscription.customerId,
        subscriptionId,
        amount: lineItems.reduce((sum, item) => sum + item.amount, 0),
        status: 'draft',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lineItems,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return {
        id: docRef.id,
        ...newDoc.data(),
        createdAt: newDoc.data()?.createdAt?.toDate(),
        updatedAt: newDoc.data()?.updatedAt?.toDate(),
        dueDate: newDoc.data()?.dueDate?.toDate(),
      } as Invoice;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }
}