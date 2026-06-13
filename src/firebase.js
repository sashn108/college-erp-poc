import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, where } from "firebase/firestore";

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

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
export { onAuthStateChanged };

// ── User profile helpers ──────────────────────────────────────────────────────
export const saveUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ── Messages helpers ──────────────────────────────────────────────────────────
// conversationId = sorted join of two uids e.g. "uid1_uid2"
export const sendMessage = async (conversationId, message) => {
  await addDoc(collection(db, "messages", conversationId, "msgs"), {
    ...message,
    timestamp: serverTimestamp(),
  });
};

export const subscribeToMessages = (conversationId, callback) => {
  const q = query(
    collection(db, "messages", conversationId, "msgs"),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ── Feedback helpers ──────────────────────────────────────────────────────────
export const submitFeedback = async (studentUid, subjectCode, ratings) => {
  await setDoc(doc(db, "feedback", `${subjectCode}_${studentUid}`), {
    studentUid, subjectCode, ratings,
    submittedAt: serverTimestamp(),
  });
};

export const subscribeFeedbackAggregates = (subjectCode, callback) => {
  const q = query(collection(db, "feedback"), where("subjectCode", "==", subjectCode));
  return onSnapshot(q, (snap) => {
    const all = snap.docs.map(d => d.data());
    if (!all.length) { callback(null); return; }
    const keys = Object.keys(all[0].ratings || {});
    const avg = {};
    keys.forEach(k => {
      avg[k] = +(all.reduce((s, d) => s + (d.ratings[k] || 0), 0) / all.length).toFixed(1);
    });
    callback({ avg, count: all.length });
  });
};

// ── Grievance helpers ─────────────────────────────────────────────────────────
export const submitGrievance = async (data) => {
  return await addDoc(collection(db, "grievances"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "Pending",
  });
};

export const subscribeGrievances = (uid, callback) => {
  const q = query(collection(db, "grievances"), where("uid", "==", uid));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

// ── Notifications helper ──────────────────────────────────────────────────────
export const pushNotification = async (toUid, notif) => {
  await addDoc(collection(db, "notifications", toUid, "items"), {
    ...notif,
    read: false,
    timestamp: serverTimestamp(),
  });
};

export const subscribeNotifications = (uid, callback) => {
  const q = query(
    collection(db, "notifications", uid, "items"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
