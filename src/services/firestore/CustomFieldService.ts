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
  writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { CustomField, FieldValue } from '../../types/customFields';

export class CustomFieldService {
  private static readonly FIELDS_COLLECTION = 'customFields';
  private static readonly VALUES_COLLECTION = 'fieldValues';

  static async getFields(entityType: CustomField['entityType']): Promise<CustomField[]> {
    try {
      const q = query(
        collection(db, this.FIELDS_COLLECTION),
        where('entityType', '==', entityType)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as CustomField[];
    } catch (error) {
      console.error('Error getting custom fields:', error);
      throw error;
    }
  }

  static async createField(data: Partial<CustomField>): Promise<CustomField> {
    try {
      const docRef = await addDoc(collection(db, this.FIELDS_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return {
        id: docRef.id,
        ...newDoc.data(),
        createdAt: newDoc.data()?.createdAt?.toDate(),
        updatedAt: newDoc.data()?.updatedAt?.toDate(),
      } as CustomField;
    } catch (error) {
      console.error('Error creating custom field:', error);
      throw error;
    }
  }

  static async updateField(id: string, data: Partial<CustomField>): Promise<void> {
    try {
      const docRef = doc(db, this.FIELDS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating custom field:', error);
      throw error;
    }
  }

  static async deleteField(id: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Delete the field
      const fieldRef = doc(db, this.FIELDS_COLLECTION, id);
      batch.delete(fieldRef);
      
      // Delete all values for this field
      const valuesQuery = query(
        collection(db, this.VALUES_COLLECTION),
        where('fieldId', '==', id)
      );
      const snapshot = await getDocs(valuesQuery);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error deleting custom field:', error);
      throw error;
    }
  }

  static async getFieldValues(entityId: string): Promise<Record<string, any>> {
    try {
      const q = query(
        collection(db, this.VALUES_COLLECTION),
        where('entityId', '==', entityId)
      );
      
      const snapshot = await getDocs(q);
      const values: Record<string, any> = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        values[data.fieldId] = data.value;
      });

      return values;
    } catch (error) {
      console.error('Error getting field values:', error);
      throw error;
    }
  }

  static async setFieldValue(entityId: string, fieldId: string, value: any): Promise<void> {
    try {
      const q = query(
        collection(db, this.VALUES_COLLECTION),
        where('entityId', '==', entityId),
        where('fieldId', '==', fieldId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        await addDoc(collection(db, this.VALUES_COLLECTION), {
          entityId,
          fieldId,
          value,
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(snapshot.docs[0].ref, {
          value,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error setting field value:', error);
      throw error;
    }
  }
}