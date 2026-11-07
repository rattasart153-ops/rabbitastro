(function(){
"use strict";
function init(){
 const engine=document.getElementById("engineBooking");
 if(!engine||document.getElementById("bookingSection"))return;
 const section=document.createElement("section");
 section.id="bookingSection";section.className="booking-section card";
 section.innerHTML=`
 <div class="booking-heading"><span class="booking-mark">📅</span><div><span class="card-title">จองคิวดูดวง</span><h2>นัดหมายเพื่อรับคำปรึกษาแบบส่วนตัว</h2><p>กรอกข้อมูลชุดเดียวกับหน้า UI ดูดวง เลือกบริการและเรื่องที่ต้องการปรึกษา แล้วรอผู้ดูแลยืนยันคิว</p></div></div>
 <form id="bookingForm" class="booking-form">
 <section class="booking-subcard"><h3>👤 ข้อมูลส่วนตัว</h3>
 <div class="booking-grid">
 <div><label for="bookingFirstName">ชื่อ *</label><input id="bookingFirstName" name="firstName" maxlength="60" autocomplete="given-name" required></div>
 <div><label for="bookingLastName">นามสกุล *</label><input id="bookingLastName" name="lastName" maxlength="60" autocomplete="family-name" required></div>
 <div><label for="bookingPhone">เบอร์โทรศัพท์ *</label><input id="bookingPhone" name="phone" type="tel" maxlength="30" autocomplete="tel" required></div>
 <div><label for="bookingLine">LINE ID (ถ้ามี)</label><input id="bookingLine" name="lineId" maxlength="80"></div>
 </div></section>
 <section class="booking-subcard"><h3>🎂 วันและเวลาเกิด</h3>
 <div class="booking-grid booking-birth-grid">
 <div><label for="bookingBirthDay">วัน *</label><input id="bookingBirthDay" name="birthDay" type="number" min="1" max="31" placeholder="เช่น 15" required></div>
 <div><label for="bookingBirthMonth">เดือน *</label><input id="bookingBirthMonth" name="birthMonth" type="number" min="1" max="12" placeholder="เช่น 3" required></div>
 <div><label for="bookingBirthYear">ปี ค.ศ. *</label><input id="bookingBirthYear" name="birthYear" type="number" min="1900" max="2100" placeholder="เช่น 1990" required></div>
 <div><label for="bookingBirthHour">ชั่วโมงเกิด</label><input id="bookingBirthHour" name="birthHour" type="number" min="0" max="23" placeholder="0–23"></div>
 <div><label for="bookingBirthMinute">นาทีเกิด</label><input id="bookingBirthMinute" name="birthMinute" type="number" min="0" max="59" placeholder="0–59"></div>
 </div><label class="booking-consent"><input id="bookingNoBirthTime" name="noBirthTime" type="checkbox"><span>ไม่ทราบเวลาเกิด</span></label>
 </section>
 <section class="booking-subcard"><h3>🔮 บริการและเรื่องที่ต้องการปรึกษา</h3>
 <div class="booking-grid">
 <div><label for="bookingService">บริการที่ต้องการ *</label><select id="bookingService" name="service" required><option value="">เลือกบริการ</option><option>ดวงบุคคล</option><option>เทพประจำตัว</option><option>โอเรกุรัม</option><option>ไพ่ทาโรต์ + รูน</option><option>RHD</option><option>ปรึกษาเรื่องเฉพาะด้าน</option><option>บริการอื่น ๆ</option></select></div>
 <div id="bookingConsultationCategoryField"><label for="bookingCategory">หมวดเรื่องที่ต้องการปรึกษา *</label><select id="bookingCategory" name="category" required><option value="">เลือกหมวดเรื่อง</option><option value="work">การงาน</option><option value="money">การเงิน</option><option value="health">สุขภาพ</option><option value="love">ความรัก</option><option value="interest">เรื่องที่สนใจ</option><option value="other">เรื่องอื่นๆ</option></select></div>
 <div class="booking-full" id="bookingConsultationTopicField"><label for="bookingTopic">รายละเอียดเรื่องที่ต้องการปรึกษา *</label><select id="bookingTopic" name="topic" required disabled><option value="">เลือกหมวดเรื่องก่อน</option></select></div>
 <div><label for="bookingDate">วันที่ต้องการจอง *</label><input id="bookingDate" name="date" type="date" required></div>
 <div><label for="bookingTime">เวลาที่ต้องการจอง *</label><input id="bookingTime" name="time" type="time" required></div>
 </div>
 <div><label for="bookingNote">รายละเอียดเพิ่มเติม (ไม่บังคับ)</label><textarea id="bookingNote" name="note" rows="3" maxlength="1000" placeholder="เล่ารายละเอียดเพิ่มเติมที่อยากให้ผู้ดูแลทราบ"></textarea></div>
 </section>
 <div class="booking-trap" aria-hidden="true"><label for="bookingWebsite">Website</label><input id="bookingWebsite" name="website" tabindex="-1" autocomplete="off"></div>
 <label class="booking-consent"><input id="bookingConsent" type="checkbox" required><span>ยินยอมให้ใช้ข้อมูลส่วนตัวและข้อมูลวันเกิดเพื่อดำเนินการจองคิวและให้บริการดูดวงตามที่เลือก *</span></label>
 <button id="bookingSubmit" class="btn-submit" type="submit">🐇 ส่งคำขอจองคิว</button>
 <p class="booking-privacy">ข้อมูลจะใช้เพื่อจัดการนัดหมายและติดต่อกลับเท่านั้น</p>
 <div id="bookingMessage" class="booking-message" role="status" aria-live="polite"></div>
 </form>
 <aside class="booking-line-cta"><div class="booking-line-icon">💚</div><div><h3>ส่งข้อมูลการจองทาง LINE</h3><p>หลังส่งคำขอสำเร็จ กรุณาบันทึกภาพหน้าจอที่แสดงเลขอ้างอิง แล้วส่งภาพดังกล่าวมาใน LINE เพื่อให้ผู้ดูแลตรวจสอบและยืนยันคิว</p><a class="line-cta-btn" href="https://lin.ee/ZMzIbrN" target="_blank" rel="noopener noreferrer">💚 แอดไลน์ Rabbitastro</a></div></aside>`;
 engine.appendChild(section);
 const categories={
  work:["โอกาสได้งานใหม่","เลื่อนขั้น","โอกาสปรับเปลี่ยนตำแหน่ง","การโยกย้าย"],
  money:["รายรับ/รายจ่าย","ปรับแผนลงทุน","ปลดหนี้สิน"],
  health:["สุขภาพโดยรวมและจุดที่ต้องระวัง","ตรวจสุขภาพ","ฟื้นฟูร่างกาย","ปรับพฤติกรรม"],
  love:["ภาพรวมความสัมพันธ์","ปรับความเข้าใจ","ตกลงความสัมพันธ์"],
  interest:["ไอเดียและทักษะที่ควรลงมือ","เริ่มงานใหม่","พัฒนาทักษะ","ตกผลึกไอเดีย"],
  other:["เรื่องที่รอคำตอบ","การตัดสินใจทั่วไป","เรื่องส่วนตัว"]
 };
 const otherServiceOptions={
  "ไพ่ยิปซี":["1 คำถาม","3 คำถาม","5 คำถาม","10 คำถาม"],
  "โหราศาสตร์":["ดวงกำเนิด","ดวงจร"],
  "เบอร์โทร":[]
 };
 const category=document.getElementById("bookingCategory"),topic=document.getElementById("bookingTopic");
 const categoryLabel=category.parentElement.querySelector("label"),topicLabel=topic.parentElement.querySelector("label");
 const service=document.getElementById("bookingService"),categoryField=document.getElementById("bookingConsultationCategoryField"),topicField=document.getElementById("bookingConsultationTopicField");
 function setCategoryOptions(options,placeholder){
  category.replaceChildren();
  const first=document.createElement("option");first.value="";first.textContent=placeholder;category.append(first);
  options.forEach(item=>{const option=document.createElement("option");option.value=item.value;option.textContent=item.label;category.append(option);});
 }
 function updateTopicOptions(){
  const isOtherService=service.value==="บริการอื่น ๆ";
  const selected=category.value;
  const options=isOtherService?(otherServiceOptions[selected]||[]):(categories[selected]||[]);
  topic.replaceChildren();
  const first=document.createElement("option");first.value="";first.textContent=selected?(isOtherService?"เลือกรูปแบบการดู":"เลือกรายละเอียดเรื่อง"):(isOtherService?"เลือกศาสตร์ที่ต้องการดู":"เลือกหมวดเรื่องก่อน");topic.append(first);
  options.forEach(label=>{const option=document.createElement("option");option.value=label;option.textContent=label;topic.append(option);});
  const hideTopic=isOtherService&&selected==="เบอร์โทร";
  topicField.style.display=hideTopic?"none":(isOtherService||category.value?"":"");
  topic.required=!hideTopic&&categoryField.style.display!=="none";
  topic.disabled=hideTopic||!selected||!options.length;
  if(hideTopic)topic.value="";
 }
 function updateConsultationFields(){
  const required=!["โอเรกุรัม","เทพประจำตัว"].includes(service.value);
  const isOtherService=service.value==="บริการอื่น ๆ";
  categoryField.style.display=required?"":"none";
  topicField.style.display=required?"":"none";
  category.required=required;
  categoryLabel.textContent=isOtherService?"ต้องการดูดวงด้วยศาสตร์ไหน *":"หมวดเรื่องที่ต้องการปรึกษา *";
  topicLabel.textContent=isOtherService?"ต้องการดูแบบไหน *":"รายละเอียดเรื่องที่ต้องการปรึกษา *";
  if(isOtherService){
   setCategoryOptions([
    {value:"ไพ่ยิปซี",label:"ไพ่ยิปซี"},
    {value:"โหราศาสตร์",label:"โหราศาสตร์"},
    {value:"เบอร์โทร",label:"เบอร์โทร"}
   ],"เลือกศาสตร์ที่ต้องการดู");
  }else{
   setCategoryOptions([
    {value:"work",label:"การงาน"},{value:"money",label:"การเงิน"},{value:"health",label:"สุขภาพ"},
    {value:"love",label:"ความรัก"},{value:"interest",label:"เรื่องที่สนใจ"},{value:"other",label:"เรื่องอื่นๆ"}
   ],"เลือกหมวดเรื่อง");
  }
  if(!required){
   category.value="";topic.replaceChildren();
   const option=document.createElement("option");option.value="";option.textContent="ไม่จำเป็นสำหรับบริการนี้";topic.append(option);
   topic.disabled=true;topic.required=false;
  }else updateTopicOptions();
 }
 service.addEventListener("change",updateConsultationFields);updateConsultationFields();
 category.addEventListener("change",updateTopicOptions);
 const noTime=document.getElementById("bookingNoBirthTime"),hour=document.getElementById("bookingBirthHour"),minute=document.getElementById("bookingBirthMinute");
 function updateBirthTime(){hour.disabled=noTime.checked;minute.disabled=noTime.checked;hour.required=!noTime.checked;minute.required=!noTime.checked;if(noTime.checked){hour.value="";minute.value="";}}
 noTime.addEventListener("change",updateBirthTime);updateBirthTime();
 const date=document.getElementById("bookingDate");
 const localNow=new Date(),today=new Date(localNow.getTime()-localNow.getTimezoneOffset()*60000).toISOString().slice(0,10);date.min=today;
 document.getElementById("bookingForm").addEventListener("submit",async function(e){
  e.preventDefault();const form=e.currentTarget,button=document.getElementById("bookingSubmit"),message=document.getElementById("bookingMessage");
  if(!form.reportValidity())return;
  const day=Number(form.elements.namedItem("birthDay").value),month=Number(form.elements.namedItem("birthMonth").value),year=Number(form.elements.namedItem("birthYear").value);
  const check=new Date(year,month-1,day);if(check.getFullYear()!==year||check.getMonth()!==month-1||check.getDate()!==day){message.className="booking-message error";message.textContent="กรุณาตรวจสอบวัน เดือน และปีเกิดให้ถูกต้อง";return;}
  const payload={firstName:form.elements.namedItem("firstName").value.trim(),lastName:form.elements.namedItem("lastName").value.trim(),phone:form.elements.namedItem("phone").value.trim(),lineId:form.elements.namedItem("lineId").value.trim(),birthDay:day,birthMonth:month,birthYear:year,birthHour:noTime.checked?"":hour.value,birthMinute:noTime.checked?"":minute.value,noBirthTime:noTime.checked,service:form.elements.namedItem("service").value,category:category.value?category.options[category.selectedIndex].text:"",topic:topic.value,date:form.elements.namedItem("date").value,time:form.elements.namedItem("time").value,note:form.elements.namedItem("note").value.trim(),website:form.elements.namedItem("website").value};
  button.disabled=true;button.textContent="กำลังส่งคำขอ…";message.className="booking-message";message.textContent="กำลังบันทึกคำขอจองคิว";
  try{
   const response=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.message||"ไม่สามารถส่งคำขอได้");
   message.className="booking-message success";
   message.textContent="บันทึกคำขอจองคิวเรียบร้อยแล้ว เลขอ้างอิง: "+result.bookingId+" กรุณาบันทึกภาพหน้าจอนี้และส่งมาใน LINE นี้ https://lin.ee/ZMzIbrN เพื่อให้ผู้ดูแลตรวจสอบและยืนยันคิว";
   form.reset();date.min=today;topic.disabled=true;topic.replaceChildren();const placeholder=document.createElement("option");placeholder.value="";placeholder.textContent="เลือกหมวดเรื่องก่อน";topic.append(placeholder);updateBirthTime();
  }catch(err){message.className="booking-message error";message.textContent=err.message||"เกิดข้อผิดพลาด กรุณาลองใหม่";}
  finally{button.disabled=false;button.textContent="🐇 ส่งคำขอจองคิว";}
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();