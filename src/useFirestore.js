// src/useFirestore.js
import { useEffect, useState } from "react";
import { db } from "./firebase"; // adjust path
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

export function useCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cases"), (snap) => {
      setCases(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addCase = (data) => addDoc(collection(db, "cases"), data);
  const updateCase = (id, data) => updateDoc(doc(db, "cases", id), data);
  const deleteCase = (id) => deleteDoc(doc(db, "cases", id));

  return { cases, loading, addCase, updateCase, deleteCase };
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addTask = (data) => addDoc(collection(db, "tasks"), data);
  const updateTask = (id, data) => updateDoc(doc(db, "tasks", id), data);
  const deleteTask = (id) => deleteDoc(doc(db, "tasks", id), id);

  // or implement properly:
  // const deleteTask = (id) => deleteDoc(doc(db, "tasks", id));

  const markDone = (id) => updateDoc(doc(db, "tasks", id), { dateCompleted: new Date().toISOString().slice(0,10) });

  return { tasks, loading, addTask, updateTask, deleteTask, markDone };
}
