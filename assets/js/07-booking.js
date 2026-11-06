(function(){
"use strict";
function init(){
 const anchor=document.querySelector(".engine-tabs");
 if(!anchor||document.getElementById("bookingSection"))return;
 const section=document.createElement("section");
 section.id="bookingSection";section.className="booking-section card";
 section.innerHTML=`
 <div class="booking-heading"><span class="booking-mark">📅</span><div><span class="card-title">จองคิวดูดวง</span><h2>นัดหมายเพื่อรับคำปรึกษาแบบส่วนตัว</h2><p>ส่งคำขอจองคิว แล้วรอผู้ดูแลติดต่อกลับเพื่อยืนยันเวลา</p></div></div>
 <form id="bookingForm" class="booking-form">
 <div class="booking-grid">
 <div><label for="bookingName">ชื่อ-นามสกุล *</label><input id="bookingName" name="name" maxlength="100" autocomplete="name" required></div>
 <div><label for="bookingPhone">เบอร์โทรศัพท์ *</label><input id="bookingPhone" name="phone" type="tel" maxlength="30" autocomplete="tel" required></div>
 <div><label for="bookingLine">LINE ID (ถ้ามี)</label><input id="bookingLine" name="lineId" maxlength="80"></div>
 <div><label for="bookingService">บริการที่ต้องการ *</label><select id="bookingService" name="service" required><option value="">เลือกบริการ</option><option>ดูดวงส่วนบุคคล</option><option>ไพ่ทาโรต์ + รูน</option><option>โอเรกุรัม</option><option>ปรึกษาเรื่องเฉพาะด้าน</option><option>บริการอื่น ๆ</option></select></div>
 <div><label for="bookingDate">วันที่ต้องการ *</label><input id="bookingDate" name="date" type="date" required></div>
 <div><label for="bookingTime">เวลาที่ต้องการ *</label><input id="bookingTime" name="time" type="time" required></div>
 </div>
 <div><label for="bookingNote">เรื่องที่ต้องการปรึกษา (ไม่บังคับ)</label><textarea id="bookingNote" name="note" rows="3" maxlength="1000" placeholder="เล่าเรื่องที่อยากปรึกษาได้ โดยไม่จำเป็นต้องใส่ข้อมูลอ่อนไหว"></textarea></div>
 <div class="booking-trap" aria-hidden="true"><label for="bookingWebsite">Website</label><input id="bookingWebsite" name="website" tabindex="-1" autocomplete="off"></div>
 <label class="booking-consent"><input id="bookingConsent" type="checkbox" required><span>ยินยอมให้ใช้ข้อมูลติดต่อเพื่อดำเนินการจองคิวและติดต่อกลับเกี่ยวกับนัดหมายนี้ *</span></label>
 <button id="bookingSubmit" class="btn-submit" type="submit">🐇 ส่งคำขอจองคิว</button>
 <p class="booking-privacy">ข้อมูลการจองจะถูกส่งไปยังระบบจัดการคิวของ Rabbitastro เพื่อใช้ติดต่อและจัดการนัดหมายเท่านั้น</p>
 <div id="bookingMessage" class="booking-message" role="status" aria-live="polite"></div>
 </form>`;
 anchor.parentNode.insertBefore(section,anchor);
 const date=document.getElementById("bookingDate");
 const localNow=new Date(),today=new Date(localNow.getTime()-localNow.getTimezoneOffset()*60000).toISOString().slice(0,10);
 date.min=today;
 document.getElementById("bookingForm").addEventListener("submit",async function(e){
  e.preventDefault();const form=e.currentTarget,button=document.getElementById("bookingSubmit"),message=document.getElementById("bookingMessage");
  if(!form.reportValidity())return;
  const payload={name:form.elements.namedItem("name").value.trim(),phone:form.elements.namedItem("phone").value.trim(),lineId:form.elements.namedItem("lineId").value.trim(),service:form.elements.namedItem("service").value,date:form.elements.namedItem("date").value,time:form.elements.namedItem("time").value,note:form.elements.namedItem("note").value.trim(),website:form.elements.namedItem("website").value};
  button.disabled=true;button.textContent="กำลังส่งคำขอ…";message.className="booking-message";message.textContent="กำลังบันทึกคำขอจองคิว";
  try{
   const response=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.message||"ไม่สามารถส่งคำขอได้");
   message.className="booking-message success";
   message.textContent=result.message+" เลขอ้างอิง: "+result.bookingId;
   form.reset();date.min=today;
  }catch(err){message.className="booking-message error";message.textContent=err.message||"เกิดข้อผิดพลาด กรุณาลองใหม่";}
  finally{button.disabled=false;button.textContent="🐇 ส่งคำขอจองคิว";}
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();