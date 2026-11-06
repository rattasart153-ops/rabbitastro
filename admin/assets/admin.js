(function(){
"use strict";
const $=id=>document.getElementById(id), loginPanel=$("loginPanel"), dashboard=$("dashboard");
let token=sessionStorage.getItem("rabbitastro_admin_token")||"", bookings=[];
async function api(payload){
 const response=await fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({},payload,{token:payload.action==="adminLogin"?undefined:token}))});
 const data=await response.json(); if(response.status===401){logout(false);throw new Error(data.message||"กรุณาเข้าสู่ระบบใหม่");}
 if(!response.ok||!data.ok)throw new Error(data.message||"เกิดข้อผิดพลาด"); return data;
}
function showDashboard(){loginPanel.hidden=true;dashboard.hidden=false;loadBookings();}
function logout(show=true){
 const oldToken=token;
 if(oldToken)fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"adminLogout",token:oldToken})}).catch(()=>{});
 token="";sessionStorage.removeItem("rabbitastro_admin_token");dashboard.hidden=true;loginPanel.hidden=false;
 if(show)$("loginMessage").textContent="ออกจากระบบแล้ว";
}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();$("loginMessage").textContent="กำลังตรวจสอบ…";try{const r=await api({action:"adminLogin",username:$("username").value,password:$("password").value});token=r.token;sessionStorage.setItem("rabbitastro_admin_token",token);$("password").value="";$("loginMessage").textContent="";showDashboard();}catch(err){$("loginMessage").textContent=err.message;}});
$("logoutButton").addEventListener("click",()=>logout());
$("refreshButton").addEventListener("click",loadBookings);
$("searchInput").addEventListener("input",render);
$("statusFilter").addEventListener("change",render);
async function loadBookings(){ $("bookingList").textContent="กำลังโหลดข้อมูล…";try{const r=await api({action:"adminListBookings"});bookings=r.bookings||[];render();}catch(err){$("bookingList").textContent=err.message;} }
function render(){
 const q=$("searchInput").value.trim().toLowerCase(),status=$("statusFilter").value;
 $("totalCount").textContent=bookings.length;$("pendingCount").textContent=bookings.filter(x=>x.status==="รอตรวจสอบ").length;$("confirmedCount").textContent=bookings.filter(x=>x.status==="ยืนยันแล้ว").length;
 const list=bookings.filter(b=>(!status||b.status===status)&&[b.bookingId,b.name,b.phone,b.lineId].join(" ").toLowerCase().includes(q));
 const root=$("bookingList");root.replaceChildren();
 if(!list.length){const p=document.createElement("p");p.className="muted";p.textContent="ยังไม่มีรายการจองที่ตรงกับเงื่อนไข";root.append(p);return;}
 list.forEach(b=>{
  const card=document.createElement("article");card.className="booking-card";
  const head=document.createElement("div");head.className="booking-head";
  const title=document.createElement("div"),h=document.createElement("h3");h.textContent=b.name+" · "+b.bookingId;title.append(h);
  const badge=document.createElement("span");badge.className="status "+(b.status==="ยืนยันแล้ว"?"confirm":b.status==="เสร็จสิ้น"?"done":b.status==="ยกเลิก"?"cancel":"");badge.textContent=b.status;head.append(title,badge);card.append(head);
  const meta=document.createElement("div");meta.className="booking-meta";
  [["โทรศัพท์",b.phone],["LINE ID",b.lineId||"-"],["บริการ",b.service],["วันและเวลา",b.date+" เวลา "+b.time],["สร้างเมื่อ",b.createdAt]].forEach(([k,v])=>{const d=document.createElement("div");d.textContent=k+": "+v;meta.append(d);});card.append(meta);
  if(b.note){const note=document.createElement("div");note.className="booking-note";note.textContent="รายละเอียด: "+b.note;card.append(note);}
  const actions=document.createElement("div");actions.className="booking-actions";const select=document.createElement("select");
  ["รอตรวจสอบ","ยืนยันแล้ว","เสร็จสิ้น","ยกเลิก"].forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=s;o.selected=s===b.status;select.append(o);});
  const save=document.createElement("button");save.className="secondary";save.textContent="บันทึกสถานะ";save.addEventListener("click",async()=>{save.disabled=true;try{await api({action:"adminUpdateBooking",bookingId:b.bookingId,status:select.value});await loadBookings();}catch(err){alert(err.message);}finally{save.disabled=false;}});
  actions.append(select,save);card.append(actions);root.append(card);
 });
}
if(token)showDashboard();
})();