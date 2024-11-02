import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  type Query,
  type DocumentData,
  type WhereFilterOp
} from 'firebase/firestore';
import { db, getCached, setCache, handleFirestoreError } from '../lib/firebase';

type Constraint = [string, WhereFilterOp, any];

interface UseFirestoreOptions {
  cacheKey?: string;
  cacheDuration?: number;
  realtimeUpdates?: boolean;
}

export function useFirestore<T>(
  collectionName: string,
  constraints?: Constraint[],
  options: UseFirestoreOptions = {}
) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Check cache first
      if (options.cacheKey) {
        const cached = getCached<T[]>(options.cacheKey);
        if (cached) {
          setDocuments(cached);
          setLoading(false);
          return;
        }
      }

      let q: Query<DocumentData> = collection(db, collectionName);

      if (constraints) {
        constraints.forEach(([field, operator, value]) => {
          q = query(q, where(field, operator, value));
        });
      }

      if (options.realtimeUpdates !== false) {
        // Set up realtime listener
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const results: T[] = [];
            snapshot.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() } as T);
            });
            setDocuments(results);
            if (options.cacheKey) {
              setCache(options.cacheKey, results);
            }
            setLoading(false);
          },
          (err) => {
            console.error('Firestore subscription error:', err);
            setError(err.message);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } else {
        // One-time fetch
        const snapshot = await q.get();
        const results: T[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as T);
        });
        setDocuments(results);
        if (options.cacheKey) {
          setCache(options.cacheKey, results);
        }
        setLoading(false);
      }
    } catch (err: any) {
      handleFirestoreError(err);
    }
  }, [collectionName, constraints, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetchData();
  }, [fetchData]);

  return { documents, loading, error, refresh };
}