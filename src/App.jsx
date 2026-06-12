import { useState } from "react";

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
  const studentLogs = [
    { action:"Logged in", detail:"Chrome on Windows · 103.21.58.142", time:"Today 9:42 AM", type:"auth" },
    { action:"Viewed Hall Ticket", detail:"Sem 5 End Semester Exam", time:"Today 9:44 AM", type:"view" },
    { action:"Submitted Assignment", detail:"CS301 — ER Diagram uploaded", time:"Today 9:50 AM", type:"submit" },
    { action:"Applied for Leave", detail:"Medical Leave Jun 1–2, sent to HOD", time:"Jun 9, 3:15 PM", type:"leave" },
    { action:"Fee Payment", detail:"Sem 5 partial fee ₹15,000 via UPI", time:"Jun 8, 11:00 AM", type:"payment" },
    { action:"Logged in", detail:"Mobile Android · 103.21.58.143", time:"Jun 8, 10:55 AM", type:"auth" },
    { action:"Downloaded Question Paper", detail:"CS301 DBMS 2024", time:"Jun 7, 6:30 PM", type:"download" },
    { action:"Course Registered", detail:"CS306E Machine Learning added", time:"Jun 6, 2:00 PM", type:"register" },
    { action:"Grievance Filed", detail:"GR003 — Water supply C Block", time:"Jun 5, 4:00 PM", type:"grievance" },
    { action:"Password Changed", detail:"Password updated successfully", time:"Jun 3, 8:00 PM", type:"security" },
    { action:"Logged out", detail:"Session ended", time:"Jun 3, 8:05 PM", type:"auth" },
  ];
  const facultyLogs = [
    { action:"Logged in", detail:"Chrome on Windows · 122.170.45.21", time:"Today 8:30 AM", type:"auth" },
    { action:"Attendance Saved", detail:"CS301 CSE5A — Jun 10 (48 students)", time:"Today 10:15 AM", type:"submit" },
    { action:"Marks Updated", detail:"CS301 Mid-1 marks entered for 52 students", time:"Today 11:00 AM", type:"submit" },
    { action:"Message Sent", detail:"Broadcast to CS301 CSE5A — Exam reminder", time:"Today 11:45 AM", type:"message" },
    { action:"Leave Request Approved", detail:"Priya Nair — Jun 10-12 Medical Leave", time:"Jun 9, 3:00 PM", type:"leave" },
    { action:"Publication Added", detail:"Hybrid Clustering paper — Expert Systems", time:"Jun 8, 2:00 PM", type:"submit" },
    { action:"Research Milestone Updated", detail:"Rohit Sharma — Ch.4 deadline set Jun 20", time:"Jun 7, 4:00 PM", type:"submit" },
    { action:"Logged in", detail:"Mobile · 103.21.45.67", time:"Jun 6, 9:00 AM", type:"auth" },
  ];
  const logs = role==="student"?studentLogs:facultyLogs;
  const iconMap = { auth:"🔐", view:"👁", submit:"✅", leave:"📋", payment:"💳", download:"📥", register:"📝", grievance:"⚠️", security:"🔒", message:"✉️" };
  const colorMap = { auth:"#6366f1", view:"#64748b", submit:"#10b981", leave:"#f59e0b", payment:"#8b5cf6", download:"#14b8a6", register:"#6366f1", grievance:"#ef4444", security:"#ef4444", message:"#6366f1" };

  return (
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"12px 16px",color:"#fff",fontWeight:700,fontSize:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>🗃 Activity & Audit Log</span>
        <span style={{fontSize:12,opacity:0.8}}>Last 30 days</span>
      </div>
      <div style={{padding:"8px 0"}}>
        {logs.map((l,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 16px",borderBottom:"1px solid #f8fafc",alignItems:"flex-start"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:(colorMap[l.type]||"#6366f1")+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
              {iconMap[l.type]||"📌"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{l.action}</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:1}}>{l.detail}</div>
            </div>
            <div style={{fontSize:11,color:"#94a3b8",whiteSpace:"nowrap",marginTop:2}}>{l.time}</div>
          </div>
        ))}
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
          <div style={{background:"#fff",border:"2px solid #6366f1",borderRadius:12,padding:"20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff"}}>
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
  const [auth,setAuth]=useState(null);
  const [role,setRole]=useState(null);
  const [active,setActive]=useState("dashboard");
  const [academicOpen,setAcademicOpen]=useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);

  if(!auth) return <Login onLogin={(r,u)=>{setRole(r);setAuth(u);setActive("dashboard");}}/>;

  const notifs = useNotifications(role);
  const unreadCount = notifs.filter(n=>!n.read&&!readNotifs.includes(n.id)).length;

  const studentViews = {
    dashboard:<StudentDashboard user={auth}/>, attendance:<AttendanceView/>,
    exam:<ExamView/>, fee:<FeeView/>, assignments:<AssignmentsView/>, notices:<NoticesView/>,
    timetable:<StudentTimetable/>, papers:<QuestionPapers/>,
    hallticket:<HallTicket user={auth}/>, grievance:<GrievancePortal/>,
    library:<LibraryView/>, placement:<PlacementView/>,
    registration:<CourseRegistration/>, feedback:<FeedbackView/>,
    profile:<StudentProfile user={auth}/>, auditlog:<AuditLog role="student"/>,
    transport:<TransportView/>, alumni:<AlumniConnect user={auth}/>, elearning:<ELearningView/>,
    marksheet:<MarksheetView user={auth}/>,
  };
  const facultyViews = {
    dashboard:<FacultyDashboard user={auth}/>, subjects:<FacultySubjectsView/>,
    lab:<LabView/>, attendance:<AttendanceView/>, evaluation:<EvaluationView/>,
    research:<ResearchView/>, duty:<DutyView/>, notices:<NoticesView/>,
    copo:<COPOView/>, feedback:<FacultyFeedbackView/>,
    profile:<FacultyProfile user={auth}/>, auditlog:<AuditLog role="faculty"/>,
    syllabus:<SyllabusTracker/>,
  };
  const views = role==="student" ? studentViews : facultyViews;

  const studentSidebarLinks = [
    ["Dashboard","dashboard"],["Attendance","attendance"],
    ["Question Papers","papers"],["Examination","exam"],["Marksheet","marksheet"],
    ["Hall Ticket","hallticket"],["Assignments","assignments"],["Fee Payment","fee"],
    ["Library","library"],["Placement Cell","placement"],["E-Learning","elearning"],
    ["Transport","transport"],["Alumni Connect","alumni"],
    ["Course Registration","registration"],["Grievance","grievance"],
    ["Feedback","feedback"],["Profile","profile"],["Audit Log","auditlog"],["Notices","notices"],
  ];
  const facultySidebarLinks = [
    ["Dashboard","dashboard"],["Subjects & Students","subjects"],["Lab","lab"],
    ["Attendance","attendance"],["Evaluation","evaluation"],["Research","research"],
    ["CO/PO Attainment","copo"],["Syllabus Tracker","syllabus"],
    ["Exam & Duty","duty"],["Feedback Results","feedback"],
    ["My Profile","profile"],["Audit Log","auditlog"],["Notices","notices"],
  ];

  // Academic dropdown items
  const studentMenuItems = [
    ["Student Information","profile"],["Registration","registration"],["Attendance and Leave","attendance"],
    ["Feedback / Assessment","feedback"],["Examination","exam"],["Fee Payment","fee"],
    ["Hostel Management","fee"],["Assignments","assignments"],
    ["Hall Ticket","hallticket"],["Library","library"],["Placement Cell","placement"],
    ["E-Learning","elearning"],["Transport","transport"],["Alumni Connect","alumni"],
    ["Grievance Portal","grievance"],["Scholarships","fee"],["Audit Log","auditlog"],
  ];
  const facultyMenuItems = [
    ["Dashboard","dashboard"],["Subjects & Students","subjects"],["Lab Management","lab"],
    ["Attendance & Leave","attendance"],["Evaluation","evaluation"],
    ["Research Scholars","research"],["CO/PO Attainment","copo"],
    ["Exam & Duty","duty"],["Feedback Results","feedback"],
    ["My Profile","profile"],["Audit Log","auditlog"],["Notices","notices"],
  ];

  // bg colours for dark mode
  const bg   = darkMode?"#0f172a":"#f0f0f0";
  const sbg  = darkMode?"#1e293b":"#2d2d2d";
  const mbg  = darkMode?"#1e293b":"#fff";
  const mtxt = darkMode?"#e2e8f0":"#0f172a";

  return (
    <div style={{minHeight:"100vh",background:bg,fontFamily:"'Segoe UI',sans-serif",transition:"background .2s"}} onClick={()=>{if(notifOpen)setNotifOpen(false);}}>

      {/* ── TOP HEADER ── */}
      <div style={{position:"relative",zIndex:100}}>
        <div style={{background:mbg,borderBottom:`3px solid #6366f1`,display:"flex",alignItems:"center",padding:"0 16px",height:56,gap:16,fontFamily:"'Segoe UI',sans-serif"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,minWidth:140}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:22,color:"#6366f1",fontStyle:"italic"}}>ITER</div>
            <div style={{fontSize:9,color:"#888",lineHeight:1.2}}>SOA<br/>University</div>
          </div>
          <div style={{cursor:"pointer",fontSize:20,color:"#555"}}>☰</div>
          {/* Academic dropdown */}
          <div style={{position:"relative"}}>
            <button onClick={e=>{e.stopPropagation();setAcademicOpen(o=>!o);setNotifOpen(false);}}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,color:mtxt,display:"flex",alignItems:"center",gap:4,padding:"6px 10px"}}>
              Academic <span style={{fontSize:10,color:"#6366f1"}}>▼</span>
            </button>
          </div>
          <div style={{flex:1}}/>
          {/* Dark mode */}
          <button onClick={()=>setDarkMode(d=>!d)}
            style={{background:"none",border:"1px solid #e2e8f0",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:16,color:darkMode?"#fbbf24":"#475569"}}>
            {darkMode?"☀️":"🌙"}
          </button>
          {/* Notification bell */}
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{setNotifOpen(o=>!o);setAcademicOpen(false);}}
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
            onClick={()=>{setAuth(null);setRole(null);}}>
            {auth.name[0]}
          </div>
        </div>

        {/* Academic dropdown menu */}
        {academicOpen&&(
          <div style={{position:"absolute",top:56,left:0,right:0,background:mbg,borderBottom:"2px solid #ddd",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",padding:"18px 32px",zIndex:200}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px 24px"}}>
              {(role==="student"?studentMenuItems:facultyMenuItems).map(([label,key])=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",fontSize:13,color:mtxt,fontWeight:500}}
                  onClick={()=>{setActive(key);setAcademicOpen(false);}}>
                  <span style={{color:"#6366f1",fontSize:14}}>●</span> {label}
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
          {role==="student"?`Welcome ${auth.name} — ${auth.dept} · ${auth.year}`:`Welcome ${auth.name} — ${auth.designation} · Dept. of ${auth.dept}`}
        </span>
      </div>

      <div style={{display:"flex",alignItems:"flex-start"}} className="erp-shell">
        {/* ── SIDEBAR ── */}
        <div style={{width:200,flexShrink:0,background:sbg,minHeight:"calc(100vh - 90px)",paddingTop:4,overflowY:"auto"}} className="erp-sidebar">
          <div className="sidebar-calendar"><MiniCalendar/></div>
          <div style={{borderTop:"1px solid #444",marginTop:8,padding:"10px 10px 0"}} className="sidebar-links">
            <div style={{fontSize:11,color:"#888",fontWeight:700,marginBottom:6,letterSpacing:0.5}}>QUICK LINKS</div>
            {(role==="student"?studentSidebarLinks:facultySidebarLinks).map(([label,key])=>(
              <div key={key} onClick={()=>setActive(key)}
                style={{padding:"7px 8px",borderRadius:4,cursor:"pointer",fontSize:12,marginBottom:2,
                  background:active===key?"#6366f1":"transparent",
                  color:active===key?"#fff":"#bbb",fontWeight:active===key?600:400}}>
                {label}
              </div>
            ))}
          </div>
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
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,padding:16,minHeight:"calc(100vh - 90px)",background:darkMode?"#0f172a":"#f0f0f0"}} className="erp-main">
          {views[active]||<div style={{color:"#aaa",textAlign:"center",padding:40}}>Coming soon</div>}
        </div>
      </div>
    </div>
  );
}
