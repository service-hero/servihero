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
  orderBy,
  serverTimestamp,
  type Query,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Task } from '../../types';

export class TaskService {
  private static readonly COLLECTION = 'tasks';

  static async getAll(accountId: string, filters: {
    status?: Task['status'];
    priority?: Task['priority'];
    assigneeId?: string;
    dueDate?: Date;
  } = {}): Promise<Task[]> {
    try {
      // Check if required indexes exist
      const hasIndexes = await this.checkRequiredIndexes();
      if (!hasIndexes) {
        console.warn('Required indexes not found. Using basic query.');
        const basicQuery = query(
          collection(db, this.COLLECTION),
          where('accountId', '==', accountId)
        );
        const snapshot = await getDocs(basicQuery);
        return this.processTasksSnapshot(snapshot, filters);
      }

      // Build query with indexes
      let baseQuery = query(
        collection(db, this.COLLECTION),
        where('accountId', '==', accountId),
        orderBy('dueDate', 'asc'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(baseQuery);
      return this.processTasksSnapshot(snapshot, filters);
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Task | null> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        dueDate: docSnap.data().dueDate?.toDate(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      } as Task;
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  }

  static async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      // Ensure accountId is set for security rules
      if (!data.accountId) {
        throw new Error('accountId is required');
      }

      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return {
        id: docRef.id,
        ...newDoc.data(),
        dueDate: newDoc.data()?.dueDate?.toDate(),
        createdAt: newDoc.data()?.createdAt?.toDate(),
        updatedAt: newDoc.data()?.updatedAt?.toDate()
      } as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async update(id: string, data: Partial<Task>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      
      // Get current task to verify accountId
      const taskDoc = await getDoc(docRef);
      if (!taskDoc.exists()) {
        throw new Error('Task not found');
      }

      // Ensure accountId matches for security rules
      if (data.accountId && data.accountId !== taskDoc.data().accountId) {
        throw new Error('Cannot change accountId');
      }

      await updateDoc(docRef, {
        ...data,
        accountId: taskDoc.data().accountId, // Preserve original accountId
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async delete(id: string, accountId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Task not found');
      }

      // Verify account ownership
      if (docSnap.data().accountId !== accountId) {
        throw new Error('Permission denied');
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  private static processTasksSnapshot(snapshot: any, filters: any): Task[] {
    let tasks = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));

    // Apply filters in memory if needed
    if (filters.status) {
      tasks = tasks.filter(task => task.status === filters.status);
    }
    if (filters.priority) {
      tasks = tasks.filter(task => task.priority === filters.priority);
    }
    if (filters.assigneeId) {
      tasks = tasks.filter(task => task.assignee.id === filters.assigneeId);
    }
    if (filters.dueDate) {
      tasks = tasks.filter(task => task.dueDate <= filters.dueDate);
    }

    return tasks;
  }

  private static async checkRequiredIndexes(): Promise<boolean> {
    try {
      const testQuery = query(
        collection(db, this.COLLECTION),
        where('accountId', '==', 'test'),
        orderBy('dueDate', 'asc'),
        orderBy('createdAt', 'desc')
      );
      await getDocs(testQuery);
      return true;
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        return false;
      }
      throw error;
    }
  }
}