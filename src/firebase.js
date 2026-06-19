import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
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

// ── Admin-side user creation ──────────────────────────────────────────────────
// Uses a temporary secondary Firebase app instance so creating a new Auth user
// does NOT sign out / replace the admin's current session (a client-SDK quirk:
// createUserWithEmailAndPassword auto-signs-in as the new user on the app it runs on).
export const adminCreateUser = async (email, password, profileData) => {
  const tempAppName = `admin-create-${Date.now()}`;
  const tempApp = initializeApp(firebaseConfig, tempAppName);
  const tempAuth = getAuth(tempApp);
  try {
    const cred = await createUserWithEmailAndPassword(tempAuth, email, password);
    const uid = cred.user.uid;
    await setDoc(doc(db, "users", uid), { uid, email, ...profileData }, { merge: true });
    await signOut(tempAuth);
    return { uid, email };
  } finally {
    await deleteApp(tempApp);
  }
};

// ── User profile ──────────────────────────────────────────────────────────────
export const saveUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ── Pending users (admin approval) ───────────────────────────────────────────
export const getPendingUsers = (callback, onError) => {
  const q = query(collection(db, "users"), where("status", "==", "pending"));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }))),
    err => { console.error("getPendingUsers error:", err); if (onError) onError(err); }
  );
};
// DEBUG: fetch ALL users regardless of status, to diagnose missing pending users
export const getAllUsersDebug = (callback, onError) => {
  return onSnapshot(collection(db, "users"),
    snap => callback(snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }))),
    err => { console.error("getAllUsersDebug error:", err); if (onError) onError(err); }
  );
};
// Repair: backfill status field for any user doc missing it (legacy/broken records)
export const repairMissingStatus = async () => {
  const snap = await getDocs(collection(db, "users"));
  const fixes = [];
  for (const d of snap.docs) {
    const data = d.data();
    if (data.status === undefined || data.status === null) {
      const inferredStatus = data.role === "admin" ? "approved" : "pending";
      await setDoc(doc(db, "users", d.id), { status: inferredStatus }, { merge: true });
      fixes.push({ id: d.id, email: data.email, newStatus: inferredStatus });
    }
  }
  return fixes;
};

// ── Subject enrollment (faculty enrolls students; students read their own) ───
// Doc id pattern: `${subjectCode}_${studentRollOrEmail}` for natural de-duplication.
const enrollmentDocId = (subjectCode, rollOrEmail) =>
  `${subjectCode}_${rollOrEmail}`.replace(/[\/\s]+/g, "_");

export const enrollStudent = async (subjectCode, subjectName, facultyUid, facultyName, student) => {
  const id = enrollmentDocId(subjectCode, student.roll || student.email);
  await setDoc(doc(db, "enrollments", id), {
    subjectCode, subjectName, facultyUid, facultyName,
    studentRoll: student.roll || "", studentEmail: student.email || "",
    studentName: student.name || "",
    enrolledAt: new Date().toISOString(),
  }, { merge: true });
  return id;
};

export const unenrollStudent = async (subjectCode, rollOrEmail) => {
  const id = enrollmentDocId(subjectCode, rollOrEmail);
  await setDoc(doc(db, "enrollments", id), { removed: true, removedAt: new Date().toISOString() }, { merge: true });
};

// Faculty-side: live roster for one subject (excludes removed)
export const subscribeSubjectEnrollments = (subjectCode, callback, onError) => {
  const q = query(collection(db, "enrollments"), where("subjectCode", "==", subjectCode));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => !e.removed)),
    err => { console.error("subscribeSubjectEnrollments error:", err); if (onError) onError(err); }
  );
};

// Student-side: live list of subjects this student is enrolled in, matched by email or roll
export const subscribeMyEnrollments = (studentEmail, studentRoll, callback, onError) => {
  const qByEmail = studentEmail ? query(collection(db, "enrollments"), where("studentEmail", "==", studentEmail)) : null;
  const qByRoll = studentRoll ? query(collection(db, "enrollments"), where("studentRoll", "==", studentRoll)) : null;
  let latestByEmail = [], latestByRoll = [];
  const merge = () => {
    const all = [...latestByEmail, ...latestByRoll].filter(e => !e.removed);
    const seen = new Set();
    const deduped = all.filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; });
    callback(deduped);
  };
  const unsubs = [];
  if (qByEmail) unsubs.push(onSnapshot(qByEmail,
    snap => { latestByEmail = snap.docs.map(d => ({ id: d.id, ...d.data() })); merge(); },
    err => { console.error("subscribeMyEnrollments(email) error:", err); if (onError) onError(err); }
  ));
  if (qByRoll) unsubs.push(onSnapshot(qByRoll,
    snap => { latestByRoll = snap.docs.map(d => ({ id: d.id, ...d.data() })); merge(); },
    err => { console.error("subscribeMyEnrollments(roll) error:", err); if (onError) onError(err); }
  ));
  return () => unsubs.forEach(u => u());
};

// ── Attendance (faculty marks; student reads own record) ─────────────────────
// Doc id pattern: `${subjectCode}_${rollOrEmail}_${dateStr}` for natural de-duplication.
const attendanceDocId = (subjectCode, rollOrEmail, dateStr) =>
  `${subjectCode}_${rollOrEmail}_${dateStr}`.replace(/[\/\s]+/g, "_");

export const markAttendance = async (subjectCode, subjectName, dateStr, student, status, facultyName) => {
  const id = attendanceDocId(subjectCode, student.roll || student.email, dateStr);
  await setDoc(doc(db, "attendanceRecords", id), {
    subjectCode, subjectName, dateStr, status, facultyName,
    studentRoll: student.roll || "", studentEmail: student.email || "", studentName: student.name || "",
    markedAt: new Date().toISOString(),
  }, { merge: true });
};

// Faculty-side: live attendance for one subject (all students, all dates)
export const subscribeSubjectAttendance = (subjectCode, callback, onError) => {
  const q = query(collection(db, "attendanceRecords"), where("subjectCode", "==", subjectCode));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => { console.error("subscribeSubjectAttendance error:", err); if (onError) onError(err); }
  );
};

// Student-side: live attendance for this student across all subjects, matched by email or roll
export const subscribeMyAttendance = (studentEmail, studentRoll, callback, onError) => {
  const qByEmail = studentEmail ? query(collection(db, "attendanceRecords"), where("studentEmail", "==", studentEmail)) : null;
  const qByRoll = studentRoll ? query(collection(db, "attendanceRecords"), where("studentRoll", "==", studentRoll)) : null;
  let latestByEmail = [], latestByRoll = [];
  const merge = () => {
    const all = [...latestByEmail, ...latestByRoll];
    const seen = new Set();
    const deduped = all.filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; });
    callback(deduped);
  };
  const unsubs = [];
  if (qByEmail) unsubs.push(onSnapshot(qByEmail,
    snap => { latestByEmail = snap.docs.map(d => ({ id: d.id, ...d.data() })); merge(); },
    err => { console.error("subscribeMyAttendance(email) error:", err); if (onError) onError(err); }
  ));
  if (qByRoll) unsubs.push(onSnapshot(qByRoll,
    snap => { latestByRoll = snap.docs.map(d => ({ id: d.id, ...d.data() })); merge(); },
    err => { console.error("subscribeMyAttendance(roll) error:", err); if (onError) onError(err); }
  ));
  return () => unsubs.forEach(u => u());
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
