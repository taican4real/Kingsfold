import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../components/AuthProvider';

export function useCMS<T>(nodeName: string, defaultData: T) {
  const [data, setData] = useState<T>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'cmsNodes', nodeName);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          if (isMounted) setData({ ...defaultData, ...docSnap.data() as Partial<T> });
        } else {
          // Document doesn't exist, use default
          if (isMounted) setData(defaultData);
        }
      } catch (err: any) {
        try {
          handleFirestoreError(err, OperationType.GET, `cmsNodes/${nodeName}`);
        } catch (e) {
          // Log permission or other major errors to console but do not crash the React rendering
          console.warn(`CMS node '${nodeName}' loading error (falling back to default template):`, e);
        }
        if (isMounted) {
          setData(defaultData);
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchData();
    return () => { isMounted = false; };
  }, [nodeName]);

  const updateData = async (newData: Partial<T>) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'cmsNodes', nodeName);
      const updatedData = { ...data, ...newData };
      // Overwrite or create
      await setDoc(docRef, updatedData as any, { merge: true });
      setData(updatedData as T);
      return true;
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `cmsNodes/${nodeName}`);
      } catch (e) {
        console.error("CMS update failed:", e);
      }
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { data, updateData, loading, error };
}
