// src/App.js — ADVISE Practice Manager with Team Management
import { useState, useMemo } from "react";
import { useCases, useTasks, useTeam } from "./useFirestore";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#F4F2EE",surface:"#FFFFFF",border:"#E5E1D8",text:"#18180F",
  muted:"#7A7570",faint:"#EFEDE8",navy:"#1A1A2E",navyL:"#252538",
  pipeline:"#2563EB",cita:"#0E7E6B",dash:"#8B3A8B",team:"#B45309",
  stages:{
    lead:          {dot:"#3B82F6",bg:"#DBEAFE",text:"#1D4ED8"},
    initial:       {dot:"#7C3AED",bg:"#EDE9FE",text:"#5B21B6"},
    goal:          {dot:"#0891B2",bg:"#CFFAFE",text:"#0E7490"},
    development:   {dot:"#059669",bg:"#D1FAE5",text:"#065F46"},
    implementation:{dot:"#D97706",bg:"#FEF3C7",text:"#92400E"},
  },
  cats:{
    // ── Priority ──────────────────────────────────────────────────────────────
    urgent:        {bg:"#FEE2E2",text:"#991B1B",dot:"#DC2626",icon:"🚨"},
    // ── Investment / Retirement ───────────────────────────────────────────────
    minutes:       {bg:"#EDE9FE",text:"#5B21B6",dot:"#7C3AED",icon:"📋"},
    admin:         {bg:"#DBEAFE",text:"#1E40AF",dot:"#2563EB",icon:"⚙️"},
    instruction:   {bg:"#D1FAE5",text:"#065F46",dot:"#059669",icon:"📝"},
    pso_psi:       {bg:"#FEF3C7",text:"#92400E",dot:"#D97706",icon:"🔄"},
    switches:      {bg:"#FCE7F3",text:"#9D174D",dot:"#DB2777",icon:"↔️"},
    implementation:{bg:"#E0F2FE",text:"#075985",dot:"#0284C7",icon:"🚀"},
    sec14:         {bg:"#FEF9C3",text:"#854D0E",dot:"#CA8A04",icon:"📤"},
    tfsa:          {bg:"#F0FDF4",text:"#14532D",dot:"#16A34A",icon:"💚"},
    directive135:  {bg:"#F5F3FF",text:"#4C1D95",dot:"#7C3AED",icon:"📑"},
    income_review: {bg:"#FFF7ED",text:"#9A3412",dot:"#EA580C",icon:"💰"},
    structured_note:{bg:"#F0F9FF",text:"#0C4A6E",dot:"#0369A1",icon:"📊"},
    // ── Reviews ───────────────────────────────────────────────────────────────
    review_a:      {bg:"#ECFDF5",text:"#065F46",dot:"#059669",icon:"⭐"},
    review_b:      {bg:"#F0FDF4",text:"#14532D",dot:"#16A34A",icon:"🔵"},
    review_c:      {bg:"#EFF6FF",text:"#1E40AF",dot:"#3B82F6",icon:"🔷"},
    review_d:      {bg:"#F5F3FF",text:"#5B21B6",dot:"#8B5CF6",icon:"🔹"},
    review_st:     {bg:"#FFF7ED",text:"#92400E",dot:"#F59E0B",icon:"📅"},
    // ── Short-Term Insurance (STI) ────────────────────────────────────────────
    sti_claims:    {bg:"#FEE2E2",text:"#991B1B",dot:"#EF4444",icon:"🛡️"},
    sti_renewal:   {bg:"#FEF3C7",text:"#92400E",dot:"#F59E0B",icon:"🔁"},
    sti_underwriting:{bg:"#EDE9FE",text:"#5B21B6",dot:"#8B5CF6",icon:"✍️"},
    sti_unpaid:    {bg:"#FFF1F2",text:"#9F1239",dot:"#E11D48",icon:"⚠️"},
    // ── Employee Benefits (EB) ────────────────────────────────────────────────
    eb_servicing:  {bg:"#DBEAFE",text:"#1E40AF",dot:"#2563EB",icon:"🏢"},
    eb_new_lead:   {bg:"#D1FAE5",text:"#065F46",dot:"#059669",icon:"🤝"},
    eb_underwriting:{bg:"#EDE9FE",text:"#5B21B6",dot:"#7C3AED",icon:"📄"},
    eb_claims:     {bg:"#FEE2E2",text:"#991B1B",dot:"#DC2626",icon:"🏥"},
    eb_referral:   {bg:"#CFFAFE",text:"#0E7490",dot:"#0891B2",icon:"📨"},
    eb_withdrawal: {bg:"#FFF7ED",text:"#9A3412",dot:"#EA580C",icon:"🏦"},
    eb_sec14:      {bg:"#FEF9C3",text:"#854D0E",dot:"#CA8A04",icon:"🔀"},
    eb_rf_lead:    {bg:"#F0FDF4",text:"#14532D",dot:"#16A34A",icon:"🏗️"},
    eb_rf_review:  {bg:"#EFF6FF",text:"#1E40AF",dot:"#3B82F6",icon:"📆"},
    // ── Healthcare ────────────────────────────────────────────────────────────
    healthcare:    {bg:"#ECFDF5",text:"#065F46",dot:"#10B981",icon:"❤️"},
    // ── Other ─────────────────────────────────────────────────────────────────
    wills:         {bg:"#F0FDF4",text:"#14532D",dot:"#16A34A",icon:"📜"},
    resigned:      {bg:"#FFF7ED",text:"#9A3412",dot:"#EA580C",icon:"🚪"},
    estate:        {bg:"#F1F5F9",text:"#334155",dot:"#64748B",icon:"⚖️"},
    ominsure:      {bg:"#FDF4FF",text:"#6B21A8",dot:"#9333EA",icon:"🔒"},
    auto_task:     {bg:"#F8FAFC",text:"#334155",dot:"#94A3B8",icon:"🤖"},
    adviceworx:    {bg:"#FFF0F9",text:"#831843",dot:"#DB2777",icon:"💼"},
  },
  status:{
    overdue:  {bg:"#FEE2E2",text:"#991B1B"},
    due_today:{bg:"#FEF3C7",text:"#92400E"},
    open:     {bg:"#DBEAFE",text:"#1E40AF"},
    completed:{bg:"#D1FAE5",text:"#065F46"},
  },
  roles:{
    advisor:     {bg:"#DBEAFE",text:"#1E40AF",dot:"#2563EB"},
    paraplanner: {bg:"#EDE9FE",text:"#5B21B6",dot:"#7C3AED"},
    admin:       {bg:"#D1FAE5",text:"#065F46",dot:"#059669"},
    practice_manager:{bg:"#FEF3C7",text:"#92400E",dot:"#D97706"},
  },
};

const ROLES = [
  { id:"advisor",          label:"Financial Advisor / Planner" },
  { id:"paraplanner",      label:"Paraplanner" },
  { id:"admin",            label:"Admin / PA" },
  { id:"practice_manager", label:"Practice Manager" },
];

const ROLE_COLORS = ["#2563EB","#7C3AED","#059669","#D97706","#DC2626","#0891B2","#DB2777","#374151"];

const NEXT_ACTIONS = [
  {id:"waiting_signature",  label:"Waiting: Client Signature",     icon:"✍️", color:"#DC2626"},
  {id:"waiting_docs",       label:"Waiting: Documents from Client", icon:"📂", color:"#D97706"},
  {id:"waiting_email",      label:"Waiting: Client Email/Reply",   icon:"📧", color:"#7C3AED"},
  {id:"waiting_provider",   label:"Waiting: Provider/Fund House",  icon:"🏦", color:"#0891B2"},
  {id:"action_send_email",  label:"To Do: Send Email",             icon:"✉️", color:"#2563EB"},
  {id:"action_call",        label:"To Do: Phone Call",             icon:"📞", color:"#059669"},
  {id:"action_book_meeting",label:"To Do: Book Meeting",           icon:"📅", color:"#8B3A8B"},
  {id:"action_submit_forms",label:"To Do: Submit Forms",           icon:"📋", color:"#D97706"},
  {id:"action_update_xplan",label:"To Do: Update xPlan",           icon:"💻", color:"#374151"},
  {id:"action_prepare_docs",label:"To Do: Prepare Documents",      icon:"📝", color:"#065F46"},
  {id:"on_track",           label:"On Track",                      icon:"✅", color:"#16A34A"},
];

const STAGES = [
  {id:"lead",           label:"Lead / Referral"},
  {id:"initial",        label:"Initial Engagement"},
  {id:"goal",           label:"Goal Setting"},
  {id:"development",    label:"Development Strategies"},
  {id:"implementation", label:"Implementation"},
];

const CITA_CATS = [
  // Priority
  {id:"urgent",          label:"Urgent",                        group:"Priority"},
  // Admin & Process
  {id:"minutes",         label:"Minutes",                       group:"Admin"},
  {id:"admin",           label:"Admin",                         group:"Admin"},
  {id:"instruction",     label:"Instructions",                  group:"Admin"},
  {id:"auto_task",       label:"Auto Task",                     group:"Admin"},
  // Investment & Retirement
  {id:"pso_psi",         label:"PSO & PSI",                     group:"Investment"},
  {id:"switches",        label:"Switches",                      group:"Investment"},
  {id:"implementation",  label:"Implementation",                group:"Investment"},
  {id:"sec14",           label:"Sec 14 Transfer",               group:"Investment"},
  {id:"tfsa",            label:"TFSA Transfer",                 group:"Investment"},
  {id:"directive135",    label:"Directive 135 Transfer (LA)",   group:"Investment"},
  {id:"income_review",   label:"Income Review",                 group:"Investment"},
  {id:"structured_note", label:"Structured Note",               group:"Investment"},
  // Reviews
  {id:"review_a",        label:"Review — A",                    group:"Reviews"},
  {id:"review_b",        label:"Review — B",                    group:"Reviews"},
  {id:"review_c",        label:"Review — C",                    group:"Reviews"},
  {id:"review_d",        label:"Review — D",                    group:"Reviews"},
  {id:"review_st",       label:"Review — ST",                   group:"Reviews"},
  // STI
  {id:"sti_claims",      label:"STI — Claims",                  group:"STI"},
  {id:"sti_renewal",     label:"STI — Renewal",                 group:"STI"},
  {id:"sti_underwriting",label:"STI — Underwriting",            group:"STI"},
  {id:"sti_unpaid",      label:"STI — Unpaid / Cancelled",      group:"STI"},
  // Employee Benefits
  {id:"eb_servicing",    label:"EB — Servicing",                group:"EB"},
  {id:"eb_new_lead",     label:"EB — New Lead",                 group:"EB"},
  {id:"eb_underwriting", label:"EB — Underwriting",             group:"EB"},
  {id:"eb_claims",       label:"EB — Claims",                   group:"EB"},
  {id:"eb_referral",     label:"EB — Referral Feedback",        group:"EB"},
  {id:"eb_withdrawal",   label:"EB — Withdrawal Request",       group:"EB"},
  {id:"eb_sec14",        label:"EB — Sec 14 Transfer",          group:"EB"},
  {id:"eb_rf_lead",      label:"EB — New Corp Retirement Lead", group:"EB"},
  {id:"eb_rf_review",    label:"EB — Annual Retirement Review", group:"EB"},
  // Healthcare
  {id:"healthcare",      label:"Healthcare Review",             group:"Healthcare"},
  // Other
  {id:"wills",           label:"Wills",                         group:"Other"},
  {id:"estate",          label:"Estate (E/L)",                  group:"Other"},
  {id:"resigned",        label:"Resigned",                      group:"Other"},
  {id:"ominsure",        label:"Ominsure",                      group:"Other"},
  {id:"adviceworx",      label:"Adviceworx",                    group:"Other"},
];

const CHECKLISTS = {
  lead:{RM:["Qualify client (proceed / refer / add to mailing list)","Decide if referral to retainer partner needed","Setup appointment if proceeding"],admin:["Send meeting request via Outlook (same day)","Email client: directions, time and place","Confirm appointment 1 day before (SMS/phone/email)"],paraplanner:["No actions at this stage"]},
  initial:{RM:["Set context: Why, How, What","Complete client discovery questionnaire","Go through Disclosure Letter","Complete fee positioning","Debrief with admin on notes and actions","Hand over all meeting documents"],admin:["Inform receptionist of client details","Setup meeting room with onboarding pack","Scan all documents and save on xPlan","Setup Goal Setting appointment","Add client to mailing list"],paraplanner:["Review client discovery questionnaire","Assist with xPlan data entry if required"]},
  goal:{RM:["Go through goal setting agenda","Complete Goal Setting Action Agenda","Review client financial information","Discuss budget","Get commitment to proceed","Setup Development Strategies appointment","Debrief with admin"],admin:["Inform receptionist with client details","Setup meeting room","Check client pack with paraplanner","Confirm appointment 1 day before","Save all documentation on xPlan","Request Section 14 quotes","Follow up on client preparation pack"],paraplanner:["Check client pack before meeting","Input financials into xPlan / Wealth Integrator","Request quotes: risk, investments and withdrawals","Check financials on Wealth Integrator","Discuss outcomes with planner"]},
  development:{RM:["Reconnect client to goals","Present financial planning framework","Present Wealth Integrator current reality","Discuss investment principles and strategy","Get commitment to proceed","If no: explain consequences","Discuss fees and funds aligned to strategy","Setup Implementation meeting"],admin:["Inform receptionist with client details","Book meeting room with slides","Confirm appointment 1 day before","Send meeting request via Outlook","Save all documentation on xPlan"],paraplanner:["Check client pack before meeting","Prepare Wealth Integrator scenarios","Prepare risk/investment/withdrawal quotes","Prepare fund factsheets","Ensure strategy documents are complete"]},
  implementation:{RM:["Review all signed documentation","Confirm implementation instructions with client","Ensure all applications are submitted","Confirm fee structures in place","Setup annual review appointment"],admin:["Process all application forms","Submit applications to providers","Update xPlan with implementation details","File all signed documents","Send confirmation to client"],paraplanner:["Review all application forms before submission","Check compliance requirements","Prepare implementation summary report","Update Wealth Integrator with final strategy"]},
};

const EMAILS = {
  lead:[{label:"Appointment Confirmation",subject:"Your Appointment Confirmation – [Client Name]",body:"Dear [Client Name],\n\nThank you for your interest. We are pleased to confirm your appointment with [Planner Name].\n\nDate: [Date]\nTime: [Time]\nVenue: [Address/Directions]\n\nPlease feel free to reach out should you need to reschedule.\n\nWarm regards,\n[Planner Name]"},{label:"Appointment Reminder",subject:"Reminder: Your Appointment Tomorrow",body:"Hi [Client Name],\n\nThis is a friendly reminder of your appointment tomorrow.\n\nDate: [Date]\nTime: [Time]\nVenue: [Address]\n\nLooking forward to seeing you!\n\n[Practice Name]"}],
  initial:[{label:"Thank You – Initial Meeting",subject:"Thank You – Initial Engagement Meeting",body:"Dear [Client Name],\n\nThank you for taking the time to meet with us today.\n\nAs discussed, the next step is [Next Step]. We will be in touch shortly.\n\nPlease find attached the minutes of our meeting.\n\nWarm regards,\n[Planner Name]"}],
  goal:[{label:"Thank You – Goal Setting",subject:"Thank You – Goal Setting Meeting",body:"Dear [Client Name],\n\nThank you for our goal setting session today. Minutes are attached, along with next steps.\n\nWarm regards,\n[Planner Name]"},{label:"Outstanding Documents Request",subject:"Outstanding Documentation Required – [Client Name]",body:"Dear [Client Name],\n\nFollowing our goal setting meeting, please provide the following outstanding documentation:\n\n- [Document 1]\n- [Document 2]\n\nThank you,\n[Admin Name]"}],
  development:[{label:"Thank You – Development Strategies",subject:"Thank You – Development Strategies Meeting",body:"Dear [Client Name],\n\nThank you for attending our Development Strategies meeting. Minutes and a summary of strategies discussed are attached.\n\nWarm regards,\n[Planner Name]"}],
  implementation:[{label:"Implementation Confirmed",subject:"Implementation Confirmed – [Client Name]",body:"Dear [Client Name],\n\nAll applications have been submitted as per our discussion.\n\nWarm regards,\n[Planner Name]"},{label:"Applications Submitted",subject:"Your Applications Have Been Submitted",body:"Dear [Client Name],\n\nWe are pleased to confirm your applications have been submitted.\n\nKind regards,\n[Admin Name]"}],
};

const DOCS = {
  lead:["Client Referral Form","Mailing List Consent Form"],
  initial:["Initial Engagement Agenda","Client Discovery Questionnaire","Disclosure Document","Letter of Consent","Personal Client Profile","Client Preparation Pack"],
  goal:["Goal Setting Agenda","Visual Aids / Presentation","Policy Schedule","Budget Document","Life Goals Document","Documentation Received Checklist"],
  development:["Development Strategies Agenda","Wealth Integrator Scenarios","Quotes (Risk, Investment, Withdrawals)","Risk Health Declaration","Fund Factsheets (optional)","Strategy Discussion Documents"],
  implementation:["Signed Application Forms","Implementation Checklist","Fee Agreement","Annual Review Schedule"],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt  = (d) => d.toISOString().split("T")[0];
const today = new Date();
const fwd  = (n) => { const d=new Date(today); d.setDate(d.getDate()+n); return fmt(d); };

function getTaskStatus(t) {
  if (t.dateCompleted) return "completed";
  if (!t.followUp) return "open";
  const fu=new Date(t.followUp), now=new Date();
  fu.setHours(0,0,0,0); now.setHours(0,0,0,0);
  if (fu<now) return "overdue";
  if (fu.getTime()===now.getTime()) return "due_today";
  return "open";
}
function initials(n){ return n.split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join(""); }
const NA = (id) => NEXT_ACTIONS.find(a=>a.id===id) || NEXT_ACTIONS[NEXT_ACTIONS.length-1];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const iS  = {width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13.5,outline:"none",background:C.faint,boxSizing:"border-box",fontFamily:"inherit"};
const selS = {...iS,appearance:"none"};

function Badge({color,children}){
  return <span style={{background:color?.bg||"#F3F4F6",color:color?.text||"#374151",fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:20,letterSpacing:0.5,whiteSpace:"nowrap"}}>{children}</span>;
}
function Avatar({name,color,size=36}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:size*0.38,flexShrink:0}}>{initials(name||"?")}</div>;
}
function Card({children,style={}}){
  return <div style={{background:C.surface,borderRadius:14,padding:"22px 26px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",...style}}>{children}</div>;
}
function SectionTitle({children}){
  return <div style={{fontSize:11,fontWeight:800,letterSpacing:1.8,color:C.muted,marginBottom:14,textTransform:"uppercase"}}>{children}</div>;
}
function Spinner(){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",fontSize:14,color:C.muted}}>Loading…</div>;
}
function Modal({title,onClose,children}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:18,padding:32,width:"100%",maxWidth:560,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 28px 80px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:900,fontFamily:"Georgia,serif"}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:C.muted}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({label,children}){
  return <div style={{marginBottom:16}}><label style={{display:"block",fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1.2,marginBottom:6}}>{label}</label>{children}</div>;
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav({mod,setMod}){
  const tabs=[
    {id:"dashboard",label:"🏠  Dashboard"},
    {id:"pipeline", label:"📈  New Business"},
    {id:"cita",     label:"📋  Admin Tracker"},
    {id:"client",   label:"👤  Client View"},
    {id:"team",     label:"👥  Team"},
  ];
  return(
    <div style={{background:C.navy,color:"#fff",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",position:"sticky",top:0,zIndex:200}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,background:"linear-gradient(135deg,#2563EB,#0E7E6B)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900}}>A</div>
        <div>
          <div style={{fontSize:16,fontWeight:900,letterSpacing:1.2,fontFamily:"Georgia,serif"}}>ADVISE</div>
          <div style={{fontSize:9,color:"#94A3B8",letterSpacing:2.8}}>PRACTICE MANAGER</div>
        </div>
      </div>
      <div style={{display:"flex",background:C.navyL,borderRadius:10,padding:4,gap:3}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setMod(t.id)} style={{
            padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:800,transition:"all 0.15s",
            background:mod===t.id?(t.id==="dashboard"?C.dash:t.id==="pipeline"?C.pipeline:t.id==="cita"?C.cita:t.id==="team"?C.team:"#7C3AED"):"transparent",
            color:mod===t.id?"#fff":"#94A3B8",
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{width:40}}/>
    </div>
  );
}

// ─── TEAM MODULE ──────────────────────────────────────────────────────────────
function TeamModule({team, addMember, updateMember, deleteMember, cases, tasks}){
  const [showAdd,setShowAdd]   = useState(false);
  const [editM,setEditM]       = useState(null);
  const [filterRole,setFilterRole] = useState("all");
  const empty = {name:"",role:"advisor",email:"",phone:"",initials:"",active:true,notes:""};
  const [form,setForm]         = useState(empty);

  const filtered = team.filter(m => filterRole==="all" || m.role===filterRole);

  const openAdd  = () => { setForm(empty); setEditM(null); setShowAdd(true); };
  const openEdit = (m) => { setForm({...m}); setEditM(m); setShowAdd(true); };

  const save = async () => {
    if (!form.name.trim()) return;
    const data = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      initials: form.initials.trim() || initials(form.name),
    };
    if (editM) { await updateMember(editM.id, data); }
    else       { await addMember(data); }
    setShowAdd(false); setEditM(null); setForm(empty);
  };

  const toggleActive = (m) => updateMember(m.id, { active: !m.active });

  // Stats per member
  const memberStats = (m) => ({
    cases: cases.filter(c => c.advisorId === m.id).length,
    openTasks: tasks.filter(t => t.advisorId === m.id && getTaskStatus(t) !== "completed").length,
    overdueTasks: tasks.filter(t => t.advisorId === m.id && getTaskStatus(t) === "overdue").length,
  });

  const roleColor = (roleId) => C.roles[roleId] || {bg:"#F3F4F6",text:"#374151",dot:"#9CA3AF"};

  return(
    <div style={{padding:"28px 32px",maxWidth:1060,margin:"0 auto"}}>
      {showAdd && (
        <Modal title={editM ? `Edit — ${editM.name}` : "Add Team Member"} onClose={()=>{setShowAdd(false);setEditM(null);setForm(empty);}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="FULL NAME">
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={iS} placeholder="e.g. Ruan Möller"/>
            </Field>
            <Field label="INITIALS (shown on badges)">
              <input value={form.initials} onChange={e=>setForm(p=>({...p,initials:e.target.value.toUpperCase().slice(0,3)}))} style={iS} placeholder="e.g. RM" maxLength={3}/>
            </Field>
          </div>
          <Field label="ROLE">
            <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={selS}>
              {ROLES.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="EMAIL ADDRESS">
              <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={iS} placeholder="name@practice.co.za"/>
            </Field>
            <Field label="PHONE / MOBILE">
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} style={iS} placeholder="e.g. 082 000 0000"/>
            </Field>
          </div>
          <Field label="NOTES (optional)">
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...iS,height:60,resize:"vertical"}} placeholder="Specialisation, capacity notes, etc."/>
          </Field>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div onClick={()=>setForm(p=>({...p,active:!p.active}))} style={{width:44,height:24,borderRadius:12,background:form.active?"#059669":"#D1D5DB",cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:form.active?23:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:form.active?C.cita:C.muted}}>{form.active?"Active":"Inactive"}</span>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={save} style={{flex:1,background:C.team,color:"#fff",border:"none",borderRadius:9,padding:"11px 0",fontWeight:900,cursor:"pointer",fontSize:14}}>
              {editM ? "Save Changes" : "Add Member"}
            </button>
            <button onClick={()=>{setShowAdd(false);setEditM(null);setForm(empty);}} style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 18px",cursor:"pointer",fontWeight:700}}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h2 style={{margin:0,fontFamily:"Georgia,serif",fontSize:22,fontWeight:900}}>Team Management</h2>
          <div style={{fontSize:12,color:C.muted,marginTop:4}}>{team.filter(m=>m.active!==false).length} active members · {team.filter(m=>m.active===false).length} inactive</div>
        </div>
        <button onClick={openAdd} style={{background:C.team,color:"#fff",border:"none",borderRadius:9,padding:"10px 22px",cursor:"pointer",fontWeight:900,fontSize:13}}>+ Add Member</button>
      </div>

      {/* Role filter pills */}
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        <button onClick={()=>setFilterRole("all")} style={{padding:"6px 16px",borderRadius:20,border:`1px solid ${filterRole==="all"?C.team:C.border}`,background:filterRole==="all"?C.team:C.surface,color:filterRole==="all"?"#fff":C.muted,fontSize:11,fontWeight:800,cursor:"pointer"}}>All Roles</button>
        {ROLES.map(r=>{const rc=roleColor(r.id);return(
          <button key={r.id} onClick={()=>setFilterRole(filterRole===r.id?"all":r.id)} style={{padding:"6px 16px",borderRadius:20,border:`1px solid ${filterRole===r.id?rc.dot:C.border}`,background:filterRole===r.id?rc.bg:C.surface,color:filterRole===r.id?rc.text:C.muted,fontSize:11,fontWeight:800,cursor:"pointer"}}>
            {r.label.split(" ")[0]} ({team.filter(m=>m.role===r.id).length})
          </button>
        );})}
      </div>

      {/* Team cards grid */}
      {filtered.length===0 && (
        <Card style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:40,marginBottom:12}}>👥</div>
          <div style={{fontSize:15,fontWeight:800,marginBottom:6}}>No team members yet</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Add your advisors, admin staff and paraplanners to get started</div>
          <button onClick={openAdd} style={{background:C.team,color:"#fff",border:"none",borderRadius:9,padding:"10px 24px",cursor:"pointer",fontWeight:900,fontSize:13}}>+ Add First Member</button>
        </Card>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {filtered.map((m,idx)=>{
          const rc  = roleColor(m.role);
          const col = ROLE_COLORS[team.indexOf(m) % ROLE_COLORS.length] || "#64748B";
          const stats = memberStats(m);
          const roleName = ROLES.find(r=>r.id===m.role)?.label || m.role;
          return(
            <div key={m.id} style={{background:C.surface,borderRadius:14,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",opacity:m.active===false?0.6:1,transition:"opacity 0.2s"}}>
              {/* Colour header strip */}
              <div style={{height:6,background:col}}/>
              <div style={{padding:"20px 22px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:16}}>
                  <Avatar name={m.initials||m.name} color={col} size={48}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontWeight:900,fontSize:16,fontFamily:"Georgia,serif"}}>{m.name}</span>
                      {m.active===false && <Badge color={{bg:"#F3F4F6",text:"#9CA3AF"}}>Inactive</Badge>}
                    </div>
                    <div style={{marginTop:5}}>
                      <Badge color={rc}>{roleName}</Badge>
                    </div>
                    {m.email && <div style={{fontSize:11,color:C.muted,marginTop:8}}>✉️ {m.email}</div>}
                    {m.phone && <div style={{fontSize:11,color:C.muted,marginTop:3}}>📞 {m.phone}</div>}
                  </div>
                </div>

                {/* Stats row */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14,background:C.faint,borderRadius:10,padding:"10px 0"}}>
                  {[
                    {label:"Cases",    value:stats.cases,       color:C.pipeline},
                    {label:"Open Tasks",value:stats.openTasks,  color:"#7C3AED"},
                    {label:"Overdue",  value:stats.overdueTasks,color:stats.overdueTasks>0?"#DC2626":C.muted},
                  ].map((s,i)=>(
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{fontSize:22,fontWeight:900,color:s.color,fontFamily:"Georgia,serif",lineHeight:1}}>{s.value}</div>
                      <div style={{fontSize:9,fontWeight:700,color:C.muted,marginTop:3,letterSpacing:0.5}}>{s.label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>

                {m.notes && <div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginBottom:14,lineHeight:1.5}}>📝 {m.notes}</div>}

                {/* Actions */}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>openEdit(m)} style={{flex:1,background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 0",cursor:"pointer",fontWeight:700,fontSize:12,color:C.text}}>✏️ Edit</button>
                  <button onClick={()=>toggleActive(m)} style={{flex:1,background:m.active===false?"#D1FAE5":"#FEF3C7",border:"none",borderRadius:8,padding:"8px 0",cursor:"pointer",fontWeight:700,fontSize:12,color:m.active===false?"#065F46":"#92400E"}}>
                    {m.active===false?"✓ Activate":"⏸ Deactivate"}
                  </button>
                  <button onClick={()=>{ if(window.confirm(`Remove ${m.name} from the team?`)) deleteMember(m.id); }} style={{background:"#FEE2E2",border:"none",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:13,color:"#991B1B"}}>🗑</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role legend */}
      {team.length > 0 && (
        <Card style={{marginTop:24}}>
          <SectionTitle>Role Permissions Overview</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
            {[
              {role:"advisor",         perms:["New Business Pipeline — full access","CITA Admin Tracker — view & edit own clients","Client View — all clients","Dashboard — full view"]},
              {role:"paraplanner",     perms:["New Business Pipeline — view & checklist","CITA Admin Tracker — view & edit","Client View — all clients","Dashboard — full view"]},
              {role:"admin",           perms:["New Business Pipeline — admin tasks only","CITA Admin Tracker — full access","Client View — all clients","Dashboard — admin tasks focus"]},
              {role:"practice_manager",perms:["All modules — full access","Team Management — add/edit/remove members","Dashboard — full practice view","All advisors and clients visible"]},
            ].map(({role,perms})=>{
              const rc=roleColor(role);
              const roleName=ROLES.find(r=>r.id===role)?.label||role;
              return(
                <div key={role} style={{background:C.faint,borderRadius:10,padding:"14px 16px",borderLeft:`3px solid ${rc.dot}`}}>
                  <div style={{fontWeight:800,fontSize:13,marginBottom:10,color:rc.text}}>{roleName}</div>
                  {perms.map((p,i)=><div key={i} style={{fontSize:11,color:C.muted,marginBottom:4,display:"flex",gap:6}}><span style={{color:C.cita}}>✓</span>{p}</div>)}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({cases,updateCase,tasks,team,setMod}){
  const [editCase,setEditCase]=useState(null);
  const [form,setForm]=useState({nextAction:"on_track",nextNote:"",dueDate:""});

  const overdueAdmin  = tasks.filter(t=>getTaskStatus(t)==="overdue").length;
  const dueTodayAdmin = tasks.filter(t=>getTaskStatus(t)==="due_today").length;
  const actionAlerts  = cases.filter(c=>{if(!c.dueDate||c.nextAction==="on_track")return false;const due=new Date(c.dueDate);due.setHours(0,0,0,0);const now=new Date();now.setHours(0,0,0,0);return due<=now;});
  const waiting       = cases.filter(c=>c.nextAction&&c.nextAction.startsWith("waiting_"));
  const todos         = cases.filter(c=>c.nextAction&&c.nextAction.startsWith("action_"));
  const byStage       = STAGES.map(s=>({...s,cases:cases.filter(c=>c.stage===s.id)}));

  const openEdit=(c)=>{setEditCase(c);setForm({nextAction:c.nextAction||"on_track",nextNote:c.nextNote||"",dueDate:c.dueDate||""});};
  const saveEdit=async()=>{await updateCase(editCase.id,form);setEditCase(null);};

  // Resolve advisor name from team
  const advisorName = (c) => {
    const m = team.find(t=>t.id===c.advisorId);
    return m ? (m.initials||m.name) : (c.advisor||"—");
  };

  return(
    <div style={{padding:"28px 32px",maxWidth:1100,margin:"0 auto"}}>
      {editCase&&(
        <Modal title={`Update Next Action — ${editCase.name}`} onClose={()=>setEditCase(null)}>
          <Field label="NEXT ACTION / BLOCKER">
            <select value={form.nextAction} onChange={e=>setForm(p=>({...p,nextAction:e.target.value}))} style={selS}>
              {NEXT_ACTIONS.map(a=><option key={a.id} value={a.id}>{a.icon} {a.label}</option>)}
            </select>
          </Field>
          <Field label="DETAIL / NOTE">
            <textarea value={form.nextNote} onChange={e=>setForm(p=>({...p,nextNote:e.target.value}))} style={{...iS,height:72,resize:"vertical"}} placeholder="e.g. Waiting for signed disclosure doc…"/>
          </Field>
          <Field label="DUE DATE">
            <input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))} style={iS}/>
          </Field>
          <button onClick={saveEdit} style={{width:"100%",background:C.dash,color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontWeight:900,cursor:"pointer",fontSize:14,marginTop:4}}>Save</button>
        </Modal>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:28}}>
        {[
          {label:"Active Cases",     value:cases.length,          color:"#1A1A2E", sub:"in pipeline"},
          {label:"Overdue Actions",  value:actionAlerts.length,   color:"#DC2626", sub:"need attention"},
          {label:"Overdue Admin",    value:overdueAdmin,          color:"#D97706", sub:"CITA tasks"},
          {label:"Due Today",        value:dueTodayAdmin,         color:"#7C3AED", sub:"admin tasks"},
          {label:"Waiting on Client",value:waiting.length,        color:"#0891B2", sub:"pipeline cases"},
          {label:"Team Members",     value:team.filter(m=>m.active!==false).length, color:C.team, sub:"active staff"},
        ].map((k,i)=>(
          <div key={i} style={{background:C.surface,borderRadius:12,padding:"14px 16px",borderTop:`4px solid ${k.color}`,boxShadow:"0 1px 5px rgba(0,0,0,0.05)",cursor:i===5?"pointer":"default"}} onClick={i===5?()=>setMod("team"):undefined}>
            <div style={{fontSize:28,fontWeight:900,color:k.color,fontFamily:"Georgia,serif",lineHeight:1}}>{k.value}</div>
            <div style={{fontSize:11,fontWeight:700,color:C.text,marginTop:4}}>{k.label}</div>
            <div style={{fontSize:10,color:C.muted}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Pipeline kanban */}
      <Card style={{marginBottom:20}}>
        <SectionTitle>New Business Pipeline — Where Cases Stand</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
          {byStage.map(s=>{const sc=C.stages[s.id];return(
            <div key={s.id} style={{background:C.faint,borderRadius:10,padding:"12px 10px",minHeight:100,borderTop:`3px solid ${sc.dot}`}}>
              <div style={{fontSize:10,fontWeight:800,color:sc.dot,letterSpacing:1,marginBottom:10}}>{s.label.toUpperCase()} ({s.cases.length})</div>
              {s.cases.length===0&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>No cases</div>}
              {s.cases.map(c=>{const na=NA(c.nextAction);const isOverdue=c.dueDate&&new Date(c.dueDate)<new Date()&&c.nextAction!=="on_track";return(
                <div key={c.id} onClick={()=>openEdit(c)} style={{background:C.surface,borderRadius:8,padding:"9px 10px",marginBottom:7,cursor:"pointer",border:`1px solid ${isOverdue?"#FCA5A5":C.border}`}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{fontSize:12,fontWeight:800,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                  <div style={{fontSize:10,color:C.muted,marginBottom:5}}>{advisorName(c)}</div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:12}}>{na.icon}</span>
                    <span style={{fontSize:9,fontWeight:700,color:isOverdue?"#DC2626":na.color,lineHeight:1.3}}>{na.label.replace("Waiting: ","⏳ ").replace("To Do: ","→ ")}</span>
                  </div>
                  {c.dueDate&&<div style={{fontSize:9,color:isOverdue?"#DC2626":C.muted,marginTop:3,fontWeight:isOverdue?800:400}}>Due: {c.dueDate}</div>}
                </div>
              );})}
            </div>
          );})}
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <SectionTitle>🔴 Needs Immediate Attention</SectionTitle>
          {actionAlerts.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px 0"}}>✅ All pipeline cases are on track</div>}
          {actionAlerts.map(c=>{const sc=C.stages[c.stage];const na=NA(c.nextAction);return(
            <div key={c.id} onClick={()=>openEdit(c)} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:10,marginBottom:8,background:"#FFF5F5",border:"1px solid #FCA5A5",cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <span style={{fontSize:20}}>{na.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:13}}>{c.name}</div>
                <div style={{fontSize:11,color:"#DC2626",fontWeight:700,marginTop:2}}>{na.label}</div>
                {c.nextNote&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{c.nextNote}</div>}
                <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                  <Badge color={sc}>{STAGES.find(s=>s.id===c.stage)?.label}</Badge>
                  <Badge color={{bg:"#FEE2E2",text:"#991B1B"}}>Due: {c.dueDate}</Badge>
                  <Badge color={{bg:"#F3F4F6",text:"#374151"}}>{advisorName(c)}</Badge>
                </div>
              </div>
            </div>
          );})}
        </Card>

        <Card>
          <SectionTitle>⏳ Waiting For</SectionTitle>
          {waiting.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px 0"}}>Nothing currently waiting</div>}
          {waiting.map(c=>{const sc=C.stages[c.stage];const na=NA(c.nextAction);const isOverdue=c.dueDate&&new Date(c.dueDate)<new Date();return(
            <div key={c.id} onClick={()=>openEdit(c)} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:10,marginBottom:8,background:isOverdue?"#FFF5F5":C.faint,border:`1px solid ${isOverdue?"#FCA5A5":C.border}`,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <span style={{fontSize:20}}>{na.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:13}}>{c.name}</div>
                <div style={{fontSize:11,color:na.color,fontWeight:700,marginTop:2}}>{na.label}</div>
                {c.nextNote&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{c.nextNote}</div>}
                <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                  <Badge color={sc}>{STAGES.find(s=>s.id===c.stage)?.label}</Badge>
                  {c.dueDate&&<Badge color={isOverdue?{bg:"#FEE2E2",text:"#991B1B"}:{bg:"#F3F4F6",text:"#374151"}}>Due: {c.dueDate}</Badge>}
                </div>
              </div>
            </div>
          );})}
        </Card>

        <Card>
          <SectionTitle>📌 Team Actions Outstanding</SectionTitle>
          {todos.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px 0"}}>No team actions outstanding</div>}
          {todos.map(c=>{const sc=C.stages[c.stage];const na=NA(c.nextAction);const isOverdue=c.dueDate&&new Date(c.dueDate)<new Date();return(
            <div key={c.id} onClick={()=>openEdit(c)} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:10,marginBottom:8,background:isOverdue?"#FFFBEB":C.faint,border:`1px solid ${isOverdue?"#FDE68A":C.border}`,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <span style={{fontSize:20}}>{na.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:13}}>{c.name}</div>
                <div style={{fontSize:11,color:na.color,fontWeight:700,marginTop:2}}>{na.label}</div>
                {c.nextNote&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{c.nextNote}</div>}
                <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                  <Badge color={sc}>{STAGES.find(s=>s.id===c.stage)?.label}</Badge>
                  {c.dueDate&&<Badge color={isOverdue?{bg:"#FEF3C7",text:"#92400E"}:{bg:"#F3F4F6",text:"#374151"}}>Due: {c.dueDate}</Badge>}
                  <Badge color={{bg:"#F3F4F6",text:"#374151"}}>{advisorName(c)}</Badge>
                </div>
              </div>
            </div>
          );})}
        </Card>

        <Card>
          <SectionTitle>⚠️ Overdue Admin Tasks (CITA)</SectionTitle>
          {tasks.filter(t=>getTaskStatus(t)==="overdue").length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px 0"}}>No overdue admin tasks</div>}
          {tasks.filter(t=>getTaskStatus(t)==="overdue").slice(0,5).map(t=>{const cat=C.cats[t.category];const m=team.find(tm=>tm.id===t.advisorId);return(
            <div key={t.id} style={{display:"flex",gap:10,padding:"10px 13px",borderRadius:10,marginBottom:7,background:"#FFF5F5",border:"1px solid #FCA5A5"}}>
              <span style={{fontSize:18}}>{cat.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:12}}>{t.client}</div>
                <div style={{fontSize:11,color:C.text,marginTop:2,lineHeight:1.4}}>{t.instruction}</div>
                <div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap"}}>
                  <Badge color={cat}>{CITA_CATS.find(c=>c.id===t.category)?.label}</Badge>
                  <Badge color={{bg:"#FEE2E2",text:"#991B1B"}}>Due: {t.followUp}</Badge>
                  {m&&<Badge color={{bg:"#F3F4F6",text:"#374151"}}>{m.initials||m.name}</Badge>}
                </div>
              </div>
            </div>
          );})}
          {tasks.filter(t=>getTaskStatus(t)==="overdue").length>5&&(
            <button onClick={()=>setMod("cita")} style={{width:"100%",background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 0",cursor:"pointer",fontWeight:700,fontSize:12,color:C.muted,marginTop:4}}>
              View all {tasks.filter(t=>getTaskStatus(t)==="overdue").length} overdue tasks →
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── PIPELINE ─────────────────────────────────────────────────────────────────
function PipelineModule({cases,addCase,updateCase,team}){
  const [view,setView]       = useState("list");
  const [sel,setSel]         = useState(null);
  const [role,setRole]       = useState("RM");
  const [tab,setTab]         = useState("checklist");
  const [checks,setChecks]   = useState({});
  const [selEmail,setSelEmail]= useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const [newName,setNewName] = useState("");
  const [newAdv,setNewAdv]   = useState("");
  const [editNext,setEditNext]= useState(false);
  const [nextForm,setNextForm]= useState({nextAction:"on_track",nextNote:"",dueDate:""});
  const [filterAdv,setFilterAdv]= useState("all");

  const toggle   = (cId,stg,r,i)=>{const k=`${cId}-${stg}-${r}-${i}`;setChecks(p=>({...p,[k]:!p[k]}));};
  const isChk    = (cId,stg,r,i)=>!!checks[`${cId}-${stg}-${r}-${i}`];
  const pct      = (c)=>{const l=CHECKLISTS[c.stage]?.[role]||[];if(!l.length)return 0;return Math.round(l.filter((_,i)=>isChk(c.id,c.stage,role,i)).length/l.length*100);};
  const advance  = async(c)=>{const idx=STAGES.findIndex(s=>s.id===c.stage);if(idx<STAGES.length-1)await updateCase(c.id,{stage:STAGES[idx+1].id});};
  const advisorName=(c)=>{const m=team.find(t=>t.id===c.advisorId);return m?(m.initials||m.name):(c.advisor||"—");};

  const handleAdd=async()=>{
    if(!newName.trim()) return;
    const adv = team.find(t=>t.id===newAdv);
    await addCase({
      name: newName.trim(),
      stage:"lead",
      advisorId: newAdv,
      advisor: adv ? (adv.initials||adv.name) : "",
      urgent:false,
      nextAction:"action_book_meeting",
      nextNote:"Book initial engagement appointment",
      dueDate:fwd(2),
    });
    setNewName(""); setShowAdd(false);
  };

  const visibleCases = filterAdv==="all" ? cases : cases.filter(c=>c.advisorId===filterAdv);
  const liveCase = sel ? cases.find(c=>c.id===sel.id)||sel : null;
  const liveIdx  = liveCase ? STAGES.findIndex(s=>s.id===liveCase.stage) : 0;

  // ── Detail view ──
  if(view==="detail"&&liveCase){
    const cl=CHECKLISTS[liveCase.stage]?.[role]||[];
    const em=EMAILS[liveCase.stage]||[];
    const dc=DOCS[liveCase.stage]||[];
    const na=NA(liveCase.nextAction);
    return(
      <div style={{padding:"24px 32px",maxWidth:1060,margin:"0 auto"}}>
        {editNext&&(
          <Modal title="Update Next Action" onClose={()=>setEditNext(false)}>
            <Field label="NEXT ACTION / BLOCKER"><select value={nextForm.nextAction} onChange={e=>setNextForm(p=>({...p,nextAction:e.target.value}))} style={selS}>{NEXT_ACTIONS.map(a=><option key={a.id} value={a.id}>{a.icon} {a.label}</option>)}</select></Field>
            <Field label="DETAIL / NOTE"><textarea value={nextForm.nextNote} onChange={e=>setNextForm(p=>({...p,nextNote:e.target.value}))} style={{...iS,height:72,resize:"vertical"}}/></Field>
            <Field label="DUE DATE"><input type="date" value={nextForm.dueDate} onChange={e=>setNextForm(p=>({...p,dueDate:e.target.value}))} style={iS}/></Field>
            <button onClick={async()=>{await updateCase(liveCase.id,nextForm);setEditNext(false);}} style={{width:"100%",background:C.pipeline,color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontWeight:900,cursor:"pointer",fontSize:14,marginTop:4}}>Save</button>
          </Modal>
        )}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
          <button onClick={()=>setView("list")} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:700}}>← Pipeline</button>
          <span style={{color:C.muted}}>/</span>
          <span style={{fontWeight:900,fontFamily:"Georgia,serif"}}>{liveCase.name}</span>
        </div>
        <Card style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <div style={{fontSize:22,fontWeight:900,fontFamily:"Georgia,serif"}}>{liveCase.name}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:3}}>Advisor: {advisorName(liveCase)}</div>
            </div>
            {liveIdx<STAGES.length-1&&<button onClick={()=>advance(liveCase)} style={{background:C.pipeline,color:"#fff",border:"none",borderRadius:10,padding:"10px 22px",cursor:"pointer",fontWeight:900,fontSize:13}}>Advance to {STAGES[liveIdx+1]?.label} →</button>}
          </div>
          <div onClick={()=>{setNextForm({nextAction:liveCase.nextAction||"on_track",nextNote:liveCase.nextNote||"",dueDate:liveCase.dueDate||""});setEditNext(true);}} style={{display:"inline-flex",alignItems:"center",gap:8,background:C.faint,border:`1px solid ${C.border}`,borderRadius:24,padding:"8px 16px",cursor:"pointer",marginBottom:18}}>
            <span style={{fontSize:18}}>{na.icon}</span>
            <div>
              <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1}}>NEXT ACTION</div>
              <div style={{fontSize:13,fontWeight:800,color:na.color}}>{na.label}</div>
              {liveCase.nextNote&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>{liveCase.nextNote}</div>}
            </div>
            {liveCase.dueDate&&<div style={{marginLeft:8,fontSize:10,background:C.border,borderRadius:10,padding:"3px 9px",fontWeight:700,color:C.muted}}>Due: {liveCase.dueDate}</div>}
            <span style={{marginLeft:4,fontSize:12,color:C.muted}}>✏️</span>
          </div>
          <div style={{display:"flex",alignItems:"center"}}>
            {STAGES.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",margin:"0 auto 5px",background:i<=liveIdx?C.stages[s.id].dot:"#E5E7EB",color:i<=liveIdx?"#fff":"#9CA3AF",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,boxShadow:i===liveIdx?`0 0 0 4px ${C.stages[s.id].dot}33`:"none"}}>{i<liveIdx?"✓":i+1}</div>
                  <div style={{fontSize:9,color:i===liveIdx?C.stages[s.id].dot:C.muted,fontWeight:i===liveIdx?800:400,lineHeight:1.3}}>{s.label}</div>
                </div>
                {i<STAGES.length-1&&<div style={{height:2,flex:0.5,background:i<liveIdx?C.pipeline:"#E5E7EB",marginBottom:18}}/>}
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:"flex",gap:5,marginBottom:14,background:C.navy,borderRadius:10,padding:4,width:"fit-content"}}>
          {["RM","admin","paraplanner"].map(r=>(
            <button key={r} onClick={()=>setRole(r)} style={{padding:"5px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:800,background:role===r?C.pipeline:"transparent",color:role===r?"#fff":"#94A3B8"}}>{r==="RM"?"Planner":r==="admin"?"Admin / PA":"Paraplanner"}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {[{id:"checklist",l:"✅ Checklist"},{id:"emails",l:"📧 Email Templates"},{id:"documents",l:"📁 Documents"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSelEmail(null);}} style={{padding:"8px 18px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:800,background:tab===t.id?C.navy:C.surface,color:tab===t.id?"#fff":C.muted}}>{t.l}</button>
          ))}
        </div>
        {tab==="checklist"&&<Card>{cl.map((item,i)=>{const done=isChk(liveCase.id,liveCase.stage,role,i);return(<div key={i} onClick={()=>toggle(liveCase.id,liveCase.stage,role,i)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 14px",borderRadius:10,cursor:"pointer",marginBottom:6,background:done?"#F0FDF4":C.faint,border:`1px solid ${done?"#BBF7D0":C.border}`}}><div style={{width:20,height:20,borderRadius:6,border:`2px solid ${done?"#16A34A":"#D1D5DB"}`,background:done?"#16A34A":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}</div><span style={{fontSize:13.5,color:done?C.muted:C.text,textDecoration:done?"line-through":"none",lineHeight:1.5}}>{item}</span></div>);})}</Card>}
        {tab==="emails"&&<div style={{display:"grid",gridTemplateColumns:selEmail?"1fr 1.5fr":"1fr",gap:16}}><Card>{em.map((e,i)=><div key={i} onClick={()=>setSelEmail(e)} style={{padding:"12px 14px",borderRadius:10,cursor:"pointer",marginBottom:8,background:selEmail?.label===e.label?"#EFF6FF":C.faint,border:`1px solid ${selEmail?.label===e.label?"#BFDBFE":C.border}`}}><div style={{fontWeight:800,fontSize:13,color:C.pipeline}}>📧 {e.label}</div><div style={{fontSize:11,color:C.muted,marginTop:3}}>Subject: {e.subject}</div></div>)}</Card>{selEmail&&<Card><div style={{fontWeight:900,fontSize:15,fontFamily:"Georgia,serif",marginBottom:8}}>{selEmail.label}</div><div style={{background:C.faint,borderRadius:8,padding:"7px 12px",marginBottom:12,fontSize:12}}><span style={{color:C.muted}}>Subject: </span><span style={{fontWeight:700}}>{selEmail.subject}</span></div><div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-line",color:"#374151",background:C.faint,borderRadius:10,padding:"14px 18px"}}>{selEmail.body}</div></Card>}</div>}
        {tab==="documents"&&<Card><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:9}}>{dc.map((d,i)=><div key={i} style={{padding:"12px 14px",borderRadius:10,background:C.faint,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>📄</span><div style={{fontSize:13,fontWeight:700}}>{d}</div></div>)}</div></Card>}
      </div>
    );
  }

  // ── List view ──
  return(
    <div style={{padding:"28px 32px",maxWidth:1060,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:24}}>
        {STAGES.map(s=>{const cnt=cases.filter(c=>c.stage===s.id).length;const sc=C.stages[s.id];return(<div key={s.id} style={{background:C.surface,borderRadius:12,padding:"13px 16px",borderTop:`4px solid ${sc.dot}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}><div style={{fontSize:28,fontWeight:900,color:sc.dot,fontFamily:"Georgia,serif"}}>{cnt}</div><div style={{fontSize:11,color:C.muted,marginTop:3,lineHeight:1.4}}>{s.label}</div></div>);})}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <h2 style={{margin:0,fontFamily:"Georgia,serif",fontSize:20,fontWeight:900}}>Active Cases</h2>
          {team.length>0&&(
            <select value={filterAdv} onChange={e=>setFilterAdv(e.target.value)} style={{...selS,width:180,fontSize:12}}>
              <option value="all">All Advisors</option>
              {team.filter(m=>m.active!==false).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          )}
        </div>
        <button onClick={()=>setShowAdd(true)} style={{background:C.pipeline,color:"#fff",border:"none",borderRadius:9,padding:"9px 20px",cursor:"pointer",fontWeight:900,fontSize:13}}>+ New Case</button>
      </div>

      {showAdd&&(
        <div style={{background:C.surface,borderRadius:12,padding:18,marginBottom:14,boxShadow:"0 2px 10px rgba(0,0,0,0.08)",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="Client full name..." style={{...iS,flex:1,minWidth:180}} autoFocus/>
          {team.length>0 ? (
            <select value={newAdv} onChange={e=>setNewAdv(e.target.value)} style={{...selS,width:200}}>
              <option value="">Select advisor…</option>
              {team.filter(m=>m.active!==false).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          ) : (
            <input value={newAdv} onChange={e=>setNewAdv(e.target.value)} placeholder="Advisor initials..." style={{...iS,width:120}}/>
          )}
          <button onClick={handleAdd} style={{background:C.pipeline,color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontWeight:900}}>Add</button>
          <button onClick={()=>setShowAdd(false)} style={{background:C.faint,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 14px",cursor:"pointer"}}>Cancel</button>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {visibleCases.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.muted,fontSize:14}}>No cases found.</div>}
        {visibleCases.map(c=>{const sc=C.stages[c.stage];const na=NA(c.nextAction);const isOverdue=c.dueDate&&new Date(c.dueDate)<new Date()&&c.nextAction!=="on_track";return(
          <div key={c.id} style={{background:C.surface,borderRadius:12,padding:"13px 18px",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",gap:14,borderLeft:`4px solid ${sc.dot}`}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)"}
            onClick={()=>{setSel(c);setView("detail");setTab("checklist");setSelEmail(null);}}>
            <Avatar name={c.name} color={sc.dot}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontWeight:900,fontSize:14}}>{c.name}</span>
                {c.urgent&&<Badge color={{bg:"#FEE2E2",text:"#991B1B"}}>URGENT</Badge>}
                <Badge color={{bg:"#F3F4F6",text:"#374151"}}>{advisorName(c)}</Badge>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:14}}>{na.icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:isOverdue?"#DC2626":na.color}}>{na.label}</span>
                {c.nextNote&&<span style={{fontSize:11,color:C.muted}}>— {c.nextNote}</span>}
              </div>
            </div>
            <div style={{textAlign:"right",minWidth:130}}>
              <Badge color={{bg:sc.bg,text:sc.text}}>{STAGES.find(s=>s.id===c.stage)?.label}</Badge>
              <div style={{height:5,background:"#F3F4F6",borderRadius:3,overflow:"hidden",marginTop:8}}><div style={{height:"100%",width:`${pct(c)}%`,background:sc.dot,borderRadius:3}}/></div>
              <div style={{fontSize:10,color:C.muted,marginTop:3}}>{pct(c)}% done</div>
            </div>
            <span style={{color:C.muted,fontSize:18}}>›</span>
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── CITA ─────────────────────────────────────────────────────────────────────
function CitaModule({tasks,addTask,updateTask,deleteTask,markDone,team}){
  const [filterCat,setFilterCat]=useState("all");
  const [filterAdv,setFilterAdv]=useState("all");
  const [filterSt,setFilterSt]  =useState("all");
  const [search,setSearch]       =useState("");
  const [showAdd,setShowAdd]     =useState(false);
  const [editT,setEditT]         =useState(null);
  const empty={client:"",advisorId:"",advisor:"",category:"urgent",instruction:"",dateLogged:fmt(today),followUp:"",dateCompleted:"",notes:""};
  const [form,setForm]=useState(empty);

  const filtered=useMemo(()=>tasks.filter(t=>{
    if(filterCat!=="all"&&t.category!==filterCat)return false;
    if(filterAdv!=="all"&&t.advisorId!==filterAdv)return false;
    const s=getTaskStatus(t);if(filterSt!=="all"&&s!==filterSt)return false;
    if(search&&!t.client.toLowerCase().includes(search.toLowerCase())&&!t.instruction.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  }),[tasks,filterCat,filterAdv,filterSt,search]);

  const counts=useMemo(()=>({overdue:tasks.filter(t=>getTaskStatus(t)==="overdue").length,due_today:tasks.filter(t=>getTaskStatus(t)==="due_today").length,open:tasks.filter(t=>getTaskStatus(t)==="open").length,completed:tasks.filter(t=>getTaskStatus(t)==="completed").length}),[tasks]);

  const save=async()=>{
    if(!form.client.trim()||!form.instruction.trim())return;
    const adv = team.find(m=>m.id===form.advisorId);
    const data={...form,advisor:adv?(adv.initials||adv.name):form.advisor,dateCompleted:form.dateCompleted||null};
    if(editT){await updateTask(editT.id,data);}else{await addTask(data);}
    setForm(empty);setShowAdd(false);setEditT(null);
  };
  const openEdit=(t)=>{setForm({...t,dateCompleted:t.dateCompleted||"",followUp:t.followUp||"",advisorId:t.advisorId||""});setEditT(t);setShowAdd(true);};
  const memberName=(t)=>{const m=team.find(tm=>tm.id===t.advisorId);return m?(m.initials||m.name):(t.advisor||"—");};

  return(
    <div style={{padding:"28px 32px",maxWidth:1060,margin:"0 auto"}}>
      {showAdd&&(
        <Modal title={editT?"Edit Task":"New Admin Task"} onClose={()=>{setShowAdd(false);setEditT(null);setForm(empty);}}>
          <Field label="CLIENT NAME"><input value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))} style={iS} placeholder="e.g. Hockly, Neil"/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="ADVISOR / TEAM MEMBER">
              {team.length>0?(
                <select value={form.advisorId} onChange={e=>setForm(p=>({...p,advisorId:e.target.value}))} style={selS}>
                  <option value="">Select…</option>
                  {team.filter(m=>m.active!==false).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              ):(
                <input value={form.advisor} onChange={e=>setForm(p=>({...p,advisor:e.target.value}))} style={iS} placeholder="e.g. RM"/>
              )}
            </Field>
            <Field label="CATEGORY">
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={selS}>
                {["Priority","Admin","Investment","Reviews","STI","EB","Healthcare","Other"].map(grp=>{
                  const grpCats=CITA_CATS.filter(c=>c.group===grp);
                  if(!grpCats.length) return null;
                  return <optgroup key={grp} label={`── ${grp} ──`}>{grpCats.map(c=><option key={c.id} value={c.id}>{C.cats[c.id].icon} {c.label}</option>)}</optgroup>;
                })}
              </select>
            </Field>
          </div>
          <Field label="INSTRUCTION / ACTION"><textarea value={form.instruction} onChange={e=>setForm(p=>({...p,instruction:e.target.value}))} style={{...iS,height:80,resize:"vertical"}} placeholder="Describe the task..."/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <Field label="DATE LOGGED"><input type="date" value={form.dateLogged} onChange={e=>setForm(p=>({...p,dateLogged:e.target.value}))} style={iS}/></Field>
            <Field label="FOLLOW-UP DATE"><input type="date" value={form.followUp} onChange={e=>setForm(p=>({...p,followUp:e.target.value}))} style={iS}/></Field>
            <Field label="DATE COMPLETED"><input type="date" value={form.dateCompleted} onChange={e=>setForm(p=>({...p,dateCompleted:e.target.value}))} style={iS}/></Field>
          </div>
          <Field label="NOTES"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...iS,height:60,resize:"vertical"}}/></Field>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button onClick={save} style={{flex:1,background:C.cita,color:"#fff",border:"none",borderRadius:9,padding:"11px 0",fontWeight:900,cursor:"pointer",fontSize:14}}>{editT?"Save Changes":"Add Task"}</button>
            <button onClick={()=>{setShowAdd(false);setEditT(null);setForm(empty);}} style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 18px",cursor:"pointer",fontWeight:700}}>Cancel</button>
          </div>
        </Modal>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
        {[{s:"overdue",l:"Overdue",i:"⚠️",c:"#DC2626"},{s:"due_today",l:"Due Today",i:"⏰",c:"#D97706"},{s:"open",l:"Open",i:"📌",c:"#2563EB"},{s:"completed",l:"Completed",i:"✅",c:"#16A34A"}].map(({s,l,i,c})=>(
          <div key={s} onClick={()=>setFilterSt(filterSt===s?"all":s)} style={{background:C.surface,borderRadius:12,padding:"14px 16px",borderLeft:`4px solid ${c}`,cursor:"pointer",boxShadow:filterSt===s?`0 0 0 2px ${c}44`:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:9,fontWeight:800,letterSpacing:1.5,color:C.muted,marginBottom:3}}>{i} {l.toUpperCase()}</div>
            <div style={{fontSize:28,fontWeight:900,fontFamily:"Georgia,serif"}}>{counts[s]}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search client or task..." style={{...iS,width:220,background:C.surface}}/>
        {team.length>0?(
          <select value={filterAdv} onChange={e=>setFilterAdv(e.target.value)} style={{...selS,width:180,background:C.surface}}>
            <option value="all">All Team Members</option>
            {team.filter(m=>m.active!==false).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        ):(
          <select value={filterAdv} onChange={e=>setFilterAdv(e.target.value)} style={{...selS,width:100,background:C.surface}}><option value="all">All</option></select>
        )}
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{...selS,width:200,background:C.surface}}>
          <option value="all">All Categories</option>
          {["Priority","Admin","Investment","Reviews","STI","EB","Healthcare","Other"].map(grp=>{
            const grpCats=CITA_CATS.filter(c=>c.group===grp);
            if(!grpCats.length) return null;
            return <optgroup key={grp} label={`── ${grp} ──`}>{grpCats.map(c=><option key={c.id} value={c.id}>{C.cats[c.id].icon} {c.label}</option>)}</optgroup>;
          })}
        </select>
        <div style={{flex:1}}/>
        <button onClick={()=>{setForm(empty);setShowAdd(true);}} style={{background:C.cita,color:"#fff",border:"none",borderRadius:9,padding:"9px 20px",cursor:"pointer",fontWeight:900,fontSize:13}}>+ New Task</button>
      </div>

      {/* Grouped category filters */}
      {(()=>{
        const groups=["Priority","Admin","Investment","Reviews","STI","EB","Healthcare","Other"];
        const active=filterCat!=="all"?C.cats[filterCat]:null;
        return(
          <div style={{marginBottom:16}}>
            {/* Active filter pill + clear */}
            {active&&(
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:11,color:C.muted,fontWeight:700}}>Filtering:</span>
                <span style={{background:active.bg,color:active.text,fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:20,display:"flex",alignItems:"center",gap:5}}>
                  {active.icon} {CITA_CATS.find(c=>c.id===filterCat)?.label}
                </span>
                <button onClick={()=>setFilterCat("all")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,fontWeight:700,padding:"2px 6px"}}>✕ Clear</button>
              </div>
            )}
            {/* Group rows */}
            {groups.map(grp=>{
              const grpCats=CITA_CATS.filter(c=>c.group===grp);
              if(!grpCats.length) return null;
              return(
                <div key={grp} style={{display:"flex",alignItems:"center",gap:6,marginBottom:7,flexWrap:"wrap"}}>
                  <span style={{fontSize:9,fontWeight:800,letterSpacing:1.5,color:C.muted,minWidth:76,textTransform:"uppercase"}}>{grp}</span>
                  {grpCats.map(c=>{
                    const cat=C.cats[c.id];
                    const count=tasks.filter(t=>t.category===c.id).length;
                    const active=filterCat===c.id;
                    return(
                      <button key={c.id} onClick={()=>setFilterCat(active?"all":c.id)}
                        style={{padding:"4px 11px",borderRadius:20,border:`1px solid ${active?cat.dot:C.border}`,background:active?cat.bg:C.surface,color:active?cat.text:C.muted,fontSize:11,fontWeight:active?800:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all 0.1s"}}>
                        {cat.icon} {c.label} {count>0&&<span style={{background:active?cat.dot:"#E5E7EB",color:active?"#fff":"#6B7280",borderRadius:10,fontSize:9,padding:"0 5px",fontWeight:800}}>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })()}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.muted,fontSize:14}}>No tasks match your filters.</div>}
        {filtered.map(t=>{const st=getTaskStatus(t);const sc=C.status[st];const cat=C.cats[t.category];return(
          <div key={t.id} style={{background:C.surface,borderRadius:12,padding:"13px 17px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",display:"flex",alignItems:"flex-start",gap:13,borderLeft:`4px solid ${cat.dot}`,opacity:st==="completed"?0.65:1}}>
            <div style={{fontSize:20,marginTop:2}}>{cat.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:4}}>
                <span style={{fontWeight:900,fontSize:14}}>{t.client}</span>
                <Badge color={{bg:"#F3F4F6",text:"#374151"}}>{memberName(t)}</Badge>
                <Badge color={cat}>{cat.icon} {CITA_CATS.find(c=>c.id===t.category)?.label}</Badge>
                <Badge color={sc}>{st==="overdue"?"Overdue":st==="due_today"?"Due Today":st==="completed"?"Completed":"Open"}</Badge>
              </div>
              <div style={{fontSize:13,color:st==="completed"?C.muted:C.text,textDecoration:st==="completed"?"line-through":"none",marginBottom:4,lineHeight:1.5}}>{t.instruction}</div>
              {t.notes&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>📝 {t.notes}</div>}
              <div style={{display:"flex",gap:16,marginTop:5,fontSize:11,color:C.muted}}>
                <span>Logged: {t.dateLogged}</span>
                {t.followUp&&<span style={{color:st==="overdue"?"#DC2626":st==="due_today"?"#D97706":C.muted}}>Follow-up: {t.followUp}</span>}
                {t.dateCompleted&&<span style={{color:"#16A34A"}}>✓ Completed: {t.dateCompleted}</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:5,flexShrink:0}}>
              {st!=="completed"&&<button onClick={()=>markDone(t.id)} style={{background:"#D1FAE5",color:"#065F46",border:"none",borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:900}}>✓</button>}
              <button onClick={()=>openEdit(t)} style={{background:C.faint,color:C.text,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:12}}>✏️</button>
              <button onClick={()=>deleteTask(t.id)} style={{background:"#FEE2E2",color:"#991B1B",border:"none",borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:13}}>🗑</button>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── CLIENT VIEW ──────────────────────────────────────────────────────────────
function ClientView({pipeline,tasks,team}){
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const allClients=useMemo(()=>{
    const resolveName=(id,fallback)=>{const m=team.find(t=>t.id===id);return m?m.name:(fallback||"—");};
    const map={};
    pipeline.forEach(c=>{map[c.name]={...map[c.name],name:c.name,advisor:resolveName(c.advisorId,c.advisor),pipelineCase:c};});
    tasks.forEach(t=>{if(!map[t.client])map[t.client]={name:t.client,advisor:resolveName(t.advisorId,t.advisor)};map[t.client].tasks=[...(map[t.client].tasks||[]),t];});
    return Object.values(map).sort((a,b)=>a.name.localeCompare(b.name));
  },[pipeline,tasks,team]);

  const filtered=allClients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));

  return(
    <div style={{padding:"28px 32px",maxWidth:1060,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:18}}>
        <div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients..." style={{...iS,marginBottom:10,background:C.surface}}/>
          <div style={{background:C.surface,borderRadius:14,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
            {filtered.length===0&&<div style={{padding:24,color:C.muted,fontSize:13,textAlign:"center"}}>No clients found.</div>}
            {filtered.map((c,i)=>{
              const open=(c.tasks||[]).filter(t=>getTaskStatus(t)!=="completed").length;
              const overdue=(c.tasks||[]).filter(t=>getTaskStatus(t)==="overdue").length;
              const sc=c.pipelineCase?C.stages[c.pipelineCase.stage]:null;
              return(
                <div key={c.name} onClick={()=>setSel(c)} style={{padding:"11px 15px",cursor:"pointer",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",background:sel?.name===c.name?C.faint:"transparent",display:"flex",alignItems:"center",gap:11}}>
                  <Avatar name={c.name} color={sc?sc.dot:"#94A3B8"} size={32}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                    <div style={{fontSize:10,color:C.muted}}>{c.advisor}{sc?` · ${STAGES.find(s=>s.id===c.pipelineCase.stage)?.label}`:""}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                    {overdue>0&&<span style={{background:"#FEE2E2",color:"#991B1B",fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:10}}>{overdue} overdue</span>}
                    {open>0&&<span style={{background:"#DBEAFE",color:"#1E40AF",fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:10}}>{open} open</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {sel?(()=>{
            const client=allClients.find(c=>c.name===sel.name)||sel;
            const open=(client.tasks||[]).filter(t=>getTaskStatus(t)!=="completed");
            const done=(client.tasks||[]).filter(t=>getTaskStatus(t)==="completed");
            const sc=client.pipelineCase?C.stages[client.pipelineCase.stage]:null;
            const na=client.pipelineCase?NA(client.pipelineCase.nextAction):null;
            return(
              <Card>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                  <Avatar name={client.name} color={sc?sc.dot:"#64748B"} size={48}/>
                  <div>
                    <div style={{fontSize:20,fontWeight:900,fontFamily:"Georgia,serif"}}>{client.name}</div>
                    <div style={{fontSize:12,color:C.muted,marginTop:2}}>Advisor: {client.advisor}</div>
                  </div>
                </div>
                {client.pipelineCase&&(
                  <div style={{background:C.faint,borderRadius:10,padding:"12px 16px",marginBottom:16,borderLeft:`3px solid ${sc.dot}`}}>
                    <SectionTitle>NEW BUSINESS PIPELINE</SectionTitle>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <Badge color={sc}>{STAGES.find(s=>s.id===client.pipelineCase.stage)?.label}</Badge>
                      {na&&<span style={{fontSize:12,fontWeight:700,color:na.color}}>{na.icon} {na.label}</span>}
                      {client.pipelineCase.nextNote&&<span style={{fontSize:11,color:C.muted}}>— {client.pipelineCase.nextNote}</span>}
                    </div>
                  </div>
                )}
                {open.length>0&&(
                  <div style={{marginBottom:14}}>
                    <SectionTitle>OPEN ADMIN TASKS ({open.length})</SectionTitle>
                    {open.map(t=>{const cat=C.cats[t.category];const st=getTaskStatus(t);return(
                      <div key={t.id} style={{padding:"10px 13px",borderRadius:9,marginBottom:6,background:C.faint,border:`1px solid ${C.border}`,display:"flex",gap:10}}>
                        <span style={{fontSize:18}}>{cat.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:700}}>{t.instruction}</div>
                          <div style={{display:"flex",gap:7,marginTop:5,flexWrap:"wrap"}}>
                            <Badge color={{bg:cat.bg,text:cat.text}}>{CITA_CATS.find(c=>c.id===t.category)?.label}</Badge>
                            <Badge color={C.status[st]}>{st==="overdue"?"Overdue":st==="due_today"?"Due Today":"Open"}</Badge>
                          </div>
                        </div>
                      </div>
                    );})}
                  </div>
                )}
                {done.length>0&&(
                  <div>
                    <SectionTitle>COMPLETED ({done.length})</SectionTitle>
                    {done.map(t=><div key={t.id} style={{padding:"8px 13px",borderRadius:9,marginBottom:5,background:"#F0FDF4",border:"1px solid #BBF7D0",fontSize:12,color:C.muted,textDecoration:"line-through",opacity:0.8}}>✓ {t.instruction}</div>)}
                  </div>
                )}
                {!client.pipelineCase&&!client.tasks?.length&&<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>No records found.</div>}
              </Card>
            );
          })():(
            <Card style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{fontSize:36,marginBottom:12}}>👤</div>
              <div style={{fontSize:14,fontWeight:800}}>Select a client to view their full record</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4}}>Pipeline stage + all admin tasks in one view</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mod,setMod] = useState("dashboard");
  const { cases,  loading:cL, addCase,  updateCase  } = useCases();
  const { tasks,  loading:tL, addTask,  updateTask, deleteTask, markDone } = useTasks();
  const { team,   loading:mL, addMember, updateMember, deleteMember }      = useTeam();

  if (cL||tL||mL) return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Palatino Linotype',Georgia,serif"}}>
      <TopNav mod={mod} setMod={setMod}/>
      <Spinner/>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif",color:C.text}}>
      <TopNav mod={mod} setMod={setMod}/>
      {mod==="dashboard" && <Dashboard  cases={cases} updateCase={updateCase} tasks={tasks} team={team} setMod={setMod}/>}
      {mod==="pipeline"  && <PipelineModule cases={cases} addCase={addCase} updateCase={updateCase} team={team}/>}
      {mod==="cita"      && <CitaModule tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} markDone={markDone} team={team}/>}
      {mod==="client"    && <ClientView pipeline={cases} tasks={tasks} team={team}/>}
      {mod==="team"      && <TeamModule team={team} addMember={addMember} updateMember={updateMember} deleteMember={deleteMember} cases={cases} tasks={tasks}/>}
    </div>
  );
}
