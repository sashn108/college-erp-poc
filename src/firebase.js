import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTQvdFAqV2yDQLz3Q2nUuIFFV5MWgjXLA",
  authDomain: "iter-erp.firebaseapp.com",
  projectId: "iter-erp",
  storageBucket: "iter-erp.firebasestorage.app",
  messagingSenderId: "95016287041",
  appId: "1:95016287041:web:847b6dfab972b19d86bfc0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
export { onAuthStateChanged, serverTimestamp };

// ── User profile ──────────────────────────────────────────────────────────────
export const saveUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ── Pending users (admin approval) ───────────────────────────────────────────
export const getPendingUsers = (callback) => {
  const q = query(collection(db, "users"), where("status", "==", "pending"));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const approveUser = async (uid, role, extraData = {}) => {
  await updateDoc(doc(db, "users", uid), { status: "approved", role, ...extraData });
};
export const rejectUser = async (uid) => {
  await updateDoc(doc(db, "users", uid), { status: "rejected" });
};

// ── Messages ──────────────────────────────────────────────────────────────────
export const sendMessage = async (conversationId, message) => {
  await addDoc(collection(db, "messages", conversationId, "msgs"), {
    ...message, timestamp: serverTimestamp(),
  });
};
export const subscribeToMessages = (conversationId, callback) => {
  const q = query(collection(db, "messages", conversationId, "msgs"), orderBy("timestamp", "asc"));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

// ── Feedback ──────────────────────────────────────────────────────────────────
export const submitFeedback = async (studentUid, subjectCode, ratings) => {
  await setDoc(doc(db, "feedback", `${subjectCode}_${studentUid}`), {
    studentUid, subjectCode, ratings, submittedAt: serverTimestamp(),
  });
};
export const subscribeFeedbackAggregates = (subjectCode, callback) => {
  const q = query(collection(db, "feedback"), where("subjectCode", "==", subjectCode));
  return onSnapshot(q, snap => {
    const all = snap.docs.map(d => d.data());
    if (!all.length) { callback(null); return; }
    const keys = Object.keys(all[0].ratings || {});
    const avg = {};
    keys.forEach(k => { avg[k] = +(all.reduce((s, d) => s + (d.ratings[k] || 0), 0) / all.length).toFixed(1); });
    callback({ avg, count: all.length });
  });
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const pushNotification = async (toUid, notif) => {
  await addDoc(collection(db, "notifications", toUid, "items"), {
    ...notif, read: false, timestamp: serverTimestamp(),
  });
};
export const subscribeNotifications = (uid, callback) => {
  const q = query(collection(db, "notifications", uid, "items"), orderBy("timestamp", "desc"));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
