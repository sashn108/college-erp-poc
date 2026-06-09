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
              background: isToday(d) ? "#8b1a1a" : events.includes(d) ? "#5a1a1a" : "transparent",
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
          <div style={{fontSize:28,fontWeight:900,color:"#8b1a1a",letterSpacing:1}}>ITER ERP</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>Siksha 'O' Anusandhan University</div>
        </div>
        <div style={{display:"flex",background:"#f5f5f5",borderRadius:4,marginBottom:20,padding:3}}>
          {["student","faculty"].map(r=>(
            <button key={r} onClick={()=>{setRole(r);setErr("");}} style={{flex:1,padding:"8px",border:"none",borderRadius:3,cursor:"pointer",fontSize:13,fontWeight:600,
              background:role===r?"#8b1a1a":"transparent",color:role===r?"#fff":"#555"}}>
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
        <button onClick={handle} style={{width:"100%",padding:"11px",background:"#8b1a1a",border:"none",borderRadius:3,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>
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
      <div style={{background:"#fff",borderBottom:"3px solid #8b1a1a",display:"flex",alignItems:"center",padding:"0 16px",height:56,gap:16,fontFamily:"'Segoe UI',sans-serif"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:6,minWidth:140}}>
          <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:22,color:"#8b1a1a",fontStyle:"italic",letterSpacing:1}}>ITER</div>
          <div style={{fontSize:9,color:"#888",lineHeight:1.2}}>SOA<br/>University</div>
        </div>
        {/* Hamburger */}
        <div style={{cursor:"pointer",fontSize:20,color:"#555"}}>☰</div>
        {/* Academic dropdown trigger */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setAcademicOpen(o=>!o)}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,color:"#333",display:"flex",alignItems:"center",gap:4,padding:"6px 10px"}}>
            Academic <span style={{fontSize:10,color:"#8b1a1a"}}>▼</span>
          </button>
        </div>
        <div style={{flex:1}}/>
        {/* Right side */}
        <div style={{fontSize:13,color:"#555",fontWeight:500}}>{dateStr} &nbsp; {timeStr}</div>
        <div style={{width:34,height:34,borderRadius:"50%",background:"#8b1a1a",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}
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
                <span style={{color:"#8b1a1a",fontSize:15}}>●</span> {label}
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
      <div style={{background:"#8b1a1a",color:"#fff",padding:"8px 14px",fontSize:13,fontWeight:700}}>{title}</div>
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
            <tr style={{background:"#2c3e7a",color:"#fff"}}>
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
                <td style={{padding:"6px 8px",textAlign:"center"}}><span style={{color:"#8b1a1a",cursor:"pointer",fontSize:16}}>📄</span></td>
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
            <tr style={{background:"#2c3e7a",color:"#fff"}}>
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
    { label:"Total Students Enrolled", value:"4,872", icon:"🎓", color:"#2c3e7a" },
    { label:"Total Faculty", value:"312", icon:"👨‍🏫", color:"#8b1a1a" },
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
      <div style={{background:"linear-gradient(135deg,#8b1a1a,#c0392b)",color:"#fff",borderRadius:3,padding:"14px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
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
              <div style={{fontSize:12,fontWeight:700,color:"#8b1a1a",whiteSpace:"nowrap",marginLeft:8}}>{b.date}</div>
            </div>
          ))}
        </Widget>

        {/* Circulars */}
        <Widget title="External Circulars">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#2c3e7a",color:"#fff"}}>
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
              <tr style={{background:"#2c3e7a",color:"#fff"}}>
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
  const subjects = [
    {code:"CS301",name:"Database Management Systems",total:40,present:36,faculty:"Dr. A. Sharma"},
    {code:"CS302",name:"Operating Systems",total:42,present:31,faculty:"Prof. S. Das"},
    {code:"CS303",name:"Computer Networks",total:38,present:32,faculty:"Dr. R. Panda"},
    {code:"CS304",name:"Theory of Computation",total:35,present:23,faculty:"Dr. K. Rath"},
    {code:"CS305",name:"Software Engineering",total:40,present:32,faculty:"Prof. M. Behera"},
  ];
  return (
    <Widget title="Attendance and Leave">
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"#2c3e7a",color:"#fff"}}>
            {["Code","Subject","Faculty","Present","Total","Attendance","Status"].map(h=>(
              <th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:12}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((s,i)=>{
            const pct=Math.round(s.present/s.total*100);
            return (
              <tr key={s.code} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
                <td style={{padding:"9px 10px",color:"#8b1a1a",fontWeight:700}}>{s.code}</td>
                <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{s.name}</td>
                <td style={{padding:"9px 10px",color:"#555"}}>{s.faculty}</td>
                <td style={{padding:"9px 10px",textAlign:"center"}}>{s.present}</td>
                <td style={{padding:"9px 10px",textAlign:"center"}}>{s.total}</td>
                <td style={{padding:"9px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:60,height:6,background:"#eee",borderRadius:3}}>
                      <div style={{width:pct+"%",height:"100%",background:pct>=75?"#27ae60":"#e74c3c",borderRadius:3}}/>
                    </div>
                    <span style={{fontWeight:700,color:pct>=75?"#27ae60":"#e74c3c"}}>{pct}%</span>
                  </div>
                </td>
                <td style={{padding:"9px 10px"}}>
                  <span style={{padding:"2px 8px",borderRadius:2,background:pct>=75?"#e8f8f0":"#fdf0f0",color:pct>=75?"#27ae60":"#e74c3c",fontSize:11,fontWeight:700}}>
                    {pct>=75?"Safe":"Short"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Widget>
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
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 16px",border:"1px solid #8b1a1a",borderRadius:2,cursor:"pointer",fontSize:12,fontWeight:600,
            background:tab===t?"#8b1a1a":"#fff",color:tab===t?"#fff":"#8b1a1a"}}>
            {t==="schedule"?"Exam Schedule":"Results"}
          </button>
        ))}
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"#2c3e7a",color:"#fff"}}>
            {(tab==="schedule"?["Date","Code","Subject","Time","Room"]:["Semester","SGPA","CGPA","Result"]).map(h=>(
              <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tab==="schedule"&&schedule.map((e,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#8b1a1a"}}>{e.date}</td>
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
              <td style={{padding:"8px 10px",fontWeight:700,color:"#2c3e7a"}}>{sgpa}</td>
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
          <tr style={{background:"#2c3e7a",color:"#fff"}}>
            {["Subject","Title","Due","Max Marks","Status","Action"].map(h=>(
              <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((a,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
              <td style={{padding:"9px 10px",color:"#8b1a1a",fontWeight:700}}>{a.sub}</td>
              <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{a.title}</td>
              <td style={{padding:"9px 10px",color:"#555"}}>{a.due}</td>
              <td style={{padding:"9px 10px",textAlign:"center"}}>{a.marks}</td>
              <td style={{padding:"9px 10px"}}>
                <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,
                  background:a.status==="Submitted"?"#e8f0ff":a.status==="Evaluated"?"#e8f8f0":"#fff8e1",
                  color:a.status==="Submitted"?"#2c3e7a":a.status==="Evaluated"?"#27ae60":"#f39c12"}}>{a.status}</span>
              </td>
              <td style={{padding:"9px 10px"}}>
                {a.status==="Pending"&&<button style={{padding:"4px 12px",background:"#8b1a1a",color:"#fff",border:"none",borderRadius:2,cursor:"pointer",fontSize:11,fontWeight:600}}>Upload</button>}
                {a.status==="Evaluated"&&<span style={{fontWeight:700,color:"#27ae60"}}>{a.score}/{a.marks}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  );
}

// ─── Faculty Subjects View ────────────────────────────────────────────────────
function FacultySubjectsView() {
  const [sel,setSel]=useState(null);
  const subjects=[
    {code:"CS301",name:"Database Management Systems",class:"CSE 5A",students:52},
    {code:"CS301L",name:"DBMS Lab",class:"CSE 5B",students:48},
    {code:"CS302",name:"Operating Systems",class:"CSE 5C",students:50},
    {code:"CS499",name:"Final Year Project",class:"CSE 7A",students:36},
  ];
  const students=[
    {roll:"22CS001",name:"Riya Patel",email:"riya@iter.in",project:"EEG Cognitive Load"},
    {roll:"22CS005",name:"Amit Kumar",email:"amit@iter.in",project:"IoT Home Automation"},
    {roll:"22CS012",name:"Priya Nair",email:"priya@iter.in",project:"ML on Medical Data"},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:14}}>
      <Widget title="Assigned Subjects">
        {subjects.map(s=>(
          <div key={s.code} onClick={()=>setSel(s)} style={{padding:"10px",borderBottom:"1px solid #f0f0f0",cursor:"pointer",background:sel?.code===s.code?"#fdf0f0":"#fff",borderLeft:sel?.code===s.code?"3px solid #8b1a1a":"3px solid transparent"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#8b1a1a"}}>{s.code}</div>
            <div style={{fontSize:13,color:"#333",fontWeight:500}}>{s.name}</div>
            <div style={{fontSize:12,color:"#888"}}>{s.class} · {s.students} students</div>
          </div>
        ))}
      </Widget>
      <Widget title={sel?`Students — ${sel.name}`:"Select a subject"}>
        {!sel&&<div style={{color:"#aaa",textAlign:"center",padding:20,fontSize:13}}>Click a subject to view students</div>}
        {sel&&(
          <>
            <div style={{marginBottom:10,display:"flex",justifyContent:"flex-end"}}>
              <button style={{padding:"5px 14px",background:"#8b1a1a",color:"#fff",border:"none",borderRadius:2,cursor:"pointer",fontSize:12,fontWeight:600}}>✉ Mail All Students</button>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"#2c3e7a",color:"#fff"}}>
                {["Roll No.","Name","Email","Project","Mail"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>)}
              </tr></thead>
              <tbody>{students.map((s,i)=>(
                <tr key={s.roll} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
                  <td style={{padding:"8px 10px",color:"#8b1a1a",fontWeight:700}}>{s.roll}</td>
                  <td style={{padding:"8px 10px",color:"#333",fontWeight:500}}>{s.name}</td>
                  <td style={{padding:"8px 10px",color:"#555",fontSize:12}}>{s.email}</td>
                  <td style={{padding:"8px 10px",color:"#555",fontSize:12}}>{s.project}</td>
                  <td style={{padding:"8px 10px"}}><button style={{padding:"3px 10px",background:"#f5f5f5",border:"1px solid #ddd",borderRadius:2,cursor:"pointer",fontSize:11}}>✉</button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}
      </Widget>
    </div>
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
        <thead><tr style={{background:"#2c3e7a",color:"#fff"}}>
          {["Student","Subject","Type","Title","Submitted","Max","Status","Action"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((e,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
            <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{e.student}</td>
            <td style={{padding:"9px 10px",color:"#8b1a1a",fontWeight:700}}>{e.subject}</td>
            <td style={{padding:"9px 10px",color:"#555"}}>{e.type}</td>
            <td style={{padding:"9px 10px",color:"#333"}}>{e.title}</td>
            <td style={{padding:"9px 10px",color:"#888"}}>{e.submitted}</td>
            <td style={{padding:"9px 10px",textAlign:"center"}}>{e.maxMarks}</td>
            <td style={{padding:"9px 10px"}}>
              <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,background:e.status==="Graded"?"#e8f8f0":"#fff8e1",color:e.status==="Graded"?"#27ae60":"#f39c12"}}>{e.status}</span>
            </td>
            <td style={{padding:"9px 10px"}}>
              {e.status==="Pending"?<button style={{padding:"4px 12px",background:"#8b1a1a",color:"#fff",border:"none",borderRadius:2,cursor:"pointer",fontSize:11,fontWeight:600}}>Grade</button>
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
                <span style={{padding:"1px 7px",background:"#e8f0ff",color:"#2c3e7a",borderRadius:2,fontSize:11,fontWeight:700}}>{s.roll}</span>
                <span style={{padding:"1px 7px",background:"#f5f5f5",color:"#555",borderRadius:2,fontSize:11}}>{s.stage}</span>
              </div>
              <div style={{fontSize:12,color:"#555",marginBottom:8}}>📖 {s.topic}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:7,background:"#eee",borderRadius:3}}>
                  <div style={{width:s.progress+"%",height:"100%",background:"#8b1a1a",borderRadius:3}}/>
                </div>
                <span style={{fontWeight:700,color:"#8b1a1a",fontSize:13}}>{s.progress}%</span>
              </div>
              <div style={{fontSize:11,color:"#888",marginTop:4}}>Next: {s.next} · Papers: {s.papers}</div>
            </div>
            <div style={{display:"flex",gap:6,marginLeft:12}}>
              <button style={{padding:"5px 12px",background:"#8b1a1a",color:"#fff",border:"none",borderRadius:2,cursor:"pointer",fontSize:11,fontWeight:600}}>✉ Mail</button>
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
        <thead><tr style={{background:"#2c3e7a",color:"#fff"}}>
          {["Date","Time","Duty Type","Venue","Exam","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>)}
        </tr></thead>
        <tbody>{duties.map((d,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
            <td style={{padding:"9px 10px",fontWeight:700,color:"#8b1a1a"}}>{d.date}</td>
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
        <thead><tr style={{background:"#2c3e7a",color:"#fff"}}>
          {["#","Topic","Date","Files Submitted","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:12}}>{h}</th>)}
        </tr></thead>
        <tbody>{sessions.map((s,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee",background:i%2===0?"#f9f9f9":"#fff"}}>
            <td style={{padding:"9px 10px",color:"#8b1a1a",fontWeight:700}}>{s.no}</td>
            <td style={{padding:"9px 10px",color:"#333",fontWeight:500}}>{s.topic}</td>
            <td style={{padding:"9px 10px",color:"#555"}}>{s.date}</td>
            <td style={{padding:"9px 10px",textAlign:"center",color:"#333"}}>{s.submitted}{s.submitted!=="—"?"/48":""}</td>
            <td style={{padding:"9px 10px"}}>
              <span style={{padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:700,background:s.status==="Done"?"#e8f8f0":"#e8f0ff",color:s.status==="Done"?"#27ae60":"#2c3e7a"}}>{s.status}</span>
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
              <div style={{fontWeight:open===i?700:500,fontSize:13,color:open===i?"#8b1a1a":"#333"}}>{n.title}</div>
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
      <div style={{background:"#2c3e7a",color:"#fff",padding:"6px 20px",fontSize:12,display:"flex",gap:8,alignItems:"center"}}>
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
                  background:active===key?"#8b1a1a":"transparent",
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
