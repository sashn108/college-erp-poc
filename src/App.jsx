import { useState, useEffect } from "react";
import { FirebaseLogin, RealtimeChat, LiveFeedbackView, LiveFacultyFeedback, useFirebaseAuth, AdminUserApprovals } from "./FirebaseApp.jsx";
import { logOut, getPendingUsers } from "./firebase.js";

// ─── Odisha Holidays 2026 ─────────────────────────────────────────────────────
const ODISHA_HOLIDAYS = {
  "2026-01-01":"New Year's Day",
  "2026-01-06":"Idul Fitr (Eid)",
  "2026-01-14":"Makar Sankranti",
  "2026-01-26":"Republic Day",
  "2026-02-11":"Maha Shivaratri",
  "2026-02-19":"Birth Anniv. of Shivaji",
  "2026-03-01":"Dol Purnima / Holi",
  "2026-03-02":"Holi (2nd Day)",
  "2026-03-22":"Ugadi / Gudi Padwa",
  "2026-03-30":"Ram Navami",
  "2026-04-01":"Utkal Diwas (Odisha Day)",
  "2026-04-02":"Mahavir Jayanti",
  "2026-04-03":"Good Friday",
  "2026-04-14":"Ambedkar Jayanti / Vishu",
  "2026-05-01":"May Day (Labour Day)",
  "2026-05-16":"Buddha Purnima",
  "2026-06-10":"Rath Yatra",
  "2026-07-27":"Bakrid (Eid ul-Adha)",
  "2026-08-15":"Independence Day",
  "2026-08-22":"Janmashtami",
  "2026-08-25":"Muharram",
  "2026-09-04":"Nuakhai",
  "2026-09-07":"Ganesh Chaturthi",
  "2026-09-23":"Kumar Purnima",
  "2026-10-02":"Gandhi Jayanti",
  "2026-10-20":"Dussehra (Vijaya Dashami)",
  "2026-10-28":"Diwali (Lakshmi Puja)",
  "2026-10-29":"Diwali (2nd Day)",
  "2026-10-30":"Kali Puja",
  "2026-11-04":"Bhai Dwitiya",
  "2026-11-05":"Chhat Puja",
  "2026-11-19":"Guru Nanak Jayanti",
  "2026-12-25":"Christmas Day",
};

// ─── Global Search ────────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  // Students
  {type:"student",label:"Riya Patel",sub:"CSE · 3rd Year · Roll: 22CS001",key:"students"},
  {type:"student",label:"Amit Kumar",sub:"CSE · 3rd Year · Roll: 22CS005",key:"students"},
  {type:"student",label:"Priya Nair",sub:"CSE · 3rd Year · Roll: 22CS012",key:"students"},
  {type:"student",label:"Rahul Das",sub:"ECE · 4th Year · Roll: 21EC001",key:"students"},
  {type:"student",label:"Sneha Panda",sub:"MECH · 3rd Year · Roll: 22ME003",key:"students"},
  // Faculty
  {type:"faculty",label:"Dr. Priya Singh",sub:"CSE · Asst. Professor",key:"faculty"},
  {type:"faculty",label:"Prof. Ramesh Panda",sub:"ECE · Professor",key:"faculty"},
  {type:"faculty",label:"Dr. Sunita Das",sub:"MECH · Assoc. Professor",key:"faculty"},
  // Notices
  {type:"notice",label:"Exam Schedule Released",sub:"Notice · Jun 2026",key:"notices"},
  {type:"notice",label:"Fee Payment Deadline",sub:"Notice · Jun 2026",key:"notices"},
  {type:"notice",label:"Cultural Fest Announcement",sub:"Notice · Jun 2026",key:"notices"},
  // Subjects
  {type:"subject",label:"Database Management Systems",sub:"CS301 · CSE · 5th Sem",key:"subjects"},
  {type:"subject",label:"Operating Systems",sub:"CS302 · CSE · 5th Sem",key:"subjects"},
  {type:"subject",label:"Computer Networks",sub:"CS303 · CSE · 5th Sem",key:"subjects"},
  {type:"subject",label:"Theory of Computation",sub:"CS304 · CSE · 5th Sem",key:"subjects"},
  // Question Papers
  {type:"paper",label:"DBMS End Sem 2024",sub:"CSE · 5th Sem · 2024",key:"papers"},
  {type:"paper",label:"OS Mid Sem 2025",sub:"CSE · 5th Sem · 2025",key:"papers"},
  {type:"paper",label:"CN End Sem 2023",sub:"CSE · 5th Sem · 2023",key:"papers"},
];
const TYPE_ICON = {student:"👤",faculty:"🧑‍🏫",notice:"📢",subject:"📚",paper:"📄"};
const TYPE_COLOR = {student:"#6366f1",faculty:"#10b981",notice:"#f59e0b",subject:"#8b5cf6",paper:"#ec4899"};

function GlobalSearch({ setActive }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  const results = query.trim().length > 1
    ? SEARCH_INDEX.filter(item =>
        (item.label + item.sub).toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{position:"relative",flex:1,maxWidth:380}}>
      <div style={{display:"flex",alignItems:"center",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"0 10px",gap:8}}>
        <span style={{color:"#94a3b8",fontSize:14}}>🔍</span>
        <input
          value={query}
          onChange={e=>{ setQuery(e.target.value); setOpen(true); }}
          onFocus={()=>setOpen(true)}
          placeholder="Search student, faculty, notice, subject, papers..."
          style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,padding:"8px 0",fontFamily:"inherit",color:"#334155"}}
        />
        {query && <span onClick={()=>{setQuery("");setOpen(false);}} style={{cursor:"pointer",color:"#94a3b8",fontSize:16,lineHeight:1}}>✕</span>}
      </div>
      {open && results.length > 0 && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:500,marginTop:4,overflow:"hidden"}}>
          {results.map((r,i)=>(
            <div key={i} onClick={()=>{ setActive(r.key); setOpen(false); setQuery(""); }}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",borderBottom:"1px solid #f8fafc",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <span style={{fontSize:18,width:28,textAlign:"center"}}>{TYPE_ICON[r.type]}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{r.label}</div>
                <div style={{fontSize:11,color:"#94a3b8"}}>{r.sub}</div>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:TYPE_COLOR[r.type],background:TYPE_COLOR[r.type]+"15",padding:"2px 8px",borderRadius:10}}>{r.type}</span>
            </div>
          ))}
          <div style={{padding:"7px 14px",fontSize:11,color:"#94a3b8",borderTop:"1px solid #f1f5f9",textAlign:"center"}}>
            Press Enter or click a result to navigate
          </div>
        </div>
      )}
      {open && query.trim().length > 1 && results.length === 0 && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:500,marginTop:4,padding:"16px",textAlign:"center",color:"#94a3b8",fontSize:13}}>
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar() {
  const today = new Date();
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [tooltip, setTooltip] = useState(null); // {day, x, y, text}
  const year = cur.getFullYear(), month = cur.getMonth();
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const monthName = cur.toLocaleString("default",{month:"long"});
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  // Clamp navigation: Jan 2026 – Aug 2026
  const minDate = new Date(2026, 0, 1);
  const maxDate = new Date(2026, 7, 1);
  const prevMonth = () => { const n=new Date(year,month-1,1); if(n>=minDate) setCur(n); };
  const nextMonth = () => { const n=new Date(year,month+1,1); if(n<=maxDate) setCur(n); };
  const cells = [];
  for(let i=0;i<offset;i++) cells.push(null);
  for(let i=1;i<=daysInMonth;i++) cells.push(i);

  const isToday = (d) => d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
  const isSunday = (d) => new Date(year,month,d).getDay()===0;
  const isSaturday = (d) => new Date(year,month,d).getDay()===6;
  const getHoliday = (d) => {
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return ODISHA_HOLIDAYS[key]||null;
  };

  return (
    <div style={{padding:"12px 10px",position:"relative"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <button onClick={prevMonth} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16,lineHeight:1}}>‹</button>
        <span style={{fontWeight:700,fontSize:13,color:"#fff"}}>{monthName} {year}</span>
        <button onClick={nextMonth} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16,lineHeight:1}}>›</button>
      </div>

      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center",marginBottom:2}}>
        {days.map(d=><div key={d} style={{fontSize:9,color:"#666",padding:"2px 0",fontWeight:700}}>{d}</div>)}
      </div>

      {/* Date cells */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center",position:"relative"}}>
        {cells.map((d,i)=>{
          if(d===null) return <div key={"e"+i}/>;
          const holiday = getHoliday(d);
          const isH = !!holiday;
          const isSun = isSunday(d);
          const isSat = isSaturday(d);
          const isT = isToday(d);
          const isWeekend = isSun||isSat;
          return (
            <div key={d}
              onMouseEnter={e=>{
                if(isH||isWeekend) setTooltip({day:d, text: isH ? holiday : isSun?"Sunday (Holiday)":"Saturday"});
              }}
              onMouseLeave={()=>setTooltip(null)}
              style={{
                fontSize:11,padding:"4px 0",borderRadius:4,cursor: isH?"help":"default",
                position:"relative",
                background: isT?"#6366f1": isH?"#dc2626": isSun?"#3a2020": isSat?"#1e2a3a":"transparent",
                color: isT?"#fff": isH?"#fff": isSun?"#f87171": isSat?"#93c5fd":"#ccc",
                fontWeight: isT||isH?700:400,
                outline: isH?"1px solid #ef444460":"none",
                transition:"background .15s",
              }}>
              {d}
              {isH&&<div style={{width:4,height:4,borderRadius:"50%",background:"#fca5a5",margin:"1px auto 0",display:"block"}}/>}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip&&(
        <div style={{background:"#1e293b",border:"1px solid #6366f1",borderRadius:6,padding:"5px 10px",fontSize:11,color:"#e2e8f0",marginTop:8,textAlign:"center",fontWeight:600,lineHeight:1.4}}>
          🗓 {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div style={{marginTop:10,display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#888"}}>
          <div style={{width:8,height:8,borderRadius:2,background:"#dc2626"}}/> Holiday
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#888"}}>
          <div style={{width:8,height:8,borderRadius:2,background:"#6366f1"}}/> Today
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#888"}}>
          <div style={{width:8,height:8,borderRadius:2,background:"#3a2020"}}/> Sunday
        </div>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [uid, setUid] = useState(""), [pass, setPass] = useState(""), [err, setErr] = useState("");
  const handle = () => {
    if(!uid||!pass){setErr("Enter credentials");return;}
    if(role==="student"&&uid==="S001"&&pass==="student123") onLogin("student",{name:"SUBHASHISH NAYAK",roll:"520CS2008",dept:"CSE",year:"PhD Scholar",id:"S001",status:"approved"});
    else if(role==="faculty"&&uid==="F001"&&pass==="faculty123") onLogin("faculty",{name:"Dr. Priya Singh",dept:"CSE",designation:"Asst. Professor",id:"F001",status:"approved"});
    else if(role==="admin"&&uid==="A001"&&pass==="admin123") onLogin("admin",{name:"Dr. R. K. Mohanty",designation:"Registrar",dept:"Administration",id:"A001",status:"approved"});
    else setErr("Invalid credentials.");
  };
  const roles = [{key:"student",label:"Student"},{key:"faculty",label:"Faculty"},{key:"admin",label:"Admin"}];
  const placeholders = {student:"Roll Number (S001)",faculty:"Faculty ID (F001)",admin:"Admin ID (A001)"};
  const demos = {student:"S001 / student123",faculty:"F001 / faculty123",admin:"A001 / admin123"};
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e293b)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:12,padding:"40px 36px",width:400,boxShadow:"0 8px 40px rgba(0,0,0,0.4)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:24}}>🎓</div>
          <div style={{fontSize:24,fontWeight:900,color:"#0f172a",letterSpacing:-0.5}}>ITER ERP</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>Siksha 'O' Anusandhan University</div>
        </div>
        {/* Role toggle */}
        <div style={{display:"flex",background:"#f5f5f5",borderRadius:8,marginBottom:20,padding:3,gap:3}}>
          {roles.map(r=>(
            <button key={r.key} onClick={()=>{setRole(r.key);setErr("");setUid("");setPass("");}}
              style={{flex:1,padding:"8px 0",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
                background:role===r.key?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",
                color:role===r.key?"#fff":"#555"}}>
              {r.label}
            </button>
          ))}
        </div>
        {[{ph:placeholders[role],val:uid,set:setUid,type:"text"},{ph:"Password",val:pass,set:setPass,type:"password"}].map(({ph,val,set,type},i)=>(
          <input key={i} type={type} placeholder={ph} value={val}
            onChange={e=>{set(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{width:"100%",boxSizing:"border-box",padding:"10px 12px",border:"1px solid #ddd",borderRadius:8,fontSize:14,marginBottom:12,outline:"none",fontFamily:"inherit"}}/>
        ))}
        {err&&<div style={{color:"#c0392b",fontSize:13,marginBottom:10,padding:"7px 10px",background:"#fdf0f0",borderRadius:6}}>{err}</div>}
        <button onClick={handle} style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>
          Sign In
        </button>
        <div style={{color:"#aaa",fontSize:11,textAlign:"center",marginTop:16}}>
          Demo: <span style={{color:"#6366f1"}}>{demos[role]}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────
function Header({ user, role, onLogout, academicOpen, setAcademicOpen, setActive }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  const timeStr = now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

  const studentMenuItems = [
    ["Student Information","dashboard"],["Registration","dashboard"],["Attendance and Leave","attendance"],
    ["Feedback / Assessment","dashboard"],["Examination","exam"],["Fee Payment","fee"],
    ["Hostel Management","fee"],["Thesis Submission","dashboard"],["Assignments","assignments"],
    ["Research Scholars' Week","dashboard"],["SAC Election","dashboard"],["Student Project management","dashboard"],
    ["Dissertation Template","dashboard"],["Scholarships","fee"],
    ["Account Settings","dashboard"],["Other Services","dashboard"],["Career Development Centre","dashboard"],
  ];
  const facultyMenuItems = [
    ["Dashboard","dashboard"],["Subjects & Students","subjects"],["Lab Management","lab"],
    ["Attendance & Leave","attendance"],["Evaluation","evaluation"],
    ["Research Scholars","research"],["Exam & Duty","duty"],["Notices","notices"],
  ];
  const menuItems = role==="student" ? studentMenuItems : facultyMenuItems;

  return (
    <div style={{position:"relative",zIndex:100}}>
      {/* Top bar */}
      <div style={{background:"#fff",borderBottom:"3px solid #6366f1",display:"flex",alignItems:"center",padding:"0 16px",height:56,gap:16,fontFamily:"'Segoe UI',sans-serif"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:6,minWidth:140}}>
          <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:22,color:"#6366f1",fontStyle:"italic",letterSpacing:1}}>ITER</div>
          <div style={{fontSize:9,color:"#888",lineHeight:1.2}}>SOA<br/>University</div>
        </div>
        {/* Hamburger */}
        <div style={{cursor:"pointer",fontSize:20,color:"#555"}}>☰</div>
        {/* Academic dropdown trigger */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setAcademicOpen(o=>!o)}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,color:"#333",display:"flex",alignItems:"center",gap:4,padding:"6px 10px"}}>
            Academic <span style={{fontSize:10,color:"#6366f1"}}>▼</span>
          </button>
        </div>
        <div style={{flex:1}}/>
        {/* Right side */}
        <div style={{fontSize:13,color:"#555",fontWeight:500}}>{dateStr} &nbsp; {timeStr}</div>
        <div style={{width:34,height:34,borderRadius:"50%",background:"#6366f1",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}
          title="Logout" onClick={onLogout}>
          {user.name[0]}
        </div>
      </div>

      {/* Dropdown */}
      {academicOpen && (
        <div style={{position:"absolute",top:56,left:0,right:0,background:"#fff",borderBottom:"2px solid #ddd",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",padding:"18px 32px",zIndex:200}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px 24px"}}>
            {menuItems.map(([label, key])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",fontSize:13,color:"#333",fontWeight:500}}
                onClick={()=>{ setActive(key); setAcademicOpen(false); }}>
                <span style={{color:"#6366f1",fontSize:15}}>●</span> {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Widgets ──────────────────────────────────────────────────────────────────
function Widget({ title, children, style={} }) {
  return (
    <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:2,overflow:"hidden",...style}}>
      <div style={{background:"#6366f1",color:"#fff",padding:"8px 14px",fontSize:13,fontWeight:700}}>{title}</div>
      <div style={{padding:14}}>{children}</div>
    </div>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
// ─── CSV Student Upload ───────────────────────────────────────────────────────
function CSVStudentUpload() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const parseCSV = (text) => {
    setError("");
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length < 2) { setError("CSV must have a header row and at least one data row."); return; }
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g,"_"));
    const nameCol = headers.findIndex(h => h.includes("name"));
    const rollCol = headers.findIndex(h => h.includes("roll") || h.includes("reg") || h.includes("id"));
    const deptCol = headers.findIndex(h => h.includes("dept") || h.includes("branch"));
    const yearCol = headers.findIndex(h => h.includes("year") || h.includes("sem"));
    if (nameCol === -1 || rollCol === -1) { setError("CSV must have 'name' and 'roll/reg' columns."); return; }
    const parsed = lines.slice(1).map((line, i) => {
      const cols = line.split(",").map(c => c.trim());
      return {
        id: i + 1,
        name: cols[nameCol] || "—",
        roll: cols[rollCol] || "—",
        dept: deptCol !== -1 ? cols[deptCol] : "—",
        year: yearCol !== -1 ? cols[yearCol] : "—",
      };
    }).filter(s => s.name !== "—" || s.roll !== "—");
    setStudents(parsed);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".csv")) { setError("Please upload a .csv file."); return; }
    const reader = new FileReader();
    reader.onload = e => parseCSV(e.target.result);
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Widget title="📤 CSV Student Upload — Auto Display">
      {students.length === 0 ? (
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={handleDrop}
          style={{border:`2px dashed ${dragging?"#6366f1":"#e2e8f0"}`,borderRadius:10,padding:"28px 20px",textAlign:"center",background:dragging?"#eef2ff":"#fafafa",transition:"all .2s",cursor:"pointer"}}
          onClick={()=>document.getElementById("csv-upload-input").click()}>
          <div style={{fontSize:36,marginBottom:8}}>📂</div>
          <div style={{fontWeight:600,color:"#334155",fontSize:14,marginBottom:4}}>Drag & Drop CSV file here</div>
          <div style={{fontSize:12,color:"#94a3b8",marginBottom:14}}>or click to browse · Columns: Name, Roll/Reg No, Dept, Year</div>
          <button style={{padding:"8px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>Choose File</button>
          <input id="csv-upload-input" type="file" accept=".csv" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          {error && <div style={{marginTop:10,color:"#ef4444",fontSize:12,fontWeight:600}}>{error}</div>}
        </div>
      ) : (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>✅ {students.length} students loaded from CSV</div>
            <button onClick={()=>setStudents([])} style={{padding:"5px 14px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:7,fontWeight:600,cursor:"pointer",fontSize:12}}>Clear</button>
          </div>
          <div style={{overflowX:"auto",maxHeight:260,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead style={{position:"sticky",top:0}}>
                <tr style={{background:"#6366f1",color:"#fff"}}>
                  {["#","Name","Roll / Reg No","Dept","Year"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:11}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {students.map((s,i)=>(
                  <tr key={s.id} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                    <td style={{padding:"6px 10px",color:"#94a3b8",fontSize:11}}>{s.id}</td>
                    <td style={{padding:"6px 10px",fontWeight:600,color:"#0f172a"}}>{s.name}</td>
                    <td style={{padding:"6px 10px",color:"#6366f1",fontWeight:700}}>{s.roll}</td>
                    <td style={{padding:"6px 10px",color:"#64748b"}}>{s.dept}</td>
                    <td style={{padding:"6px 10px",color:"#64748b"}}>{s.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Widget>
  );
}

function StudentDashboard({ user }) {
  const importantDates = [
    ["Research Scholars' Week (Abstract Submission)","Apr 29, 2026"],
    ["Apply Mark Change (Student)","Feb 06, 2026"],
    ["De-Registration","Feb 09, 2026"],
    ["Amend Final Registration (Research)","Jan 15, 2026"],
    ["Final Registration","Jan 15, 2026"],
    ["Supplementary Registration","Jun 03, 2026"],
    ["Course Feedback","Jun 08, 2026"],
    ["Income Certificate Uploading (2026-27/Autumn)","Jun 10, 2026"],
    ["Summer Registration","May 05, 2026"],
  ];
  const circulars = [
    "Invitation to an IIITH-Backed AI Awareness Session for Academic Leaders",
    "Nomination invited for National Award to Teachers for Higher Education and Polytechnics",
    "Recruitment of Non-Teaching posts in VSSUT, Burla",
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
      {/* Anti-Ragging */}
      <Widget title="Your Anti-Ragging Undertaking">
        <div style={{fontSize:12,color:"#555",lineHeight:1.6}}>
          I have read the details about <strong>NATIONAL RAGGING PREVENTION PROGRAMME</strong> by UGC Monitoring Agency and have confirmed to obey the rules of anti-ragging laid down by the institute.
        </div>
        <div style={{marginTop:10,fontWeight:700,fontSize:13,color:"#333"}}>{user.name}</div>
        <div style={{fontSize:12,color:"#888"}}>Accepted on: 01-01-2026 10:10:10</div>
      </Widget>

      {/* Webmail */}
      <Widget title="Webmail and Microsoft Team Credential Information">
        <div style={{fontSize:12,color:"#555",lineHeight:1.8}}>
          <div><strong>A) Webmail link –</strong> <span style={{color:"#1a6eb5"}}>https://gmail.com</span></div>
          <div style={{color:"#c0392b",fontWeight:600}}>User ID : {user.roll}@nitrkl.ac.in</div>
          <div style={{color:"#c0392b",fontWeight:600}}>Password : Your Webmail password has NOT been generated.</div>
          <div style={{marginTop:8}}><strong>B) Microsoft Teams App:</strong> Download MSTEAM APP from <span style={{color:"#1a6eb5"}}>https://www.office.com</span></div>
        </div>
      </Widget>

      {/* External Circulars */}
      <Widget title="External Circulars">
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#6366f1",color:"#fff"}}>
              <th style={{padding:"6px 8px",textAlign:"left",width:24}}>#</th>
              <th style={{padding:"6px 8px",textAlign:"left"}}>Circular Title</th>
              <th style={{padding:"6px 8px",width:50}}>Details</th>
            </tr>
          </thead>
          <tbody>
            {circulars.map((c,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
                <td style={{padding:"6px 8px",color:"#555"}}>{i+1}</td>
                <td style={{padding:"6px 8px",color:"#333"}}>{c}</td>
                <td style={{padding:"6px 8px",textAlign:"center"}}><span style={{color:"#6366f1",cursor:"pointer",fontSize:16}}>📄</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>

      {/* Registered Courses + Timetable */}
      <Widget title="Registered Courses & Timetable [ 2025-26 / Spring ]" style={{gridColumn:"1/3"}}>
        {(()=>{
          const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
          const slots=["9:00–10:00","10:00–11:00","11:00–12:00","12:00–1:00","1:00–2:00","2:00–3:00","3:00–4:00","4:00–5:00"];
          const today=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
          const tt={
            "Monday":   ["CS301·LH-101","CS301·LH-101","—","CS302·LH-102","BREAK","CS304·LH-103","—","—"],
            "Tuesday":  ["CS303·LH-202","—","CS305·LH-201","—","BREAK","CS301·LH-101","CS301·LH-101","—"],
            "Wednesday":["—","CS302·LH-102","CS302·LH-102","—","BREAK","CS304·LH-103","CS305·LH-201","—"],
            "Thursday": ["CS301·LH-101","—","CS303·LH-202","CS303·LH-202","BREAK","—","CS302·LH-102","—"],
            "Friday":   ["CS305·LH-201","CS304·LH-103","—","CS301·LH-101","BREAK","—","CS303·LH-202","—"],
            "Saturday": ["CS301L·DBLab","CS301L·DBLab","—","—","BREAK","—","—","—"],
          };
          const cc={CS301:"#6366f1",CS302:"#10b981",CS303:"#f59e0b",CS304:"#8b5cf6",CS305:"#ec4899",CS301L:"#14b8a6"};
          const cn={CS301:"DBMS",CS302:"OS",CS303:"CN",CS304:"TOC",CS305:"SE",CS301L:"DBMS Lab"};
          const courses=[
            {code:"CS301",name:"Database Management Systems",credits:4,type:"Core",faculty:"Dr. A. Sharma"},
            {code:"CS302",name:"Operating Systems",credits:4,type:"Core",faculty:"Prof. S. Das"},
            {code:"CS303",name:"Computer Networks",credits:4,type:"Core",faculty:"Dr. R. Panda"},
            {code:"CS304",name:"Theory of Computation",credits:3,type:"Core",faculty:"Dr. K. Rath"},
            {code:"CS305",name:"Software Engineering",credits:3,type:"Core",faculty:"Prof. M. Behera"},
            {code:"CS301L",name:"DBMS Lab",credits:2,type:"Lab",faculty:"Dr. A. Sharma"},
          ];
          const totalCredits=courses.reduce((a,c)=>a+c.credits,0);
          return (
            <div>
              {/* Course pills */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>
                {courses.map(c=>(
                  <div key={c.code} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",borderRadius:8,border:`1px solid ${(cc[c.code]||"#6366f1")}30`,background:(cc[c.code]||"#6366f1")+"10"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:cc[c.code]||"#6366f1",flexShrink:0}}/>
                    <span style={{fontWeight:700,fontSize:11,color:cc[c.code]||"#6366f1"}}>{c.code}</span>
                    <span style={{fontSize:11,color:"#475569"}}>{c.name}</span>
                    <span style={{fontSize:10,color:"#94a3b8"}}>{c.credits}cr</span>
                  </div>
                ))}
                <div style={{marginLeft:"auto",fontSize:12,color:"#6366f1",fontWeight:700,alignSelf:"center"}}>Total: {totalCredits} credits</div>
              </div>
              {/* Timetable grid */}
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:620}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      <th style={{padding:"6px 8px",textAlign:"left",fontWeight:700,color:"#475569",width:85,borderBottom:"2px solid #e2e8f0"}}>TIME</th>
                      {days.map(d=>(
                        <th key={d} style={{padding:"6px 5px",fontWeight:700,fontSize:10,textAlign:"center",borderBottom:"2px solid #e2e8f0",
                          color:d===today?"#6366f1":"#475569",background:d===today?"#eef2ff":"transparent"}}>
                          {d.slice(0,3).toUpperCase()}
                          {d===today&&<div style={{fontSize:8,color:"#6366f1"}}>TODAY</div>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot,si)=>(
                      <tr key={slot} style={{borderBottom:"1px solid #f1f5f9",background:si%2===0?"#fff":"#fafbff"}}>
                        <td style={{padding:"5px 8px",fontSize:10,fontWeight:600,color:"#64748b",whiteSpace:"nowrap"}}>{slot}</td>
                        {days.map(d=>{
                          const cell=(tt[d]||[])[si]||"—";
                          if(cell==="BREAK") return <td key={d} style={{padding:"4px",textAlign:"center",background:"#fef9c3",fontSize:9,fontWeight:600,color:"#92400e"}}>BREAK</td>;
                          if(cell==="—") return <td key={d} style={{padding:"4px",textAlign:"center",color:"#e2e8f0",background:d===today?"#f5f6ff":"transparent",fontSize:12}}>—</td>;
                          const [code,room]=cell.split("·");
                          const c=cc[code]||"#6366f1";
                          return (
                            <td key={d} style={{padding:"3px 4px",background:d===today?"#eef2ff":"transparent"}}>
                              <div style={{background:c+"15",borderLeft:`3px solid ${c}`,borderRadius:3,padding:"3px 5px"}}>
                                <div style={{fontWeight:700,fontSize:10,color:c}}>{code}</div>
                                <div style={{fontSize:9,color:"#94a3b8"}}>{room}</div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </Widget>

      {/* CSV Student Upload (Admin uploads, reflects here) */}
      <CSVStudentUpload/>

      {/* Important Dates */}
      <Widget title="Important Dates">
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#6366f1",color:"#fff"}}>
              <th style={{padding:"5px 8px",textAlign:"left"}}>Event</th>
              <th style={{padding:"5px 8px",textAlign:"right",whiteSpace:"nowrap"}}>Last Date</th>
            </tr>
          </thead>
          <tbody>
            {importantDates.map(([evt,dt],i)=>(
              <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
                <td style={{padding:"5px 8px",color:"#333",fontSize:11}}>{evt}</td>
                <td style={{padding:"5px 8px",color:"#c0392b",fontWeight:600,textAlign:"right",whiteSpace:"nowrap",fontSize:11}}>{dt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
    </div>
  );
}

// ─── Faculty Dashboard ────────────────────────────────────────────────────────
function FacultyDashboard({ user }) {
  const stats = [
    { label:"Total Students Enrolled", value:"4,872", icon:"🎓", color:"#6366f1" },
    { label:"Total Faculty", value:"312", icon:"👨‍🏫", color:"#6366f1" },
    { label:"Publications", value:"1,248", icon:"📄", color:"#1a6b2a" },
    { label:"Patents Filed", value:"87", icon:"💡", color:"#7a5c1a" },
  ];
  const birthdays = [];
  const circulars = [
    "AICTE Faculty Development Programme — Registration Open till Jun 20",
    "PhD Viva-Voce Schedule — June 2026 batch published",
    "Research Grant Submission Deadline: Jun 30, 2026",
  ];
  const importantDates = [
    ["End Semester Exam (Theory)","Jun 18, 2026"],
    ["Grade Submission Deadline","Jun 28, 2026"],
    ["PhD Thesis Evaluation","Jul 05, 2026"],
    ["Faculty Appraisal Submission","Jul 10, 2026"],
    ["Autumn Semester Start","Jul 21, 2026"],
    ["NIRF Data Submission","Aug 01, 2026"],
  ];
  return (
    <div>
      {/* Welcome banner */}
      <div style={{background:"linear-gradient(135deg,#6366f1,#c0392b)",color:"#fff",borderRadius:3,padding:"14px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:18,fontWeight:700}}>Welcome, {user.name}</div>
          <div style={{fontSize:13,opacity:0.85}}>{user.designation} · Department of {user.dept}</div>
        </div>
        <div style={{fontSize:12,opacity:0.8,textAlign:"right"}}>
          Faculty ID: {user.id}<br/>
          {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {stats.map(s=>(
          <div key={s.label} style={{background:"#fff",border:"1px solid #e0e0e0",borderTop:`4px solid ${s.color}`,borderRadius:2,padding:"16px 14px",textAlign:"center"}}>
            <div style={{fontSize:28}}>{s.icon}</div>
            <div style={{fontSize:26,fontWeight:800,color:s.color,margin:"4px 0"}}>{s.value}</div>
            <div style={{fontSize:12,color:"#666",fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Timetable */}
        <Widget title="📅 Weekly Timetable" style={{gridColumn:"1/-1"}}>
          {(()=>{
            const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            const slots=["9:00–10:00","10:00–11:00","11:00–12:00","12:00–1:00","1:00–2:00","2:00–3:00","3:00–4:00","4:00–5:00"];
            const today=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
            const timetable={
              "Monday":    ["CS301·LH-101·CSE5A","CS301·LH-101·CSE5A","—","CS302·LH-102·CSE5C","BREAK","—","CS301L·DBLab·CSE5B","CS301L·DBLab·CSE5B"],
              "Tuesday":   ["—","CS302·LH-102·CSE5C","CS302·LH-102·CSE5C","—","BREAK","CS499·FR-01·CSE7A","CS499·FR-01·CSE7A","—"],
              "Wednesday": ["CS301·LH-101·CSE5A","CS301·LH-101·CSE5A","—","CS302·LH-102·CSE5C","BREAK","—","—","CS499·FR-01·CSE7A"],
              "Thursday":  ["—","CS302·LH-102·CSE5C","—","CS301·LH-101·CSE5A","BREAK","CS301L·DBLab·CSE5B","CS301L·DBLab·CSE5B","—"],
              "Friday":    ["CS302·LH-102·CSE5C","—","CS301·LH-101·CSE5A","—","BREAK","CS499·FR-01·CSE7A","—","—"],
              "Saturday":  ["—","CS301L·DBLab·CSE5B","CS301L·DBLab·CSE5B","—","BREAK","—","—","—"],
            };
            const codeColor={"CS301":"#6366f1","CS302":"#10b981","CS301L":"#f59e0b","CS499":"#8b5cf6"};
            return (
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:700}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      <th style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:"#475569",fontSize:11,width:90,borderBottom:"2px solid #e2e8f0"}}>TIME</th>
                      {days.map(d=>(
                        <th key={d} style={{padding:"8px 8px",fontWeight:700,fontSize:11,textAlign:"center",borderBottom:"2px solid #e2e8f0",
                          color:d===today?"#6366f1":"#475569",
                          background:d===today?"#eef2ff":"transparent"}}>
                          {d.slice(0,3).toUpperCase()}
                          {d===today&&<div style={{fontSize:9,fontWeight:600,color:"#6366f1"}}>TODAY</div>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot,si)=>(
                      <tr key={slot} style={{borderBottom:"1px solid #f1f5f9",background:si%2===0?"#fff":"#fafbff"}}>
                        <td style={{padding:"7px 10px",fontSize:11,fontWeight:600,color:"#64748b",whiteSpace:"nowrap"}}>{slot}</td>
                        {days.map(d=>{
                          const cell=(timetable[d]||[])[si]||"—";
                          if(cell==="BREAK") return <td key={d} style={{padding:"7px 8px",textAlign:"center",background:"#fef9c3",fontSize:10,fontWeight:600,color:"#92400e"}}>BREAK</td>;
                          if(cell==="—") return <td key={d} style={{padding:"7px 8px",textAlign:"center",color:"#cbd5e1",fontSize:12,background:d===today?"#f5f6ff":"transparent"}}>—</td>;
                          const [code,room,cls]=cell.split("·");
                          const c=codeColor[code]||"#6366f1";
                          return (
                            <td key={d} style={{padding:"5px 6px",background:d===today?"#eef2ff":"transparent"}}>
                              <div style={{background:c+"15",border:`1px solid ${c}30`,borderLeft:`3px solid ${c}`,borderRadius:4,padding:"4px 6px"}}>
                                <div style={{fontWeight:700,fontSize:11,color:c}}>{code}</div>
                                <div style={{fontSize:10,color:"#475569"}}>{room}</div>
                                <div style={{fontSize:9,color:"#94a3b8"}}>{cls}</div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap"}}>
                  {Object.entries(codeColor).map(([code,c])=>(
                    <div key={code} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
                      <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                      <span style={{color:"#64748b",fontWeight:500}}>{code} — {{CS301:"Database Mgmt Sys",CS302:"Operating Systems",CS301L:"DBMS Lab","CS499":"Final Year Project"}[code]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </Widget>

        {/* Circulars */}
        <Widget title="External Circulars">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#6366f1",color:"#fff"}}>
                <th style={{padding:"5px 6px",width:20}}>#</th>
                <th style={{padding:"5px 6px",textAlign:"left"}}>Circular Title</th>
              </tr>
            </thead>
            <tbody>
              {circulars.map((c,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
                  <td style={{padding:"6px",color:"#555",textAlign:"center"}}>{i+1}</td>
                  <td style={{padding:"6px",color:"#333",fontSize:12,lineHeight:1.4}}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>

        {/* Important Dates */}
        <Widget title="Important Dates">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#6366f1",color:"#fff"}}>
                <th style={{padding:"5px 8px",textAlign:"left"}}>Event</th>
                <th style={{padding:"5px 8px",textAlign:"right"}}>Date</th>
              </tr>
            </thead>
            <tbody>
              {importantDates.map(([evt,dt],i)=>(
                <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
                  <td style={{padding:"5px 8px",color:"#333",fontSize:11}}>{evt}</td>
                  <td style={{padding:"5px 8px",color:"#6366f1",fontWeight:600,textAlign:"right",whiteSpace:"nowrap",fontSize:11}}>{dt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
      </div>
    </div>
  );
}

// ─── Attendance View ──────────────────────────────────────────────────────────
function AttendanceView() {
  const [tab, setTab] = useState("attendance");
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ type:"Casual Leave", from:"", to:"", sendTo:"HOD", reason:"" });
  const [submitted, setSubmitted] = useState(false);

  // Leave balance — approved leaves auto-deduct from total
  const [leaveBalance, setLeaveBalance] = useState([
    { type:"Casual Leave",      icon:"🏖️", total:12, used:3,  color:"#6366f1" },
    { type:"Medical Leave",     icon:"🏥", total:10, used:2,  color:"#10b981" },
    { type:"Academic Leave",    icon:"📚", total:6,  used:1,  color:"#f59e0b" },
    { type:"Emergency Leave",   icon:"🚨", total:4,  used:0,  color:"#ef4444" },
    { type:"Duty Leave",        icon:"🎓", total:5,  used:1,  color:"#8b5cf6" },
  ]);

  const [leaves, setLeaves] = useState([
    {
      id:"L001", type:"Casual Leave", from:"May 20", to:"May 22", days:3,
      reason:"Family function", sendTo:"HOD",
      stages:[
        {label:"Applied",    done:true,  date:"May 18"},
        {label:"HOD Review", done:true,  date:"May 19"},
        {label:"Approved",   done:true,  date:"May 19"},
      ],
      status:"Approved", deducted:true,
    },
    {
      id:"L002", type:"Medical Leave", from:"Jun 1", to:"Jun 2", days:2,
      reason:"Fever and rest", sendTo:"HOD",
      stages:[
        {label:"Applied",    done:true,  date:"May 31"},
        {label:"HOD Review", done:true,  date:"Jun 1"},
        {label:"Dean Review",done:false, date:"—"},
        {label:"Approved",   done:false, date:"—"},
      ],
      status:"Pending — Dean Review", deducted:false,
    },
    {
      id:"L003", type:"Academic Leave", from:"Apr 10", to:"Apr 11", days:2,
      reason:"Conference at IIT Bhubaneswar", sendTo:"Dean Academic",
      stages:[
        {label:"Applied",         done:true,  date:"Apr 8"},
        {label:"HOD Review",      done:true,  date:"Apr 9"},
        {label:"Dean Academic",   done:true,  date:"Apr 9"},
        {label:"Rejected",        done:true,  date:"Apr 10", reject:true},
      ],
      status:"Rejected", deducted:false,
    },
    {
      id:"L004", type:"Duty Leave", from:"Jun 15", to:"Jun 15", days:1,
      reason:"GATE mock test invigilation at NIT Rourkela", sendTo:"HOD",
      stages:[
        {label:"Applied",    done:true,  date:"Jun 12"},
        {label:"HOD Review", done:false, date:"—"},
        {label:"Approved",   done:false, date:"—"},
      ],
      status:"Pending — HOD Review", deducted:false,
    },
  ]);

  const subjects = [
    {code:"CS301",name:"Database Management Systems",total:40,present:36,faculty:"Dr. A. Sharma"},
    {code:"CS302",name:"Operating Systems",total:42,present:31,faculty:"Prof. S. Das"},
    {code:"CS303",name:"Computer Networks",total:38,present:32,faculty:"Dr. R. Panda"},
    {code:"CS304",name:"Theory of Computation",total:35,present:23,faculty:"Dr. K. Rath"},
    {code:"CS305",name:"Software Engineering",total:40,present:32,faculty:"Prof. M. Behera"},
  ];

  const recipients = [
    { value:"HOD",           label:"HOD",                desc:"Head of Department, CSE" },
    { value:"Dean Academic", label:"Dean Academic",       desc:"Dean of Academic Affairs" },
    { value:"Dean Students", label:"Dean Students",       desc:"Dean of Student Welfare" },
    { value:"Principal",     label:"Principal / Director",desc:"ITER Principal" },
  ];

  const leaveTypes = ["Casual Leave","Medical Leave","Academic Leave","Emergency Leave","Duty Leave"];

  const getDays = (from, to) => {
    if(!from||!to) return 0;
    const d = (new Date(to) - new Date(from)) / (1000*60*60*24) + 1;
    return d > 0 ? d : 0;
  };

  const handleSubmit = () => {
    if(!form.from||!form.to||!form.reason.trim()) return;
    const days = getDays(form.from, form.to);
    const newLeave = {
      id: "L00"+(leaves.length+1),
      type: form.type,
      from: new Date(form.from).toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
      to:   new Date(form.to).toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
      days,
      reason: form.reason,
      sendTo: form.sendTo,
      stages: [
        {label:"Applied",           done:true,  date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})},
        {label:`${form.sendTo} Review`, done:false, date:"—"},
        ...(form.sendTo!=="HOD"?[]:[]),
        {label:"Approved",          done:false, date:"—"},
      ],
      status:`Pending — ${form.sendTo} Review`,
      deducted:false,
    };
    setLeaves(prev=>[newLeave,...prev]);
    setSubmitted(true);
    setTimeout(()=>{ setSubmitted(false); setShowApply(false); setForm({type:"Casual Leave",from:"",to:"",sendTo:"HOD",reason:""}); },2000);
  };

  const statusColor = s => {
    if(s==="Approved") return {bg:"#dcfce7",c:"#16a34a"};
    if(s==="Rejected") return {bg:"#fee2e2",c:"#dc2626"};
    return {bg:"#fef9c3",c:"#ca8a04"};
  };

  const pendingCount = leaves.filter(l=>!l.status.includes("Approved")&&!l.status.includes("Rejected")).length;

  return (
    <div>
      {/* Leave Balance Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
        {leaveBalance.map(lb=>{
          const remaining = lb.total - lb.used;
          const pct = Math.round((lb.used/lb.total)*100);
          return (
            <div key={lb.type} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 12px",borderTop:`4px solid ${lb.color}`}}>
              <div style={{fontSize:22,marginBottom:4}}>{lb.icon}</div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:2}}>{lb.type}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                <span style={{fontSize:22,fontWeight:800,color:lb.color}}>{remaining}</span>
                <span style={{fontSize:11,color:"#94a3b8"}}>/ {lb.total}</span>
              </div>
              <div style={{height:5,background:"#f1f5f9",borderRadius:3,marginBottom:4}}>
                <div style={{width:pct+"%",height:"100%",background:lb.color,borderRadius:3}}/>
              </div>
              <div style={{fontSize:10,color:"#94a3b8"}}>{lb.used} used · {remaining} left</div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Apply button */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3}}>
          {[["attendance","📋 Attendance"],["leave","📝 Leave Applications"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,
              background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>
              {l} {t==="leave"&&pendingCount>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:20,fontSize:10,padding:"1px 6px",marginLeft:4}}>{pendingCount}</span>}
            </button>
          ))}
        </div>
        {tab==="leave"&&(
          <button onClick={()=>setShowApply(true)}
            style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            + Apply for Leave
          </button>
        )}
      </div>

      {/* Attendance Table */}
      {tab==="attendance"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>
            Subject-wise Attendance — Spring 2025-26
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                {["Code","Subject","Faculty","Present","Total","Attendance","Status"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s,i)=>{
                const pct=Math.round(s.present/s.total*100);
                return (
                  <tr key={s.code} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                    <td style={{padding:"11px 14px",color:"#6366f1",fontWeight:700}}>{s.code}</td>
                    <td style={{padding:"11px 14px",color:"#0f172a",fontWeight:500}}>{s.name}</td>
                    <td style={{padding:"11px 14px",color:"#64748b"}}>{s.faculty}</td>
                    <td style={{padding:"11px 14px",textAlign:"center",fontWeight:600,color:"#334155"}}>{s.present}</td>
                    <td style={{padding:"11px 14px",textAlign:"center",color:"#64748b"}}>{s.total}</td>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:64,height:6,background:"#f1f5f9",borderRadius:3}}>
                          <div style={{width:pct+"%",height:"100%",background:pct>=75?"#10b981":pct>=65?"#f59e0b":"#ef4444",borderRadius:3}}/>
                        </div>
                        <span style={{fontWeight:700,color:pct>=75?"#10b981":pct>=65?"#f59e0b":"#ef4444",fontSize:13}}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{padding:"11px 14px"}}>
                      <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,
                        background:pct>=75?"#dcfce7":pct>=65?"#fef9c3":"#fee2e2",
                        color:pct>=75?"#16a34a":pct>=65?"#ca8a04":"#dc2626"}}>
                        {pct>=75?"Safe":pct>=65?"Warning":"Shortage"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Leave Applications */}
      {tab==="leave"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {leaves.map(l=>{
            const sc = statusColor(l.status);
            return (
              <div key={l.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
                {/* Leave header */}
                <div style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"1px solid #f1f5f9"}}>
                  <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{width:44,height:44,borderRadius:10,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                      {leaveBalance.find(lb=>lb.type===l.type)?.icon||"📋"}
                    </div>
                    <div>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                        <span style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{l.type}</span>
                        <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:sc.bg,color:sc.c}}>{l.status}</span>
                        {l.deducted&&<span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#dcfce7",color:"#16a34a"}}>✓ Deducted from balance</span>}
                      </div>
                      <div style={{fontSize:12,color:"#64748b"}}>
                        📅 {l.from} → {l.to} &nbsp;·&nbsp; <strong>{l.days} day{l.days>1?"s":""}</strong> &nbsp;·&nbsp;
                        Sent to: <span style={{fontWeight:600,color:"#6366f1"}}>{l.sendTo}</span>
                      </div>
                      <div style={{fontSize:12,color:"#94a3b8",marginTop:3}}>Reason: {l.reason}</div>
                    </div>
                  </div>
                  <span style={{fontSize:12,color:"#94a3b8",fontWeight:500,flexShrink:0}}>{l.id}</span>
                </div>

                {/* Stage tracker */}
                <div style={{padding:"14px 18px",background:"#fafbff"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:10,letterSpacing:0.5}}>APPROVAL PROGRESS</div>
                  <div style={{display:"flex",alignItems:"center",gap:0}}>
                    {l.stages.map((st,si)=>(
                      <div key={si} style={{display:"flex",alignItems:"center",flex:si<l.stages.length-1?1:"initial"}}>
                        {/* Node */}
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:80}}>
                          <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0,
                            background:st.reject?"#fee2e2":st.done?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
                            color:st.reject?"#dc2626":st.done?"#fff":"#94a3b8",
                            border:st.done||st.reject?"none":"2px dashed #cbd5e1"}}>
                            {st.reject?"✕":st.done?"✓":si+1}
                          </div>
                          <div style={{fontSize:10,fontWeight:600,color:st.done?(st.reject?"#dc2626":"#6366f1"):"#94a3b8",textAlign:"center",lineHeight:1.2,maxWidth:70}}>{st.label}</div>
                          <div style={{fontSize:9,color:"#cbd5e1"}}>{st.date}</div>
                        </div>
                        {/* Connector line */}
                        {si<l.stages.length-1&&(
                          <div style={{flex:1,height:2,background:l.stages[si+1].done?"linear-gradient(90deg,#6366f1,#8b5cf6)":"#e2e8f0",margin:"0 2px",marginBottom:28}}/>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApply&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowApply(false)}>
          <div style={{background:"#fff",borderRadius:14,width:540,boxShadow:"0 20px 60px rgba(0,0,0,0.25)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>📝 Apply for Leave</div>
              <button onClick={()=>setShowApply(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
            </div>

            {submitted?(
              <div style={{padding:"48px 24px",textAlign:"center"}}>
                <div style={{fontSize:52,marginBottom:12}}>✅</div>
                <div style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:6}}>Leave Application Submitted!</div>
                <div style={{fontSize:13,color:"#64748b"}}>Your application has been sent to <strong>{form.sendTo}</strong> for review.</div>
              </div>
            ):(
              <div style={{padding:"20px 24px"}}>
                {/* Leave type + recipient row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>LEAVE TYPE</label>
                    <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                      style={{width:"100%",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",color:"#334155",background:"#fff",fontFamily:"inherit"}}>
                      {leaveTypes.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>SEND APPLICATION TO</label>
                    <select value={form.sendTo} onChange={e=>setForm(f=>({...f,sendTo:e.target.value}))}
                      style={{width:"100%",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",color:"#334155",background:"#fff",fontFamily:"inherit"}}>
                      {recipients.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Recipient info */}
                <div style={{background:"#eef2ff",borderRadius:8,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#4338ca",display:"flex",gap:8,alignItems:"center"}}>
                  <span>📌</span>
                  <span><strong>{form.sendTo}</strong> — {recipients.find(r=>r.value===form.sendTo)?.desc}</span>
                </div>

                {/* Date row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px",gap:12,marginBottom:14,alignItems:"end"}}>
                  {[["FROM DATE","from"],["TO DATE","to"]].map(([lbl,key])=>(
                    <div key={key}>
                      <label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>{lbl}</label>
                      <input type="date" value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                        style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",color:"#334155",fontFamily:"inherit"}}/>
                    </div>
                  ))}
                  <div style={{background:"#f1f5f9",borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontSize:18,fontWeight:800,color:"#6366f1"}}>{getDays(form.from,form.to)||"—"}</div>
                    <div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>DAYS</div>
                  </div>
                </div>

                {/* Leave balance warning */}
                {form.type&&(()=>{
                  const lb = leaveBalance.find(l=>l.type===form.type);
                  const rem = lb ? lb.total - lb.used : 0;
                  const days = getDays(form.from,form.to);
                  if(days>rem) return (
                    <div style={{background:"#fee2e2",borderRadius:8,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#dc2626",display:"flex",gap:6,alignItems:"center"}}>
                      ⚠️ You only have <strong>{rem} {form.type}</strong> remaining. Applying for {days} days may be rejected.
                    </div>
                  );
                  return null;
                })()}

                {/* Reason */}
                <div style={{marginBottom:18}}>
                  <label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>REASON FOR LEAVE</label>
                  <textarea rows={3} value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} placeholder="Briefly explain the reason..."
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit",color:"#334155"}}/>
                </div>

                <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
                  <button onClick={()=>setShowApply(false)} style={{padding:"9px 20px",background:"#f1f5f9",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,color:"#475569"}}>Cancel</button>
                  <button onClick={handleSubmit} disabled={!form.from||!form.to||!form.reason.trim()}
                    style={{padding:"9px 22px",background:(!form.from||!form.to||!form.reason.trim())?"#c7d2fe":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:(!form.from||!form.to||!form.reason.trim())?"not-allowed":"pointer",fontSize:13}}>
                    Submit to {form.sendTo} →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Exam View ────────────────────────────────────────────────────────────────
function ExamView() {
  const [tab, setTab] = useState("schedule");
  const [selSem, setSelSem] = useState("5");
  const [selType, setSelType] = useState("All");

  // Full course catalog per semester — Theory(T), Lab(L), Elective(E), Project(P)
  const semData = {
    "1": {
      sem:1, year:1, parity:"Odd", session:"Autumn 2024",
      courses:[
        {code:"MA101",name:"Engineering Mathematics I",type:"T",credits:4,internal:28,external:62,total:90,grade:"O"},
        {code:"PH101",name:"Engineering Physics",type:"T",credits:3,internal:22,external:55,total:77,grade:"A+"},
        {code:"CS101",name:"Programming in C",type:"T",credits:3,internal:25,external:58,total:83,grade:"A"},
        {code:"CS101L",name:"Programming Lab",type:"L",credits:2,internal:18,external:32,total:50,grade:"O"},
        {code:"ME101",name:"Engineering Drawing",type:"T",credits:2,internal:20,external:45,total:65,grade:"B+"},
        {code:"HS101",name:"English Communication",type:"T",credits:2,internal:24,external:52,total:76,grade:"A+"},
      ],
      schedule:[
        {date:"Nov 15",code:"MA101",name:"Engineering Mathematics I",type:"T",time:"10:00–1:00",room:"LH-101"},
        {date:"Nov 17",code:"PH101",name:"Engineering Physics",type:"T",time:"10:00–1:00",room:"LH-102"},
        {date:"Nov 19",code:"CS101",name:"Programming in C",type:"T",time:"10:00–1:00",room:"LH-103"},
        {date:"Nov 21",code:"ME101",name:"Engineering Drawing",type:"T",time:"2:00–5:00",room:"LH-101"},
        {date:"Nov 23",code:"HS101",name:"English Communication",type:"T",time:"10:00–1:00",room:"LH-202"},
        {date:"Nov 25",code:"CS101L",name:"Programming Lab",type:"L",time:"10:00–1:00",room:"CS Lab-1"},
      ],
    },
    "2": {
      sem:2, year:1, parity:"Even", session:"Spring 2025",
      courses:[
        {code:"MA102",name:"Engineering Mathematics II",type:"T",credits:4,internal:26,external:60,total:86,grade:"A+"},
        {code:"CH101",name:"Engineering Chemistry",type:"T",credits:3,internal:21,external:50,total:71,grade:"A"},
        {code:"CS102",name:"Data Structures",type:"T",credits:4,internal:27,external:65,total:92,grade:"O"},
        {code:"CS102L",name:"Data Structures Lab",type:"L",credits:2,internal:19,external:30,total:49,grade:"A+"},
        {code:"EC101",name:"Basic Electronics",type:"T",credits:3,internal:18,external:44,total:62,grade:"B+"},
        {code:"ME102",name:"Workshop Practice",type:"L",credits:2,internal:20,external:28,total:48,grade:"A"},
      ],
      schedule:[
        {date:"May 10",code:"MA102",name:"Engineering Mathematics II",type:"T",time:"10:00–1:00",room:"LH-101"},
        {date:"May 12",code:"CH101",name:"Engineering Chemistry",type:"T",time:"10:00–1:00",room:"LH-104"},
        {date:"May 14",code:"CS102",name:"Data Structures",type:"T",time:"10:00–1:00",room:"LH-102"},
        {date:"May 16",code:"EC101",name:"Basic Electronics",type:"T",time:"2:00–5:00",room:"LH-103"},
        {date:"May 18",code:"CS102L",name:"Data Structures Lab",type:"L",time:"10:00–1:00",room:"CS Lab-2"},
        {date:"May 20",code:"ME102",name:"Workshop Practice",type:"L",time:"2:00–5:00",room:"Workshop"},
      ],
    },
    "3": {
      sem:3, year:2, parity:"Odd", session:"Autumn 2025",
      courses:[
        {code:"CS201",name:"Discrete Mathematics",type:"T",credits:4,internal:24,external:56,total:80,grade:"A+"},
        {code:"CS202",name:"Digital Logic Design",type:"T",credits:3,internal:22,external:50,total:72,grade:"A"},
        {code:"CS203",name:"OOP with Java",type:"T",credits:4,internal:28,external:62,total:90,grade:"O"},
        {code:"CS203L",name:"Java Lab",type:"L",credits:2,internal:20,external:30,total:50,grade:"O"},
        {code:"MA201",name:"Probability & Statistics",type:"T",credits:3,internal:19,external:48,total:67,grade:"B+"},
        {code:"CS204",name:"Computer Organization",type:"T",credits:3,internal:21,external:52,total:73,grade:"A"},
      ],
      schedule:[
        {date:"Nov 14",code:"CS201",name:"Discrete Mathematics",type:"T",time:"10:00–1:00",room:"LH-201"},
        {date:"Nov 16",code:"CS202",name:"Digital Logic Design",type:"T",time:"10:00–1:00",room:"LH-202"},
        {date:"Nov 18",code:"CS203",name:"OOP with Java",type:"T",time:"10:00–1:00",room:"LH-203"},
        {date:"Nov 20",code:"MA201",name:"Probability & Statistics",type:"T",time:"2:00–5:00",room:"LH-201"},
        {date:"Nov 22",code:"CS204",name:"Computer Organization",type:"T",time:"10:00–1:00",room:"LH-202"},
        {date:"Nov 24",code:"CS203L",name:"Java Lab",type:"L",time:"10:00–1:00",room:"CS Lab-1"},
      ],
    },
    "4": {
      sem:4, year:2, parity:"Even", session:"Spring 2025",
      courses:[
        {code:"CS211",name:"Design & Analysis of Algorithms",type:"T",credits:4,internal:25,external:58,total:83,grade:"A"},
        {code:"CS212",name:"Database Management Systems",type:"T",credits:4,internal:27,external:62,total:89,grade:"O"},
        {code:"CS212L",name:"DBMS Lab",type:"L",credits:2,internal:19,external:29,total:48,grade:"A+"},
        {code:"CS213",name:"Software Engineering",type:"T",credits:3,internal:22,external:54,total:76,grade:"A+"},
        {code:"CS214E",name:"Web Technologies (Elective)",type:"E",credits:3,internal:24,external:56,total:80,grade:"A+"},
        {code:"CS215",name:"Mini Project",type:"P",credits:2,internal:40,external:0,total:40,grade:"O"},
      ],
      schedule:[
        {date:"May 8",code:"CS211",name:"Design & Analysis of Algorithms",type:"T",time:"10:00–1:00",room:"LH-201"},
        {date:"May 10",code:"CS212",name:"Database Management Systems",type:"T",time:"10:00–1:00",room:"LH-202"},
        {date:"May 12",code:"CS213",name:"Software Engineering",type:"T",time:"2:00–5:00",room:"LH-203"},
        {date:"May 14",code:"CS214E",name:"Web Technologies",type:"E",time:"10:00–1:00",room:"LH-204"},
        {date:"May 16",code:"CS212L",name:"DBMS Lab",type:"L",time:"10:00–1:00",room:"DB Lab"},
        {date:"May 18",code:"CS215",name:"Mini Project Viva",type:"P",time:"10:00–1:00",room:"Seminar Hall"},
      ],
    },
    "5": {
      sem:5, year:3, parity:"Odd", session:"Autumn 2025",
      courses:[
        {code:"CS301",name:"Database Management Systems",type:"T",credits:4,internal:null,external:null,total:null,grade:null},
        {code:"CS302",name:"Operating Systems",type:"T",credits:4,internal:null,external:null,total:null,grade:null},
        {code:"CS303",name:"Computer Networks",type:"T",credits:4,internal:null,external:null,total:null,grade:null},
        {code:"CS304",name:"Theory of Computation",type:"T",credits:3,internal:null,external:null,total:null,grade:null},
        {code:"CS305",name:"Software Engineering",type:"T",credits:3,internal:null,external:null,total:null,grade:null},
        {code:"CS301L",name:"DBMS Lab",type:"L",credits:2,internal:null,external:null,total:null,grade:null},
        {code:"CS306E",name:"Machine Learning (Elective)",type:"E",credits:3,internal:null,external:null,total:null,grade:null},
      ],
      schedule:[
        {date:"Jun 18",code:"CS301",name:"Database Management Systems",type:"T",time:"10:00–1:00",room:"201-A"},
        {date:"Jun 20",code:"CS302",name:"Operating Systems",type:"T",time:"10:00–1:00",room:"202-B"},
        {date:"Jun 22",code:"CS303",name:"Computer Networks",type:"T",time:"2:00–5:00",room:"201-A"},
        {date:"Jun 25",code:"CS304",name:"Theory of Computation",type:"T",time:"10:00–1:00",room:"203-C"},
        {date:"Jun 27",code:"CS305",name:"Software Engineering",type:"T",time:"2:00–5:00",room:"201-A"},
        {date:"Jun 28",code:"CS306E",name:"Machine Learning",type:"E",time:"10:00–1:00",room:"204-D"},
        {date:"Jun 30",code:"CS301L",name:"DBMS Lab Practical",type:"L",time:"10:00–1:00",room:"DB Lab"},
      ],
    },
  };

  const allSems = Object.keys(semData);
  const current = semData[selSem];
  const typeLabel = {T:"Theory",L:"Lab/Practical",E:"Elective",P:"Project"};
  const typeColor = {T:"#6366f1",L:"#f59e0b",E:"#10b981",P:"#8b5cf6"};
  const gradeColor = g => !g?null:g==="O"||g==="A+"?"#10b981":g==="A"||g==="B+"?"#6366f1":g==="B"?"#f59e0b":"#ef4444";

  const filteredCourses = current.courses.filter(c => selType==="All"||c.type===selType);
  const filteredSchedule = current.schedule.filter(c => selType==="All"||c.type===selType);

  const sgpa = current.courses[0]?.total !== null
    ? (current.courses.filter(c=>c.total).reduce((a,c)=>a+c.total,0)/current.courses.filter(c=>c.total).length/10).toFixed(1)
    : null;

  // Previous sem results summary
  const prevResults = [
    {sem:"Sem 4 — Spring 2025",sgpa:"8.9",cgpa:"8.6",status:"Pass",parity:"Even"},
    {sem:"Sem 3 — Autumn 2025",sgpa:"8.4",cgpa:"8.3",status:"Pass",parity:"Odd"},
    {sem:"Sem 2 — Spring 2025",sgpa:"8.0",cgpa:"8.1",status:"Pass",parity:"Even"},
    {sem:"Sem 1 — Autumn 2024",sgpa:"8.1",cgpa:"8.1",status:"Pass",parity:"Odd"},
  ];

  return (
    <div>
      {/* Sem selector row */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:700,color:"#475569",marginRight:4}}>SEMESTER:</span>
        {allSems.map(s=>(
          <button key={s} onClick={()=>setSelSem(s)}
            style={{padding:"5px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
              background:selSem===s?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
              color:selSem===s?"#fff":"#475569"}}>
            Sem {s}
          </button>
        ))}
      </div>

      {/* Meta bar */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#94a3b8",fontWeight:700}}>SESSION</span>
          <span style={{fontWeight:700,color:"#334155",fontSize:13}}>{current.session}</span>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#94a3b8",fontWeight:700}}>YEAR</span>
          <span style={{fontWeight:700,color:"#334155",fontSize:13}}>{current.year}{current.year===1?"st":current.year===2?"nd":current.year===3?"rd":"th"} Year</span>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#94a3b8",fontWeight:700}}>PARITY</span>
          <span style={{padding:"2px 10px",borderRadius:6,fontSize:12,fontWeight:700,
            background:current.parity==="Odd"?"#eef2ff":"#f0fdf4",
            color:current.parity==="Odd"?"#6366f1":"#16a34a"}}>{current.parity} Semester</span>
        </div>
        {sgpa&&<div style={{display:"flex",gap:6,alignItems:"center",marginLeft:"auto"}}>
          <span style={{fontSize:11,color:"#94a3b8",fontWeight:700}}>SGPA</span>
          <span style={{fontWeight:800,color:"#6366f1",fontSize:16}}>{sgpa}</span>
        </div>}
      </div>

      {/* Tabs + type filter */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3}}>
          {[["schedule","📋 Exam Schedule"],["courses","📚 Courses & Marks"],["results","🏆 All Results"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:"7px 14px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
                background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",
                color:tab===t?"#fff":"#64748b"}}>
              {l}
            </button>
          ))}
        </div>
        {tab!=="results"&&(
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#64748b",fontWeight:600}}>FILTER:</span>
            {["All","T","L","E","P"].map(t=>(
              <button key={t} onClick={()=>setSelType(t)}
                style={{padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,
                  background:selType===t?(typeColor[t]||"#6366f1"):"#f1f5f9",
                  color:selType===t?"#fff":"#475569"}}>
                {t==="All"?"All":typeLabel[t]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exam Schedule */}
      {tab==="schedule"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 16px",color:"#fff",fontWeight:700,fontSize:13}}>
            End Semester Exam Schedule — Sem {selSem} ({current.session})
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                {["Date","Code","Subject","Type","Time","Room No."].map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((e,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                  <td style={{padding:"10px 14px",fontWeight:700,color:"#6366f1"}}>{e.date}</td>
                  <td style={{padding:"10px 14px",fontWeight:600,color:"#334155"}}>{e.code}</td>
                  <td style={{padding:"10px 14px",color:"#0f172a",fontWeight:500}}>{e.name}</td>
                  <td style={{padding:"10px 14px"}}>
                    <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:(typeColor[e.type]||"#6366f1")+"20",color:typeColor[e.type]||"#6366f1"}}>{typeLabel[e.type]}</span>
                  </td>
                  <td style={{padding:"10px 14px",color:"#64748b"}}>{e.time}</td>
                  <td style={{padding:"10px 14px",fontWeight:600,color:"#334155"}}>{e.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Courses & Marks */}
      {tab==="courses"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 16px",color:"#fff",fontWeight:700,fontSize:13}}>
            Course Details & Marks — Sem {selSem} ({current.session})
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                {["Code","Course Name","Type","Credits","Internal","External","Total","Grade"].map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c,i)=>(
                <tr key={c.code} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                  <td style={{padding:"10px 14px",fontWeight:700,color:"#6366f1"}}>{c.code}</td>
                  <td style={{padding:"10px 14px",color:"#0f172a",fontWeight:500}}>{c.name}</td>
                  <td style={{padding:"10px 14px"}}>
                    <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:(typeColor[c.type])+"20",color:typeColor[c.type]}}>{typeLabel[c.type]}</span>
                  </td>
                  <td style={{padding:"10px 14px",textAlign:"center",color:"#475569",fontWeight:600}}>{c.credits}</td>
                  <td style={{padding:"10px 14px",textAlign:"center",color:"#64748b"}}>{c.internal??<span style={{color:"#cbd5e1"}}>—</span>}</td>
                  <td style={{padding:"10px 14px",textAlign:"center",color:"#64748b"}}>{c.external??<span style={{color:"#cbd5e1"}}>—</span>}</td>
                  <td style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:"#0f172a"}}>{c.total??<span style={{fontSize:11,color:"#f59e0b",fontWeight:600}}>Awaited</span>}</td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}>
                    {c.grade
                      ? <span style={{padding:"3px 10px",borderRadius:6,fontWeight:800,fontSize:12,background:(gradeColor(c.grade))+"20",color:gradeColor(c.grade)}}>{c.grade}</span>
                      : <span style={{fontSize:11,color:"#94a3b8"}}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Results */}
      {tab==="results"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Current sem card */}
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,fontWeight:600}}>CURRENT SEMESTER</div>
              <div style={{color:"#fff",fontSize:16,fontWeight:700,marginTop:2}}>Sem 5 — Autumn 2025 (Odd)</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:2}}>Results awaited after exams</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:600}}>CGPA SO FAR</div>
              <div style={{color:"#fff",fontSize:28,fontWeight:900}}>8.6</div>
            </div>
          </div>

          {prevResults.map((r,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{r.sem}</div>
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,
                    background:r.parity==="Odd"?"#eef2ff":"#f0fdf4",
                    color:r.parity==="Odd"?"#6366f1":"#16a34a"}}>{r.parity} Sem</span>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#dcfce7",color:"#16a34a"}}>{r.status}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:24,alignItems:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>SGPA</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#6366f1"}}>{r.sgpa}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>CGPA</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#0f172a"}}>{r.cgpa}</div>
                </div>
                <button style={{padding:"6px 14px",background:"#f1f5f9",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:"#475569"}}>
                  View Marksheet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Fee View ─────────────────────────────────────────────────────────────────
// ─── Question Papers ──────────────────────────────────────────────────────────
function QuestionPapers() {
  const [selDept, setSelDept] = useState("CSE");
  const [selSem,  setSelSem]  = useState("All");
  const [selYear, setSelYear] = useState("All");
  const [downloaded, setDownloaded] = useState(null);

  const depts = ["CSE","ECE","MECH","CIVIL","EEE","MBA"];
  const sems  = ["1","2","3","4","5","6","7","8"];
  const years = ["2024","2023","2022","2021","2020","2019"];

  const papers = {
    CSE:[
      // Sem 1
      {sem:"1",code:"MA101",name:"Engineering Mathematics I",  type:"T",year:"2024",pages:8},
      {sem:"1",code:"MA101",name:"Engineering Mathematics I",  type:"T",year:"2023",pages:7},
      {sem:"1",code:"MA101",name:"Engineering Mathematics I",  type:"T",year:"2022",pages:8},
      {sem:"1",code:"PH101",name:"Engineering Physics",        type:"T",year:"2024",pages:6},
      {sem:"1",code:"PH101",name:"Engineering Physics",        type:"T",year:"2023",pages:6},
      {sem:"1",code:"CS101",name:"Programming in C",           type:"T",year:"2024",pages:7},
      {sem:"1",code:"CS101",name:"Programming in C",           type:"T",year:"2023",pages:6},
      {sem:"1",code:"CS101",name:"Programming in C",           type:"T",year:"2022",pages:7},
      // Sem 2
      {sem:"2",code:"MA102",name:"Engineering Mathematics II", type:"T",year:"2024",pages:8},
      {sem:"2",code:"MA102",name:"Engineering Mathematics II", type:"T",year:"2023",pages:8},
      {sem:"2",code:"CS102",name:"Data Structures",            type:"T",year:"2024",pages:7},
      {sem:"2",code:"CS102",name:"Data Structures",            type:"T",year:"2023",pages:6},
      {sem:"2",code:"CS102",name:"Data Structures",            type:"T",year:"2022",pages:7},
      {sem:"2",code:"EC101",name:"Basic Electronics",          type:"T",year:"2024",pages:6},
      // Sem 3
      {sem:"3",code:"CS201",name:"Discrete Mathematics",       type:"T",year:"2024",pages:7},
      {sem:"3",code:"CS201",name:"Discrete Mathematics",       type:"T",year:"2023",pages:8},
      {sem:"3",code:"CS201",name:"Discrete Mathematics",       type:"T",year:"2022",pages:7},
      {sem:"3",code:"CS201",name:"Discrete Mathematics",       type:"T",year:"2021",pages:6},
      {sem:"3",code:"CS203",name:"OOP with Java",              type:"T",year:"2024",pages:7},
      {sem:"3",code:"CS203",name:"OOP with Java",              type:"T",year:"2023",pages:7},
      {sem:"3",code:"MA201",name:"Probability & Statistics",   type:"T",year:"2024",pages:6},
      {sem:"3",code:"MA201",name:"Probability & Statistics",   type:"T",year:"2023",pages:6},
      // Sem 4
      {sem:"4",code:"CS211",name:"Design & Analysis of Algorithms",type:"T",year:"2024",pages:8},
      {sem:"4",code:"CS211",name:"Design & Analysis of Algorithms",type:"T",year:"2023",pages:8},
      {sem:"4",code:"CS211",name:"Design & Analysis of Algorithms",type:"T",year:"2022",pages:7},
      {sem:"4",code:"CS212",name:"Database Management Systems", type:"T",year:"2024",pages:7},
      {sem:"4",code:"CS212",name:"Database Management Systems", type:"T",year:"2023",pages:6},
      {sem:"4",code:"CS213",name:"Software Engineering",        type:"T",year:"2024",pages:6},
      // Sem 5
      {sem:"5",code:"CS301",name:"DBMS",                        type:"T",year:"2024",pages:7},
      {sem:"5",code:"CS301",name:"DBMS",                        type:"T",year:"2023",pages:7},
      {sem:"5",code:"CS301",name:"DBMS",                        type:"T",year:"2022",pages:8},
      {sem:"5",code:"CS301",name:"DBMS",                        type:"T",year:"2021",pages:7},
      {sem:"5",code:"CS302",name:"Operating Systems",           type:"T",year:"2024",pages:7},
      {sem:"5",code:"CS302",name:"Operating Systems",           type:"T",year:"2023",pages:6},
      {sem:"5",code:"CS302",name:"Operating Systems",           type:"T",year:"2022",pages:7},
      {sem:"5",code:"CS303",name:"Computer Networks",           type:"T",year:"2024",pages:6},
      {sem:"5",code:"CS303",name:"Computer Networks",           type:"T",year:"2023",pages:7},
      {sem:"5",code:"CS304",name:"Theory of Computation",       type:"T",year:"2024",pages:8},
      {sem:"5",code:"CS304",name:"Theory of Computation",       type:"T",year:"2023",pages:7},
      {sem:"5",code:"CS305",name:"Software Engineering",        type:"T",year:"2024",pages:6},
      // Sem 6
      {sem:"6",code:"CS401",name:"Compiler Design",             type:"T",year:"2024",pages:7},
      {sem:"6",code:"CS401",name:"Compiler Design",             type:"T",year:"2023",pages:8},
      {sem:"6",code:"CS401",name:"Compiler Design",             type:"T",year:"2022",pages:7},
      {sem:"6",code:"CS402",name:"Artificial Intelligence",     type:"T",year:"2024",pages:8},
      {sem:"6",code:"CS402",name:"Artificial Intelligence",     type:"T",year:"2023",pages:7},
      {sem:"6",code:"CS403",name:"Computer Graphics",           type:"T",year:"2024",pages:6},
      // Sem 7
      {sem:"7",code:"CS501",name:"Machine Learning",            type:"T",year:"2024",pages:8},
      {sem:"7",code:"CS501",name:"Machine Learning",            type:"T",year:"2023",pages:7},
      {sem:"7",code:"CS502",name:"Cloud Computing",             type:"T",year:"2024",pages:7},
      {sem:"7",code:"CS503",name:"Information Security",        type:"T",year:"2024",pages:8},
      {sem:"7",code:"CS503",name:"Information Security",        type:"T",year:"2023",pages:7},
      // Sem 8
      {sem:"8",code:"CS601",name:"Big Data Analytics",          type:"T",year:"2023",pages:7},
      {sem:"8",code:"CS602",name:"Internet of Things",          type:"T",year:"2023",pages:6},
      {sem:"8",code:"CS603",name:"Deep Learning",               type:"T",year:"2023",pages:8},
    ],
    ECE:[
      {sem:"1",code:"MA101",name:"Engineering Mathematics I",type:"T",year:"2024",pages:8},
      {sem:"3",code:"EC201",name:"Signals & Systems",type:"T",year:"2024",pages:7},
      {sem:"3",code:"EC201",name:"Signals & Systems",type:"T",year:"2023",pages:6},
      {sem:"5",code:"EC301",name:"VLSI Design",type:"T",year:"2024",pages:7},
      {sem:"5",code:"EC302",name:"Digital Communication",type:"T",year:"2024",pages:7},
      {sem:"5",code:"EC302",name:"Digital Communication",type:"T",year:"2023",pages:6},
    ],
    MECH:[
      {sem:"1",code:"ME101",name:"Engineering Drawing",type:"T",year:"2024",pages:6},
      {sem:"3",code:"ME201",name:"Thermodynamics",type:"T",year:"2024",pages:8},
      {sem:"3",code:"ME201",name:"Thermodynamics",type:"T",year:"2023",pages:7},
      {sem:"5",code:"ME301",name:"Machine Design",type:"T",year:"2024",pages:7},
    ],
    CIVIL:[
      {sem:"3",code:"CE201",name:"Structural Analysis",type:"T",year:"2024",pages:7},
      {sem:"5",code:"CE301",name:"Geotechnical Engineering",type:"T",year:"2024",pages:6},
    ],
    EEE:[
      {sem:"3",code:"EE201",name:"Electrical Machines",type:"T",year:"2024",pages:7},
      {sem:"5",code:"EE301",name:"Power Systems",type:"T",year:"2024",pages:8},
      {sem:"5",code:"EE301",name:"Power Systems",type:"T",year:"2023",pages:7},
    ],
    MBA:[
      {sem:"1",code:"MB101",name:"Management Principles",type:"T",year:"2024",pages:6},
      {sem:"2",code:"MB201",name:"Financial Accounting",type:"T",year:"2024",pages:7},
    ],
  };

  const handleDownload = (p) => {
    setDownloaded(`${p.code}_${p.name}_${p.year}`);
    setTimeout(()=>setDownloaded(null), 2500);
  };

  const deptPapers = papers[selDept] || [];
  const filtered = deptPapers.filter(p =>
    (selSem==="All" || p.sem===selSem) &&
    (selYear==="All" || p.year===selYear)
  );

  // Group by code+name
  const grouped = {};
  filtered.forEach(p => {
    const key = p.code;
    if(!grouped[key]) grouped[key] = {code:p.code, name:p.name, sem:p.sem, papers:[]};
    grouped[key].papers.push(p);
  });

  // Group by sem for display
  const bySem = {};
  Object.values(grouped).forEach(g => {
    if(!bySem[g.sem]) bySem[g.sem] = [];
    bySem[g.sem].push(g);
  });

  const totalCount = filtered.length;

  return (
    <div>
      {/* Filters */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[
            {label:"DEPARTMENT", val:selDept, set:setSelDept, opts:depts.map(d=>({val:d,label:d}))},
            {label:"SEMESTER",   val:selSem,  set:setSelSem,  opts:[{val:"All",label:"All Semesters"},...sems.map(s=>({val:s,label:"Semester "+s}))]},
            {label:"YEAR",       val:selYear, set:setSelYear, opts:[{val:"All",label:"All Years"},...years.map(y=>({val:y,label:y}))]},
          ].map(({label,val,set,opts})=>(
            <div key={label}>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:5,letterSpacing:0.5}}>{label}</div>
              <select value={val} onChange={e=>set(e.target.value)}
                style={{padding:"9px 32px 9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,fontWeight:600,color:"#334155",background:"#fff",outline:"none",cursor:"pointer",fontFamily:"inherit",appearance:"auto",minWidth:160}}>
                {opts.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{fontSize:13,color:"#64748b",marginBottom:12,fontWeight:500}}>
        Showing <strong style={{color:"#6366f1"}}>{totalCount}</strong> paper{totalCount!==1?"s":""} for <strong>{selDept}</strong>
        {selSem!=="All"?`, Sem ${selSem}`:""}
        {selYear!=="All"?`, ${selYear}`:""}
      </div>

      {/* Downloaded toast */}
      {downloaded&&(
        <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#16a34a",fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
          ✅ Downloading: {downloaded.replace(/_/g," ")}.pdf
        </div>
      )}

      {/* Papers grouped by sem */}
      {Object.keys(bySem).sort((a,b)=>Number(a)-Number(b)).map(sem=>(
        <div key={sem} style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",borderRadius:6,padding:"3px 12px",fontSize:12,fontWeight:700}}>
              Semester {sem}
            </div>
            <div style={{height:1,flex:1,background:"#e2e8f0"}}/>
          </div>
          {bySem[sem].map(g=>(
            <div key={g.code} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 16px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <span style={{fontWeight:700,color:"#6366f1",fontSize:13,marginRight:8}}>{g.code}</span>
                  <span style={{fontWeight:600,color:"#0f172a",fontSize:14}}>{g.name}</span>
                </div>
                <span style={{fontSize:11,color:"#94a3b8"}}>{g.papers.length} paper{g.papers.length>1?"s":""} available</span>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {g.papers.sort((a,b)=>Number(b.year)-Number(a.year)).map((p,i)=>(
                  <button key={i} onClick={()=>handleDownload(p)}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:"#334155",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="#eef2ff";e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.color="#6366f1";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#f8fafc";e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#334155";}}>
                    📄 {p.year}
                    <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>{p.pages}pp</span>
                    <span style={{fontSize:11,color:"#6366f1",fontWeight:700}}>↓</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {totalCount===0&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"48px 0",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:12}}>📂</div>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>No papers found</div>
          <div style={{color:"#94a3b8",fontSize:13,marginTop:4}}>Try changing the department, semester, or year filters</div>
        </div>
      )}
    </div>
  );
}

function FeeView() {
  const [tab, setTab] = useState("academic");
  const [payModal, setPayModal] = useState(null);
  const [payDone, setPayDone] = useState({});

  const handlePay = (id) => {
    setTimeout(() => {
      setPayDone(p => ({...p, [id]: true}));
      setPayModal(null);
    }, 1500);
  };

  // ── Academic / Semester-wise fees ──
  const semFees = [
    { sem:"Sem 1 (Autumn 2023)", tuition:80000, exam:3000, dev:5000, lab:3000, library:2000, total:93000, paid:93000, status:"Paid" },
    { sem:"Sem 2 (Spring 2024)",  tuition:80000, exam:3000, dev:5000, lab:3000, library:2000, total:93000, paid:93000, status:"Paid" },
    { sem:"Sem 3 (Autumn 2024)", tuition:80000, exam:3000, dev:5000, lab:3000, library:2000, total:93000, paid:93000, status:"Paid" },
    { sem:"Sem 4 (Spring 2025)",  tuition:80000, exam:3000, dev:5000, lab:3000, library:2000, total:93000, paid:93000, status:"Paid" },
    { sem:"Sem 5 (Autumn 2025)", tuition:80000, exam:3000, dev:5000, lab:5000, library:2000, total:95000, paid:80000, status:"Partial", due:15000, id:"S5" },
    { sem:"Sem 6 (Spring 2026)",  tuition:80000, exam:3000, dev:5000, lab:5000, library:2000, total:95000, paid:0,     status:"Due",     due:95000, id:"S6" },
  ];

  // ── Hostel fees ──
  const hostelFees = [
    { period:"2023-24 (Odd Sem)",  room:25000, mess:18000, maintenance:2000, total:45000, paid:45000, status:"Paid" },
    { period:"2023-24 (Even Sem)", room:25000, mess:18000, maintenance:2000, total:45000, paid:45000, status:"Paid" },
    { period:"2024-25 (Odd Sem)",  room:27000, mess:20000, maintenance:2000, total:49000, paid:49000, status:"Paid" },
    { period:"2024-25 (Even Sem)", room:27000, mess:20000, maintenance:2000, total:49000, paid:49000, status:"Paid" },
    { period:"2025-26 (Odd Sem)",  room:28000, mess:22000, maintenance:2000, total:52000, paid:52000, status:"Paid" },
    { period:"2025-26 (Even Sem)", room:28000, mess:22000, maintenance:2000, total:52000, paid:0,     status:"Due", due:52000, id:"H6" },
  ];

  // ── Other academic charges ──
  const otherFees = [
    { name:"Admission Fee (One-time)",           amount:10000, paid:10000, status:"Paid", year:"2023" },
    { name:"Caution Deposit (Refundable)",        amount:5000,  paid:5000,  status:"Paid", year:"2023" },
    { name:"Alumni Fund",                         amount:1000,  paid:1000,  status:"Paid", year:"2023" },
    { name:"Insurance (2025-26)",                 amount:500,   paid:500,   status:"Paid", year:"2025" },
    { name:"Student Welfare Fund (2025-26)",      amount:1000,  paid:0,     status:"Due",  due:1000, id:"O1", year:"2025" },
    { name:"Sports & Cultural Fee (2025-26)",     amount:2000,  paid:0,     status:"Due",  due:2000, id:"O2", year:"2025" },
  ];

  const totalPaid   = semFees.reduce((a,f)=>a+f.paid,0) + hostelFees.reduce((a,f)=>a+f.paid,0) + otherFees.reduce((a,f)=>a+f.paid,0);
  const totalDue    = semFees.reduce((a,f)=>a+(f.due||0),0) + hostelFees.reduce((a,f)=>a+(f.due||0),0) + otherFees.reduce((a,f)=>a+(f.due||0),0);

  const sc = s => s==="Paid"?{bg:"#dcfce7",c:"#16a34a"}:s==="Partial"?{bg:"#fef9c3",c:"#ca8a04"}:{bg:"#fee2e2",c:"#dc2626"};

  const fmt = n => "₹"+n.toLocaleString("en-IN");

  return (
    <div>
      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[["Total Paid",fmt(totalPaid),"#10b981"],["Total Due",fmt(totalDue),"#ef4444"],["Scholarships Applied","₹50,000","#6366f1"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",borderTop:`4px solid ${c}`}}>
            <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:4}}>{l}</div>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["academic","📚 Academic (Sem-wise)"],["hostel","🏠 Hostel"],["other","📋 Other Charges"],["scholarship","🎓 Scholarships"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:"7px 14px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
              background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",
              color:tab===t?"#fff":"#64748b"}}>
            {l}
          </button>
        ))}
      </div>

      {/* ── ACADEMIC TAB ── */}
      {tab==="academic" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {semFees.map((f,i)=>{
            const isPaid = payDone[f.id]||f.status==="Paid";
            const realStatus = payDone[f.id]?"Paid":f.status;
            const realDue = payDone[f.id]?0:(f.due||0);
            const realPaid = payDone[f.id]?f.total:f.paid;
            return (
              <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f1f5f9",background:"#fafbff"}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{f.sem}</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#334155"}}>{fmt(f.total)}</span>
                    <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,background:sc(realStatus).bg,color:sc(realStatus).c}}>{realStatus}</span>
                    {realDue>0&&<button onClick={()=>setPayModal({...f,realDue})}
                      style={{padding:"6px 14px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>
                      Pay {fmt(realDue)}
                    </button>}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",padding:"10px 16px",gap:4}}>
                  {[["Tuition",f.tuition],["Exam",f.exam],["Development",f.dev],["Lab",f.lab],["Library",f.library]].map(([l,v])=>(
                    <div key={l} style={{textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{l}</div>
                      <div style={{fontSize:12,fontWeight:700,color:"#334155"}}>{fmt(v)}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:"6px 16px 10px",display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{flex:1,height:5,background:"#f1f5f9",borderRadius:3}}>
                    <div style={{width:Math.round(realPaid/f.total*100)+"%",height:"100%",background:"#10b981",borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:11,color:"#64748b",whiteSpace:"nowrap"}}>{fmt(realPaid)} paid</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── HOSTEL TAB ── */}
      {tab==="hostel" && (
        <div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 16px",marginBottom:12,display:"flex",gap:16,flexWrap:"wrap"}}>
            {[["Block","C Block"],["Room No.","C-214"],["Type","Double Sharing"],["Floor","2nd Floor"],["Warden","Mr. R. Nayak"]].map(([l,v])=>(
              <div key={l}><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:"#334155"}}>{v}</div></div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {hostelFees.map((f,i)=>{
              const isPaid = payDone[f.id]||f.status==="Paid";
              const realStatus = payDone[f.id]?"Paid":f.status;
              const realDue = payDone[f.id]?0:(f.due||0);
              const realPaid = payDone[f.id]?f.total:f.paid;
              return (
                <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f1f5f9",background:"#fafbff"}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{f.period}</div>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#334155"}}>{fmt(f.total)}</span>
                      <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,background:sc(realStatus).bg,color:sc(realStatus).c}}>{realStatus}</span>
                      {realDue>0&&<button onClick={()=>setPayModal({...f,realDue,sem:f.period})}
                        style={{padding:"6px 14px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>
                        Pay {fmt(realDue)}
                      </button>}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",padding:"10px 16px"}}>
                    {[["Room Rent",f.room],["Mess Charges",f.mess],["Maintenance",f.maintenance]].map(([l,v])=>(
                      <div key={l} style={{textAlign:"center"}}>
                        <div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{l}</div>
                        <div style={{fontSize:13,fontWeight:700,color:"#334155"}}>{fmt(v)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── OTHER CHARGES TAB ── */}
      {tab==="other" && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc"}}>
              {["Fee Name","Year","Amount","Paid","Due","Status","Action"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{otherFees.map((f,i)=>{
              const realStatus = payDone[f.id]?"Paid":f.status;
              const realDue = payDone[f.id]?0:(f.due||0);
              return (
                <tr key={i} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                  <td style={{padding:"11px 14px",fontWeight:500,color:"#0f172a"}}>{f.name}</td>
                  <td style={{padding:"11px 14px",color:"#64748b"}}>{f.year}</td>
                  <td style={{padding:"11px 14px",fontWeight:600,color:"#334155"}}>{fmt(f.amount)}</td>
                  <td style={{padding:"11px 14px",color:"#10b981",fontWeight:600}}>{fmt(payDone[f.id]?f.amount:f.paid)}</td>
                  <td style={{padding:"11px 14px",color:realDue>0?"#ef4444":"#94a3b8",fontWeight:600}}>{realDue>0?fmt(realDue):"—"}</td>
                  <td style={{padding:"11px 14px"}}>
                    <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:sc(realStatus).bg,color:sc(realStatus).c}}>{realStatus}</span>
                  </td>
                  <td style={{padding:"11px 14px"}}>
                    {realDue>0&&<button onClick={()=>setPayModal({...f,realDue,sem:f.name})}
                      style={{padding:"5px 12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>
                      Pay {fmt(realDue)}
                    </button>}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {/* ── SCHOLARSHIP TAB ── */}
      {tab==="scholarship" && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {name:"SOA Merit Scholarship",body:"SOA University",amount:20000,per:"per year",status:"Active",credited:"Jul 2025",next:"Jul 2026",desc:"Awarded for CGPA above 8.5"},
            {name:"AICTE Pragati Scholarship",body:"AICTE",amount:30000,per:"per year",status:"Applied",credited:"—",next:"Pending verification",desc:"For female students in technical education"},
            {name:"State Merit Scholarship",body:"Govt. of Odisha",amount:15000,per:"per year",status:"Eligible",credited:"—",next:"Apply before Jul 31",desc:"For students with family income below ₹2.5L"},
          ].map((s,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>{s.name}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{s.body} · {s.desc}</div>
                </div>
                <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,
                  background:s.status==="Active"?"#dcfce7":s.status==="Applied"?"#fef9c3":"#eef2ff",
                  color:s.status==="Active"?"#16a34a":s.status==="Applied"?"#ca8a04":"#6366f1"}}>
                  {s.status}
                </span>
              </div>
              <div style={{display:"flex",gap:20}}>
                <div><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>AMOUNT</div><div style={{fontSize:16,fontWeight:800,color:"#6366f1"}}>{fmt(s.amount)}<span style={{fontSize:11,fontWeight:400,color:"#94a3b8"}}> / {s.per}</span></div></div>
                <div><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>LAST CREDITED</div><div style={{fontSize:13,fontWeight:600,color:"#334155"}}>{s.credited}</div></div>
                <div><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>NEXT / STATUS</div><div style={{fontSize:13,fontWeight:600,color:"#334155"}}>{s.next}</div></div>
                {s.status==="Eligible"&&<div style={{marginLeft:"auto",alignSelf:"center"}}>
                  <button style={{padding:"7px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>Apply Now</button>
                </div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {payModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setPayModal(null)}>
          <div style={{background:"#fff",borderRadius:14,width:420,boxShadow:"0 20px 60px rgba(0,0,0,0.25)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>💳 Fee Payment</div>
              <button onClick={()=>setPayModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:26,height:26,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{padding:"20px 22px"}}>
              <div style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",marginBottom:16}}>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:2}}>Paying for</div>
                <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{payModal.sem}</div>
                <div style={{fontSize:22,fontWeight:900,color:"#6366f1",marginTop:4}}>{fmt(payModal.realDue)}</div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:"#475569",marginBottom:6}}>PAYMENT METHOD</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["💳 Debit/Credit Card","card"],["📱 UPI","upi"],["🏦 Net Banking","netbank"],["📲 PhonePe / GPay","wallet"]].map(([l,v])=>(
                    <div key={v} style={{padding:"10px 12px",border:"2px solid #e2e8f0",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:"#334155",textAlign:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#6366f1"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={()=>handlePay(payModal.id)}
                style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14}}>
                ✅ Confirm & Pay {fmt(payModal.realDue)}
              </button>
              <div style={{fontSize:11,color:"#94a3b8",textAlign:"center",marginTop:8}}>🔒 Secured by Razorpay · PCI DSS Compliant</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Assignments View ─────────────────────────────────────────────────────────
function AssignmentsView({ role }) {
  const [assignments, setAssignments] = useState([
    {id:1,sub:"DBMS",title:"ER Diagram for Hospital DB",due:"2026-06-20",marks:20,status:"Pending",desc:"Design a complete ER diagram for a hospital management system including entities, relationships, and cardinalities."},
    {id:2,sub:"OS",title:"CPU Scheduling Algorithms",due:"2026-06-18",marks:15,status:"Submitted",desc:"Implement FCFS, SJF, and Round Robin scheduling algorithms in C and compare their performance."},
    {id:3,sub:"CN",title:"Subnetting Practice",due:"2026-06-08",marks:10,status:"Evaluated",score:9,desc:"Solve 10 subnetting problems for Class B and Class C networks."},
    {id:4,sub:"TOC",title:"NFA to DFA Conversion",due:"2026-06-25",marks:25,status:"Pending",desc:"Convert given NFA to equivalent DFA using subset construction method."},
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [bulkForm, setBulkForm] = useState({title:"",subjects:[],desc:"",due:"",marks:"",sendToAll:true});
  const [bulkDone, setBulkDone] = useState(false);
  const [detail, setDetail] = useState(null);
  const subjects = ["DBMS","OS","CN","TOC","SE","DS","ALGO"];

  const isFaculty = role === "faculty";

  const toggleSubject = (s) => {
    setBulkForm(f=>({...f,subjects:f.subjects.includes(s)?f.subjects.filter(x=>x!==s):[...f.subjects,s]}));
  };

  const createBulk = () => {
    if (!bulkForm.title || !bulkForm.due || bulkForm.subjects.length === 0) return;
    const newAssignments = bulkForm.subjects.map((sub,i) => ({
      id: Date.now()+i, sub, title:bulkForm.title, due:bulkForm.due,
      marks:parseInt(bulkForm.marks)||10, status:"Pending", desc:bulkForm.desc
    }));
    setAssignments(p=>[...p,...newAssignments]);
    setBulkDone(true);
    setTimeout(()=>{ setBulkDone(false); setShowCreate(false); setBulkForm({title:"",subjects:[],desc:"",due:"",marks:"",sendToAll:true}); }, 1800);
  };

  const getDueStatus = (due) => {
    const d = new Date(due), now = new Date();
    const diff = Math.ceil((d-now)/(1000*60*60*24));
    if(diff < 0) return {label:"Overdue",color:"#ef4444",bg:"#fee2e2"};
    if(diff <= 2) return {label:`Due in ${diff}d`,color:"#f59e0b",bg:"#fef3c7"};
    return {label:`Due ${d.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,color:"#10b981",bg:"#dcfce7"};
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:18,fontWeight:700,color:"#0f172a"}}>📝 Assignments</div>
        {isFaculty && (
          <button onClick={()=>setShowCreate(true)}
            style={{padding:"8px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            📤 Bulk Create Assignment
          </button>
        )}
      </div>
      <div style={{display:"grid",gap:12}}>
        {assignments.map(a => {
          const due = getDueStatus(a.due);
          return (
            <div key={a.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"box-shadow .15s"}}
              onClick={()=>setDetail(a)}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(99,102,241,0.12)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{width:44,height:44,borderRadius:10,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📋</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:"#0f172a",fontSize:14}}>{a.title}</div>
                <div style={{fontSize:12,color:"#6366f1",fontWeight:600,marginTop:2}}>{a.sub}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <span style={{padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:700,background:due.bg,color:due.color}}>{due.label}</span>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>Max: {a.marks} marks</div>
              </div>
              <div style={{flexShrink:0}}>
                <span style={{padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:700,
                  background:a.status==="Submitted"?"#e8f0ff":a.status==="Evaluated"?"#dcfce7":"#fff8e1",
                  color:a.status==="Submitted"?"#6366f1":a.status==="Evaluated"?"#16a34a":"#f59e0b"}}>
                  {a.status==="Evaluated"?`✅ ${a.score}/${a.marks}`:a.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDetail(null)}>
          <div style={{background:"#fff",borderRadius:14,width:520,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{color:"#fff",fontWeight:700,fontSize:15}}>{detail.title}</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:2}}>{detail.sub} · Max {detail.marks} marks</div></div>
              <button onClick={()=>setDetail(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            <div style={{padding:"20px 24px"}}>
              <div style={{fontSize:13,color:"#475569",lineHeight:1.7,marginBottom:16}}>{detail.desc}</div>
              <div style={{display:"flex",gap:12,marginBottom:18}}>
                <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"10px 14px"}}>
                  <div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>DEADLINE</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginTop:2}}>{new Date(detail.due).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
                </div>
                <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"10px 14px"}}>
                  <div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>STATUS</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#6366f1",marginTop:2}}>{detail.status}</div>
                </div>
              </div>
              {detail.status === "Pending" && (
                <button onClick={()=>{ setAssignments(p=>p.map(a=>a.id===detail.id?{...a,status:"Submitted"}:a)); setDetail(null); }}
                  style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>
                  📎 Upload Submission
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Create Modal */}
      {showCreate && (
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowCreate(false)}>
          <div style={{background:"#fff",borderRadius:14,width:540,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>📤 Bulk Assignment Creation</span>
              <button onClick={()=>setShowCreate(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            {bulkDone ? (
              <div style={{padding:"40px",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <div style={{fontWeight:700,fontSize:16,color:"#0f172a"}}>Assignments Created!</div>
                <div style={{fontSize:13,color:"#64748b",marginTop:6}}>Sent to all students in selected subjects.</div>
              </div>
            ) : (
              <div style={{padding:"20px 22px",display:"grid",gap:14}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>ASSIGNMENT TITLE *</label>
                  <input value={bulkForm.title} onChange={e=>setBulkForm(f=>({...f,title:e.target.value}))}
                    placeholder="e.g. End Term Project Submission"
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:6}}>SELECT SUBJECTS * <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>(select multiple)</span></label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {subjects.map(s=>(
                      <button key={s} onClick={()=>toggleSubject(s)}
                        style={{padding:"5px 14px",border:`1px solid ${bulkForm.subjects.includes(s)?"#6366f1":"#e2e8f0"}`,borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:bulkForm.subjects.includes(s)?"#eef2ff":"#fff",color:bulkForm.subjects.includes(s)?"#6366f1":"#475569",transition:"all .15s"}}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>DEADLINE *</label>
                    <input type="date" value={bulkForm.due} onChange={e=>setBulkForm(f=>({...f,due:e.target.value}))}
                      style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>MAX MARKS</label>
                    <input type="number" value={bulkForm.marks} onChange={e=>setBulkForm(f=>({...f,marks:e.target.value}))}
                      placeholder="10"
                      style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>DESCRIPTION / INSTRUCTIONS</label>
                  <textarea value={bulkForm.desc} onChange={e=>setBulkForm(f=>({...f,desc:e.target.value}))} rows={3}
                    placeholder="Describe the assignment requirements..."
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
                </div>
                <div style={{background:"#f0f4ff",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#6366f1",fontWeight:600}}>
                  📢 Will be sent to ALL students in: {bulkForm.subjects.length > 0 ? bulkForm.subjects.join(", ") : "no subjects selected"}
                </div>
                <button onClick={createBulk} disabled={!bulkForm.title||!bulkForm.due||bulkForm.subjects.length===0}
                  style={{padding:"11px",background:(!bulkForm.title||!bulkForm.due||bulkForm.subjects.length===0)?"#c7d2fe":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:(!bulkForm.title||!bulkForm.due||bulkForm.subjects.length===0)?"not-allowed":"pointer",fontSize:14}}>
                  🚀 Create & Send to All Students
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Message Modal ────────────────────────────────────────────────────────────
function MessageModal({ to, toAll, subject: subjectName, onClose }) {
  const [msg, setMsg] = useState("");
  const [subj, setSubj] = useState(toAll ? `[${subjectName}] Announcement` : "");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!msg.trim() || !subj.trim()) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,width:520,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:"#fff",fontWeight:700,fontSize:15}}>
              {toAll ? `📢 Message All Students` : `✉ Message Student`}
            </div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:2}}>
              To: {toAll ? `All students in ${subjectName}` : to.name} {!toAll && <span style={{opacity:0.7}}>({to.email})</span>}
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:28,height:28,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {sent ? (
          <div style={{padding:"48px 24px",textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:12}}>✅</div>
            <div style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:6}}>Message Sent Successfully!</div>
            <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>
              {toAll ? `Your message has been delivered to all students in ${subjectName}.` : `Your message has been delivered to ${to.name}.`}
            </div>
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 16px",textAlign:"left",marginBottom:20}}>
              <div style={{fontSize:12,color:"#94a3b8",marginBottom:4}}>Message preview:</div>
              <div style={{fontSize:13,color:"#334155",fontWeight:600}}>{subj}</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:4,lineHeight:1.6}}>{msg}</div>
            </div>
            <button onClick={onClose} style={{padding:"9px 28px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Close</button>
          </div>
        ) : (
          <div style={{padding:"20px 24px"}}>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>SUBJECT</label>
              <input value={subj} onChange={e=>setSubj(e.target.value)} placeholder="Enter subject line..."
                style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit",color:"#334155"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>MESSAGE</label>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={5} placeholder="Type your message here..."
                style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",color:"#334155"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <button onClick={onClose} style={{padding:"9px 20px",background:"#f1f5f9",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,color:"#475569"}}>Cancel</button>
              <button onClick={handleSend} disabled={!msg.trim()||!subj.trim()||sending}
                style={{padding:"9px 24px",background:(!msg.trim()||!subj.trim())?"#c7d2fe":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:(!msg.trim()||!subj.trim())?"not-allowed":"pointer",fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                {sending ? "Sending..." : "Send Message ✉"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Faculty Subjects View ────────────────────────────────────────────────────
function StudentTimetable() {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const slots = ["9:00–10:00","10:00–11:00","11:00–12:00","12:00–1:00","1:00–2:00","2:00–3:00","3:00–4:00","4:00–5:00"];
  const today = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const tt = {
    "Monday":    ["CS301·LH-101","CS301·LH-101","—","CS302·LH-102","BREAK","CS304·LH-103","—","—"],
    "Tuesday":   ["CS303·LH-202","—","CS305·LH-201","—","BREAK","CS301·LH-101","CS301·LH-101","—"],
    "Wednesday": ["—","CS302·LH-102","CS302·LH-102","—","BREAK","CS304·LH-103","CS305·LH-201","—"],
    "Thursday":  ["CS301·LH-101","—","CS303·LH-202","CS303·LH-202","BREAK","—","CS302·LH-102","—"],
    "Friday":    ["CS305·LH-201","CS304·LH-103","—","CS301·LH-101","BREAK","—","CS303·LH-202","—"],
    "Saturday":  ["CS301L·DBLab","CS301L·DBLab","—","—","BREAK","—","—","—"],
  };
  const cc = {CS301:"#6366f1",CS302:"#10b981",CS303:"#f59e0b",CS304:"#8b5cf6",CS305:"#ec4899",CS301L:"#14b8a6"};
  const cn = {CS301:"DBMS",CS302:"OS",CS303:"CN",CS304:"TOC",CS305:"SE",CS301L:"DBMS Lab"};
  return (
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>
        📅 My Weekly Timetable — Spring 2025-26
      </div>
      <div style={{padding:14,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:700}}>
          <thead>
            <tr style={{background:"#f8fafc"}}>
              <th style={{padding:"8px 10px",fontWeight:700,color:"#475569",fontSize:11,width:95,borderBottom:"2px solid #e2e8f0",textAlign:"left"}}>TIME</th>
              {days.map(d=>(
                <th key={d} style={{padding:"8px 6px",fontWeight:700,fontSize:11,textAlign:"center",borderBottom:"2px solid #e2e8f0",
                  color:d===today?"#6366f1":"#475569",background:d===today?"#eef2ff":"transparent"}}>
                  {d.slice(0,3).toUpperCase()}
                  {d===today&&<div style={{fontSize:9,color:"#6366f1",fontWeight:600}}>TODAY</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot,si)=>(
              <tr key={slot} style={{borderBottom:"1px solid #f1f5f9",background:si%2===0?"#fff":"#fafbff"}}>
                <td style={{padding:"7px 10px",fontSize:11,fontWeight:600,color:"#64748b",whiteSpace:"nowrap"}}>{slot}</td>
                {days.map(d=>{
                  const cell=(tt[d]||[])[si]||"—";
                  if(cell==="BREAK") return <td key={d} style={{padding:"6px",textAlign:"center",background:"#fef9c3",fontSize:10,fontWeight:600,color:"#92400e"}}>BREAK</td>;
                  if(cell==="—") return <td key={d} style={{padding:"6px",textAlign:"center",color:"#cbd5e1",background:d===today?"#f5f6ff":"transparent"}}>—</td>;
                  const [code,room]=cell.split("·");
                  const c=cc[code]||"#6366f1";
                  return (
                    <td key={d} style={{padding:"4px 5px",background:d===today?"#eef2ff":"transparent"}}>
                      <div style={{background:c+"15",border:`1px solid ${c}30`,borderLeft:`3px solid ${c}`,borderRadius:4,padding:"4px 5px"}}>
                        <div style={{fontWeight:700,fontSize:11,color:c}}>{code}</div>
                        <div style={{fontSize:9,color:"#475569"}}>{cn[code]}</div>
                        <div style={{fontSize:9,color:"#94a3b8"}}>{room}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
          {Object.entries(cc).map(([code,c])=>(
            <div key={code} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
              <div style={{width:10,height:10,borderRadius:2,background:c}}/>
              <span style={{color:"#64748b"}}>{code} — {cn[code]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FacultySubjectsView() {
  const [sel, setSel] = useState(null);
  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState("students");
  const [attSaved, setAttSaved] = useState(false);
  const [selAttDate, setSelAttDate] = useState("Jun 19");
  const [marksLocked, setMarksLocked] = useState({});
  const [marksSaved, setMarksSaved] = useState(false);
  const [inbox, setInbox] = useState([
    {from:"Riya Patel",roll:"22CS001",subj:"Query about Assignment #4",msg:"Ma'am, can you clarify the ER diagram requirements?",time:"Jun 8, 9:42 AM",read:false},
    {from:"Amit Kumar",roll:"22CS005",subj:"Lab file submission",msg:"Sir, I submitted the lab file. Please check.",time:"Jun 7, 2:15 PM",read:true},
    {from:"Priya Nair",roll:"22CS012",subj:"Leave for Jun 10",msg:"Sir, I will be absent on Jun 10 due to medical reasons.",time:"Jun 6, 11:00 AM",read:false},
  ]);

  // Attendance state: {subjectCode: {roll: {date: "P"|"A"|"L"}}}
  const classDates = ["Jun 3","Jun 5","Jun 7","Jun 10","Jun 12","Jun 14","Jun 17","Jun 19"];
  const [attData, setAttData] = useState({
    "CS301":{
      "22CS001":{"Jun 3":"P","Jun 5":"P","Jun 7":"P","Jun 10":"A","Jun 12":"P","Jun 14":"P","Jun 17":"P","Jun 19":"P"},
      "22CS002":{"Jun 3":"P","Jun 5":"A","Jun 7":"P","Jun 10":"P","Jun 12":"P","Jun 14":"A","Jun 17":"P","Jun 19":"P"},
      "22CS003":{"Jun 3":"P","Jun 5":"P","Jun 7":"A","Jun 10":"P","Jun 12":"A","Jun 14":"P","Jun 17":"P","Jun 19":"A"},
      "22CS004":{"Jun 3":"A","Jun 5":"A","Jun 7":"P","Jun 10":"A","Jun 12":"P","Jun 14":"A","Jun 17":"A","Jun 19":"P"},
    },
    "CS302":{
      "22CS005":{"Jun 3":"P","Jun 5":"P","Jun 7":"P","Jun 10":"P","Jun 12":"A","Jun 14":"P","Jun 17":"P","Jun 19":"P"},
      "22CS006":{"Jun 3":"P","Jun 5":"P","Jun 7":"P","Jun 10":"P","Jun 12":"P","Jun 14":"P","Jun 17":"A","Jun 19":"P"},
      "22CS007":{"Jun 3":"P","Jun 5":"A","Jun 7":"A","Jun 10":"P","Jun 12":"P","Jun 14":"A","Jun 17":"P","Jun 19":"P"},
    },
  });

  // Marks state: {subjectCode: {roll: {component: marks}}}
  const [marksData, setMarksData] = useState({
    "CS301":{
      "22CS001":{mid1:18,mid2:17,assignment:19,practical:0,total:0},
      "22CS002":{mid1:15,mid2:16,assignment:17,practical:0,total:0},
      "22CS003":{mid1:14,mid2:13,assignment:15,practical:0,total:0},
      "22CS004":{mid1:10,mid2:11,assignment:12,practical:0,total:0},
    },
    "CS302":{
      "22CS005":{mid1:17,mid2:16,assignment:18,practical:0,total:0},
      "22CS006":{mid1:19,mid2:18,assignment:20,practical:0,total:0},
      "22CS007":{mid1:13,mid2:14,assignment:15,practical:0,total:0},
    },
  });

  const subjectData = {
    "CS301":[
      {roll:"22CS001",name:"Riya Patel",email:"riya@iter.in",project:"EEG Cognitive Load"},
      {roll:"22CS002",name:"Aryan Mishra",email:"aryan@iter.in",project:"—"},
      {roll:"22CS003",name:"Sneha Patil",email:"sneha@iter.in",project:"—"},
      {roll:"22CS004",name:"Rohan Das",email:"rohan@iter.in",project:"—"},
    ],
    "CS301L":[
      {roll:"22CS011",name:"Priya Nair",email:"priya@iter.in",project:"ML on Medical Data"},
      {roll:"22CS012",name:"Kiran Joshi",email:"kiran@iter.in",project:"—"},
    ],
    "CS302":[
      {roll:"22CS005",name:"Amit Kumar",email:"amit@iter.in",project:"IoT Home Automation"},
      {roll:"22CS006",name:"Neha Sharma",email:"neha@iter.in",project:"—"},
      {roll:"22CS007",name:"Vikram Rao",email:"vikram@iter.in",project:"—"},
    ],
    "CS499":[
      {roll:"22CS021",name:"Deepak Nanda",email:"deepak@iter.in",project:"Blockchain Voting"},
      {roll:"22CS022",name:"Ananya Mohanty",email:"ananya@iter.in",project:"AR Navigation"},
    ],
  };

  const subjects = [
    {code:"CS301",name:"Database Management Systems",class:"CSE 5A",type:"Theory"},
    {code:"CS301L",name:"DBMS Lab",class:"CSE 5B",type:"Lab"},
    {code:"CS302",name:"Operating Systems",class:"CSE 5C",type:"Theory"},
    {code:"CS499",name:"Final Year Project",class:"CSE 7A",type:"Project"},
  ];

  const students = sel ? (subjectData[sel.code]||[]) : [];
  const unread = inbox.filter(m=>!m.read).length;
  const typeColor = {Theory:"#6366f1",Lab:"#f59e0b",Project:"#10b981"};

  // Attendance helpers
  const toggleAtt = (code,roll,date) => {
    const cycle = {"P":"A","A":"L","L":"P"};
    setAttData(prev=>({...prev,[code]:{...prev[code],[roll]:{...(prev[code]?.[roll]||{}),[date]:cycle[prev[code]?.[roll]?.[date]||"P"]||"P"}}}));
  };
  const getAttPct = (code,roll) => {
    const d = attData[code]?.[roll]||{};
    const vals = Object.values(d);
    if(!vals.length) return 0;
    return Math.round(vals.filter(v=>v==="P").length/vals.length*100);
  };

  // Marks helpers
  const maxMarks = {mid1:20,mid2:20,assignment:20,practical:20};
  const updateMark = (code,roll,comp,val) => {
    const num = Math.min(maxMarks[comp], Math.max(0, parseInt(val)||0));
    setMarksData(prev=>{
      const updated = {...(prev[code]?.[roll]||{}), [comp]:num};
      const total = updated.mid1+updated.mid2+updated.assignment+updated.practical;
      return {...prev,[code]:{...prev[code],[roll]:{...updated,total}}};
    });
  };
  const getGrade = (t) => t>=72?"O":t>=64?"A+":t>=56?"A":t>=48?"B+":t>=40?"B":t>=32?"C":"F";

  const attStatusColor = s => s==="P"?{bg:"#dcfce7",c:"#16a34a"}:s==="A"?{bg:"#fee2e2",c:"#dc2626"}:{bg:"#fef9c3",c:"#ca8a04"};

  return (
    <>
      {modal && <MessageModal to={modal.to} toAll={modal.toAll} subject={modal.subjectName} onClose={()=>setModal(null)}/>}
      <div style={{display:"grid",gridTemplateColumns:"210px 1fr",gap:14}}>

        {/* Subject List */}
        <div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 14px",color:"#fff",fontWeight:700,fontSize:13}}>My Subjects</div>
            {subjects.map(s=>(
              <div key={s.code} onClick={()=>{setSel(s);setActiveTab("students");}}
                style={{padding:"12px 14px",borderBottom:"1px solid #f1f5f9",cursor:"pointer",
                  background:sel?.code===s.code?"#eef2ff":"#fff",
                  borderLeft:sel?.code===s.code?"4px solid #6366f1":"4px solid transparent"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:13,color:"#6366f1"}}>{s.code}</span>
                  <span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:20,background:(typeColor[s.type]||"#6366f1")+"20",color:typeColor[s.type]}}>{s.type}</span>
                </div>
                <div style={{fontSize:12,color:"#334155",fontWeight:500,lineHeight:1.3}}>{s.name}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.class} · {(subjectData[s.code]||[]).length} students</div>
              </div>
            ))}
          </div>
          {/* Inbox */}
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginTop:14}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 14px",color:"#fff",fontWeight:700,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>Inbox</span>
              {unread>0&&<span style={{background:"#ef4444",borderRadius:20,fontSize:11,padding:"1px 8px",fontWeight:700}}>{unread}</span>}
            </div>
            {inbox.map((m,i)=>(
              <div key={i} onClick={()=>setInbox(prev=>prev.map((x,j)=>j===i?{...x,read:true}:x))}
                style={{padding:"9px 12px",borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:m.read?"#fff":"#f0f4ff"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontWeight:m.read?500:700,fontSize:12,color:"#334155"}}>{m.from}</span>
                  {!m.read&&<span style={{width:7,height:7,borderRadius:"50%",background:"#6366f1",display:"inline-block",marginTop:4}}/>}
                </div>
                <div style={{fontSize:11,color:"#6366f1",fontWeight:600}}>{m.subj}</div>
                <div style={{fontSize:10,color:"#cbd5e1"}}>{m.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div>
          {!sel ? (
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"60px 0",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>📚</div>
              <div style={{fontWeight:700,fontSize:16,color:"#0f172a",marginBottom:6}}>Select a Subject</div>
              <div style={{color:"#94a3b8",fontSize:13}}>Click a subject on the left to manage students</div>
            </div>
          ) : (
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
              {/* Header */}
              <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{sel.name}</div>
                  <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{sel.code} · {sel.class} · {students.length} students</div>
                </div>
                <button onClick={()=>setModal({toAll:true,subjectName:sel.name})}
                  style={{padding:"7px 14px",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:12}}>
                  📢 Message All
                </button>
              </div>

              {/* Tabs */}
              <div style={{display:"flex",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"}}>
                {[["students","👥 Students"],["attendance","📋 Attendance"],["marks","📊 Marks"],["inbox","📩 Inbox"]].map(([t,l])=>(
                  <button key={t} onClick={()=>setActiveTab(t)}
                    style={{padding:"10px 16px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:activeTab===t?700:500,
                      color:activeTab===t?"#6366f1":"#64748b",borderBottom:activeTab===t?"2px solid #6366f1":"2px solid transparent"}}>
                    {l}{t==="inbox"&&unread>0?` (${unread})`:""}
                  </button>
                ))}
              </div>

              {/* Students tab */}
              {activeTab==="students" && (
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      {["Roll No.","Name","Email","Project","Attendance","Message"].map(h=>(
                        <th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s,i)=>{
                      const pct = getAttPct(sel.code,s.roll);
                      return (
                        <tr key={s.roll} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                          <td style={{padding:"11px 14px",color:"#6366f1",fontWeight:700}}>{s.roll}</td>
                          <td style={{padding:"11px 14px",color:"#0f172a",fontWeight:600}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>{s.name[0]}</div>
                              {s.name}
                            </div>
                          </td>
                          <td style={{padding:"11px 14px",color:"#64748b",fontSize:12}}>{s.email}</td>
                          <td style={{padding:"11px 14px",color:"#64748b",fontSize:12}}>{s.project}</td>
                          <td style={{padding:"11px 14px"}}>
                            <span style={{fontWeight:700,color:pct>=75?"#10b981":pct>=65?"#f59e0b":"#ef4444"}}>{pct}%</span>
                          </td>
                          <td style={{padding:"11px 14px"}}>
                            <button onClick={()=>setModal({to:s,toAll:false,subjectName:sel.name})}
                              style={{padding:"5px 12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>
                              ✉ Message
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Attendance tab */}
              {activeTab==="attendance" && (
                <div style={{padding:16}}>
                  {/* Date selector + bulk actions */}
                  <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px",marginBottom:14,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:4}}>CLASS DATE</div>
                      <select value={selAttDate} onChange={e=>setSelAttDate(e.target.value)}
                        style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,fontWeight:600,color:"#334155",background:"#fff",outline:"none",cursor:"pointer",fontFamily:"inherit"}}>
                        {classDates.map(d=><option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{height:36,width:1,background:"#e2e8f0"}}/>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:4}}>BULK MARK</div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>students.forEach(s=>setAttData(prev=>({...prev,[sel.code]:{...prev[sel.code],[s.roll]:{...(prev[sel.code]?.[s.roll]||{}),[selAttDate]:"P"}}})))}
                          style={{padding:"7px 16px",background:"#dcfce7",border:"1px solid #86efac",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:"#16a34a",display:"flex",alignItems:"center",gap:5}}>
                          ✓ All Present
                        </button>
                        <button onClick={()=>students.forEach(s=>setAttData(prev=>({...prev,[sel.code]:{...prev[sel.code],[s.roll]:{...(prev[sel.code]?.[s.roll]||{}),[selAttDate]:"A"}}})))}
                          style={{padding:"7px 16px",background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:"#dc2626",display:"flex",alignItems:"center",gap:5}}>
                          ✕ All Absent
                        </button>
                      </div>
                    </div>
                    <div style={{marginLeft:"auto",textAlign:"right"}}>
                      <div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>
                        {students.filter(s=>(attData[sel.code]?.[s.roll]?.[selAttDate]||"P")==="P").length}/{students.length} Present
                      </div>
                      <div style={{fontSize:11,color:"#94a3b8"}}>
                        {students.filter(s=>(attData[sel.code]?.[s.roll]?.[selAttDate]||"P")==="A").length} Absent &nbsp;·&nbsp;
                        {students.filter(s=>(attData[sel.code]?.[s.roll]?.[selAttDate]||"P")==="L").length} Leave
                      </div>
                    </div>
                  </div>

                  {/* Student list — one row per student, big P/A/L toggle */}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {students.map((s,i)=>{
                      const status = attData[sel.code]?.[s.roll]?.[selAttDate]||"P";
                      const pct = getAttPct(sel.code,s.roll);
                      return (
                        <div key={s.roll} style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",
                          borderLeft:`4px solid ${status==="P"?"#10b981":status==="A"?"#ef4444":"#f59e0b"}`}}>
                          {/* Avatar + name */}
                          <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,flexShrink:0}}>
                            {s.name[0]}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{s.name}</div>
                            <div style={{fontSize:11,color:"#94a3b8"}}>{s.roll} &nbsp;·&nbsp; Overall: <span style={{fontWeight:700,color:pct>=75?"#10b981":pct>=65?"#f59e0b":"#ef4444"}}>{pct}%</span></div>
                          </div>
                          {/* P / A / L toggle buttons */}
                          <div style={{display:"flex",gap:6,flexShrink:0}}>
                            {[["P","Present","#10b981","#dcfce7"],["A","Absent","#ef4444","#fee2e2"],["L","Leave","#f59e0b","#fef9c3"]].map(([val,tip,c,bg])=>(
                              <button key={val} title={tip}
                                onClick={()=>setAttData(prev=>({...prev,[sel.code]:{...prev[sel.code],[s.roll]:{...(prev[sel.code]?.[s.roll]||{}),[selAttDate]:val}}}))}
                                style={{width:40,height:36,borderRadius:8,border:`2px solid ${status===val?c:"#e2e8f0"}`,cursor:"pointer",fontSize:13,fontWeight:800,
                                  background:status===val?bg:"#fff",color:status===val?c:"#cbd5e1",transition:"all .12s"}}>
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    {attSaved&&<div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:8,padding:"8px 14px",fontSize:12,color:"#16a34a",fontWeight:600}}>✅ Attendance saved for {selAttDate}!</div>}
                    {!attSaved&&<div/>}
                    <button onClick={()=>{setAttSaved(true);setTimeout(()=>setAttSaved(false),3000);}}
                      style={{padding:"9px 22px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
                      💾 Save Attendance
                    </button>
                  </div>
                </div>
              )}

              {/* Marks tab */}
              {activeTab==="marks" && (
                <div style={{padding:16,overflowX:"auto"}}>
                  {/* Status bar */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:12,color:"#64748b"}}>
                      Internal marks: Mid-1 <strong>/20</strong> + Mid-2 <strong>/20</strong> + Assignment <strong>/20</strong> + Practical <strong>/20</strong> = <strong>/80</strong>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {marksLocked[sel?.code] ? (
                        <span style={{padding:"4px 12px",background:"#dcfce7",color:"#16a34a",borderRadius:8,fontSize:12,fontWeight:700}}>🔒 Locked & Submitted to Exam Section</span>
                      ) : (
                        <>
                          <button onClick={()=>{setMarksSaved(true);setTimeout(()=>setMarksSaved(false),2500);}}
                            style={{padding:"7px 16px",background:"#f1f5f9",color:"#475569",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12}}>
                            💾 Save Draft
                          </button>
                          <button onClick={()=>{if(window.confirm("Lock and submit marks to Exam Section? This cannot be undone.")) setMarksLocked(p=>({...p,[sel.code]:true}));}}
                            style={{padding:"7px 16px",background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12}}>
                            🔒 Lock & Submit to Exam
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {marksSaved&&<div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#16a34a",fontWeight:600}}>✅ Marks draft saved!</div>}
                  {marksLocked[sel?.code]&&<div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#92400e",fontWeight:600}}>⚠️ Marks are locked. Contact Exam Section to make corrections.</div>}
                  <table style={{borderCollapse:"collapse",fontSize:12,width:"100%"}}>
                    <thead>
                      <tr style={{background:"#f8fafc"}}>
                        <th style={{padding:"9px 12px",textAlign:"left",fontWeight:600,color:"#475569",borderBottom:"2px solid #e2e8f0",minWidth:130}}>Student</th>
                        {[["Mid 1","/20"],["Mid 2","/20"],["Assignment","/20"],["Practical","/20"],["Total","/80"],["Grade",""]].map(([h,sub])=>(
                          <th key={h} style={{padding:"9px 10px",textAlign:"center",fontWeight:600,color:"#475569",borderBottom:"2px solid #e2e8f0",minWidth:72}}>
                            {h}<span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>{sub}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s,i)=>{
                        const m = marksData[sel.code]?.[s.roll]||{mid1:0,mid2:0,assignment:0,practical:0,total:0};
                        const total = m.mid1+m.mid2+m.assignment+m.practical;
                        const grade = getGrade(total);
                        const gradeColor = grade==="O"||grade==="A+"?"#10b981":grade==="A"||grade==="B+"?"#6366f1":grade==="B"||grade==="C"?"#f59e0b":"#ef4444";
                        const locked = marksLocked[sel.code];
                        return (
                          <tr key={s.roll} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                            <td style={{padding:"8px 12px"}}>
                              <div style={{fontWeight:600,fontSize:12,color:"#0f172a"}}>{s.name}</div>
                              <div style={{fontSize:10,color:"#94a3b8"}}>{s.roll}</div>
                            </td>
                            {["mid1","mid2","assignment","practical"].map(comp=>(
                              <td key={comp} style={{padding:"6px 8px",textAlign:"center"}}>
                                {locked
                                  ? <span style={{fontWeight:700,color:"#334155"}}>{m[comp]}</span>
                                  : <input type="number" min="0" max={maxMarks[comp]} value={m[comp]}
                                      onChange={e=>updateMark(sel.code,s.roll,comp,e.target.value)}
                                      style={{width:46,padding:"5px 4px",border:"1px solid #e2e8f0",borderRadius:6,textAlign:"center",fontSize:13,fontWeight:600,color:"#334155",outline:"none",fontFamily:"inherit"}}/>}
                              </td>
                            ))}
                            <td style={{padding:"8px 10px",textAlign:"center",fontWeight:800,fontSize:14,color:"#0f172a"}}>{total}</td>
                            <td style={{padding:"8px 10px",textAlign:"center"}}>
                              <span style={{padding:"3px 10px",borderRadius:6,fontWeight:800,fontSize:13,background:gradeColor+"20",color:gradeColor}}>{grade}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Inbox tab */}
              {activeTab==="inbox" && (
                <div style={{padding:14}}>
                  {inbox.map((m,i)=>(
                    <div key={i} onClick={()=>setInbox(prev=>prev.map((x,j)=>j===i?{...x,read:true}:x))}
                      style={{padding:"12px 14px",border:"1px solid",borderColor:m.read?"#e2e8f0":"#c7d2fe",borderRadius:10,marginBottom:10,background:m.read?"#fff":"#f0f4ff",cursor:"pointer"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700}}>{m.from[0]}</div>
                          <div>
                            <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{m.from}</div>
                            <div style={{fontSize:11,color:"#94a3b8"}}>{m.roll} · {m.time}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          {!m.read&&<span style={{background:"#6366f1",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>NEW</span>}
                          <button onClick={e=>{e.stopPropagation();setModal({to:{name:m.from,email:m.roll+"@iter.in"},toAll:false,subjectName:sel.name});}}
                            style={{padding:"4px 10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Reply</button>
                        </div>
                      </div>
                      <div style={{fontWeight:600,fontSize:13,color:"#334155",marginBottom:2}}>{m.subj}</div>
                      <div style={{fontSize:12,color:"#64748b"}}>{m.msg}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


// ─── Evaluation View ──────────────────────────────────────────────────────────
// ─── QUESTION PAPER SUBMISSION ────────────────────────────────────────────────
function QuestionPaperSubmission() {
  const [tab, setTab] = useState("my");
  const [showCompose, setShowCompose] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // {id, action}

  const [papers, setPapers] = useState([
    {
      id:"QP001", subject:"CS301", name:"Database Management Systems",
      type:"End Semester", year:"2025-26", semester:"5",
      sections:[
        {section:"A", marks:20, questions:[
          {no:1, text:"Explain the concept of normalization. Describe 1NF, 2NF, and 3NF with examples.", marks:10, unit:"Unit 3", co:"CO3", bt:"Understanding"},
          {no:2, text:"Draw and explain the ER diagram for a Hospital Management System.", marks:10, unit:"Unit 1", co:"CO1", bt:"Application"},
        ]},
        {section:"B", marks:30, questions:[
          {no:3, text:"Explain ACID properties of a transaction with suitable examples.", marks:10, unit:"Unit 4", co:"CO4", bt:"Understanding"},
          {no:4, text:"Write SQL queries for the given schema to demonstrate joins and subqueries.", marks:10, unit:"Unit 2", co:"CO2", bt:"Application"},
          {no:5, text:"Explain B+ tree structure. How is it used for indexing?", marks:10, unit:"Unit 5", co:"CO5", bt:"Analysis"},
        ]},
        {section:"C", marks:30, questions:[
          {no:6, text:"Explain concurrency control using two-phase locking protocol.", marks:15, unit:"Unit 4", co:"CO4", bt:"Analysis"},
          {no:7, text:"Discuss query optimization techniques with examples.", marks:15, unit:"Unit 5", co:"CO5", bt:"Evaluation"},
        ]},
      ],
      status:"Draft", submittedTo:null,
      stages:[
        {label:"Created",done:true,date:"Jun 8",actor:"Dr. Priya Singh"},
        {label:"Submitted to Coordinator",done:false,date:"—",actor:""},
        {label:"Coordinator Approved",done:false,date:"—",actor:""},
        {label:"Sent to Exam Section",done:false,date:"—",actor:""},
        {label:"Approved to Print",done:false,date:"—",actor:""},
      ],
      remarks:[],
      totalMarks:80, duration:"3 Hours",
    },
    {
      id:"QP002", subject:"CS302", name:"Operating Systems",
      type:"Mid Semester", year:"2025-26", semester:"5",
      sections:[
        {section:"A", marks:20, questions:[
          {no:1, text:"Define a process. Explain process states with state transition diagram.", marks:10, unit:"Unit 2", co:"CO1", bt:"Understanding"},
          {no:2, text:"Explain Round Robin scheduling with an example. Calculate average waiting time.", marks:10, unit:"Unit 2", co:"CO2", bt:"Application"},
        ]},
        {section:"B", marks:20, questions:[
          {no:3, text:"What is deadlock? Explain Banker's algorithm for deadlock avoidance.", marks:20, unit:"Unit 2", co:"CO3", bt:"Analysis"},
        ]},
      ],
      status:"Pending Coordinator",
      submittedTo:"Dr. R. Panda (Coordinator)",
      stages:[
        {label:"Created",done:true,date:"Jun 5",actor:"Dr. Priya Singh"},
        {label:"Submitted to Coordinator",done:true,date:"Jun 6",actor:"Dr. Priya Singh"},
        {label:"Coordinator Approved",done:false,date:"—",actor:""},
        {label:"Sent to Exam Section",done:false,date:"—",actor:""},
        {label:"Approved to Print",done:false,date:"—",actor:""},
      ],
      remarks:[{from:"Dr. R. Panda",text:"Please increase difficulty of Q2.",date:"Jun 7"}],
      totalMarks:40, duration:"2 Hours",
    },
  ]);

  const [form, setForm] = useState({
    subject:"", name:"", type:"End Semester", priority:"Normal", to:"HOD — CSE",
    desc:"", attachment:"", mode:"online", uploadedFile:"", uploadedSize:"",
    filePassword:"", semester:"5", duration:"3 Hours", totalMarks:80,
    sections:[{section:"A",marks:20,questions:[{no:1,text:"",marks:10,unit:"Unit 1",co:"CO1",bt:"Understanding"}]}],
  });

  const statusColor = s => ({
    "Draft":{bg:"#f1f5f9",c:"#64748b"},
    "Pending Coordinator":{bg:"#fef9c3",c:"#ca8a04"},
    "Coordinator Approved":{bg:"#dcfce7",c:"#16a34a"},
    "Pending Exam Section":{bg:"#fef9c3",c:"#ca8a04"},
    "Approved to Print":{bg:"#dcfce7",c:"#16a34a"},
    "Returned for Revision":{bg:"#fee2e2",c:"#dc2626"},
  }[s]||{bg:"#f1f5f9",c:"#64748b"});

  const advanceStage = (paperId) => {
    setPapers(prev => prev.map(p => {
      if(p.id !== paperId) return p;
      const nextStages = [...p.stages];
      const nextIdx = nextStages.findIndex(s => !s.done);
      if(nextIdx === -1) return p;
      nextStages[nextIdx] = {...nextStages[nextIdx], done:true, date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}), actor:"Dr. Priya Singh"};
      const statusMap = {1:"Pending Coordinator",2:"Coordinator Approved",3:"Pending Exam Section",4:"Approved to Print"};
      return {...p, stages:nextStages, status:statusMap[nextIdx]||p.status};
    }));
    setConfirmModal(null);
  };

  const [selPaper, setSelPaper] = useState(null);

  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["my","📄 My Papers"],["compose","✏️ Create New Paper"]].map(([t,l])=>(
          <button key={t} onClick={()=>{setTab(t);setSelPaper(null);}}
            style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
              background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>

      {/* ── MY PAPERS ── */}
      {tab==="my" && !selPaper && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {papers.map(p=>{
            const sc = statusColor(p.status);
            const nextStage = p.stages.find(s=>!s.done);
            return (
              <div key={p.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
                {/* Header */}
                <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"1px solid #f1f5f9"}}>
                  <div>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                      <span style={{fontWeight:700,color:"#6366f1",fontSize:13}}>{p.subject}</span>
                      <span style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{p.name}</span>
                      <span style={{fontSize:11,padding:"1px 8px",borderRadius:20,background:"#eef2ff",color:"#6366f1",fontWeight:600}}>{p.type}</span>
                    </div>
                    <div style={{fontSize:12,color:"#64748b"}}>
                      Sem {p.semester} · {p.totalMarks} Marks · {p.duration} · {p.id}
                    </div>
                    {p.remarks.length>0&&(
                      <div style={{marginTop:6,background:"#fef9c3",borderRadius:6,padding:"5px 10px",fontSize:12,color:"#92400e"}}>
                        💬 Remark: "{p.remarks[p.remarks.length-1].text}" — {p.remarks[p.remarks.length-1].from}
                      </div>
                    )}
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,marginLeft:12}}>
                    <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,background:sc.bg,color:sc.c}}>{p.status}</span>
                    <button onClick={()=>setSelPaper(p)}
                      style={{padding:"5px 12px",background:"#f1f5f9",color:"#334155",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>
                      View
                    </button>
                    {nextStage&&p.status!=="Approved to Print"&&(
                      <button onClick={()=>setConfirmModal({id:p.id,stage:nextStage.label})}
                        style={{padding:"5px 14px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>
                        {nextStage.label} →
                      </button>
                    )}
                    {p.status==="Approved to Print"&&(
                      <span style={{padding:"5px 12px",background:"#dcfce7",color:"#16a34a",borderRadius:7,fontSize:11,fontWeight:700}}>✅ Ready to Print</span>
                    )}
                  </div>
                </div>

                {/* Stage tracker */}
                <div style={{padding:"12px 16px",background:"#fafbff"}}>
                  <div style={{display:"flex",alignItems:"center"}}>
                    {p.stages.map((st,si)=>(
                      <div key={si} style={{display:"flex",alignItems:"center",flex:si<p.stages.length-1?1:"initial"}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:90}}>
                          <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,
                            background:st.done?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
                            color:st.done?"#fff":"#94a3b8",border:st.done?"none":"2px dashed #cbd5e1"}}>
                            {st.done?"✓":si+1}
                          </div>
                          <div style={{fontSize:9,fontWeight:600,color:st.done?"#6366f1":"#94a3b8",textAlign:"center",lineHeight:1.3,maxWidth:80}}>{st.label}</div>
                          {st.done&&<div style={{fontSize:8,color:"#94a3b8"}}>{st.date}</div>}
                        </div>
                        {si<p.stages.length-1&&<div style={{flex:1,height:2,background:p.stages[si+1].done?"#6366f1":"#e2e8f0",margin:"0 2px",marginBottom:24}}/>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIEW PAPER ── */}
      {tab==="my" && selPaper && (
        <div>
          <button onClick={()=>setSelPaper(null)} style={{marginBottom:12,padding:"6px 14px",background:"#f1f5f9",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:"#475569"}}>← Back</button>
          <div style={{background:"#fff",border:"2px solid #6366f1",borderRadius:12,overflow:"hidden"}}>
            {/* Paper header */}
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"16px 20px",textAlign:"center",color:"#fff"}}>
              <div style={{fontWeight:900,fontSize:16}}>ITER — SOA University, Bhubaneswar</div>
              <div style={{fontSize:13,marginTop:2,opacity:0.9}}>Department of Computer Science & Engineering</div>
              <div style={{fontSize:14,fontWeight:700,marginTop:6}}>{selPaper.type} Examination — {selPaper.year}</div>
              <div style={{fontSize:13,marginTop:2}}>{selPaper.subject} : {selPaper.name}</div>
              <div style={{display:"flex",justifyContent:"center",gap:32,marginTop:8,fontSize:12,opacity:0.85}}>
                <span>Semester: {selPaper.semester}</span>
                <span>Full Marks: {selPaper.totalMarks}</span>
                <span>Duration: {selPaper.duration}</span>
              </div>
            </div>
            <div style={{padding:"6px 16px",background:"#fef9c3",textAlign:"center",fontSize:12,color:"#92400e",fontWeight:500}}>
              Answer all questions. Figures in the margin indicate full marks.
            </div>
            {/* Sections */}
            <div style={{padding:"16px 20px"}}>
              {selPaper.sections.map(sec=>(
                <div key={sec.section} style={{marginBottom:20}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:10,paddingBottom:6,borderBottom:"2px solid #6366f1"}}>
                    Section {sec.section} (Marks: {sec.marks})
                  </div>
                  {sec.questions.map(q=>(
                    <div key={q.no} style={{display:"flex",gap:10,marginBottom:12,padding:"10px 12px",background:"#fafbff",borderRadius:8,borderLeft:"3px solid #6366f1"}}>
                      <div style={{fontWeight:700,fontSize:14,color:"#6366f1",flexShrink:0,width:24}}>{q.no}.</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,color:"#0f172a",lineHeight:1.6,marginBottom:4}}>{q.text}</div>
                        <div style={{display:"flex",gap:10,fontSize:10,color:"#94a3b8"}}>
                          <span>📚 {q.unit}</span><span>🎯 {q.co}</span><span>🧠 {q.bt}</span>
                        </div>
                      </div>
                      <div style={{fontWeight:700,fontSize:13,color:"#6366f1",flexShrink:0}}>[{q.marks}]</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE NEW PAPER ── */}
      {tab==="compose" && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>Create Question Paper</div>

          {/* Mode toggle */}
          <div style={{display:"flex",gap:0,background:"#f1f5f9",borderRadius:10,padding:3,marginBottom:18,width:"fit-content"}}>
            {[["online","✏️ Type Online"],["upload","📎 Upload Document"]].map(([m,l])=>(
              <button key={m} onClick={()=>setForm(f=>({...f,mode:m}))}
                style={{padding:"9px 22px",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,
                  background:(form.mode||"online")===m?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",
                  color:(form.mode||"online")===m?"#fff":"#64748b"}}>
                {l}
              </button>
            ))}
          </div>

          {/* Common metadata fields */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
            {[["Subject Code","subject"],["Subject Name","name"],["Duration","duration"]].map(([l,k])=>(
              <div key={k}>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                  style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              </div>
            ))}
            {[["Exam Type","type",["End Semester","Mid Semester","Supplementary"]],["Semester","semester",["1","2","3","4","5","6","7","8"]]].map(([l,k,opts])=>(
              <div key={k}>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                <select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                  style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                  {opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>TOTAL MARKS</label>
              <input type="number" value={form.totalMarks} onChange={e=>setForm(f=>({...f,totalMarks:e.target.value}))}
                style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            </div>
          </div>

          {/* ── UPLOAD MODE ── */}
          {(form.mode||"online")==="upload" && (
            <div>
              {/* Upload zone */}
              <div style={{border:"2px dashed #c7d2fe",borderRadius:12,padding:"36px 24px",textAlign:"center",background:"#f8faff",marginBottom:14,position:"relative"}}>
                <input type="file" accept=".pdf,.doc,.docx" id="qp-upload"
                  onChange={e=>{const f=e.target.files[0];if(f)setForm(p=>({...p,uploadedFile:f.name,uploadedSize:(f.size/1024).toFixed(1)+"KB"}));}}
                  style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}}/>
                {form.uploadedFile ? (
                  <div>
                    <div style={{fontSize:40,marginBottom:8}}>{form.uploadedFile.endsWith(".pdf")?"📄":"📝"}</div>
                    <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{form.uploadedFile}</div>
                    <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{form.uploadedSize} · Click to replace</div>
                    <button onClick={e=>{e.preventDefault();e.stopPropagation();setForm(p=>({...p,uploadedFile:"",uploadedSize:""}));}}
                      style={{marginTop:10,padding:"4px 14px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{fontSize:40,marginBottom:8}}>📎</div>
                    <div style={{fontWeight:700,fontSize:14,color:"#334155"}}>Click to upload or drag & drop</div>
                    <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>Supported formats: <strong>.pdf</strong>, <strong>.doc</strong>, <strong>.docx</strong></div>
                    <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>Max size: 10 MB</div>
                  </div>
                )}
              </div>

              {/* Info note */}
              <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#4338ca",display:"flex",gap:8}}>
                <span style={{fontSize:16,flexShrink:0}}>💡</span>
                <span>Use this option when your question paper has <strong>diagrams, figures, circuit drawings</strong>, or complex mathematical notation that can't be typed. Prepare the paper in Word/PDF and upload here. The file will go through the same coordinator → exam section approval workflow.</span>
              </div>

              {/* Set password option */}
              <div style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",marginBottom:14,display:"flex",gap:12,alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#334155"}}>🔒 Password protect the file</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>Only Exam Section can open after approval</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="password" placeholder="Set password (optional)"
                    value={form.filePassword||""}
                    onChange={e=>setForm(p=>({...p,filePassword:e.target.value}))}
                    style={{padding:"7px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",width:180,fontFamily:"inherit"}}/>
                </div>
              </div>
            </div>
          )}

          {/* ── ONLINE TYPE MODE ── */}
          {(form.mode||"online")==="online" && (
            <div>
              {form.sections.map((sec,si)=>(
                <div key={si} style={{marginBottom:14,border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}>
                  <div style={{background:"#f8fafc",padding:"8px 12px",fontWeight:700,fontSize:13,color:"#0f172a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>Section {sec.section} — {sec.marks} Marks</span>
                    <input type="number" value={sec.marks} onChange={e=>setForm(f=>{const s=[...f.sections];s[si].marks=Number(e.target.value);return {...f,sections:s};})}
                      style={{width:60,padding:"3px 6px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:12,textAlign:"center",outline:"none"}}/>
                  </div>
                  {sec.questions.map((q,qi)=>(
                    <div key={qi} style={{padding:"10px 12px",borderBottom:"1px solid #f1f5f9"}}>
                      <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                        <span style={{fontWeight:700,color:"#6366f1",fontSize:13,flexShrink:0}}>Q{q.no}.</span>
                        <input value={q.text} onChange={e=>setForm(f=>{const s=[...f.sections];s[si].questions[qi].text=e.target.value;return {...f,sections:s};})}
                          placeholder="Enter question text..."
                          style={{flex:1,padding:"7px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                        <input type="number" value={q.marks} onChange={e=>setForm(f=>{const s=[...f.sections];s[si].questions[qi].marks=Number(e.target.value);return {...f,sections:s};})}
                          placeholder="Marks" style={{width:52,padding:"7px 6px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,textAlign:"center",outline:"none"}}/>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        {[["unit","Unit"],["co","CO"],["bt","BT Level"]].map(([k,l])=>(
                          <div key={k} style={{flex:1}}>
                            <label style={{fontSize:9,fontWeight:700,color:"#94a3b8",display:"block",marginBottom:2}}>{l}</label>
                            <input value={q[k]} onChange={e=>setForm(f=>{const s=[...f.sections];s[si].questions[qi][k]=e.target.value;return {...f,sections:s};})}
                              style={{width:"100%",padding:"5px 8px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:11,outline:"none",fontFamily:"inherit"}}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{padding:"8px 12px",display:"flex",gap:8}}>
                    <button onClick={()=>setForm(f=>{const s=[...f.sections];const nq={no:s[si].questions.length+1,text:"",marks:10,unit:"Unit 1",co:"CO1",bt:"Understanding"};s[si].questions=[...s[si].questions,nq];return {...f,sections:s};})}
                      style={{padding:"5px 12px",background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>
                      + Add Question
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={()=>setForm(f=>({...f,sections:[...f.sections,{section:String.fromCharCode(65+f.sections.length),marks:20,questions:[{no:1,text:"",marks:10,unit:"Unit 1",co:"CO1",bt:"Understanding"}]}]}))}
                style={{padding:"7px 16px",background:"#f1f5f9",color:"#475569",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:14}}>
                + Add Section
              </button>
            </div>
          )}

          {/* Save button */}
          <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #f1f5f9",paddingTop:14}}>
            <div style={{fontSize:12,color:"#94a3b8"}}>
              {(form.mode||"online")==="upload"
                ? form.uploadedFile ? `📎 ${form.uploadedFile} ready to submit` : "No file uploaded yet"
                : `${form.sections.reduce((a,s)=>a+s.questions.length,0)} questions across ${form.sections.length} section(s)`}
            </div>
            <button onClick={()=>{
              const isUpload = (form.mode||"online")==="upload";
              const newPaper = {
                ...form,
                id:"QP00"+(papers.length+1),
                status:"Draft", submittedTo:null,
                uploadMode: isUpload,
                uploadedFile: isUpload ? form.uploadedFile : null,
                stages:[
                  {label:"Created",done:true,date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}),actor:"Dr. Priya Singh"},
                  {label:"Submitted to Coordinator",done:false,date:"—",actor:""},
                  {label:"Coordinator Approved",done:false,date:"—",actor:""},
                  {label:"Sent to Exam Section",done:false,date:"—",actor:""},
                  {label:"Approved to Print",done:false,date:"—",actor:""},
                ],
                attachments: isUpload && form.uploadedFile ? [form.uploadedFile] : [],
                remarks:[],
              };
              setPapers(p=>[...p,newPaper]);
              setForm({subject:"",type:"Application",priority:"Normal",to:"HOD",desc:"",attachment:"",mode:"online",
                sections:[{section:"A",marks:20,questions:[{no:1,text:"",marks:10,unit:"Unit 1",co:"CO1",bt:"Understanding"}]}],
                totalMarks:80,duration:"3 Hours",semester:"5",name:"",uploadedFile:"",uploadedSize:"",filePassword:""});
              setTab("my");
            }} style={{padding:"9px 24px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
              💾 Save as Draft
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirmModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:14,padding:"24px",width:400,boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
            <div style={{fontWeight:700,fontSize:16,color:"#0f172a",marginBottom:8}}>Confirm Action</div>
            <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>
              Are you sure you want to proceed with: <strong style={{color:"#6366f1"}}>{confirmModal.stage}</strong>?
              <br/><span style={{fontSize:12,color:"#94a3b8",marginTop:4,display:"block"}}>This action will update the paper status and notify the next person in the workflow.</span>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={()=>setConfirmModal(null)} style={{padding:"8px 18px",background:"#f1f5f9",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,color:"#475569"}}>Cancel</button>
              <button onClick={()=>advanceStage(confirmModal.id)}
                style={{padding:"8px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
                Confirm & Send →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EvaluationView() {
  const items=[
    {student:"Riya Patel",subject:"DBMS",type:"Assignment",title:"ER Diagram",submitted:"Jun 8",maxMarks:20,status:"Pending"},
    {student:"Amit Kumar",subject:"DBMS",type:"Assignment",title:"ER Diagram",submitted:"Jun 7",maxMarks:20,status:"Graded",given:17},
    {student:"Priya Nair",subject:"FYP",type:"Mid Review",title:"Chapter 2",submitted:"Jun 5",maxMarks:50,status:"Pending"},
  ];
  return (
    <Widget title="Assignment / Project Evaluation">
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"#6366f1",color:"#fff"}}>
          {["Student","Subject","Type","Title","Submitted","Max","Status","Action"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((e,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
            <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{e.student}</td>
            <td style={{padding:"9px 10px",color:"#6366f1",fontWeight:700}}>{e.subject}</td>
            <td style={{padding:"9px 10px",color:"#555"}}>{e.type}</td>
            <td style={{padding:"9px 10px",color:"#333"}}>{e.title}</td>
            <td style={{padding:"9px 10px",color:"#888"}}>{e.submitted}</td>
            <td style={{padding:"9px 10px",textAlign:"center"}}>{e.maxMarks}</td>
            <td style={{padding:"9px 10px"}}>
              <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,background:e.status==="Graded"?"#e8f8f0":"#fff8e1",color:e.status==="Graded"?"#27ae60":"#f39c12"}}>{e.status}</span>
            </td>
            <td style={{padding:"9px 10px"}}>
              {e.status==="Pending"?<button style={{padding:"4px 12px",background:"#6366f1",color:"#fff",border:"none",borderRadius:2,cursor:"pointer",fontSize:11,fontWeight:600}}>Grade</button>
              :<span style={{fontWeight:700,color:"#27ae60"}}>{e.given}/{e.maxMarks}</span>}
            </td>
          </tr>
        ))}</tbody>
      </table>
    </Widget>
  );
}

// ─── Research Scholars ────────────────────────────────────────────────────────
function ResearchView() {
  const scholars=[
    {name:"Rohit Sharma",roll:"520CS2001",topic:"Data Imputation using Hybrid Clustering (SOHCI)",progress:65,stage:"Thesis Writing",next:"Submit Ch.4 by Jun 20",papers:2},
    {name:"Sneha Panda",roll:"520CS2003",topic:"Parkinson's Detection via EEG Neural Patterns",progress:40,stage:"Experimentation",next:"Complete dataset analysis",papers:1},
    {name:"Amit Das",roll:"520CS2007",topic:"Federated Learning for Healthcare Privacy",progress:20,stage:"Literature Survey",next:"Submit review draft",papers:0},
  ];
  return (
    <Widget title="Research Scholar Monitoring">
      {scholars.map((s,i)=>(
        <div key={i} style={{padding:"12px",border:"1px solid #eee",borderRadius:2,marginBottom:10,background:"#fafafa"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontWeight:700,fontSize:14,color:"#333"}}>{s.name}</span>
                <span style={{padding:"1px 7px",background:"#e8f0ff",color:"#6366f1",borderRadius:2,fontSize:11,fontWeight:700}}>{s.roll}</span>
                <span style={{padding:"1px 7px",background:"#f5f5f5",color:"#555",borderRadius:2,fontSize:11}}>{s.stage}</span>
              </div>
              <div style={{fontSize:12,color:"#555",marginBottom:8}}>📖 {s.topic}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:7,background:"#eee",borderRadius:3}}>
                  <div style={{width:s.progress+"%",height:"100%",background:"#6366f1",borderRadius:3}}/>
                </div>
                <span style={{fontWeight:700,color:"#6366f1",fontSize:13}}>{s.progress}%</span>
              </div>
              <div style={{fontSize:11,color:"#888",marginTop:4}}>Next: {s.next} · Papers: {s.papers}</div>
            </div>
            <div style={{display:"flex",gap:6,marginLeft:12}}>
              <button style={{padding:"5px 12px",background:"#6366f1",color:"#fff",border:"none",borderRadius:2,cursor:"pointer",fontSize:11,fontWeight:600}}>✉ Mail</button>
              <button style={{padding:"5px 12px",background:"#fff",color:"#333",border:"1px solid #ddd",borderRadius:2,cursor:"pointer",fontSize:11}}>View</button>
            </div>
          </div>
        </div>
      ))}
    </Widget>
  );
}

// ─── Duty View ────────────────────────────────────────────────────────────────
// ─── FILE TRACKING SYSTEM ─────────────────────────────────────────────────────
function FileTrackingSystem({ user }) {
  const [tab, setTab] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selFile, setSelFile] = useState(null);
  const [forwardModal, setForwardModal] = useState(null);
  const [composeDone, setComposeDone] = useState(false);
  const [form, setForm] = useState({ subject:"", type:"Application", priority:"Normal", to:"HOD", desc:"", attachment:"" });

  const officers = [
    "HOD — CSE","Dean Academic","Dean Research","Director / Principal",
    "Registrar","Finance Officer","Exam Controller","Lab In-charge",
    "Dean Students","Administrative Officer",
  ];

  const [files, setFiles] = useState([
    {
      id:"FTS/ITER/2026/0041", subject:"Request for Lab Equipment Purchase — EEG Headset",
      type:"Purchase Request", priority:"High", from:"Dr. Priya Singh", dept:"CSE",
      date:"Jun 10", status:"In Progress",
      currentDesk:"Dean Research",
      trail:[
        {from:"Dr. Priya Singh",to:"HOD — CSE",action:"Initiated",date:"Jun 10, 9:00 AM",remark:"Please approve and forward.",done:true},
        {from:"HOD — CSE",to:"Dean Research",action:"Forwarded",date:"Jun 10, 2:30 PM",remark:"Recommended for approval. Budget available.",done:true},
        {from:"Dean Research",to:"Finance Officer",action:"Pending",date:"—",remark:"",done:false},
        {from:"Finance Officer",to:"Director",action:"Pending",date:"—",remark:"",done:false},
      ],
      attachments:["LabEquipmentQuotation.pdf","BudgetEstimate.xlsx"],
      inbox:false, sent:true,
    },
    {
      id:"FTS/ITER/2026/0039", subject:"Leave Application — Academic Conference ICML 2026",
      type:"Leave Application", priority:"Normal", from:"Admin Office",dept:"Admin",
      date:"Jun 8", status:"Pending Action",
      currentDesk:"Dr. Priya Singh",
      trail:[
        {from:"Dr. Priya Singh",to:"HOD — CSE",action:"Initiated",date:"Jun 7, 11:00 AM",remark:"Requesting 3 days leave for ICML.",done:true},
        {from:"HOD — CSE",to:"Dean Academic",action:"Forwarded",date:"Jun 8, 10:00 AM",remark:"Approved at department level.",done:true},
        {from:"Dean Academic",to:"Dr. Priya Singh",action:"Returned for Info",date:"Jun 8, 3:00 PM",remark:"Please attach acceptance letter from conference.",done:true},
      ],
      attachments:["LeaveForm.pdf"],
      inbox:true, sent:true,
    },
    {
      id:"FTS/ITER/2026/0035", subject:"Research Grant Application — SERB CRG 2026",
      type:"Research Application", priority:"Urgent", from:"Research Cell",dept:"Research",
      date:"Jun 5", status:"Closed",
      currentDesk:"Registrar",
      trail:[
        {from:"Dr. Priya Singh",to:"HOD — CSE",action:"Initiated",date:"Jun 3, 9:00 AM",remark:"SERB CRG grant application.",done:true},
        {from:"HOD — CSE",to:"Dean Research",action:"Forwarded",date:"Jun 4, 11:00 AM",remark:"Strongly recommended.",done:true},
        {from:"Dean Research",to:"Registrar",action:"Forwarded",date:"Jun 4, 4:00 PM",remark:"Approved at institute level.",done:true},
        {from:"Registrar",to:"SERB Portal",action:"Submitted",date:"Jun 5, 2:00 PM",remark:"Application submitted online. Reference: SERB/CRG/2026/1234",done:true},
      ],
      attachments:["GrantProposal.pdf","CV.pdf","Certificates.pdf"],
      inbox:false, sent:true,
    },
    {
      id:"FTS/ITER/2026/0044", subject:"Approval for Student Project Funding — Group 13",
      type:"Project Funding", priority:"Normal", from:"Exam Section",dept:"Academic",
      date:"Jun 12", status:"Pending Action",
      currentDesk:"Dr. Priya Singh",
      trail:[
        {from:"Project Coordinator",to:"Dr. Priya Singh",action:"Received",date:"Jun 12, 10:00 AM",remark:"Please verify student project details and forward.",done:true},
      ],
      attachments:["ProjectProposal.pdf"],
      inbox:true, sent:false,
    },
  ]);

  const priorityColor = p => ({High:"#f59e0b",Urgent:"#ef4444",Normal:"#6366f1",Low:"#10b981"}[p]||"#6366f1");
  const statusColor  = s => ({
    "In Progress":{bg:"#fef9c3",c:"#ca8a04"},
    "Pending Action":{bg:"#fee2e2",c:"#dc2626"},
    "Closed":{bg:"#dcfce7",c:"#16a34a"},
    "Draft":{bg:"#f1f5f9",c:"#64748b"},
  }[s]||{bg:"#f1f5f9",c:"#64748b"});

  const displayFiles = files.filter(f => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || f.subject.toLowerCase().includes(q) || f.id.toLowerCase().includes(q) || f.type.toLowerCase().includes(q);
    if(tab==="inbox") return f.inbox && matchQ;
    if(tab==="sent")  return f.sent  && matchQ;
    if(tab==="all")   return matchQ;
    return matchQ;
  });

  const handleForward = (fileId, to, remark) => {
    setFiles(prev=>prev.map(f=>{
      if(f.id!==fileId) return f;
      const newTrail = [...f.trail, {
        from:"Dr. Priya Singh", to, action:"Forwarded",
        date:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),
        remark, done:true,
      }];
      return {...f, trail:newTrail, currentDesk:to, status:"In Progress", inbox:false};
    }));
    setForwardModal(null);
    setSelFile(null);
  };

  const handleCompose = () => {
    if(!form.subject.trim()) return;
    const newFile = {
      id:"FTS/ITER/2026/00"+(50+files.length),
      subject:form.subject, type:form.type, priority:form.priority,
      from:"Dr. Priya Singh", dept:"CSE",
      date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
      status:"In Progress", currentDesk:form.to,
      trail:[{
        from:"Dr. Priya Singh", to:form.to, action:"Initiated",
        date:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),
        remark:form.desc, done:true,
      }],
      attachments: form.attachment ? [form.attachment] : [],
      inbox:false, sent:true,
    };
    setFiles(p=>[newFile,...p]);
    setComposeDone(true);
    setTimeout(()=>{ setComposeDone(false); setShowCompose(false); setForm({subject:"",type:"Application",priority:"Normal",to:"HOD — CSE",desc:"",attachment:""}); },2000);
  };

  const stats = [
    {label:"Total Files",value:files.length,color:"#6366f1"},
    {label:"Pending Action",value:files.filter(f=>f.status==="Pending Action").length,color:"#ef4444"},
    {label:"In Progress",value:files.filter(f=>f.status==="In Progress").length,color:"#f59e0b"},
    {label:"Closed",value:files.filter(f=>f.status==="Closed").length,color:"#10b981"},
  ];

  if(selFile) return (
    <div>
      <button onClick={()=>setSelFile(null)} style={{marginBottom:12,padding:"7px 16px",background:"#f1f5f9",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:"#475569"}}>← Back to Files</button>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        {/* File header */}
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"16px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,marginBottom:2}}>{selFile.id}</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:16}}>{selFile.subject}</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginTop:3}}>
                {selFile.type} · {selFile.date} · Current Desk: <strong>{selFile.currentDesk}</strong>
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0,marginLeft:12}}>
              <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,
                background:priorityColor(selFile.priority)+"30",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}}>
                {selFile.priority}
              </span>
              <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.2)",color:"#fff"}}>{selFile.status}</span>
            </div>
          </div>
        </div>

        {/* File movement timeline */}
        <div style={{padding:"20px 20px 10px"}}>
          <div style={{fontWeight:700,fontSize:13,color:"#0f172a",marginBottom:14}}>📋 File Movement Trail</div>
          <div style={{position:"relative",paddingLeft:28}}>
            <div style={{position:"absolute",left:10,top:0,bottom:0,width:2,background:"#e2e8f0",borderRadius:1}}/>
            {selFile.trail.map((t,i)=>(
              <div key={i} style={{position:"relative",marginBottom:16}}>
                <div style={{position:"absolute",left:-18,top:3,width:14,height:14,borderRadius:"50%",
                  background:t.done?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
                  border:t.done?"none":"2px solid #cbd5e1",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {t.done&&<span style={{color:"#fff",fontSize:8,fontWeight:900}}>✓</span>}
                </div>
                <div style={{background:t.done?"#fafbff":"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>
                      <span style={{color:"#6366f1"}}>{t.from}</span>
                      <span style={{color:"#94a3b8",margin:"0 6px"}}>→</span>
                      <span style={{color:"#334155"}}>{t.to}</span>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:11,padding:"1px 8px",borderRadius:20,
                        background:t.action==="Forwarded"?"#eef2ff":t.action==="Initiated"?"#dcfce7":t.action==="Returned for Info"?"#fef9c3":"#f1f5f9",
                        color:t.action==="Forwarded"?"#6366f1":t.action==="Initiated"?"#16a34a":t.action==="Returned for Info"?"#ca8a04":"#64748b",
                        fontWeight:700}}>{t.action}</span>
                      <span style={{fontSize:11,color:"#94a3b8"}}>{t.date}</span>
                    </div>
                  </div>
                  {t.remark&&<div style={{fontSize:12,color:"#64748b",fontStyle:"italic"}}>"{t.remark}"</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments */}
        {selFile.attachments.length>0&&(
          <div style={{padding:"0 20px 14px"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#0f172a",marginBottom:8}}>📎 Attachments</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {selFile.attachments.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,cursor:"pointer"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";}}>
                  <span style={{fontSize:16}}>📄</span>
                  <span style={{fontSize:12,color:"#334155",fontWeight:500}}>{a}</span>
                  <span style={{fontSize:11,color:"#6366f1",fontWeight:600}}>↓</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {selFile.status!=="Closed"&&(
          <div style={{padding:"12px 20px",borderTop:"1px solid #f1f5f9",display:"flex",gap:10,background:"#fafbff"}}>
            <button onClick={()=>setForwardModal(selFile)}
              style={{padding:"9px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
              ↗ Forward File
            </button>
            <button onClick={()=>{setFiles(p=>p.map(f=>f.id===selFile.id?{...f,status:"Closed"}:f));setSelFile(null);}}
              style={{padding:"9px 20px",background:"#f1f5f9",color:"#475569",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
              ✅ Close File
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {stats.map(s=>(
          <div key={s.label} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px",borderTop:`4px solid ${s.color}`,textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:s.color}}>{s.value}</div>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar + search + compose */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3}}>
          {[["inbox","📥 Inbox"],["sent","📤 Sent"],["all","🗂 All Files"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:"7px 14px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
                background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>
              {l}
              {t==="inbox"&&files.filter(f=>f.inbox&&f.status==="Pending Action").length>0&&
                <span style={{background:"#ef4444",color:"#fff",borderRadius:20,fontSize:10,padding:"1px 6px",marginLeft:4}}>
                  {files.filter(f=>f.inbox&&f.status==="Pending Action").length}
                </span>}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
            placeholder="Search by subject, ID, type..."
            style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",width:220,fontFamily:"inherit"}}/>
          <button onClick={()=>setShowCompose(true)}
            style={{padding:"8px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>
            + New File
          </button>
        </div>
      </div>

      {/* File list */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {displayFiles.length===0&&(
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"40px 0",textAlign:"center",color:"#94a3b8",fontSize:14}}>No files found</div>
        )}
        {displayFiles.map(f=>{
          const sc = statusColor(f.status);
          const pc = priorityColor(f.priority);
          const doneSteps = f.trail.filter(t=>t.done).length;
          const pct = Math.round(doneSteps/f.trail.length*100);
          return (
            <div key={f.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"box-shadow .15s"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(99,102,241,0.12)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
              onClick={()=>setSelFile(f)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1,paddingRight:12}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#94a3b8"}}>{f.id}</span>
                    <span style={{fontSize:11,padding:"1px 8px",borderRadius:20,background:pc+"15",color:pc,fontWeight:700}}>{f.priority}</span>
                    <span style={{fontSize:11,padding:"1px 8px",borderRadius:20,background:"#f1f5f9",color:"#64748b",fontWeight:600}}>{f.type}</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:3}}>{f.subject}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>
                    From: <span style={{fontWeight:600,color:"#334155"}}>{f.from}</span>
                    &nbsp;·&nbsp; Date: {f.date}
                    &nbsp;·&nbsp; At: <span style={{fontWeight:600,color:"#6366f1"}}>{f.currentDesk}</span>
                  </div>
                </div>
                <div style={{flexShrink:0,textAlign:"right"}}>
                  <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,background:sc.bg,color:sc.c,display:"block",marginBottom:6}}>{f.status}</span>
                  <span style={{fontSize:11,color:"#94a3b8"}}>{doneSteps}/{f.trail.length} steps</span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <div style={{flex:1,height:4,background:"#f1f5f9",borderRadius:2}}>
                  <div style={{width:pct+"%",height:"100%",background:f.status==="Closed"?"#10b981":"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:2}}/>
                </div>
                <span style={{fontSize:10,color:"#94a3b8",width:30,textAlign:"right"}}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forward Modal */}
      {forwardModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setForwardModal(null)}>
          <div style={{background:"#fff",borderRadius:14,width:480,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>↗ Forward File</div>
              <button onClick={()=>setForwardModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:26,height:26,cursor:"pointer"}}>✕</button>
            </div>
            <ForwardForm officers={officers} onForward={(to,remark)=>handleForward(forwardModal.id,to,remark)} onCancel={()=>setForwardModal(null)}/>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showCompose&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowCompose(false)}>
          <div style={{background:"#fff",borderRadius:14,width:520,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:1}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>📄 Initiate New File</div>
              <button onClick={()=>setShowCompose(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:26,height:26,cursor:"pointer"}}>✕</button>
            </div>
            {composeDone?(
              <div style={{padding:"40px 24px",textAlign:"center"}}>
                <div style={{fontSize:48}}>✅</div>
                <div style={{fontWeight:700,fontSize:16,marginTop:10,color:"#0f172a"}}>File Initiated Successfully!</div>
                <div style={{fontSize:13,color:"#64748b",marginTop:4}}>File number assigned and sent to {form.to}</div>
              </div>
            ):(
              <div style={{padding:"18px 20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  {[["File Type","type",["Application","Request","Circular","Note","Order","Report","Proposal"]],
                    ["Send To","to",officers],
                    ["Priority","priority",["Normal","High","Urgent","Low"]]].map(([l,k,opts])=>(
                    <div key={k} style={k==="to"?{gridColumn:"1/-1"}:{}}>
                      <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                      <select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                        style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>SUBJECT</label>
                  <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Enter file subject..."
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>DESCRIPTION / NOTE</label>
                  <textarea rows={3} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Add a note or description..."
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>ATTACHMENT (filename)</label>
                  <input value={form.attachment} onChange={e=>setForm(f=>({...f,attachment:e.target.value}))} placeholder="e.g. QuotationLetter.pdf"
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
                  <button onClick={()=>setShowCompose(false)} style={{padding:"9px 18px",background:"#f1f5f9",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,color:"#475569"}}>Cancel</button>
                  <button onClick={handleCompose} disabled={!form.subject.trim()}
                    style={{padding:"9px 22px",background:form.subject.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#c7d2fe",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:form.subject.trim()?"pointer":"not-allowed",fontSize:13}}>
                    Initiate & Send →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ForwardForm({ officers, onForward, onCancel }) {
  const [to, setTo] = useState(officers[0]);
  const [remark, setRemark] = useState("");
  return (
    <div style={{padding:"18px 20px"}}>
      <div style={{marginBottom:12}}>
        <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>FORWARD TO</label>
        <select value={to} onChange={e=>setTo(e.target.value)}
          style={{width:"100%",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
          {officers.map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>REMARK (optional)</label>
        <textarea rows={3} value={remark} onChange={e=>setRemark(e.target.value)} placeholder="Add a forwarding remark..."
          style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
        <button onClick={onCancel} style={{padding:"9px 18px",background:"#f1f5f9",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,color:"#475569"}}>Cancel</button>
        <button onClick={()=>onForward(to,remark)}
          style={{padding:"9px 22px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
          Forward →
        </button>
      </div>
    </div>
  );
}

// ─── SERVICES HUB ─────────────────────────────────────────────────────────────
function ServicesHub({ setActive }) {
  const services = [
    { key:"appraisal",    icon:"⭐", label:"Appraisal & Assessment",      desc:"Self-appraisal, performance scores, KPI submission" },
    { key:"auditorium",   icon:"🎭", label:"Auditorium / LA Booking",     desc:"Book halls, labs, seminar rooms" },
    { key:"crf",          icon:"🔬", label:"Central Research Facility",   desc:"Equipment booking, CRF usage requests" },
    { key:"guesthouse",   icon:"🏨", label:"Guest House",                 desc:"Book guest house rooms for visitors" },
    { key:"fts",          icon:"📁", label:"File Tracking System",        desc:"Track & forward official files" },
    { key:"health",       icon:"🏥", label:"Health Centre",               desc:"Appointments, medical records" },
    { key:"purchase",     icon:"🛒", label:"Purchase & Store Section",    desc:"Indent, purchase requests, store items" },
    { key:"sricce",       icon:"🤝", label:"SRICCE",                      desc:"Industry collaboration, MoU, consultancy" },
    { key:"internship",   icon:"🎓", label:"Summer Internship",           desc:"Manage student internship approvals" },
    { key:"swimmingpool", icon:"🏊", label:"Swimming Pool",               desc:"Slot booking, membership management" },
    { key:"vehicle",      icon:"🚗", label:"Vehicle Requisition",         desc:"Request college vehicle for official duty" },
    { key:"complaint",    icon:"🔧", label:"Complaint Management",        desc:"Raise & track infrastructure complaints" },
    { key:"bestaward",    icon:"🏆", label:"Best Performance Award",      desc:"Nominations and award status" },
    { key:"bogelection",  icon:"🗳️", label:"BOG Member Election",        desc:"Board of Governors election portal" },
    { key:"clubbooking",  icon:"🏢", label:"Club Booking",                desc:"Book faculty club facilities" },
    { key:"sac",          icon:"🎯", label:"Student Activity Centre",     desc:"SAC event approvals and scheduling" },
    { key:"groupemail",   icon:"✉️", label:"Group Email",                 desc:"Send bulk emails to dept/batch/all" },
  ];
  return (
    <div>
      <div style={{fontWeight:700,fontSize:16,color:"#0f172a",marginBottom:4}}>Services</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>Quick access to all institute services</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {services.map(s=>(
          <div key={s.key} onClick={()=>setActive(s.key)}
            style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.boxShadow="0 4px 16px rgba(99,102,241,0.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:26,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{s.label}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APPRAISAL & ASSESSMENT ───────────────────────────────────────────────────
function AppraisalView() {
  const [tab, setTab] = useState("self");
  const [saved, setSaved] = useState(false);
  const [scores, setScores] = useState({teaching:4,research:3,admin:3,extension:3,professional:4});
  const criteria = [
    {key:"teaching",   label:"Teaching & Learning",   max:5, desc:"Lectures, labs, student feedback score"},
    {key:"research",   label:"Research & Publications",max:5, desc:"Papers, patents, grants, citations"},
    {key:"admin",      label:"Administrative Duties",  max:5, desc:"Committee work, HOD duties, mentoring"},
    {key:"extension",  label:"Extension Activities",   max:5, desc:"Outreach, workshops, FDPs conducted"},
    {key:"professional",label:"Professional Development",max:5,desc:"Certifications, conferences, MOOC"},
  ];
  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  const maxTotal = criteria.length*5;
  const pct = Math.round(total/maxTotal*100);
  const prevYear = [{year:"2024-25",total:18,grade:"Good"},{year:"2023-24",total:21,grade:"Very Good"},{year:"2022-23",total:17,grade:"Good"}];
  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["self","📝 Self Appraisal"],["history","📊 History"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>
      {tab==="self"&&(
        <div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div><div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>Self Appraisal — 2025-26</div><div style={{fontSize:12,color:"#64748b"}}>Rate yourself 1–5 on each criterion</div></div>
              <div style={{textAlign:"center",background:"#eef2ff",borderRadius:10,padding:"10px 16px"}}>
                <div style={{fontSize:26,fontWeight:900,color:"#6366f1"}}>{total}/{maxTotal}</div>
                <div style={{fontSize:11,color:"#6366f1",fontWeight:600}}>{pct}% Score</div>
              </div>
            </div>
            {criteria.map(c=>(
              <div key={c.key} style={{marginBottom:14,padding:"12px 14px",background:"#fafbff",borderRadius:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div><div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{c.label}</div><div style={{fontSize:11,color:"#94a3b8"}}>{c.desc}</div></div>
                  <span style={{fontWeight:800,fontSize:16,color:"#6366f1"}}>{scores[c.key]}/5</span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setScores(s=>({...s,[c.key]:n}))}
                      style={{flex:1,padding:"8px 0",border:`2px solid ${scores[c.key]>=n?"#6366f1":"#e2e8f0"}`,borderRadius:7,cursor:"pointer",
                        background:scores[c.key]>=n?"#6366f1":"#fff",color:scores[c.key]>=n?"#fff":"#94a3b8",fontWeight:700,fontSize:12}}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {saved&&<div style={{background:"#dcfce7",borderRadius:8,padding:"8px 14px",fontSize:12,color:"#16a34a",fontWeight:600,marginBottom:10}}>✅ Appraisal saved and submitted to HOD!</div>}
            <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}} style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Submit Appraisal to HOD</button>
          </div>
        </div>
      )}
      {tab==="history"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc"}}>{["Year","Score","Max","Grade","Status"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
            <tbody>{prevYear.map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                <td style={{padding:"11px 14px",fontWeight:600,color:"#334155"}}>{r.year}</td>
                <td style={{padding:"11px 14px",fontWeight:700,color:"#6366f1"}}>{r.total}</td>
                <td style={{padding:"11px 14px",color:"#64748b"}}>{maxTotal}</td>
                <td style={{padding:"11px 14px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:r.grade==="Very Good"?"#dcfce7":"#fef9c3",color:r.grade==="Very Good"?"#16a34a":"#ca8a04"}}>{r.grade}</span></td>
                <td style={{padding:"11px 14px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#dcfce7",color:"#16a34a"}}>Accepted by HOD</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── AUDITORIUM / ROOM BOOKING ────────────────────────────────────────────────
function AuditoriumBooking() {
  const [selected, setSelected] = useState(null);
  const [booked, setBooked] = useState(false);
  const [date, setDate] = useState(""); const [slot, setSlot] = useState("9:00–11:00"); const [purpose, setPurpose] = useState("");
  const venues = [
    {id:"V1",name:"Main Auditorium",capacity:800,type:"Auditorium",features:["AC","Stage","Sound System","Projector"],bookings:["Jun 14","Jun 18"]},
    {id:"V2",name:"Seminar Hall A",capacity:200,type:"Seminar Hall",features:["AC","Projector","Whiteboard"],bookings:["Jun 13"]},
    {id:"V3",name:"Seminar Hall B",capacity:150,type:"Seminar Hall",features:["AC","Projector"],bookings:[]},
    {id:"V4",name:"Conference Room",capacity:40,type:"Meeting Room",features:["AC","TV Screen","VC Enabled"],bookings:["Jun 15","Jun 16"]},
    {id:"V5",name:"Open Air Theatre",capacity:500,type:"Outdoor",features:["Stage","Lighting"],bookings:[]},
    {id:"V6",name:"Language Lab",capacity:60,type:"Lab",features:["Computers","Headsets"],bookings:["Jun 12"]},
  ];
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {venues.map(v=>(
          <div key={v.id} onClick={()=>{setSelected(v);setBooked(false);}} style={{background:"#fff",border:`2px solid ${selected?.id===v.id?"#6366f1":"#e2e8f0"}`,borderRadius:12,padding:"14px",cursor:"pointer",transition:"all .15s"}}>
            <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:3}}>{v.name}</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>👥 {v.capacity} · {v.type}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{v.features.map(f=><span key={f} style={{fontSize:10,background:"#f1f5f9",color:"#475569",padding:"1px 6px",borderRadius:20}}>{f}</span>)}</div>
            {v.bookings.length>0&&<div style={{fontSize:10,color:"#f59e0b",fontWeight:600}}>⚠ Booked: {v.bookings.join(", ")}</div>}
          </div>
        ))}
      </div>
      {selected&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:12}}>Book — {selected.name}</div>
          {booked?<div style={{background:"#dcfce7",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#16a34a",fontWeight:600}}>✅ Booking request submitted for {date}, {slot}. Pending Admin approval.</div>:(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>DATE</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none"}}/></div>
              <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>TIME SLOT</label><select value={slot} onChange={e=>setSlot(e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>{["9:00–11:00","11:00–1:00","2:00–4:00","4:00–6:00","Full Day"].map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>PURPOSE</label><input value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder="Event purpose" style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
              <button onClick={()=>{if(date&&purpose)setBooked(true);}} style={{gridColumn:"1/-1",padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>Submit Booking Request</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── VEHICLE REQUISITION ──────────────────────────────────────────────────────
function VehicleRequisition() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({destination:"",date:"",time:"",passengers:"",purpose:"",vehicleType:"Mini Bus"});
  const myRequests = [
    {id:"VR001",dest:"NIT Rourkela",date:"Jun 5",time:"8:00 AM",vehicle:"Innova",status:"Completed"},
    {id:"VR002",dest:"Bhubaneswar Airport",date:"Jun 18",time:"6:00 AM",vehicle:"Sedan",status:"Approved"},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>🚗 Request Vehicle</div>
        {submitted?<div style={{background:"#dcfce7",borderRadius:8,padding:"12px",fontSize:13,color:"#16a34a",fontWeight:600}}>✅ Request submitted! Transport Office will confirm vehicle.</div>:(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[["Destination","destination","text"],["Date","date","date"],["Departure Time","time","time"],["No. of Passengers","passengers","number"],["Purpose","purpose","text"]].map(([l,k,t])=>(
              <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
              <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
            ))}
            <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>VEHICLE TYPE</label>
            <select value={form.vehicleType} onChange={e=>setForm(f=>({...f,vehicleType:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
              {["Sedan","Innova","Mini Bus","Bus","Auto"].map(v=><option key={v}>{v}</option>)}</select></div>
            <button onClick={()=>{if(form.destination&&form.date)setSubmitted(true);}} style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14,marginTop:4}}>Submit Request</button>
          </div>
        )}
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>My Requisitions</div>
        {myRequests.map((r,i)=>(
          <div key={r.id} style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{r.dest}</div><div style={{fontSize:12,color:"#64748b"}}>{r.date} · {r.time} · {r.vehicle}</div></div>
              <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:r.status==="Completed"?"#f1f5f9":r.status==="Approved"?"#dcfce7":"#fef9c3",color:r.status==="Completed"?"#64748b":r.status==="Approved"?"#16a34a":"#ca8a04"}}>{r.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPLAINT MANAGEMENT ─────────────────────────────────────────────────────
function ComplaintManagement() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({category:"Electrical",location:"",subject:"",desc:""});
  const [complaints, setComplaints] = useState([
    {id:"CMP001",category:"Electrical",subject:"Short circuit in Faculty Block B Room 214",date:"Jun 8",status:"Resolved",location:"Faculty Block B",assignedTo:"Electrical Dept"},
    {id:"CMP002",category:"Civil",subject:"Water leakage in corridor near Lab 3",date:"Jun 10",status:"In Progress",location:"Lab Block",assignedTo:"Civil Dept"},
    {id:"CMP003",category:"IT",subject:"Network port not working in LH-101",date:"Jun 11",status:"Pending",location:"LH-101",assignedTo:"IT Dept"},
  ]);
  const statusColor = s=>s==="Resolved"?{bg:"#dcfce7",c:"#16a34a"}:s==="In Progress"?{bg:"#fef9c3",c:"#ca8a04"}:{bg:"#fee2e2",c:"#dc2626"};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,flex:1,marginRight:14}}>
          {[["Total",complaints.length,"#6366f1"],["Resolved",complaints.filter(c=>c.status==="Resolved").length,"#10b981"],["Pending",complaints.filter(c=>c.status!=="Resolved").length,"#ef4444"]].map(([l,v,c])=>(
            <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px",textAlign:"center",borderTop:`3px solid ${c}`}}>
              <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:"#64748b",fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>setShowForm(true)} style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,whiteSpace:"nowrap"}}>+ New Complaint</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {complaints.map(c=>{const sc=statusColor(c.status);return(
          <div key={c.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}><span style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{c.subject}</span></div>
            <div style={{fontSize:12,color:"#64748b"}}>{c.category} · {c.location} · {c.date} · Assigned: {c.assignedTo}</div></div>
            <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,background:sc.bg,color:sc.c,flexShrink:0,marginLeft:10}}>{c.status}</span>
          </div>
        );})}
      </div>
      {showForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowForm(false)}>
          <div style={{background:"#fff",borderRadius:14,width:460,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:14}}>🔧 New Complaint</span>
              <button onClick={()=>setShowForm(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:24,height:24,cursor:"pointer"}}>✕</button>
            </div>
            {submitted?<div style={{padding:"32px",textAlign:"center"}}><div style={{fontSize:40}}>✅</div><div style={{fontWeight:700,marginTop:8}}>Complaint Registered!</div></div>:(
              <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:10}}>
                {[["Category","category","select",["Electrical","Civil","Plumbing","IT","Housekeeping","Other"]],["Location","location","text"],["Subject","subject","text"],["Description","desc","textarea"]].map(([l,k,t,opts])=>(
                  <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                  {t==="select"?<select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>
                  :t==="textarea"?<textarea rows={3} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/>
                  :<input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>}
                  </div>
                ))}
                <button onClick={()=>{if(form.subject){setComplaints(p=>[{id:"CMP00"+(p.length+1),category:form.category,subject:form.subject,date:"Jun 12",status:"Pending",location:form.location||"—",assignedTo:"Pending Assignment"},...p]);setSubmitted(true);setTimeout(()=>{setSubmitted(false);setShowForm(false);setForm({category:"Electrical",location:"",subject:"",desc:""});},2000);}}}
                  style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Submit Complaint</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GROUP EMAIL ──────────────────────────────────────────────────────────────
function GroupEmail() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({to:"All CSE Faculty",subject:"",body:"",attachment:""});
  const groups = ["All CSE Faculty","All Students — CSE 5A","All Students — CSE 5B","All Students — CSE 5C","All PhD Scholars — CSE","All HODs","All Department Faculty","All Students Sem 5","Administrative Staff"];
  const sentEmails = [
    {to:"All Students — CSE 5A",subject:"DBMS Assignment Deadline Extended",date:"Jun 10",recipients:52},
    {to:"All CSE Faculty",subject:"Department Meeting on Jun 14",date:"Jun 8",recipients:18},
    {to:"All PhD Scholars — CSE",subject:"Research Progress Submission Reminder",date:"Jun 5",recipients:12},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:14}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>✉️ Compose Group Email</div>
        {sent?<div style={{background:"#dcfce7",borderRadius:8,padding:"14px",textAlign:"center",fontSize:14,color:"#16a34a",fontWeight:700}}>✅ Email sent to {form.to}!</div>:(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>TO GROUP</label>
            <select value={form.to} onChange={e=>setForm(f=>({...f,to:e.target.value}))} style={{width:"100%",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>{groups.map(g=><option key={g}>{g}</option>)}</select></div>
            <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>SUBJECT</label>
            <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Email subject" style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
            <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>MESSAGE</label>
            <textarea rows={5} value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="Type your message..." style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/></div>
            <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>ATTACHMENT (filename, optional)</label>
            <input value={form.attachment} onChange={e=>setForm(f=>({...f,attachment:e.target.value}))} placeholder="e.g. Circular.pdf" style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
            <button onClick={()=>{if(form.subject&&form.body)setSent(true);}} style={{padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Send Email →</button>
          </div>
        )}
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>Sent History</div>
        {sentEmails.map((e,i)=>(
          <div key={i} style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9"}}>
            <div style={{fontWeight:600,fontSize:13,color:"#0f172a",marginBottom:2}}>{e.subject}</div>
            <div style={{fontSize:12,color:"#64748b"}}>To: {e.to}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{e.date} · {e.recipients} recipients</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BEST PERFORMANCE AWARD ───────────────────────────────────────────────────
function BestPerformanceAward() {
  const [tab, setTab] = useState("nominate");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({nominee:"",category:"Best Teacher Award",justification:""});
  const awards = [
    {name:"Best Teacher Award",desc:"Outstanding teaching and student feedback scores",deadline:"Jul 15, 2026"},
    {name:"Best Researcher Award",desc:"Top publications, citations, funded projects",deadline:"Jul 15, 2026"},
    {name:"Best Administrative Officer",desc:"Outstanding administrative contributions",deadline:"Jul 15, 2026"},
    {name:"Young Faculty Award",desc:"Faculty under 35 with exceptional performance",deadline:"Jul 15, 2026"},
  ];
  const myNominations = [
    {award:"Best Teacher Award",year:"2024-25",status:"Shortlisted"},
    {award:"Best Researcher Award",year:"2023-24",status:"Winner 🏆"},
  ];
  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["nominate","🏅 Nominate / Apply"],["history","📋 My History"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>
      {tab==="nominate"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div>
            {awards.map(a=>(
              <div key={a.name} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{a.name}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{a.desc}</div>
                <div style={{fontSize:11,color:"#f59e0b",marginTop:4,fontWeight:600}}>⏰ Deadline: {a.deadline}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px"}}>
            {submitted?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:40}}>🏅</div><div style={{fontWeight:700,marginTop:8}}>Nomination Submitted!</div></div>:(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:4}}>Submit Nomination</div>
                {[["Category","category","select",awards.map(a=>a.name)],["Nominee (self or colleague)","nominee","text"],["Justification","justification","textarea"]].map(([l,k,t,opts])=>(
                  <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                  {t==="select"?<select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>
                  :t==="textarea"?<textarea rows={4} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/>
                  :<input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>}
                  </div>
                ))}
                <button onClick={()=>{if(form.nominee&&form.justification)setSubmitted(true);}} style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>Submit Nomination</button>
              </div>
            )}
          </div>
        </div>
      )}
      {tab==="history"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc"}}>{["Award","Year","Status"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
            <tbody>{myNominations.map((n,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                <td style={{padding:"11px 14px",fontWeight:500,color:"#0f172a"}}>{n.award}</td>
                <td style={{padding:"11px 14px",color:"#64748b"}}>{n.year}</td>
                <td style={{padding:"11px 14px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:n.status.includes("Winner")?"#dcfce7":"#fef9c3",color:n.status.includes("Winner")?"#16a34a":"#ca8a04"}}>{n.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── HEALTH CENTRE ────────────────────────────────────────────────────────────
function HealthCentreView() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({date:"",time:"9:00 AM",type:"General Checkup",symptoms:""});
  const records = [
    {date:"May 20",type:"General Checkup",doctor:"Dr. S. Mohanty",prescription:"Paracetamol 500mg, Rest 2 days"},
    {date:"Apr 5",type:"Dental",doctor:"Dr. P. Das",prescription:"Filling done. Next visit: 6 months"},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>🏥 Book Appointment</div>
        {submitted?<div style={{background:"#dcfce7",borderRadius:8,padding:"12px",fontSize:13,color:"#16a34a",fontWeight:600}}>✅ Appointment booked for {form.date}, {form.time}!</div>:(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[["Appointment Date","date","date"],["Time","time","select",["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"]],["Type","type","select",["General Checkup","Dental","Eye","Blood Test","Physiotherapy"]],["Symptoms / Note","symptoms","textarea"]].map(([l,k,t,opts])=>(
              <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
              {t==="select"?<select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>
              :t==="textarea"?<textarea rows={3} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/>
              :<input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>}
              </div>
            ))}
            <button onClick={()=>{if(form.date)setSubmitted(true);}} style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Book Appointment</button>
          </div>
        )}
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>Medical History</div>
        {records.map((r,i)=>(
          <div key={i} style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9"}}>
            <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{r.type} — {r.date}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Dr. {r.doctor}</div>
            <div style={{fontSize:11,color:"#6366f1",marginTop:2}}>Rx: {r.prescription}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GUEST HOUSE ──────────────────────────────────────────────────────────────
function GuestHouseView() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({guestName:"",purpose:"",checkin:"",checkout:"",roomType:"Single AC"});
  const myBookings = [
    {guest:"Prof. A. Kumar, IIT Delhi",checkin:"Jun 14",checkout:"Jun 15",room:"Room 3 (Single AC)",status:"Confirmed"},
    {guest:"Dr. S. Patel, NIT Surat",checkin:"May 28",checkout:"May 30",room:"Room 7 (Double AC)",status:"Completed"},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>🏨 Book Guest House</div>
        {submitted?<div style={{background:"#dcfce7",borderRadius:8,padding:"12px",fontSize:13,color:"#16a34a",fontWeight:600}}>✅ Request submitted. Admin will confirm availability.</div>:(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[["Guest Name & Designation","guestName","text"],["Purpose of Visit","purpose","text"],["Check-in Date","checkin","date"],["Check-out Date","checkout","date"]].map(([l,k,t])=>(
              <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
              <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
            ))}
            <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>ROOM TYPE</label>
            <select value={form.roomType} onChange={e=>setForm(f=>({...f,roomType:e.target.value}))} style={{width:"100%",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
              {["Single AC","Double AC","Suite"].map(r=><option key={r}>{r}</option>)}</select></div>
            <button onClick={()=>{if(form.guestName&&form.checkin)setSubmitted(true);}} style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Submit Request</button>
          </div>
        )}
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>My Bookings</div>
        {myBookings.map((b,i)=>(
          <div key={i} style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9"}}>
            <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{b.guest}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{b.checkin} → {b.checkout} · {b.room}</div>
            <span style={{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:20,background:b.status==="Confirmed"?"#dcfce7":"#f1f5f9",color:b.status==="Confirmed"?"#16a34a":"#64748b"}}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PURCHASE & STORE ─────────────────────────────────────────────────────────
function PurchaseView() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({item:"",qty:"",estimatedCost:"",purpose:"",vendor:""});
  const myIndents = [
    {id:"IND001",item:"EEG Headset (Research)",qty:2,cost:"₹85,000",status:"Approved",date:"Jun 3"},
    {id:"IND002",item:"Whiteboard Markers (Box)",qty:5,cost:"₹750",status:"Completed",date:"May 20"},
    {id:"IND003",item:"Raspberry Pi 4 (Lab)",qty:10,cost:"₹35,000",status:"Pending",date:"Jun 10"},
  ];
  const statusColor = s=>s==="Approved"||s==="Completed"?{bg:"#dcfce7",c:"#16a34a"}:s==="Pending"?{bg:"#fef9c3",c:"#ca8a04"}:{bg:"#fee2e2",c:"#dc2626"};
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:14}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>🛒 New Purchase Indent</div>
        {submitted?<div style={{background:"#dcfce7",borderRadius:8,padding:"12px",fontSize:13,color:"#16a34a",fontWeight:600}}>✅ Indent submitted! HOD will review and forward to purchase section.</div>:(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[["Item Name","item","text"],["Quantity","qty","number"],["Estimated Cost (₹)","estimatedCost","text"],["Purpose / Justification","purpose","text"],["Preferred Vendor (optional)","vendor","text"]].map(([l,k,t])=>(
              <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
              <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
            ))}
            <button onClick={()=>{if(form.item&&form.qty)setSubmitted(true);}} style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Submit Indent</button>
          </div>
        )}
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>My Indents</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Item","Qty","Cost","Status"].map(h=><th key={h} style={{padding:"9px 10px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:11,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
          <tbody>{myIndents.map((r,i)=>{const sc=statusColor(r.status);return(
            <tr key={r.id} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
              <td style={{padding:"9px 10px",color:"#6366f1",fontWeight:700,fontSize:11}}>{r.id}</td>
              <td style={{padding:"9px 10px",color:"#334155",fontWeight:500,fontSize:12}}>{r.item}</td>
              <td style={{padding:"9px 10px",textAlign:"center",color:"#64748b"}}>{r.qty}</td>
              <td style={{padding:"9px 10px",color:"#334155",fontWeight:600}}>{r.cost}</td>
              <td style={{padding:"9px 10px"}}><span style={{padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700,background:sc.bg,color:sc.c}}>{r.status}</span></td>
            </tr>
          );})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SUMMER INTERNSHIP ────────────────────────────────────────────────────────
function InternshipView() {
  const students = [
    {roll:"22CS001",name:"Riya Patel",company:"TCS Innovation Lab",role:"ML Intern",period:"May–Jul 2026",status:"Ongoing",stipend:"₹15,000/mo"},
    {roll:"22CS005",name:"Amit Kumar",company:"Infosys",role:"Web Dev Intern",period:"May–Jun 2026",status:"Completed",stipend:"₹12,000/mo"},
    {roll:"22CS012",name:"Priya Nair",company:"DRDO",role:"Research Intern",period:"Jun–Aug 2026",status:"Approved",stipend:"₹10,000/mo"},
  ];
  const statusColor = s=>s==="Ongoing"?{bg:"#dcfce7",c:"#16a34a"}:s==="Approved"?{bg:"#eef2ff",c:"#6366f1"}:s==="Completed"?{bg:"#f1f5f9",c:"#64748b"}:{bg:"#fef9c3",c:"#ca8a04"};
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {[["Ongoing",students.filter(s=>s.status==="Ongoing").length,"#10b981"],["Approved",students.filter(s=>s.status==="Approved").length,"#6366f1"],["Completed",students.filter(s=>s.status==="Completed").length,"#64748b"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px",textAlign:"center",borderTop:`3px solid ${c}`}}>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>Student Internships — My Supervised Students</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#f8fafc"}}>{["Roll","Student","Company","Role","Period","Stipend","Status"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
          <tbody>{students.map((s,i)=>{const sc=statusColor(s.status);return(
            <tr key={s.roll} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
              <td style={{padding:"10px 12px",color:"#6366f1",fontWeight:700}}>{s.roll}</td>
              <td style={{padding:"10px 12px",fontWeight:600,color:"#0f172a"}}>{s.name}</td>
              <td style={{padding:"10px 12px",color:"#334155"}}>{s.company}</td>
              <td style={{padding:"10px 12px",color:"#64748b"}}>{s.role}</td>
              <td style={{padding:"10px 12px",color:"#64748b",fontSize:12}}>{s.period}</td>
              <td style={{padding:"10px 12px",fontWeight:600,color:"#334155"}}>{s.stipend}</td>
              <td style={{padding:"10px 12px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:sc.bg,color:sc.c}}>{s.status}</span></td>
            </tr>
          );})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SRICCE ───────────────────────────────────────────────────────────────────
function SRICCEView() {
  const activities = [
    {type:"MoU",title:"MoU with TCS for Research Collaboration",date:"Mar 2025",status:"Active",partner:"TCS"},
    {type:"Consultancy",title:"ML Model for Odisha Police Crime Analysis",date:"Jan 2025",status:"Ongoing",partner:"Odisha Police"},
    {type:"Funded Project",title:"SERB CRG — Hybrid Imputation (₹18L)",date:"Apr 2024",status:"Active",partner:"SERB, DST"},
  ];
  return (
    <div>
      <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#4338ca"}}>
        🤝 SRICCE — Sponsored Research, Industrial Consultancy & Continuing Education
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {activities.map((a,i)=>(
          <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#eef2ff",color:"#6366f1"}}>{a.type}</span>
                <span style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{a.title}</span>
              </div>
              <div style={{fontSize:12,color:"#64748b"}}>Partner: {a.partner} · {a.date}</div>
            </div>
            <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,background:"#dcfce7",color:"#16a34a",flexShrink:0,marginLeft:10}}>{a.status}</span>
          </div>
        ))}
        <button style={{padding:"10px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,alignSelf:"flex-start"}}>+ Register New Activity</button>
      </div>
    </div>
  );
}

function DutyView() {
  const duties=[
    {date:"Jun 18",time:"9:00 AM",type:"Invigilation",room:"201-A",exam:"DBMS — CS301",status:"Upcoming"},
    {date:"Jun 20",time:"9:00 AM",type:"Invigilation",room:"202-B",exam:"OS — CS302",status:"Upcoming"},
    {date:"Jun 5",time:"10:00 AM",type:"Paper Setting",room:"Faculty Room",exam:"Internal Exam I",status:"Completed"},
  ];
  return (
    <Widget title="Exam and Other Duty Management">
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"#6366f1",color:"#fff"}}>
          {["Date","Time","Duty Type","Venue","Exam","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>)}
        </tr></thead>
        <tbody>{duties.map((d,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
            <td style={{padding:"9px 10px",fontWeight:700,color:"#6366f1"}}>{d.date}</td>
            <td style={{padding:"9px 10px",color:"#555"}}>{d.time}</td>
            <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{d.type}</td>
            <td style={{padding:"9px 10px",color:"#555"}}>{d.room}</td>
            <td style={{padding:"9px 10px",color:"#333"}}>{d.exam}</td>
            <td style={{padding:"9px 10px"}}>
              <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,background:d.status==="Completed"?"#e8f8f0":"#fff8e1",color:d.status==="Completed"?"#27ae60":"#f39c12"}}>{d.status}</span>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </Widget>
  );
}

// ─── Lab View ─────────────────────────────────────────────────────────────────
function LabView() {
  const sessions=[
    {no:1,topic:"ER Diagram & Schema Mapping",date:"May 6",status:"Done",submitted:46},
    {no:2,topic:"DDL & DML Queries in MySQL",date:"May 13",status:"Done",submitted:44},
    {no:3,topic:"Joins & Sub-queries",date:"May 20",status:"Done",submitted:48},
    {no:4,topic:"Stored Procedures",date:"Jun 3",status:"Done",submitted:40},
    {no:5,topic:"Triggers & Transactions",date:"Jun 10",status:"Upcoming",submitted:"—"},
    {no:6,topic:"Mini Project Viva",date:"Jun 17",status:"Upcoming",submitted:"—"},
  ];
  return (
    <Widget title="Laboratory Class Management — DBMS Lab (CS301L)">
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"#6366f1",color:"#fff"}}>
          {["#","Topic","Date","Files Submitted","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>)}
        </tr></thead>
        <tbody>{sessions.map((s,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
            <td style={{padding:"9px 10px",color:"#6366f1",fontWeight:700}}>{s.no}</td>
            <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{s.topic}</td>
            <td style={{padding:"9px 10px",color:"#555"}}>{s.date}</td>
            <td style={{padding:"9px 10px",textAlign:"center",color:"#333"}}>{s.submitted}{s.submitted!=="—"?"/48":""}</td>
            <td style={{padding:"9px 10px"}}>
              <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,background:s.status==="Done"?"#e8f8f0":"#e8f0ff",color:s.status==="Done"?"#27ae60":"#6366f1"}}>{s.status}</span>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </Widget>
  );
}

// ─── Notices ──────────────────────────────────────────────────────────────────
// ─── FACULTY PROFILE & PUBLICATIONS ──────────────────────────────────────────
function FacultyProfile({ user }) {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name, designation: user.designation, dept: user.dept,
    email: "priya.singh@iter.ac.in", phone: "+91 98765 43210",
    cabin: "Faculty Block B, Room 214", specialization: "Database Systems, Machine Learning",
    qualification: "Ph.D (CSE), NIT Rourkela | M.Tech (CSE), IIT Bhubaneswar",
    experience: "8 years", joined: "Aug 2017", orcid: "0000-0002-1234-5678",
    scopus: "57205234891", googlescholar: "abc123XYZ",
  });
  const [publications, setPublications] = useState([
    { id:"P1", title:"Hybrid Clustering for Data Imputation in Healthcare", journal:"Expert Systems with Applications", year:2024, type:"Journal", citations:12, doi:"10.1016/j.eswa.2024.123", status:"Published", q:"Q1", if:"8.5" },
    { id:"P2", title:"EEG-Based Cognitive Load Detection using Deep Learning", journal:"IEEE Transactions on Neural Systems", year:2023, type:"Journal", citations:8, doi:"10.1109/TNSRE.2023.456", status:"Published", q:"Q1", if:"4.9" },
    { id:"P3", title:"Federated Learning for Privacy-Preserving Medical Data", journal:"ICML 2024 Workshop", year:2024, type:"Conference", citations:3, doi:"10.1145/3580305.3599234", status:"Published", q:"A*", if:"—" },
    { id:"P4", title:"Adaptive Parameter Tuning in Imputation Models", journal:"Knowledge-Based Systems", year:2025, type:"Journal", citations:0, doi:"—", status:"Under Review", q:"Q1", if:"8.8" },
  ]);
  const [patents, setPatents] = useState([
    { id:"PT1", title:"System and Method for Real-time EEG Signal Processing", number:"202131045678", office:"Indian Patent Office", filed:"Mar 2021", status:"Granted", year:2023 },
    { id:"PT2", title:"Hybrid Data Imputation Framework for Medical Records", number:"202231067890", office:"Indian Patent Office", filed:"Jun 2022", status:"Published", year:2023 },
  ]);
  const [showAddPub, setShowAddPub] = useState(false);
  const [newPub, setNewPub] = useState({ title:"", journal:"", year:new Date().getFullYear(), type:"Journal", doi:"", status:"Published", q:"Q1", if:"" });

  const totalCitations = publications.reduce((a,p)=>a+p.citations,0);
  const hIndex = 2; // mock

  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["profile","👤 Profile"],["publications","📄 Publications"],["patents","💡 Patents & Grants"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
              background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>

      {tab==="profile" && (
        <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:14}}>
          {/* Avatar card */}
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"24px 16px",textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:32,fontWeight:700,margin:"0 auto 12px"}}>
              {user.name[0]}
            </div>
            <div style={{fontWeight:700,fontSize:16,color:"#0f172a"}}>{profile.name}</div>
            <div style={{fontSize:13,color:"#6366f1",fontWeight:600,marginTop:2}}>{profile.designation}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Dept. of {profile.dept}</div>
            <div style={{marginTop:16,display:"flex",justifyContent:"space-around",borderTop:"1px solid #f1f5f9",paddingTop:14}}>
              {[["Publications",publications.length],["Citations",totalCitations],["h-index",hIndex]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:20,fontWeight:800,color:"#6366f1"}}>{v}</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{l}</div></div>
              ))}
            </div>
            <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:6}}>
              {[["ORCID",profile.orcid],["Scopus ID",profile.scopus],["Google Scholar",profile.googlescholar]].map(([l,v])=>(
                <div key={l} style={{background:"#f8fafc",borderRadius:6,padding:"6px 10px",textAlign:"left"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#94a3b8"}}>{l}</div>
                  <div style={{fontSize:11,color:"#6366f1",fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Details */}
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>Profile Details</div>
              <button onClick={()=>setEditing(e=>!e)}
                style={{padding:"6px 14px",background:editing?"#10b981":"#f1f5f9",color:editing?"#fff":"#475569",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>
                {editing?"Save Changes ✓":"Edit Profile ✎"}
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                ["Full Name","name"],["Email","email"],["Phone","phone"],["Cabin / Room","cabin"],
                ["Specialization","specialization"],["Qualification","qualification"],
                ["Experience","experience"],["Date of Joining","joined"],
              ].map(([l,k])=>(
                <div key={k}>
                  <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:3}}>{l.toUpperCase()}</div>
                  {editing&&!["joined","experience"].includes(k)
                    ? <input value={profile[k]} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))}
                        style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit",color:"#334155"}}/>
                    : <div style={{fontSize:13,color:"#334155",fontWeight:500}}>{profile[k]}</div>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==="publications" && (
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
            <button onClick={()=>setShowAddPub(true)}
              style={{padding:"8px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
              + Add Publication
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {publications.map(p=>(
              <div key={p.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{flex:1,paddingRight:12}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:3}}>{p.title}</div>
                    <div style={{fontSize:12,color:"#6366f1",fontWeight:600}}>{p.journal} · {p.year}</div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:p.type==="Journal"?"#eef2ff":"#f0fdf4",color:p.type==="Journal"?"#6366f1":"#16a34a"}}>{p.type}</span>
                    <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:p.status==="Published"?"#dcfce7":"#fef9c3",color:p.status==="Published"?"#16a34a":"#ca8a04"}}>{p.status}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:16,fontSize:12,color:"#64748b",flexWrap:"wrap"}}>
                  <span>📊 <strong style={{color:"#6366f1"}}>{p.citations}</strong> citations</span>
                  <span>🏆 <strong>{p.q}</strong> ranked</span>
                  <span>📈 IF: <strong>{p.if}</strong></span>
                  {p.doi!=="—"&&<span style={{color:"#6366f1",cursor:"pointer"}}>🔗 DOI: {p.doi}</span>}
                </div>
              </div>
            ))}
          </div>
          {showAddPub&&(
            <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAddPub(false)}>
              <div style={{background:"#fff",borderRadius:14,width:520,padding:0,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
                <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",color:"#fff",fontWeight:700,fontSize:15,display:"flex",justifyContent:"space-between"}}>
                  Add Publication <button onClick={()=>setShowAddPub(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:26,height:26,cursor:"pointer"}}>✕</button>
                </div>
                <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:10}}>
                  {[["Title","title","text"],["Journal / Conference","journal","text"],["DOI","doi","text"]].map(([l,k,t])=>(
                    <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                    <input type={t} value={newPub[k]} onChange={e=>setNewPub(p=>({...p,[k]:e.target.value}))}
                      style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
                  ))}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    {[["Year","year",["2025","2024","2023","2022"]],["Type","type",["Journal","Conference","Book Chapter"]],["Status","status",["Published","Under Review","Accepted"]]].map(([l,k,opts])=>(
                      <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                      <select value={newPub[k]} onChange={e=>setNewPub(p=>({...p,[k]:e.target.value}))}
                        style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select></div>
                    ))}
                  </div>
                  <button onClick={()=>{setPublications(prev=>[...prev,{...newPub,id:"P"+(prev.length+1),citations:0,q:"—",if:"—"}]);setShowAddPub(false);}}
                    style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14,marginTop:4}}>
                    Add Publication
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="patents" && (
        <div>
          {patents.map(p=>(
            <div key={p.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 18px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:4}}>{p.title}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>Application No: <strong>{p.number}</strong> · {p.office}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Filed: {p.filed} · Year: {p.year}</div>
                </div>
                <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,
                  background:p.status==="Granted"?"#dcfce7":"#fef9c3",
                  color:p.status==="Granted"?"#16a34a":"#ca8a04",flexShrink:0,marginLeft:10}}>{p.status}</span>
              </div>
            </div>
          ))}
          <button style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,marginTop:4}}>
            + Add Patent / Grant
          </button>
        </div>
      )}
    </div>
  );
}

// ─── STUDENT PROFILE ──────────────────────────────────────────────────────────
function StudentProfile({ user }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name, roll: user.roll||"520CS2008", dept: user.dept,
    programme:"B.Tech (CSE)", semester:"5th", year:"3rd Year",
    dob:"15 Aug 2003", gender:"Male", blood:"O+",
    email:"subhashish@iter.ac.in", phone:"+91 94370 12345",
    address:"C-214, ITER Hostel, SOA University, Bhubaneswar - 751030",
    guardian:"Ramakant Nayak", guardianPhone:"+91 98760 11223",
    aadhar:"XXXX-XXXX-4321", category:"General",
  });
  const [sessions] = useState([
    { device:"Chrome on Windows", ip:"103.21.58.142", location:"Bhubaneswar, OD", time:"Today, 9:42 AM", current:true },
    { device:"Mobile (Android)", ip:"103.21.58.143", location:"Bhubaneswar, OD", time:"Yesterday, 7:15 PM", current:false },
    { device:"Chrome on Windows", ip:"122.170.45.21", location:"Rourkela, OD", time:"Jun 8, 3:30 PM", current:false },
  ]);

  return (
    <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14}}>
      {/* Left card */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"20px 14px",textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:28,fontWeight:700,margin:"0 auto 10px"}}>{user.name[0]}</div>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>{profile.name}</div>
          <div style={{fontSize:12,color:"#6366f1",fontWeight:600,marginTop:2}}>{profile.roll}</div>
          <div style={{fontSize:12,color:"#64748b"}}>{profile.dept} · {profile.semester} Sem</div>
          <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:4}}>
            {[["Programme",profile.programme],["Year",profile.year],["Blood Group",profile.blood],["Category",profile.category]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",background:"#f8fafc",borderRadius:6,padding:"5px 10px"}}>
                <span style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>{l}</span>
                <span style={{fontSize:11,color:"#334155",fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Session activity */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"10px 14px",color:"#fff",fontWeight:700,fontSize:13}}>🔒 Login Sessions</div>
          {sessions.map((s,i)=>(
            <div key={i} style={{padding:"10px 12px",borderBottom:"1px solid #f1f5f9",background:s.current?"#f0f4ff":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,fontWeight:600,color:"#334155"}}>{s.device}</div>
                {s.current&&<span style={{background:"#dcfce7",color:"#16a34a",fontSize:10,padding:"1px 7px",borderRadius:20,fontWeight:700}}>Active</span>}
              </div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>📍 {s.location} · {s.ip}</div>
              <div style={{fontSize:10,color:"#cbd5e1"}}>{s.time}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right details */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>Personal Details</div>
          <button onClick={()=>setEditing(e=>!e)}
            style={{padding:"6px 14px",background:editing?"#10b981":"#f1f5f9",color:editing?"#fff":"#475569",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>
            {editing?"Save Changes ✓":"Edit Profile ✎"}
          </button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["Full Name","name"],["Date of Birth","dob"],["Gender","gender"],["Blood Group","blood"],
            ["Email","email"],["Phone","phone"],["Guardian Name","guardian"],["Guardian Phone","guardianPhone"],
            ["Aadhar (masked)","aadhar"],["Permanent Address","address"]].map(([l,k])=>(
            <div key={k} style={k==="address"?{gridColumn:"1/-1"}:{}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:3}}>{l.toUpperCase()}</div>
              {editing&&!["dob","gender","blood","aadhar"].includes(k)
                ? <input value={profile[k]} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))}
                    style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                : <div style={{fontSize:13,color:"#334155",fontWeight:500}}>{profile[k]}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────
function AuditLog({ role }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const studentLogs = [
    {id:1, action:"Logged in to portal", module:"Auth", detail:"Chrome · Windows · 103.21.58.142", time:"2026-06-16 9:42 AM", type:"auth", ip:"103.21.58.142"},
    {id:2, action:"Viewed Hall Ticket", module:"Examination", detail:"Sem 5 End Semester 2026 hall ticket downloaded", time:"2026-06-16 9:44 AM", type:"view", ip:"103.21.58.142"},
    {id:3, action:"Submitted Assignment", module:"Assignments", detail:"CS301 — ER Diagram for Hospital DB uploaded (2.3 MB)", time:"2026-06-16 9:50 AM", type:"submit", ip:"103.21.58.142"},
    {id:4, action:"Sent message to faculty", module:"Messages", detail:"Dr. Priya Singh — 'Doubt in ER Diagram normalization'", time:"2026-06-16 10:05 AM", type:"message", ip:"103.21.58.142"},
    {id:5, action:"Viewed Internal Marks", module:"Marks", detail:"Sem 5 CT marks viewed — all subjects", time:"2026-06-16 10:12 AM", type:"view", ip:"103.21.58.142"},
    {id:6, action:"Viewed Live Attendance", module:"Attendance", detail:"Today's class tracker accessed", time:"2026-06-16 10:20 AM", type:"view", ip:"103.21.58.142"},
    {id:7, action:"Applied for Leave", module:"Leave", detail:"Medical Leave Jun 1–2, sent to HOD · 2 days", time:"2026-06-09 3:15 PM", type:"leave", ip:"103.21.58.143"},
    {id:8, action:"Fee Payment", module:"Fee", detail:"Sem 5 partial fee ₹15,000 via UPI · Ref#TXN2026061501", time:"2026-06-08 11:00 AM", type:"payment", ip:"103.21.58.143"},
    {id:9, action:"Logged in to portal", module:"Auth", detail:"Mobile Android · 103.21.58.143", time:"2026-06-08 10:55 AM", type:"auth", ip:"103.21.58.143"},
    {id:10, action:"Downloaded Question Paper", module:"Papers", detail:"CS301 DBMS End Sem 2024 — PDF (1.1 MB)", time:"2026-06-07 6:30 PM", type:"download", ip:"103.21.58.142"},
    {id:11, action:"Course Registered", module:"Registration", detail:"CS306E Machine Learning (Elective) — Sem 5", time:"2026-06-06 2:00 PM", type:"register", ip:"103.21.58.142"},
    {id:12, action:"Grievance Filed", module:"Grievance", detail:"GR003 — Water supply issue C Block Hostel", time:"2026-06-05 4:00 PM", type:"grievance", ip:"103.21.58.142"},
    {id:13, action:"Feedback Submitted", module:"Feedback", detail:"CS301 DBMS — Dr. Priya Singh · 4.2/5 rating", time:"2026-06-04 5:30 PM", type:"submit", ip:"103.21.58.142"},
    {id:14, action:"Password Changed", module:"Security", detail:"Password updated successfully from profile settings", time:"2026-06-03 8:00 PM", type:"security", ip:"103.21.58.142"},
    {id:15, action:"Logged out", module:"Auth", detail:"Session ended · Duration 47 minutes", time:"2026-06-03 8:05 PM", type:"auth", ip:"103.21.58.142"},
  ];

  const facultyLogs = [
    {id:1, action:"Logged in to portal", module:"Auth", detail:"Chrome · Windows · 122.170.45.21", time:"2026-06-16 8:30 AM", type:"auth", ip:"122.170.45.21"},
    {id:2, action:"Attendance Uploaded", module:"Attendance", detail:"CS301 CSE5A — Jun 16 · 43 Present, 5 Absent", time:"2026-06-16 10:15 AM", type:"upload", ip:"122.170.45.21"},
    {id:3, action:"Internal Marks Entered", module:"Evaluation", detail:"CS301 CT-2 — 48 students marked", time:"2026-06-16 11:00 AM", type:"submit", ip:"122.170.45.21"},
    {id:4, action:"Bulk Message Sent", module:"Messaging", detail:"CS301 CSE5A — 'Assignment deadline extended to Jun 22'", time:"2026-06-16 11:45 AM", type:"message", ip:"122.170.45.21"},
    {id:5, action:"Assignment Created", module:"Assignments", detail:"Bulk: NFA to DFA Conversion for TOC, OS, CN — deadline Jun 25", time:"2026-06-16 12:00 PM", type:"create", ip:"122.170.45.21"},
    {id:6, action:"Attendance CSV Exported", module:"Attendance", detail:"CS301 DBMS attendance — Jun 2026 downloaded", time:"2026-06-16 12:10 PM", type:"download", ip:"122.170.45.21"},
    {id:7, action:"Replied to student message", module:"Messages", detail:"Riya Patel — DBMS normalization doubt resolved", time:"2026-06-15 4:00 PM", type:"message", ip:"122.170.45.21"},
    {id:8, action:"Student Leave Approved", module:"Leave", detail:"Priya Nair — Medical Leave Jun 10–12 · Approved", time:"2026-06-09 3:00 PM", type:"leave", ip:"122.170.45.21"},
    {id:9, action:"Publication Added", module:"Research", detail:"'Hybrid Clustering in IoT' — Expert Systems Journal 2026", time:"2026-06-08 2:00 PM", type:"submit", ip:"122.170.45.21"},
    {id:10, action:"Research Milestone Updated", module:"Research", detail:"Scholar: Rohit Sharma — Ch.4 submission deadline Jun 20", time:"2026-06-07 4:00 PM", type:"update", ip:"122.170.45.21"},
    {id:11, action:"Syllabus Updated", module:"Syllabus Tracker", detail:"CS301 Unit 3 — Query Optimization marked completed (85%)", time:"2026-06-06 10:30 AM", type:"update", ip:"122.170.45.21"},
    {id:12, action:"Feedback Results Viewed", module:"Feedback", detail:"CS301 DBMS — 42 responses, avg 4.1/5", time:"2026-06-05 9:00 AM", type:"view", ip:"122.170.45.21"},
    {id:13, action:"Question Paper Uploaded", module:"Question Paper", detail:"CS301 DBMS Mid-2 2026 — PDF submitted for review", time:"2026-06-04 3:00 PM", type:"upload", ip:"122.170.45.21"},
    {id:14, action:"Student Leave Rejected", module:"Leave", detail:"Amit Kumar — Casual Leave Jun 8 · Rejected (insufficient reason)", time:"2026-06-03 11:00 AM", type:"reject", ip:"122.170.45.21"},
    {id:15, action:"Logged out", module:"Auth", detail:"Session ended · Duration 3h 12m", time:"2026-06-16 12:30 PM", type:"auth", ip:"122.170.45.21"},
  ];

  const logs = role === "student" ? studentLogs : facultyLogs;

  const typeConfig = {
    auth:     {bg:"#eef2ff",c:"#6366f1",icon:"🔐"},
    view:     {bg:"#f1f5f9",c:"#475569",icon:"👁"},
    submit:   {bg:"#dcfce7",c:"#16a34a",icon:"✅"},
    upload:   {bg:"#dbeafe",c:"#2563eb",icon:"📤"},
    message:  {bg:"#fef3c7",c:"#d97706",icon:"✉️"},
    leave:    {bg:"#f3e8ff",c:"#9333ea",icon:"📋"},
    payment:  {bg:"#e0f2fe",c:"#0284c7",icon:"💳"},
    download: {bg:"#ecfdf5",c:"#059669",icon:"📥"},
    register: {bg:"#eef2ff",c:"#6366f1",icon:"📝"},
    grievance:{bg:"#fee2e2",c:"#dc2626",icon:"⚠️"},
    security: {bg:"#fee2e2",c:"#dc2626",icon:"🔒"},
    create:   {bg:"#dcfce7",c:"#16a34a",icon:"➕"},
    update:   {bg:"#e0f2fe",c:"#0284c7",icon:"✏️"},
    reject:   {bg:"#fee2e2",c:"#dc2626",icon:"✕"},
  };

  const allTypes = [...new Set(logs.map(l => l.type))];

  const filtered = logs.filter(l =>
    (filter === "all" || l.type === filter) &&
    (search === "" || l.action.toLowerCase().includes(search.toLowerCase()) ||
     l.module.toLowerCase().includes(search.toLowerCase()) ||
     l.detail.toLowerCase().includes(search.toLowerCase()))
  );

  const exportCSV = () => {
    const header = ["#","Action","Module","Detail","Time","IP"];
    const rows = filtered.map(l => [l.id, `"${l.action}"`, l.module, `"${l.detail}"`, l.time, l.ip]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `AuditLog_${role}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {[
          {label:"Total Actions",value:logs.length,icon:"📋",color:"#6366f1"},
          {label:"Today",value:logs.filter(l=>l.time.startsWith("2026-06-16")).length,icon:"📅",color:"#10b981"},
          {label:"Auth Events",value:logs.filter(l=>l.type==="auth").length,icon:"🔐",color:"#f59e0b"},
          {label:"Security Alerts",value:logs.filter(l=>l.type==="security"||l.type==="reject").length,icon:"🛡️",color:"#ef4444"},
        ].map(s=>(
          <div key={s.label} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px",borderLeft:`4px solid ${s.color}`}}>
            <div style={{fontSize:18,marginBottom:2}}>{s.icon}</div>
            <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.value}</div>
            <div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter + export */}
      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍 Search actions, modules..."
            style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",width:220,fontFamily:"inherit"}}/>
          <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,flexWrap:"wrap"}}>
            <button onClick={()=>setFilter("all")} style={{padding:"5px 10px",border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600,background:filter==="all"?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:filter==="all"?"#fff":"#64748b"}}>All</button>
            {allTypes.map(t=>(
              <button key={t} onClick={()=>setFilter(t)}
                style={{padding:"5px 10px",border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600,
                  background:filter===t?(typeConfig[t]?.c||"#6366f1"):"transparent",
                  color:filter===t?"#fff":"#64748b"}}>
                {typeConfig[t]?.icon} {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button onClick={exportCSV}
          style={{padding:"7px 16px",background:"#f0fdf4",color:"#16a34a",border:"1px solid #86efac",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>
          📥 Export CSV
        </button>
      </div>

      {/* Log entries */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"10px 16px",color:"#fff",fontWeight:700,fontSize:13,display:"flex",justifyContent:"space-between"}}>
          <span>🗃 Activity & Audit Log — Last 30 days</span>
          <span style={{fontSize:11,opacity:0.8}}>{filtered.length} entries</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{padding:"32px",textAlign:"center",color:"#94a3b8",fontSize:13}}>No logs match your filter.</div>
        ) : (
          filtered.map((l,i)=>{
            const tc = typeConfig[l.type] || {bg:"#f1f5f9",c:"#475569",icon:"📌"};
            return (
              <div key={l.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 16px",borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:tc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                  {tc.icon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{l.action}</span>
                    <span style={{padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700,background:tc.bg,color:tc.c,whiteSpace:"nowrap"}}>{l.type.toUpperCase()}</span>
                    <span style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>· {l.module}</span>
                  </div>
                  <div style={{fontSize:12,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.detail}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:11,color:"#64748b",whiteSpace:"nowrap"}}>{l.time.replace("2026-06-","Jun ").replace("2026-06-","Jun ")}</div>
                  <div style={{fontSize:10,color:"#cbd5e1",marginTop:2}}>IP: {l.ip}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── TRANSPORT MODULE ─────────────────────────────────────────────────────────
function TransportView() {
  const [tab, setTab] = useState("mybus");
  const [renewDone, setRenewDone] = useState(false);
  const routes = [
    { no:"R-01", name:"Bhubaneswar City Route", stops:["ITER Gate","Vani Vihar","Bhubaneswar Station","Saheed Nagar","Airport Sq","Master Canteen"], timing:"7:00 AM / 5:30 PM", seats:52, avail:12 },
    { no:"R-02", name:"Cuttack Route", stops:["ITER Gate","Infocity","Patia","Chandrasekharpur","CDA","Cuttack Bus Stand"], timing:"6:45 AM / 5:15 PM", seats:52, avail:5 },
    { no:"R-03", name:"Khordha / Berhampur Route", stops:["ITER Gate","Kalinga Hospital","Rasulgarh","Khordha Road","Jatni"], timing:"7:15 AM / 5:45 PM", seats:40, avail:18 },
    { no:"R-04", name:"Puri Route", stops:["ITER Gate","Balianta","Pipili","Delang","Puri Bus Stand"], timing:"7:00 AM / 5:30 PM", seats:40, avail:0 },
  ];
  const myPass = { route:"R-01", routeName:"Bhubaneswar City Route", stop:"Saheed Nagar", passNo:"BUS-2025-4521", valid:"Jul 2025 – Jun 2026", fee:18000, status:"Active" };

  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["mybus","🚌 My Bus Pass"],["routes","🗺 All Routes"],["apply","📝 Apply / Renew"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:"7px 14px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
              background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>

      {tab==="mybus" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{border:"2px solid #6366f1",borderRadius:12,padding:"20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff"}}>
            <div style={{fontSize:11,opacity:0.8,fontWeight:700,marginBottom:4}}>BUS PASS</div>
            <div style={{fontSize:22,fontWeight:900,letterSpacing:1}}>{myPass.passNo}</div>
            <div style={{fontSize:13,marginTop:8,opacity:0.9}}>{myPass.routeName}</div>
            <div style={{fontSize:12,opacity:0.8}}>Boarding: {myPass.stop}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:16,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.2)"}}>
              <div><div style={{fontSize:10,opacity:0.7}}>VALID</div><div style={{fontWeight:700}}>{myPass.valid}</div></div>
              <div><div style={{fontSize:10,opacity:0.7}}>FEE</div><div style={{fontWeight:700}}>₹{myPass.fee.toLocaleString()}/yr</div></div>
              <div><div style={{fontSize:10,opacity:0.7}}>STATUS</div><span style={{background:"rgba(255,255,255,0.2)",padding:"2px 8px",borderRadius:20,fontWeight:700,fontSize:12}}>{myPass.status}</span></div>
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px"}}>
            <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:12}}>Route Stops — {myPass.route}</div>
            {routes.find(r=>r.no===myPass.route)?.stops.map((s,i,arr)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:i<arr.length-1?6:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:s===myPass.stop?"#6366f1":"#e2e8f0",border:"2px solid",borderColor:s===myPass.stop?"#6366f1":"#cbd5e1"}}/>
                  {i<arr.length-1&&<div style={{width:2,height:16,background:"#e2e8f0"}}/>}
                </div>
                <div style={{fontSize:12,fontWeight:s===myPass.stop?700:400,color:s===myPass.stop?"#6366f1":"#334155"}}>
                  {s} {s===myPass.stop&&<span style={{fontSize:10,background:"#eef2ff",color:"#6366f1",padding:"1px 6px",borderRadius:20,marginLeft:4}}>Your Stop</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="routes" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {routes.map(r=>(
            <div key={r.no} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{background:"#eef2ff",color:"#6366f1",fontWeight:700,fontSize:12,padding:"2px 8px",borderRadius:6}}>{r.no}</span>
                    <span style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{r.name}</span>
                  </div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:3}}>⏰ {r.timing} &nbsp;·&nbsp; 💺 {r.avail}/{r.seats} seats available</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:r.avail>0?"#dcfce7":"#fee2e2",color:r.avail>0?"#16a34a":"#dc2626"}}>{r.avail>0?"Available":"Full"}</span>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {r.stops.map((s,i)=>(
                  <span key={i} style={{fontSize:11,color:"#475569",background:"#f1f5f9",padding:"2px 8px",borderRadius:20}}>
                    {i>0&&"→ "}{s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="apply" && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"20px 24px",maxWidth:480}}>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>Renew / Apply for Bus Pass</div>
          {renewDone ? (
            <div style={{textAlign:"center",padding:"24px 0"}}>
              <div style={{fontSize:48}}>✅</div>
              <div style={{fontWeight:700,fontSize:16,color:"#0f172a",marginTop:10}}>Renewal Request Submitted!</div>
              <div style={{fontSize:13,color:"#64748b",marginTop:4}}>Your bus pass will be renewed after fee payment.</div>
            </div>
          ) : (
            <>
              {[["Select Route","select"],["Boarding Stop","text"],["Period","select2"]].map(([l,t],i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>{l.toUpperCase()}</label>
                  {t==="select"?<select style={{width:"100%",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                    {routes.map(r=><option key={r.no}>{r.no} — {r.name}</option>)}
                  </select>:t==="select2"?<select style={{width:"100%",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                    <option>Jul 2026 – Jun 2027</option><option>Jan 2026 – Dec 2026</option>
                  </select>:<input placeholder={l} style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>}
                </div>
              ))}
              <div style={{background:"#f8fafc",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#475569"}}>
                Annual fee: <strong style={{color:"#6366f1"}}>₹18,000</strong> · Payment via fee portal after approval
              </div>
              <button onClick={()=>setRenewDone(true)}
                style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>
                Submit Application
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ALUMNI CONNECT ───────────────────────────────────────────────────────────
function AlumniConnect({ user }) {
  const [tab, setTab] = useState("directory");
  const [regDone, setRegDone] = useState(false);
  const [msgSent, setMsgSent] = useState(null);
  const alumni = [
    { name:"Rahul Mohanty", batch:"2022", company:"Google", role:"SDE II", location:"Bangalore", dept:"CSE", linkedin:"rahul-mohanty", mentoring:true, skills:["DSA","System Design","Go"] },
    { name:"Priyanka Das", batch:"2021", company:"Microsoft", role:"Product Manager", location:"Hyderabad", dept:"CSE", linkedin:"priyanka-das", mentoring:true, skills:["Product","Agile","SQL"] },
    { name:"Arun Kumar", batch:"2023", company:"Infosys", role:"Systems Engineer", location:"Pune", dept:"CSE", linkedin:"arun-kumar", mentoring:false, skills:["Java","Spring Boot","AWS"] },
    { name:"Sneha Rath", batch:"2020", company:"Amazon", role:"SDE III", location:"Seattle", dept:"CSE", linkedin:"sneha-rath", mentoring:true, skills:["ML","Python","AWS"] },
    { name:"Bikash Panda", batch:"2022", company:"Wipro", role:"Tech Lead", location:"Chennai", dept:"ECE", linkedin:"bikash-panda", mentoring:true, skills:["Embedded","VLSI","IoT"] },
    { name:"Anjali Nanda", batch:"2021", company:"TCS Research", role:"Research Analyst", location:"Mumbai", dept:"CSE", linkedin:"anjali-nanda", mentoring:false, skills:["NLP","Research","Python"] },
  ];

  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["directory","🎓 Alumni Directory"],["mentors","🤝 Find a Mentor"],["register","📝 Register as Alumni"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:"7px 14px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
              background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>

      {(tab==="directory"||tab==="mentors") && (
        <div>
          {tab==="mentors"&&<div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#4338ca"}}>
            🤝 These alumni have opted to mentor current students. Connect with them for career guidance, resume reviews, and interview prep.
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {alumni.filter(a=>tab==="directory"||a.mentoring).map((a,i)=>(
              <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px"}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0}}>
                    {a.name[0]}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{a.name}</div>
                    <div style={{fontSize:12,color:"#6366f1",fontWeight:600}}>{a.role} @ {a.company}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>📍 {a.location} · Batch {a.batch} · {a.dept}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                  {a.skills.map(s=><span key={s} style={{fontSize:10,background:"#f1f5f9",color:"#475569",padding:"2px 7px",borderRadius:20,fontWeight:600}}>{s}</span>)}
                </div>
                <div style={{display:"flex",gap:8}}>
                  {a.mentoring&&<button onClick={()=>setMsgSent(a.name)}
                    style={{flex:1,padding:"6px 0",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>
                    {msgSent===a.name?"✅ Request Sent":"🤝 Request Mentorship"}
                  </button>}
                  <button style={{padding:"6px 12px",background:"#f1f5f9",color:"#334155",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>LinkedIn</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="register" && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"20px 24px",maxWidth:520}}>
          {regDone?(
            <div style={{textAlign:"center",padding:"24px 0"}}>
              <div style={{fontSize:48}}>🎓</div>
              <div style={{fontWeight:700,fontSize:16,color:"#0f172a",marginTop:10}}>Welcome to the Alumni Network!</div>
              <div style={{fontSize:13,color:"#64748b",marginTop:4}}>Your profile will be visible to current students after verification.</div>
            </div>
          ):(
            <>
              <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>Register as an ITER Alumni</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Current Company","text"],["Current Role","text"],["Graduation Year","select"],["Current Location","text"],["LinkedIn Profile","text"],["Open to Mentoring","select2"]].map(([l,t],i)=>(
                  <div key={i}>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                    {t==="select"?<select style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                      {["2026","2025","2024","2023","2022","2021","2020"].map(y=><option key={y}>{y}</option>)}
                    </select>:t==="select2"?<select style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                      <option>Yes — happy to mentor</option><option>No</option>
                    </select>:<input placeholder={l} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>}
                  </div>
                ))}
              </div>
              <button onClick={()=>setRegDone(true)}
                style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14,marginTop:16}}>
                Register & Join Alumni Network
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── E-LEARNING ───────────────────────────────────────────────────────────────
function ELearningView() {
  const [tab, setTab] = useState("enrolled");
  const [addDone, setAddDone] = useState(null);
  const enrolled = [
    { id:"E1", title:"Deep Learning Specialization", platform:"Coursera", provider:"deeplearning.ai", progress:65, weeks:12, completed:8, cert:false, link:"#", color:"#0056d2" },
    { id:"E2", title:"The Joy of Computing using Python", platform:"NPTEL", provider:"IIT Ropar", progress:100, weeks:8, completed:8, cert:true, link:"#", color:"#ff6f00" },
    { id:"E3", title:"Data Structures and Algorithms", platform:"Swayam", provider:"IIT Bombay", progress:40, weeks:10, completed:4, cert:false, link:"#", color:"#1a73e8" },
    { id:"E4", title:"Cloud Computing", platform:"NPTEL", provider:"IIT Kharagpur", progress:25, weeks:12, completed:3, cert:false, link:"#", color:"#ff6f00" },
  ];
  const catalog = [
    { title:"Machine Learning", platform:"Coursera", provider:"Stanford / Andrew Ng", duration:"11 weeks", rating:4.9, enrolled:4500000 },
    { title:"Full Stack Web Development", platform:"Swayam", provider:"IIT Madras", duration:"12 weeks", rating:4.6, enrolled:85000 },
    { title:"Computer Networks", platform:"NPTEL", provider:"IIT Bombay", duration:"8 weeks", rating:4.7, enrolled:120000 },
    { title:"Cyber Security", platform:"Coursera", provider:"Google", duration:"6 months", rating:4.8, enrolled:780000 },
    { title:"Database Management Systems", platform:"NPTEL", provider:"IIT Madras", duration:"8 weeks", rating:4.5, enrolled:95000 },
  ];
  const platformColors = { Coursera:"#0056d2", NPTEL:"#ff6f00", Swayam:"#1a73e8" };

  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["enrolled","📚 My Courses"],["catalog","🔍 Explore"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
              background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>

      {tab==="enrolled" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {enrolled.map(c=>(
            <div key={c.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
              <div style={{background:c.color,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#fff",fontWeight:700,fontSize:12}}>{c.platform}</span>
                {c.cert&&<span style={{background:"rgba(255,255,255,0.25)",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>🏆 Certified</span>}
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{fontWeight:700,fontSize:13,color:"#0f172a",marginBottom:2}}>{c.title}</div>
                <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>{c.provider}</div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                  <span style={{color:"#475569"}}>Week {c.completed} of {c.weeks}</span>
                  <span style={{fontWeight:700,color:c.progress===100?"#10b981":"#6366f1"}}>{c.progress}%</span>
                </div>
                <div style={{height:7,background:"#f1f5f9",borderRadius:4,marginBottom:10}}>
                  <div style={{width:c.progress+"%",height:"100%",background:c.progress===100?"#10b981":c.color,borderRadius:4}}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button style={{flex:1,padding:"6px 0",background:c.color,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>
                    {c.progress===100?"View Certificate":"Continue →"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="catalog" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {catalog.map((c,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:(platformColors[c.platform]||"#6366f1")+"15",color:platformColors[c.platform]||"#6366f1"}}>{c.platform}</span>
                  <span style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{c.title}</span>
                </div>
                <div style={{fontSize:12,color:"#64748b"}}>{c.provider} · {c.duration} · ⭐ {c.rating} · {(c.enrolled/1000).toFixed(0)}k enrolled</div>
              </div>
              <button onClick={()=>setAddDone(c.title)}
                style={{padding:"7px 16px",background:addDone===c.title?"#10b981":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,flexShrink:0,marginLeft:14}}>
                {addDone===c.title?"✓ Added":"+ Enroll"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SYLLABUS TRACKER ─────────────────────────────────────────────────────────
function SyllabusTracker() {
  const [selSubj, setSelSubj] = useState("CS301");
  const subjects = {
    CS301:{ name:"Database Management Systems", faculty:"Dr. A. Sharma", totalHours:52,
      units:[
        { unit:1, title:"Introduction to DBMS", hours:8, topics:[
          {t:"Overview of DBMS, Advantages over File System",done:true,date:"Jun 3"},
          {t:"Data Models — Hierarchical, Network, Relational",done:true,date:"Jun 5"},
          {t:"ER Diagram — Entities, Attributes, Relationships",done:true,date:"Jun 7"},
          {t:"Extended ER Features — Specialization, Generalization",done:true,date:"Jun 10"},
        ]},
        { unit:2, title:"Relational Model & SQL", hours:14, topics:[
          {t:"Relational Algebra — Select, Project, Join",done:true,date:"Jun 12"},
          {t:"SQL DDL — CREATE, ALTER, DROP",done:true,date:"Jun 14"},
          {t:"SQL DML — INSERT, UPDATE, DELETE",done:true,date:"Jun 17"},
          {t:"Joins — Inner, Outer, Cross, Natural",done:false,date:""},
          {t:"Subqueries and Nested Queries",done:false,date:""},
          {t:"Views, Indexes, Constraints",done:false,date:""},
        ]},
        { unit:3, title:"Normalization", hours:10, topics:[
          {t:"Functional Dependencies",done:false,date:""},
          {t:"1NF, 2NF, 3NF",done:false,date:""},
          {t:"BCNF, 4NF, 5NF",done:false,date:""},
          {t:"Multivalued and Join Dependencies",done:false,date:""},
        ]},
        { unit:4, title:"Transactions & Concurrency", hours:10, topics:[
          {t:"ACID Properties",done:false,date:""},
          {t:"Serializability",done:false,date:""},
          {t:"Locking Protocols",done:false,date:""},
          {t:"Deadlock Detection & Recovery",done:false,date:""},
        ]},
        { unit:5, title:"Storage & Indexing", hours:10, topics:[
          {t:"File Organization",done:false,date:""},
          {t:"B+ Trees",done:false,date:""},
          {t:"Hashing Techniques",done:false,date:""},
          {t:"Query Processing & Optimization",done:false,date:""},
        ]},
      ]
    },
    CS302:{ name:"Operating Systems", faculty:"Prof. S. Das", totalHours:48,
      units:[
        { unit:1, title:"Introduction", hours:6, topics:[
          {t:"OS Concepts & Structure",done:true,date:"Jun 2"},
          {t:"System Calls & OS Services",done:true,date:"Jun 4"},
          {t:"Types of Operating Systems",done:true,date:"Jun 6"},
        ]},
        { unit:2, title:"Process Management", hours:12, topics:[
          {t:"Process Concepts & PCB",done:true,date:"Jun 9"},
          {t:"CPU Scheduling Algorithms",done:true,date:"Jun 11"},
          {t:"Inter-Process Communication",done:false,date:""},
          {t:"Synchronization — Semaphores, Mutex",done:false,date:""},
        ]},
        { unit:3, title:"Memory Management", hours:10, topics:[
          {t:"Paging & Segmentation",done:false,date:""},
          {t:"Virtual Memory & Page Replacement",done:false,date:""},
        ]},
      ]
    },
  };

  const [localSubjects, setLocalSubjects] = useState(subjects);
  const subj = localSubjects[selSubj];
  const allTopics = subj.units.flatMap(u=>u.topics);
  const doneTopic = allTopics.filter(t=>t.done).length;
  const pct = Math.round(doneTopic/allTopics.length*100);

  const markDone = (ui, ti) => {
    setLocalSubjects(prev=>{
      const copy = JSON.parse(JSON.stringify(prev));
      const topic = copy[selSubj].units[ui].topics[ti];
      topic.done = !topic.done;
      if(topic.done) topic.date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});
      else topic.date = "";
      return copy;
    });
  };

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {Object.entries(localSubjects).map(([k,v])=>(
          <button key={k} onClick={()=>setSelSubj(k)}
            style={{padding:"7px 16px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,
              background:selSubj===k?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
              color:selSubj===k?"#fff":"#475569"}}>
            {k} — {v.name}
          </button>
        ))}
      </div>

      {/* Progress summary */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>{subj.name}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{subj.faculty} · {subj.totalHours} hours total</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:28,fontWeight:900,color:"#6366f1"}}>{pct}%</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{doneTopic}/{allTopics.length} topics</div>
          </div>
        </div>
        <div style={{height:10,background:"#f1f5f9",borderRadius:5}}>
          <div style={{width:pct+"%",height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:5,transition:"width .3s"}}/>
        </div>
        <div style={{display:"flex",gap:16,marginTop:10}}>
          {subj.units.map(u=>{
            const done = u.topics.filter(t=>t.done).length;
            const up = Math.round(done/u.topics.length*100);
            return (
              <div key={u.unit} style={{flex:1,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,marginBottom:3}}>Unit {u.unit}</div>
                <div style={{height:4,background:"#f1f5f9",borderRadius:2}}>
                  <div style={{width:up+"%",height:"100%",background:up===100?"#10b981":"#6366f1",borderRadius:2}}/>
                </div>
                <div style={{fontSize:9,color:up===100?"#10b981":"#6366f1",fontWeight:600,marginTop:2}}>{up}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit-wise topics */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {subj.units.map((u,ui)=>{
          const done = u.topics.filter(t=>t.done).length;
          return (
            <div key={u.unit} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"10px 16px",background:"#f8fafc",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e2e8f0"}}>
                <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>Unit {u.unit}: {u.title}</div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:12,color:"#64748b"}}>{u.hours} hrs</span>
                  <span style={{fontSize:12,fontWeight:700,color:done===u.topics.length?"#10b981":"#6366f1"}}>{done}/{u.topics.length} done</span>
                </div>
              </div>
              <div style={{padding:"8px 0"}}>
                {u.topics.map((topic,ti)=>(
                  <div key={ti} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 16px",borderBottom:"1px solid #f8fafc",
                    background:topic.done?"#f0fdf4":"#fff"}}>
                    <button onClick={()=>markDone(ui,ti)}
                      style={{width:22,height:22,borderRadius:6,border:`2px solid ${topic.done?"#10b981":"#cbd5e1"}`,
                        background:topic.done?"#10b981":"#fff",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700}}>
                      {topic.done?"✓":""}
                    </button>
                    <span style={{fontSize:13,color:topic.done?"#16a34a":"#334155",fontWeight:topic.done?500:400,
                      textDecoration:topic.done?"line-through":"none",flex:1}}>
                      {topic.t}
                    </span>
                    {topic.done&&topic.date&&<span style={{fontSize:11,color:"#94a3b8",flexShrink:0}}>{topic.date}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MARKSHEET ────────────────────────────────────────────────────────────────
function MarksheetView({ user }) {
  const [selSem, setSelSem] = useState("5");
  const [downloading, setDownloading] = useState(false);

  const semResults = {
    "1":{ session:"Autumn 2023", parity:"Odd", sgpa:8.1, cgpa:8.1, credits:21, courses:[
      {code:"MA101",name:"Engineering Mathematics I",  type:"T",c:4,int:28,ext:62,tot:90,gr:"O"},
      {code:"PH101",name:"Engineering Physics",        type:"T",c:3,int:22,ext:55,tot:77,gr:"A+"},
      {code:"CS101",name:"Programming in C",           type:"T",c:3,int:25,ext:58,tot:83,gr:"A"},
      {code:"CS101L",name:"Programming Lab",           type:"L",c:2,int:18,ext:32,tot:50,gr:"O"},
      {code:"ME101",name:"Engineering Drawing",        type:"T",c:2,int:20,ext:45,tot:65,gr:"B+"},
      {code:"HS101",name:"English Communication",      type:"T",c:2,int:24,ext:52,tot:76,gr:"A+"},
    ]},
    "2":{ session:"Spring 2024", parity:"Even", sgpa:8.0, cgpa:8.1, credits:21, courses:[
      {code:"MA102",name:"Engineering Mathematics II", type:"T",c:4,int:26,ext:60,tot:86,gr:"A+"},
      {code:"CH101",name:"Engineering Chemistry",      type:"T",c:3,int:21,ext:50,tot:71,gr:"A"},
      {code:"CS102",name:"Data Structures",            type:"T",c:4,int:27,ext:65,tot:92,gr:"O"},
      {code:"CS102L",name:"Data Structures Lab",       type:"L",c:2,int:19,ext:30,tot:49,gr:"A+"},
      {code:"EC101",name:"Basic Electronics",          type:"T",c:3,int:18,ext:44,tot:62,gr:"B+"},
      {code:"ME102",name:"Workshop Practice",          type:"L",c:2,int:20,ext:28,tot:48,gr:"A"},
    ]},
    "3":{ session:"Autumn 2024", parity:"Odd", sgpa:8.4, cgpa:8.3, credits:22, courses:[
      {code:"CS201",name:"Discrete Mathematics",       type:"T",c:4,int:24,ext:56,tot:80,gr:"A+"},
      {code:"CS202",name:"Digital Logic Design",       type:"T",c:3,int:22,ext:50,tot:72,gr:"A"},
      {code:"CS203",name:"OOP with Java",              type:"T",c:4,int:28,ext:62,tot:90,gr:"O"},
      {code:"CS203L",name:"Java Lab",                  type:"L",c:2,int:20,ext:30,tot:50,gr:"O"},
      {code:"MA201",name:"Probability & Statistics",   type:"T",c:3,int:19,ext:48,tot:67,gr:"B+"},
      {code:"CS204",name:"Computer Organization",      type:"T",c:3,int:21,ext:52,tot:73,gr:"A"},
    ]},
    "4":{ session:"Spring 2025", parity:"Even", sgpa:8.9, cgpa:8.6, credits:22, courses:[
      {code:"CS211",name:"Design & Analysis of Algorithms",type:"T",c:4,int:25,ext:58,tot:83,gr:"A"},
      {code:"CS212",name:"Database Management Systems",   type:"T",c:4,int:27,ext:62,tot:89,gr:"O"},
      {code:"CS212L",name:"DBMS Lab",                     type:"L",c:2,int:19,ext:29,tot:48,gr:"A+"},
      {code:"CS213",name:"Software Engineering",          type:"T",c:3,int:22,ext:54,tot:76,gr:"A+"},
      {code:"CS214E",name:"Web Technologies (Elective)",  type:"E",c:3,int:24,ext:56,tot:80,gr:"A+"},
      {code:"CS215",name:"Mini Project",                  type:"P",c:2,int:40,ext:0,tot:40,gr:"O"},
    ]},
    "5":{ session:"Autumn 2025", parity:"Odd", sgpa:null, cgpa:null, credits:23, courses:[
      {code:"CS301",name:"Database Management Systems",   type:"T",c:4,int:null,ext:null,tot:null,gr:"—"},
      {code:"CS302",name:"Operating Systems",             type:"T",c:4,int:null,ext:null,tot:null,gr:"—"},
      {code:"CS303",name:"Computer Networks",             type:"T",c:4,int:null,ext:null,tot:null,gr:"—"},
      {code:"CS304",name:"Theory of Computation",         type:"T",c:3,int:null,ext:null,tot:null,gr:"—"},
      {code:"CS305",name:"Software Engineering",          type:"T",c:3,int:null,ext:null,tot:null,gr:"—"},
      {code:"CS301L",name:"DBMS Lab",                     type:"L",c:2,int:null,ext:null,tot:null,gr:"—"},
      {code:"CS306E",name:"Machine Learning (Elective)",  type:"E",c:3,int:null,ext:null,tot:null,gr:"—"},
    ]},
  };

  const gradeColor = g => ({O:"#10b981","A+":"#10b981",A:"#6366f1","B+":"#6366f1",B:"#f59e0b",C:"#f59e0b",F:"#ef4444","—":"#94a3b8"}[g]||"#94a3b8");
  const current = semResults[selSem];
  const cgpaAll = [8.1,8.0,8.3,8.6];
  const handleDownload = () => {
    setDownloading(true);
    setTimeout(()=>setDownloading(false),2000);
  };

  return (
    <div>
      {/* Sem tabs */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {Object.keys(semResults).map(s=>(
          <button key={s} onClick={()=>setSelSem(s)}
            style={{padding:"6px 16px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,
              background:selSem===s?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
              color:selSem===s?"#fff":"#475569"}}>
            Sem {s}
          </button>
        ))}
      </div>

      {/* CGPA trend */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 18px",marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:"#0f172a",marginBottom:10}}>CGPA Progression</div>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          {cgpaAll.map((c,i)=>(
            <div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#6366f1",marginBottom:4}}>{c}</div>
              <div style={{height:Math.round((c-7)*60)+"px",background:"linear-gradient(180deg,#6366f1,#8b5cf6)",borderRadius:"4px 4px 0 0",minHeight:20}}/>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>Sem {i+1}</div>
            </div>
          ))}
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",marginBottom:4}}>—</div>
            <div style={{height:20,background:"#f1f5f9",borderRadius:"4px 4px 0 0"}}/>
            <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>Sem 5</div>
          </div>
        </div>
      </div>

      {/* Marksheet card */}
      <div style={{background:"#fff",border:"2px solid #6366f1",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:"#fff",fontWeight:900,fontSize:16}}>ITER — SOA University</div>
            <div style={{color:"rgba(255,255,255,0.85)",fontSize:13}}>Grade Sheet — Semester {selSem} ({current.session})</div>
          </div>
          {current.sgpa&&(
            <button onClick={handleDownload}
              style={{padding:"8px 16px",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:12}}>
              {downloading?"⏳ Generating...":"📥 Download PDF"}
            </button>
          )}
        </div>

        {downloading&&<div style={{background:"#dcfce7",padding:"8px 16px",fontSize:12,color:"#16a34a",fontWeight:600}}>✅ Marksheet_Sem{selSem}_{user.roll||"520CS2008"}.pdf downloaded!</div>}

        {/* Student info */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",borderBottom:"1px solid #e2e8f0"}}>
          {[["Student Name",user.name],["Roll No.",user.roll||"520CS2008"],["Department","CSE"],
            ["Programme","B.Tech"],["Semester",`${selSem} (${current.parity})`],["Session",current.session]].map(([l,v],i)=>(
            <div key={i} style={{padding:"9px 14px",borderRight:i%3!==2?"1px solid #f1f5f9":"none",borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fafbff":"#fff"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#94a3b8"}}>{l}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Marks table */}
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:"#eef2ff"}}>
              {["Code","Subject","Type","Credits","Internal /20","External /60","Total /80","Grade"].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:11}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.courses.map((c,i)=>(
              <tr key={c.code} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                <td style={{padding:"9px 12px",fontWeight:700,color:"#6366f1"}}>{c.code}</td>
                <td style={{padding:"9px 12px",color:"#0f172a",fontWeight:500}}>{c.name}</td>
                <td style={{padding:"9px 12px"}}><span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"#eef2ff",color:"#6366f1",fontWeight:700}}>{c.type}</span></td>
                <td style={{padding:"9px 12px",textAlign:"center",color:"#475569"}}>{c.c}</td>
                <td style={{padding:"9px 12px",textAlign:"center",color:"#334155",fontWeight:500}}>{c.int??<span style={{color:"#f59e0b",fontSize:11}}>Pending</span>}</td>
                <td style={{padding:"9px 12px",textAlign:"center",color:"#334155",fontWeight:500}}>{c.ext??<span style={{color:"#f59e0b",fontSize:11}}>Pending</span>}</td>
                <td style={{padding:"9px 12px",textAlign:"center",fontWeight:700,color:"#0f172a"}}>{c.tot??<span style={{color:"#f59e0b",fontSize:11}}>Pending</span>}</td>
                <td style={{padding:"9px 12px",textAlign:"center"}}>
                  <span style={{padding:"3px 10px",borderRadius:6,fontWeight:800,fontSize:12,background:gradeColor(c.gr)+"20",color:gradeColor(c.gr)}}>{c.gr}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{padding:"12px 16px",background:"#f8fafc",display:"flex",gap:24,justifyContent:"flex-end",borderTop:"1px solid #e2e8f0"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>CREDITS EARNED</div><div style={{fontSize:16,fontWeight:800,color:"#334155"}}>{current.sgpa?current.credits:0}/{current.credits}</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>SGPA</div><div style={{fontSize:18,fontWeight:900,color:"#6366f1"}}>{current.sgpa??"—"}</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>CGPA</div><div style={{fontSize:18,fontWeight:900,color:"#0f172a"}}>{current.cgpa??"—"}</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>RESULT</div><div style={{fontSize:14,fontWeight:800,color:current.sgpa?"#10b981":"#f59e0b"}}>{current.sgpa?"PASS":"Awaited"}</div></div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ user, setActive }) {
  const [pendingCount, setPendingCount] = useState(3);
  useEffect(() => {
    try {
      const unsub = getPendingUsers(users => setPendingCount(users.length));
      return () => { try { unsub && unsub(); } catch(e){} };
    } catch(e) {
      setPendingCount(3);
    }
  }, []);
  const stats = [
    {label:"Total Students",value:"4,872",icon:"🎓",color:"#6366f1",sub:"+124 this year"},
    {label:"Total Faculty",value:"312",icon:"👨‍🏫",color:"#10b981",sub:"28 departments"},
    {label:"Courses Offered",value:"186",icon:"📚",color:"#f59e0b",sub:"UG + PG + PhD"},
    {label:"🔐 Pending Approvals",value:pendingCount,icon:"⏳",color:"#ef4444",sub:"Click to review →",link:"approvals"},
    {label:"Active Complaints",value:"8",icon:"🔧",color:"#8b5cf6",sub:"Infrastructure"},
    {label:"Files in Transit",value:"15",icon:"📁",color:"#14b8a6",sub:"FTS active"},
  ];
  const recentActions = [
    {action:"Leave approved for Dr. Priya Singh",type:"leave",time:"10 min ago"},
    {action:"New student S-2026-001 registered",type:"student",time:"1 hr ago"},
    {action:"Room booking confirmed — Seminar Hall A",type:"booking",time:"2 hr ago"},
    {action:"Faculty appraisal submitted by Prof. S. Das",type:"appraisal",time:"3 hr ago"},
    {action:"Vehicle requisition VR-045 assigned",type:"vehicle",time:"4 hr ago"},
    {action:"Complaint CMP-012 resolved — Electrical Dept",type:"complaint",time:"5 hr ago"},
  ];
  const deptStats = [
    {dept:"CSE",students:640,faculty:42,courses:28},
    {dept:"ECE",students:520,faculty:38,courses:24},
    {dept:"MECH",students:480,faculty:35,courses:22},
    {dept:"CIVIL",students:400,faculty:30,courses:20},
    {dept:"EEE",students:360,faculty:28,courses:18},
    {dept:"MBA",students:240,faculty:22,courses:16},
  ];
  return (
    <div>
      <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:12,padding:"16px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:18}}>Welcome, {user.name}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>{user.designation} · {user.dept}</div>
        </div>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,textAlign:"right"}}>
          {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {stats.map(s=>(
          <div key={s.label} onClick={()=>s.link&&setActive&&setActive(s.link)}
            style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",borderLeft:`4px solid ${s.color}`,cursor:s.link?"pointer":"default"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8"}}>{s.label.toUpperCase()}</div>
              <span style={{fontSize:20}}>{s.icon}</span>
            </div>
            <div style={{fontSize:26,fontWeight:800,color:s.color}}>{s.value}</div>
            <div style={{fontSize:11,color:s.link?"#6366f1":"#94a3b8",marginTop:2,fontWeight:s.link?600:400}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14}}>
        {/* Department overview */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 16px",color:"#fff",fontWeight:700,fontSize:13}}>Department Overview</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc"}}>{["Dept","Students","Faculty","Courses"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
            <tbody>{deptStats.map((d,i)=>(
              <tr key={d.dept} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                <td style={{padding:"10px 12px",fontWeight:700,color:"#6366f1"}}>{d.dept}</td>
                <td style={{padding:"10px 12px",color:"#334155"}}>{d.students}</td>
                <td style={{padding:"10px 12px",color:"#334155"}}>{d.faculty}</td>
                <td style={{padding:"10px 12px",color:"#334155"}}>{d.courses}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {/* Recent actions */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 16px",color:"#fff",fontWeight:700,fontSize:13}}>Recent Activity</div>
          {recentActions.map((a,i)=>(
            <div key={i} style={{padding:"10px 14px",borderBottom:"1px solid #f1f5f9",display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{fontSize:14,flexShrink:0}}>{{leave:"📋",student:"🎓",booking:"🏢",appraisal:"⭐",vehicle:"🚗",complaint:"🔧"}[a.type]||"📌"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:"#334155",fontWeight:500}}>{a.action}</div>
                <div style={{fontSize:10,color:"#94a3b8"}}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminStudents() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("list");
  const [showAdd, setShowAdd] = useState(false);
  const [addDone, setAddDone] = useState(false);
  const [form, setForm] = useState({name:"",roll:"",dept:"CSE",year:"1st",email:"",phone:""});
  const [students, setStudents] = useState([
    {roll:"520CS2008",name:"Subhashish Nayak",dept:"CSE",year:"PhD",email:"subhashish@iter.ac.in",status:"Active",cgpa:8.6},
    {roll:"22CS001",name:"Riya Patel",dept:"CSE",year:"3rd",email:"riya@iter.in",status:"Active",cgpa:8.8},
    {roll:"22CS005",name:"Amit Kumar",dept:"CSE",year:"3rd",email:"amit@iter.in",status:"Active",cgpa:7.9},
    {roll:"22CS012",name:"Priya Nair",dept:"CSE",year:"3rd",email:"priya@iter.in",status:"Active",cgpa:8.2},
    {roll:"21EC001",name:"Rahul Das",dept:"ECE",year:"4th",email:"rahul@iter.in",status:"Active",cgpa:7.5},
    {roll:"22ME003",name:"Sneha Panda",dept:"MECH",year:"3rd",email:"sneha@iter.in",status:"Detained",cgpa:5.8},
  ]);
  const filtered = students.filter(s=>!search||(s.name+s.roll+s.dept).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14,justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3}}>
          {[["list","📋 Students"],["admit","🎓 Admissions"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student..."
            style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",width:200,fontFamily:"inherit"}}/>
          <button onClick={()=>setShowAdd(true)} style={{padding:"8px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12}}>+ Add Student</button>
        </div>
      </div>
      {tab==="list"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc"}}>{["Roll No.","Name","Dept","Year","Email","CGPA","Status","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map((s,i)=>(
              <tr key={s.roll} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                <td style={{padding:"10px 12px",color:"#6366f1",fontWeight:700}}>{s.roll}</td>
                <td style={{padding:"10px 12px",fontWeight:600,color:"#0f172a"}}>{s.name}</td>
                <td style={{padding:"10px 12px",color:"#64748b"}}>{s.dept}</td>
                <td style={{padding:"10px 12px",color:"#64748b"}}>{s.year}</td>
                <td style={{padding:"10px 12px",color:"#64748b",fontSize:12}}>{s.email}</td>
                <td style={{padding:"10px 12px",fontWeight:700,color:s.cgpa>=7.5?"#10b981":"#f59e0b"}}>{s.cgpa}</td>
                <td style={{padding:"10px 12px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:s.status==="Active"?"#dcfce7":"#fee2e2",color:s.status==="Active"?"#16a34a":"#dc2626"}}>{s.status}</span></td>
                <td style={{padding:"10px 12px",display:"flex",gap:6}}>
                  <button style={{padding:"3px 10px",background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600}}>Edit</button>
                  <button style={{padding:"3px 10px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600}}>Block</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab==="admit"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"18px 20px"}}>
          <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:4}}>Admission Management — 2026-27</div>
          <div style={{fontSize:13,color:"#64748b",marginBottom:14}}>Total applications: <strong style={{color:"#6366f1"}}>2,847</strong> · Seats: <strong>960</strong> · Confirmed: <strong style={{color:"#10b981"}}>412</strong></div>
          {[{prog:"B.Tech CSE",apps:680,seats:120,confirmed:98,cutoff:"JEE 85%ile"},{prog:"B.Tech ECE",apps:520,seats:90,confirmed:76,cutoff:"JEE 78%ile"},{prog:"B.Tech MECH",apps:410,seats:90,confirmed:65,cutoff:"JEE 72%ile"},{prog:"MBA",apps:380,seats:60,confirmed:52,cutoff:"MAT 75%ile"},{prog:"M.Tech CSE",apps:280,seats:30,confirmed:28,cutoff:"GATE 450"},{prog:"PhD CSE",apps:95,seats:15,confirmed:12,cutoff:"NET/GATE"}].map((p,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
              <div style={{fontWeight:600,color:"#0f172a",width:160}}>{p.prog}</div>
              <div style={{color:"#64748b"}}>Apps: <strong>{p.apps}</strong></div>
              <div style={{color:"#64748b"}}>Seats: <strong>{p.seats}</strong></div>
              <div style={{color:"#10b981",fontWeight:600}}>Confirmed: {p.confirmed}</div>
              <div style={{fontSize:11,color:"#6366f1",fontWeight:600}}>{p.cutoff}</div>
            </div>
          ))}
        </div>
      )}
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAdd(false)}>
          <div style={{background:"#fff",borderRadius:14,width:460,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:14}}>+ Add New Student</span>
              <button onClick={()=>setShowAdd(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:24,height:24,cursor:"pointer"}}>✕</button>
            </div>
            {addDone?<div style={{padding:"32px",textAlign:"center"}}><div style={{fontSize:40}}>✅</div><div style={{fontWeight:700,marginTop:8}}>Student Added!</div></div>:(
              <div style={{padding:"18px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Full Name","name","text"],["Roll Number","roll","text"],["Email","email","email"],["Phone","phone","text"]].map(([l,k,t])=>(
                  <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                  <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
                ))}
                {[["Department","dept",["CSE","ECE","MECH","CIVIL","EEE","MBA"]],["Year","year",["1st","2nd","3rd","4th","PhD"]]].map(([l,k,opts])=>(
                  <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                  <select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
                ))}
                <button onClick={()=>{if(form.name&&form.roll){setStudents(p=>[...p,{...form,status:"Active",cgpa:0}]);setAddDone(true);setTimeout(()=>{setAddDone(false);setShowAdd(false);setForm({name:"",roll:"",dept:"CSE",year:"1st",email:"",phone:""});},1500);}}}
                  style={{gridColumn:"1/-1",padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,marginTop:4}}>
                  Add Student
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminFaculty() {
  const [search, setSearch] = useState("");
  const faculty = [
    {id:"F001",name:"Dr. Priya Singh",dept:"CSE",designation:"Asst. Professor",exp:"8 yrs",email:"priya@iter.ac.in",status:"Active",pubs:4},
    {id:"F002",name:"Prof. S. Das",dept:"CSE",designation:"Associate Professor",exp:"15 yrs",email:"sdas@iter.ac.in",status:"Active",pubs:12},
    {id:"F003",name:"Dr. R. Panda",dept:"CSE",designation:"Asst. Professor",exp:"6 yrs",email:"rpanda@iter.ac.in",status:"Active",pubs:7},
    {id:"F004",name:"Dr. A. Sharma",dept:"CSE",designation:"Professor",exp:"22 yrs",email:"asharma@iter.ac.in",status:"Active",pubs:28},
    {id:"F005",name:"Prof. Sunita Das",dept:"ECE",designation:"Associate Professor",exp:"18 yrs",email:"sunita@iter.ac.in",status:"On Leave",pubs:15},
  ];
  const filtered = faculty.filter(f=>!search||(f.name+f.dept+f.designation).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:8}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search faculty..."
          style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",width:220,fontFamily:"inherit"}}/>
        <button style={{padding:"8px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12}}>+ Add Faculty</button>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Name","Dept","Designation","Experience","Email","Publications","Status","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:11,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((f,i)=>(
            <tr key={f.id} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
              <td style={{padding:"10px 12px",color:"#6366f1",fontWeight:700}}>{f.id}</td>
              <td style={{padding:"10px 12px",fontWeight:600,color:"#0f172a"}}>{f.name}</td>
              <td style={{padding:"10px 12px",color:"#64748b"}}>{f.dept}</td>
              <td style={{padding:"10px 12px",color:"#475569",fontSize:12}}>{f.designation}</td>
              <td style={{padding:"10px 12px",color:"#64748b"}}>{f.exp}</td>
              <td style={{padding:"10px 12px",color:"#64748b",fontSize:11}}>{f.email}</td>
              <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:"#6366f1"}}>{f.pubs}</td>
              <td style={{padding:"10px 12px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:f.status==="Active"?"#dcfce7":"#fef9c3",color:f.status==="Active"?"#16a34a":"#ca8a04"}}>{f.status}</span></td>
              <td style={{padding:"10px 12px",display:"flex",gap:5}}>
                <button style={{padding:"3px 8px",background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:5,cursor:"pointer",fontSize:10,fontWeight:600}}>Edit</button>
                <button style={{padding:"3px 8px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:5,cursor:"pointer",fontSize:10,fontWeight:600}}>Block</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminLeaveApprovals() {
  const [leaves, setLeaves] = useState([
    {id:"L001",name:"Dr. Priya Singh",type:"Faculty",leave:"Academic Leave",from:"Jun 15",to:"Jun 17",days:3,reason:"ICML 2026 Conference, Vienna",status:"Pending",role:"faculty"},
    {id:"L002",name:"Subhashish Nayak",type:"Student",leave:"Medical Leave",from:"Jun 10",to:"Jun 12",days:3,reason:"Hospitalization",status:"Pending",role:"student"},
    {id:"L003",name:"Prof. S. Das",type:"Faculty",leave:"Casual Leave",from:"Jun 20",to:"Jun 20",days:1,reason:"Family function",status:"Approved",role:"faculty"},
    {id:"L004",name:"Riya Patel",type:"Student",leave:"Casual Leave",from:"Jun 8",to:"Jun 8",days:1,reason:"College fest",status:"Rejected",role:"student"},
  ]);
  const act = (id,status) => setLeaves(p=>p.map(l=>l.id===id?{...l,status}:l));
  const statusColor = s=>s==="Approved"?{bg:"#dcfce7",c:"#16a34a"}:s==="Rejected"?{bg:"#fee2e2",c:"#dc2626"}:{bg:"#fef9c3",c:"#ca8a04"};
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {[["Pending",leaves.filter(l=>l.status==="Pending").length,"#f59e0b"],["Approved",leaves.filter(l=>l.status==="Approved").length,"#10b981"],["Rejected",leaves.filter(l=>l.status==="Rejected").length,"#ef4444"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px",textAlign:"center",borderTop:`3px solid ${c}`}}>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {leaves.map(l=>{const sc=statusColor(l.status);return(
          <div key={l.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{l.name}</span>
                <span style={{fontSize:11,padding:"1px 7px",borderRadius:20,background:l.type==="Faculty"?"#eef2ff":"#f0fdf4",color:l.type==="Faculty"?"#6366f1":"#16a34a",fontWeight:700}}>{l.type}</span>
                <span style={{fontSize:12,color:"#64748b"}}>{l.leave} · {l.days} day{l.days>1?"s":""}</span>
              </div>
              <div style={{fontSize:12,color:"#64748b"}}>{l.from} → {l.to} · Reason: {l.reason}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,marginLeft:12}}>
              <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,background:sc.bg,color:sc.c}}>{l.status}</span>
              {l.status==="Pending"&&<>
                <button onClick={()=>act(l.id,"Approved")} style={{padding:"5px 14px",background:"#10b981",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>✓ Approve</button>
                <button onClick={()=>act(l.id,"Rejected")} style={{padding:"5px 14px",background:"#ef4444",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>✕ Reject</button>
              </>}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── Phase 2: Internal Marks View (Student) ──────────────────────────────────
function InternalMarksView() {
  const [selSem, setSelSem] = useState("5");
  const sems = {
    "5": {
      session:"Autumn 2025–26",
      subjects:[
        {code:"CS301",name:"Database Management Systems",ct1:17,ct2:19,ct3:18,assign:9,attend:5,max:{ct:20,assign:10,attend:5},faculty:"Dr. A. Sharma"},
        {code:"CS302",name:"Operating Systems",ct1:14,ct2:16,ct3:null,assign:8,attend:4,max:{ct:20,assign:10,attend:5},faculty:"Prof. S. Das"},
        {code:"CS303",name:"Computer Networks",ct1:18,ct2:17,ct3:19,assign:10,attend:5,max:{ct:20,assign:10,attend:5},faculty:"Dr. R. Panda"},
        {code:"CS304",name:"Theory of Computation",ct1:12,ct2:14,ct3:null,assign:7,attend:3,max:{ct:20,assign:10,attend:5},faculty:"Dr. K. Rath"},
        {code:"CS305",name:"Software Engineering",ct1:16,ct2:18,ct3:null,assign:9,attend:4,max:{ct:20,assign:10,attend:5},faculty:"Prof. M. Behera"},
        {code:"CS301L",name:"DBMS Lab",ct1:null,ct2:null,ct3:null,assign:18,attend:5,max:{ct:null,assign:25,attend:5},faculty:"Dr. A. Sharma"},
      ]
    },
    "4": {
      session:"Spring 2024–25",
      subjects:[
        {code:"CS211",name:"Design & Analysis of Algorithms",ct1:18,ct2:19,ct3:17,assign:9,attend:5,max:{ct:20,assign:10,attend:5},faculty:"Dr. V. Kumar"},
        {code:"CS212",name:"Database Management Systems",ct1:20,ct2:18,ct3:19,assign:10,attend:5,max:{ct:20,assign:10,attend:5},faculty:"Dr. A. Sharma"},
        {code:"CS213",name:"Software Engineering",ct1:16,ct2:17,ct3:16,assign:8,attend:4,max:{ct:20,assign:10,attend:5},faculty:"Prof. M. Behera"},
        {code:"CS214E",name:"Web Technologies",ct1:19,ct2:20,ct3:18,assign:10,attend:5,max:{ct:20,assign:10,attend:5},faculty:"Dr. R. Nair"},
      ]
    }
  };
  const current = sems[selSem];
  const getBestTwo = (ct1,ct2,ct3) => {
    const scores = [ct1,ct2,ct3].filter(v=>v!==null);
    if(scores.length===0) return null;
    if(scores.length===1) return scores[0];
    return scores.sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);
  };
  const getTotal = s => {
    const ct = getBestTwo(s.ct1,s.ct2,s.ct3);
    if(ct===null && s.code.endsWith("L")) return (s.assign||0)+(s.attend||0);
    return (ct||0)+(s.assign||0)+(s.attend||0);
  };
  const getMax = s => {
    if(s.code.endsWith("L")) return (s.max.assign||0)+(s.max.attend||0);
    return (s.max.ct?s.max.ct*2:0)+(s.max.assign||0)+(s.max.attend||0);
  };
  const getPct = s => { const m=getMax(s); return m>0?Math.round(getTotal(s)/m*100):0; };

  return (
    <div>
      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Subjects",value:current.subjects.length,icon:"📚",color:"#6366f1"},
          {label:"Avg Internal",value:Math.round(current.subjects.reduce((a,s)=>a+getPct(s),0)/current.subjects.length)+"%",icon:"📊",color:"#10b981"},
          {label:"Below 50%",value:current.subjects.filter(s=>getPct(s)<50).length,icon:"⚠️",color:"#ef4444"},
          {label:"Session",value:current.session,icon:"📅",color:"#f59e0b"},
        ].map(c=>(
          <div key={c.label} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",borderLeft:`4px solid ${c.color}`}}>
            <div style={{fontSize:20,marginBottom:4}}>{c.icon}</div>
            <div style={{fontSize:18,fontWeight:800,color:c.color}}>{c.value}</div>
            <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,marginTop:2}}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Sem selector */}
      <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>SEMESTER:</span>
        {Object.keys(sems).map(s=>(
          <button key={s} onClick={()=>setSelSem(s)}
            style={{padding:"5px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
              background:selSem===s?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
              color:selSem===s?"#fff":"#475569"}}>
            Sem {s}
          </button>
        ))}
      </div>

      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>
          📊 Internal Assessment Marks — Sem {selSem} ({current.session})
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                {["Code","Subject","Faculty","CT-1","CT-2","CT-3","Best 2","Assignment","Attend","Total","Status"].map(h=>(
                  <th key={h} style={{padding:"9px 12px",textAlign:"center",fontWeight:700,color:"#475569",fontSize:11,borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {current.subjects.map((s,i)=>{
                const best2 = getBestTwo(s.ct1,s.ct2,s.ct3);
                const total = getTotal(s);
                const maxTotal = getMax(s);
                const pct = getPct(s);
                const isLab = s.code.endsWith("L");
                return (
                  <tr key={s.code} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                    <td style={{padding:"10px 12px",color:"#6366f1",fontWeight:700,textAlign:"center"}}>{s.code}</td>
                    <td style={{padding:"10px 12px",fontWeight:600,color:"#0f172a"}}>{s.name}</td>
                    <td style={{padding:"10px 12px",color:"#64748b",fontSize:11}}>{s.faculty}</td>
                    {isLab ? (
                      <><td colSpan={3} style={{padding:"10px 12px",textAlign:"center",color:"#94a3b8",fontSize:11}}>— Lab —</td><td style={{padding:"10px 12px",textAlign:"center",color:"#94a3b8"}}>—</td></>
                    ) : (
                      <>
                        {[s.ct1,s.ct2,s.ct3].map((v,j)=>(
                          <td key={j} style={{padding:"10px 12px",textAlign:"center",fontWeight:600,color:v===null?"#94a3b8":v>=16?"#10b981":v>=12?"#f59e0b":"#ef4444"}}>
                            {v===null?"—":v+"/20"}
                          </td>
                        ))}
                        <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:"#6366f1"}}>{best2!==null?best2+"/40":"—"}</td>
                      </>
                    )}
                    <td style={{padding:"10px 12px",textAlign:"center",fontWeight:600,color:"#334155"}}>{s.assign}/{s.max.assign}</td>
                    <td style={{padding:"10px 12px",textAlign:"center",fontWeight:600,color:"#334155"}}>{s.attend}/{s.max.attend}</td>
                    <td style={{padding:"10px 12px",textAlign:"center"}}>
                      <div style={{fontWeight:800,fontSize:14,color:pct>=60?"#10b981":pct>=40?"#f59e0b":"#ef4444"}}>{total}/{maxTotal}</div>
                      <div style={{fontSize:10,color:"#94a3b8"}}>{pct}%</div>
                    </td>
                    <td style={{padding:"10px 12px",textAlign:"center"}}>
                      <span style={{padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:700,
                        background:pct>=60?"#dcfce7":pct>=40?"#fef9c3":"#fee2e2",
                        color:pct>=60?"#16a34a":pct>=40?"#ca8a04":"#dc2626"}}>
                        {pct>=60?"Good":pct>=40?"Average":"Low"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",background:"#f8fafc",borderTop:"1px solid #e2e8f0",fontSize:11,color:"#94a3b8"}}>
          ℹ️ Best 2 out of 3 Class Tests (CT) are counted. Internal marks are subject to verification before finalization.
        </div>
      </div>
    </div>
  );
}

// ─── Phase 2: Real-time Attendance View (Student) ────────────────────────────
function RealTimeAttendanceView() {
  const [liveDate] = useState(new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tick, setTick] = useState(0);

  // Simulate real-time updates every 8 seconds
  useEffect(()=>{
    const interval = setInterval(()=>{
      setLastUpdate(new Date());
      setTick(t=>t+1);
    }, 8000);
    return ()=>clearInterval(interval);
  },[]);

  const todayClasses = [
    {time:"8:00–9:00 AM",code:"CS301",name:"Database Management Systems",room:"201-A",faculty:"Dr. A. Sharma",status:"present",marked:"8:02 AM"},
    {time:"9:00–10:00 AM",code:"CS302",name:"Operating Systems",room:"202-B",faculty:"Prof. S. Das",status:"present",marked:"9:04 AM"},
    {time:"10:00–11:00 AM",code:"CS303",name:"Computer Networks",room:"201-A",faculty:"Dr. R. Panda",status:"absent",marked:null},
    {time:"11:00–12:00 PM",code:"CS304",name:"Theory of Computation",room:"203-C",faculty:"Dr. K. Rath",status:"ongoing",marked:null},
    {time:"2:00–3:00 PM",code:"CS305",name:"Software Engineering",room:"201-A",faculty:"Prof. M. Behera",status:"upcoming",marked:null},
    {time:"3:00–5:00 PM",code:"CS301L",name:"DBMS Lab",room:"DB Lab",faculty:"Dr. A. Sharma",status:"upcoming",marked:null},
  ];
  const statusMap = {
    present:{label:"Present",bg:"#dcfce7",color:"#16a34a",icon:"✅"},
    absent:{label:"Absent",bg:"#fee2e2",color:"#dc2626",icon:"❌"},
    ongoing:{label:"Ongoing",bg:"#fef3c7",color:"#d97706",icon:"🔴"},
    upcoming:{label:"Upcoming",bg:"#f1f5f9",color:"#64748b",icon:"🕐"},
  };

  const subjects = [
    {code:"CS301",name:"DBMS",present:36,total:40},
    {code:"CS302",name:"OS",present:31,total:42},
    {code:"CS303",name:"CN",present:32,total:38},
    {code:"CS304",name:"TOC",present:23,total:35},
    {code:"CS305",name:"SE",present:32,total:40},
  ];

  return (
    <div>
      {/* Live header */}
      <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:12,padding:"16px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#10b981",animation:"pulse 2s infinite"}}/>
            <span style={{color:"#10b981",fontSize:12,fontWeight:700}}>LIVE ATTENDANCE</span>
          </div>
          <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{liveDate}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#94a3b8",fontSize:11}}>Last updated</div>
          <div style={{color:"#e2e8f0",fontSize:13,fontWeight:600}}>{lastUpdate.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
          <div style={{color:"#6366f1",fontSize:10,marginTop:2}}>Auto-refresh every 8s</div>
        </div>
      </div>

      {/* Today's classes */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:10}}>📅 Today's Classes</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {todayClasses.map((c,i)=>{
            const st = statusMap[c.status];
            return (
              <div key={i} style={{background:"#fff",border:`1px solid ${c.status==="ongoing"?"#fcd34d":"#e2e8f0"}`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,
                boxShadow:c.status==="ongoing"?"0 0 0 2px #fef3c7":undefined}}>
                <div style={{fontSize:22,width:32,textAlign:"center",flexShrink:0}}>{st.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{c.name}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{c.time} · {c.room} · {c.faculty}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <span style={{padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:700,background:st.bg,color:st.color}}>{st.label}</span>
                  {c.marked && <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>Marked at {c.marked}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Running totals */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"10px 16px",color:"#fff",fontWeight:700,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>📊 Running Attendance Totals</span>
          <span style={{fontSize:11,opacity:0.8}}>Updated live</span>
        </div>
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
          {subjects.map(s=>{
            const pct = Math.round(s.present/s.total*100);
            const color = pct>=75?"#10b981":pct>=65?"#f59e0b":"#ef4444";
            return (
              <div key={s.code} style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:60,fontSize:11,fontWeight:700,color:"#6366f1",flexShrink:0}}>{s.code}</div>
                <div style={{flex:1,fontSize:12,color:"#334155",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                <div style={{width:120,flexShrink:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                    <span style={{color:"#94a3b8"}}>{s.present}/{s.total}</span>
                    <span style={{fontWeight:700,color}}>{pct}%</span>
                  </div>
                  <div style={{height:6,background:"#f1f5f9",borderRadius:3}}>
                    <div style={{width:pct+"%",height:"100%",background:color,borderRadius:3,transition:"width 1s ease"}}/>
                  </div>
                </div>
                <span style={{width:64,textAlign:"center",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:6,flexShrink:0,
                  background:pct>=75?"#dcfce7":pct>=65?"#fef9c3":"#fee2e2",
                  color:pct>=75?"#16a34a":pct>=65?"#ca8a04":"#dc2626"}}>
                  {pct>=75?"Safe":pct>=65?"Warn":"Risk"}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{padding:"8px 16px",background:"#f8fafc",borderTop:"1px solid #e2e8f0",fontSize:11,color:"#94a3b8"}}>
          🔴 Live: TOC class is currently ongoing — attendance not yet marked
        </div>
      </div>
    </div>
  );
}

// ─── Phase 2: Bulk Messaging (Faculty/Admin) ──────────────────────────────────
function BulkMessagingView({ role }) {
  const [tab, setTab] = useState("compose");
  const [form, setForm] = useState({to:"all",subject:"",message:"",priority:"normal"});
  const [sent, setSent] = useState(false);
  const [sentLog, setSentLog] = useState([
    {id:1,to:"All CSE 3rd Year",subject:"Assignment Deadline Extended",time:"Jun 14, 10:20 AM",count:87,priority:"normal"},
    {id:2,to:"Students with <75% attendance",subject:"⚠️ Attendance Warning",time:"Jun 13, 3:00 PM",count:23,priority:"urgent"},
    {id:3,to:"All Students",subject:"Exam Hall Ticket Release",time:"Jun 12, 9:00 AM",count:420,priority:"normal"},
  ]);

  const targets = role==="admin" ? [
    {value:"all",label:"All Students (420)",icon:"👥"},
    {value:"cse3",label:"CSE 3rd Year (87)",icon:"🎓"},
    {value:"att",label:"Students <75% Attendance (23)",icon:"⚠️"},
    {value:"fee",label:"Fee Defaulters (18)",icon:"💰"},
    {value:"faculty",label:"All Faculty (62)",icon:"🧑‍🏫"},
    {value:"dept",label:"CSE Department — All (149)",icon:"🏛️"},
  ] : [
    {value:"all",label:"All My Students (87)",icon:"👥"},
    {value:"cs301",label:"DBMS Class (43)",icon:"📚"},
    {value:"cs302",label:"OS Class (38)",icon:"📚"},
    {value:"att",label:"Absent Today (8)",icon:"⚠️"},
    {value:"low",label:"Low Attendance (<75%) (15)",icon:"🔴"},
  ];

  const sendMessage = () => {
    if(!form.subject||!form.message) return;
    const target = targets.find(t=>t.value===form.to);
    const count = parseInt(target.label.match(/\((\d+)\)/)?.[1]||"0");
    setSentLog(p=>[{id:Date.now(),to:target.label,subject:form.subject,time:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),count,priority:form.priority},...p]);
    setSent(true);
    setTimeout(()=>{setSent(false);setForm({to:"all",subject:"",message:"",priority:"normal"});},2000);
  };

  return (
    <div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["compose","✍️ Compose"],["log","📤 Sent Log"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 18px",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,
            background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="compose" && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 18px",color:"#fff",fontWeight:700,fontSize:14}}>
            📢 Bulk Message — Send to Group
          </div>
          {sent ? (
            <div style={{padding:"48px",textAlign:"center"}}>
              <div style={{fontSize:52,marginBottom:12}}>✅</div>
              <div style={{fontWeight:700,fontSize:16,color:"#0f172a"}}>Message Sent!</div>
              <div style={{fontSize:13,color:"#64748b",marginTop:6}}>Delivered to {targets.find(t=>t.value===form.to)?.label}</div>
            </div>
          ) : (
            <div style={{padding:"20px 22px",display:"grid",gap:14}}>
              {/* Target audience */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:8}}>SEND TO *</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
                  {targets.map(t=>(
                    <div key={t.value} onClick={()=>setForm(f=>({...f,to:t.value}))}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",border:`2px solid ${form.to===t.value?"#6366f1":"#e2e8f0"}`,borderRadius:10,cursor:"pointer",background:form.to===t.value?"#eef2ff":"#fff",transition:"all .15s"}}>
                      <span style={{fontSize:18}}>{t.icon}</span>
                      <span style={{fontSize:12,fontWeight:form.to===t.value?700:500,color:form.to===t.value?"#6366f1":"#334155"}}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Priority */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:6}}>PRIORITY</label>
                <div style={{display:"flex",gap:8}}>
                  {[["normal","Normal","#6366f1"],["urgent","🚨 Urgent","#ef4444"],["info","ℹ️ Info","#10b981"]].map(([v,l,c])=>(
                    <button key={v} onClick={()=>setForm(f=>({...f,priority:v}))}
                      style={{padding:"6px 16px",border:`2px solid ${form.priority===v?c:"#e2e8f0"}`,borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:form.priority===v?c+"15":"#fff",color:form.priority===v?c:"#64748b",transition:"all .15s"}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {/* Subject */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>SUBJECT *</label>
                <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                  placeholder="e.g. Assignment Deadline Extended"
                  style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              </div>
              {/* Message */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>MESSAGE *</label>
                <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={5}
                  placeholder="Type your message here..."
                  style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
              </div>
              {/* Preview */}
              {form.subject && form.message && (
                <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 16px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:6}}>PREVIEW</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:4}}>📢 {form.subject}</div>
                  <div style={{fontSize:12,color:"#475569",lineHeight:1.6}}>{form.message}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:6}}>→ To: {targets.find(t=>t.value===form.to)?.label}</div>
                </div>
              )}
              <button onClick={sendMessage} disabled={!form.subject||!form.message}
                style={{padding:"12px",background:(!form.subject||!form.message)?"#e2e8f0":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:(!form.subject||!form.message)?"#94a3b8":"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:(!form.subject||!form.message)?"not-allowed":"pointer",fontSize:14}}>
                🚀 Send Message
              </button>
            </div>
          )}
        </div>
      )}

      {tab==="log" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {sentLog.map(m=>(
            <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:44,height:44,borderRadius:10,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📤</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{m.subject}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:2}}>To: {m.to} · {m.time}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontWeight:700,fontSize:14,color:"#6366f1"}}>{m.count}</div>
                <div style={{fontSize:10,color:"#94a3b8"}}>recipients</div>
                {m.priority==="urgent" && <span style={{fontSize:10,fontWeight:700,color:"#ef4444",background:"#fee2e2",padding:"2px 6px",borderRadius:4}}>URGENT</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Phase 2: Attendance Export ───────────────────────────────────────────────
function AttendanceExport() {
  const [exported, setExported] = useState(false);
  const [selSubject, setSelSubject] = useState("CS301");
  const subjects = [
    {code:"CS301",name:"DBMS",students:[
      {roll:"22CS001",name:"Riya Patel",present:36,total:40},
      {roll:"22CS005",name:"Amit Kumar",present:30,total:40},
      {roll:"22CS012",name:"Priya Nair",present:38,total:40},
      {roll:"21CS019",name:"Rahul Gupta",present:28,total:40},
      {roll:"22CS021",name:"Ananya Das",present:35,total:40},
    ]},
    {code:"CS302",name:"OS",students:[
      {roll:"22CS001",name:"Riya Patel",present:31,total:42},
      {roll:"22CS005",name:"Amit Kumar",present:28,total:42},
      {roll:"22CS012",name:"Priya Nair",present:39,total:42},
    ]},
  ];
  const sel = subjects.find(s=>s.code===selSubject);

  const exportCSV = () => {
    const header = ["Roll No","Name","Present","Total","Percentage","Status"];
    const rows = sel.students.map(s=>{
      const pct = Math.round(s.present/s.total*100);
      return [s.roll,s.name,s.present,s.total,pct+"%",pct>=75?"Safe":pct>=65?"Warning":"Shortage"];
    });
    const csv = [header,...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`Attendance_${selSubject}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    setExported(true); setTimeout(()=>setExported(false),2000);
  };

  return (
    <Widget title="📥 Export Attendance CSV">
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div>
          <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>SELECT SUBJECT</label>
          <select value={selSubject} onChange={e=>setSelSubject(e.target.value)}
            style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none"}}>
            {subjects.map(s=><option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
          </select>
        </div>
        <button onClick={exportCSV}
          style={{padding:"9px 20px",background:exported?"#10b981":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:13,marginTop:16,transition:"background .2s"}}>
          {exported?"✅ Downloaded!":"📥 Download CSV"}
        </button>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:"#6366f1",color:"#fff"}}>
            {["Roll No","Name","Present","Total","Percentage","Status"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:11}}>{h}</th>)}
          </tr></thead>
          <tbody>{sel.students.map((s,i)=>{
            const pct=Math.round(s.present/s.total*100);
            return (<tr key={s.roll} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
              <td style={{padding:"8px 10px",color:"#6366f1",fontWeight:700}}>{s.roll}</td>
              <td style={{padding:"8px 10px",fontWeight:600,color:"#0f172a"}}>{s.name}</td>
              <td style={{padding:"8px 10px",textAlign:"center"}}>{s.present}</td>
              <td style={{padding:"8px 10px",textAlign:"center",color:"#64748b"}}>{s.total}</td>
              <td style={{padding:"8px 10px",textAlign:"center",fontWeight:700,color:pct>=75?"#10b981":pct>=65?"#f59e0b":"#ef4444"}}>{pct}%</td>
              <td style={{padding:"8px 10px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,background:pct>=75?"#dcfce7":pct>=65?"#fef9c3":"#fee2e2",color:pct>=75?"#16a34a":pct>=65?"#ca8a04":"#dc2626"}}>{pct>=75?"Safe":pct>=65?"Warning":"Shortage"}</span></td>
            </tr>);
          })}</tbody>
        </table>
      </div>
    </Widget>
  );
}

function AdminReports() {
  const reports = [
    {title:"Student Strength Report",desc:"Dept-wise enrollment, gender ratio, category",icon:"📊",color:"#6366f1"},
    {title:"Faculty Performance Summary",desc:"Appraisal scores, publications, feedback avg",icon:"👨‍🏫",color:"#10b981"},
    {title:"Attendance Summary",desc:"Dept-wise attendance < 75% students list",icon:"📋",color:"#f59e0b"},
    {title:"Fee Collection Report",desc:"Paid, pending, defaulters by department",icon:"💰",color:"#8b5cf6"},
    {title:"Exam Result Analysis",desc:"Pass %, top scorers, backlogs by subject",icon:"🏆",color:"#ef4444"},
    {title:"Research Output Report",desc:"Publications, patents, funded projects",icon:"🔬",color:"#14b8a6"},
    {title:"Placement Statistics",desc:"Campus recruitment, CTC, company-wise",icon:"💼",color:"#f97316"},
    {title:"Infrastructure Utilization",desc:"Lab usage, vehicle requisitions, complaints",icon:"🏢",color:"#64748b"},
  ];
  return (
    <div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:14}}>Generate and download institute-wide reports</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {reports.map(r=>(
          <div key={r.title} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px",display:"flex",gap:14,alignItems:"center",cursor:"pointer",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color;e.currentTarget.style.boxShadow=`0 4px 16px ${r.color}20`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.boxShadow="none";}}>
            <div style={{width:48,height:48,borderRadius:12,background:r.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{r.title}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{r.desc}</div>
            </div>
            <button style={{padding:"6px 14px",background:r.color,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600,flexShrink:0}}>↓ Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phase 3: Academic Calendar ───────────────────────────────────────────────
function AcademicCalendar() {
  const [selMonth, setSelMonth] = useState(5);
  const year = 2026;
  const events = {
    "2026-06-01":["Semester begins"],"2026-06-05":["Last date for course add/drop"],
    "2026-06-10":["Fee payment deadline"],"2026-06-15":["CT-1 week begins"],
    "2026-06-20":["CT-1 results declared"],"2026-06-25":["Mid-semester project submission"],
    "2026-07-04":["CT-2 week begins"],"2026-07-15":["Last date for withdrawal"],
    "2026-07-22":["CT-3 week begins"],"2026-07-28":["End-sem exam form submission"],
    "2026-08-01":["End-semester exams begin"],"2026-08-15":["Independence Day — Holiday"],
    "2026-08-20":["End-semester exams end"],"2026-08-28":["Results declaration"],
    "2026-09-01":["New semester registration opens"],
  };
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysInMonth=new Date(year,selMonth+1,0).getDate();
  const firstDay=new Date(year,selMonth,1).getDay();
  const days=[]; for(let i=0;i<firstDay;i++) days.push(null); for(let i=1;i<=daysInMonth;i++) days.push(i);
  const getKey=d=>`${year}-${String(selMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const today=new Date();
  const upcomingEvents=Object.entries(events).filter(([k])=>new Date(k)>=today).sort(([a],[b])=>new Date(a)-new Date(b)).slice(0,6);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button onClick={()=>setSelMonth(m=>(m-1+12)%12)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:16}}>‹</button>
            <span style={{color:"#fff",fontWeight:700,fontSize:15}}>{months[selMonth]} {year}</span>
            <button onClick={()=>setSelMonth(m=>(m+1)%12)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:16}}>›</button>
          </div>
          <div style={{padding:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"#94a3b8",padding:"4px 0"}}>{d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
              {days.map((d,i)=>{
                if(!d) return <div key={i}/>;
                const key=getKey(d); const hasEvent=events[key];
                const isToday=today.getFullYear()===year&&today.getMonth()===selMonth&&today.getDate()===d;
                return (<div key={i} title={hasEvent?hasEvent.join(", "):""} style={{textAlign:"center",padding:"7px 2px",borderRadius:8,fontSize:12,fontWeight:isToday||hasEvent?700:400,
                  background:isToday?"#6366f1":hasEvent?"#eef2ff":"transparent",color:isToday?"#fff":hasEvent?"#6366f1":"#334155",
                  border:hasEvent&&!isToday?"1px solid #c7d2fe":"1px solid transparent",cursor:hasEvent?"pointer":"default"}}>
                  {d}
                  {hasEvent&&<div style={{width:5,height:5,borderRadius:"50%",background:isToday?"rgba(255,255,255,0.8)":"#6366f1",margin:"2px auto 0"}}/>}
                </div>);
              })}
            </div>
          </div>
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:13}}>📅 Upcoming Events</div>
          <div style={{padding:12,display:"flex",flexDirection:"column",gap:8}}>
            {upcomingEvents.map(([date,evts])=>(
              <div key={date} style={{display:"flex",gap:10,padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0"}}>
                <div style={{textAlign:"center",background:"#6366f1",borderRadius:8,padding:"4px 8px",flexShrink:0}}>
                  <div style={{color:"rgba(255,255,255,0.8)",fontSize:9,fontWeight:700}}>{months[new Date(date).getMonth()].slice(0,3).toUpperCase()}</div>
                  <div style={{color:"#fff",fontWeight:800,fontSize:16,lineHeight:1}}>{new Date(date).getDate()}</div>
                </div>
                <div>{evts.map((e,i)=><div key={i} style={{fontSize:12,fontWeight:600,color:"#0f172a",lineHeight:1.4}}>{e}</div>)}
                  <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{new Date(date).toLocaleDateString("en-GB",{weekday:"long"})}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phase 3: Department Management ──────────────────────────────────────────
function DepartmentManagement() {
  const [depts,setDepts]=useState([
    {id:1,name:"Computer Science & Engineering",code:"CSE",hod:"Dr. A.K. Sharma",students:640,faculty:42,courses:28,estd:1994},
    {id:2,name:"Electronics & Communication Engg",code:"ECE",hod:"Prof. R.K. Panda",students:520,faculty:38,courses:24,estd:1994},
    {id:3,name:"Mechanical Engineering",code:"MECH",hod:"Dr. S. Das",students:480,faculty:35,courses:22,estd:1994},
    {id:4,name:"Civil Engineering",code:"CIVIL",hod:"Dr. M. Behera",students:400,faculty:30,courses:20,estd:1996},
    {id:5,name:"Electrical & Electronics Engg",code:"EEE",hod:"Prof. K. Nair",students:360,faculty:28,courses:18,estd:1998},
    {id:6,name:"Master of Business Administration",code:"MBA",hod:"Dr. P. Singh",students:240,faculty:22,courses:16,estd:2002},
  ]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",code:"",hod:"",estd:""});
  const [search,setSearch]=useState("");
  const addDept=()=>{ if(!form.name||!form.code) return; setDepts(p=>[...p,{id:Date.now(),...form,students:0,faculty:0,courses:0}]); setForm({name:"",code:"",hod:"",estd:""}); setShow(false); };
  const filtered=depts.filter(d=>d.name.toLowerCase().includes(search.toLowerCase())||d.code.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search department..." style={{padding:"8px 14px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",width:240,fontFamily:"inherit"}}/>
        <button onClick={()=>setShow(true)} style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:13}}>+ Add Department</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {filtered.map(d=>(
          <div key={d.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px",borderLeft:"4px solid #6366f1"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontWeight:800,fontSize:15,color:"#0f172a"}}>{d.code}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{d.name}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>HOD: {d.hod} · Est. {d.estd}</div>
              </div>
              <span style={{padding:"3px 10px",background:"#dcfce7",color:"#16a34a",borderRadius:8,fontSize:10,fontWeight:700}}>ACTIVE</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[["Students",d.students,"🎓"],["Faculty",d.faculty,"👨‍🏫"],["Courses",d.courses,"📚"]].map(([l,v,ic])=>(
                <div key={l} style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                  <div style={{fontSize:16}}>{ic}</div>
                  <div style={{fontWeight:800,fontSize:15,color:"#6366f1"}}>{v}</div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {show&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShow(false)}>
          <div style={{background:"#fff",borderRadius:14,width:440,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>Add Department</span>
              <button onClick={()=>setShow(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            <div style={{padding:"20px 22px",display:"grid",gap:12}}>
              {[["Department Name","name","e.g. Biotechnology"],["Short Code","code","e.g. BT"],["Head of Department","hod","e.g. Dr. Name"],["Year Established","estd","e.g. 2010"]].map(([label,key,ph])=>(
                <div key={key}>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>{label.toUpperCase()}</label>
                  <input value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}
              <button onClick={addDept} style={{padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14}}>Add Department</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Phase 3: Course Management ───────────────────────────────────────────────
function CourseManagement() {
  const [courses,setCourses]=useState([
    {id:1,code:"CS301",name:"Database Management Systems",dept:"CSE",sem:5,credits:4,type:"Theory",faculty:"Dr. A. Sharma",enrolled:87},
    {id:2,code:"CS302",name:"Operating Systems",dept:"CSE",sem:5,credits:4,type:"Theory",faculty:"Prof. S. Das",enrolled:87},
    {id:3,code:"CS303",name:"Computer Networks",dept:"CSE",sem:5,credits:3,type:"Theory",faculty:"Dr. R. Panda",enrolled:87},
    {id:4,code:"CS301L",name:"DBMS Lab",dept:"CSE",sem:5,credits:2,type:"Lab",faculty:"Dr. A. Sharma",enrolled:87},
    {id:5,code:"EC201",name:"Signals and Systems",dept:"ECE",sem:3,credits:4,type:"Theory",faculty:"Prof. R.K. Panda",enrolled:65},
    {id:6,code:"ME301",name:"Thermodynamics",dept:"MECH",sem:5,credits:4,type:"Theory",faculty:"Dr. S. Das",enrolled:72},
  ]);
  const [selDept,setSelDept]=useState("ALL");
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({code:"",name:"",dept:"CSE",sem:"",credits:"",type:"Theory",faculty:""});
  const depts=["ALL","CSE","ECE","MECH","CIVIL","EEE","MBA"];
  const filtered=selDept==="ALL"?courses:courses.filter(c=>c.dept===selDept);
  const addCourse=()=>{ if(!form.code||!form.name) return; setCourses(p=>[...p,{id:Date.now(),...form,sem:parseInt(form.sem),credits:parseInt(form.credits),enrolled:0}]); setForm({code:"",name:"",dept:"CSE",sem:"",credits:"",type:"Theory",faculty:""}); setShow(false); };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {depts.map(d=><button key={d} onClick={()=>setSelDept(d)} style={{padding:"6px 14px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,background:selDept===d?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",color:selDept===d?"#fff":"#475569"}}>{d}</button>)}
        </div>
        <button onClick={()=>setShow(true)} style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:13}}>+ Add Course</button>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:"#6366f1",color:"#fff"}}>{["Code","Course Name","Dept","Sem","Credits","Type","Faculty","Enrolled"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((c,i)=>(<tr key={c.id} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
            <td style={{padding:"10px 12px",color:"#6366f1",fontWeight:700}}>{c.code}</td>
            <td style={{padding:"10px 12px",fontWeight:600,color:"#0f172a"}}>{c.name}</td>
            <td style={{padding:"10px 12px",color:"#64748b"}}>{c.dept}</td>
            <td style={{padding:"10px 12px",textAlign:"center"}}>{c.sem}</td>
            <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:"#6366f1"}}>{c.credits}</td>
            <td style={{padding:"10px 12px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,background:c.type==="Lab"?"#fef3c7":"#eef2ff",color:c.type==="Lab"?"#d97706":"#4338ca"}}>{c.type}</span></td>
            <td style={{padding:"10px 12px",fontSize:11,color:"#64748b"}}>{c.faculty}</td>
            <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:"#10b981"}}>{c.enrolled}</td>
          </tr>))}</tbody>
        </table>
      </div>
      {show&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShow(false)}>
          <div style={{background:"#fff",borderRadius:14,width:460,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>Add Course</span>
              <button onClick={()=>setShow(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            <div style={{padding:"18px 20px",display:"grid",gap:11}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Course Code","code","CS401"],["Course Name","name","e.g. Machine Learning"]].map(([l,k,p])=>(
                  <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>{l.toUpperCase()}</label>
                  <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={p} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}/></div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>DEPT</label>
                  <select value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}>
                    {["CSE","ECE","MECH","CIVIL","EEE","MBA"].map(d=><option key={d}>{d}</option>)}</select></div>
                <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>SEM</label>
                  <input type="number" min="1" max="8" value={form.sem} onChange={e=>setForm(f=>({...f,sem:e.target.value}))} placeholder="5" style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}/></div>
                <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>CREDITS</label>
                  <input type="number" min="1" max="6" value={form.credits} onChange={e=>setForm(f=>({...f,credits:e.target.value}))} placeholder="4" style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>TYPE</label>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}>
                    {["Theory","Lab","Elective","Project"].map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>FACULTY</label>
                  <input value={form.faculty} onChange={e=>setForm(f=>({...f,faculty:e.target.value}))} placeholder="Dr. Name" style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit"}}/></div>
              </div>
              <button onClick={addCourse} style={{padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14}}>Add Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Phase 3: Fee Management ──────────────────────────────────────────────────
function FeeManagement() {
  const [tab,setTab]=useState("overview");
  const feeData=[
    {id:"22CS001",name:"Riya Patel",dept:"CSE",year:3,total:95000,paid:95000,due:0,status:"paid",last:"Mar 10, 2026"},
    {id:"22CS005",name:"Amit Kumar",dept:"CSE",year:3,total:95000,paid:47500,due:47500,status:"partial",last:"Dec 5, 2025"},
    {id:"22CS012",name:"Priya Nair",dept:"CSE",year:3,total:95000,paid:0,due:95000,status:"unpaid",last:"—"},
    {id:"21EC001",name:"Rahul Das",dept:"ECE",year:4,total:92000,paid:92000,due:0,status:"paid",last:"Feb 28, 2026"},
    {id:"22ME003",name:"Sneha Panda",dept:"MECH",year:3,total:90000,paid:45000,due:45000,status:"partial",last:"Jan 15, 2026"},
    {id:"22CS019",name:"Aryan Singh",dept:"CSE",year:3,total:95000,paid:0,due:95000,status:"unpaid",last:"—"},
  ];
  const stats=[{label:"Total Collected",value:"₹2,34,50,000",icon:"💰",color:"#10b981"},{label:"Outstanding Dues",value:"₹18,75,000",icon:"⚠️",color:"#ef4444"},{label:"Fully Paid",value:"2,847",icon:"✅",color:"#6366f1"},{label:"Defaulters",value:"234",icon:"🔴",color:"#f59e0b"}];
  const sc={paid:{bg:"#dcfce7",c:"#16a34a"},partial:{bg:"#fef3c7",c:"#d97706"},unpaid:{bg:"#fee2e2",c:"#dc2626"}};
  const exportDues=()=>{ const rows=feeData.filter(f=>f.due>0).map(f=>[f.id,f.name,f.dept,f.year,f.total,f.paid,f.due,f.status]); const csv=[["Roll","Name","Dept","Year","Total","Paid","Due","Status"],...rows].map(r=>r.join(",")).join("\n"); const blob=new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="FeeDefaulters.csv"; a.click(); };
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
        {stats.map(s=><div key={s.label} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",borderLeft:`4px solid ${s.color}`}}><div style={{fontSize:20,marginBottom:4}}>{s.icon}</div><div style={{fontSize:18,fontWeight:800,color:s.color}}>{s.value}</div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.label}</div></div>)}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3}}>
          {[["overview","Overview"],["defaulters","Defaulters"],["structure","Fee Structure"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
          ))}
        </div>
        <button onClick={exportDues} style={{padding:"7px 16px",background:"#f0fdf4",color:"#16a34a",border:"1px solid #86efac",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12}}>📥 Export Dues CSV</button>
      </div>
      {(tab==="overview"||tab==="defaulters")&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#6366f1",color:"#fff"}}>{["Roll No","Name","Dept","Year","Total","Paid","Due","Status","Last Payment"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11}}>{h}</th>)}</tr></thead>
            <tbody>{(tab==="defaulters"?feeData.filter(f=>f.due>0):feeData).map((f,i)=>(
              <tr key={f.id} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                <td style={{padding:"10px 12px",color:"#6366f1",fontWeight:700}}>{f.id}</td>
                <td style={{padding:"10px 12px",fontWeight:600,color:"#0f172a"}}>{f.name}</td>
                <td style={{padding:"10px 12px",color:"#64748b"}}>{f.dept}</td>
                <td style={{padding:"10px 12px",textAlign:"center"}}>{f.year}</td>
                <td style={{padding:"10px 12px",fontWeight:600}}>₹{f.total.toLocaleString()}</td>
                <td style={{padding:"10px 12px",color:"#10b981",fontWeight:600}}>₹{f.paid.toLocaleString()}</td>
                <td style={{padding:"10px 12px",color:f.due>0?"#ef4444":"#10b981",fontWeight:700}}>₹{f.due.toLocaleString()}</td>
                <td style={{padding:"10px 12px"}}><span style={{padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:700,background:sc[f.status].bg,color:sc[f.status].c}}>{f.status.toUpperCase()}</span></td>
                <td style={{padding:"10px 12px",fontSize:11,color:"#94a3b8"}}>{f.last}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab==="structure"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          {[{dept:"CSE/ECE/EEE",t:70000,d:12000,e:5000,m:8000},{dept:"MECH/CIVIL",t:68000,d:11000,e:5000,m:6000},{dept:"MBA",t:90000,d:15000,e:6000,m:9000},{dept:"PhD",t:40000,d:8000,e:3000,m:5000}].map(d=>(
            <div key={d.dept} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontWeight:800,fontSize:14,color:"#6366f1",marginBottom:12}}>{d.dept}</div>
              {[["Tuition Fee",d.t],["Development Fee",d.d],["Exam Fee",d.e],["Miscellaneous",d.m]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}><span style={{fontSize:12,color:"#475569"}}>{l}</span><span style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>₹{v.toLocaleString()}</span></div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:4}}><span style={{fontSize:13,fontWeight:700}}>Total</span><span style={{fontSize:13,fontWeight:800,color:"#6366f1"}}>₹{(d.t+d.d+d.e+d.m).toLocaleString()}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Phase 3: Activity & Audit Logs ───────────────────────────────────────────
function ActivityAuditLog() {
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const logs=[
    {id:1,user:"Admin",role:"admin",action:"Approved user Riya Patel (Student)",module:"User Management",time:"2026-06-15 10:34 AM",type:"approve",ip:"192.168.1.10"},
    {id:2,user:"Dr. Priya Singh",role:"faculty",action:"Uploaded attendance for CS301 — 43 students",module:"Attendance",time:"2026-06-15 10:20 AM",type:"upload",ip:"192.168.1.22"},
    {id:3,user:"Riya Patel",role:"student",action:"Submitted assignment: ER Diagram for Hospital DB",module:"Assignments",time:"2026-06-15 09:55 AM",type:"submit",ip:"192.168.2.45"},
    {id:4,user:"Admin",role:"admin",action:"Bulk approved 5 pending users",module:"User Management",time:"2026-06-15 09:30 AM",type:"approve",ip:"192.168.1.10"},
    {id:5,user:"Prof. Ramesh Panda",role:"faculty",action:"Sent bulk message to CS302 students",module:"Messaging",time:"2026-06-15 09:10 AM",type:"message",ip:"192.168.1.31"},
    {id:6,user:"Amit Kumar",role:"student",action:"Applied for leave: Medical (Jun 18–20)",module:"Leave",time:"2026-06-14 04:15 PM",type:"leave",ip:"192.168.2.67"},
    {id:7,user:"Admin",role:"admin",action:"Updated fee structure for CSE/ECE",module:"Fee Management",time:"2026-06-14 02:00 PM",type:"update",ip:"192.168.1.10"},
    {id:8,user:"Priya Nair",role:"student",action:"Logged in to portal",module:"Auth",time:"2026-06-14 08:45 AM",type:"login",ip:"192.168.2.90"},
    {id:9,user:"Dr. Sunita Das",role:"faculty",action:"Created assignment: Subnetting Practice for CN",module:"Assignments",time:"2026-06-13 03:20 PM",type:"create",ip:"192.168.1.44"},
    {id:10,user:"Admin",role:"admin",action:"Rejected user registration: Unknown user",module:"User Management",time:"2026-06-13 11:05 AM",type:"reject",ip:"192.168.1.10"},
  ];
  const tc={approve:{bg:"#dcfce7",c:"#16a34a"},upload:{bg:"#dbeafe",c:"#2563eb"},submit:{bg:"#eef2ff",c:"#6366f1"},message:{bg:"#fef3c7",c:"#d97706"},leave:{bg:"#f3e8ff",c:"#9333ea"},update:{bg:"#e0f2fe",c:"#0284c7"},login:{bg:"#f1f5f9",c:"#475569"},create:{bg:"#dcfce7",c:"#16a34a"},reject:{bg:"#fee2e2",c:"#dc2626"}};
  const ri={admin:"⚙️",faculty:"🧑‍🏫",student:"🎓"};
  const filtered=logs.filter(l=>(filter==="all"||l.role===filter)&&(search===""||l.action.toLowerCase().includes(search.toLowerCase())||l.user.toLowerCase().includes(search.toLowerCase())));
  const exportLogs=()=>{ const csv=[["ID","User","Role","Action","Module","Time","IP"],...filtered.map(l=>[l.id,l.user,l.role,`"${l.action}"`,l.module,l.time,l.ip])].map(r=>r.join(",")).join("\n"); const blob=new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="AuditLog.csv"; a.click(); };
  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:14,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search logs..." style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",width:200,fontFamily:"inherit"}}/>
          <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3}}>
            {[["all","All"],["admin","Admin"],["faculty","Faculty"],["student","Student"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)} style={{padding:"5px 12px",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,background:filter===v?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:filter===v?"#fff":"#64748b"}}>{l}</button>
            ))}
          </div>
        </div>
        <button onClick={exportLogs} style={{padding:"7px 16px",background:"#f0fdf4",color:"#16a34a",border:"1px solid #86efac",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12}}>📥 Export CSV</button>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        {filtered.map((l,i)=>(
          <div key={l.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
            <div style={{fontSize:20,flexShrink:0,marginTop:2}}>{ri[l.role]}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{l.user}</span>
                <span style={{padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:700,background:tc[l.type]?.bg||"#f1f5f9",color:tc[l.type]?.c||"#475569"}}>{l.type.toUpperCase()}</span>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>· {l.module}</span>
              </div>
              <div style={{fontSize:12,color:"#475569"}}>{l.action}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:11,color:"#94a3b8"}}>{l.time}</div>
              <div style={{fontSize:10,color:"#cbd5e1",marginTop:2}}>IP: {l.ip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTimetable() {
  const depts = ["CSE","ECE","MECH","CIVIL","EEE"];
  const sems  = ["1","2","3","4","5","6","7","8"];
  const [selDept, setSelDept] = useState("CSE");
  const [selSem,  setSelSem]  = useState("5");
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const slots = ["9–10","10–11","11–12","12–1","2–3","3–4","4–5"];
  const sample = {
    "Monday":   ["CS301/Dr.A","CS301/Dr.A","—","CS302/Prof.S","BREAK","CS304/Dr.K","—"],
    "Tuesday":  ["CS303/Dr.R","—","CS305/Prof.M","—","BREAK","CS301/Dr.A","—"],
    "Wednesday":["—","CS302/Prof.S","CS302/Prof.S","—","BREAK","CS304/Dr.K","CS305/Prof.M"],
    "Thursday": ["CS301/Dr.A","—","CS303/Dr.R","CS303/Dr.R","BREAK","—","CS302/Prof.S"],
    "Friday":   ["CS305/Prof.M","CS304/Dr.K","—","CS301/Dr.A","BREAK","—","—"],
    "Saturday": ["CS301L/Dr.A","CS301L/Dr.A","—","—","BREAK","—","—"],
  };
  return (
    <div>
      <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-end"}}>
        {[["DEPARTMENT",depts,selDept,setSelDept],["SEMESTER",sems,selSem,setSelSem]].map(([l,opts,val,set])=>(
          <div key={l}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>{l}</label>
          <select value={val} onChange={e=>set(e.target.value)} style={{padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit",minWidth:140}}>
            {opts.map(o=><option key={o}>{l==="SEMESTER"?"Sem "+o:o}</option>)}</select></div>
        ))}
        <button style={{padding:"8px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:12}}>📥 Download PDF</button>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 16px",color:"#fff",fontWeight:700,fontSize:13}}>
          Timetable — {selDept} · Semester {selSem}
        </div>
        <div style={{overflowX:"auto",padding:12}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#f8fafc"}}>
              <th style={{padding:"8px 10px",fontWeight:600,color:"#475569",textAlign:"left",borderBottom:"2px solid #e2e8f0",minWidth:90}}>TIME</th>
              {days.map(d=><th key={d} style={{padding:"8px 8px",fontWeight:600,color:"#475569",fontSize:11,borderBottom:"2px solid #e2e8f0",textAlign:"center"}}>{d.slice(0,3)}</th>)}
            </tr></thead>
            <tbody>{slots.map((slot,si)=>(
              <tr key={slot} style={{borderBottom:"1px solid #f1f5f9",background:si%2===0?"#fff":"#fafbff"}}>
                <td style={{padding:"7px 10px",fontWeight:600,color:"#64748b",fontSize:11}}>{slot}</td>
                {days.map(d=>{
                  const cell=(sample[d]||[])[si]||"—";
                  if(cell==="BREAK") return <td key={d} style={{padding:"6px",textAlign:"center",background:"#fef9c3",fontSize:9,fontWeight:600,color:"#92400e"}}>BREAK</td>;
                  if(cell==="—") return <td key={d} style={{padding:"6px",textAlign:"center",color:"#e2e8f0"}}>—</td>;
                  const [code,fac]=cell.split("/");
                  return <td key={d} style={{padding:"4px 5px"}}>
                    <div style={{background:"#eef2ff",borderLeft:"3px solid #6366f1",borderRadius:3,padding:"3px 5px"}}>
                      <div style={{fontWeight:700,fontSize:10,color:"#6366f1"}}>{code}</div>
                      <div style={{fontSize:9,color:"#94a3b8"}}>{fac}</div>
                    </div>
                  </td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminNotices() {
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({title:"",category:"General",audience:"All",body:""});
  const [notices, setNotices] = useState([
    {title:"End Semester Exam Schedule — June 2026",category:"Exam",audience:"All",date:"Jun 7",views:1240},
    {title:"GATE 2027 Coaching Registration",category:"Academic",audience:"Students",date:"Jun 5",views:680},
    {title:"Faculty Appraisal Deadline: Jun 30",category:"HR",audience:"Faculty",date:"Jun 3",views:312},
    {title:"ITER Fest 2026 — Registration Open",category:"Cultural",audience:"Students",date:"Jun 1",views:2100},
  ]);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button onClick={()=>setShowForm(true)} style={{padding:"8px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>+ Post Notice</button>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#f8fafc"}}>{["Title","Category","Audience","Date","Views","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
          <tbody>{notices.map((n,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
              <td style={{padding:"10px 12px",fontWeight:500,color:"#0f172a"}}>{n.title}</td>
              <td style={{padding:"10px 12px"}}><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#eef2ff",color:"#6366f1"}}>{n.category}</span></td>
              <td style={{padding:"10px 12px",color:"#64748b"}}>{n.audience}</td>
              <td style={{padding:"10px 12px",color:"#64748b"}}>{n.date}</td>
              <td style={{padding:"10px 12px",fontWeight:600,color:"#334155"}}>{n.views.toLocaleString()}</td>
              <td style={{padding:"10px 12px",display:"flex",gap:5}}>
                <button style={{padding:"3px 8px",background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:5,cursor:"pointer",fontSize:10,fontWeight:600}}>Edit</button>
                <button style={{padding:"3px 8px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:5,cursor:"pointer",fontSize:10,fontWeight:600}}>Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowForm(false)}>
          <div style={{background:"#fff",borderRadius:14,width:500,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"13px 18px",display:"flex",justifyContent:"space-between"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:14}}>Post New Notice</span>
              <button onClick={()=>setShowForm(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:24,height:24,cursor:"pointer"}}>✕</button>
            </div>
            {done?<div style={{padding:"32px",textAlign:"center"}}><div style={{fontSize:40}}>✅</div><div style={{fontWeight:700,marginTop:8}}>Notice Published!</div></div>:(
              <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:10}}>
                <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>TITLE</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["Category","category",["General","Exam","Academic","HR","Cultural","Research"]],["Audience","audience",["All","Students","Faculty","Admin"]]].map(([l,k,opts])=>(
                    <div key={k}><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>{l.toUpperCase()}</label>
                    <select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"8px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
                  ))}
                </div>
                <div><label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:3}}>BODY</label>
                <textarea rows={4} value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/></div>
                <button onClick={()=>{if(form.title&&form.body){setNotices(p=>[{...form,date:"Jun 12",views:0},...p]);setDone(true);setTimeout(()=>{setDone(false);setShowForm(false);setForm({title:"",category:"General",audience:"All",body:""});},1500);}}}
                  style={{padding:"10px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14}}>Publish Notice</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NoticesView() {
  const notices=[
    {title:"End-Semester Examination Schedule June 2024",date:"Jun 7",cat:"Exam",body:"The schedule for End-Semester examinations is now published. Students are requested to check their hall tickets on the portal."},
    {title:"Assignment Submission Deadline Extended",date:"Jun 6",cat:"Academic",body:"The deadline for CS301 assignment has been extended to June 14, 2024."},
    {title:"GATE 2027 Free Coaching Registration",date:"Jun 5",cat:"Opportunity",body:"ITER is offering free GATE coaching for 3rd year students. Register before June 20."},
    {title:"Hostel Vacation Checkout",date:"Jun 4",cat:"Hostel",body:"Students are required to vacate hostel rooms by June 20 for summer vacation."},
  ];
  const [open,setOpen]=useState(null);
  return (
    <div style={{display:"grid",gridTemplateColumns:open!==null?"1fr 1.4fr":"1fr",gap:14}}>
      <Widget title="Notices and Announcements">
        {notices.map((n,i)=>(
          <div key={i} onClick={()=>setOpen(i===open?null:i)} style={{padding:"10px 0",borderBottom:"1px solid #f0f0f0",cursor:"pointer",background:open===i?"#fdf7f7":"transparent"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontWeight:open===i?700:500,fontSize:13,color:open===i?"#6366f1":"#333"}}>{n.title}</div>
              <span style={{padding:"1px 7px",background:"#f5f5f5",borderRadius:2,fontSize:11,color:"#555",marginLeft:8,whiteSpace:"nowrap"}}>{n.cat}</span>
            </div>
            <div style={{fontSize:11,color:"#aaa",marginTop:2}}>{n.date}</div>
          </div>
        ))}
      </Widget>
      {open!==null&&(
        <Widget title={notices[open].cat}>
          <div style={{fontWeight:700,fontSize:15,color:"#333",marginBottom:6}}>{notices[open].title}</div>
          <div style={{fontSize:12,color:"#aaa",marginBottom:12}}>{notices[open].date}</div>
          <div style={{fontSize:13,color:"#555",lineHeight:1.8}}>{notices[open].body}</div>
        </Widget>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
// ─── HALL TICKET ─────────────────────────────────────────────────────────────
function HallTicket({ user }) {
  const [printed, setPrinted] = useState(false);
  const exams = [
    {date:"Jun 18",day:"Thu",code:"CS301",name:"Database Management Systems",time:"10:00 AM – 1:00 PM",room:"201-A",seat:"A-14"},
    {date:"Jun 20",day:"Sat",code:"CS302",name:"Operating Systems",time:"10:00 AM – 1:00 PM",room:"202-B",seat:"B-07"},
    {date:"Jun 22",day:"Mon",code:"CS303",name:"Computer Networks",time:"2:00 PM – 5:00 PM",room:"201-A",seat:"A-14"},
    {date:"Jun 25",day:"Thu",code:"CS304",name:"Theory of Computation",time:"10:00 AM – 1:00 PM",room:"203-C",seat:"C-21"},
    {date:"Jun 27",day:"Sat",code:"CS305",name:"Software Engineering",time:"2:00 PM – 5:00 PM",room:"201-A",seat:"A-14"},
    {date:"Jun 30",day:"Tue",code:"CS301L",name:"DBMS Lab Practical",time:"10:00 AM – 1:00 PM",room:"DB Lab",seat:"DB-05"},
  ];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:14,color:"#64748b"}}>Your hall ticket for End Semester Exam — June 2026</div>
        <button onClick={()=>{setPrinted(true);setTimeout(()=>setPrinted(false),3000);}}
          style={{padding:"9px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
          🖨 Download / Print
        </button>
      </div>
      {printed&&<div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#16a34a",fontWeight:600}}>✅ Hall Ticket downloaded as PDF!</div>}

      <div style={{background:"#fff",border:"2px solid #6366f1",borderRadius:12,overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:"#fff",fontWeight:900,fontSize:18,letterSpacing:0.5}}>ITER — SOA University</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>End Semester Examination — June 2026</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:2}}>HALL TICKET / ADMIT CARD</div>
          </div>
          <div style={{width:60,height:60,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🎓</div>
        </div>

        {/* Student info */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,borderBottom:"2px solid #e2e8f0"}}>
          {[
            ["Student Name", user.name],
            ["Roll Number", user.roll||"520CS2008"],
            ["Department", "Computer Science & Engineering"],
            ["Programme", "B.Tech (CSE)"],
            ["Semester", "5th Semester (Odd)"],
            ["Academic Year", "2025-26"],
          ].map(([l,v],i)=>(
            <div key={i} style={{padding:"10px 16px",borderRight:i%3!==2?"1px solid #f1f5f9":"none",borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fafbff":"#fff"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",marginBottom:2}}>{l}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Exam schedule */}
        <div style={{padding:"0 0 16px"}}>
          <div style={{padding:"10px 16px",background:"#f8fafc",fontWeight:700,fontSize:12,color:"#475569",borderBottom:"1px solid #e2e8f0"}}>
            EXAMINATION SCHEDULE
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#eef2ff"}}>
                {["Date","Day","Code","Subject","Time","Room","Seat No."].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exams.map((e,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                  <td style={{padding:"9px 12px",fontWeight:700,color:"#6366f1"}}>{e.date}</td>
                  <td style={{padding:"9px 12px",color:"#64748b"}}>{e.day}</td>
                  <td style={{padding:"9px 12px",fontWeight:600,color:"#334155"}}>{e.code}</td>
                  <td style={{padding:"9px 12px",color:"#0f172a"}}>{e.name}</td>
                  <td style={{padding:"9px 12px",color:"#64748b",whiteSpace:"nowrap"}}>{e.time}</td>
                  <td style={{padding:"9px 12px",fontWeight:600,color:"#334155"}}>{e.room}</td>
                  <td style={{padding:"9px 12px"}}><span style={{background:"#eef2ff",color:"#6366f1",padding:"2px 8px",borderRadius:6,fontWeight:700,fontSize:12}}>{e.seat}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div style={{padding:"12px 16px",background:"#fef9c3",borderTop:"1px solid #fde68a"}}>
          <div style={{fontWeight:700,fontSize:12,color:"#92400e",marginBottom:4}}>IMPORTANT INSTRUCTIONS</div>
          <div style={{fontSize:11,color:"#78350f",lineHeight:1.8}}>
            1. Carry this hall ticket to every examination. &nbsp;|&nbsp; 2. Reach the examination hall 15 minutes before the start time. &nbsp;|&nbsp;
            3. Mobile phones and electronic devices are strictly prohibited. &nbsp;|&nbsp; 4. Carry a valid photo ID along with this hall ticket.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GRIEVANCE PORTAL ─────────────────────────────────────────────────────────
function GrievancePortal() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({type:"Academic",sendTo:"HOD",subject:"",desc:""});
  const [submitted, setSubmitted] = useState(false);
  const [grievances, setGrievances] = useState([
    {id:"GR001",type:"Academic",subject:"Marks discrepancy in CS301 Mid-1",sendTo:"HOD",date:"Jun 3",status:"Resolved",stages:[{l:"Submitted",d:true},{l:"HOD Review",d:true},{l:"Resolved",d:true}],reply:"Marks have been corrected. Please check the portal."},
    {id:"GR002",type:"Infrastructure",subject:"Projector not working in LH-101",sendTo:"Dean Academic",date:"Jun 7",status:"In Progress",stages:[{l:"Submitted",d:true},{l:"Dean Review",d:true},{l:"Action Taken",d:false}],reply:""},
    {id:"GR003",type:"Hostel",subject:"Water supply issue in C Block",sendTo:"HOD",date:"Jun 9",status:"Pending",stages:[{l:"Submitted",d:true},{l:"HOD Review",d:false},{l:"Resolved",d:false}],reply:""},
  ]);

  const types = ["Academic","Examination","Infrastructure","Hostel","Financial","Other"];
  const recipients = ["HOD","Dean Academic","Dean Students","Principal"];
  const statusColor = s=>s==="Resolved"?{bg:"#dcfce7",c:"#16a34a"}:s==="In Progress"?{bg:"#fef9c3",c:"#ca8a04"}:{bg:"#fee2e2",c:"#dc2626"};

  const handleSubmit = () => {
    if(!form.subject.trim()||!form.desc.trim()) return;
    setGrievances(prev=>[{
      id:"GR00"+(prev.length+1), type:form.type, subject:form.subject, sendTo:form.sendTo,
      date:"Jun 10", status:"Pending",
      stages:[{l:"Submitted",d:true},{l:`${form.sendTo} Review`,d:false},{l:"Resolved",d:false}],
      reply:"",
    },...prev]);
    setSubmitted(true);
    setTimeout(()=>{setSubmitted(false);setShowForm(false);setForm({type:"Academic",sendTo:"HOD",subject:"",desc:""});},2000);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:13,color:"#64748b"}}>Raise complaints or concerns to the appropriate authority</div>
        <button onClick={()=>setShowForm(true)} style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
          + New Grievance
        </button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[["Total Raised","3","#6366f1"],["Resolved","1","#10b981"],["Pending","2","#f59e0b"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px",borderTop:`4px solid ${c}`,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>

      {grievances.map(g=>{
        const sc=statusColor(g.status);
        return (
          <div key={g.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginBottom:12}}>
            <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"1px solid #f1f5f9"}}>
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{g.subject}</span>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#eef2ff",color:"#6366f1"}}>{g.type}</span>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:sc.bg,color:sc.c}}>{g.status}</span>
                </div>
                <div style={{fontSize:12,color:"#94a3b8"}}>To: {g.sendTo} · {g.date} · {g.id}</div>
              </div>
            </div>
            {/* Stage tracker */}
            <div style={{padding:"12px 16px",background:"#fafbff"}}>
              <div style={{display:"flex",alignItems:"center"}}>
                {g.stages.map((st,si)=>(
                  <div key={si} style={{display:"flex",alignItems:"center",flex:si<g.stages.length-1?1:"initial"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:80}}>
                      <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,
                        background:st.d?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",color:st.d?"#fff":"#94a3b8",border:st.d?"none":"2px dashed #cbd5e1"}}>
                        {st.d?"✓":si+1}
                      </div>
                      <div style={{fontSize:10,fontWeight:600,color:st.d?"#6366f1":"#94a3b8",textAlign:"center"}}>{st.l}</div>
                    </div>
                    {si<g.stages.length-1&&<div style={{flex:1,height:2,background:g.stages[si+1].d?"#6366f1":"#e2e8f0",margin:"0 4px",marginBottom:16}}/>}
                  </div>
                ))}
              </div>
              {g.reply&&<div style={{marginTop:8,background:"#dcfce7",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#166534"}}>💬 Response: {g.reply}</div>}
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {showForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowForm(false)}>
          <div style={{background:"#fff",borderRadius:14,width:500,boxShadow:"0 20px 60px rgba(0,0,0,0.25)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>📋 New Grievance</div>
              <button onClick={()=>setShowForm(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,color:"#fff",width:26,height:26,cursor:"pointer",fontSize:14}}>✕</button>
            </div>
            {submitted?<div style={{padding:"48px 24px",textAlign:"center"}}><div style={{fontSize:48}}>✅</div><div style={{fontWeight:700,fontSize:16,marginTop:10}}>Grievance Submitted!</div></div>:(
              <div style={{padding:"18px 20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  {[["Type",form.type,v=>setForm(f=>({...f,type:v})),types],["Send To",form.sendTo,v=>setForm(f=>({...f,sendTo:v})),recipients]].map(([l,val,set,opts])=>(
                    <div key={l}>
                      <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>{l.toUpperCase()}</label>
                      <select value={val} onChange={e=>set(e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>SUBJECT</label>
                  <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Brief subject of your grievance"
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4}}>DESCRIPTION</label>
                  <textarea rows={4} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Describe your grievance in detail..."
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"none",fontFamily:"inherit"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
                  <button onClick={()=>setShowForm(false)} style={{padding:"8px 18px",background:"#f1f5f9",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13,color:"#475569"}}>Cancel</button>
                  <button onClick={handleSubmit} disabled={!form.subject.trim()||!form.desc.trim()}
                    style={{padding:"8px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>
                    Submit →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LIBRARY ──────────────────────────────────────────────────────────────────
function LibraryView() {
  const [tab, setTab] = useState("borrowed");
  const [search, setSearch] = useState("");
  const borrowed = [
    {id:"B001",title:"Operating Systems Concepts",author:"Silberschatz",issued:"May 15",due:"Jun 15",days:5,fine:0},
    {id:"B002",title:"Computer Networks",author:"Tanenbaum",issued:"May 20",due:"Jun 20",days:0,fine:0},
    {id:"B003",title:"Introduction to Algorithms",author:"CLRS",issued:"Apr 10",due:"May 10",days:31,fine:31},
  ];
  const catalog = [
    {code:"CS",title:"Design Patterns",author:"Gang of Four",available:3,total:5},
    {code:"CS",title:"Clean Code",author:"Robert C. Martin",available:1,total:3},
    {code:"CS",title:"The Pragmatic Programmer",author:"Hunt & Thomas",available:0,total:2},
    {code:"ML",title:"Pattern Recognition & ML",author:"Bishop",available:2,total:4},
    {code:"ML",title:"Deep Learning",author:"Goodfellow et al.",available:1,total:3},
    {code:"MATH",title:"Discrete Mathematics",author:"Rosen",available:4,total:6},
    {code:"NET",title:"Data Communications & Networking",author:"Forouzan",available:2,total:5},
  ].filter(b=>!search||b.title.toLowerCase().includes(search.toLowerCase())||b.author.toLowerCase().includes(search.toLowerCase()));

  const totalFine = borrowed.reduce((a,b)=>a+b.fine,0);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[["Books Borrowed","3","#6366f1"],["Due Today","1","#f59e0b"],["Fine Due",`₹${totalFine}`,"#ef4444"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px",borderTop:`4px solid ${c}`,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["borrowed","📚 Borrowed Books"],["catalog","🔍 Search Catalog"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
            background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>

      {tab==="borrowed"&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc"}}>
              {["Book","Author","Issued","Due Date","Days Overdue","Fine","Action"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{borrowed.map((b,i)=>(
              <tr key={b.id} style={{borderBottom:"1px solid #f1f5f9",background:b.days>0?"#fff9f9":"#fff"}}>
                <td style={{padding:"11px 14px",fontWeight:600,color:"#0f172a"}}>{b.title}</td>
                <td style={{padding:"11px 14px",color:"#64748b"}}>{b.author}</td>
                <td style={{padding:"11px 14px",color:"#64748b"}}>{b.issued}</td>
                <td style={{padding:"11px 14px",fontWeight:600,color:b.days>0?"#ef4444":"#334155"}}>{b.due}</td>
                <td style={{padding:"11px 14px",textAlign:"center",fontWeight:700,color:b.days>0?"#ef4444":"#10b981"}}>{b.days>0?b.days+" days":"On time"}</td>
                <td style={{padding:"11px 14px",fontWeight:700,color:b.fine>0?"#ef4444":"#64748b"}}>{b.fine>0?`₹${b.fine}`:"—"}</td>
                <td style={{padding:"11px 14px"}}>
                  {b.fine>0?<button style={{padding:"4px 12px",background:"#ef4444",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Pay ₹{b.fine}</button>
                  :<button style={{padding:"4px 12px",background:"#f1f5f9",color:"#334155",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Renew</button>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {tab==="catalog"&&(
        <div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title or author..."
            style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13,outline:"none",marginBottom:12,fontFamily:"inherit"}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {catalog.map((b,i)=>(
              <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{b.title}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{b.author}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>{b.available}/{b.total} copies available</div>
                </div>
                <button disabled={b.available===0} style={{padding:"6px 14px",background:b.available>0?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",color:b.available>0?"#fff":"#94a3b8",border:"none",borderRadius:8,cursor:b.available>0?"pointer":"not-allowed",fontSize:12,fontWeight:600,flexShrink:0,marginLeft:10}}>
                  {b.available>0?"Reserve":"Unavailable"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLACEMENT CELL ───────────────────────────────────────────────────────────
function PlacementView() {
  const [tab, setTab] = useState("jobs");
  const jobs = [
    {id:"J001",company:"TCS",role:"Systems Engineer",ctc:"3.5 LPA",location:"Bhubaneswar",deadline:"Jun 20",eligible:"7.0 CGPA",status:"Applied",batch:"2026"},
    {id:"J002",company:"Infosys",role:"Associate Engineer",ctc:"4.0 LPA",location:"Bangalore",deadline:"Jun 25",eligible:"6.5 CGPA",status:"Shortlisted",batch:"2026"},
    {id:"J003",company:"Wipro",role:"Project Engineer",ctc:"3.5 LPA",location:"Pune",deadline:"Jun 18",eligible:"6.0 CGPA",status:"Not Applied",batch:"2026"},
    {id:"J004",company:"Amazon",role:"SDE Intern",ctc:"60k/month",location:"Hyderabad",deadline:"Jul 5",eligible:"8.0 CGPA",status:"Not Applied",batch:"2026"},
    {id:"J005",company:"Capgemini",role:"Analyst",ctc:"4.5 LPA",location:"Chennai",deadline:"Jul 10",eligible:"6.5 CGPA",status:"Not Applied",batch:"2026"},
  ];
  const interviews = [
    {company:"Infosys",round:"Technical Round 1",date:"Jun 22",time:"10:00 AM",mode:"Online",venue:"zoom.us/j/123456",status:"Upcoming"},
    {company:"TCS",round:"HR Round",date:"Jun 15",time:"2:00 PM",mode:"Offline",venue:"Placement Cell, Block A",status:"Completed"},
  ];
  const statusColor = s=>s==="Applied"?{bg:"#eef2ff",c:"#6366f1"}:s==="Shortlisted"?{bg:"#dcfce7",c:"#16a34a"}:s==="Selected"?{bg:"#dcfce7",c:"#16a34a"}:{bg:"#f1f5f9",c:"#64748b"};
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[["Jobs Available","5","#6366f1"],["Applied","2","#f59e0b"],["Shortlisted","1","#10b981"],["Interviews","2","#8b5cf6"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px",borderTop:`4px solid ${c}`,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
        {[["jobs","💼 Job Postings"],["interviews","📅 My Interviews"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,
            background:tab===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:tab===t?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>

      {tab==="jobs"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {jobs.map(j=>{
            const sc=statusColor(j.status);
            return (
              <div key={j.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
                    <div style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12,flexShrink:0}}>{j.company[0]}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>{j.company} <span style={{fontSize:13,fontWeight:500,color:"#64748b"}}>— {j.role}</span></div>
                      <div style={{fontSize:12,color:"#94a3b8"}}>📍 {j.location} &nbsp;·&nbsp; 💰 {j.ctc} &nbsp;·&nbsp; 🎓 Min CGPA: {j.eligible} &nbsp;·&nbsp; ⏰ Deadline: {j.deadline}</div>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
                  <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,background:sc.bg,color:sc.c}}>{j.status}</span>
                  {j.status==="Not Applied"&&<button style={{padding:"6px 16px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>Apply</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="interviews"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {interviews.map((iv,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:4}}>{iv.company} — {iv.round}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>📅 {iv.date} &nbsp;·&nbsp; ⏰ {iv.time} &nbsp;·&nbsp; 📡 {iv.mode}</div>
                  <div style={{fontSize:12,color:"#6366f1",marginTop:3,fontWeight:500}}>📍 {iv.venue}</div>
                </div>
                <span style={{padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,background:iv.status==="Upcoming"?"#fef9c3":"#dcfce7",color:iv.status==="Upcoming"?"#ca8a04":"#16a34a"}}>{iv.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── COURSE REGISTRATION ──────────────────────────────────────────────────────
function CourseRegistration() {
  const maxCredits = 24;
  const [registered, setRegistered] = useState([
    {code:"CS301",name:"Database Management Systems",credits:4,type:"Core",slot:"A"},
    {code:"CS302",name:"Operating Systems",credits:4,type:"Core",slot:"B"},
    {code:"CS303",name:"Computer Networks",credits:4,type:"Core",slot:"C"},
    {code:"CS304",name:"Theory of Computation",credits:3,type:"Core",slot:"D"},
    {code:"CS305",name:"Software Engineering",credits:3,type:"Core",slot:"E"},
    {code:"CS301L",name:"DBMS Lab",credits:2,type:"Lab",slot:"F"},
  ]);
  const electives = [
    {code:"CS306E",name:"Machine Learning",credits:3,type:"Elective",slot:"G",seats:5},
    {code:"CS307E",name:"Cloud Computing",credits:3,type:"Elective",slot:"H",seats:12},
    {code:"CS308E",name:"Cyber Security",credits:3,type:"Elective",slot:"I",seats:0},
    {code:"CS309E",name:"Natural Language Processing",credits:3,type:"Elective",slot:"J",seats:8},
    {code:"CS310E",name:"Blockchain Technology",credits:3,type:"Elective",slot:"K",seats:3},
  ];
  const usedCredits = registered.reduce((a,c)=>a+c.credits,0);
  const typeColor = {Core:"#6366f1",Lab:"#f59e0b",Elective:"#10b981"};

  const addElective = (e) => {
    if(usedCredits+e.credits>maxCredits||e.seats===0) return;
    if(!registered.find(r=>r.code===e.code)) setRegistered(prev=>[...prev,{...e,seats:undefined}]);
  };
  const remove = (code) => setRegistered(prev=>prev.filter(r=>r.code!==code||r.type==="Core"));

  return (
    <div>
      {/* Credit meter */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 18px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>Credit Load — Semester 5</div>
          <span style={{fontWeight:800,fontSize:16,color:usedCredits>maxCredits?"#ef4444":"#6366f1"}}>{usedCredits} / {maxCredits}</span>
        </div>
        <div style={{height:10,background:"#f1f5f9",borderRadius:5}}>
          <div style={{width:Math.min(100,usedCredits/maxCredits*100)+"%",height:"100%",background:usedCredits>maxCredits?"#ef4444":"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:5,transition:"width .3s"}}/>
        </div>
        {usedCredits>maxCredits&&<div style={{color:"#ef4444",fontSize:12,marginTop:4,fontWeight:600}}>⚠️ Credit limit exceeded!</div>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Registered */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 14px",color:"#fff",fontWeight:700,fontSize:13}}>Registered Courses ({registered.length})</div>
          {registered.map(c=>(
            <div key={c.code} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:"1px solid #f1f5f9"}}>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{c.code} — {c.name}</div>
                <div style={{fontSize:11,color:"#94a3b8"}}>Slot {c.slot} &nbsp;·&nbsp; {c.credits} credits &nbsp;·&nbsp; <span style={{color:typeColor[c.type],fontWeight:600}}>{c.type}</span></div>
              </div>
              {c.type!=="Core"&&<button onClick={()=>remove(c.code)} style={{padding:"3px 10px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Drop</button>}
            </div>
          ))}
        </div>

        {/* Available electives */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#10b981,#059669)",padding:"11px 14px",color:"#fff",fontWeight:700,fontSize:13}}>Available Electives</div>
          {electives.map(e=>{
            const alreadyAdded = !!registered.find(r=>r.code===e.code);
            return (
              <div key={e.code} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:"1px solid #f1f5f9",background:alreadyAdded?"#f0fdf4":"#fff"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{e.code} — {e.name}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>Slot {e.slot} &nbsp;·&nbsp; {e.credits} credits &nbsp;·&nbsp;
                    <span style={{color:e.seats>0?"#10b981":"#ef4444",fontWeight:600}}>{e.seats>0?`${e.seats} seats`:"Full"}</span>
                  </div>
                </div>
                <button onClick={()=>addElective(e)} disabled={alreadyAdded||e.seats===0||usedCredits+e.credits>maxCredits}
                  style={{padding:"4px 12px",background:alreadyAdded?"#dcfce7":e.seats===0?"#f1f5f9":"linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color:alreadyAdded?"#16a34a":e.seats===0?"#94a3b8":"#fff",border:"none",borderRadius:6,cursor:alreadyAdded||e.seats===0?"default":"pointer",fontSize:11,fontWeight:600}}>
                  {alreadyAdded?"Added ✓":e.seats===0?"Full":"Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CO/PO ATTAINMENT ─────────────────────────────────────────────────────────
function COPOView() {
  const [selSubj, setSelSubj] = useState("CS301");
  const subjects = {
    CS301:{name:"DBMS", target:60,
      cos:[
        {co:"CO1",desc:"Understand ER modelling",mid1:72,mid2:68,assign:80,avg:0},
        {co:"CO2",desc:"Write SQL queries",mid1:65,mid2:70,assign:75,avg:0},
        {co:"CO3",desc:"Normalize relations",mid1:58,mid2:55,assign:62,avg:0},
        {co:"CO4",desc:"Understand transactions",mid1:50,mid2:48,assign:55,avg:0},
        {co:"CO5",desc:"Apply indexing techniques",mid1:62,mid2:60,assign:68,avg:0},
      ],
      pos:["PO1","PO2","PO3","PO4","PO5","PO6"],
      matrix:[[3,2,1,0,0,0],[3,3,2,1,0,0],[2,3,3,1,0,0],[2,2,1,2,0,0],[1,2,2,1,1,0]],
    },
    CS302:{name:"Operating Systems", target:60,
      cos:[
        {co:"CO1",desc:"Explain process management",mid1:70,mid2:72,assign:78,avg:0},
        {co:"CO2",desc:"Implement scheduling algorithms",mid1:68,mid2:65,assign:72,avg:0},
        {co:"CO3",desc:"Understand memory management",mid1:55,mid2:58,assign:64,avg:0},
        {co:"CO4",desc:"Explain file systems",mid1:72,mid2:70,assign:76,avg:0},
      ],
      pos:["PO1","PO2","PO3","PO4","PO5","PO6"],
      matrix:[[3,2,2,1,0,0],[2,3,2,1,1,0],[2,2,3,1,0,0],[2,1,2,2,0,0]],
    },
  };
  const subj = subjects[selSubj];
  const cosWithAvg = subj.cos.map(co=>{
    const avg = Math.round((co.mid1*0.4+co.mid2*0.4+co.assign*0.2));
    return {...co,avg};
  });
  const met = cosWithAvg.filter(c=>c.avg>=subj.target).length;

  // PO attainment
  const poAtt = subj.pos.map((_,pi)=>{
    const vals = cosWithAvg.map((co,ci)=>((subj.matrix[ci]?.[pi]||0)/3)*co.avg);
    const weights = cosWithAvg.map((_,ci)=>subj.matrix[ci]?.[pi]||0);
    const sumW = weights.reduce((a,b)=>a+b,0);
    return sumW>0?Math.round(vals.reduce((a,b)=>a+b,0)/sumW):0;
  });

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>SUBJECT:</span>
        {Object.entries(subjects).map(([k,v])=>(
          <button key={k} onClick={()=>setSelSubj(k)}
            style={{padding:"6px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
              background:selSubj===k?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",
              color:selSubj===k?"#fff":"#475569"}}>
            {k} — {v.name}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {[["COs Met",`${met}/${subj.cos.length}`,"#10b981"],["Target",`${subj.target}%`,"#6366f1"],["COs Below Target",`${subj.cos.length-met}`,"#ef4444"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px",borderTop:`4px solid ${c}`,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:14}}>
        {/* CO table */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 14px",color:"#fff",fontWeight:700,fontSize:13}}>
            CO Attainment (Target: {subj.target}%)
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#f8fafc"}}>
              {["CO","Description","Mid-1","Mid-2","Assign","Attainment","Status"].map(h=>(
                <th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:600,color:"#475569",borderBottom:"1px solid #e2e8f0",fontSize:11}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{cosWithAvg.map((co,i)=>(
              <tr key={co.co} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                <td style={{padding:"9px 10px",fontWeight:700,color:"#6366f1"}}>{co.co}</td>
                <td style={{padding:"9px 10px",color:"#334155",fontSize:11}}>{co.desc}</td>
                <td style={{padding:"9px 10px",textAlign:"center",color:"#64748b"}}>{co.mid1}</td>
                <td style={{padding:"9px 10px",textAlign:"center",color:"#64748b"}}>{co.mid2}</td>
                <td style={{padding:"9px 10px",textAlign:"center",color:"#64748b"}}>{co.assign}</td>
                <td style={{padding:"9px 10px",textAlign:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:40,height:5,background:"#f1f5f9",borderRadius:3}}>
                      <div style={{width:co.avg+"%",height:"100%",background:co.avg>=subj.target?"#10b981":"#ef4444",borderRadius:3}}/>
                    </div>
                    <span style={{fontWeight:700,color:co.avg>=subj.target?"#10b981":"#ef4444"}}>{co.avg}%</span>
                  </div>
                </td>
                <td style={{padding:"9px 10px"}}>
                  <span style={{padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700,background:co.avg>=subj.target?"#dcfce7":"#fee2e2",color:co.avg>=subj.target?"#16a34a":"#dc2626"}}>
                    {co.avg>=subj.target?"Met":"Not Met"}
                  </span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* PO attainment */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)",padding:"11px 14px",color:"#fff",fontWeight:700,fontSize:13}}>PO Attainment</div>
          <div style={{padding:14}}>
            {subj.pos.map((po,i)=>(
              <div key={po} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                  <span style={{fontWeight:600,color:"#334155"}}>{po}</span>
                  <span style={{fontWeight:700,color:poAtt[i]>=subj.target?"#10b981":"#ef4444"}}>{poAtt[i]}%</span>
                </div>
                <div style={{height:8,background:"#f1f5f9",borderRadius:4}}>
                  <div style={{width:poAtt[i]+"%",height:"100%",background:poAtt[i]>=subj.target?"#10b981":"#ef4444",borderRadius:4,transition:"width .3s"}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:14,padding:"10px 12px",background:"#f8fafc",borderRadius:8,fontSize:12,color:"#64748b"}}>
              CO-PO mapping uses 3-level correlation (3=High, 2=Med, 1=Low).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS BELL ───────────────────────────────────────────────────────
function useNotifications(role) {
  const studentNotifs = [
    {id:1,text:"Mid-term marks for CS301 are now available",time:"2h ago",read:false,type:"marks"},
    {id:2,text:"Leave application L002 is pending Dean approval",time:"5h ago",read:false,type:"leave"},
    {id:3,text:"Assignment CS304 due tomorrow — Jun 15",time:"1d ago",read:true,type:"assignment"},
    {id:4,text:"Infosys shortlisted you for Technical Round",time:"1d ago",read:false,type:"placement"},
    {id:5,text:"Library book overdue: Introduction to Algorithms",time:"2d ago",read:true,type:"library"},
  ];
  const facultyNotifs = [
    {id:1,text:"3 new assignment submissions in CS301",time:"1h ago",read:false,type:"assignment"},
    {id:2,text:"Rohit Sharma submitted thesis Chapter 4",time:"3h ago",read:false,type:"research"},
    {id:3,text:"Attendance for Jun 14 not yet submitted — CS302",time:"5h ago",read:false,type:"attendance"},
    {id:4,text:"Leave request from Priya Nair approved by HOD",time:"1d ago",read:true,type:"leave"},
  ];
  return role==="student"?studentNotifs:facultyNotifs;
}

// ─── STUDENT FEEDBACK VIEW ────────────────────────────────────────────────────
// ─── Student Messaging ────────────────────────────────────────────────────────
function StudentMessaging({ user }) {
  const faculty = [
    {id:"F001",name:"Dr. Priya Singh",dept:"CSE",subject:"DBMS",avatar:"P"},
    {id:"F002",name:"Prof. Ramesh Panda",dept:"CSE",subject:"OS",avatar:"R"},
    {id:"F003",name:"Dr. Sunita Das",dept:"CSE",subject:"CN",avatar:"S"},
    {id:"F004",name:"Dr. K. Rath",dept:"CSE",subject:"TOC",avatar:"K"},
    {id:"F005",name:"Prof. M. Behera",dept:"CSE",subject:"SE",avatar:"M"},
  ];
  const [selected, setSelected] = useState(faculty[0]);
  const [conversations, setConversations] = useState({
    F001:[
      {id:1,from:"student",text:"Sir, I have a doubt in ER diagram normalization.",time:"10:20 AM",date:"Today"},
      {id:2,from:"faculty",text:"Sure, which normal form are you having trouble with?",time:"10:35 AM",date:"Today"},
    ],
    F002:[
      {id:1,from:"faculty",text:"Please submit the CPU scheduling assignment by tomorrow.",time:"9:00 AM",date:"Yesterday"},
    ],
  });
  const [msg, setMsg] = useState("");
  const msgEnd = React.useRef(null);

  useEffect(()=>{ msgEnd.current?.scrollIntoView({behavior:"smooth"}); },[selected,conversations]);

  const sendMsg = () => {
    if (!msg.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
    setConversations(prev=>({
      ...prev,
      [selected.id]: [...(prev[selected.id]||[]),{id:Date.now(),from:"student",text:msg.trim(),time:timeStr,date:"Today"}]
    }));
    setMsg("");
    // Simulate faculty reply
    setTimeout(()=>{
      setConversations(prev=>({
        ...prev,
        [selected.id]: [...(prev[selected.id]||[]),{id:Date.now()+1,from:"faculty",text:"Thanks for reaching out! I'll get back to you soon.",time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),date:"Today"}]
      }));
    }, 2000);
  };

  const msgs = conversations[selected.id] || [];

  return (
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",height:560,display:"flex"}}>
      {/* Faculty list */}
      <div style={{width:220,borderRight:"1px solid #e2e8f0",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"12px 14px",borderBottom:"1px solid #f1f5f9",fontWeight:700,fontSize:13,color:"#0f172a",background:"#f8fafc"}}>
          💬 Message Faculty
        </div>
        {faculty.map(f=>{
          const unread = !conversations[f.id] || conversations[f.id].every(m=>m.from==="student");
          const last = conversations[f.id]?.slice(-1)[0];
          return (
            <div key={f.id} onClick={()=>setSelected(f)}
              style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #f8fafc",background:selected.id===f.id?"#eef2ff":"#fff",transition:"background .1s"}}
              onMouseEnter={e=>{ if(selected.id!==f.id) e.currentTarget.style.background="#fafbff"; }}
              onMouseLeave={e=>{ if(selected.id!==f.id) e.currentTarget.style.background="#fff"; }}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,flexShrink:0}}>{f.avatar}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:12,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>{f.subject}</div>
                  {last && <div style={{fontSize:10,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{last.text.slice(0,28)}...</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Chat area */}
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9",background:"#f8fafc",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>{selected.avatar}</div>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{selected.name}</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{selected.subject} · {selected.dept}</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
          {msgs.length === 0 && (
            <div style={{textAlign:"center",color:"#94a3b8",fontSize:13,marginTop:40}}>
              No messages yet. Start the conversation!
            </div>
          )}
          {msgs.map(m=>(
            <div key={m.id} style={{display:"flex",justifyContent:m.from==="student"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"70%"}}>
                <div style={{background:m.from==="student"?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",color:m.from==="student"?"#fff":"#0f172a",padding:"9px 13px",borderRadius:m.from==="student"?"12px 12px 2px 12px":"12px 12px 12px 2px",fontSize:13,lineHeight:1.5}}>
                  {m.text}
                </div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:3,textAlign:m.from==="student"?"right":"left"}}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={msgEnd}/>
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #f1f5f9",display:"flex",gap:8}}>
          <input value={msg} onChange={e=>setMsg(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMsg(); }}}
            placeholder={`Message ${selected.name}...`}
            style={{flex:1,padding:"9px 13px",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          <button onClick={sendMsg} disabled={!msg.trim()}
            style={{padding:"9px 16px",background:msg.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#e2e8f0",color:msg.trim()?"#fff":"#94a3b8",border:"none",borderRadius:10,fontWeight:600,cursor:msg.trim()?"pointer":"not-allowed",fontSize:13,transition:"all .15s"}}>
            Send ➤
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackView() {
  const [submitted, setSubmitted] = useState({});
  const [ratings, setRatings] = useState({});
  const subjects = [
    {code:"CS301",name:"Database Management Systems",faculty:"Dr. A. Sharma"},
    {code:"CS302",name:"Operating Systems",faculty:"Prof. S. Das"},
    {code:"CS303",name:"Computer Networks",faculty:"Dr. R. Panda"},
    {code:"CS304",name:"Theory of Computation",faculty:"Dr. K. Rath"},
    {code:"CS305",name:"Software Engineering",faculty:"Prof. M. Behera"},
  ];
  const questions = ["Course Content","Teaching Quality","Pace of Teaching","Interaction & Doubt Solving","Practical Relevance"];

  const setRating = (code,q,val) => setRatings(prev=>({...prev,[code]:{...(prev[code]||{}),[q]:val}}));
  const getRating = (code,q) => ratings[code]?.[q]||0;
  const canSubmit = (code) => questions.every(q=>getRating(code,q)>0);

  const submit = (code) => {
    if(!canSubmit(code)) return;
    setSubmitted(prev=>({...prev,[code]:true}));
  };

  return (
    <div>
      <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#4338ca"}}>
        🔒 Your feedback is completely <strong>anonymous</strong>. Faculty cannot see individual responses.
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {subjects.map(s=>(
          <div key={s.code} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#fff"}}>
                <div style={{fontWeight:700,fontSize:13}}>{s.code} — {s.name}</div>
                <div style={{fontSize:12,opacity:0.8}}>{s.faculty}</div>
              </div>
              {submitted[s.code]&&<span style={{background:"rgba(255,255,255,0.2)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>✓ Submitted</span>}
            </div>
            {submitted[s.code]?(
              <div style={{padding:"20px",textAlign:"center",color:"#16a34a",fontWeight:600,fontSize:14}}>✅ Thank you for your feedback!</div>
            ):(
              <div style={{padding:"14px 16px"}}>
                {questions.map(q=>(
                  <div key={q} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:13,color:"#334155",fontWeight:500}}>{q}</span>
                    <div style={{display:"flex",gap:6}}>
                      {[1,2,3,4,5].map(n=>(
                        <button key={n} onClick={()=>setRating(s.code,q,n)}
                          style={{width:32,height:32,borderRadius:6,border:"1px solid",borderColor:getRating(s.code,q)>=n?"#6366f1":"#e2e8f0",cursor:"pointer",fontSize:14,
                            background:getRating(s.code,q)>=n?"#6366f1":"#fff",color:getRating(s.code,q)>=n?"#fff":"#94a3b8",fontWeight:700}}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
                  <button onClick={()=>submit(s.code)} disabled={!canSubmit(s.code)}
                    style={{padding:"8px 20px",background:canSubmit(s.code)?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#f1f5f9",color:canSubmit(s.code)?"#fff":"#94a3b8",border:"none",borderRadius:8,fontWeight:600,cursor:canSubmit(s.code)?"pointer":"not-allowed",fontSize:13}}>
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FACULTY FEEDBACK RESULTS ─────────────────────────────────────────────────
function FacultyFeedbackView() {
  const results = [
    {code:"CS301",name:"DBMS",responses:48,scores:{cc:4.1,tq:4.3,pace:3.8,inter:4.0,pr:3.9},overall:4.0},
    {code:"CS302",name:"OS",responses:44,scores:{cc:3.9,tq:4.1,pace:3.7,inter:3.8,pr:3.6},overall:3.8},
  ];
  const labels = {cc:"Course Content",tq:"Teaching Quality",pace:"Pace",inter:"Interaction",pr:"Practical Relevance"};
  return (
    <div>
      <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#4338ca"}}>
        🔒 These are aggregated anonymous scores. Individual responses are not visible.
      </div>
      {results.map(r=>(
        <div key={r.code} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginBottom:14}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{r.code} — {r.name}</div>
            <div style={{color:"rgba(255,255,255,0.85)",fontSize:12}}>{r.responses} responses</div>
          </div>
          <div style={{padding:"16px",display:"grid",gridTemplateColumns:"1fr 120px",gap:16,alignItems:"start"}}>
            <div>
              {Object.entries(r.scores).map(([k,v])=>(
                <div key={k} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:12}}>
                    <span style={{color:"#475569",fontWeight:500}}>{labels[k]}</span>
                    <span style={{fontWeight:700,color:"#6366f1"}}>{v}/5</span>
                  </div>
                  <div style={{height:7,background:"#f1f5f9",borderRadius:4}}>
                    <div style={{width:(v/5*100)+"%",height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:4}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center",background:"#eef2ff",borderRadius:12,padding:"16px 10px"}}>
              <div style={{fontSize:36,fontWeight:900,color:"#6366f1"}}>{r.overall}</div>
              <div style={{fontSize:11,color:"#6366f1",fontWeight:600}}>Overall</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:4}}>out of 5.0</div>
              <div style={{display:"flex",justifyContent:"center",marginTop:6}}>
                {[1,2,3,4,5].map(n=><span key={n} style={{color:n<=Math.round(r.overall)?"#f59e0b":"#e2e8f0",fontSize:16}}>★</span>)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Firebase auth state ──
  const { fbUser, profile: fbProfile, loading: fbLoading } = useFirebaseAuth();

  // ── Local auth state (used for demo fallback + Firebase) ──
  const [auth, setAuth] = useState(null);
  const [role, setRole] = useState(null);
  const [uid, setUid] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [academicOpen, setAcademicOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);
  const [chatOpen, setChatOpen] = useState(null); // {otherUid, otherName}

  // ── Sync Firebase auth into local state ──
  useEffect(() => {
    if (fbUser && fbProfile) {
      setAuth(fbProfile);
      setRole(fbProfile.role);
      setUid(fbUser.uid);
    }
  }, [fbUser, fbProfile]);

  // ── Loading screen ──
  if (fbLoading) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e293b)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",color:"#fff"}}>
        <div style={{fontSize:48,marginBottom:16}}>🎓</div>
        <div style={{fontSize:18,fontWeight:700}}>ITER ERP</div>
        <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>Loading...</div>
      </div>
    </div>
  );

  // ── Not logged in → show Firebase Login ──
  if (!auth) return (
    <FirebaseLogin onLogin={(r, u, firebaseUid) => {
      setRole(r); setAuth(u); setUid(firebaseUid); setActive("dashboard");
    }}/>
  );

  // ── Pending approval → show locked dashboard for ANY non-approved student/faculty ──
  if (auth && role !== "admin" && auth.status !== "approved") {
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e293b)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:520,overflow:"hidden",boxShadow:"0 30px 80px rgba(0,0,0,0.4)"}}>
          {/* Header */}
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"28px 32px",textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:8}}>🎓</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:20}}>ITER ERP Portal</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginTop:4}}>Siksha 'O' Anusandhan University</div>
          </div>
          {/* Status */}
          <div style={{padding:"32px"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px"}}>⏳</div>
              <div style={{fontWeight:800,fontSize:18,color:"#0f172a",marginBottom:6}}>Approval Pending</div>
              <div style={{fontSize:13,color:"#64748b",lineHeight:1.7}}>
                Hi <strong>{auth.name}</strong>, your account registration is under review.<br/>
                An administrator will approve your access shortly.
              </div>
            </div>
            {/* Info cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
              {[
                {label:"Email",value:auth.email||"—",icon:"📧"},
                {label:"Requested Role",value:auth.requestedRole||auth.role||"student",icon:"🎭"},
                {label:"Department",value:auth.dept||"—",icon:"🏛️"},
                {label:"Registered",value:auth.createdAt?.slice(0,10)||"Today",icon:"📅"},
              ].map(item=>(
                <div key={item.label} style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{item.icon}</div>
                  <div style={{fontSize:10,fontWeight:700,color:"#94a3b8"}}>{item.label.toUpperCase()}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginTop:2,wordBreak:"break-all"}}>{item.value}</div>
                </div>
              ))}
            </div>
            {/* What happens next */}
            <div style={{background:"#eef2ff",borderRadius:10,padding:"14px 16px",marginBottom:20,border:"1px solid #c7d2fe"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#4338ca",marginBottom:8}}>📋 WHAT HAPPENS NEXT</div>
              {[
                "Admin reviews your registration details",
                "Your role (Student / Faculty) gets assigned",
                "You'll be able to log in and access full ERP features",
              ].map((step,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<2?6:0}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"#6366f1",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:12,color:"#4338ca",lineHeight:1.5}}>{step}</div>
                </div>
              ))}
            </div>
            <button onClick={async()=>{ await logOut(); setAuth(null); setRole(null); setUid(null); }}
              style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:14}}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logOut();
    setAuth(null); setRole(null); setUid(null);
  };

  const notifs = useNotifications(role);
  const unreadCount = notifs.filter(n=>!n.read&&!readNotifs.includes(n.id)).length;

  const studentViews = {
    dashboard:<StudentDashboard user={auth}/>, attendance:<AttendanceView/>,
    exam:<ExamView/>, fee:<FeeView/>, assignments:<AssignmentsView role="student"/>, notices:<NoticesView/>,
    timetable:<StudentTimetable/>, papers:<QuestionPapers/>,
    hallticket:<HallTicket user={auth}/>, grievance:<GrievancePortal/>,
    library:<LibraryView/>, placement:<PlacementView/>,
    registration:<CourseRegistration/>,
    feedback: uid ? <LiveFeedbackView uid={uid}/> : <FeedbackView/>,
    messages:<StudentMessaging user={auth}/>,
    internalmarks:<InternalMarksView/>,
    liveattendance:<RealTimeAttendanceView/>,
    profile:<StudentProfile user={auth}/>, auditlog:<AuditLog role="student"/>,
    transport:<TransportView/>, alumni:<AlumniConnect user={auth}/>, elearning:<ELearningView/>,
    marksheet:<MarksheetView user={auth}/>,
  };
  const facultyViews = {
    dashboard:<FacultyDashboard user={auth}/>, subjects:<FacultySubjectsView/>,
    assignments:<AssignmentsView role="faculty"/>,
    bulkmessage:<BulkMessagingView role="faculty"/>,
    attendanceexport:<AttendanceExport/>,
    lab:<LabView/>, attendance:<AttendanceView/>, evaluation:<EvaluationView/>,
    research:<ResearchView/>, duty:<DutyView/>, notices:<NoticesView/>,
    copo:<COPOView/>,
    feedback: uid ? <LiveFacultyFeedback/> : <FacultyFeedbackView/>,
    profile:<FacultyProfile user={auth}/>, auditlog:<AuditLog role="faculty"/>,
    syllabus:<SyllabusTracker/>, qpaper:<QuestionPaperSubmission/>, fts:<FileTrackingSystem user={auth}/>,
    services:<ServicesHub setActive={setActive}/>,
    appraisal:<AppraisalView/>, auditorium:<AuditoriumBooking/>, vehicle:<VehicleRequisition/>,
    complaint:<ComplaintManagement/>, groupemail:<GroupEmail/>, bestaward:<BestPerformanceAward/>,
    health:<HealthCentreView/>, guesthouse:<GuestHouseView/>, purchase:<PurchaseView/>,
    internship:<InternshipView/>, sricce:<SRICCEView/>,
  };
  const adminViews = {
    dashboard:<AdminDashboard user={auth} setActive={setActive}/>, students:<AdminStudents/>,
    faculty:<AdminFaculty/>, leaves:<AdminLeaveApprovals/>,
    bulkmessage:<BulkMessagingView role="admin"/>,
    calendar:<AcademicCalendar/>, departments:<DepartmentManagement/>,
    courses:<CourseManagement/>, fees:<FeeManagement/>,
    auditlog:<ActivityAuditLog/>,
    reports:<AdminReports/>, timetable:<AdminTimetable/>, notices:<AdminNotices/>,
    fts:<FileTrackingSystem user={auth}/>, complaint:<ComplaintManagement/>,
    groupemail:<GroupEmail/>, vehicle:<VehicleRequisition/>, purchase:<PurchaseView/>,
    auditorium:<AuditoriumBooking/>, guesthouse:<GuestHouseView/>,
    approvals:<AdminUserApprovals/>,
  };
  const views = role==="student" ? studentViews : role==="faculty" ? facultyViews : adminViews;

  const studentSidebarLinks = [
    ["Dashboard","dashboard"],["Attendance","attendance"],
    ["Question Papers","papers"],["Examination","exam"],["Marksheet","marksheet"],
    ["Hall Ticket","hallticket"],["Assignments","assignments"],["Fee Payment","fee"],
    ["Library","library"],["Placement Cell","placement"],["E-Learning","elearning"],
    ["Transport","transport"],["Alumni Connect","alumni"],
    ["Course Registration","registration"],["Grievance","grievance"],
    ["Feedback","feedback"],["Messages","messages"],
    ["Internal Marks","internalmarks"],["Live Attendance","liveattendance"],
    ["Profile","profile"],["Audit Log","auditlog"],["Notices","notices"],
  ];
  const facultySidebarLinks = [
    ["Dashboard","dashboard"],["Subjects & Students","subjects"],["Lab","lab"],
    ["Attendance","attendance"],["Evaluation","evaluation"],["Assignments","assignments"],
    ["Bulk Message","bulkmessage"],["Attendance Export","attendanceexport"],
    ["Research","research"],
    ["CO/PO Attainment","copo"],["Syllabus Tracker","syllabus"],["Question Paper","qpaper"],["File Tracking","fts"],["Services","services"],
    ["Exam & Duty","duty"],["Feedback Results","feedback"],
    ["My Profile","profile"],["Audit Log","auditlog"],["Notices","notices"],
  ];

  // Academic dropdown items
  const studentMenuItems = [
    ["Student Information","profile"],["Registration","registration"],["Attendance and Leave","attendance"],
    ["📡 Live Attendance","liveattendance"],["📊 Internal Marks","internalmarks"],
    ["Feedback / Assessment","feedback"],["Examination","exam"],["Fee Payment","fee"],
    ["Hostel Management","fee"],["Assignments","assignments"],["💬 Messages","messages"],
    ["Hall Ticket","hallticket"],["Library","library"],["Placement Cell","placement"],
    ["E-Learning","elearning"],["Transport","transport"],["Alumni Connect","alumni"],
    ["Grievance Portal","grievance"],["Scholarships","fee"],["Audit Log","auditlog"],
  ];
  const facultyMenuItems = [
    ["Dashboard","dashboard"],["Subjects & Students","subjects"],["Lab Management","lab"],
    ["Attendance & Leave","attendance"],["📤 Bulk Message","bulkmessage"],
    ["📥 Attendance Export","attendanceexport"],["Assignments","assignments"],
    ["Evaluation","evaluation"],
    ["Research Scholars","research"],["CO/PO Attainment","copo"],
    ["Exam & Duty","duty"],["Feedback Results","feedback"],
    ["My Profile","profile"],["Audit Log","auditlog"],["Notices","notices"],
  ];

  const adminMenuItems = [
    ["Dashboard","dashboard"],["🔐 User Approvals","approvals"],["Students","students"],["Faculty","faculty"],
    ["Leave Approvals","leaves"],["📢 Bulk Message","bulkmessage"],
    ["📅 Academic Calendar","calendar"],["🏛️ Departments","departments"],
    ["📚 Course Management","courses"],["💰 Fee Management","fees"],
    ["🔍 Audit Logs","auditlog"],
    ["Timetable","timetable"],["Notices","notices"],["Reports","reports"],
  ];
  const adminServiceItems = [
    ["File Tracking","fts"],["Complaint Management","complaint"],["Group Email","groupemail"],
    ["Vehicle Requisition","vehicle"],["Purchase & Store","purchase"],
    ["Auditorium Booking","auditorium"],["Guest House","guesthouse"],
  ];

  // bg colours for dark mode
  const bg   = darkMode?"#0f172a":"#f0f0f0";
  const sbg  = darkMode?"#1e293b":"#2d2d2d";
  const mbg  = darkMode?"#1e293b":"#fff";
  const mtxt = darkMode?"#e2e8f0":"#0f172a";

  return (
    <div style={{minHeight:"100vh",background:bg,fontFamily:"'Segoe UI',sans-serif",transition:"background .2s"}} onClick={()=>{if(notifOpen)setNotifOpen(false);if(academicOpen)setAcademicOpen(false);if(servicesOpen)setServicesOpen(false);}}>

      {/* ── TOP HEADER ── */}
      <div style={{position:"relative",zIndex:100}}>
        <div style={{background:mbg,borderBottom:`3px solid #6366f1`,display:"flex",alignItems:"center",padding:"0 16px",height:56,gap:16,fontFamily:"'Segoe UI',sans-serif"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,minWidth:140}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:22,color:"#6366f1",fontStyle:"italic"}}>ITER</div>
            <div style={{fontSize:9,color:"#888",lineHeight:1.2}}>SOA<br/>University</div>
          </div>
          <div style={{cursor:"pointer",fontSize:20,color:"#555"}}>☰</div>
          {/* Academic dropdown */}
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{setAcademicOpen(o=>!o);setServicesOpen(false);setNotifOpen(false);}}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,color:academicOpen?"#6366f1":mtxt,display:"flex",alignItems:"center",gap:4,padding:"6px 10px"}}>
              Academic <span style={{fontSize:10,color:"#6366f1"}}>▼</span>
            </button>
          </div>
          {/* Services dropdown */}
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{setServicesOpen(o=>!o);setAcademicOpen(false);setNotifOpen(false);}}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,color:servicesOpen?"#8b5cf6":mtxt,display:"flex",alignItems:"center",gap:4,padding:"6px 10px"}}>
              Services <span style={{fontSize:10,color:"#8b5cf6"}}>▼</span>
            </button>
          </div>
          <GlobalSearch setActive={setActive}/>
          {/* Dark mode */}
          <button onClick={()=>setDarkMode(d=>!d)}
            style={{background:"none",border:"1px solid #e2e8f0",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:16,color:darkMode?"#fbbf24":"#475569"}}>
            {darkMode?"☀️":"🌙"}
          </button>
          {/* Notification bell */}
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{setNotifOpen(o=>!o);setAcademicOpen(false);setServicesOpen(false);}}
              style={{width:36,height:36,borderRadius:10,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,position:"relative"}}>
              🔔
              {unreadCount>0&&<span style={{position:"absolute",top:4,right:4,width:8,height:8,background:"#ef4444",borderRadius:"50%",border:"2px solid #fff"}}/>}
            </button>
            {notifOpen&&(
              <div style={{position:"absolute",right:0,top:44,width:320,background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:300}}>
                <div style={{padding:"12px 14px",fontWeight:700,fontSize:14,borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between"}}>
                  Notifications
                  {unreadCount>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:20,fontSize:11,padding:"1px 8px"}}>{unreadCount} new</span>}
                </div>
                {notifs.map(n=>{
                  const isRead = n.read||readNotifs.includes(n.id);
                  const iconMap = {marks:"📊",leave:"📋",assignment:"📝",placement:"💼",library:"📚",research:"🔬",attendance:"✅"};
                  return (
                    <div key={n.id} onClick={()=>setReadNotifs(p=>[...p,n.id])}
                      style={{padding:"10px 14px",borderBottom:"1px solid #f8fafc",background:isRead?"#fff":"#f0f4ff",cursor:"pointer"}}>
                      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                        <span style={{fontSize:16,flexShrink:0}}>{iconMap[n.type]||"📌"}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:isRead?400:600,color:"#334155"}}>{n.text}</div>
                          <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{n.time}</div>
                        </div>
                        {!isRead&&<span style={{width:7,height:7,borderRadius:"50%",background:"#6366f1",flexShrink:0,marginTop:4}}/>}
                      </div>
                    </div>
                  );
                })}
                <div style={{padding:"8px 14px",textAlign:"center",fontSize:12,color:"#6366f1",fontWeight:600,cursor:"pointer"}}
                  onClick={()=>setReadNotifs(notifs.map(n=>n.id))}>
                  Mark all as read
                </div>
              </div>
            )}
          </div>
          {/* User avatar */}
          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}
            onClick={handleLogout}>
            {auth.name[0]}
          </div>
        </div>

        {/* Academic dropdown menu */}
        {academicOpen&&(
          <div style={{position:"absolute",top:56,left:0,right:0,background:mbg,borderBottom:"2px solid #ddd",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",padding:"18px 32px",zIndex:200}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px 24px"}}>
              {(role==="student"?studentMenuItems:role==="faculty"?facultyMenuItems:adminMenuItems).map(([label,key])=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",fontSize:13,color:mtxt,fontWeight:500}}
                  onClick={()=>{setActive(key);setAcademicOpen(false);}}>
                  <span style={{color:"#6366f1",fontSize:14}}>●</span> {label}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Services dropdown menu */}
        {servicesOpen&&(
          <div style={{position:"absolute",top:56,left:0,right:0,background:mbg,borderBottom:"2px solid #ddd",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",padding:"18px 32px",zIndex:200}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px 24px"}}>
              {(role==="student"
                ?[["Hall Ticket","hallticket"],["Library","library"],["Placement Cell","placement"],["E-Learning","elearning"],["Transport","transport"],["Alumni Connect","alumni"],["Course Registration","registration"],["Grievance Portal","grievance"],["Feedback","feedback"],["Profile","profile"],["Audit Log","auditlog"],["Notices","notices"]]
                :role==="faculty"?[["Appraisal & Assessment","appraisal"],["Auditorium / LA Booking","auditorium"],["Guest House","guesthouse"],["Health Centre","health"],["Purchase & Store","purchase"],["Vehicle Requisition","vehicle"],["Complaint Management","complaint"],["Group Email","groupemail"],["Summer Internship","internship"],["SRICCE","sricce"],["Best Performance Award","bestaward"],["File Tracking","fts"],["My Profile","profile"],["Audit Log","auditlog"]]
                :adminServiceItems
              ).map(([label,key])=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",fontSize:13,color:mtxt,fontWeight:500}}
                  onClick={()=>{setActive(key);setServicesOpen(false);}}>
                  <span style={{color:"#8b5cf6",fontSize:14}}>●</span> {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <div style={{background:"#6366f1",color:"#fff",padding:"6px 20px",fontSize:12,display:"flex",gap:8,alignItems:"center"}}>
        <span style={{opacity:0.7}}>Home</span><span style={{opacity:0.5}}>›</span>
        <span style={{fontWeight:600}}>
          {role==="student"?`Welcome ${auth.name} — ${auth.dept||"CSE"} · ${auth.year||""}`:role==="faculty"?`Welcome ${auth.name} — ${auth.designation||"Faculty"} · Dept. of ${auth.dept||""}`:`Admin Panel — ${auth.name} · ${auth.designation||"Administrator"}`}
        </span>
      </div>

      <div style={{display:"flex",alignItems:"flex-start"}} className="erp-shell">
        {/* ── SIDEBAR ── */}
        <div style={{width:200,flexShrink:0,background:sbg,minHeight:"calc(100vh - 90px)",paddingTop:4,overflowY:"auto"}} className="erp-sidebar">
          <div className="sidebar-calendar"><MiniCalendar/></div>
          {role==="faculty"&&(
            <div style={{borderTop:"1px solid #444",marginTop:10,padding:"10px 10px 0"}} className="sidebar-birthdays">
              <div style={{fontSize:11,color:"#888",fontWeight:700,marginBottom:8,letterSpacing:0.5}}>🎂 BIRTHDAYS</div>
              {[{name:"Dr. Ramesh Panda",dept:"CSE",date:"Jun 9"},{name:"Prof. Sunita Das",dept:"ECE",date:"Jun 11"},{name:"Dr. Manoj Behera",dept:"MECH",date:"Jun 14"},{name:"Prof. Anita Mohanty",dept:"CIVIL",date:"Jun 17"},{name:"Dr. Bikash Sahoo",dept:"EEE",date:"Jun 20"}].map((b,i)=>(
                <div key={i} style={{padding:"6px 6px",borderBottom:"1px solid #3a3a3a",display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:"#e2e8f0",lineHeight:1.3}}>{b.name}</div>
                    <div style={{fontSize:10,color:"#666"}}>{b.dept}</div>
                  </div>
                  <div style={{fontSize:10,fontWeight:700,color:"#818cf8",whiteSpace:"nowrap",marginLeft:4}}>{b.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── QUICK LINKS ── */}
          {role === "student" && (
          <div style={{borderTop:"1px solid #3a3a4a",marginTop:8,padding:"10px 8px 4px"}}>
            <div style={{fontSize:9,color:"#6366f1",fontWeight:800,marginBottom:6,letterSpacing:1,paddingLeft:4,textTransform:"uppercase"}}>⚡ Working Modules</div>
            {[
              ["🏠","Dashboard","dashboard"],
              ["📡","Live Attendance","liveattendance"],
              ["📊","Internal Marks","internalmarks"],
              ["📝","Assignments","assignments"],
              ["💬","Messages","messages"],
              ["📋","Attendance & Leave","attendance"],
              ["📤","CSV Upload","dashboard"],
              ["📰","Notices","notices"],
              ["💰","Fee Payment","fee"],
              ["📄","Question Papers","papers"],
              ["📅","Timetable","timetable"],
              ["🔍","Search","dashboard"],
            ].map(([icon,label,key])=>(
              <div key={key+label} onClick={()=>setActive(key)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:7,cursor:"pointer",marginBottom:1,
                  background:active===key?"rgba(99,102,241,0.3)":"transparent",transition:"background .12s"}}
                onMouseEnter={e=>{ if(active!==key) e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
                onMouseLeave={e=>{ if(active!==key) e.currentTarget.style.background="transparent"; }}>
                <span style={{fontSize:13,width:18,textAlign:"center",flexShrink:0}}>{icon}</span>
                <span style={{fontSize:11,color:active===key?"#a5b4fc":"#94a3b8",fontWeight:active===key?700:400}}>{label}</span>
                {active===key && <div style={{width:3,height:3,borderRadius:"50%",background:"#a5b4fc",marginLeft:"auto"}}/>}
              </div>
            ))}
          </div>
        )}
        {role === "faculty" && (
          <div style={{borderTop:"1px solid #3a3a4a",marginTop:8,padding:"10px 8px 4px"}}>
            <div style={{fontSize:9,color:"#6366f1",fontWeight:800,marginBottom:6,letterSpacing:1,paddingLeft:4,textTransform:"uppercase"}}>⚡ Working Modules</div>
            {[
              ["🏠","Dashboard","dashboard"],
              ["👥","Subjects & Students","subjects"],
              ["📋","Attendance Upload","attendance"],
              ["📥","Export Attendance","attendanceexport"],
              ["📢","Bulk Message","bulkmessage"],
              ["📝","Assignments","assignments"],
              ["📊","Evaluation","evaluation"],
              ["📄","Question Paper","qpaper"],
              ["🔬","Research","research"],
              ["📅","Exam & Duty","duty"],
              ["💬","Feedback Results","feedback"],
              ["📰","Notices","notices"],
            ].map(([icon,label,key])=>(
              <div key={key+label} onClick={()=>setActive(key)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:7,cursor:"pointer",marginBottom:1,
                  background:active===key?"rgba(99,102,241,0.3)":"transparent",transition:"background .12s"}}
                onMouseEnter={e=>{ if(active!==key) e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
                onMouseLeave={e=>{ if(active!==key) e.currentTarget.style.background="transparent"; }}>
                <span style={{fontSize:13,width:18,textAlign:"center",flexShrink:0}}>{icon}</span>
                <span style={{fontSize:11,color:active===key?"#a5b4fc":"#94a3b8",fontWeight:active===key?700:400}}>{label}</span>
                {active===key && <div style={{width:3,height:3,borderRadius:"50%",background:"#a5b4fc",marginLeft:"auto"}}/>}
              </div>
            ))}
          </div>
        )}
        {role === "admin" && (
          <div style={{borderTop:"1px solid #3a3a4a",marginTop:8,padding:"10px 8px 0"}}>
            <div style={{fontSize:10,color:"#7c8db5",fontWeight:700,marginBottom:6,letterSpacing:0.6,paddingLeft:4}}>⚡ QUICK LINKS</div>
            {[
              ["🔐","User Approvals","approvals"],
              ["👥","Students","students"],
              ["🧑‍🏫","Faculty","faculty"],
              ["📋","Leave Approvals","leaves"],
              ["📢","Bulk Message","bulkmessage"],
              ["📅","Academic Calendar","calendar"],
              ["🏛️","Departments","departments"],
              ["📚","Courses","courses"],
              ["💰","Fee Management","fees"],
              ["🔍","Audit Logs","auditlog"],
              ["📊","Reports","reports"],
              ["📢","Notices","notices"],
            ].map(([icon,label,key])=>(
              <div key={key+label} onClick={()=>setActive(key)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:7,cursor:"pointer",marginBottom:2,
                  background:active===key?"rgba(99,102,241,0.25)":"transparent",transition:"background .12s"}}
                onMouseEnter={e=>{ if(active!==key) e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
                onMouseLeave={e=>{ if(active!==key) e.currentTarget.style.background="transparent"; }}>
                <span style={{fontSize:14,width:18,textAlign:"center",flexShrink:0}}>{icon}</span>
                <span style={{fontSize:11,color:active===key?"#a5b4fc":"#94a3b8",fontWeight:active===key?700:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</span>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,padding:16,minHeight:"calc(100vh - 90px)",background:darkMode?"#0f172a":"#f0f0f0"}} className="erp-main">
          {views[active]||<div style={{color:"#aaa",textAlign:"center",padding:40}}>Coming soon</div>}
        </div>
      </div>
    </div>
  );
}
