import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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

  const addDocument = async (data) => {
    await addDoc(collection(db, collectionName), { ...data, createdAt: new Date() });
  };

  const updateDocument = async (id, updates) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updates);
  };

  const deleteDocument = async (id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  };

  const markDone = async (id) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { dateCompleted: new Date().toISOString().split('T')[0] });
  };

  return { docs, addDocument, updateDocument, deleteDocument, markDone };
};
