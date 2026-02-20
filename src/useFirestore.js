/import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';/ src/useFirestore.js
// Custom hooks that replace in-memory state with real Firebase Firestore data
// ─────────────────────────────────────────────────────────────────────────────
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Cases (Pipeline) ──────────────────────────────────────────────────────────
export function useCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "cases"), orderBy("added", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setCases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const addCase = async (data) => {
    await addDoc(collection(db, "cases"), {
      ...data,
      added: serverTimestamp(),
    });
  };

  const updateCase = async (id, data) => {
    await updateDoc(doc(db, "cases", id), data);
  };

  const deleteCase = async (id) => {
    await deleteDoc(doc(db, "cases", id));
  };

  return { cases, loading, addCase, updateCase, deleteCase };
}

// ── Tasks (CITA Admin) ────────────────────────────────────────────────────────
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("dateLogged", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const addTask = async (data) => {
    await addDoc(collection(db, "tasks"), data);
  };

  const updateTask = async (id, data) => {
    await updateDoc(doc(db, "tasks", id), data);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const markDone = async (id) => {
    const today = new Date().toISOString().split("T")[0];
    await updateDoc(doc(db, "tasks", id), { dateCompleted: today });
  };

  return { tasks, loading, addTask, updateTask, deleteTask, markDone };
}

