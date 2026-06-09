import { useState } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  attendance: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  exam: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  assignment: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  fee: "M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  notice: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  paper: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  subject: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  lab: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 0 2-2V9m0 0h10",
  research: "M10 2a6 6 0 1 0 0 12A6 6 0 0 0 10 2zm0 0v6l4 2",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  duty: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  hostel: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  scholarship: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  chevron: "M9 18l6-6-6-6",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const STUDENT_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "attendance", label: "Attendance & Leave", icon: "attendance" },
  { id: "papers", label: "Question Papers", icon: "paper" },
  { id: "assignments", label: "Assignments", icon: "assignment" },
  { id: "exams", label: "Exams & Results", icon: "exam" },
  { id: "fee", label: "Fee & Finance", icon: "fee" },
  { id: "hostel", label: "Hostel", icon: "hostel" },
  { id: "notices", label: "Notices", icon: "notice" },
];

const FACULTY_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "subjects", label: "Subjects & Students", icon: "subject" },
  { id: "lab", label: "Lab Management", icon: "lab" },
  { id: "attendance", label: "Attendance & Leave", icon: "attendance" },
  { id: "evaluation", label: "Evaluation", icon: "assignment" },
  { id: "research", label: "Research Scholars", icon: "research" },
  { id: "duty", label: "Exam & Duty", icon: "duty" },
  { id: "notices", label: "Notices", icon: "notice" },
];

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("student");
  const [uid, setUid] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handle = () => {
    if (!uid || !pass) { setErr("Please enter credentials"); return; }
    if (role === "student" && uid === "S001" && pass === "student123") onLogin("student", { name: "Ashish Kumar", roll: "520CS2008", dept: "CSE", year: "3rd Year", id: "S001" });
    else if (role === "faculty" && uid === "F001" && pass === "faculty123") onLogin("faculty", { name: "Dr. Priya Singh", dept: "CSE", designation: "Asst. Professor", id: "F001" });
    else setErr("Invalid credentials. Try S001 / student123 or F001 / faculty123");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "48px 40px", width: 420, backdropFilter: "blur(20px)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", marginBottom: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>E</span>
          </div>
          <div style={{ color: "#f8fafc", fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Campus ERP</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>ITER · SOA University</div>
        </div>

        {/* Role Toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
          {["student", "faculty"].map(r => (
            <button key={r} onClick={() => { setRole(r); setErr(""); }}
              style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all .2s",
                background: role === r ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                color: role === r ? "#fff" : "#64748b" }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Fields */}
        {[
          { ph: role === "student" ? "Roll Number (e.g. S001)" : "Faculty ID (e.g. F001)", val: uid, set: setUid, type: "text" },
          { ph: "Password", val: pass, set: setPass, type: "password" },
        ].map(({ ph, val, set, type }, i) => (
          <input key={i} type={type} placeholder={ph} value={val} onChange={e => { set(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && handle()}
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", marginBottom: 12, fontFamily: "inherit" }} />
        ))}

        {err && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(248,113,113,0.1)", borderRadius: 8 }}>{err}</div>}

        <button onClick={handle} style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 0.3 }}>
          Sign In
        </button>

        <div style={{ color: "#475569", fontSize: 12, textAlign: "center", marginTop: 20 }}>
          Demo: <span style={{ color: "#818cf8" }}>S001 / student123</span> &nbsp;|&nbsp; <span style={{ color: "#818cf8" }}>F001 / faculty123</span>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Layout ─────────────────────────────────────────────────────────────
function Layout({ user, role, nav, active, setActive, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sideW = collapsed ? 68 : 230;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#f1f5f9", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: sideW, background: "#0f172a", display: "flex", flexDirection: "column", transition: "width .25s", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>E</span>
          </div>
          {!collapsed && <div>
            <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: 14 }}>Campus ERP</div>
            <div style={{ color: "#475569", fontSize: 11 }}>ITER · SOA Univ.</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {nav.map(({ id, label, icon }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => setActive(id)}
                title={collapsed ? label : ""}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all .15s",
                  background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                  color: isActive ? "#818cf8" : "#64748b" }}>
                <span style={{ flexShrink: 0 }}><Icon d={Icons[icon]} size={17} /></span>
                {!collapsed && <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{user.name[0]}</span>
              </div>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{user.name.split(" ")[0]}</div>
                <div style={{ color: "#475569", fontSize: 11 }}>{user.id}</div>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{ width: "100%", padding: "8px 10px", background: "transparent", border: "none", cursor: "pointer", color: "#475569", fontSize: 12, textAlign: "left", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} size={14} />
            {!collapsed && "Collapse"}
          </button>
          <button onClick={onLogout} style={{ width: "100%", padding: "8px 10px", background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, textAlign: "left", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={Icons.logout} size={14} />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{nav.find(n => n.id === active)?.label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{role === "student" ? `${user.dept} · ${user.year}` : `${user.dept} · ${user.designation}`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon d={Icons.bell} size={16} color="#64748b" />
              </div>
              <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{user.name[0]}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Card ────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 20, ...style }}>{children}</div>;
}
function StatCard({ label, value, sub, color = "#6366f1", icon }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={Icons[icon]} size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
      </div>
    </Card>
  );
}
function Badge({ text, color = "#6366f1" }) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: color + "15", color, fontSize: 12, fontWeight: 600 }}>{text}</span>;
}

// ─── STUDENT VIEWS ────────────────────────────────────────────────────────────
function StudentDashboard({ user }) {
  const items = [
    { label: "Attendance", value: "82%", sub: "6 leaves pending", color: "#10b981", icon: "attendance" },
    { label: "Assignments Due", value: "3", sub: "2 this week", color: "#f59e0b", icon: "assignment" },
    { label: "Next Exam", value: "Jun 18", sub: "DBMS · Room 201", color: "#6366f1", icon: "exam" },
    { label: "Fee Due", value: "₹12,000", sub: "Due: Jul 15", color: "#ef4444", icon: "fee" },
  ];
  const notices = [
    { title: "End-Semester Exam Schedule Released", date: "Jun 7", tag: "Exam", tc: "#6366f1" },
    { title: "Last date for assignment submission: Jun 12", date: "Jun 6", tag: "Assignment", tc: "#f59e0b" },
    { title: "Hostel check-out for vacations: Jun 20", date: "Jun 5", tag: "Hostel", tc: "#10b981" },
    { title: "GATE 2027 coaching registration open", date: "Jun 4", tag: "Notice", tc: "#8b5cf6" },
  ];
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Welcome back, {user.name.split(" ")[0]} 👋</div>
        <div style={{ color: "#64748b", fontSize: 14 }}>Here's what's on your plate today</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {items.map(i => <StatCard key={i.label} {...i} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Recent Notices</div>
          {notices.map(n => (
            <div key={n.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>{n.title}</div>
                <Badge text={n.tag} color={n.tc} />
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", marginLeft: 8 }}>{n.date}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Subject Attendance</div>
          {[["DBMS", 90, "#10b981"], ["OS", 75, "#f59e0b"], ["CN", 85, "#6366f1"], ["TOC", 65, "#ef4444"], ["SE", 80, "#8b5cf6"]].map(([sub, pct, c]) => (
            <div key={sub} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13, fontWeight: 500, color: "#334155" }}>
                <span>{sub}</span><span style={{ color: c }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 4 }}>
                <div style={{ height: "100%", width: pct + "%", background: c, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function AttendanceView({ role }) {
  const [tab, setTab] = useState("attendance");
  const subjects = [
    { code: "CS301", name: "Database Management", total: 40, present: 36, faculty: "Dr. A. Sharma" },
    { code: "CS302", name: "Operating Systems", total: 42, present: 31, faculty: "Prof. S. Das" },
    { code: "CS303", name: "Computer Networks", total: 38, present: 32, faculty: "Dr. R. Panda" },
    { code: "CS304", name: "Theory of Computation", total: 35, present: 23, faculty: "Dr. K. Rath" },
    { code: "CS305", name: "Software Engineering", total: 40, present: 32, faculty: "Prof. M. Behera" },
  ];
  const leaves = [
    { id: "L001", from: "May 20", to: "May 22", reason: "Medical", status: "Approved", tc: "#10b981" },
    { id: "L002", from: "Jun 1", to: "Jun 1", reason: "Family function", status: "Pending", tc: "#f59e0b" },
    { id: "L003", from: "Apr 10", to: "Apr 11", reason: "Personal", status: "Rejected", tc: "#ef4444" },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["attendance", "leave"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? "#6366f1" : "#f1f5f9", color: tab === t ? "#fff" : "#475569" }}>
            {t === "attendance" ? "Attendance" : "Leave Tracker"}
          </button>
        ))}
      </div>

      {tab === "attendance" && (
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>Subject-wise Attendance</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Code", "Subject", "Faculty", "Present/Total", "% Attendance", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => {
                const pct = Math.round((s.present / s.total) * 100);
                const ok = pct >= 75;
                return (
                  <tr key={s.code} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 12px", color: "#6366f1", fontWeight: 600 }}>{s.code}</td>
                    <td style={{ padding: "12px 12px", color: "#334155", fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: "12px 12px", color: "#64748b" }}>{s.faculty}</td>
                    <td style={{ padding: "12px 12px", color: "#334155" }}>{s.present}/{s.total}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 60, height: 6, background: "#f1f5f9", borderRadius: 4 }}>
                          <div style={{ width: pct + "%", height: "100%", background: ok ? "#10b981" : "#ef4444", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontWeight: 600, color: ok ? "#10b981" : "#ef4444" }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 12px" }}><Badge text={ok ? "Safe" : "Short"} color={ok ? "#10b981" : "#ef4444"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "leave" && (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>Apply for Leave</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {["From Date", "To Date", "Reason"].map(ph => (
                <input key={ph} placeholder={ph} style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", color: "#334155" }} />
              ))}
            </div>
            <button style={{ marginTop: 12, padding: "9px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              Submit Application
            </button>
          </Card>
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>Leave History</div>
            {leaves.map(l => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "#334155" }}>{l.reason}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.from} → {l.to}</div>
                </div>
                <Badge text={l.status} color={l.tc} />
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

function QuestionPapers() {
  const [sem, setSem] = useState("5");
  const papers = {
    "5": [
      { code: "CS301", name: "Database Management Systems", years: ["2023", "2022", "2021", "2020"] },
      { code: "CS302", name: "Operating Systems", years: ["2023", "2022", "2021"] },
      { code: "CS303", name: "Computer Networks", years: ["2023", "2022", "2021", "2019"] },
      { code: "CS304", name: "Theory of Computation", years: ["2023", "2022"] },
    ],
    "3": [
      { code: "CS201", name: "Data Structures", years: ["2023", "2022", "2021", "2020", "2019"] },
      { code: "CS202", name: "Discrete Mathematics", years: ["2023", "2022", "2021"] },
    ],
    "1": [
      { code: "CS101", name: "Programming in C", years: ["2023", "2022", "2021", "2020"] },
      { code: "CS102", name: "Engineering Mathematics I", years: ["2023", "2022"] },
    ],
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["1", "2", "3", "4", "5", "6", "7", "8"].map(s => (
          <button key={s} onClick={() => setSem(s)} style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: sem === s ? "#6366f1" : "#f1f5f9", color: sem === s ? "#fff" : "#475569" }}>
            Sem {s}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {(papers[sem] || []).map(p => (
          <Card key={p.code}>
            <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>{p.code}</div>
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{p.name}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {p.years.map(y => (
                <button key={y} style={{ padding: "5px 12px", background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#334155", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  📄 {y}
                </button>
              ))}
            </div>
          </Card>
        ))}
        {!(papers[sem] || []).length && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#94a3b8", padding: 40 }}>No papers available for Semester {sem} yet.</div>
        )}
      </div>
    </div>
  );
}

function AssignmentsView({ role }) {
  const assignments = [
    { id: "A001", subject: "DBMS", title: "ER Diagram for Hospital DB", due: "Jun 12, 2024", marks: "20", status: "Pending", sub: "—", tc: "#f59e0b" },
    { id: "A002", subject: "OS", title: "CPU Scheduling Algorithms", due: "Jun 10, 2024", marks: "15", status: "Submitted", sub: "Jun 8", tc: "#10b981" },
    { id: "A003", subject: "CN", title: "Subnetting Practice", due: "Jun 8, 2024", marks: "10", status: "Evaluated", sub: "Jun 7", tc: "#6366f1" },
    { id: "A004", subject: "TOC", title: "NFA to DFA Conversion", due: "Jun 15, 2024", marks: "25", status: "Pending", sub: "—", tc: "#f59e0b" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Assigned" value="8" color="#6366f1" icon="assignment" sub="This semester" />
        <StatCard label="Submitted" value="5" color="#10b981" icon="attendance" sub="On time" />
        <StatCard label="Pending" value="3" color="#f59e0b" icon="exam" sub="Due soon" />
      </div>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>All Assignments</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Subject", "Title", "Due Date", "Marks", "Status", "Submitted", "Action"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 12px" }}><Badge text={a.subject} color="#6366f1" /></td>
                <td style={{ padding: "12px 12px", color: "#334155", fontWeight: 500 }}>{a.title}</td>
                <td style={{ padding: "12px 12px", color: "#64748b" }}>{a.due}</td>
                <td style={{ padding: "12px 12px", color: "#334155" }}>{a.marks}</td>
                <td style={{ padding: "12px 12px" }}><Badge text={a.status} color={a.tc} /></td>
                <td style={{ padding: "12px 12px", color: "#64748b" }}>{a.sub}</td>
                <td style={{ padding: "12px 12px" }}>
                  {a.status === "Pending" && (
                    <button style={{ padding: "5px 14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      Upload
                    </button>
                  )}
                  {a.status === "Evaluated" && (
                    <button style={{ padding: "5px 14px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      View Score
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ExamResultsView() {
  const [tab, setTab] = useState("schedule");
  const schedule = [
    { date: "Jun 18", day: "Tue", subject: "DBMS", code: "CS301", time: "10:00–1:00", room: "201-A", seats: 50 },
    { date: "Jun 20", day: "Thu", subject: "Operating Systems", code: "CS302", time: "10:00–1:00", room: "202-B", seats: 50 },
    { date: "Jun 22", day: "Sat", subject: "Computer Networks", code: "CS303", time: "2:00–5:00", room: "201-A", seats: 50 },
    { date: "Jun 25", day: "Tue", subject: "Theory of Computation", code: "CS304", time: "10:00–1:00", room: "203-C", seats: 40 },
    { date: "Jun 27", day: "Thu", subject: "Software Engineering", code: "CS305", time: "2:00–5:00", room: "201-A", seats: 50 },
  ];
  const results = [
    { sem: "Semester 4 (2023)", sgpa: "8.2", subjects: [{ code: "CS201", name: "Data Structures", internal: 28, external: 68, total: 96, grade: "O" }, { code: "CS202", name: "Discrete Math", internal: 24, external: 62, total: 86, grade: "A+" }] },
    { sem: "Semester 3 (2022)", sgpa: "7.9", subjects: [{ code: "CS101", name: "Programming in C", internal: 25, external: 58, total: 83, grade: "A" }] },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["schedule", "results"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? "#6366f1" : "#f1f5f9", color: tab === t ? "#fff" : "#475569" }}>
            {t === "schedule" ? "Exam Schedule" : "Results"}
          </button>
        ))}
      </div>
      {tab === "schedule" && (
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>End Semester Exam — June 2024</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Date", "Day", "Code", "Subject", "Time", "Room"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map(e => (
                <tr key={e.date + e.code} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 12px", fontWeight: 700, color: "#6366f1" }}>{e.date}</td>
                  <td style={{ padding: "12px 12px", color: "#64748b" }}>{e.day}</td>
                  <td style={{ padding: "12px 12px" }}><Badge text={e.code} color="#6366f1" /></td>
                  <td style={{ padding: "12px 12px", color: "#334155", fontWeight: 500 }}>{e.subject}</td>
                  <td style={{ padding: "12px 12px", color: "#64748b" }}>{e.time}</td>
                  <td style={{ padding: "12px 12px", color: "#334155" }}>{e.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "results" && results.map(r => (
        <Card key={r.sem} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>{r.sem}</div>
            <Badge text={`SGPA: ${r.sgpa}`} color="#10b981" />
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Code", "Subject", "Internal", "External", "Total", "Grade"].map(h => (
                  <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.subjects.map(s => (
                <tr key={s.code} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px", color: "#6366f1", fontWeight: 600 }}>{s.code}</td>
                  <td style={{ padding: "10px 12px", color: "#334155" }}>{s.name}</td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{s.internal}</td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{s.external}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0f172a" }}>{s.total}</td>
                  <td style={{ padding: "10px 12px" }}><Badge text={s.grade} color="#10b981" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );
}

function FeeView() {
  const [tab, setTab] = useState("fee");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["fee","Fee & Hostel"], ["scholarship","Scholarship"], ["project","Project Funds"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? "#6366f1" : "#f1f5f9", color: tab === t ? "#fff" : "#475569" }}>
            {l}
          </button>
        ))}
      </div>
      {tab === "fee" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Fee Structure — 2024-25</div>
            {[["Tuition Fee", "₹80,000", "Paid"], ["Exam Fee", "₹3,000", "Paid"], ["Development Fee", "₹5,000", "Due"], ["Library Fee", "₹2,000", "Paid"], ["Lab Fee", "₹5,000", "Due"]].map(([l, a, s]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
                <span style={{ color: "#334155" }}>{l}</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{a}</span>
                  <Badge text={s} color={s === "Paid" ? "#10b981" : "#ef4444"} />
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Hostel Details</div>
            {[["Block", "C Block"], ["Room No.", "C-214"], ["Type", "Double Sharing"], ["Hostel Fee", "₹45,000"], ["Mess Fee", "₹20,000"], ["Status", "Active"]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
                <span style={{ color: "#64748b" }}>{l}</span>
                <span style={{ fontWeight: 500, color: "#334155" }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
      {tab === "scholarship" && (
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Scholarship Details</div>
          {[{ name: "SOA Merit Scholarship", amount: "₹20,000/yr", status: "Active", renewal: "Jul 2024" }, { name: "AICTE Pragati Scholarship", amount: "₹30,000/yr", status: "Applied", renewal: "—" }].map(s => (
            <div key={s.name} style={{ padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 15 }}>{s.name}</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>Amount: {s.amount} · Renewal: {s.renewal}</div>
                </div>
                <Badge text={s.status} color={s.status === "Active" ? "#10b981" : "#f59e0b"} />
              </div>
            </div>
          ))}
        </Card>
      )}
      {tab === "project" && (
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Project Funding</div>
          <div style={{ color: "#64748b", fontSize: 14 }}>No active project fund requests. You can apply for seed funding for your final year project.</div>
          <button style={{ marginTop: 12, padding: "9px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            Apply for Project Fund
          </button>
        </Card>
      )}
    </div>
  );
}

function NoticesView() {
  const notices = [
    { title: "End-Semester Examination Schedule June 2024", date: "Jun 7, 2024", cat: "Exam", tc: "#6366f1", body: "The schedule for End-Semester examinations is now published. Students are requested to check their hall tickets on the portal." },
    { title: "Assignment Submission Deadline Extended", date: "Jun 6, 2024", cat: "Academic", tc: "#f59e0b", body: "The deadline for CS301 assignment has been extended to June 14, 2024." },
    { title: "GATE 2027 Free Coaching Registration", date: "Jun 5, 2024", cat: "Opportunity", tc: "#10b981", body: "ITER is offering free GATE coaching for 3rd year students. Register before June 20." },
    { title: "Hostel Vacation Checkout", date: "Jun 4, 2024", cat: "Hostel", tc: "#8b5cf6", body: "Students are required to vacate hostel rooms by June 20, 2024 for summer vacation." },
    { title: "Library Book Return", date: "Jun 3, 2024", cat: "Library", tc: "#ec4899", body: "All borrowed books must be returned by June 15 to avoid late fines." },
  ];
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: open ? "1fr 1.5fr" : "1fr", gap: 14 }}>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>All Notices</div>
        {notices.map((n, i) => (
          <div key={i} onClick={() => setOpen(i === open ? null : i)} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: open === i ? 700 : 500, color: open === i ? "#6366f1" : "#334155" }}>{n.title}</div>
              <Badge text={n.cat} color={n.tc} />
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{n.date}</div>
          </div>
        ))}
      </Card>
      {open !== null && (
        <Card>
          <Badge text={notices[open].cat} color={notices[open].tc} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "10px 0 4px" }}>{notices[open].title}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>{notices[open].date}</div>
          <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{notices[open].body}</div>
        </Card>
      )}
    </div>
  );
}

// ─── FACULTY VIEWS ────────────────────────────────────────────────────────────
function FacultyDashboard({ user }) {
  const stats = [
    { label: "Subjects Assigned", value: "4", sub: "This semester", color: "#6366f1", icon: "subject" },
    { label: "Total Students", value: "186", sub: "Across all subjects", color: "#10b981", icon: "user" },
    { label: "Pending Evaluations", value: "12", sub: "Assignments & projects", color: "#f59e0b", icon: "assignment" },
    { label: "Research Scholars", value: "3", sub: "Under supervision", color: "#8b5cf6", icon: "research" },
  ];
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Good morning, {user.name.split(" ").slice(-1)[0]} 👋</div>
        <div style={{ color: "#64748b", fontSize: 14 }}>{user.designation} · {user.dept}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Today's Schedule</div>
          {[
            { time: "9:00 AM", subj: "DBMS", type: "Lecture", room: "LH-101", class: "CSE 5A" },
            { time: "11:00 AM", subj: "DBMS Lab", type: "Lab", room: "DB Lab", class: "CSE 5B" },
            { time: "2:00 PM", subj: "OS", type: "Lecture", room: "LH-102", class: "CSE 5C" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid #f1f5f9", alignItems: "center" }}>
              <div style={{ width: 70, fontSize: 13, fontWeight: 600, color: "#6366f1", flexShrink: 0 }}>{s.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#334155" }}>{s.subj}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.class} · {s.room}</div>
              </div>
              <Badge text={s.type} color={s.type === "Lab" ? "#f59e0b" : "#6366f1"} />
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Pending Actions</div>
          {[
            { action: "Grade CS301 Assignment #4", urgent: true },
            { action: "Submit attendance — CS302 (Jun 7)", urgent: true },
            { action: "Review Rohit's thesis chapter 3", urgent: false },
            { action: "Upload question paper — internal exam", urgent: false },
            { action: "Approve leave: Priya Nair (Jun 10-12)", urgent: false },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #f1f5f9", alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.urgent ? "#ef4444" : "#94a3b8", flexShrink: 0, marginTop: 3 }} />
              <div style={{ fontSize: 14, color: "#334155" }}>{a.action}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function SubjectsView() {
  const [sel, setSel] = useState(null);
  const subjects = [
    { code: "CS301", name: "Database Management Systems", class: "CSE 5A", students: 52, section: "Theory", credits: 4 },
    { code: "CS301L", name: "DBMS Lab", class: "CSE 5B", students: 48, section: "Lab", credits: 2 },
    { code: "CS302", name: "Operating Systems", class: "CSE 5C", students: 50, section: "Theory", credits: 4 },
    { code: "CS499", name: "Final Year Project", class: "CSE 7A", students: 36, section: "Project", credits: 6 },
  ];
  const students = [
    { roll: "22CS001", name: "Riya Patel", email: "riya@iter.in", project: "EEG Cognitive Load", status: "Active" },
    { roll: "22CS005", name: "Amit Kumar", email: "amit@iter.in", project: "IoT Home Automation", status: "Active" },
    { roll: "22CS012", name: "Priya Nair", email: "priya@iter.in", project: "ML on Medical Data", status: "Active" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 1.5fr" : "1fr", gap: 14 }}>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {subjects.map(s => (
            <Card key={s.code} style={{ cursor: "pointer", border: sel?.code === s.code ? "2px solid #6366f1" : "1px solid #e2e8f0" }} onClick={() => setSel(s)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <Badge text={s.code} color="#6366f1" />
                <Badge text={s.section} color={s.section === "Lab" ? "#f59e0b" : s.section === "Project" ? "#8b5cf6" : "#10b981"} />
              </div>
              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4, fontSize: 15 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{s.class} · {s.students} students · {s.credits} credits</div>
            </Card>
          ))}
        </div>
      </div>
      {sel && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{sel.name}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{sel.class} — {sel.students} students</div>
            </div>
            <button style={{ padding: "7px 14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              ✉ Mail All
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Roll No.", "Name", "Email", "Project/Group", "Mail"].map(h => (
                  <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.roll} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 10px", color: "#6366f1", fontWeight: 600 }}>{s.roll}</td>
                  <td style={{ padding: "10px 10px", color: "#334155", fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: "10px 10px", color: "#64748b", fontSize: 13 }}>{s.email}</td>
                  <td style={{ padding: "10px 10px", fontSize: 13, color: "#64748b" }}>{s.project}</td>
                  <td style={{ padding: "10px 10px" }}>
                    <button style={{ padding: "4px 10px", background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#334155" }}>✉</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function ResearchView() {
  const scholars = [
    { id: "R001", name: "Rohit Sharma", roll: "520CS2001", topic: "Data Imputation using Hybrid Clustering (SOHCI)", progress: 65, stage: "Thesis Writing", next: "Submit Ch.4 by Jun 20", papers: 2 },
    { id: "R002", name: "Sneha Panda", roll: "520CS2003", topic: "Parkinson's Detection via EEG Neural Patterns", progress: 40, stage: "Experimentation", next: "Complete dataset analysis", papers: 1 },
    { id: "R003", name: "Amit Das", roll: "520CS2007", topic: "Federated Learning for Healthcare Privacy", progress: 20, stage: "Literature Survey", next: "Submit review draft", papers: 0 },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Active Scholars" value="3" color="#8b5cf6" icon="research" sub="Under supervision" />
        <StatCard label="Papers Published" value="3" color="#10b981" icon="paper" sub="Jointly authored" />
        <StatCard label="Avg. Progress" value="42%" color="#f59e0b" icon="exam" sub="Across all scholars" />
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {scholars.map(s => (
          <Card key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{s.name}</div>
                  <Badge text={s.roll} color="#6366f1" />
                  <Badge text={s.stage} color="#8b5cf6" />
                </div>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 10 }}>📖 {s.topic}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 4 }}>
                    <div style={{ width: s.progress + "%", height: "100%", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontWeight: 700, color: "#6366f1", fontSize: 14, width: 36 }}>{s.progress}%</span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>Next: {s.next} · Papers: {s.papers}</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                <button style={{ padding: "6px 14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✉ Mail</button>
                <button style={{ padding: "6px 14px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>View Work</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DutyView() {
  const duties = [
    { date: "Jun 18", time: "9:00 AM", type: "Invigilation", room: "201-A", exam: "DBMS — CS301", status: "Upcoming" },
    { date: "Jun 18", time: "2:00 PM", type: "Paper Distribution", room: "Admin Block", exam: "Answer sheet collection", status: "Upcoming" },
    { date: "Jun 20", time: "9:00 AM", type: "Invigilation", room: "202-B", exam: "OS — CS302", status: "Upcoming" },
    { date: "Jun 5", time: "10:00 AM", type: "Paper Setting", room: "Faculty Room", exam: "Internal Exam I", status: "Completed" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Upcoming Duties" value="3" color="#6366f1" icon="duty" sub="This exam cycle" />
        <StatCard label="Invigilation" value="2" color="#f59e0b" icon="exam" sub="Rooms assigned" />
        <StatCard label="Completed" value="1" color="#10b981" icon="attendance" sub="This semester" />
      </div>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>Exam & Other Duties</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Date", "Time", "Duty Type", "Venue", "Related To", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {duties.map((d, i) => (
              <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 12px", fontWeight: 700, color: "#6366f1" }}>{d.date}</td>
                <td style={{ padding: "12px 12px", color: "#64748b" }}>{d.time}</td>
                <td style={{ padding: "12px 12px" }}><Badge text={d.type} color="#6366f1" /></td>
                <td style={{ padding: "12px 12px", color: "#334155" }}>{d.room}</td>
                <td style={{ padding: "12px 12px", color: "#475569" }}>{d.exam}</td>
                <td style={{ padding: "12px 12px" }}><Badge text={d.status} color={d.status === "Completed" ? "#10b981" : "#f59e0b"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function EvaluationView() {
  const items = [
    { id: "E001", student: "Riya Patel", subject: "DBMS", type: "Assignment", title: "ER Diagram", submitted: "Jun 8", status: "Pending", maxMarks: 20 },
    { id: "E002", student: "Amit Kumar", subject: "DBMS", type: "Assignment", title: "ER Diagram", submitted: "Jun 7", status: "Graded", maxMarks: 20, given: 17 },
    { id: "E003", student: "Priya Nair", subject: "Final Year Project", type: "Mid Review", title: "Chapter 2 Review", submitted: "Jun 5", status: "Pending", maxMarks: 50 },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Pending" value="8" color="#f59e0b" icon="assignment" sub="Assignments & projects" />
        <StatCard label="Graded This Week" value="12" color="#10b981" icon="exam" sub="Avg score: 16.3/20" />
        <StatCard label="Re-evaluation" value="1" color="#ef4444" icon="notice" sub="Requested" />
      </div>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>Evaluation Queue</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Student", "Subject", "Type", "Title", "Submitted", "Max", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(e => (
              <tr key={e.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "11px 12px", color: "#334155", fontWeight: 500 }}>{e.student}</td>
                <td style={{ padding: "11px 12px" }}><Badge text={e.subject} color="#6366f1" /></td>
                <td style={{ padding: "11px 12px", color: "#64748b" }}>{e.type}</td>
                <td style={{ padding: "11px 12px", color: "#334155" }}>{e.title}</td>
                <td style={{ padding: "11px 12px", color: "#94a3b8" }}>{e.submitted}</td>
                <td style={{ padding: "11px 12px", color: "#334155" }}>{e.maxMarks}</td>
                <td style={{ padding: "11px 12px" }}><Badge text={e.status} color={e.status === "Graded" ? "#10b981" : "#f59e0b"} /></td>
                <td style={{ padding: "11px 12px" }}>
                  {e.status === "Pending" ? (
                    <button style={{ padding: "5px 12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Grade</button>
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>{e.given}/{e.maxMarks}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function LabView() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Lab Sessions" value="6" color="#6366f1" icon="lab" sub="Remaining this semester" />
        <StatCard label="Attendance Today" value="44/48" color="#10b981" icon="attendance" sub="DBMS Lab — Batch B" />
        <StatCard label="Pending Lab Files" value="8" color="#f59e0b" icon="assignment" sub="Students to submit" />
      </div>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>Lab Sessions — DBMS Lab (CS301L)</div>
        {[
          { no: 1, topic: "ER Diagram & Schema Mapping", date: "May 6", status: "Done", submitted: 46 },
          { no: 2, topic: "DDL & DML Queries in MySQL", date: "May 13", status: "Done", submitted: 44 },
          { no: 3, topic: "Joins & Sub-queries", date: "May 20", status: "Done", submitted: 48 },
          { no: 4, topic: "Stored Procedures", date: "Jun 3", status: "Done", submitted: 40 },
          { no: 5, topic: "Triggers & Transactions", date: "Jun 10", status: "Upcoming", submitted: "—" },
          { no: 6, topic: "Mini Project Viva", date: "Jun 17", status: "Upcoming", submitted: "—" },
        ].map(l => (
          <div key={l.no} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: l.status === "Done" ? "#10b98115" : "#6366f115", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: l.status === "Done" ? "#10b981" : "#6366f1" }}>{l.no}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#334155" }}>{l.topic}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.date}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {l.status === "Done" && <span style={{ fontSize: 12, color: "#64748b" }}>Files: {l.submitted}/48</span>}
              <Badge text={l.status} color={l.status === "Done" ? "#10b981" : "#6366f1"} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(null);
  const [role, setRole] = useState(null);
  const [active, setActive] = useState("dashboard");

  if (!auth) return <LoginScreen onLogin={(r, u) => { setRole(r); setAuth(u); setActive("dashboard"); }} />;

  const nav = role === "student" ? STUDENT_NAV : FACULTY_NAV;

  const views = role === "student"
    ? { dashboard: <StudentDashboard user={auth} />, attendance: <AttendanceView role="student" />, papers: <QuestionPapers />, assignments: <AssignmentsView role="student" />, exams: <ExamResultsView />, fee: <FeeView />, hostel: <FeeView />, notices: <NoticesView /> }
    : { dashboard: <FacultyDashboard user={auth} />, subjects: <SubjectsView />, lab: <LabView />, attendance: <AttendanceView role="faculty" />, evaluation: <EvaluationView />, research: <ResearchView />, duty: <DutyView />, notices: <NoticesView /> };

  return (
    <Layout user={auth} role={role} nav={nav} active={active} setActive={setActive} onLogout={() => { setAuth(null); setRole(null); }}>
      {views[active] || <div style={{ color: "#94a3b8" }}>Coming soon</div>}
    </Layout>
  );
}
