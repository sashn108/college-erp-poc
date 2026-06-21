import { useState, useEffect } from "react";
import {
  auth, db, signInWithGoogle, logOut, onAuthStateChanged,
  saveUserProfile, getUserProfile, getPendingUsers, getAllUsersDebug, adminCreateUser, repairMissingStatus, deleteBrokenUserRecord,
  approveUser, rejectUser,
  sendMessage, subscribeToMessages,
  submitFeedback, subscribeFeedbackAggregates,
  pushNotification, subscribeNotifications, serverTimestamp,
} from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// ── Hardcoded bootstrap admin (cannot be changed without code) ────────────────
const BOOTSTRAP_ADMIN_EMAIL = "admin@iter.ac.in";

// ── Firebase Login ────────────────────────────────────────────────────────────
export function FirebaseLogin({ onLogin }) {
  const [mode, setMode] = useState("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [name, setName] = useState("");
  const [requestedRole, setRequestedRole] = useState("student");
  const [rollOrId, setRollOrId] = useState("");
  const [dept, setDept] = useState("CSE");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true); setErr(""); setInfo("");
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const existing = await getUserProfile(user.uid);
      if (existing) {
        if (existing.status === "pending") {
          setInfo("⏳ Your registration is pending admin approval. You'll be notified once approved.");
          await logOut(); setLoading(false); return;
        }
        if (existing.status === "rejected") {
          setErr("❌ Your registration was rejected. Contact the admin.");
          await logOut(); setLoading(false); return;
        }
        onLogin(existing.role, existing, user.uid);
      } else {
        // New Google user — save as pending
        const isAdmin = user.email === BOOTSTRAP_ADMIN_EMAIL;
        const profile = {
          uid: user.uid, email: user.email,
          name: user.displayName || user.email.split("@")[0],
          role: isAdmin ? "admin" : "student",
          status: isAdmin ? "approved" : "pending",
          requestedRole: isAdmin ? "admin" : "student",
          photoURL: user.photoURL || null,
          dept: "CSE", createdAt: new Date().toISOString(),
        };
        await saveUserProfile(user.uid, profile);
        if (isAdmin) {
          onLogin("admin", profile, user.uid);
        } else {
          setInfo("✅ Registration request submitted! An admin will approve your account shortly.");
          await logOut();
        }
      }
    } catch (e) { setErr("Google sign-in failed: " + e.message); }
    setLoading(false);
  };

  const handleEmail = async () => {
    if (!email || !password) { setErr("Enter email and password"); return; }
    setLoading(true); setErr(""); setInfo("");
    try {
      if (isNew) {
        if (!name.trim()) { setErr("Enter your full name"); setLoading(false); return; }
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const isAdmin = email === BOOTSTRAP_ADMIN_EMAIL;
        const profile = {
          uid: userCred.user.uid, email, name: name.trim(),
          role: isAdmin ? "admin" : "student",
          status: isAdmin ? "approved" : "pending",
          requestedRole: isAdmin ? "admin" : requestedRole,
          rollOrId: rollOrId.trim(), dept: isAdmin ? "Administration" : dept,
          designation: isAdmin ? "Registrar" : "",
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(userCred.user.uid, profile);
        if (isAdmin) {
          onLogin("admin", profile, userCred.user.uid);
        } else {
          await logOut();
          setInfo(`✅ Registration submitted! Your request to join as ${requestedRole} is pending admin approval.`);
          setIsNew(false);
        }
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        let existing = await getUserProfile(userCred.user.uid);
        // Force-heal admin profile if missing or role is wrong
        if (email === BOOTSTRAP_ADMIN_EMAIL && (!existing || existing.role !== "admin" || existing.status !== "approved")) {
          existing = {
            uid: userCred.user.uid, email,
            name: existing?.name || "Admin",
            role: "admin", status: "approved",
            requestedRole: "admin", dept: "Administration",
            designation: "Registrar", createdAt: existing?.createdAt || new Date().toISOString(),
          };
          await saveUserProfile(userCred.user.uid, existing);
        }
        if (!existing) { setErr("Profile not found. Please register first."); await logOut(); setLoading(false); return; }
        if (existing.status === "pending") {
          setInfo("⏳ Your account is pending admin approval.");
          await logOut(); setLoading(false); return;
        }
        if (existing.status === "rejected") {
          setErr("❌ Your registration was rejected. Contact admin.");
          await logOut(); setLoading(false); return;
        }
        onLogin(existing.role, existing, userCred.user.uid);
      }
    } catch (e) {
      const msg = e.code === "auth/wrong-password" ? "Incorrect password."
        : e.code === "auth/user-not-found" ? "No account found. Register first."
        : e.code === "auth/email-already-in-use" ? "Email already registered. Sign in instead."
        : e.message;
      setErr(msg);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e293b)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:16,padding:"36px 32px",width:420,boxShadow:"0 8px 40px rgba(0,0,0,0.4)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:60,height:60,borderRadius:16,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28}}>🎓</div>
          <div style={{fontSize:24,fontWeight:900,color:"#0f172a"}}>ITER ERP</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>Siksha 'O' Anusandhan University</div>
        </div>

        {/* Mode toggle */}
        <div style={{display:"flex",background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:18,gap:3}}>
          {[["google","🔵 Google"],["email","✉ Email"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setInfo("");}}
              style={{flex:1,padding:"8px 0",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
                background:mode===m?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:mode===m?"#fff":"#64748b"}}>{l}</button>
          ))}
        </div>

        {info&&<div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#16a34a",fontWeight:600,marginBottom:14}}>{info}</div>}
        {err&&<div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#dc2626",marginBottom:14}}>{err}</div>}

        {/* Google Sign-In */}
        {mode==="google"&&(
          <div>
            <button onClick={handleGoogle} disabled={loading}
              style={{width:"100%",padding:"13px",background:"#fff",border:"2px solid #e2e8f0",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,color:"#334155",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading?"Please wait...":"Continue with Google"}
            </button>
            <div style={{marginTop:12,background:"#eef2ff",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#4338ca",lineHeight:1.6}}>
              🔒 <strong>Secure.</strong> New users are registered as <em>pending</em> until approved by Admin. Admin email: <strong>{BOOTSTRAP_ADMIN_EMAIL}</strong>
            </div>
          </div>
        )}

        {/* Email/Password */}
        {mode==="email"&&(
          <div>
            <div style={{display:"flex",gap:3,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14}}>
              {[["false","Sign In"],["true","Register"]].map(([v,l])=>(
                <button key={v} onClick={()=>{setIsNew(v==="true");setErr("");setInfo("");}}
                  style={{flex:1,padding:"7px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
                    background:String(isNew)===v?"#6366f1":"transparent",color:String(isNew)===v?"#fff":"#64748b"}}>{l}</button>
              ))}
            </div>

            {isNew&&(
              <>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name *"
                  style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,marginBottom:8,outline:"none",fontFamily:"inherit"}}/>
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#475569",marginBottom:4}}>REQUESTING ROLE (Admin will verify & approve)</div>
                  <div style={{display:"flex",gap:4}}>
                    {["student","faculty"].map(r=>(
                      <button key={r} onClick={()=>setRequestedRole(r)}
                        style={{flex:1,padding:"7px",border:`2px solid ${requestedRole===r?"#6366f1":"#e2e8f0"}`,borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600,
                          background:requestedRole===r?"#eef2ff":"#fff",color:requestedRole===r?"#6366f1":"#64748b"}}>
                        {r==="student"?"👨‍🎓 Student":"👨‍🏫 Faculty"}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <input value={rollOrId} onChange={e=>setRollOrId(e.target.value)} placeholder={requestedRole==="student"?"Roll Number":"Faculty ID"}
                    style={{padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                  <select value={dept} onChange={e=>setDept(e.target.value)}
                    style={{padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",fontFamily:"inherit"}}>
                    {["CSE","ECE","MECH","CIVIL","EEE","MBA"].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </>
            )}

            {[{ph:"College Email *",val:email,set:setEmail,type:"email"},{ph:"Password *",val:password,set:setPassword,type:"password"}].map(({ph,val,set,type},i)=>(
              <input key={i} type={type} placeholder={ph} value={val}
                onChange={e=>{set(e.target.value);setErr("");}}
                onKeyDown={e=>e.key==="Enter"&&handleEmail()}
                style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,marginBottom:8,outline:"none",fontFamily:"inherit"}}/>
            ))}

            <button onClick={handleEmail} disabled={loading}
              style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:4}}>
              {loading?"Please wait...":(isNew?"Submit Registration Request":"Sign In")}
            </button>

            {isNew&&<div style={{marginTop:10,fontSize:11,color:"#94a3b8",textAlign:"center",lineHeight:1.6}}>
              ⚠️ Registration requests are reviewed by Admin.<br/>You cannot choose Admin role — it must be granted.
            </div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Admin: Pending User Approvals ─────────────────────────────────────────────
export function AdminUserApprovals() {
  const [pending, setPending] = useState([]);
  const [roleOverride, setRoleOverride] = useState({});
  const [done, setDone] = useState({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [loadError, setLoadError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({name:"",email:"",password:"",role:"student",rollOrId:"",dept:"",status:"approved"});
  const [createErr, setCreateErr] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState("");
  const [repairing, setRepairing] = useState(false);
  const [repairResult, setRepairResult] = useState(null);
  const [deletingBroken, setDeletingBroken] = useState(null);

  const handleRepair = async () => {
    setRepairing(true); setRepairResult(null);
    try {
      const fixes = await repairMissingStatus();
      setRepairResult(fixes);
    } catch (e) {
      setRepairResult({ error: e.message });
    } finally {
      setRepairing(false);
    }
  };

  const handleDeleteBroken = async (docId) => {
    setDeletingBroken(docId);
    try {
      await deleteBrokenUserRecord(docId);
    } catch (e) {
      console.error("Failed to delete broken record:", e);
    } finally {
      setDeletingBroken(null);
    }
  };

  useEffect(() => {
    const unsub = getAllUsersDebug(setAllUsers, ()=>{});
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = getPendingUsers(
      (users) => { setPending(users); setLoaded(true); setLoadError(null); },
      (err) => { setLoadError(err.message || "Failed to load pending users"); setLoaded(true); }
    );
    return () => unsub();
  }, []);

  const handleCreateUser = async () => {
    setCreateErr(""); setCreateSuccess("");
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password) {
      setCreateErr("Name, email, and password are required."); return;
    }
    if (createForm.password.length < 6) {
      setCreateErr("Password must be at least 6 characters."); return;
    }
    setCreateLoading(true);
    try {
      await adminCreateUser(createForm.email.trim(), createForm.password, {
        name: createForm.name.trim(),
        role: createForm.role,
        status: createForm.status,
        requestedRole: createForm.role,
        rollOrId: createForm.rollOrId.trim(),
        dept: createForm.dept.trim(),
        designation: createForm.role === "faculty" ? "Assistant Professor" : "",
        createdAt: new Date().toISOString(),
        createdByAdmin: true,
      });
      setCreateSuccess(`✅ Account created for ${createForm.email} — status: ${createForm.status}`);
      setCreateForm({name:"",email:"",password:"",role:"student",rollOrId:"",dept:"",status:"approved"});
      setTimeout(()=>{ setShowCreate(false); setCreateSuccess(""); }, 2200);
    } catch (e) {
      setCreateErr(e.code === "auth/email-already-in-use" ? "This email is already registered." : (e.message || "Failed to create user."));
    } finally {
      setCreateLoading(false);
    }
  };

  const approve = async (user) => {
    const finalRole = roleOverride[user.uid] || user.requestedRole || "student";
    await approveUser(user.uid, finalRole, { approvedAt: new Date().toISOString() });
    setDone(p => ({ ...p, [user.uid]: "approved" }));
  };

  const reject = async (user) => {
    await rejectUser(user.uid);
    setDone(p => ({ ...p, [user.uid]: "rejected" }));
  };

  const bulkApproveAll = async () => {
    setBulkLoading(true);
    const targets = activePending.filter(u => selected.size === 0 || selected.has(u.uid));
    for (const u of targets) {
      const finalRole = roleOverride[u.uid] || u.requestedRole || "student";
      await approveUser(u.uid, finalRole, { approvedAt: new Date().toISOString() });
      setDone(p => ({ ...p, [u.uid]: "approved" }));
    }
    setBulkLoading(false);
    setBulkDone(true);
    setSelected(new Set());
    setTimeout(() => setBulkDone(false), 3000);
  };

  const toggleSelect = (uid) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };

  const activePending = pending.filter(u => !done[u.uid]);

  return (
    <div>
      {/* Banner */}
      <div style={{background:"linear-gradient(135deg,#ef4444,#dc2626)",borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:15}}>🔐 User Approval Queue</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>New registrations require admin approval before access is granted</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>{setShowCreate(true);setCreateErr("");setCreateSuccess("");}}
            style={{padding:"8px 16px",background:"rgba(255,255,255,0.95)",color:"#dc2626",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:13}}>
            ➕ Create User
          </button>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"6px 14px",color:"#fff",fontWeight:800,fontSize:20}}>{activePending.length}</div>
          {activePending.length > 0 && (
            <button onClick={bulkApproveAll} disabled={bulkLoading}
              style={{padding:"8px 18px",background:bulkDone?"#10b981":"rgba(255,255,255,0.95)",color:bulkDone?"#fff":"#dc2626",border:"none",borderRadius:8,fontWeight:700,cursor:bulkLoading?"wait":"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6,transition:"all .2s"}}>
              {bulkLoading ? "⏳ Approving..." : bulkDone ? "✅ All Approved!" : `⚡ Bulk Approve ${selected.size > 0 ? `(${selected.size} selected)` : "All"}`}
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontWeight:700,color:"#dc2626",fontSize:13,marginBottom:4}}>⚠️ Could not load pending users</div>
          <div style={{fontSize:12,color:"#991b1b",fontFamily:"monospace"}}>{loadError}</div>
          <div style={{fontSize:12,color:"#7f1d1d",marginTop:6}}>This usually means Firestore security rules are blocking the admin from reading other users' profiles. Check your rules for the "users" collection.</div>
        </div>
      )}

      <div style={{marginBottom:14}}>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setShowDebug(s=>!s)}
            style={{padding:"6px 14px",background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer"}}>
            🔧 {showDebug?"Hide":"Show"} Debug — All Users in Firestore ({allUsers.length})
          </button>
          <button onClick={handleRepair} disabled={repairing}
            style={{padding:"6px 14px",background:repairing?"#fef3c7":"#fee2e2",color:repairing?"#92400e":"#dc2626",border:"1px solid #fca5a5",borderRadius:8,fontSize:11,fontWeight:700,cursor:repairing?"wait":"pointer"}}>
            {repairing?"⏳ Repairing...":"🩹 Repair Missing Status Fields"}
          </button>
        </div>
        {repairResult && (
          <div style={{marginTop:8,background:repairResult.error?"#fee2e2":"#dcfce7",border:`1px solid ${repairResult.error?"#fca5a5":"#86efac"}`,borderRadius:8,padding:"10px 14px",fontSize:12}}>
            {repairResult.error
              ? <span style={{color:"#dc2626",fontWeight:600}}>Error: {repairResult.error}</span>
              : repairResult.length === 0
                ? <span style={{color:"#16a34a",fontWeight:600}}>✅ No broken records found — all users have a valid status field.</span>
                : (
                  <div>
                    <div style={{color:"#16a34a",fontWeight:700,marginBottom:4}}>✅ Fixed {repairResult.length} record{repairResult.length!==1?"s":""}:</div>
                    {repairResult.map((f,i)=>(
                      <div key={i} style={{color:"#15803d",fontFamily:"monospace"}}>{f.email} → status: {f.newStatus}</div>
                    ))}
                  </div>
                )
            }
          </div>
        )}
        {showDebug && (
          <div style={{marginTop:10,background:"#0f172a",borderRadius:10,padding:"14px 16px",overflowX:"auto"}}>
            {allUsers.length === 0 ? (
              <div style={{color:"#94a3b8",fontSize:12}}>No documents found in the "users" collection at all.</div>
            ) : (
              allUsers.map(u=>{
                const looksLikeValidUid = /^[A-Za-z0-9]{20,}$/.test(u.id);
                return (
                  <div key={u.id} style={{borderBottom:"1px solid #1e293b",padding:"8px 0",fontFamily:"monospace",fontSize:11,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{color:looksLikeValidUid?"#10b981":"#ef4444"}}>docId: {u.id} {!looksLikeValidUid && "⚠️ NOT A VALID AUTH UID — this user can never log in"}</div>
                      <div style={{color:"#e2e8f0"}}>name: {String(u.name)} | email: {String(u.email)}</div>
                      <div style={{color:"#fbbf24"}}>role: {String(u.role)} | status: <strong>{String(u.status)}</strong> | requestedRole: {String(u.requestedRole)}</div>
                    </div>
                    {!looksLikeValidUid && (
                      <button onClick={()=>handleDeleteBroken(u.id)} disabled={deletingBroken===u.id}
                        style={{padding:"5px 10px",background:deletingBroken===u.id?"#fca5a5":"#ef4444",color:"#fff",border:"none",borderRadius:6,fontSize:10,fontWeight:700,cursor:deletingBroken===u.id?"wait":"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                        {deletingBroken===u.id?"Deleting...":"🗑 Delete"}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {showCreate && (
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowCreate(false)}>
          <div style={{background:"#fff",borderRadius:14,width:480,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#ef4444,#dc2626)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>➕ Create User Account</span>
              <button onClick={()=>setShowCreate(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            {createSuccess ? (
              <div style={{padding:"40px",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>{createSuccess}</div>
              </div>
            ) : (
              <div style={{padding:"20px 22px",display:"grid",gap:12}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>FULL NAME *</label>
                  <input value={createForm.name} onChange={e=>setCreateForm(f=>({...f,name:e.target.value}))}
                    placeholder="e.g. Subhashish Nayak"
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>EMAIL *</label>
                  <input value={createForm.email} onChange={e=>setCreateForm(f=>({...f,email:e.target.value}))}
                    placeholder="name@institution.ac.in"
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>TEMPORARY PASSWORD * <span style={{fontWeight:400,color:"#94a3b8"}}>(min 6 chars — share with user separately)</span></label>
                  <input value={createForm.password} onChange={e=>setCreateForm(f=>({...f,password:e.target.value}))}
                    placeholder="Temp@ITER2026" type="text"
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>ROLE</label>
                    <select value={createForm.role} onChange={e=>setCreateForm(f=>({...f,role:e.target.value}))}
                      style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>INITIAL STATUS</label>
                    <select value={createForm.status} onChange={e=>setCreateForm(f=>({...f,status:e.target.value}))}
                      style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                      <option value="approved">Approved (active now)</option>
                      <option value="pending">Pending (needs approval)</option>
                    </select>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>ROLL NO. / FACULTY ID</label>
                    <input value={createForm.rollOrId} onChange={e=>setCreateForm(f=>({...f,rollOrId:e.target.value}))}
                      placeholder="e.g. 22CS045"
                      style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>DEPARTMENT</label>
                    <input value={createForm.dept} onChange={e=>setCreateForm(f=>({...f,dept:e.target.value}))}
                      placeholder="e.g. CSE"
                      style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                </div>
                {createErr && <div style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:8,padding:"8px 12px",color:"#dc2626",fontSize:12,fontWeight:600}}>{createErr}</div>}
                <button onClick={handleCreateUser} disabled={createLoading}
                  style={{padding:"11px",background:createLoading?"#fca5a5":"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:createLoading?"wait":"pointer",fontSize:14}}>
                  {createLoading?"⏳ Creating...":"✅ Create Account"}
                </button>
                <div style={{fontSize:11,color:"#94a3b8",textAlign:"center"}}>
                  This creates a real login-capable account. Share the email + temporary password with the user securely.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activePending.length === 0 && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"48px 0",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>✅</div>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>All caught up!</div>
          <div style={{color:"#94a3b8",fontSize:13,marginTop:4}}>No pending registrations</div>
        </div>
      )}

      {activePending.length > 1 && (
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,padding:"8px 14px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0"}}>
          <input type="checkbox" id="select-all"
            checked={selected.size === activePending.length}
            onChange={e => setSelected(e.target.checked ? new Set(activePending.map(u=>u.uid)) : new Set())}
            style={{width:15,height:15,cursor:"pointer",accentColor:"#6366f1"}}/>
          <label htmlFor="select-all" style={{fontSize:12,fontWeight:600,color:"#475569",cursor:"pointer"}}>
            Select all ({activePending.length}) · {selected.size} selected
          </label>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {activePending.map(u => (
          <div key={u.uid} style={{background:"#fff",border:`1px solid ${selected.has(u.uid)?"#6366f1":"#e2e8f0"}`,borderRadius:12,padding:"16px 18px",transition:"border-color .15s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <input type="checkbox" checked={selected.has(u.uid)} onChange={()=>toggleSelect(u.uid)}
                  style={{width:15,height:15,cursor:"pointer",accentColor:"#6366f1",flexShrink:0}}/>
                <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:18}}>
                  {(u.name||u.email)[0].toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{u.name || "—"}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{u.email}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>
                    Dept: {u.dept||"—"} &nbsp;·&nbsp; ID: {u.rollOrId||"—"} &nbsp;·&nbsp; Registered: {u.createdAt?.slice(0,10)||"—"}
                  </div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:4}}>REQUESTED ROLE</div>
                <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,
                  background:u.requestedRole==="faculty"?"#eef2ff":"#f0fdf4",
                  color:u.requestedRole==="faculty"?"#6366f1":"#16a34a"}}>
                  {u.requestedRole||"student"}
                </span>
              </div>
            </div>

            {/* Role assignment + approve/reject */}
            <div style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:"#475569",marginBottom:5}}>ASSIGN ROLE (override if needed)</div>
                <div style={{display:"flex",gap:6}}>
                  {["student","faculty","admin"].map(r=>(
                    <button key={r} onClick={()=>setRoleOverride(p=>({...p,[u.uid]:r}))}
                      style={{padding:"5px 14px",border:`2px solid ${(roleOverride[u.uid]||u.requestedRole||"student")===r?"#6366f1":"#e2e8f0"}`,
                        borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600,
                        background:(roleOverride[u.uid]||u.requestedRole||"student")===r?"#eef2ff":"#fff",
                        color:(roleOverride[u.uid]||u.requestedRole||"student")===r?"#6366f1":"#64748b"}}>
                      {r==="student"?"👨‍🎓 Student":r==="faculty"?"👨‍🏫 Faculty":"🔑 Admin"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>approve(u)}
                  style={{padding:"8px 20px",background:"#10b981",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>
                  ✓ Approve
                </button>
                <button onClick={()=>reject(u)}
                  style={{padding:"8px 16px",background:"#fee2e2",color:"#dc2626",border:"1px solid #fca5a5",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Real-time Chat ─────────────────────────────────────────────────────────────
export function RealtimeChat({ currentUid, currentName, otherUid, otherName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const convId = [currentUid, otherUid].sort().join("_");

  useEffect(() => {
    const unsub = subscribeToMessages(convId, setMessages);
    return () => unsub();
  }, [convId]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const msg = text.trim();
    setText("");
    await sendMessage(convId, { text: msg, senderUid: currentUid, senderName: currentName });
    await pushNotification(otherUid, { text: `New message from ${currentName}: "${msg.slice(0,60)}"`, type: "message" });
    setSending(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:14,width:480,height:520,display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.25)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{color:"#fff",fontWeight:700,fontSize:15}}>💬 {otherName}</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:11}}>Real-time · Powered by Firebase</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10,background:"#f8fafc"}}>
          {messages.length===0&&<div style={{textAlign:"center",color:"#94a3b8",fontSize:13,marginTop:40}}>No messages yet. Say hello! 👋</div>}
          {messages.map(m=>{
            const isMe = m.senderUid===currentUid;
            return (
              <div key={m.id} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"75%",padding:"9px 14px",borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  background:isMe?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#fff",
                  color:isMe?"#fff":"#334155",fontSize:13,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
                  {!isMe&&<div style={{fontSize:10,fontWeight:700,color:"#6366f1",marginBottom:3}}>{m.senderName}</div>}
                  <div>{m.text}</div>
                  {m.timestamp&&<div style={{fontSize:9,opacity:0.6,marginTop:3,textAlign:"right"}}>
                    {m.timestamp.toDate?.().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})||""}
                  </div>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #e2e8f0",display:"flex",gap:8,background:"#fff",flexShrink:0}}>
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Type a message..." style={{flex:1,padding:"10px 14px",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          <button onClick={send} disabled={sending||!text.trim()}
            style={{padding:"10px 18px",background:text.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
              color:text.trim()?"#fff":"#94a3b8",border:"none",borderRadius:10,cursor:text.trim()?"pointer":"default",fontSize:13,fontWeight:600}}>
            {sending?"...":"Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Live Feedback (Student) ───────────────────────────────────────────────────
export function LiveFeedbackView({ uid }) {
  const [submitted, setSubmitted] = useState({});
  const [ratings, setRatings] = useState({});
  const [saving, setSaving] = useState(null);
  const subjects = [
    {code:"CS301",name:"Database Management Systems",faculty:"Dr. A. Sharma"},
    {code:"CS302",name:"Operating Systems",faculty:"Prof. S. Das"},
    {code:"CS303",name:"Computer Networks",faculty:"Dr. R. Panda"},
    {code:"CS304",name:"Theory of Computation",faculty:"Dr. K. Rath"},
    {code:"CS305",name:"Software Engineering",faculty:"Prof. M. Behera"},
  ];
  const questions = ["Course Content","Teaching Quality","Pace","Interaction","Practical Relevance"];
  const setRating = (code,q,val) => setRatings(p=>({...p,[code]:{...(p[code]||{}),[q]:val}}));
  const getRating = (code,q) => ratings[code]?.[q]||0;
  const canSubmit = code => questions.every(q=>getRating(code,q)>0);
  const submit = async (code) => {
    setSaving(code);
    await submitFeedback(uid, code, ratings[code]);
    setSubmitted(p=>({...p,[code]:true}));
    setSaving(null);
  };
  return (
    <div>
      <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#4338ca"}}>
        🔒 Feedback is <strong>anonymous</strong> and saves live to Firebase. Faculty sees aggregated scores only.
      </div>
      {subjects.map(s=>(
        <div key={s.code} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginBottom:12}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{color:"#fff"}}><div style={{fontWeight:700,fontSize:13}}>{s.code} — {s.name}</div><div style={{fontSize:11,opacity:0.8}}>{s.faculty}</div></div>
            {submitted[s.code]&&<span style={{background:"rgba(255,255,255,0.2)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>✓ Submitted</span>}
          </div>
          {submitted[s.code]
            ? <div style={{padding:"20px",textAlign:"center",color:"#16a34a",fontWeight:600}}>✅ Feedback saved to database!</div>
            : <div style={{padding:"14px 16px"}}>
                {questions.map(q=>(
                  <div key={q} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:13,color:"#334155"}}>{q}</span>
                    <div style={{display:"flex",gap:5}}>
                      {[1,2,3,4,5].map(n=>(
                        <button key={n} onClick={()=>setRating(s.code,q,n)}
                          style={{width:30,height:28,borderRadius:6,border:`1px solid ${getRating(s.code,q)>=n?"#6366f1":"#e2e8f0"}`,cursor:"pointer",
                            background:getRating(s.code,q)>=n?"#6366f1":"#fff",color:getRating(s.code,q)>=n?"#fff":"#94a3b8",fontWeight:700,fontSize:13}}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}>
                  <button onClick={()=>submit(s.code)} disabled={!canSubmit(s.code)||saving===s.code}
                    style={{padding:"8px 20px",background:canSubmit(s.code)?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",color:canSubmit(s.code)?"#fff":"#94a3b8",border:"none",borderRadius:8,fontWeight:600,cursor:canSubmit(s.code)?"pointer":"not-allowed",fontSize:13}}>
                    {saving===s.code?"Saving...":"Submit Feedback ✓"}
                  </button>
                </div>
              </div>}
        </div>
      ))}
    </div>
  );
}

// ── Live Feedback Results (Faculty) ───────────────────────────────────────────
export function LiveFacultyFeedback() {
  const subjects = ["CS301","CS302","CS303","CS304","CS305"];
  const names = {CS301:"DBMS",CS302:"OS",CS303:"CN",CS304:"TOC",CS305:"SE"};
  const labels = ["Course Content","Teaching Quality","Pace","Interaction","Practical Relevance"];
  const [data, setData] = useState({});
  useEffect(() => {
    const unsubs = subjects.map(code => subscribeFeedbackAggregates(code, agg => setData(p => ({...p,[code]:agg}))));
    return () => unsubs.forEach(u => u?.());
  }, []);
  return (
    <div>
      <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#4338ca"}}>
        🔴 <strong>Live</strong> — Scores update in real-time as students submit.
      </div>
      {subjects.map(code=>{
        const d = data[code];
        return (
          <div key={code} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginBottom:14}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#fff",fontWeight:700}}>{code} — {names[code]}</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{d?.count||0} responses (live 🔴)</div>
            </div>
            {!d||d.count===0
              ? <div style={{padding:"20px",textAlign:"center",color:"#94a3b8",fontSize:13}}>No feedback yet.</div>
              : <div style={{padding:"16px",display:"grid",gridTemplateColumns:"1fr 100px",gap:16}}>
                  <div>{labels.map(l=>{
                    const val = d.avg?.[l]||0;
                    return <div key={l} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                        <span style={{color:"#475569"}}>{l}</span>
                        <span style={{fontWeight:700,color:"#6366f1"}}>{val}/5</span>
                      </div>
                      <div style={{height:6,background:"#f1f5f9",borderRadius:3}}>
                        <div style={{width:(val/5*100)+"%",height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:3,transition:"width .5s"}}/>
                      </div>
                    </div>;
                  })}</div>
                  <div style={{textAlign:"center",background:"#eef2ff",borderRadius:10,padding:"14px 8px"}}>
                    <div style={{fontSize:30,fontWeight:900,color:"#6366f1"}}>
                      {d.avg?(Object.values(d.avg).reduce((a,b)=>a+b,0)/Object.values(d.avg).length).toFixed(1):"—"}
                    </div>
                    <div style={{fontSize:10,color:"#6366f1",fontWeight:600}}>Overall</div>
                    <div style={{fontSize:9,color:"#94a3b8"}}>out of 5.0</div>
                  </div>
                </div>}
          </div>
        );
      })}
    </div>
  );
}

// ── Firebase Auth State Hook ──────────────────────────────────────────────────
export function useFirebaseAuth() {
  const [fbUser, setFbUser] = useState(undefined);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let p = await getUserProfile(user.uid);
        // Retry once if profile not yet written
        if (!p) {
          await new Promise(r => setTimeout(r, 1500));
          p = await getUserProfile(user.uid);
        }
        // Auto-heal: bootstrap admin email always gets admin profile
        if (!p && user.email === "admin@iter.ac.in") {
          p = {
            uid: user.uid, email: user.email,
            name: "Admin", role: "admin", status: "approved",
            requestedRole: "admin", dept: "Administration",
            designation: "Registrar", createdAt: new Date().toISOString(),
          };
          await saveUserProfile(user.uid, p);
        }
        // Force-correct role if admin email but wrong role
        if (p && user.email === "admin@iter.ac.in" && (p.role !== "admin" || p.status !== "approved")) {
          p = { ...p, role: "admin", status: "approved", designation: p.designation || "Registrar", dept: p.dept || "Administration" };
          await saveUserProfile(user.uid, p);
        }
        setFbUser(user);
        setProfile(p);
      } else {
        setFbUser(null);
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);
  return { fbUser, profile, loading: fbUser === undefined };
}
