// src/useFirestore.js
import { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

// ── Cases (Pipeline) ──────────────────────────────────────────────────────────
export function useCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, "cases"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setCases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);
  const addCase    = (data) => addDoc(collection(db, "cases"), { ...data, createdAt: serverTimestamp() });
  const updateCase = (id, data) => updateDoc(doc(db, "cases", id), data);
  const deleteCase = (id) => deleteDoc(doc(db, "cases", id));
  return { cases, loading, addCase, updateCase, deleteCase };
}

// ── Tasks (CITA Admin) ────────────────────────────────────────────────────────
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("dateLogged", "desc"));
    return onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);
  const addTask    = (data) => addDoc(collection(db, "tasks"), data);
  const updateTask = (id, data) => updateDoc(doc(db, "tasks", id), data);
  const deleteTask = (id) => deleteDoc(doc(db, "tasks", id));
  const markDone   = (id) => updateDoc(doc(db, "tasks", id), {
    dateCompleted: new Date().toISOString().split("T")[0]
  });
  return { tasks, loading, addTask, updateTask, deleteTask, markDone };
}

// ── Team Members ──────────────────────────────────────────────────────────────
export function useTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, "team"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      setTeam(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);
  const addMember    = (data) => addDoc(collection(db, "team"), {
    ...data, createdAt: serverTimestamp(), active: true
  });
  const updateMember = (id, data) => updateDoc(doc(db, "team", id), data);
  const deleteMember = (id) => deleteDoc(doc(db, "team", id));
  return { team, loading, addMember, updateMember, deleteMember };
}

// ── Practice Library (Documents) ─────────────────────────────────────────────
export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "documents"), orderBy("uploadedAt", "desc"));
    return onSnapshot(q, (snap) => {
      setDocuments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  // Upload file to Storage + save metadata to Firestore
  const uploadDocument = (file, meta, onProgress) => {
    return new Promise((resolve, reject) => {
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const storageRef = ref(storage, `documents/${meta.category}/${safeName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          if (onProgress) onProgress(pct);
        },
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const docRef = await addDoc(collection(db, "documents"), {
            ...meta,
            fileName:    file.name,
            fileSize:    file.size,
            fileType:    file.type,
            storagePath: uploadTask.snapshot.ref.fullPath,
            downloadURL: url,
            uploadedAt:  serverTimestamp(),
          });
          resolve(docRef);
        }
      );
    });
  };

  // Delete from Storage + Firestore
  const deleteDocument = async (document) => {
    if (document.storagePath) {
      try { await deleteObject(ref(storage, document.storagePath)); } catch (e) { /* already gone */ }
    }
    await deleteDoc(doc(db, "documents", document.id));
  };

  return { documents, loading, uploadDocument, deleteDocument };
}
