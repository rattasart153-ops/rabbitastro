(function(){
"use strict";
const $=id=>document.getElementById(id), loginPanel=$("loginPanel"), dashboard=$("dashboard");
let token=sessionStorage.getItem("rabbitastro_admin_token")||"", bookings=[];
async function api(payload){
 const response=await fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({},payload,{token:payload.action==="adminLogin"?undefined:token}))});
 const data=await response.json();if(response.status===401){logout(false);throw new Error(data.message||"กรุณาเข้าสู่ระบบใหม่");}
 if(!response.ok||!data.ok)throw new Error(data.message||"เกิดข้อผิดพลาด");return data;
}
function showDashboard(){loginPanel.hidden=true;dashboard.hidden=false;showPanel("engines");loadBookings();}
function showPanel(which){
 const enginesPanel=$("enginesPanel");
 enginesPanel.hidden=which!=="engines";
 $("showEngines").classList.toggle("active",which==="engines");
}
function logout(show=true){
 const oldToken=token;if(oldToken)fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"adminLogout",token:oldToken})}).catch(()=>{});
 token="";sessionStorage.removeItem("rabbitastro_admin_token");dashboard.hidden=true;loginPanel.hidden=false;
 if(show)$("loginMessage").textContent="ออกจากระบบแล้ว";
}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();$("loginMessage").textContent="กำลังตรวจสอบ…";try{const r=await api({action:"adminLogin",username:$("username").value,password:$("password").value});token=r.token;sessionStorage.setItem("rabbitastro_admin_token",token);$("password").value="";$("loginMessage").textContent="";showDashboard();}catch(err){$("loginMessage").textContent=err.message;}});
$("logoutButton").addEventListener("click",()=>logout());
$("showEngines").addEventListener("click",()=>showPanel("engines"));
$("refreshButton").addEventListener("click",loadBookings);
$("tabBooking").addEventListener("click",loadBookings);
$("searchInput").addEventListener("input",render);
$("statusFilter").addEventListener("change",render);
$("queueFilter").addEventListener("change",render);
async function loadBookings(){
 $("bookingList").textContent="กำลังโหลดข้อมูล…";
 try{const r=await api({action:"adminListBookings"});bookings=r.bookings||[];render();}
 catch(err){if(!token){dashboard.hidden=true;loginPanel.hidden=false;$("loginMessage").textContent=err.message||"ไม่สามารถยืนยันเซสชันได้ กรุณาเข้าสู่ระบบใหม่";}else{$("bookingList").textContent=err.message;}}
}
function actionButton(label,mode,disabled){
 const button=document.createElement("button");button.type="button";button.className="secondary";button.textContent=label;button.disabled=!!disabled;
 button.addEventListener("click",async()=>{button.disabled=true;try{await api({action:"adminManageQueue",bookingId:button.dataset.bookingId,mode:mode});await loadBookings();}catch(err){alert(err.message);button.disabled=false;}});
 return button;
}
function render(){
 const q=$("searchInput").value.trim().toLowerCase(),status=$("statusFilter").value,queueView=$("queueFilter").value;
 $("totalCount").textContent=bookings.length;
 $("pendingCount").textContent=bookings.filter(x=>x.status==="รอตรวจสอบ").length;
 $("confirmedCount").textContent=bookings.filter(x=>x.status==="ยืนยันแล้ว").length;
 const activeBookings=bookings.filter(b=>b.queueActive!==false).sort((a,b)=>(a.queueOrder||999999)-(b.queueOrder||999999));
 const activeIndexById=new Map(activeBookings.map((b,i)=>[b.bookingId,i]));
 const list=bookings.filter(b=>{
  const active=b.queueActive!==false;
  return (queueView==="all"||(queueView==="active"&&active)||(queueView==="removed"&&!active)) &&
   (!status||b.status===status) &&
   [b.bookingId,b.name,b.phone,b.lineId].join(" ").toLowerCase().includes(q);
 });
 const root=$("bookingList");root.replaceChildren();
 if(!list.length){const p=document.createElement("p");p.className="muted";p.textContent=queueView==="active"?"ไม่มีคิวที่กำลังใช้งานอยู่":"ยังไม่มีรายการจองที่ตรงกับเงื่อนไข";root.append(p);return;}
 list.forEach(b=>{
  const isActive=b.queueActive!==false;
  const card=document.createElement("article");card.className="booking-card";
  const head=document.createElement("div");head.className="booking-head";
  const title=document.createElement("div"),h=document.createElement("h3");h.textContent=b.name+" · "+b.bookingId;title.append(h);
  const badge=document.createElement("span");badge.className="status "+(b.status==="ยืนยันแล้ว"?"confirm":b.status==="เสร็จสิ้น"?"done":b.status==="ยกเลิก"?"cancel":"");badge.textContent=b.status;head.append(title,badge);card.append(head);
  if(isActive){const order=document.createElement("div");order.className="queue-order";order.textContent="ลำดับคิวที่ "+(b.queueOrder||"-");card.append(order);}
  else {const removed=document.createElement("div");removed.className="queue-removed";removed.textContent="นำออกจากคิวแล้ว · เก็บประวัติการจองไว้";card.append(removed);}
  const meta=document.createElement("div");meta.className="booking-meta";
  [["โทรศัพท์",b.phone],["LINE ID",b.lineId||"-"],["วันเกิด",b.birthDate||"-"],["เวลาเกิด",b.birthTime||"-"],["บริการ",b.service],["เรื่องที่ปรึกษา",b.category||b.topic?(b.category||"-")+" · "+(b.topic||"-"):"ไม่ต้องระบุสำหรับบริการนี้"],["วันและเวลา",b.date+" เวลา "+b.time],["สร้างเมื่อ",b.createdAt]].forEach(([k,v])=>{const d=document.createElement("div");d.textContent=k+": "+v;meta.append(d);});card.append(meta);
  if(b.note){const note=document.createElement("div");note.className="booking-note";note.textContent="รายละเอียดเพิ่มเติม: "+b.note;card.append(note);}
  const actions=document.createElement("div");actions.className="booking-actions";const select=document.createElement("select");
  ["รอตรวจสอบ","ยืนยันแล้ว","เสร็จสิ้น","ยกเลิก"].forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=s;o.selected=s===b.status;select.append(o);});
  const save=document.createElement("button");save.className="secondary";save.type="button";save.textContent="บันทึกสถานะ";save.addEventListener("click",async()=>{save.disabled=true;try{await api({action:"adminUpdateBooking",bookingId:b.bookingId,status:select.value});await loadBookings();}catch(err){alert(err.message);}finally{save.disabled=false;}});
  actions.append(select,save);
  if(isActive){
   const manage=document.createElement("button");manage.className="secondary";manage.type="button";manage.textContent="จัดการคิว";
   const panel=document.createElement("div");panel.className="queue-manage";panel.hidden=true;
   const index=activeIndexById.get(b.bookingId),up=actionButton("เลื่อนขึ้น","moveUp",index===0),down=actionButton("เลื่อนลง","moveDown",index===activeBookings.length-1),remove=actionButton("นำออกจากคิว","remove",false);
   [up,down,remove].forEach(button=>button.dataset.bookingId=b.bookingId);
   manage.addEventListener("click",()=>{panel.hidden=!panel.hidden;manage.textContent=panel.hidden?"จัดการคิว":"ปิดการจัดการ";});
   panel.append(up,down,remove);actions.append(manage);card.append(actions,panel);
  }else card.append(actions);
  root.append(card);
 });
}
if(token)showDashboard();
})();