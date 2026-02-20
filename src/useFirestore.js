import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export const useFirestore = (collectionName) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let documents = [];
      snapshot.forEach(doc => {
        documents.push({ ...doc.data(), id: doc.id });
      });
      setDocs(documents);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const addDocument = async (doc) => {
    await addDoc(collection(db, collectionName), {
      ...doc,
      createdAt: new Date()
    });
  };

  return { docs, addDocument };
};
