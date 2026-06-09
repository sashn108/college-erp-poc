import { useState } from "react";

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar() {
  const today = new Date();
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = cur.getFullYear(), month = cur.getMonth();
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const monthName = cur.toLocaleString("default",{month:"long"});
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const prevMonth = () => setCur(new Date(year, month-1, 1));
  const nextMonth = () => setCur(new Date(year, month+1, 1));
  const cells = [];
  for(let i=0;i<offset;i++) cells.push(null);
  for(let i=1;i<=daysInMonth;i++) cells.push(i);
  // highlight: today, and some "event" days
  const events = [13,14,20,21,26];
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  return (
    <div style={{padding:"12px 10px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <button onClick={prevMonth} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16}}>‹</button>
        <span style={{fontWeight:700,fontSize:14,color:"#fff"}}>{monthName} {year}</span>
        <button onClick={nextMonth} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center"}}>
        {days.map(d=><div key={d} style={{fontSize:10,color:"#888",padding:"3px 0",fontWeight:600}}>{d}</div>)}
        {cells.map((d,i)=> d===null
          ? <div key={"e"+i}/>
          : <div key={d} style={{
              fontSize:12,padding:"4px 0",borderRadius:4,cursor:"pointer",
              background: isToday(d) ? "#6366f1" : events.includes(d) ? "#4338ca" : "transparent",
              color: isToday(d) ? "#fff" : events.includes(d) ? "#ff9999" : "#ccc",
              fontWeight: isToday(d) ? 700 : 400
            }}>{d}</div>
        )}
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
    if(role==="student"&&uid==="S001"&&pass==="student123") onLogin("student",{name:"SUBHASHISH NAYAK",roll:"520CS2008",dept:"CSE",year:"PhD Scholar",id:"S001"});
    else if(role==="faculty"&&uid==="F001"&&pass==="faculty123") onLogin("faculty",{name:"Dr. Priya Singh",dept:"CSE",designation:"Asst. Professor",id:"F001"});
    else setErr("Invalid. Use S001/student123 or F001/faculty123");
  };
  return (
    <div style={{minHeight:"100vh",background:"#1a1a2e",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:4,padding:"40px 36px",width:380,boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:28,fontWeight:900,color:"#6366f1",letterSpacing:1}}>ITER ERP</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>Siksha 'O' Anusandhan University</div>
        </div>
        <div style={{display:"flex",background:"#f5f5f5",borderRadius:4,marginBottom:20,padding:3}}>
          {["student","faculty"].map(r=>(
            <button key={r} onClick={()=>{setRole(r);setErr("");}} style={{flex:1,padding:"8px",border:"none",borderRadius:3,cursor:"pointer",fontSize:13,fontWeight:600,
              background:role===r?"#6366f1":"transparent",color:role===r?"#fff":"#555"}}>
              {r==="student"?"Student":"Faculty"}
            </button>
          ))}
        </div>
        {[{ph:role==="student"?"Roll Number (S001)":"Faculty ID (F001)",val:uid,set:setUid,type:"text"},
          {ph:"Password",val:pass,set:setPass,type:"password"}].map(({ph,val,set,type},i)=>(
          <input key={i} type={type} placeholder={ph} value={val}
            onChange={e=>{set(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{width:"100%",boxSizing:"border-box",padding:"10px 12px",border:"1px solid #ddd",borderRadius:3,fontSize:14,marginBottom:12,outline:"none",fontFamily:"inherit"}}/>
        ))}
        {err&&<div style={{color:"#c0392b",fontSize:13,marginBottom:10,padding:"7px 10px",background:"#fdf0f0",borderRadius:3}}>{err}</div>}
        <button onClick={handle} style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:3,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>
          Sign In
        </button>
        <div style={{color:"#aaa",fontSize:11,textAlign:"center",marginTop:16}}>
          Demo: S001 / student123 &nbsp;|&nbsp; F001 / faculty123
        </div>
      </div>
    </div>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────
function Header({ user, role, onLogout, academicOpen, setAcademicOpen }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  const timeStr = now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

  const studentMenuItems = [
    ["Student Information","user"],["Registration","reg"],["Attendance and Leave","attendance"],
    ["Feedback / Assessment","feedback"],["Examination","exam"],["Fee Payment","fee"],
    ["Hostel Management","hostel"],["Thesis Submission","thesis"],["Assignments","assignments"],
    ["Research Scholars' Week","research"],["SAC Election","sac"],["Student Project management","project"],
    ["Dissertation Template","dissertation"],["Scholarships","scholarship"],
    ["Account Settings","settings"],["Other Services","other"],["Career Development Centre","career"],
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
            {menuItems.map(([label])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",fontSize:13,color:"#333",fontWeight:500}}
                onClick={()=>setAcademicOpen(false)}>
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

      {/* Registered Courses */}
      <Widget title="Registered Courses [ 2025-26 / Spring ]" style={{gridColumn:"1/3"}}>
        <div style={{color:"#888",fontSize:13,padding:"20px 0",textAlign:"center"}}>No Records Found...</div>
      </Widget>

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
  const birthdays = [
    { name:"Dr. Ramesh Kumar Panda", dept:"CSE", date:"Jun 9" },
    { name:"Prof. Sunita Das", dept:"ECE", date:"Jun 11" },
    { name:"Dr. Manoj Behera", dept:"MECH", date:"Jun 14" },
    { name:"Prof. Anita Mohanty", dept:"CIVIL", date:"Jun 17" },
    { name:"Dr. Bikash Sahoo", dept:"EEE", date:"Jun 20" },
    { name:"Prof. Lipika Nanda", dept:"CSE", date:"Jun 22" },
  ];
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

      <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",gap:14}}>
        {/* Birthdays */}
        <Widget title="🎂 Faculty Birthdays This Month">
          {birthdays.map((b,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f0f0f0"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#333"}}>{b.name}</div>
                <div style={{fontSize:11,color:"#888"}}>Dept. of {b.dept}</div>
              </div>
              <div style={{fontSize:12,fontWeight:700,color:"#6366f1",whiteSpace:"nowrap",marginLeft:8}}>{b.date}</div>
            </div>
          ))}
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
                  <td style={{padding:"5px 8px",color:"#c0392b",fontWeight:600,textAlign:"right",whiteSpace:"nowrap",fontSize:11}}>{dt}</td>
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
  const [tab,setTab]=useState("schedule");
  const schedule=[
    {date:"Jun 18",subject:"DBMS",code:"CS301",time:"10:00–1:00",room:"201-A"},
    {date:"Jun 20",subject:"Operating Systems",code:"CS302",time:"10:00–1:00",room:"202-B"},
    {date:"Jun 22",subject:"Computer Networks",code:"CS303",time:"2:00–5:00",room:"201-A"},
    {date:"Jun 25",subject:"Theory of Computation",code:"CS304",time:"10:00–1:00",room:"203-C"},
  ];
  return (
    <Widget title="Examination">
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["schedule","results"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 16px",border:"1px solid #6366f1",borderRadius:2,cursor:"pointer",fontSize:12,fontWeight:600,
            background:tab===t?"#6366f1":"#fff",color:tab===t?"#fff":"#6366f1"}}>
            {t==="schedule"?"Exam Schedule":"Results"}
          </button>
        ))}
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"#6366f1",color:"#fff"}}>
            {(tab==="schedule"?["Date","Code","Subject","Time","Room"]:["Semester","SGPA","CGPA","Result"]).map(h=>(
              <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tab==="schedule"&&schedule.map((e,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#6366f1"}}>{e.date}</td>
              <td style={{padding:"8px 10px",color:"#555"}}>{e.code}</td>
              <td style={{padding:"8px 10px",color:"#333",fontWeight:500}}>{e.subject}</td>
              <td style={{padding:"8px 10px",color:"#555"}}>{e.time}</td>
              <td style={{padding:"8px 10px",color:"#333"}}>{e.room}</td>
            </tr>
          ))}
          {tab==="results"&&[
            ["Semester 5","8.4","8.1","Pass"],["Semester 4","8.2","8.0","Pass"],["Semester 3","7.9","7.8","Pass"],
          ].map(([sem,sgpa,cgpa,res],i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
              <td style={{padding:"8px 10px",color:"#333",fontWeight:500}}>{sem}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#6366f1"}}>{sgpa}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#1a6b2a"}}>{cgpa}</td>
              <td style={{padding:"8px 10px"}}><span style={{padding:"2px 10px",background:"#e8f8f0",color:"#27ae60",borderRadius:2,fontSize:11,fontWeight:700}}>{res}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  );
}

// ─── Fee View ─────────────────────────────────────────────────────────────────
function FeeView() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Widget title="Fee Payment">
        {[["Tuition Fee","₹80,000","Paid"],["Exam Fee","₹3,000","Paid"],["Development Fee","₹5,000","Due"],["Library Fee","₹2,000","Paid"],["Lab Fee","₹5,000","Due"]].map(([l,a,s],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #f0f0f0",fontSize:13}}>
            <span style={{color:"#444"}}>{l}</span>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontWeight:700,color:"#333"}}>{a}</span>
              <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,background:s==="Paid"?"#e8f8f0":"#fdf0f0",color:s==="Paid"?"#27ae60":"#e74c3c"}}>{s}</span>
            </div>
          </div>
        ))}
      </Widget>
      <Widget title="Scholarships">
        {[{name:"SOA Merit Scholarship",amount:"₹20,000/yr",status:"Active"},{name:"AICTE Pragati",amount:"₹30,000/yr",status:"Applied"}].map((s,i)=>(
          <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #f0f0f0"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div style={{fontWeight:600,fontSize:13,color:"#333"}}>{s.name}</div>
              <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,background:s.status==="Active"?"#e8f8f0":"#fff8e1",color:s.status==="Active"?"#27ae60":"#f39c12"}}>{s.status}</span>
            </div>
            <div style={{fontSize:12,color:"#888",marginTop:3}}>{s.amount}</div>
          </div>
        ))}
      </Widget>
    </div>
  );
}

// ─── Assignments View ─────────────────────────────────────────────────────────
function AssignmentsView() {
  const data=[
    {sub:"DBMS",title:"ER Diagram for Hospital DB",due:"Jun 12",marks:20,status:"Pending"},
    {sub:"OS",title:"CPU Scheduling Algorithms",due:"Jun 10",marks:15,status:"Submitted"},
    {sub:"CN",title:"Subnetting Practice",due:"Jun 8",marks:10,status:"Evaluated",score:9},
    {sub:"TOC",title:"NFA to DFA Conversion",due:"Jun 15",marks:25,status:"Pending"},
  ];
  return (
    <Widget title="Assignments">
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"#6366f1",color:"#fff"}}>
            {["Subject","Title","Due","Max Marks","Status","Action"].map(h=>(
              <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((a,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
              <td style={{padding:"9px 10px",color:"#6366f1",fontWeight:700}}>{a.sub}</td>
              <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{a.title}</td>
              <td style={{padding:"9px 10px",color:"#555"}}>{a.due}</td>
              <td style={{padding:"9px 10px",textAlign:"center"}}>{a.marks}</td>
              <td style={{padding:"9px 10px"}}>
                <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,
                  background:a.status==="Submitted"?"#e8f0ff":a.status==="Evaluated"?"#e8f8f0":"#fff8e1",
                  color:a.status==="Submitted"?"#6366f1":a.status==="Evaluated"?"#27ae60":"#f39c12"}}>{a.status}</span>
              </td>
              <td style={{padding:"9px 10px"}}>
                {a.status==="Pending"&&<button style={{padding:"4px 12px",background:"#6366f1",color:"#fff",border:"none",borderRadius:2,cursor:"pointer",fontSize:11,fontWeight:600}}>Upload</button>}
                {a.status==="Evaluated"&&<span style={{fontWeight:700,color:"#27ae60"}}>{a.score}/{a.marks}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
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
function FacultySubjectsView() {
  const [sel, setSel] = useState(null);
  const [modal, setModal] = useState(null); // {to, toAll, subjectName}
  const [inbox, setInbox] = useState([
    {from:"Riya Patel",roll:"22CS001",subj:"Query about Assignment #4",msg:"Ma'am, can you clarify the ER diagram requirements?",time:"Jun 8, 9:42 AM",read:false},
    {from:"Amit Kumar",roll:"22CS005",subj:"Lab file submission",msg:"Sir, I submitted the lab file. Please check.",time:"Jun 7, 2:15 PM",read:true},
    {from:"Priya Nair",roll:"22CS012",subj:"Leave for Jun 10",msg:"Sir, I will be absent on Jun 10 due to medical reasons.",time:"Jun 6, 11:00 AM",read:false},
  ]);
  const [activeTab, setActiveTab] = useState("students");

  const subjectData = {
    "CS301": [
      {roll:"22CS001",name:"Riya Patel",email:"riya@iter.in",project:"EEG Cognitive Load",attendance:"90%",grade:"A+"},
      {roll:"22CS002",name:"Aryan Mishra",email:"aryan@iter.in",project:"—",attendance:"82%",grade:"A"},
      {roll:"22CS003",name:"Sneha Patil",email:"sneha@iter.in",project:"—",attendance:"76%",grade:"B+"},
      {roll:"22CS004",name:"Rohan Das",email:"rohan@iter.in",project:"—",attendance:"65%",grade:"B"},
    ],
    "CS301L": [
      {roll:"22CS011",name:"Priya Nair",email:"priya@iter.in",project:"ML on Medical Data",attendance:"95%",grade:"O"},
      {roll:"22CS012",name:"Kiran Joshi",email:"kiran@iter.in",project:"—",attendance:"88%",grade:"A+"},
    ],
    "CS302": [
      {roll:"22CS005",name:"Amit Kumar",email:"amit@iter.in",project:"IoT Home Automation",attendance:"78%",grade:"A"},
      {roll:"22CS006",name:"Neha Sharma",email:"neha@iter.in",project:"—",attendance:"85%",grade:"A+"},
      {roll:"22CS007",name:"Vikram Rao",email:"vikram@iter.in",project:"—",attendance:"70%",grade:"B+"},
    ],
    "CS499": [
      {roll:"22CS021",name:"Deepak Nanda",email:"deepak@iter.in",project:"Blockchain Voting",attendance:"92%",grade:"O"},
      {roll:"22CS022",name:"Ananya Mohanty",email:"ananya@iter.in",project:"AR Navigation",attendance:"88%",grade:"A+"},
    ],
  };

  const subjects = [
    {code:"CS301",name:"Database Management Systems",class:"CSE 5A",type:"Theory"},
    {code:"CS301L",name:"DBMS Lab",class:"CSE 5B",type:"Lab"},
    {code:"CS302",name:"Operating Systems",class:"CSE 5C",type:"Theory"},
    {code:"CS499",name:"Final Year Project",class:"CSE 7A",type:"Project"},
  ];

  const students = sel ? (subjectData[sel.code] || []) : [];
  const unread = inbox.filter(m=>!m.read).length;

  const typeColor = {Theory:"#6366f1", Lab:"#f59e0b", Project:"#10b981"};

  return (
    <>
      {modal && <MessageModal to={modal.to} toAll={modal.toAll} subject={modal.subjectName} onClose={()=>setModal(null)}/>}

      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:14}}>
        {/* Left: subject list */}
        <div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 14px",color:"#fff",fontWeight:700,fontSize:13}}>My Subjects</div>
            {subjects.map(s=>(
              <div key={s.code} onClick={()=>{setSel(s);setActiveTab("students");}}
                style={{padding:"12px 14px",borderBottom:"1px solid #f1f5f9",cursor:"pointer",
                  background:sel?.code===s.code?"#eef2ff":"#fff",
                  borderLeft:sel?.code===s.code?"4px solid #6366f1":"4px solid transparent",transition:"all .15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:13,color:"#6366f1"}}>{s.code}</span>
                  <span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:20,background:(typeColor[s.type]||"#6366f1")+"20",color:typeColor[s.type]||"#6366f1"}}>{s.type}</span>
                </div>
                <div style={{fontSize:12,color:"#334155",fontWeight:500,lineHeight:1.3}}>{s.name}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.class} · {(subjectData[s.code]||[]).length} students</div>
              </div>
            ))}
          </div>

          {/* Inbox summary */}
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginTop:14}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 14px",color:"#fff",fontWeight:700,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>Student Inbox</span>
              {unread>0&&<span style={{background:"#ef4444",borderRadius:20,fontSize:11,padding:"1px 8px",fontWeight:700}}>{unread} new</span>}
            </div>
            {inbox.map((m,i)=>(
              <div key={i} onClick={()=>setInbox(prev=>prev.map((x,j)=>j===i?{...x,read:true}:x))}
                style={{padding:"10px 14px",borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:m.read?"#fff":"#f0f4ff"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:m.read?500:700,fontSize:12,color:"#334155"}}>{m.from}</span>
                  {!m.read&&<span style={{width:8,height:8,borderRadius:"50%",background:"#6366f1",display:"inline-block"}}/>}
                </div>
                <div style={{fontSize:12,color:"#6366f1",fontWeight:600,marginTop:1}}>{m.subj}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.msg}</div>
                <div style={{fontSize:10,color:"#cbd5e1",marginTop:2}}>{m.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: students + messaging */}
        <div>
          {!sel ? (
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"60px 0",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>📚</div>
              <div style={{fontWeight:700,fontSize:16,color:"#0f172a",marginBottom:6}}>Select a Subject</div>
              <div style={{color:"#94a3b8",fontSize:13}}>Click any subject on the left to view your students</div>
            </div>
          ) : (
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
              {/* Subject header */}
              <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{sel.name}</div>
                  <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{sel.code} · {sel.class} · {students.length} students</div>
                </div>
                <button onClick={()=>setModal({toAll:true,subjectName:sel.name})}
                  style={{padding:"8px 16px",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                  📢 Message All Students
                </button>
              </div>

              {/* Tabs */}
              <div style={{display:"flex",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"}}>
                {["students","inbox"].map(t=>(
                  <button key={t} onClick={()=>setActiveTab(t)}
                    style={{padding:"10px 20px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:activeTab===t?700:500,
                      color:activeTab===t?"#6366f1":"#64748b",borderBottom:activeTab===t?"2px solid #6366f1":"2px solid transparent"}}>
                    {t==="students"?"👥 Students":`📩 Inbox ${unread>0?`(${unread} unread)`:""}`}
                  </button>
                ))}
              </div>

              {activeTab==="students" && (
                <div style={{padding:0}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead>
                      <tr style={{background:"#f8fafc"}}>
                        {["Roll No.","Name","Email","Project / Group","Attendance","Grade","Message"].map(h=>(
                          <th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,color:"#475569",fontSize:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s,i)=>(
                        <tr key={s.roll} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbff"}}>
                          <td style={{padding:"11px 14px",color:"#6366f1",fontWeight:700}}>{s.roll}</td>
                          <td style={{padding:"11px 14px",color:"#0f172a",fontWeight:600}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>
                                {s.name[0]}
                              </div>
                              {s.name}
                            </div>
                          </td>
                          <td style={{padding:"11px 14px",color:"#64748b",fontSize:12}}>{s.email}</td>
                          <td style={{padding:"11px 14px",color:"#64748b",fontSize:12}}>{s.project}</td>
                          <td style={{padding:"11px 14px"}}>
                            <span style={{fontWeight:700,color:parseInt(s.attendance)>=75?"#10b981":"#ef4444",fontSize:13}}>{s.attendance}</span>
                          </td>
                          <td style={{padding:"11px 14px"}}>
                            <span style={{padding:"2px 8px",borderRadius:6,background:"#eef2ff",color:"#6366f1",fontSize:12,fontWeight:700}}>{s.grade}</span>
                          </td>
                          <td style={{padding:"11px 14px"}}>
                            <button onClick={()=>setModal({to:s,toAll:false,subjectName:sel.name})}
                              style={{padding:"6px 14px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                              ✉ Message
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab==="inbox" && (
                <div style={{padding:14}}>
                  {inbox.length===0&&<div style={{textAlign:"center",color:"#94a3b8",padding:40}}>No messages yet</div>}
                  {inbox.map((m,i)=>(
                    <div key={i} onClick={()=>setInbox(prev=>prev.map((x,j)=>j===i?{...x,read:true}:x))}
                      style={{padding:"14px 16px",border:"1px solid",borderColor:m.read?"#e2e8f0":"#c7d2fe",borderRadius:10,marginBottom:10,background:m.read?"#fff":"#f0f4ff",cursor:"pointer",transition:"all .15s"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700}}>
                            {m.from[0]}
                          </div>
                          <div>
                            <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{m.from}</div>
                            <div style={{fontSize:11,color:"#94a3b8"}}>{m.roll} · {m.time}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          {!m.read&&<span style={{background:"#6366f1",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>NEW</span>}
                          <button onClick={e=>{e.stopPropagation();setModal({to:{name:m.from,email:m.roll+"@iter.in"},toAll:false,subjectName:sel.name});}}
                            style={{padding:"4px 12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>
                            Reply
                          </button>
                        </div>
                      </div>
                      <div style={{fontWeight:600,fontSize:13,color:"#334155",marginBottom:3}}>{m.subj}</div>
                      <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{m.msg}</div>
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
export default function App() {
  const [auth,setAuth]=useState(null);
  const [role,setRole]=useState(null);
  const [active,setActive]=useState("dashboard");
  const [academicOpen,setAcademicOpen]=useState(false);

  if(!auth) return <Login onLogin={(r,u)=>{setRole(r);setAuth(u);setActive("dashboard");}}/>;

  // Close dropdown when clicking outside
  const handleMain = () => { if(academicOpen) setAcademicOpen(false); };

  const studentViews = {
    dashboard:<StudentDashboard user={auth}/>, attendance:<AttendanceView/>,
    exam:<ExamView/>, fee:<FeeView/>, assignments:<AssignmentsView/>, notices:<NoticesView/>,
  };
  const facultyViews = {
    dashboard:<FacultyDashboard user={auth}/>, subjects:<FacultySubjectsView/>,
    lab:<LabView/>, evaluation:<EvaluationView/>, research:<ResearchView/>,
    duty:<DutyView/>, notices:<NoticesView/>,
  };
  const views = role==="student" ? studentViews : facultyViews;

  // Map Academic menu items to view keys
  const menuToView = {
    "Attendance and Leave":"attendance","Examination":"exam","Fee Payment":"fee",
    "Assignments":"assignments","Notices and Announcements":"notices",
    "Subjects & Students":"subjects","Lab Management":"lab",
    "Evaluation":"evaluation","Research Scholars":"research","Exam & Duty":"duty",
    "Dashboard":"dashboard","Student Information":"dashboard","Registration":"dashboard",
    "Hostel Management":"dashboard","Thesis Submission":"dashboard",
    "Research Scholars' Week":"research","SAC Election":"dashboard",
    "Student Project management":"dashboard","Dissertation Template":"dashboard",
    "Scholarships":"fee","Account Settings":"dashboard",
    "Other Services":"dashboard","Career Development Centre":"dashboard",
    "Feedback / Assessment":"dashboard",
  };

  return (
    <div style={{minHeight:"100vh",background:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif"}} onClick={handleMain}>
      <Header user={auth} role={role} onLogout={()=>{setAuth(null);setRole(null);}}
        academicOpen={academicOpen}
        setAcademicOpen={setAcademicOpen}/>

      {/* Sub-header breadcrumb */}
      <div style={{background:"#6366f1",color:"#fff",padding:"6px 20px",fontSize:12,display:"flex",gap:8,alignItems:"center"}}>
        <span style={{opacity:0.7}}>Home</span>
        <span style={{opacity:0.5}}>›</span>
        <span style={{fontWeight:600}}>
          {role==="student"
            ? `Welcome ${auth.name} — ${auth.dept} · ${auth.year}`
            : `Welcome ${auth.name} — ${auth.designation} · Dept. of ${auth.dept}`}
        </span>
      </div>

      <div style={{display:"flex",alignItems:"flex-start"}}>
        {/* Left sidebar — Calendar */}
        <div style={{width:200,flexShrink:0,background:"#2d2d2d",minHeight:"calc(100vh - 90px)",paddingTop:4}}>
          <MiniCalendar/>
          <div style={{borderTop:"1px solid #444",marginTop:8,padding:"10px 10px 0"}}>
            <div style={{fontSize:11,color:"#888",fontWeight:700,marginBottom:6,letterSpacing:0.5}}>QUICK LINKS</div>
            {(role==="student"
              ?[["Dashboard","dashboard"],["Attendance","attendance"],["Examination","exam"],["Fee Payment","fee"],["Assignments","assignments"],["Notices","notices"]]
              :[["Dashboard","dashboard"],["Subjects","subjects"],["Lab","lab"],["Evaluation","evaluation"],["Research","research"],["Duty","duty"],["Notices","notices"]]
            ).map(([label,key])=>(
              <div key={key} onClick={()=>setActive(key)}
                style={{padding:"7px 8px",borderRadius:2,cursor:"pointer",fontSize:12,marginBottom:2,
                  background:active===key?"#6366f1":"transparent",
                  color:active===key?"#fff":"#bbb",fontWeight:active===key?600:400}}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{flex:1,padding:16,minHeight:"calc(100vh - 90px)"}}>
          {views[active] || <div style={{color:"#aaa",textAlign:"center",padding:40}}>Coming soon</div>}
        </div>
      </div>
    </div>
  );
}
