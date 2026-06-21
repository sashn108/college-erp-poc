import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, where, getDocs, deleteDoc } from "firebase/firestore";

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
// NOTE: this uses the standard Firebase pattern, which means creating a new account
// will sign the admin out and sign in as the newly created user (a known client-SDK
// behavior of createUserWithEmailAndPassword). The admin will need to log back in
// afterward. We previously used a secondary temporary app instance to avoid this,
// but that pattern can trigger network errors in some browser environments, so we've
// reverted to the simpler, more reliable standard approach.
export const adminCreateUser = async (email, password, profileData) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  await setDoc(doc(db, "users", uid), { uid, email, ...profileData }, { merge: true });
  return { uid, email };
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

// ── Approved faculty directory (for student messaging) ────────────────────────
export const subscribeApprovedFaculty = (callback, onError) => {
  const q = query(collection(db, "users"), where("role", "==", "faculty"), where("status", "==", "approved"));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ uid: d.id, ...d.data() }))),
    err => { console.error("subscribeApprovedFaculty error:", err); if (onError) onError(err); }
  );
};
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

// ── Faculty subjects (persisted, so they survive reloads and are visible app-wide) ──
export const addFacultySubject = async (facultyUid, subject) => {
  const ref = await addDoc(collection(db, "facultySubjects"), {
    facultyUid, code: subject.code, name: subject.name,
    class: subject.class, type: subject.type,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
};
export const removeFacultySubject = async (docId) => {
  await setDoc(doc(db, "facultySubjects", docId), { removed: true }, { merge: true });
};
export const subscribeFacultySubjects = (facultyUid, callback, onError) => {
  const q = query(collection(db, "facultySubjects"), where("facultyUid", "==", facultyUid));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(s => !s.removed)),
    err => { console.error("subscribeFacultySubjects error:", err); if (onError) onError(err); }
  );
};
export const createAssignment = async (subjectCode, subjectName, facultyUid, facultyName, assignment) => {
  const ref = await addDoc(collection(db, "assignments"), {
    subjectCode, subjectName, facultyUid, facultyName,
    title: assignment.title, desc: assignment.desc || "",
    due: assignment.due, marks: assignment.marks || 10,
    createdAt: new Date().toISOString(),
  });
  // Notify enrolled students with resolvable accounts
  const enrollSnap = await getDocs(query(collection(db, "enrollments"), where("subjectCode", "==", subjectCode)));
  const students = enrollSnap.docs.map(d => d.data()).filter(e => !e.removed);
  let delivered = 0;
  for (const s of students) {
    let targetUid = null;
    if (s.studentEmail) {
      const bySEmail = await getDocs(query(collection(db, "users"), where("email", "==", s.studentEmail)));
      if (!bySEmail.empty) targetUid = bySEmail.docs[0].id;
    }
    if (!targetUid && s.studentRoll) {
      const byRoll = await getDocs(query(collection(db, "users"), where("rollOrId", "==", s.studentRoll)));
      if (!byRoll.empty) targetUid = byRoll.docs[0].id;
    }
    if (targetUid) {
      await pushNotification(targetUid, { text: `📝 New assignment in ${subjectName}: ${assignment.title}`, type: "assignment" });
      delivered++;
    }
  }
  return { id: ref.id, recipientCount: students.length, delivered };
};

// Faculty-side: live assignments they created for one subject
export const subscribeSubjectAssignments = (subjectCode, callback, onError) => {
  const q = query(collection(db, "assignments"), where("subjectCode", "==", subjectCode));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => { console.error("subscribeSubjectAssignments error:", err); if (onError) onError(err); }
  );
};

// Student-side: live assignments across all subjects they're enrolled in
export const subscribeAssignmentsForSubjects = (subjectCodes, callback, onError) => {
  if (!subjectCodes || subjectCodes.length === 0) { callback([]); return () => {}; }
  // Firestore 'in' queries support up to 30 values, which covers any realistic enrollment count
  const q = query(collection(db, "assignments"), where("subjectCode", "in", subjectCodes.slice(0, 30)));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => { console.error("subscribeAssignmentsForSubjects error:", err); if (onError) onError(err); }
  );
};

// ── Bulk messaging to a subject's enrolled students ────────────────────────────
export const sendBulkMessageToSubject = async (subjectCode, subjectName, facultyUid, facultyName, subject, message, priority) => {
  // 1. Find all students enrolled in this subject
  const enrollSnap = await getDocs(query(collection(db, "enrollments"), where("subjectCode", "==", subjectCode)));
  const students = enrollSnap.docs.map(d => d.data()).filter(e => !e.removed);
  // 2. Resolve each enrolled student to a real account UID by matching email or roll
  //    against the users collection (enrollments only store name/roll/email, not uid)
  let delivered = 0;
  for (const s of students) {
    let targetUid = null;
    if (s.studentEmail) {
      const bySEmail = await getDocs(query(collection(db, "users"), where("email", "==", s.studentEmail)));
      if (!bySEmail.empty) targetUid = bySEmail.docs[0].id;
    }
    if (!targetUid && s.studentRoll) {
      const byRoll = await getDocs(query(collection(db, "users"), where("rollOrId", "==", s.studentRoll)));
      if (!byRoll.empty) targetUid = byRoll.docs[0].id;
    }
    if (targetUid) {
      await pushNotification(targetUid, { text: `📢 ${subject} — ${message.slice(0,80)}`, type: priority==="urgent"?"urgent":"general" });
      delivered++;
    }
  }
  // 3. Log the bulk send
  const logRef = await addDoc(collection(db, "bulkMessageLog"), {
    subjectCode, subjectName, facultyUid, facultyName,
    subject, message, priority: priority || "normal",
    recipientCount: students.length, delivered,
    sentAt: new Date().toISOString(),
  });
  return { recipientCount: students.length, delivered, logId: logRef.id };
};

// Fetch a faculty's own bulk message send history (one-time read, sorted newest first)
export const fetchMyBulkMessageLog = async (facultyUid) => {
  const snap = await getDocs(query(collection(db, "bulkMessageLog"), where("facultyUid", "==", facultyUid)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => new Date(b.sentAt) - new Date(a.sentAt));
};

// Delete a broken/malformed user record (e.g. doc ID isn't a real Firebase Auth UID)
export const deleteBrokenUserRecord = async (docId) => {
  await deleteDoc(doc(db, "users", docId));
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
  // Update a lightweight conversation index so both participants can discover this thread
  if (message.participantUids && message.participantNames) {
    await setDoc(doc(db, "conversationIndex", conversationId), {
      participantUids: message.participantUids,
      participantNames: message.participantNames,
      lastMessage: message.text,
      lastSenderUid: message.senderUid,
      lastAt: serverTimestamp(),
    }, { merge: true });
  }
};
export const subscribeToMessages = (conversationId, callback) => {
  const q = query(collection(db, "messages", conversationId, "msgs"), orderBy("timestamp", "asc"));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
// Find all conversations involving a given uid (for an inbox view)
export const subscribeMyConversations = (uid, callback, onError) => {
  const q = query(collection(db, "conversationIndex"), where("participantUids", "array-contains", uid));
  return onSnapshot(q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => { console.error("subscribeMyConversations error:", err); if (onError) onError(err); }
  );
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
export const markNotificationRead = async (uid, notifId) => {
  await updateDoc(doc(db, "notifications", uid, "items", notifId), { read: true });
};
export const markAllNotificationsRead = async (uid, notifIds) => {
  await Promise.all(notifIds.map(id => updateDoc(doc(db, "notifications", uid, "items", id), { read: true })));
};
