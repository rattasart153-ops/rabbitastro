
document.addEventListener("DOMContentLoaded", function () {
  var Engine = window.Horakratai;
  var resultsBox = document.getElementById("results");

  // ปรับภาษาคำทำนายของทุก Engine ให้เป็นภาษาคนที่อ่านง่าย อบอุ่น และเข้าใจได้ทันที
  // ทำกับ text node เท่านั้น จึงไม่กระทบโครงสร้าง HTML สูตรคำนวณ หรือรหัสคำทำนาย
  function simplifyPredictionText(text) {
    if (text == null) return '';
    return String(text)
      // ภาษาที่ใช้ร่วมกันทุก Engine ยกเว้น Engine 2: เน้นคำธรรมดา อ่านแล้วเข้าใจทันที
      .replace(/เจ้าชะตา/g, 'คุณ')
      .replace(/ดวงชะตา/g, 'ภาพรวมชีวิต')
      .replace(/ชะตากรรม/g, 'เส้นทางชีวิต')
      .replace(/พึงระวัง/g, 'ลองระวังเรื่องนี้เป็นพิเศษ')
      .replace(/พึงกระทำ/g, 'สิ่งที่ลองทำได้คือ')
      .replace(/มีเกณฑ์/g, 'มีแนวโน้ม')
      .replace(/สมประสงค์/g, 'ได้อย่างที่หวัง')
      .replace(/เกื้อหนุน/g, 'ช่วยสนับสนุน')
      .replace(/บั่นทอน/g, 'ทำให้เหนื่อยใจ')
      .replace(/บริวาร/g, 'คนรอบตัว')
      .replace(/มิตรสหาย/g, 'เพื่อนและคนรอบตัว')
      .replace(/ศัตรูคู่แข่ง/g, 'คู่แข่งหรือคนที่เห็นต่าง')
      .replace(/ลาภผลเงินทอง/g, 'รายรับและโอกาสทางการเงิน')
      .replace(/อสังหาริมทรัพย์/g, 'บ้านหรือที่ดิน')
      .replace(/โดยพลัน/g, 'อย่างรวดเร็ว')
      .replace(/อันควร/g, 'ที่เหมาะสม')
      .replace(/พึงตระหนักว่า/g, 'อยากให้จำไว้ว่านะ')
      .replace(/จงระวัง/g, 'ลองใส่ใจเรื่องนี้เป็นพิเศษ')
      .replace(/จง/g, 'ลอง')
      .replace(/ท่าน/g, 'คุณ')
      .replace(/พึง/g, 'ควร')
      .replace(/ประสบความสำเร็จ/g, 'ทำสิ่งที่ตั้งใจได้สำเร็จ')
      .replace(/พิจารณาโดยละเอียด/g, 'ลองดูให้ชัดเจน')
      .replace(/ตรวจสอบข้อเท็จจริง/g, 'เช็กข้อมูลจริง')
      .replace(/ดำเนินการ/g, 'ลงมือทำ')
      .replace(/ดำเนินชีวิต/g, 'ใช้ชีวิต')
      .replace(/อย่างหลีกเลี่ยงไม่ได้/g, 'ซึ่งอาจเกิดขึ้นได้')
      .replace(/ในระยะนี้/g, 'ในช่วงนี้')
      .replace(/ในอนาคตอันใกล้/g, 'ในช่วงต่อจากนี้')
      .replace(/โดยสรุป/g, 'สรุปง่าย ๆ คือ')
      .replace(/อย่างไรก็ตาม/g, 'แต่ถึงอย่างนั้น')
      .replace(/ในทางกลับกัน/g, 'ในอีกมุมหนึ่ง')
      .replace(/ควรพิจารณา/g, 'ลองคิดดู')
      .replace(/ควรใช้ความระมัดระวัง/g, 'ค่อย ๆ ทำอย่างรอบคอบนะ')
      .replace(/ไม่ควรละเลย/g, 'อย่ามองข้าม')
      .replace(/หากเกิดปัญหา/g, 'ถ้ามีเรื่องติดขัด')
      .replace(/หากมีข้อสงสัย/g, 'ถ้ายังไม่แน่ใจ')
      .replace(/เจ้าชะตา/g, 'คุณ')
      .replace(/ดวงชะตา/g, 'ภาพรวมชีวิต')
      .replace(/ชะตากรรม/g, 'เส้นทางชีวิต')
      .replace(/มีเกณฑ์/g, 'มีแนวโน้ม')
      .replace(/พึงระวัง/g, 'ควรระวัง')
      .replace(/พึงกระทำ/g, 'ควรทำ')
      .replace(/สมประสงค์/g, 'ได้ตามที่หวัง')
      .replace(/เกื้อหนุน/g, 'ช่วยส่งเสริม')
      .replace(/บั่นทอน/g, 'ทำให้เหนื่อยหรือเสียกำลังใจ')
      .replace(/อุปสรรคขัดขวาง/g, 'สิ่งที่ทำให้ติดขัด')
      .replace(/บริวาร/g, 'คนในทีม')
      .replace(/มิตรสหาย/g, 'เพื่อนและคนรอบตัว')
      .replace(/ศัตรูคู่แข่ง/g, 'คู่แข่งหรือคนที่เห็นต่าง')
      .replace(/ลาภผลเงินทอง/g, 'รายรับและโอกาสทางการเงิน')
      .replace(/ลาภลอย/g, 'เงินหรือโอกาสที่เข้ามาโดยไม่คาดคิด')
      .replace(/อสังหาริมทรัพย์/g, 'บ้านและที่ดิน')
      .replace(/ข้อพิพาท/g, 'ความขัดแย้ง')
      .replace(/การเจรจาต่อรอง/g, 'การพูดคุยตกลงกัน')
      .replace(/โดยพลัน/g, 'อย่างรวดเร็ว')
      .replace(/อันควร/g, 'ที่เหมาะสม')
      .replace(/นอบน้อม/g, 'สุภาพและให้เกียรติ')
      .replace(/คลี่คลายลง/g, 'เริ่มดีขึ้น')
      .replace(/ยืดเยื้อ/g, 'ลากยาว')
      .replace(/พิจารณาโดยละเอียด/g, 'ตรวจดูให้ชัดเจน')
      .replace(/ตรวจสอบให้ละเอียด/g, 'ตรวจดูให้ครบ')
      .replace(/ตรวจสอบข้อเท็จจริง/g, 'เช็กข้อมูลจริง')
      .replace(/วางแผนอย่างรอบคอบ/g, 'วางแผนให้รอบด้าน')
      .replace(/ผูกพันระยะยาว/g, 'ผูกพันกันในระยะยาว')
      .replace(/เก็บเกี่ยวผลลัพธ์/g, 'เห็นผลจากสิ่งที่ทำไว้')
      .replace(/จุดชี้ขาด/g, 'เรื่องสำคัญที่ควรตัดสินใจ')
      .replace(/กรอบเวลา/g, 'ช่วงเวลา')
      .replace(/สัญญาณบอกเหตุ/g, 'สิ่งที่ควรสังเกต')
      .replace(/แก่นของคำทำนาย/g, 'ใจความสำคัญ')
      .replace(/พลังงาน/g, 'แรงใจและกำลัง')
      .replace(/ศักยภาพ/g, 'ความสามารถที่มี')
      .replace(/บูรณาการ/g, 'นำมาปรับใช้ร่วมกัน')
      .replace(/สถานการณ์/g, 'สถานการณ์')
      .replace(/ยกระดับ/g, 'พัฒนาให้ดีขึ้น')
      .replace(/ดำเนินการ/g, 'ลงมือทำ')
      .replace(/กะผล/g, 'ดูผลที่เกิดขึ้น')
      .replace(/กำหนดทิศทาง/g, 'เลือกทางที่จะไป')
      .replace(/ความสัมพันธ์เชิงลึก/g, 'ความสัมพันธ์ที่เข้าใจกันมากขึ้น')
      .replace(/อย่าตีความว่า/g, 'อย่าเพิ่งคิดว่า')
      .replace(/จงระวัง/g, 'ลองใส่ใจเป็นพิเศษกับ')
      .replace(/ต้องระวัง/g, 'ควรดูแลเรื่องนี้ให้ดี')
      .replace(/ปัญหาและอุปสรรค/g, 'เรื่องที่อาจทำให้เหนื่อยใจ')
      .replace(/ความล้มเหลว/g, 'สิ่งที่ยังไม่เป็นไปตามหวัง')
      .replace(/พ่ายแพ้/g, 'ยังไม่ได้ผลอย่างที่ตั้งใจ')
      .replace(/สูญเสีย/g, 'อาจต้องปล่อยบางอย่างไป')
      .replace(/เคราะห์กรรม/g, 'ช่วงเวลาที่ท้าทาย')
      .replace(/โชคร้าย/g, 'เรื่องที่ไม่เป็นไปตามแผน')
      .replace(/ห้ามเด็ดขาด/g, 'ควรหลีกเลี่ยงอย่างยิ่ง')
      .replace(/จำเป็นต้อง/g, 'อาจต้อง')
      .replace(/อย่างหลีกเลี่ยงไม่ได้/g, 'ซึ่งอาจเกิดขึ้นได้')
      .replace(/ผลสำเร็จจะเกิดขึ้น/g, 'คุณมีโอกาสเห็นความคืบหน้า')
      .replace(/ความสำเร็จ/g, 'ความก้าวหน้า')
      .replace(/จงเชื่อมั่นในตนเอง/g, 'ค่อย ๆ เชื่อมั่นในตัวเองนะ')
      .replace(/อย่าท้อถอย/g, 'อย่าเพิ่งหมดกำลังใจนะ')
      .replace(/อดทนอดกลั้น/g, 'ค่อย ๆ ตั้งหลักและให้เวลากับตัวเอง')
      .replace(/ใช้สติปัญญาไตร่ตรอง/g, 'ค่อย ๆ คิดและดูข้อมูลให้รอบด้าน')
      .replace(/ตัดสินใจโดยเด็ดขาด/g, 'ตัดสินใจเมื่อคุณพร้อมและเห็นข้อมูลชัดเจน')
      .replace(/จะมีเหตุ/g, 'อาจมีเรื่อง')
      .replace(/เป็นลางบอกเหตุ/g, 'เป็นสิ่งที่ชวนให้สังเกต')
      .replace(/อันตราย/g, 'ความเสี่ยง')
      .replace(/ความขัดแย้ง/g, 'ความเห็นที่ไม่ตรงกัน')
      .replace(/ควบคุมอารมณ์/g, 'ดูแลอารมณ์ของตัวเอง')
      .replace(/เผชิญปัญหา/g, 'ค่อย ๆ รับมือกับเรื่องที่เกิดขึ้น')
      .replace(/อย่าประมาท/g, 'ค่อย ๆ ทำอย่างรอบคอบนะ')
      .replace(/ในระยะนี้/g, 'ในช่วงนี้')
      .replace(/ในอนาคตอันใกล้/g, 'ในช่วงต่อจากนี้')
      .replace(/โดยสรุป/g, 'สรุปง่าย ๆ คือ')
      .replace(/จง/g, 'ลอง')
      .replace(/ท่าน/g, 'คุณ')
      .replace(/พึง/g, 'ควร')
      .replace(/อาจประสบกับ/g, 'อาจพบ')
      .replace(/ประสบความสำเร็จ/g, 'ทำสิ่งที่ตั้งใจได้สำเร็จ')
      .replace(/ควรใช้ความระมัดระวัง/g, 'ค่อย ๆ ทำอย่างรอบคอบนะ')
      .replace(/ควรให้ความสำคัญกับ/g, 'ลองใส่ใจ')
      .replace(/ควรหลีกเลี่ยงการ/g, 'พยายามเลี่ยงการ')
      .replace(/ส่งผลกระทบต่อ/g, 'มีผลกับ')
      .replace(/มีความเป็นไปได้ว่า/g, 'อาจเป็นไปได้ว่า')
      .replace(/ในช่วงเวลาดังกล่าว/g, 'ในช่วงนั้น')
      .replace(/ดังนั้น/g, 'เพราะฉะนั้น')
      .replace(/อย่างไรก็ตาม/g, 'แต่ถึงอย่างนั้น')
      .replace(/ในทางกลับกัน/g, 'ในอีกมุมหนึ่ง')
      .replace(/พึงตระหนักว่า/g, 'อยากให้จำไว้ว่านะ')
      .replace(/อย่าลืมว่า/g, 'อยากให้จำไว้นะว่า')
      .replace(/คุณควร/g, 'คุณอาจลอง')
      .replace(/จำไว้ว่าคุณ/g, 'อยากให้คุณจำไว้นะว่า')
      .replace(/ไม่ควรละเลย/g, 'อย่ามองข้าม')
      .replace(/หากเกิดปัญหา/g, 'ถ้ามีเรื่องติดขัด')
      .replace(/หากมีข้อสงสัย/g, 'ถ้ายังไม่แน่ใจ')
      .replace(/ให้ดำเนินการ/g, 'ลองลงมือทำ')
      .replace(/ควรพิจารณา/g, 'ลองคิดดู')
      .replace(/ควรตระหนัก/g, 'อยากให้ใส่ใจ')
      .replace(/อย่ากดดันตัวเอง/g, 'ไม่ต้องกดดันตัวเองมากนะ')
      .replace(/ให้กำลังใจตนเอง/g, 'ให้กำลังใจตัวเองด้วยนะ')
      .replace(/ค่อยเป็นค่อยไป/g, 'ค่อย ๆ ทำไปทีละขั้นนะ')
      // คำเฉพาะทางโหราศาสตร์และคำที่มักอ่านยาก: แปลเป็นภาษาทั่วไป
      .replace(/ลัคนาราศี/g, 'ราศีที่ขึ้นในเวลาเกิด')
      .replace(/ลัคนา/g, 'ราศีที่ขึ้นในเวลาเกิด')
      .replace(/เรือนชะตา|ภพชะตา/g, 'ด้านต่าง ๆ ของชีวิต')
      .replace(/กดุมภะ/g, 'เรื่องการเงิน')
      .replace(/สหัชชะ/g, 'การสื่อสารและคนใกล้ตัว')
      .replace(/พันธุ/g, 'บ้านและครอบครัว')
      .replace(/ปุตตะ/g, 'ความคิดสร้างสรรค์และสิ่งที่รัก')
      .replace(/อริ/g, 'ปัญหาและคู่แข่ง')
      .replace(/ปัตนิ/g, 'ความรักและคู่ครอง')
      .replace(/มรณะ/g, 'การเปลี่ยนแปลงครั้งใหญ่')
      .replace(/ศุภะ/g, 'การเรียนรู้และโอกาสใหม่')
      .replace(/กัมมะ/g, 'การงาน')
      .replace(/ลาภะ/g, 'รายได้และผลประโยชน์')
      .replace(/วินาศ/g, 'เรื่องที่ต้องระวังหรือปล่อยวาง')
      .replace(/ตนุ/g, 'ตัวตน')
      .replace(/ธาตุเจ้าเรือน/g, 'ธาตุพื้นฐานประจำตัว')
      .replace(/ดาวเสวยอายุ/g, 'ดาวที่ส่งผลกับช่วงวัยนี้')
      .replace(/ดาวจร/g, 'ตำแหน่งดาวในช่วงนี้')
      .replace(/ดาวเดิม/g, 'ตำแหน่งดาวตอนเกิด')
      .replace(/ตรีโกณ/g, 'มุมที่ส่งเสริมกัน')
      .replace(/เล็งกัน/g, 'อยู่ตรงข้ามกัน')
      .replace(/กุมกัน/g, 'อยู่ร่วมตำแหน่งเดียวกัน')
      .replace(/ทักษา|มหาทักษา/g, 'หลักดูดาวตามวันเกิด')
      .replace(/นวางค์|ตรียางค์/g, 'ส่วนย่อยของดวงกำเนิด')
      .replace(/โยคเกณฑ์/g, 'ความเกี่ยวข้องระหว่างตำแหน่งดาว')
      .replace(/เกษตร/g, 'ตำแหน่งที่ดาวมีกำลังดี')
      .replace(/อุจจ์/g, 'ตำแหน่งที่ดาวส่งเสริม')
      .replace(/นิจ/g, 'ตำแหน่งที่ดาวมีกำลังน้อย')
      .replace(/ประเกษตร/g, 'ตำแหน่งที่ดาวต้องใช้ความพยายาม')
      .replace(/พักร์/g, 'เคลื่อนถอยหลัง')
      .replace(/มุมสัมพันธ์/g, 'ความเกี่ยวข้องระหว่างตำแหน่งดาว')
      .replace(/อุปถัมภ์|อุปการะ/g, 'การช่วยเหลือ')
      .replace(/เกียรติยศชื่อเสียง/g, 'ชื่อเสียงและการยอมรับ')
      .replace(/มหาโชค/g, 'โอกาสดี')
      .replace(/วาสนา/g, 'โอกาสและพื้นฐานชีวิต')
      .replace(/สัมพันธภาพ/g, 'ความสัมพันธ์')
      .replace(/สัมพันธไมตรี/g, 'ความสัมพันธ์ที่ดี')
      .replace(/นัยสำคัญ/g, 'ความหมายสำคัญ')
      .replace(/ภาวะวิกฤต/g, 'ช่วงที่มีปัญหาหนัก')
      .replace(/ประเด็นละเอียดอ่อน/g, 'เรื่องที่ต้องค่อย ๆ พูดคุย')
      .replace(/ปัจจัยเกื้อหนุน/g, 'สิ่งที่ช่วยให้เรื่องต่าง ๆ ดีขึ้น')
      .replace(/ขัดเกลาตนเอง/g, 'ปรับตัวและพัฒนาตัวเอง')
      .replace(/บรรลุเป้าหมาย/g, 'ทำสิ่งที่ตั้งใจให้สำเร็จ')
      .replace(/เผชิญบททดสอบ/g, 'เจอเรื่องที่ต้องเรียนรู้')
      .replace(/เสริมสร้างความมั่นคง/g, 'ทำให้ชีวิตมั่นคงขึ้น');
  }

  function simplifyPredictionOutput(root) {
    if (!root || !document.createTreeWalker) return;
    var title = root.querySelector ? root.querySelector('.card-title') : null;
    var titleText = title ? (title.textContent || '') : '';
    // Engine 2 มีน้ำเสียงเฉพาะขององค์เทพ จึงคงข้อความเดิมทั้งหมด
    if (/คำทำนายมูเทพ|เทพองค์นี้อยากจะบอกอะไรกับคุณ|ข้อความจากองค์เทพ/i.test(titleText)) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (textNode) {
      var updated = simplifyPredictionText(textNode.nodeValue);
      if (updated !== textNode.nodeValue) textNode.nodeValue = updated;
    });
  }

  // ไม่เฝ้าดู DOM ตลอดเวลา เพราะผลคำทำนายมีข้อความจำนวนมาก
  // ปรับภาษาแบบครั้งเดียวตอนสร้างผลลัพธ์ใน improvePredictionReadability()


  var ogSelect = document.getElementById("oreguramQuestion");
  if (ogSelect && Engine && Array.isArray(Engine.OREGURAM_QUESTIONS)) {
    // จัดคำถามตามหมวดหมู่ที่กำหนดในข้อมูลแต่ละข้อโดยตรง
    if (ogSelect.options.length <= 1) {
      if (ogSelect.options.length === 1 && !ogSelect.options[0].value) ogSelect.remove(0);
      var OREGURAM_UI_GROUPS = [
        { key: "work", label: "💼 การงาน" },
        { key: "money", label: "💰 การเงิน" },
        { key: "love", label: "❤️ ความรัก" },
        { key: "health", label: "🌿 สุขภาพ" },
        { key: "interest", label: "✨ เรื่องที่สนใจและการพัฒนาตัวเอง" },
        { key: "other", label: "🧭 เรื่องอื่นๆ" }
      ];
      OREGURAM_UI_GROUPS.forEach(function (group) {
        var items = Engine.OREGURAM_QUESTIONS.filter(function (item) { return item.cat === group.key; });
        if (!items.length) return;
        var optgroup = document.createElement("optgroup");
        optgroup.label = group.label + " · " + items.length + " คำถาม";
        items.forEach(function (q) {
          var opt = document.createElement("option");
          opt.value = String(q.id);
          opt.innerText = q.text;
          optgroup.appendChild(opt);
        });
        ogSelect.appendChild(optgroup);
      });
    }
    // ทุกครั้งที่เปลี่ยนคำถาม ให้ถือว่าผลเดิมหมดอายุทันที
    // เพื่อป้องกันไม่ให้หน้าจอแสดงคำทำนายของข้อก่อนหน้า
    ogSelect.addEventListener("change", function () {
      ogSelect.setAttribute("data-current-question", String(parseInt(ogSelect.value, 10) || 1));
      if (resultsBox) {
        resultsBox.style.display = "none";
        resultsBox.innerHTML = "";
      }
    });
    ogSelect.setAttribute("data-current-question", String(parseInt(ogSelect.value, 10) || 1));
  }

  function renderDailyElement() {
    var box = document.getElementById("dailyElementBox");
    if (!box) return;
    try {
      var dailyRes = Engine.calcDailyElement(new Date());
      var elem = dailyRes.element || Engine.getElement(5);
      var rabbit = dailyRes.rabbit || {name:"-"};
      document.getElementById("dailyDateText").innerText = dailyRes.dateText || "-";
      document.getElementById("dailyElementVal").innerText = "ธาตุ" + (elem.name || "ดิน") + " (" + (elem.symbol || "⛰️") + ")";
      document.getElementById("dailyElementIcon").innerText = elem.symbol || "⛰️";
      document.getElementById("dailyElementDesc").innerText = "🐇 กระต่ายเลข " + dailyRes.finalNum + " (" + rabbit.name + ")   " + (elem.story || "") + " · จุดเด่น: " + (elem.good || "");
      document.getElementById("dailyElementWarn").innerText = "⚠️ ดูแลเรื่องนี้อย่างอ่อนโยน: " + (elem.bad || "");
      document.getElementById("dailyElementSuggest").innerText = elem.good || "";
      box.classList.remove("card-elem-น้ำ", "card-elem-ไฟ", "card-elem-ไม้", "card-elem-เหล็ก", "card-elem-ดิน", "card-elem-ทอง");
      box.classList.add("card-elem-" + (elem.name || "ดิน"));
      box.style.display = "";
    } catch (e) {
      console.error("renderDailyElement:", e);
      document.getElementById("dailyElementVal").innerText = "ไม่สามารถคำนวณธาตุประจำวันได้";
      document.getElementById("dailyElementDesc").innerText = "กรุณาลองโหลดหน้าใหม่อีกครั้ง";
    }
  }
  renderDailyElement();

  var tabs = {
    tabPerson: document.getElementById("enginePerson"),
    tabGod: document.getElementById("engineGod"),
    tabOreguram: document.getElementById("engineOreguram"),
    tabTarotRune: document.getElementById("engineTarotRune"),
    tabBooking: document.getElementById("engineBooking")
  };
  var tabBtns = {
    tabPerson: document.getElementById("tabPerson"),
    tabGod: document.getElementById("tabGod"),
    tabOreguram: document.getElementById("tabOreguram"),
    tabTarotRune: document.getElementById("tabTarotRune"),
    tabBooking: document.getElementById("tabBooking")
  };

  // ---------- ฟอร์มข้อมูลร่วม: กรอกครั้งเดียว ใช้ได้ทุกแท็บ ----------
  function readSharedInputs() {
    function val(id){ var el=document.getElementById(id); return el ? String(el.value || "").trim() : ""; }
    var noTimeEl=document.getElementById("noBirthTime");
    return {
      fName: val("fName"), fLast: val("fLast"), bDay: val("bDay"), bMonth: val("bMonth"),
      bYear: val("bYear"), bHour: val("bHour"), bMin: val("bMin"),
      noBirthTime: !!(noTimeEl && noTimeEl.checked),
      habitNumber: val("rhdHabitNumber") || "1"
    };
  }

  function isSharedComplete(d) {
    return !!(d.fName && d.fLast && d.bDay && d.bMonth && d.bYear);
  }

  // แสดงผลของแท็บที่กำลังเปิดอยู่ โดยดึงข้อมูลจากฟอร์มร่วม (ไม่ต้องกรอกซ้ำ)
  function activeTabId() {
    if (tabs.tabGod && tabs.tabGod.style.display === "block") return "tabGod";
    if (tabs.tabOreguram && tabs.tabOreguram.style.display === "block") return "tabOreguram";
    if (tabs.tabTarotRune && tabs.tabTarotRune.style.display === "block") return "tabTarotRune";
    if (tabs.tabBooking && tabs.tabBooking.style.display === "block") return "tabBooking";
    return "tabPerson";
  }

  function showResultFor(activeId, fromButton) {
    var data = readSharedInputs();
    if (!isSharedComplete(data)) {
      if (fromButton) alert("กรุณากรอกชื่อ-นามสกุล และวัน เดือน ปีเกิด ให้ครบก่อนคำนวณค่ะ");
      return false;
    }
    if (activeId === "tabPerson") return renderPersonResult(data, fromButton);
    if (activeId === "tabGod") return renderGodResult(data, fromButton);
    if (activeId === "tabTarotRune") return renderTarotRuneStandaloneResult(data, fromButton);
    return renderOreguramResult(data, fromButton);
  }

  function switchTab(activeId) {
    var sharedForm = document.getElementById("sharedForm");
    var dailyElement = document.getElementById("dailyElementBox");
    var references = document.querySelector(".refs");
    if (sharedForm) sharedForm.style.display = activeId === "tabBooking" ? "none" : "";
    if (dailyElement) dailyElement.style.display = activeId === "tabBooking" ? "none" : "";
    if (references) references.style.display = activeId === "tabBooking" ? "none" : "";
    Object.keys(tabs).forEach(function (key) {
      if (key === activeId) {
        tabs[key].style.display = "block";
        tabBtns[key].classList.add("active");
      } else {
        tabs[key].style.display = "none";
        tabBtns[key].classList.remove("active");
      }
    });
    // เมื่อเปลี่ยน Engine ให้ย้อนกลับไปด้านบนทุกครั้ง
    // ฟอร์มข้อมูลร่วมจะไม่ถูกล้างหรือเปลี่ยนแปลง ยังคงข้อมูลเดิมตามที่ผู้ใช้กรอกไว้
    if (resultsBox) {
      resultsBox.style.display = "none";
      resultsBox.innerHTML = "";
    }
  }

  if (tabBtns.tabPerson) tabBtns.tabPerson.addEventListener("click", function () { switchTab("tabPerson"); });
  if (tabBtns.tabGod) tabBtns.tabGod.addEventListener("click", function () { switchTab("tabGod"); });
  if (tabBtns.tabOreguram) tabBtns.tabOreguram.addEventListener("click", function () { switchTab("tabOreguram"); });
  if (tabBtns.tabTarotRune) tabBtns.tabTarotRune.addEventListener("click", function () { switchTab("tabTarotRune"); });
  if (tabBtns.tabBooking) tabBtns.tabBooking.addEventListener("click", function () { switchTab("tabBooking"); });

  // แต่ละแถบเลือกได้ทีละส่วน และแสดงผลเฉพาะส่วนนั้นเพียงอย่างเดียว
  var currentBaseView = "natal";
  var currentTopicView = "short";
  function bindViewGroup(sel, assign) {
    document.querySelectorAll(sel + " .chip-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var noTimeInput = document.getElementById('noBirthTime');
        if (sel === '#baseViewGroup' && btn.getAttribute('data-view') === 'asc' && noTimeInput && noTimeInput.checked) return;
        document.querySelectorAll(sel + " .chip-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        assign(btn.getAttribute("data-view"));
        if (resultsBox) { resultsBox.style.display = "none"; resultsBox.innerHTML = ""; }
          });
    });
  }
  bindViewGroup("#baseViewGroup", function (v) { currentBaseView = v; });
  bindViewGroup("#topicViewGroup", function (v) { currentTopicView = v; });

  // เมื่อเลือกไม่ทราบเวลาเกิด ให้ปิดช่องเวลาเกิดทันที และไม่ให้เลือกคำนวณลัคนา
  function updateBirthTimeAvailability() {
    var noTime = document.getElementById('noBirthTime');
    var hourInput = document.getElementById('bHour');
    var minInput = document.getElementById('bMin');
    var ascButton = document.querySelector('#baseViewGroup [data-view="asc"]');
    var disabled = !!(noTime && noTime.checked);
    [hourInput, minInput].forEach(function (el) {
      if (!el) return;
      el.disabled = disabled;
      el.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      if (disabled) el.value = '';
    });
    if (ascButton) {
      ascButton.style.opacity = disabled ? '0.45' : '';
      ascButton.style.cursor = disabled ? 'not-allowed' : '';
      ascButton.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      if (disabled && currentBaseView === 'asc') {
        currentBaseView = 'natal';
        document.querySelectorAll('#baseViewGroup .chip-btn').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-view') === 'natal');
        });
      }
    }
    if (disabled && resultsBox && resultsBox.style.display === 'block') {
      showResultFor(activeTabId(), false);
    }
  }
  var noBirthTimeCheckbox = document.getElementById('noBirthTime');
  if (noBirthTimeCheckbox) {
    noBirthTimeCheckbox.addEventListener('change', updateBirthTimeAvailability);
    updateBirthTimeAvailability();
  }

  // โหมดการทำนาย: แถบฟีเจอร์ของ "พื้นดวง" กับ "เรื่องที่ต้องการ" แยกกันคนละชุด
  var currentMode = "base";
  function applyMode(mode) {
    currentMode = mode;
    var baseBar = document.getElementById("baseBar");
    var topicBar = document.getElementById("topicBar");
    if (baseBar) baseBar.style.display = (mode === "base") ? "block" : "none";
    if (topicBar) topicBar.style.display = (mode === "topic") ? "block" : "none";
    // ถ้ามีผลคำทำนายค้างอยู่แล้ว ให้คำนวณใหม่ทันทีตามโหมดที่เลือก
    if (resultsBox && resultsBox.style.display === "block") {
      showResultFor(activeTabId(), false);
    }
  }
  document.querySelectorAll("#modeGroup .chip-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#modeGroup .chip-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      applyMode(btn.getAttribute("data-mode"));
      if (resultsBox) { resultsBox.style.display = "none"; resultsBox.innerHTML = ""; }
      });
  });
  // ตั้งค่า UI เริ่มต้นโดยยังไม่คำนวณผลล่วงหน้า
  // ป้องกันการเรียก renderer ก่อนชุดคำทำนายเชิงลึกด้านล่างจะถูกประกาศครบ
  (function () {
    var baseBar = document.getElementById("baseBar");
    var topicBar = document.getElementById("topicBar");
    if (baseBar) baseBar.style.display = "block";
    if (topicBar) topicBar.style.display = "none";
  })();

  var currentCategory = "work";
  var currentSubKey = 1;

  // เลือกเรื่องย่อยเริ่มต้นของแต่ละหมวด: ใช้เรื่องยอดฮิตก่อน ถ้าไม่มีจึงใช้คีย์แรก
  function firstSubKey(cat) {
    var obj = Engine.SHORT_CATEGORIES[cat];
    if (!obj) return 1;
    var hot = Engine.HOT_TOPICS[cat];
    if (hot && obj.subs[hot.num]) return hot.num;
    var keys = Object.keys(obj.subs).map(function (k) { return parseInt(k, 10); }).sort(function (a, b) { return a - b; });
    return keys.length ? keys[0] : 1;
  }

  function renderSubTopics(cat) {
    var subWrap = document.getElementById("subTopicGroup");
    subWrap.innerHTML = "";
    var catObj = Engine.SHORT_CATEGORIES[cat];
    if (!catObj) return;

    Object.keys(catObj.subs).forEach(function (k) {
      var sub = catObj.subs[k];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-btn-sub" + (parseInt(k, 10) === currentSubKey ? " active" : "");
      if (sub.hot) {
        btn.innerText = sub.n;
      } else {
        btn.innerText = sub.n;
      }
      btn.addEventListener("click", function () {
        document.querySelectorAll(".chip-btn-sub").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentSubKey = parseInt(k, 10);
        if (resultsBox) {
          resultsBox.style.display = "none";
          resultsBox.innerHTML = "";
        }
        // เปลี่ยนหัวข้อย่อยโดยคงตำแหน่งหน้าจอเดิมไว้
        });
      subWrap.appendChild(btn);
    });
  }
  currentSubKey = firstSubKey(currentCategory);
  renderSubTopics(currentCategory);

  document.querySelectorAll("#catGroup .chip-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#catGroup .chip-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-cat");
      currentSubKey = firstSubKey(currentCategory);
      renderSubTopics(currentCategory);
      if (resultsBox) {
        resultsBox.style.display = "none";
        resultsBox.innerHTML = "";
      }
      // เปลี่ยนหมวดเรื่องที่ต้องการดูโดยไม่เลื่อนหน้าจอกลับด้านบน
    });
  });


  // Escape ข้อความทุกชนิดก่อนนำไปประกอบ HTML; ไม่ใช้แทน HTML sanitizer สำหรับ markup ทั้งก้อน
  // Sanitizer สำหรับ markup ที่ประกอบจาก datasets/ผลคำนวณ: allowlist tags, attributes และ CSS properties เท่านั้น
  function sanitizeHTML(markup) {
    var source = String(markup == null ? '' : markup);
    if (typeof DOMParser === 'undefined') return escapeHTML(source);
    var parsed = new DOMParser().parseFromString(source, 'text/html');
    var allowedTags = 'A B BLOCKQUOTE BR CODE DIV EM H3 H4 H5 I LI OL P SECTION SMALL SPAN STRONG SUB SUP TABLE TBODY TD TH THEAD TR U UL'.split(' ');
    var blockedTags = ['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','MATH','FORM','INPUT','BUTTON','META','LINK','BASE'];
    var allowedStyles = 'background background-color border border-color border-left border-left-color border-left-style border-left-width border-radius border-style border-width color display flex flex-direction font-size font-style font-weight gap grid-template-columns justify-content align-items line-height margin margin-top margin-bottom margin-left margin-right max-width min-width overflow-wrap padding padding-left padding-right padding-top padding-bottom text-align vertical-align white-space'.split(' ');
    function clean(parent) {
      Array.prototype.slice.call(parent.childNodes).forEach(function(node) {
        if (node.nodeType === 8) { parent.removeChild(node); return; }
        if (node.nodeType !== 1) return;
        var tag = node.tagName;
        if (blockedTags.indexOf(tag) !== -1) { parent.removeChild(node); return; }
        if (allowedTags.indexOf(tag) === -1) {
          clean(node);
          while (node.firstChild) parent.insertBefore(node.firstChild, node);
          parent.removeChild(node);
          return;
        }
        Array.prototype.slice.call(node.attributes).forEach(function(attr) {
          var name = attr.name.toLowerCase(), value = attr.value;
          if (name === 'class') {
            var safeClass = value.replace(/[^a-zA-Z0-9ก-๙_ -]/g, '').trim();
            if (safeClass) node.setAttribute('class', safeClass); else node.removeAttribute('class');
          } else if (name === 'style') {
            var declarations = [];
            value.split(';').forEach(function(part) {
              var splitAt = part.indexOf(':');
              if (splitAt < 1) return;
              var prop = part.slice(0, splitAt).trim().toLowerCase();
              var val = part.slice(splitAt + 1).trim();
              if (allowedStyles.indexOf(prop) === -1 || !val || /url\s*\(|expression|javascript:|@import|behavior|binding|[<>\\]/i.test(val)) return;
              declarations.push(prop + ':' + val);
            });
            if (declarations.length) node.setAttribute('style', declarations.join(';')); else node.removeAttribute('style');
          } else if (name === 'href' && tag === 'A') {
            var trimmed = value.trim();
            if (!/^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(trimmed)) node.removeAttribute(name);
          } else if (name === 'target' && tag === 'A') {
            if (value !== '_blank' && value !== '_self') node.removeAttribute(name);
          } else if (name === 'rel' && tag === 'A') {
            node.setAttribute('rel', 'noopener noreferrer');
          } else if (['title','role','aria-label','colspan','rowspan','scope'].indexOf(name) !== -1) {
            if ((name === 'colspan' || name === 'rowspan') && !/^\d{1,2}$/.test(value)) node.removeAttribute(name);
          } else {
            node.removeAttribute(name);
          }
        });
        if (tag === 'A' && node.getAttribute('target') === '_blank') node.setAttribute('rel', 'noopener noreferrer');
        clean(node);
      });
    }
    clean(parsed.body);
    return parsed.body.innerHTML;
  }

  function setSafeHTML(target, markup) {
    if (target) target.innerHTML = sanitizeHTML(markup);
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ---------- ส่วนประกอบ HTML ที่ใช้ร่วมกันทุก engine ----------
  function tileHtml(k, v, desc, hl) {
    return '<div class="num-tile' + (hl ? ' hl' : '') + '">' +
      '<div class="k">' + sanitizeHTML(k) + '</div>' +
      '<div class="v">' + sanitizeHTML(v) + '</div>' +
      (desc ? '<div class="desc">' + sanitizeHTML(desc) + '</div>' : '') +
      '</div>';
  }

  function elementTag(element) {
    element = element || {};
    var name = String(element.name == null ? '' : element.name);
    var safeClass = name.replace(/[^a-zA-Z0-9ก-๙_-]/g, '');
    return '<span class="element-tag elem-' + safeClass + '">ธาตุ' + escapeHTML(name) + ' ' + escapeHTML(element.symbol) + '</span>';
  }

  function rabbitTileHtml(num, rabbit, element, label) {
    return tileHtml(label || ('🐇 พฤติกรรมกระต่ายเลข ' + num), rabbit.name + ' ' + elementTag(element),
      '<b>' + rabbit.short + '</b>   ' + rabbit.desc, true);
  }

  function nameTileHtml(nameRes) {
    if (!nameRes) return '';
    return tileHtml('เลขศาสตร์ชื่อ-นามสกุล (เลข ' + nameRes.num + ') ' + elementTag(nameRes.element),
      nameRes.prediction.title, nameRes.prediction.desc, false);
  }

  // compact = true เมื่อมีบล็อกรายละเอียดของธาตุอยู่ที่อื่นแล้ว (กันข้อความซ้ำสองที่)
  function relationTileHtml(relation, compact) {
    if (!relation) return '';
    if (compact) {
      return tileHtml('↔️ ความสัมพันธ์ธาตุดวงชะตา', '<span style="font-size:13.5px;">' + relation.type + '</span>', '', false);
    }
    return tileHtml('↔️ ความสัมพันธ์ธาตุดวงชะตา', '<span style="font-size:13.5px;">' + relation.type + '</span>',
      '<b>ผลกระทบ:</b> ' + relation.effect + '<br/>' + relation.desc, false);
  }

  function listHtml(items) {
    if (!Array.isArray(items) || !items.length) return '';
    var h = '<ul>';
    items.forEach(function (it) { h += '<li>' + sanitizeHTML(it) + '</li>'; });
    return h + '</ul>';
  }

  function stepsHtml(steps, color) {
    if (!Array.isArray(steps) || !steps.length) return '';
    if (!/^(#[0-9a-f]{3,8}|[a-z]+|rgba?\([0-9.,% ]+\)|var\(--[a-zA-Z0-9_-]+\))$/i.test(safeColor)) safeColor = '';
    if (!/^(#[0-9a-f]{3,8}|[a-z]+|rgba?\\([0-9.,% ]+\\)|var\\(--[a-zA-Z0-9_-]+\\))$/i.test(safeColor)) safeColor = '';
    var h = '<ul class="step-list">';
    steps.forEach(function (s) {
      h += '<li>' + (safeColor ? '<b style="color:' + safeColor + ';">◆</b> ' : '◆ ') + sanitizeHTML(s) + '</li>';
    });
    return h + '</ul>';
  }

  function doDontHtml(doList, dontList) {
    if ((!doList || !doList.length) && (!dontList || !dontList.length)) return '';
    var h = '<div class="dd-grid">';
    if (doList && doList.length) h += '<div class="dd-box dd-do"><b>✅ สิ่งที่ควรทำ</b>' + listHtml(doList) + '</div>';
    if (dontList && dontList.length) h += '<div class="dd-box dd-dont"><b>⛔ สิ่งที่ควรเลี่ยง</b>' + listHtml(dontList) + '</div>';
    return h + '</div>';
  }

  function luckyChipsHtml(lucky) {
    if (!lucky) return '';
    var chips = [];
    if (lucky.color) chips.push('🎨 สีมงคล: ' + lucky.color);
    if (lucky.number) chips.push('🔢 เลขเสริม: ' + lucky.number);
    if (lucky.direction) chips.push('🧭 ทิศ: ' + lucky.direction);
    if (lucky.day) chips.push('📅 วัน: ' + lucky.day);
    if (!chips.length) return '';
    var h = '<div class="lucky-grid">';
    chips.forEach(function (c) { h += '<span class="lucky-chip">' + sanitizeHTML(c) + '</span>'; });
    return h + '</div>';
  }

  function chantBoxHtml(chant, title) {
    if (!chant) return '';
    return '<div class="chant-box"><b>🕉️ ' + (title || 'คาถา/คำบริกรรมเสริมดวง') + ':</b>' +
      '<span class="mantra">' + chant + '</span></div>';
  }

  function predDeepHtml(deep, accent) {
    if (!deep) return '';
    var ac = accent || 'var(--primary-orange)';
    var h = '<div class="pred-block" style="background:#ffffff; border-color:#e2e8f0;">';
    h += '<h4 style="color:' + ac + ';">🧭 มองเรื่องนี้ให้ชัดขึ้น · ' + (deep.keyword || '') + '</h4>';
    if (deep.opportunity) h += '<div class="pred-section-item"><b>🌟 โอกาสที่คุณอาจใช้ให้เป็นประโยชน์:</b><br/>' + deep.opportunity + '</div>';
    if (deep.risk) h += '<div class="pred-section-item"><b>⚠️ เรื่องที่อยากชวนให้ใส่ใจ:</b><br/>' + deep.risk + '</div>';
    if (deep.plan) h += '<div class="pred-section-item"><b>🗺️ ลองเริ่มจาก 3 ขั้นตอนนี้:</b>' + stepsHtml(deep.plan, ac) + '</div>';
    h += doDontHtml(deep.doList, deep.dontList);
    return h + '</div>';
  }

  function godRitualHtml(g) {
    if (!g) return '';
    var h = '<div class="pred-block" style="background:#fff7ed; border-color:#fed7aa;">';
    h += '<h4 style="color:#9a3412;">🛕 คู่มือการบูชาแบบละเอียด (ขั้นตอน · คาถา · ข้อห้าม)</h4>';
    if (g.why) h += '<div class="pred-section-item"><b>❓ เหตุใดจึงเป็นองค์นี้:</b><br/>' + g.why + '</div>';
    if (g.bestTime) h += '<div class="pred-section-item"><b>🕐 เวลาที่เหมาะสม:</b><br/>' + g.bestTime + '</div>';
    if (g.chantCount) h += '<div class="pred-section-item"><b>🔁 จำนวนสวดและความต่อเนื่อง:</b><br/>' + g.chantCount + '</div>';
    if (g.chantMeaning) h += '<div class="pred-section-item"><b>📖 ความหมายของคาถา:</b><br/>' + g.chantMeaning + '</div>';
    if (g.ritual) h += '<div class="pred-section-item"><b>🧾 ลำดับขั้นตอนการไหว้:</b>' + stepsHtml(g.ritual, '#9a3412') + '</div>';
    if (g.after) h += '<div class="pred-section-item"><b>🙏 การแก้บน/สิ่งที่ต้องทำต่อ:</b><br/>' + g.after + '</div>';
    if (g.luckyColor) h += '<div class="pred-section-item"><b>🎨 สีมงคลขององค์นี้:</b><br/>' + g.luckyColor + '</div>';
    if (g.warning) h += '<div class="role-box"><b>🚫 ข้อห้ามสำคัญ:</b> ' + g.warning + '</div>';
    return h + '</div>';
  }

  function oreguDeepHtml(d, skipChant) {
    if (!d) return '';
    var h = '<div class="pred-block" style="background:#f0f9ff; border-color:#bae6fd;">';
    h += '<h4 style="color:#075985;">🔎 ค่อย ๆ ทำความเข้าใจคำถามนี้</h4>';
    if (d.focus) h += '<div class="pred-section-item"><b>🎯 เรื่องสำคัญที่ควรใส่ใจ:</b><br/>' + modernOreguText(d.focus) + '</div>';
    if (d.action) h += '<div class="pred-section-item"><b>🚀 ก้าวเล็ก ๆ ที่คุณเริ่มทำได้:</b><br/>' + modernOreguText(d.action) + '</div>';
    if (d.caution) h += '<div class="role-box"><b>⚠️ ดูแลเรื่องนี้อย่างอ่อนโยน:</b> ' + modernOreguText(d.caution) + '</div>';
    if (d.lucky) h += '<div class="lucky-grid"><span class="lucky-chip">🍀 ' + modernOreguText(d.lucky) + '</span></div>';
    if (!skipChant) h += chantBoxHtml(d.chant, 'คาถาประจำคำถามข้อนี้');
    return h + '</div>';
  }

  function archDeepHtml(a, bucket) {
    if (!a) return '';
    var h = '<div class="pred-block" style="background:#f3e8ff; border-color:#d8b4fe;">';
    h += '<h4 style="color:#581c87;">📖 ความหมายที่อ่านเข้าใจง่าย</h4>';
    if (a.deepen) h += '<div class="pred-section-item"><b>🧠 ใจความสำคัญ:</b><br/>' + modernOreguText(a.deepen) + '</div>';
    if (a.boost) h += '<div class="pred-section-item"><b>🚀 วิธีช่วยให้คืบหน้า:</b><br/>' + modernOreguText(a.boost) + '</div>';
    var extra = a[bucket === 'good' ? 'goodBoost' : (bucket === 'warn' ? 'warnFix' : 'midBoost')];
    if (extra) h += '<div class="role-box"><b>🎯 คำแนะนำเฉพาะผลลัพธ์ระดับนี้:</b> ' + modernOreguText(extra) + '</div>';
    return h + '</div>';
  }

  // ---------- บล็อกสรุปอ่านง่าย + คำทำนายเฉพาะเรื่อง ----------
  function levelColor(level) {
    if (level >= 4) return '#2f855a';
    if (level === 3) return '#b7791f';
    return '#c53030';
  }

  function levelDotsHtml(level, color) {
    var h = '<div class="level-dots">';
    for (var i = 1; i <= 5; i++) {
      h += '<span class="dot"' + (i <= level ? ' style="background:' + color + ';"' : '') + '></span>';
    }
    return h + '</div>';
  }

  // สรุปสั้นอ่านเข้าใจได้ทันที (ใช้กับ engine ที่เลือกหมวดเรื่อง)
  function quickSummaryHtml(tp, catName, icon, reading) {
    if (!tp) return '';
    var lv = Engine.LEVEL_SCALE[tp.level] || Engine.LEVEL_SCALE[3];
    var color = levelColor(tp.level);
    var h = '<div class="pred-block" style="background:linear-gradient(135deg,#f7fafc 0%,#ffffff 100%); border-color:#e2e8f0; border-left:5px solid ' + color + ';">';
    h += '<h4 style="color:' + color + '; border-bottom:none; padding-bottom:0;">' + lv.emoji + ' สรุปคำตอบเรื่อง' + catName + ' · ระดับ: ' + lv.text + '</h4>';
    if (reading) {
      h += '<div class="topic-line">🎯 หัวข้อที่เลือก: <b>' + reading.catName + '</b>' +
        ' <span class="muted">(' + reading.rabbit.name + ')</span></div>';
    }
    h += levelDotsHtml(tp.level, color);
    h += '<div style="font-size:13.5px; font-weight:700; color:#1a202c; margin-top:8px; line-height:1.55;">' + tp.answer + '</div>';
    h += '<div style="font-size:12.5px; color:#4a5568; margin-top:6px; line-height:1.65;">' + tp.easy + '</div>';
    if (tp.todo) h += '<div class="dd-box dd-do" style="margin-top:10px;"><b>✅ เริ่มทำ 4 อย่างนี้ก่อน</b>' + listHtml(tp.todo) + '</div>';
    return h + '</div>';
  }

  // คำทำนายเฉพาะเรื่อง (ตัวอย่างเหตุการณ์ · สัญญาณ · ทำ/เลี่ยง · แนวโน้มรายเดือน)
  function topicDetailHtml(tp, catInfo, catName) {
    // ลดรายละเอียดซ้ำที่เป็นเพียงตัวอย่างและสัญญาณประกอบ โดยคงคำทำนายหลักไว้ในส่วนสรุป
    return '';
  }

  // แนวโน้มเฉพาะเรื่องแบบย่อรายเดือน (ใช้เฉพาะส่วน "รายเดือน" เท่านั้น)
  function topicMonthlyMiniHtml(tp) {
    if (!tp) return '';
    return '<span class="mini-h">📅 แนวโน้มเฉพาะเรื่องนี้รายเดือน</span>' +
      '<div class="mth3">' +
      '<div class="mth"><b>เดือนที่ 1</b>' + (tp.m1 || '-') + '</div>' +
      '<div class="mth"><b>เดือนที่ 2</b>' + (tp.m2 || '-') + '</div>' +
      '<div class="mth"><b>เดือนที่ 3</b>' + (tp.m3 || '-') + '</div>' +
      '</div>';
  }

  // แสดงคำตอบระดับอื่นเพื่อเทียบเคียง โดยไม่พิมพ์ซ้ำระดับที่ดวงนี้ได้ไปแล้ว
  function levelCompareHtml(res, key, label) {
    if (res.bucket === key) {
      return '<div class="pred-section-item"><b>' + label + ':</b><br/>' +
        '<span class="muted">ตรงกับระดับที่คำนวณได้สำหรับคำถามข้อนี้ (แสดงไว้ด้านบนแล้ว)</span></div>';
    }
    return '<div class="pred-section-item"><b>' + label + ':</b><br/>' + modernOreguText(res.qLevels[key]) + '</div>';
  }

  // สรุปอ่านง่ายสำหรับคำถามโอเรกุรัม (เฉพาะข้อที่ถาม)
  function oreguEasyHtml(res) {
    if (!res || !res.easy) return '';
    var h = '<div class="pred-block" style="background:#ffffff; border-color:#ddd6fe; border-left:5px solid #7c3aed;">';
    h += '<h4 style="color:#5b21b6; border-bottom:none; padding-bottom:0;">💬 พูดง่าย ๆ ว่า</h4>';
    h += '<div style="font-size:12.5px; color:#4a5568; margin-top:6px; line-height:1.65;">' + modernOreguText(res.easy.easy) + '</div>';
    if (res.easy.next3) h += '<div class="dd-box dd-do" style="margin-top:10px;"><b>✅ 3 อย่างที่ทำได้เลย</b>' + listHtml(res.easy.next3.map(function(x){ return modernOreguText(x); })) + '</div>';
    return h + '</div>';
  }

  // ---------- บล็อกหัวข้อที่เลือก (ไม่มีตาราง) ----------
  // คำนวณเลขของ "หัวข้อที่เลือก" ตามศาสตร์โหรกระต่าย (ใช้สูตรเดียวกับดวงบุคคลทั้งหมด)
  // ใช้ผลที่คำนวณมาแล้วจากส่วน "ระยะสั้น" โดยตรง   ไม่เรียก calcPerson ซ้ำ
  // เดิมฟังก์ชันนี้เรียก calcPerson โดยไม่ระบุ feature ทำให้ต้องรวมผลทุกฟีเจอร์โดยไม่จำเป็น
  function calcTopicReading(res) {
    if (!res) return null;
    var catKey = res.category, subKey = res.subTopicKey;
    var info = Engine.SHORT_CATEGORIES[catKey];
    if (!info) return null;
    var key = parseInt(subKey, 10);
    if (!info.subs[key]) key = parseInt(Object.keys(info.subs)[0], 10);
    var r = res;
    return {
      catKey: catKey, catName: r.categoryName, subKey: key,
      name: info.subs[key].n,
      isHot: !!(info.subs[key].hot),
      num: r.R4, rabbit: r.rabbit, element: r.element,
      frame: Engine.getSubFrame(catKey, key),
      trace: 'รหัสคำทำนายเฉพาะหัวข้อนี้: ' + r.R4
    };
  }

  // บล็อกหัวข้อที่เลือก   เลขทั้งหมดมาจากการคำนวณตามศาสตร์โหรกระต่าย และตรงกับหัวข้อที่เลือก
  function selectedTopicHtml(reading) {
    if (!reading) return '';
    var num = reading.num;
    var rabbit = reading.rabbit || Engine.RABBITS[num];
    var elem = reading.element || Engine.getElement(num);
    var h = '<div class="pred-block" style="background:#fff7ed; border-color:#fed7aa;">';
    h += '<h4 style="color:#9a3412;">' + ('📌 หัวข้อที่เลือก · ') +
      reading.catName + ' → ' + reading.name + '</h4>';
    var f = reading.frame;
    if (f) {
      h += '<div class="pred-section-item"><b>🎯 หัวข้อนี้ว่าด้วยเรื่อง:</b><br/>' + f.focus + '</div>';
      h += '<div class="pred-section-item"><b>❓ คำถามที่หัวข้อนี้ตอบ:</b><br/>' + f.question + '</div>';
      h += '<div class="pred-section-item"><b>🔔 สัญญาณที่ควรจับตาในหัวข้อนี้:</b><br/>' + f.look + '</div>';
    }
    if (reading.catKey === 'love' && reading.name === 'ลักษณะคนที่เข้ามา') {
      var ent = Engine.LOVE_ENTRANT[num];
      if (ent) {
        h += '<div class="pred-section-item"><b>👤 วิเคราะห์ลักษณะคนที่เข้ามา ตามหลักโหรกระต่าย:</b><br/>' +
          '<b>' + ent.type + '</b><br/>' + ent.detail +
          '<div class="dd-grid" style="margin-top:8px;">' +
          '<div class="dd-box dd-do"><b>✔ จุดเด่นของคนที่เข้ามา</b><ul><li>' + ent.good + '</li></ul></div>' +
          '<div class="dd-box dd-dont"><b>⚠ ข้อควรระวัง</b><ul><li>' + ent.watch + '</li></ul></div>' +
          '</div></div>';
      }
    }
    return h + '</div>';
  }

  function pad2(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 0) n = 0;
    return (n < 10 ? '0' : '') + n;
  }

  // ---------- ส่วนหัว/ท้ายที่แต่ละส่วนคำนวณและแสดงของตัวเอง ----------
  // บัตรข้อมูล 3 ใบ (รหัสของส่วนนั้น · เลขศาสตร์ชื่อ · ความสัมพันธ์ธาตุ)
  function sectionTilesHtml(res, num, rabbit, element, rel, tileLabel) {
    return '<div class="num-grid">' +
      rabbitTileHtml(num, rabbit, element, tileLabel) +
      nameTileHtml(res.nameRes) +
      relationTileHtml(rel) +
      '</div>';
  }

  // บล็อกข้อมูลดวงโดยรวม พร้อมที่มาของเลขของส่วนนั้น ๆ
  function sectionFactsHtml(res, traceHtml) {
    return '<div class="pred-block" style="background:#fffaf0; border-color:#fbd38d;">' +
      '<h4 style="color:#975a16;">🕉️ ข้อมูลดวงโดยรวม</h4>' +
      '<div class="pred-section-item"><b>ธาตุเจ้าชะตา:</b> ธาตุ' + res.ownerElement.name + ' ' + res.ownerElement.symbol +
        '   จุดเด่น: ' + res.ownerElement.good + '</div>' +
      '<div class="pred-section-item"><b>ข้อควรระวัง:</b> ' + res.ownerElement.bad + '</div>' +
      '<div class="pred-section-item"><b>พลังวันเกิด:</b> วัน' + res.birthPowerName + ' กำลัง ' + res.birthPowerValue +
        ' (ใช้เป็นค่าตั้งต้นของดวง)</div>' +
      traceHtml +
      '</div>';
  }

  // ---------- ตัวประกอบผลลัพธ์ของแต่ละส่วน (บัตรข้อมูล + เนื้อหา + ข้อมูลดวงโดยรวม) ----------
  // ---------- ตัวประกอบผลลัพธ์แบบกระชับ ----------
  // ---------- คำทำนายเชิงลึกเพิ่มเติมของรหัสกระต่าย 1–9 ----------
  // ชั้นนี้เป็นคำทำนายเพิ่มเติมจากข้อมูลเดิม เพื่อให้แต่ละผลมีมุมมองเชิงพฤติกรรม
  // รูปแบบการตัดสินใจ จุดเปลี่ยน สัญญาณเตือน และแผนปฏิบัติที่ละเอียดขึ้น
  var RABBIT_EXTRA_DEEP = {
    1: { hidden:'ศักยภาพที่ยังใช้ไม่เต็มที่คือการเปลี่ยนความคิดใหม่ให้กลายเป็นระบบที่ทำซ้ำได้ ไม่ใช่เพียงการเป็นคนเริ่มต้น เมื่อคุณสร้างวิธีทำงานที่คนอื่นทำตามได้ พลังของเลขนี้จะเปลี่ยนจาก “ผู้เปิดทาง” เป็น “ผู้สร้างเส้นทาง”', pattern:'รูปแบบที่เกิดซ้ำคือเริ่มเร็ว ตื่นเต้นเร็ว และอยากเปลี่ยนเร็ว เมื่อเจอช่วงที่งานเริ่มละเอียดหรือช้า คุณอาจรู้สึกว่าหมดแรงทั้งที่เรื่องนั้นยังมีโอกาสไปต่อ', decision:'ก่อนเริ่มเรื่องใหม่ ให้ถามตัวเองว่าเรื่องเดิมปิดแล้วหรือยัง และกำหนด “จุดจบที่วัดได้” ให้ชัดเจนก่อนเริ่มเรื่องถัดไป', relation:'ความสัมพันธ์จะดีเมื่ออีกฝ่ายเข้าใจความต้องการเติบโตของคุณ แต่ต้องระวังการมองว่าความนิ่งเท่ากับความเบื่อ', money:'เงินมีโอกาสไหลออกกับการทดลอง โครงการใหม่ และของที่ช่วยให้เริ่มเร็ว จึงควรแยกเงินทดลองออกจากเงินใช้จ่ายประจำอย่างชัดเจน', turning:'จุดเปลี่ยนมักเกิดเมื่อคุณเลือกทำสิ่งหนึ่งให้จบแทนการเปิดทางใหม่หลายทางพร้อมกัน', plan:['เลือกเป้าหมายหลักเพียง 1 เรื่อง','แบ่งงานเป็นช่วงสั้นและกำหนดวันปิดงาน','เมื่อปิดงานแล้วจึงเปิดโครงการใหม่'], sign:'ถ้าคุณเริ่มพูดว่า “เดี๋ยวค่อยกลับมาทำ” หลายครั้ง นั่นคือสัญญาณว่าควรหยุดเปิดเรื่องใหม่และกลับมาปิดเรื่องเดิม' },
    2: { hidden:'ศักยภาพสำคัญคือความสามารถในการประคองคนและสถานการณ์ให้เดินต่อโดยไม่ต้องแย่งพื้นที่กับใคร คุณอ่านอารมณ์และจังหวะของคนอื่นได้ดี แต่พลังนี้จะเด่นที่สุดเมื่อคุณกล้าบอกความต้องการของตัวเองด้วย', pattern:'มักรับความรู้สึกของคนอื่นเข้ามาเป็นภาระของตัวเอง และใช้เวลานานกว่าจะยอมรับว่าตัวเองเหนื่อย', decision:'อย่าตัดสินใจจากความกลัวว่าจะทำให้ใครไม่พอใจ ให้แยก “ความรับผิดชอบของเรา” ออกจาก “ความรู้สึกของคนอื่น”', relation:'ความรักและมิตรภาพต้องมีขอบเขตที่ชัด ไม่เช่นนั้นคุณจะกลายเป็นคนแก้ปัญหาให้ทุกคนจนความต้องการของตัวเองถูกเลื่อนออกไป', money:'การเงินเหมาะกับการสะสมแบบค่อยเป็นค่อยไปและรายได้จากงานที่ต้องใช้ความละเอียด ความไว้ใจ หรือการดูแลลูกค้า', turning:'จุดเปลี่ยนเกิดเมื่อคุณพูดคำว่า “ไม่” ได้โดยไม่รู้สึกว่าตัวเองเป็นคนใจร้าย', plan:['กำหนดขอบเขตที่รับได้','สื่อสารความต้องการก่อนสะสมความอึดอัด','เก็บเงินหรือเวลาส่วนตัวไว้เป็นสัดส่วนที่ห้ามแตะ'], sign:'ถ้าคุณเริ่มรู้สึกเหนื่อยแต่ยังตอบรับทุกคำขอ นั่นคือสัญญาณให้ทบทวนขอบเขตทันที' },
    3: { hidden:'ศักยภาพเด่นคือการทำให้เรื่องยากกลายเป็นเรื่องที่คนเข้าใจง่าย คุณมีพลังจากภาษา ความคิดสร้างสรรค์ และการเชื่อมคนเข้าหากัน', pattern:'เมื่อได้รับความสนใจคุณจะทำงานได้เร็วมาก แต่ถ้าผลงานไม่มีคนตอบรับอาจเปลี่ยนใจหรือเปลี่ยนทิศเร็วเกินไป', decision:'ให้คุณค่ากับคุณภาพและความสม่ำเสมอมากกว่าคำชมระยะสั้น และเก็บผลงานไว้เป็นหลักฐานของความก้าวหน้า', relation:'ต้องการความสัมพันธ์ที่พูดคุยกันได้จริงและมีพื้นที่ให้เป็นตัวเอง ระวังการใช้มุกหรือการเงียบเพื่อเลี่ยงบทสนทนาที่ยาก', money:'รายได้เด่นจากการสื่อสาร การขาย การสร้างคอนเทนต์ งานสร้างสรรค์ และสิ่งที่ต้องใช้บุคลิกเฉพาะตัว', turning:'จุดเปลี่ยนเกิดเมื่อคุณเปลี่ยนความสามารถในการพูดให้กลายเป็นทรัพย์สินหรือผลงานที่สะสมได้', plan:['เลือกช่องทางหลักหนึ่งช่อง','ผลิตผลงานตามตารางที่ทำซ้ำได้','เก็บสถิติและปรับจากข้อมูลแทนอารมณ์'], sign:'ถ้าคุณเริ่มเปรียบเทียบตัวเองกับคนอื่นมากกว่าดูพัฒนาการของตัวเอง ให้กลับมาวัดจากผลงานย้อนหลังของคุณเอง' },
    4: { hidden:'พลังที่ยังใช้ไม่เต็มที่คือความสามารถในการสร้างระบบที่มั่นคงและทำให้คนอื่นพึ่งพาได้ คุณอาจไม่ได้เร็วที่สุด แต่มีโอกาสสร้างสิ่งที่อยู่ได้นาน', pattern:'มักคิดรอบคอบจนเริ่มช้ากว่าที่ควร และบางครั้งแบกมาตรฐานสูงจนกลายเป็นกดดันตัวเอง', decision:'กำหนดเส้นแบ่งระหว่าง “ต้องละเอียด” กับ “ดีพอสำหรับการเดินหน้าต่อ” เพื่อไม่ให้ความสมบูรณ์แบบกลายเป็นตัวขวาง', relation:'ความรักต้องการความชัดเจนและความสม่ำเสมอ ระวังการแสดงความรักด้วยการรับผิดชอบทุกอย่างแทนอีกฝ่าย', money:'เหมาะกับการวางงบประมาณ ทรัพย์สินระยะยาว งานระบบ และรายได้ที่เติบโตจากความเชี่ยวชาญสะสม', turning:'จุดเปลี่ยนเกิดเมื่อระบบที่คุณสร้างเริ่มทำงานได้แม้วันที่คุณไม่ได้ควบคุมทุกขั้นตอน', plan:['วางระบบก่อนเร่งผล','กำหนดมาตรฐานขั้นต่ำที่ทำได้ทุกวัน','มอบหมายงานที่ไม่จำเป็นต้องทำเอง'], sign:'ถ้าคุณรู้สึกว่าทุกอย่างต้องผ่านมือคุณจึงจะเรียบร้อย ให้เริ่มสร้างระบบหรือคู่มือแทนการเพิ่มภาระตัวเอง' },
    5: { hidden:'ศักยภาพคือการเป็นตัวเชื่อมโอกาส เพราะคุณปรับตัวเร็วและมองเห็นทางเลือกมากกว่าหนึ่งทาง แต่ต้องเปลี่ยนความหลากหลายให้มีทิศทาง', pattern:'มักเบื่อง่ายเมื่อไม่มีความท้าทาย และอาจตัดสินใจจากความรู้สึกอยากเปลี่ยนก่อนกะผลกระทบครบ', decision:'ก่อนเปลี่ยน ให้เขียนต้นทุนของการอยู่ต่อและต้นทุนของการเปลี่ยน แล้วเลือกจากข้อมูล ไม่ใช่ความเบื่อ', relation:'ต้องการพื้นที่ส่วนตัวและความสัมพันธ์ที่ไม่ควบคุมกันมากเกินไป แต่ควรสื่อสารให้ชัดเพื่อไม่ให้อีกฝ่ายตีความความต้องการอิสระเป็นความไม่แน่นอน', money:'เงินมักมาจากหลายช่องทางหรือโอกาสใหม่ เหมาะกับการมีบัญชีสำรองและกติกาการใช้เงินเพื่อกันความผันผวน', turning:'จุดเปลี่ยนเกิดเมื่อคุณเลือก “หนึ่งทิศทางหลัก + ทางเลือกสำรอง” แทนการเปิดทุกทางพร้อมกัน', plan:['เลือกเป้าหมายหลักหนึ่งข้อ','กันงบสำหรับการทดลองโดยเฉพาะ','ทบทวนทางเลือกตามรอบเวลาแทนการเปลี่ยนตามอารมณ์'], sign:'ถ้าคุณเปิดหลายงานใหม่จนจำไม่ได้ว่าอะไรสำคัญที่สุด ให้หยุดและจัดลำดับใหม่ทันที' },
    6: { hidden:'ศักยภาพคือการสร้างความมั่นคงให้คนรอบตัวโดยไม่ต้องเสียสละตัวเองทั้งหมด คุณมีพลังดูแลและรับผิดชอบสูง แต่ต้องแบ่งภาระอย่างยุติธรรม', pattern:'มักรู้สึกว่าถ้าไม่ทำเองเรื่องจะไม่เรียบร้อย จึงรับภาระเกินส่วนและสะสมความน้อยใจ', decision:'ถามก่อนรับผิดชอบว่าเรื่องนี้เป็นหน้าที่ของเราจริงหรือเป็นเพียงสิ่งที่เราทำได้', relation:'ต้องการความสัมพันธ์ที่ไว้ใจกันและช่วยกันดูแลชีวิตจริง ระวังการดูแลจนกลายเป็นการควบคุมหรือคาดหวังให้อีกฝ่ายตอบแทน', money:'เหมาะกับการวางแผนรายจ่ายครอบครัว ทรัพย์สิน และเงินสำรอง แต่ควรมีงบสำหรับตัวเองโดยไม่รู้สึกผิด', turning:'จุดเปลี่ยนเกิดเมื่อคุณดูแลคนอื่นโดยยังเหลือพลังสำหรับชีวิตของตัวเอง', plan:['แยกหน้าที่ของแต่ละคน','กำหนดงบช่วยเหลือที่ชัดเจน','จัดเวลาพักเป็นภารกิจที่ต้องทำ'], sign:'ถ้าคุณเริ่มพูดว่า “ไม่เป็นไร เดี๋ยวฉันทำเอง” บ่อยเกินไป ให้หยุดและแบ่งงานใหม่' },
    7: { hidden:'ศักยภาพคือการมองทะลุข้อมูลและค้นหาความหมายที่คนอื่นมองข้าม คุณเหมาะกับการเรียนรู้ วิเคราะห์ วิจัย และสร้างความเชี่ยวชาญเฉพาะทาง', pattern:'เมื่อไม่มั่นใจ คุณมีแนวโน้มเก็บตัวและคิดซ้ำจนพลาดจังหวะลงมือ', decision:'กำหนดเส้นตายให้การค้นข้อมูลทุกครั้ง และเมื่อข้อมูลถึงระดับเพียงพอให้ทดลองจริง', relation:'ต้องการพื้นที่ส่วนตัวสูงและอาจแสดงความรักด้วยการอยู่เคียงข้างมากกว่าคำพูด ควรสื่อสารเมื่อมีเรื่องค้างใจแทนการเงียบ', money:'เด่นจากความรู้เฉพาะทาง งานวิเคราะห์ เทคโนโลยี งานวิจัย หรือบริการที่ลูกค้าจ่ายเพราะความเชี่ยวชาญ', turning:'จุดเปลี่ยนเกิดเมื่อความรู้ที่สะสมถูกแปลงเป็นผลงานหรือบริการที่คนอื่นใช้ได้จริง', plan:['เลือกเรื่องที่ต้องเชี่ยวชาญ','จำกัดเวลาค้นข้อมูล','สร้างผลงานจากความรู้ทุกสัปดาห์'], sign:'ถ้าคุณหาข้อมูลเพิ่มทั้งที่มีข้อมูลเพียงพอแล้ว นั่นคือสัญญาณให้เปลี่ยนจากการคิดเป็นการทดลอง' },
    8: { hidden:'ศักยภาพสูงสุดคือการบริหารทรัพยากร อำนาจต่อรอง และผลลัพธ์ให้เกิดขึ้นจริง คุณมีพลังกับเป้าหมายใหญ่ แต่ต้องไม่ให้เป้าหมายกลายเป็นภาระที่ควบคุมทุกอย่าง', pattern:'มักรับภาระมากและวัดคุณค่าตัวเองจากผลลัพธ์ เมื่อสิ่งต่าง ๆ ไม่เป็นไปตามแผนอาจเครียดหรือพยายามควบคุมมากขึ้น', decision:'แยกสิ่งที่ควบคุมได้ สิ่งที่ต่อรองได้ และสิ่งที่ต้องปล่อย แล้วใช้พลังกับสองกลุ่มแรก', relation:'ต้องการคู่ที่มีเป้าหมายของตัวเองและเคารพความสามารถกัน ระวังการสื่อสารแบบสั่งการเมื่อเครียด', money:'เด่นกับการบริหารเงิน ธุรกิจ การต่อรอง ทรัพย์สิน และงานที่มีเป้าหมายชัด แต่ควรกำหนดเพดานความเสี่ยงทุกครั้ง', turning:'จุดเปลี่ยนเกิดเมื่อคุณสร้างระบบที่ทำให้ผลลัพธ์เติบโตโดยไม่ต้องเพิ่มแรงของตัวเองทุกครั้ง', plan:['กำหนดเป้าหมายและตัวชี้วัด','กำหนดเพดานความเสี่ยง','สร้างระบบที่คนอื่นช่วยขยายผลได้'], sign:'ถ้าคุณเริ่มควบคุมรายละเอียดทุกเรื่องเพราะกลัวผลลัพธ์ไม่เป็นไปตามแผน ให้กลับไปดูตัวชี้วัดหลักแทน' },
    9: { hidden:'ศักยภาพคือการมองภาพใหญ่และเชื่อมประสบการณ์ให้กลายเป็นบทเรียนที่มีคุณค่าต่อคนอื่น คุณมีพลังกับงานที่มีความหมายและการปิดวงจรของสิ่งที่ค้าง', pattern:'มักแบกเรื่องเก่า ความผิดหวัง หรือความคาดหวังของคนอื่นไว้นานจนพลังสำหรับเรื่องใหม่ลดลง', decision:'ก่อนเดินต่อให้ยอมรับสิ่งที่จบแล้วอย่างชัดเจน แล้วเลือกว่าจะเก็บบทเรียนอะไรไว้และปล่อยอะไรไป', relation:'มีความรู้สึกที่เข้มข้นและต้องการความจริงใจ ระวังการให้อภัยเร็วเกินไปจนข้ามขอบเขตที่ควรมี', money:'เหมาะกับงานที่สร้างคุณค่าให้คนจำนวนมาก งานสังคม ศิลปะ การสอน หรือสิ่งที่ใช้ประสบการณ์มาสร้างรายได้ แต่ควรมีระบบเงินที่เป็นรูปธรรม', turning:'จุดเปลี่ยนเกิดเมื่อคุณปิดสิ่งที่ค้างและนำประสบการณ์เดิมไปสร้างสิ่งใหม่ที่มีความหมายกว่า', plan:['ปิดเรื่องค้างทีละเรื่อง','เก็บบทเรียนเป็นข้อ ๆ','เลือกโครงการใหม่ที่สอดคล้องกับคุณค่าหลัก'], sign:'ถ้าคุณย้อนกลับไปคิดเรื่องเดิมซ้ำโดยไม่มีการลงมือแก้หรือปิดมัน นั่นคือสัญญาณให้กำหนดบทสรุปให้ตัวเอง' }
  };

  // ---------- คำทำนายเชิงลึกเฉพาะฟีเจอร์ ----------
  // ไม่ใช้ข้อความชุดเดียวกันทุกฟีเจอร์อีกต่อไป แต่เปลี่ยนแกนการตีความตามหน้าที่ของผลลัพธ์
  var FEATURE_DEEP_GUIDE = {
    base: {
      title:'🔬 เจาะลึกพื้นดวงกำเนิด',
      intro:'ชั้นนี้อ่าน “โครงสร้างชีวิตเดิม” จากรหัสพื้นดวง จึงเน้นนิสัยแกนหลัก ศักยภาพระยะยาว งาน เงิน ความรัก สุขภาพ และบทเรียนชีวิต ไม่ตีความเป็นเหตุการณ์ระยะสั้น',
      labels:['🧬 แกนชีวิตและศักยภาพ','💼 รูปแบบการงานระยะยาว','💰 โครงสร้างการเงิน','❤️ รูปแบบความรัก','🧱 จุดที่ต้องพัฒนา','🔀 จุดเปลี่ยนของเส้นทางชีวิต']
    },
    asc: {
      title:'🔬 เจาะลึกลัคนาราศีและจิตสำนึก',
      intro:'ชั้นนี้อ่าน “วิธีที่คุณรับโลกและแสดงตัวตน” จากลัคนา จิตสำนึก และภาพลักษณ์ภายนอก จึงเน้นบุคลิกที่คนเห็น แรงขับภายใน ปฏิกิริยาเมื่อกดดัน และวิธีใช้ลัคนาให้สมดุลกับพื้นดวง',
      labels:['🌅 ภาพที่คนอื่นรับรู้','🧠 แรงขับภายใน','🎭 พฤติกรรมเมื่อกดดัน','🤝 วิธีสัมพันธ์กับคน','🧭 วิธีตัดสินใจ','🔑 วิธีใช้ลัคนาให้เกิดประโยชน์']
    },
    topicShort: {
      title:'🔬 เจาะลึกภาพรวมของเรื่องที่เลือก',
      intro:'ชั้นนี้อ่านแนวโน้มหลักของเรื่องที่เลือก พร้อมประเด็นสำคัญ จุดที่ควรระวัง และแนวทางที่นำไปใช้ได้ โดยไม่แบ่งคำทำนายเป็นรายวัน',
      labels:['🎯 แนวโน้มหลัก','📌 ประเด็นสำคัญของเรื่อง','🔔 สัญญาณที่ควรสังเกต','⚠️ จุดที่ควรระวัง','🛠️ วิธีรับมือ','✅ แนวทางที่ควรทำ']
    },
    topicMonth: {
      title:'🔬 เจาะลึกแนวโน้มรายเดือน 3 เดือน',
      intro:'ชั้นนี้อ่าน “การเคลื่อนตัวของเรื่องที่เลือกใน 3 เดือน” จึงเน้นเดือนเริ่มต้น เดือนเปลี่ยนจังหวะ เดือนเก็บผล และความแตกต่างของแต่ละช่วง ไม่ใช้คำทำนายระยะสั้นมาแทนกัน',
      labels:['📅 เดือนที่ 1 · ตั้งต้น','📈 เดือนที่ 2 · เปลี่ยนจังหวะ','🏁 เดือนที่ 3 · เห็นผล','🔄 สิ่งที่ควรปรับระหว่างทาง','⚠️ จุดเสี่ยงตลอด 3 เดือน','🎯 เป้าหมายที่ควรรักษา']
    },
    god: {
      title:'🔬 เจาะลึกการมูเทพเฉพาะองค์',
      intro:'ชั้นนี้อ่าน “ความสอดคล้องระหว่างรหัสกระต่ายกับองค์เทพที่ได้” จึงเน้นเรื่องที่องค์นั้นเหมาะจะหนุน วิธีตั้งเจตนา สิ่งที่ควรทำควบคู่ และสัญญาณว่าควรปรับวิธีบูชา',
      labels:['🙏 เหตุผลที่องค์นี้สอดคล้องกับดวง','🎯 เรื่องที่เหมาะแก่การขอพร','🕯️ วิธีตั้งเจตนา','🌟 สิ่งที่ควรทำควบคู่','⚠️ สิ่งที่ไม่ควรคาดหวัง','🔔 สัญญาณการเปลี่ยนแปลง']
    }
  };

  function featureDeepTexts(feature, code, category, subTopicName) {
    var r = Engine.RABBITS[code] || Engine.RABBITS[9];
    var catObj = Engine.SHORT_CATEGORIES && Engine.SHORT_CATEGORIES[category];
    var cat = (catObj && catObj.name) || category || 'เรื่องที่เลือก';
    var sub = subTopicName ? ' (' + subTopicName + ')' : '';
    var name = r.name || ('รหัสกระต่าย ' + code);
    var short = r.short || '';
    var common = {
      1:{base:'พลังของผู้เปิดทาง',asc:'มักแสดงออกก่อนคิดครบเมื่อรู้สึกว่าควรเริ่ม',short:'เหตุการณ์ใหม่มีน้ำหนักสูงและต้องอาศัยการลงมือ',month:'เดือนแรกเหมาะกับการเปิดเรื่อง เดือนถัดไปต้องรักษาแรงส่ง',god:'เหมาะกับการตั้งเจตนาเรื่องการเปิดทางและการเริ่มต้น',oregu:'คำตอบชี้ไปที่การเปิดประตูหรือทางเลือกใหม่'},
      2:{base:'พลังของผู้ประคองและรับฟัง',asc:'รับบรรยากาศและความรู้สึกของคนรอบตัวได้ไว',short:'ข้อมูลยังไม่ครบและปัจจัยจากคนอื่นมีผลมาก',month:'ช่วงแรกเหมาะกับการเก็บข้อมูล ก่อนค่อยขยับในเดือนถัดไป',god:'เหมาะกับเจตนาเรื่องความราบรื่น ความสัมพันธ์ และการขอคำแนะนำ',oregu:'คำตอบชี้ให้ฟังข้อมูลและรอจังหวะที่ชัดกว่าเดิม'},
      3:{base:'พลังของการสื่อสารและการผลักดัน',asc:'มีแนวโน้มแสดงความคิดและความมั่นใจให้คนเห็น',short:'เรื่องมีแรงส่งและตอบสนองเร็วเมื่อสื่อสารชัด',month:'เดือนแรกสร้างแรงส่ง เดือนสองขยาย เดือนสามเก็บผล',god:'เหมาะกับเจตนาเรื่องชื่อเสียง การสื่อสาร โอกาส และความสำเร็จ',oregu:'คำตอบมีแรงผลักให้เรื่องเดินหน้าเร็ว'},
      4:{base:'พลังของระบบและความมั่นคง',asc:'มักระวังรายละเอียดและต้องการความชัดเจน',short:'รายละเอียดเล็ก ๆ มีผลต่อผลลัพธ์มากกว่าที่เห็น',month:'แต่ละเดือนต้องเน้นตรวจระบบและลดจุดรั่วก่อนขยาย',god:'เหมาะกับเจตนาเรื่องความมั่นคง การคุ้มครอง และการจัดระเบียบ',oregu:'คำตอบเตือนให้ตรวจเงื่อนไขก่อนตัดสินใจ'},
      5:{base:'พลังของการปรับตัวและทางเลือก',asc:'ต้องการพื้นที่และอิสระในการเลือกวิธีของตัวเอง',short:'สถานการณ์เปลี่ยนได้เร็วและมีทางเลือกมากกว่าหนึ่งทาง',month:'สามเดือนนี้ควรทดลองอย่างมีกรอบ ไม่เปลี่ยนตามอารมณ์',god:'เหมาะกับเจตนาเรื่องการเดินทาง การเปลี่ยนแปลง และโอกาสใหม่',oregu:'คำตอบบอกให้ยืดหยุ่นและเตรียมทางเลือกสำรอง'},
      6:{base:'พลังของความรับผิดชอบและการดูแล',asc:'มักรับบทคนแก้ปัญหาหรือคนที่คนอื่นพึ่งพา',short:'คนรอบตัวและภาระร่วมมีผลต่อเรื่องที่ถามอย่างชัดเจน',month:'ควรจัดสมดุลภาระในแต่ละเดือน ไม่รับทุกอย่างไว้คนเดียว',god:'เหมาะกับเจตนาเรื่องครอบครัว ความมั่นคง และการดูแลผู้คน',oregu:'คำตอบชี้ให้ดูภาระ ความรับผิดชอบ และความสัมพันธ์ประกอบ'},
      7:{base:'พลังของการวิเคราะห์และความเชี่ยวชาญ',asc:'มีความคิดและความรู้สึกส่วนตัวมาก และไม่รีบเปิดเผยทุกอย่าง',short:'ข้อมูลเบื้องหลังหรือสิ่งที่ยังไม่เปิดเผยมีความสำคัญ',month:'เดือนแรกค้นข้อมูล เดือนสองทดลอง เดือนสามกะผล',god:'เหมาะกับเจตนาเรื่องปัญญา การเรียนรู้ การค้นหาความจริง',oregu:'คำตอบยังมีชั้นข้อมูลที่ควรตรวจสอบก่อนสรุป'},
      8:{base:'พลังของการบริหารทรัพยากรและผลลัพธ์',asc:'มักแสดงความจริงจังและมุ่งผลลัพธ์เมื่อมีเป้าหมาย',short:'เรื่องมีผลต่อเงิน อำนาจต่อรอง หรือความรับผิดชอบโดยตรง',month:'ควรวัดผลเป็นตัวเลขและกำหนดเพดานความเสี่ยงตลอด 3 เดือน',god:'เหมาะกับเจตนาเรื่องทรัพย์สิน งาน ธุรกิจ และอำนาจต่อรอง',oregu:'คำตอบให้ความสำคัญกับผลลัพธ์และเงื่อนไขที่วัดได้'},
      9:{base:'พลังของการปิดวงจรและเริ่มบทใหม่',asc:'มีความรู้สึกที่เข้มข้นและมองภาพรวมของประสบการณ์',short:'เรื่องค้างมีแนวโน้มคลี่คลายเมื่อยอมรับบทสรุป',month:'เดือนแรกปิดสิ่งเก่า เดือนสองเปลี่ยนผ่าน เดือนสามเริ่มเห็นภาพใหม่',god:'เหมาะกับเจตนาเรื่องการช่วยให้เดินหน้าต่อได้ ปิดสิ่งค้าง และเริ่มต้นบทใหม่',oregu:'คำตอบชี้ไปยังการคลี่คลายหรือทางออกหลังจากจบวงจรเดิม'}
    };
    var c=common[code]||common[9];
    if(feature==='base') return {
      core:c.base+' โดยรหัส '+code+' ('+short+') ทำให้พื้นดวงเน้นสิ่งที่ต้องสร้างให้ต่อเนื่องมากกว่าผลสำเร็จชั่วครั้ง',
      detail:'ในระยะยาว จุดแข็งจะทำงานเต็มที่เมื่อคุณจัดชีวิตให้สอดคล้องกับธรรมชาติของรหัสนี้ และไม่ใช้จุดเด่นของตัวเองเกินขอบเขตจนกลายเป็นจุดอ่อน',
      action:'เลือก 1 โครงสร้างชีวิตที่ต้องการทำให้มั่นคง เช่น งาน เงิน ความสัมพันธ์ หรือการดูแลตัวเอง แล้วสร้างกติกาที่ทำซ้ำได้',
      sign:'เมื่อชีวิตเริ่มสวนทางกับธรรมชาติของรหัส เช่น ฝืนมากเกินไปหรือรับบทที่ไม่ใช่ตัวเอง ให้ถือเป็นสัญญาณทบทวนทิศทาง'
    };
    if(feature==='asc') return {
      core:c.asc+' ดังนั้นลัคนาไม่ได้บอกเพียงว่าคนอื่นเห็นคุณอย่างไร แต่ยังบอกวิธีที่คุณตอบสนองต่อสถานการณ์ก่อนที่ตัวตนชั้นในจะได้คิด',
      detail:'เมื่อมีแรงกดดัน ให้สังเกตปฏิกิริยาแรกของตัวเอง เพราะตรงนั้นคือจุดที่ลัคนาแสดงชัดที่สุด จากนั้นค่อยใช้เหตุผลและพื้นดวงมาปรับการตอบสนอง',
      action:'ก่อนตอบเรื่องสำคัญ ให้เว้นจังหวะสั้น ๆ แล้วถามว่า “นี่คือความต้องการจริงของฉัน หรือเป็นปฏิกิริยาอัตโนมัติของลัคนา”',
      sign:'ถ้าคนรอบตัวสะท้อนภาพคุณแบบเดิมซ้ำ ๆ ทั้งที่คุณรู้สึกว่าตัวเองไม่ใช่แบบนั้น นั่นคือข้อมูลสำคัญของลัคนา'
    };
    if(feature==='topicShort') return {
      core:'สำหรับ'+cat+sub+' รหัส '+code+' ('+short+') ทำให้ภาพรวมของเรื่องนี้เน้น '+c.short,
      detail:'ให้อ่านเป็นแนวโน้มโดยรวมของเรื่องที่เลือก แล้วเทียบกับสถานการณ์จริง จุดแข็ง และข้อจำกัดที่กำลังเผชิญอยู่',
      action:'เลือกประเด็นสำคัญหนึ่งข้อจากคำทำนาย แล้วกำหนดการกระทำที่เหมาะสมและตรวจสอบผลได้จริง',
      sign:'หากเหตุการณ์จริงเริ่มแสดงรูปแบบตรงกับคำเตือนหรือสัญญาณของข้อคำถาม ให้ชะลอ/เร่งตามระดับนั้นแทนการตัดสินใจจากความรู้สึกอย่างเดียว'
    };
    if(feature==='topicMonth') return {
      core:'สำหรับ'+cat+sub+' รหัส '+code+' ('+short+') ทำให้การอ่าน 3 เดือนเน้น '+c.month,
      detail:'อย่าอ่านทั้งสามเดือนเป็นเหตุการณ์เดียวกัน แต่ให้มองเป็นกระบวนการต่อเนื่อง: เดือนแรกสร้างเงื่อนไข เดือนสองเห็นการเปลี่ยน และเดือนสามกะผล',
      action:'ตั้งเป้าหมายรายเดือน 1 ข้อ พร้อมตัวชี้วัดที่ตรวจได้ เพื่อให้รู้ว่าควรเดินหน้าหรือปรับแผน',
      sign:'ถ้าผลเดือนหนึ่งไม่เป็นไปตามคาด ให้ใช้เป็นข้อมูลปรับเดือนถัดไป ไม่ควรตีความว่าทั้งสามเดือนต้องเหมือนกัน'
    };
    if(feature==='god') return {
      core:c.god+' โดยให้รหัส '+code+' เป็นแกนจับคู่ ไม่ได้หมายความว่าองค์เทพจะเปลี่ยนเหตุการณ์แทนการลงมือของผู้ใช้',
      detail:'การมูในชั้นนี้จึงควรตั้งเจตนาให้ตรงกับเรื่องที่ต้องการหนุน และทำการกระทำในโลกจริงควบคู่กัน เช่น วางแผน เจรจา แก้เอกสาร หรือสร้างวินัย',
      action:'ตั้งเจตนาให้ชัด 1 เรื่อง แล้วกำหนดการกระทำจริง 1 อย่างที่ทำได้ทันทีหลังการสักการะ',
      sign:'สัญญาณที่มีประโยชน์ที่สุดคือความชัดเจนของตัวเองและการเปลี่ยนแปลงของการกระทำ ไม่ควรใช้เหตุบังเอิญเพียงอย่างเดียวเป็นหลักตัดสิน'
    };
    return {
      core:'สำหรับคำถามโอเรกุรัมข้อนี้ รหัส '+code+' ('+short+') ทำให้ '+c.oregu,
      detail:'ให้ใช้คำตอบเป็นกรอบสะท้อนสถานการณ์ ไม่ใช่คำรับประกันผลลัพธ์ โดยเทียบกับข้อมูลจริงของเรื่องที่กำลังถาม',
      action:'เขียนคำถามต่อยอด 1 ข้อจากคำตอบ แล้วเลือกการกระทำที่ตรวจสอบผลได้ภายในกรอบเวลาที่เหมาะกับเรื่องนั้น',
      sign:'หากสถานการณ์จริงให้ข้อมูลใหม่ที่ขัดกับคำตอบเดิม ให้ถือข้อมูลจริงเป็นสิ่งที่ต้องนำมาพิจารณาและคำนวณใหม่'
    };
  }

  function rabbitExtraDeepHtml(res, feature, title) {
    feature = feature || (res && res.feature) || 'oregu';
    if (feature === 'identity' || feature === 'all') return '';
    var code = feature==='base' ? res.baseCode : (feature==='asc' ? res.ascNum : res.R4);
    var d = featureDeepTexts(feature, code, res && res.category, res && res.subTopicName);
    var guide = FEATURE_DEEP_GUIDE[feature] || FEATURE_DEEP_GUIDE.oregu;
    if (!d) return '';
    var h='<div class="pred-block" style="background:#fff7ed;border-color:#fed7aa;border-left:5px solid #ea580c;">';
    h+='<h4 style="color:#9a3412;">'+guide.title+' · รหัสกระต่าย '+code+'</h4>';
    h+='<div class="pred-section-item"><b>📖 ขอบเขตการอ่าน:</b><br/>'+guide.intro+'</div>';
    h+='<div class="pred-section-item"><b>'+guide.labels[0]+':</b><br/>'+d.core+'</div>';
    h+='<div class="pred-section-item"><b>'+guide.labels[1]+':</b><br/>'+d.detail+'</div>';
    h+='<div class="pred-section-item"><b>'+guide.labels[2]+':</b><br/>'+d.action+'</div>';
    h+='<div class="pred-section-item"><b>'+guide.labels[3]+':</b><br/>'+d.sign+'</div>';
    h+='</div>';
    return h;
  }

  // แสดงผลการ “หลอมรหัส” ระหว่างสูตรเฉพาะฟีเจอร์กับรหัสโหรกระต่ายร่วม
  function rabbitFusionHtml(res, featureName) {
    if (!res || !res.rabbitFusionRabbit) return '';
    var r = res.rabbitFusionRabbit;
    var feature = featureName || 'เรื่องนี้';
    return '<div class="pred-block" style="background:#fffaf0;border-color:#fbd38d;border-left:5px solid #d97706;">' +
      '<h4 style="color:#92400e;">🔗 คำทำนายเชื่อมโยงสำหรับ'+feature+'</h4>' +
      '<div class="pred-section-item"><b>🌟 สิ่งที่กำลังเด่น:</b><br/>'+(r.desc||r.short||'สถานการณ์กำลังผลักให้คุณใช้จุดแข็งของตัวเองให้เหมาะกับสิ่งที่เกิดขึ้น')+'</div>' +
      '<div class="pred-section-item"><b>🧭 เมื่อเจอสถานการณ์จริง:</b><br/>ให้สังเกตว่าประเด็นใดกำลังเกิดขึ้นซ้ำ คนใดหรือโอกาสใดกำลังเข้ามา และสิ่งใดทำให้คุณรู้สึกว่าต้องตัดสินใจ จากนั้นเลือกการกระทำที่ทำให้เห็นผลจริงทีละขั้น</div>' +
      '<div class="pred-section-item"><b>💡 แก่นของคำทำนาย:</b><br/>อย่าอ่านเหตุการณ์แยกจากตัวคุณเอง จุดสำคัญคือการนำความสามารถที่มีไปใช้ให้ถูกจังหวะ แล้วปล่อยให้ผลลัพธ์จริงเป็นตัวบอกว่าควรเดินหน้าต่อหรือปรับแผน</div>' +
      '</div>';
  }

  function renderBaseSection(res) {
    var b = res.baseDeep || {};
    var rel = Engine.calcElementRelation(res.ownerElement && res.ownerElement.name, res.baseElement && res.baseElement.name);
    var h = sectionTilesHtml(res, res.baseCode, res.baseRabbit, res.baseElement, rel, '🐇 รหัสพื้นดวงเลข ' + res.baseCode);
    h += '<div class="pred-block" style="background:#f0fdf4;border-color:#bbf7d0;border-left:5px solid #15803d;">';
    h += '<h4 style="color:#166534;">🔎 สรุปพื้นดวงแบบอ่านแล้วเข้าใจทันที</h4>';
    h += '<div class="answer-box good"><b>🧬 ตัวตนและแกนชีวิต</b><br/>' + (b.core || b.title || '-') + '</div>';
    h += '<div class="pred-section-item"><b>👤 ตัวตนที่เด่น:</b><br/>' + (b.self || '-') + '</div>';
    if (res.nameRes && res.nameRes.prediction) { h += '<div class="pred-block"><h4>🔢 คำทำนายเลขชื่อ-นามสกุล · เลข ' + res.nameRes.num + '</h4><div class="pred-section-item"><b>✨ พลังของชื่อ:</b><br/>' + (res.nameRes.prediction.title || '-') + '</div><div class="pred-section-item"><b>🔮 คำทำนาย:</b><br/>' + (res.nameRes.prediction.desc || '-') + '</div></div>'; }
    h += '<div class="pred-section-item"><b>⚠️ จุดที่ควรระวัง:</b><br/>' + (b.blind || '-') + '</div>';
    h += '<div class="pred-section-item"><b>🧱 บทเรียนสำคัญ:</b><br/>' + (b.lesson || '-') + '</div>';
    h += '<div class="pred-section-item"><b>🔀 จุดเปลี่ยนของชีวิต:</b><br/>' + (b.turn || '-') + '</div>';
    h += '<div class="pred-section-item"><b>⏳ จังหวะชีวิต:</b><br/>' + (b.timing || '-') + '</div>';
    h += '</div>';
    return h;
  }

  function renderAscSection(res) {
    return ascendantHtml(res, { noLucky: true, noChant: true });
  }

  // เสียงสะท้อนเชิงใคร่ครวญจากเลขกระต่าย ใช้ถ้อยคำอบอุ่น ไม่ตัดสิน และไม่อ้างว่าอ่านใจได้แน่นอน
  function rabbitSubconsciousVoice(num) {
    var voices = {
      1: { core:'ลึก ๆ คุณอาจอยากเริ่มต้นหรือพิสูจน์ตัวเองในบางเรื่อง แต่ก็อาจกลัวว่าจะยังไม่พร้อม', worry:'ฉันกำลังรอความพร้อมที่สมบูรณ์แบบอยู่หรือเปล่า', need:'คุณมีสิทธิ์เริ่มจากก้าวเล็ก ๆ โดยไม่ต้องทำทุกอย่างให้สำเร็จในครั้งเดียว', step:'เลือกสิ่งหนึ่งที่ทำได้วันนี้ แล้วอนุญาตให้ตัวเองเรียนรู้ระหว่างทาง' },
      2: { core:'คุณอาจต้องการความมั่นใจและพื้นที่ปลอดภัยก่อนตัดสินใจ เพราะไม่อยากพลาดหรือทำให้ใครผิดหวัง', worry:'ข้อมูลอะไรที่ฉันยังต้องรู้ และอะไรคือความกลัวที่กำลังทำให้ฉันลังเล', need:'ความรู้สึกของคุณมีความหมาย แต่คุณไม่จำเป็นต้องรอให้ทุกอย่างแน่นอนทั้งหมด', step:'ค่อย ๆ ตรวจสอบข้อเท็จจริง รับฟังตัวเอง และกำหนดเวลาที่จะกลับมาตัดสินใจ' },
      3: { core:'คุณอาจมีแรงอยากเดินหน้าและอยากเห็นผล แต่บางครั้งก็แบกหลายอย่างไว้พร้อมกันจนเหนื่อย', worry:'เรื่องไหนสำคัญกับฉันจริง ๆ และเรื่องไหนที่ฉันรับไว้เพราะเกรงใจ', need:'คุณไม่จำเป็นต้องทำทุกอย่างเพื่อพิสูจน์คุณค่าของตัวเอง', step:'เลือกเรื่องสำคัญที่สุดหนึ่งเรื่อง แล้วค่อย ๆ ทำให้เห็นความคืบหน้า' },
      4: { core:'คุณอาจกำลังมองหาความมั่นคงและอยากให้ทุกอย่างอยู่ในแบบที่พอคาดเดาได้', worry:'ฉันกำลังจัดระเบียบเพื่อช่วยตัวเอง หรือกำลังพยายามควบคุมทุกอย่างเพราะไม่สบายใจ', need:'ความมั่นคงสร้างได้ทีละส่วน และไม่จำเป็นต้องแบกทุกอย่างไว้คนเดียว', step:'จัดการสิ่งที่ควบคุมได้ก่อน แล้วเผื่อพื้นที่ให้สิ่งที่ยังไม่แน่นอน' },
      5: { core:'คุณอาจพยายามดูแลหลายด้านให้สมดุล จนบางครั้งลืมถามว่าตัวเองไหวแค่ไหน', worry:'ฉันกำลังฝืนต่อเพราะคิดว่าต้องเข้มแข็งอยู่ตลอดหรือเปล่า', need:'การพักและขอความช่วยเหลือไม่ได้ทำให้คุณอ่อนแอลง', step:'หยุดเช็กความรู้สึกและความต้องการของตัวเองสักนิด แล้วเลือกสิ่งที่ช่วยให้ใจและกายเบาลง' },
      6: { core:'ส่วนหนึ่งของคุณอาจพร้อมเปลี่ยนแปลง แต่อีกส่วนยังผูกพันกับวิธีเดิมที่เคยทำให้รู้สึกปลอดภัย', worry:'อะไรที่ฉันยังทำแบบเดิมเพียงเพราะคุ้นเคย แม้มันไม่เหมาะกับฉันแล้ว', need:'คุณเปลี่ยนใจหรือปรับวิธีได้ โดยไม่จำเป็นต้องตำหนิตัวเองในอดีต', step:'ลองวิธีใหม่ในขนาดเล็ก แล้วดูจากผลจริงว่ามันเหมาะกับคุณแค่ไหน' },
      7: { core:'คุณอาจมีเรื่องค้างใจหรือภาระบางอย่างที่ใช้พลังไปมากกว่าที่คนอื่นมองเห็น', worry:'มีเรื่องไหนที่ฉันควรวางขอบเขต ปิดให้จบ หรือยอมปล่อยลงบ้าง', need:'คุณไม่จำเป็นต้องแก้ทุกเรื่องด้วยตัวเอง และไม่จำเป็นต้องย้อนกลับไปแบกสิ่งเดิมเสมอ', step:'เลือกจัดการเรื่องค้างคาทีละเรื่อง พร้อมให้สิทธิ์ตัวเองพักระหว่างทาง' },
      8: { core:'คุณอาจให้ความสำคัญกับความมั่นคงและผลลัพธ์ จนกดดันตัวเองให้ต้องทำได้ดีอย่างต่อเนื่อง', worry:'ฉันกำลังวัดคุณค่าของตัวเองจากผลงานหรือความสำเร็จมากเกินไปหรือไม่', need:'คุณมีคุณค่าแม้ในวันที่ผลลัพธ์ยังไม่เป็นอย่างหวัง', step:'วางแผนให้พอดีกับกำลังของตัวเอง และมองความคืบหน้าเล็ก ๆ ว่าเป็นความก้าวหน้าเช่นกัน' },
      9: { core:'คุณอาจอยากให้เรื่องต่าง ๆ ดีขึ้นทั้งสำหรับตัวเองและคนรอบข้าง จนเผลอรับความรู้สึกของคนอื่นมาไว้กับตัว', worry:'อะไรคือสิ่งที่ฉันอยากทำจากใจ และอะไรที่ฉันทำเพราะรู้สึกว่าต้องช่วยทุกคน', need:'คุณดูแลคนอื่นได้โดยไม่ต้องละเลยความต้องการของตัวเอง', step:'เลือกสิ่งที่มีความหมายกับคุณจริง ๆ และแบ่งแรงไว้ให้ตัวเองด้วย' }
    };
    return voices[parseInt(num, 10)] || voices[9];
  }

  function renderTopicShortSection(res, reading) {
    var pred = res.topicPred || {};
    var frame = reading && reading.frame ? reading.frame : null;
    var rabbitNum = parseInt(res.R4, 10) || 9;
    var voice = rabbitSubconsciousVoice(rabbitNum);
    var topic = (res.categoryName || 'เรื่องที่เลือก') + (res.subTopicName ? ' · ' + res.subTopicName : '');
    var focusText = frame && frame.focus ? frame.focus : (pred.answer || pred.easy || 'ค่อย ๆ มองสถานการณ์จริงและสิ่งที่สำคัญกับคุณ');
    var questionText = frame && frame.question ? frame.question : 'อะไรคือสิ่งที่คุณต้องการและให้ความสำคัญที่สุดในเรื่องนี้';
    var lookText = frame && frame.look ? frame.look : 'สังเกตข้อมูลจริง การกระทำของคนที่เกี่ยวข้อง และความรู้สึกของตัวเอง';
    var h = sectionTilesHtml(res, res.R4, res.rabbit, res.element, res.relation, '🐇 รหัสคำทำนายพื้นฐานเลข ' + res.R4);
    h += '<div class="pred-block subconscious-shared-voice" style="background:#fff7ed;border-color:#fed7aa;border-left:5px solid #ea580c;">';
    h += '<h4 style="color:#9a3412;">🎯 ภาพรวมเรื่อง' + topic + ' · เสียงสะท้อนจากใจคุณ</h4>';
    h += '<div class="pred-section-item"><b>💗 ภาพที่ใจอาจกำลังสะท้อน:</b><br/>' + voice.core + ' เมื่อมองเรื่อง' + topic + ' ลองใช้สิ่งนี้เป็นมุมหนึ่งในการทำความเข้าใจตัวเอง ไม่ใช่ข้อสรุปตายตัว</div>';
    h += '<div class="pred-section-item"><b>🔮 แนวโน้มของเรื่องที่เลือก:</b><br/>' + focusText + '</div>';
    h += '<div class="pred-section-item"><b>🫶 สิ่งที่ใจอาจกำลังกังวลหรือถามหา:</b><br/>' + voice.worry + ' ลองเชื่อมโยงกับคำถามนี้อย่างอ่อนโยน: ' + questionText + '</div>';
    h += '<div class="pred-section-item"><b>🔔 สิ่งที่อยากชวนให้สังเกต:</b><br/>' + lookText + ' ลองสังเกตทั้งเหตุการณ์จริงและความรู้สึกของคุณ โดยไม่ต้องรีบตัดสินตัวเอง</div>';
    h += '<div class="pred-section-item"><b>🧭 ก้าวเล็ก ๆ ที่ดูแลใจตัวเองได้:</b><br/>' + voice.need + ' ' + voice.step + '</div>';
    h += '</div>';
    return h;
  }

  function renderTopicMonthSection(res) {
    var topicLabel = 'เรื่อง' + res.categoryName + (res.subTopicName ? ' (' + res.subTopicName + ')' : '');
    var h = sectionTilesHtml(res, res.R4, res.rabbit, res.element, res.relation, '🐇 รหัสคำทำนายเลข ' + res.R4);
    h += monthTrendHtml(res.monthPredictions, '#eef2ff', '#c7d2fe', '#3730a3', '📅 ' + topicLabel + ' · 3 เดือน', '');
    return h;
  }

  // ---------- บล็อกพื้นดวงตามโหรกระต่าย ----------
  function baseChartHtml(res, expanded) {
    if (!res || !res.baseDeep) return '';
    var b = res.baseDeep;
    var code = res.baseCode;
    var rabbit = res.baseRabbit || Engine.RABBITS[code];
    var elem = res.baseElement || Engine.getElement(code);
    var h = '<div class="pred-block" style="background:#f0fdf4; border-color:#bbf7d0; border-left:5px solid #15803d;">';
    h += '<h4 style="color:#166534;">\u{1F407} พื้นดวงตามโหรกระต่าย</h4>';


    h += '<div class="pred-section-item"><b>' + b.title + ':</b><br/>' + b.core + '</div>';
    h += '<div class="pred-section-item"><b>\u{1FA9E} ตัวตนที่แท้จริง:</b><br/>' + b.self + '</div>';

    h += '<div class="dd-grid" style="margin-top:8px;">' +
      kvBox('\u{1F381} พรสวรรค์ติดตัว', 'dd-do', b.gift) +
      kvBox('\u{1F573}\u{FE0F} สิ่งที่อาจมองข้ามที่เจ้าตัวมองไม่เห็น', 'dd-dont', b.blind) +
      '</div>';

    h += '<div class="pred-section-item"><b>\u{1F465} บทบาทต่อคนรอบข้าง:</b><br/>' + b.social + '</div>';

    h += '<span class="mini-h">\u{1F50E} พื้นดวงนี้ส่งผลกับ 4 ด้านของชีวิตอย่างไร</span>';
    h += '<div class="mth3">' +
      '<div class="mth"><b>\u{1F4BC} ด้านการงาน</b>' + b.work + '</div>' +
      '<div class="mth"><b>\u{1F4B0} ด้านการเงิน</b>' + b.money + '</div>' +
      '<div class="mth"><b>\u{2764}\u{FE0F} ด้านความรัก</b>' + b.love + '</div>' +
      '<div class="mth"><b>\u{1FA7A} ด้านสุขภาพ</b>' + b.health + '</div>' +
      '</div>';

    h += '<span class="mini-h">\u{1F9ED} บทเรียน · จุดเปลี่ยน · จังหวะชีวิต</span>';
    h += '<div class="pred-section-item"><b>\u{1FA9C} บทเรียนหลักของพื้นดวงนี้:</b><br/>' + b.lesson + '</div>';
    h += '<div class="pred-section-item"><b>\u{1F500} จุดเปลี่ยนสำคัญของชีวิต:</b><br/>' + b.turn + '</div>';
    h += '<div class="pred-section-item"><b>\u{23F3} จังหวะชีวิต:</b><br/>' + b.timing + '</div>';

    h += '<span class="mini-h">\u{1F9ED} แนวทางใช้พื้นดวงให้เป็นประโยชน์</span>' + doDontHtml(b.do, b.dont);
    h += '<span class="mini-h">\u{1F5FA}\u{FE0F} แผนลงมือ 3 ขั้นตามพื้นดวง</span>' + stepsHtml(b.plan, '#15803d');
    h += luckyChipsHtml(b.lucky);
    h += chantBoxHtml(b.chant, 'คาถาประจำพื้นดวง');
    h += '<div class="role-box" style="background:#f0fdf4; border-color:#bbf7d0; color:#166534;"><b>\u{1F4AC} คำยืนยันของพื้นดวงนี้:</b> ' + b.affirmation + '</div>';
    if (b.questions && b.questions.length) {
      h += '<span class="mini-h">\u{2753} คำถามสำรวจพื้นดวงของตัวเอง</span>';
      h += '<div class="pred-section-item">' + listHtml(b.questions) + '</div>';
    }
    return h + '</div>';
  }

  function kvBox(title, cls, text) {
    return '<div class="dd-box ' + cls + '"><b>' + title + '</b><ul><li>' + text + '</li></ul></div>';
  }

  function ascendantHtml(res, opts) {
    if (res && res.unavailableNoBirthTime) return '<div class="pred-block"><b>🌅 ไม่สามารถคำนวณลัคนาราศีได้</b><br/>ต้องระบุเวลาเกิดก่อน จึงจะคำนวณส่วนที่ใช้เวลาเกิดได้</div>';
    var noChant = !!(opts && opts.noChant);
    var noLucky = !!(opts && opts.noLucky);
    if (!res || !res.ascendant) return '';
    var a = res.ascendant;
    var s = a.sign;
    var num = res.ascNum;
    var rabbit = res.ascRabbit || Engine.RABBITS[num];
    var elem = res.ascElement || Engine.getElement(num);
    var d = res.ascDeep;
    var inn = res.ascInnerDeep;
    var face = res.ascFaceDeep;
    var timeText = res.noBirthTime
      ? 'ไม่ทราบเวลาเกิด · ใช้ 12:00 น. เป็นค่ากลาง'
      : pad2(res.birthHour) + ':' + pad2(res.birthMin) + ' น.';

    var h = '<div class="pred-block" style="background:#f0f9ff; border-color:#bae6fd; border-left:5px solid #0369a1;">';
    h += '<h4 style="color:#075985;">🌅 ลัคนาราศี · จิตสำนึกจากเวลาเกิดของเจ้าชะตา</h4>';

    h += '<div class="pred-section-item"><b>✨ ลัคนาราศี:</b><br/>' +
      '<b style="font-size:14px;">ราศี' + s.name + ' ' + s.symbol + '</b></div>';
    h += '<div class="pred-section-item"><b>🪞 ลัคนาราศีนี้เป็นอย่างไร:</b><br/>' + s.trait + '</div>';
    if (d) {
      // แสดงเฉพาะจุดแข็งและจุดที่ต้องระวัง โดยตัดหัวข้อที่ผู้ใช้ไม่ต้องการออก
      h += '<div class="dd-grid">' +
        kvBox('💪 จุดแข็งที่ลัคนานี้มอบให้', 'dd-do', d.strength) +
        kvBox('⚠️ จุดที่ต้องระวัง', 'dd-dont', d.watch) +
        '</div>';

      // คงไว้เฉพาะสังคมและจังหวะเวลา ตามที่ผู้ใช้ต้องการ
      h += '<span class="mini-h">👥 สังคมและคนรอบข้าง · ⏳ จังหวะเวลาที่ลัคนานี้เด่น</span>';
      h += '<div class="mth3">' +
        '<div class="mth"><b>👥 สังคมและคนรอบข้าง</b>' + d.people + '</div>' +
        '<div class="mth"><b>⏳ จังหวะเวลาที่ลัคนานี้เด่น</b>' + d.timing + '</div>' +
        '</div>';
    }

    // ── เสียงในใจ
    if (inn) {
      h += '<span class="mini-h">🎭 เสียงในใจของลัคนานี้ (รหัสกระต่าย ' + res.ascInner + ' ' + (res.ascInnerRabbit ? res.ascInnerRabbit.name : '') + ')</span>';
      h += '<div class="pred-section-item"><b>🚀 แรงขับลึก:</b><br/>' + inn.drive + '</div>';
      h += '<div class="pred-section-item"><b>🤫 เสียงที่พูดกับตัวเองบ่อยที่สุด:</b><br/>' + inn.whisper + '</div>';
      h += '<div class="pred-section-item"><b>😰 สิ่งที่กลัวที่สุดในใจ:</b><br/>' + inn.fear + '</div>';
      h += '<div class="pred-section-item"><b>🫶 สิ่งที่ต้องการจริง ๆ:</b><br/>' + inn.need + '</div>';
      h += '<div class="pred-section-item"><b>📣 เสียงนี้จะดังที่สุดเมื่อ:</b><br/>' + inn.when + '</div>';
    }

    if (d) {
      // ── สิ่งที่ควรทำ / สิ่งที่ควรเลี่ยง
      // แสดงเฉพาะคำแนะนำที่ไม่ซ้ำกับคำทำนายส่วนอื่นของลัคนา
      var ascDoList = (d.do || []).slice();
      var ascDontList = (d.dont || []).slice();
      var ascOtherPredictionText = [
        d.strength, d.watch, d.people, d.timing,
        inn && inn.drive, inn && inn.whisper, inn && inn.fear, inn && inn.need, inn && inn.when
      ].filter(Boolean).map(function(v) { return String(v).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); });
      function ascAdviceNorm(value) {
        return String(value || '').toLowerCase()
          .replace(/<[^>]*>/g, ' ')
          .replace(/[\sๆ.,!?;:()“”‘’"'“”ฯ๚—–-]/g, '')
          .trim();
      }
      function ascAdviceIsDuplicate(value, priorValues) {
        var norm = ascAdviceNorm(value);
        if (!norm) return true;
        return priorValues.some(function(prior) {
          var other = ascAdviceNorm(prior);
          if (!other) return false;
          if (norm === other) return true;
          // ตรวจข้อความที่แทบเหมือนกัน โดยไม่ตัดคำแนะนำสั้น ๆ ที่มีความหมายต่างกัน
          return Math.min(norm.length, other.length) >= 24 &&
            (norm.indexOf(other) >= 0 || other.indexOf(norm) >= 0);
        });
      }
      var usedAscAdvice = ascOtherPredictionText.slice();
      ascDoList = ascDoList.filter(function(item) {
        if (ascAdviceIsDuplicate(item, usedAscAdvice)) return false;
        usedAscAdvice.push(item);
        return true;
      }).slice(0, 5);
      ascDontList = ascDontList.filter(function(item) {
        if (ascAdviceIsDuplicate(item, usedAscAdvice)) return false;
        usedAscAdvice.push(item);
        return true;
      }).slice(0, 5);
      h += '<span class="mini-h">🧭 สิ่งที่ควรทำและสิ่งที่ควรเลี่ยงตามลัคนานี้</span>' +
        (ascDoList.length || ascDontList.length ? doDontHtml(ascDoList, ascDontList) : '<div class="pred-section-item">คำแนะนำของลัคนานี้มีเนื้อหาซ้ำกับคำทำนายส่วนอื่น จึงไม่แสดงซ้ำ</div>');

      // ── มงคล
      if (!noLucky) h += luckyChipsHtml(d.lucky);
      if (!noChant) h += chantBoxHtml(d.chant, 'คาถาประจำลัคนา');
      h += '<div class="role-box" style="background:#ecfeff; border-color:#a5f3fc; color:#155e75;"><b>💬 คำยืนยันของลัคนานี้:</b> ' + d.affirmation + '</div>';

      // ── คำถามสำรวจตัวเอง
      if (d.questions && d.questions.length) {
        h += '<span class="mini-h">❓ คำถามสำรวจจิตสำนึกของตัวเอง (ตอบกับตัวเองตามจริง)</span>';
        h += '<div class="pred-section-item">' + listHtml(d.questions) + '</div>';
      }
    }

    return h + '</div>';
  }

  function monthTrendHtml(list, bg, border, hcolor, title, note) {
    if (!list || !list.length) return '';
    var html = '<div class="pred-block" style="background:' + (bg || '#f0fff4') + '; border-color:' + (border || '#c6f6d5') + '; margin-top:16px;">' +
      '<h4 style="color:' + (hcolor || '#22543d') + ';">' + (title || '📅 แนวโน้มดวงชะตารายเดือน (3 เดือนถัดไป)') + '</h4>' +
      (note ? '<div class="pred-section-item" style="margin-top:2px;">' + note + '</div>' : '') +
      '<div class="month-grid">';
    list.forEach(function (m, idx) {
      html += '<div class="month-card">' +
        '<div class="month-header"><span class="month-name">เดือนที่ ' + (idx + 1) + ': ' + m.monthName + '</span>' +
        '</div>' +
        '<div style="font-size:13px; font-weight:700; color:#2d3748; margin-bottom:4px;">🐇 พฤติกรรม: ' + m.rabbit.name + ' ' + elementTag(m.element) + '</div>' +
        (m.keyword ? '<div style="font-size:12px; font-weight:700; color:#5b21b6; margin-bottom:4px;">🔑 ' + m.keyword + ' (' + m.rabbitShort + ')</div>' : '') +
        '<div style="font-size:12.5px; color:#4a5568;"><b>ภาพรวม:</b> ' + m.prediction + '</div>' +
        (m.advice ? '<div style="font-size:12.5px; color:#22543d; margin-top:4px;"><b>แนวทาง:</b> ' + m.advice + '</div>' : '') +
        (m.rabbitTiming ? '<div style="font-size:12px; color:#718096; margin-top:4px;"><b>จังหวะเวลา:</b> ' + m.rabbitTiming + '</div>' : '') +
        '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderTarotRuneSection(res) {
    var birth=res.birthCard||{}, event=res.eventCard||res.dailyCard||{}, rune=res.rune||[], dailyRune=res.dailyRune||[];
    var joint=res.rabbitJoint||{}, rabbit=joint.rabbit||res.rabbitFusionRabbit||{}, code=joint.R4||9;
    var minorRankThai={Ace:'เอซ',Two:'สอง',Three:'สาม',Four:'สี่',Five:'ห้า',Six:'หก',Seven:'เจ็ด',Eight:'แปด',Nine:'เก้า',Ten:'สิบ',Page:'เพจ',Knight:'ไนท์',Queen:'ควีน',King:'คิง'};
    var suitThai=event.thaiSuit||(event.suit==='Wands'?'ไม้เท้า':event.suit==='Cups'?'ถ้วย':event.suit==='Pentacles'?'เหรียญ':event.suit==='Swords'?'ดาบ':'');
    var eventName=event.name||'Daily Tarot Card';
    var birthName=birth.name||'-', runeName=rune[0]||'รูน', runeSymbol=rune[1]||'', dailyName=dailyRune[0]||'รูนประจำวัน', dailySymbol=dailyRune[1]||'';
    var birthMeaning=(Engine && typeof Engine.tarotSelfMeaning==='function' ? Engine.tarotSelfMeaning(birth,'personal') : '')||'ใช้ความหมายของไพ่ใบนี้เป็นจุดเริ่มต้นในการทบทวนตัวเองอย่างอ่อนโยน', eventMeaning=(Engine && typeof Engine.tarotSelfMeaning==='function' ? Engine.tarotSelfMeaning(event,'daily') : '')||'ลองสังเกตว่าเหตุการณ์วันนี้สะท้อนความต้องการหรือความกังวลอะไรในใจ', runeMeaning=(Engine && typeof Engine.runeSelfMeaning==='function' ? Engine.runeSelfMeaning(rune) : (rune && rune[2] || 'ใช้รูนเป็นจุดเริ่มต้นในการทบทวนตัวเอง')), dailyMeaning=(Engine && typeof Engine.runeSelfMeaning==='function' ? Engine.runeSelfMeaning(dailyRune) : (dailyRune && dailyRune[2] || 'ลองใช้ความหมายของรูนเป็นแนวทางทบทวนวันนี้'));
    var personalCrystal=res.personalCrystal||(Engine && typeof Engine.crystalFromNumber==='function' ? Engine.crystalFromNumber(res.birthSum||1) : {name:'คริสตัลประจำตัว',healing:'ใช้เป็นสัญลักษณ์เตือนใจในการดูแลตัวเอง'});
    var dailyElement=res.dailyElement||(Engine && typeof Engine.calcDailyElement==='function' ? Engine.calcDailyElement(new Date()) : {dateSum:0,finalNum:9});
    var dateSum=dailyElement.dateSum||((new Date()).getDate()+(new Date()).getMonth()+1+(new Date()).getFullYear());
    var dailyCrystalDate=res.dailyCrystalDate||(Engine && typeof Engine.crystalFromNumber==='function' ? Engine.crystalFromNumber(dateSum*6) : {name:'คริสตัลประจำวัน',healing:'ใช้เป็นเครื่องเตือนใจให้กลับมาอยู่กับปัจจุบัน'});
    var dailyCrystalRabbitElement=res.dailyCrystalRabbitElement||(Engine && typeof Engine.crystalFromNumber==='function' ? Engine.crystalFromNumber((res.rabbitJoint&&res.rabbitJoint.R4||9)+(dailyElement.finalNum||9)) : {name:'คริสตัลเชื่อมโหรกระต่าย',healing:'ใช้เป็นสัญลักษณ์เตือนใจให้เข้าใจตัวเอง'});
    var rabbitReflection={
      1:'คุณอาจกำลังรอความมั่นใจเพื่อเริ่มต้น ไพ่ รูน และคริสตัลวันนี้ชวนให้เชื่อในก้าวเล็ก ๆ โดยไม่ต้องพิสูจน์ทุกอย่างให้ใครเห็น',
      2:'คุณอาจรับรู้ความรู้สึกละเอียดอ่อนของตัวเองและคนรอบข้างได้มาก ลองให้เวลากับใจ พร้อมแยกความรู้สึกออกจากข้อเท็จจริงอย่างอ่อนโยน',
      3:'การสื่อสารและการแสดงตัวตนเป็นประเด็นสำคัญ ลองถามตัวเองว่าคุณได้พูดสิ่งที่ต้องการจริง ๆ หรือกำลังพูดเพื่อให้ทุกคนพอใจ',
      4:'คุณอาจต้องการความมั่นคงและความชัดเจน ลองจัดระบบในสิ่งที่ควบคุมได้ พร้อมยอมให้บางเรื่องค่อย ๆ คลี่คลายตามเวลา',
      5:'คุณอาจกำลังปรับตัวกับทางเลือกหรือการเปลี่ยนแปลง ไม่จำเป็นต้องรู้คำตอบทั้งหมดในวันนี้ เลือกก้าวที่เหมาะกับตัวเองตอนนี้ก็พอ',
      6:'คุณอาจดูแลความต้องการของคนอื่นจนลืมถามใจตัวเอง ลองให้ความสำคัญกับขอบเขตและความต้องการของตัวเองเท่า ๆ กับคนที่คุณรัก',
      7:'คุณอาจต้องการความแน่ใจและข้อมูลที่ครบถ้วน ลองใช้การทบทวนเพื่อช่วยตัดสินใจ ไม่ใช่เพื่อทำให้ตัวเองติดอยู่กับความคิดวนซ้ำ',
      8:'เป้าหมายและความสำเร็จอาจมีน้ำหนักมากในใจ ลองถามว่าคุณกำลังสร้างชีวิตที่ต้องการจริง ๆ หรือกำลังเหนื่อยกับการต้องดูเข้มแข็งตลอดเวลา',
      9:'คุณอาจอยู่ในช่วงทบทวนหรือปล่อยบางสิ่งที่หมดความหมาย ให้พื้นที่กับความรู้สึกเสียดายได้ โดยไม่จำเป็นต้องกลับไปแบกสิ่งเดิมอีก'
    };
    var rabbitAdvice={1:'เริ่มจากสิ่งเล็กที่ทำได้จริง',2:'ฟังใจตัวเองและตรวจสอบข้อเท็จจริง',3:'สื่อสารความต้องการอย่างตรงไปตรงมา',4:'แบ่งเรื่องใหญ่เป็นขั้นตอนเล็ก ๆ',5:'เปิดรับทางเลือกโดยไม่เร่งตัดสิน',6:'ดูแลตัวเองพร้อมกับดูแลคนอื่น',7:'หยุดคิดวนเมื่อมีข้อมูลเพียงพอ',8:'ให้คุณค่ากับตัวเองนอกเหนือจากผลงาน',9:'ค่อย ๆ วางสิ่งที่ไม่จำเป็นต้องแบก'};
    var rabbitText=rabbitReflection[code]||'ใช้สัญลักษณ์เหล่านี้เป็นจุดเริ่มต้นในการสำรวจความรู้สึก แล้วเลือกสิ่งที่สอดคล้องกับชีวิตจริงของคุณ';
    var h='';
    h+='<div class="pred-block" style="background:#fff7ed;border-color:#fed7aa;border-left:5px solid #ea580c;">';
    h+='<h4 style="color:#9a3412;">🌙 พลังประจำตัว · ไพ่ + รูน + คริสตัล + โหรกระต่าย</h4>';
    h+='<div class="pred-section-item"><b>🃏 ไพ่ประจำตัว: '+birthName+'</b><br/>'+birthMeaning+'</div>';
    if (res.rune) h+='<div class="pred-section-item"><b>ᚠ รูนประจำตัว: '+runeName+' '+runeSymbol+'</b><br/>'+runeMeaning+'</div>';
    else h+='<div class="pred-section-item"><b>ᚠ รูนประจำตัว:</b><br/>ไม่ได้คำนวณเพราะไม่ได้ระบุเวลาเกิด คุณยังใช้ไพ่และคริสตัลเป็นจุดเริ่มต้นในการทบทวนตัวเองได้</div>';
    h+='<div class="pred-section-item"><b>💎 คริสตัลประจำตัว: '+personalCrystal.name+'</b><br/>'+personalCrystal.healing+' ใช้เป็นสัญลักษณ์เตือนใจ ไม่ใช่สิ่งที่กำหนดตัวตนของคุณ</div>';
    h+='<div class="pred-section-item"><b>🐇 โหรกระต่ายกับการเข้าใจตัวเอง (เลข '+code+'):</b><br/>'+rabbitText+'<br/><b>ก้าวที่อาจช่วยได้:</b> '+(rabbitAdvice[code]||'ค่อย ๆ เลือกสิ่งที่เหมาะกับตัวเอง')+'</div>';
    h+='</div>';
    h+='<div class="pred-block" style="background:#ecfeff;border-color:#a5f3fc;border-left:5px solid #0891b2;">';
    h+='<h4 style="color:#0e7490;">☀️ พลังประจำวัน · ไพ่ + รูน + คริสตัล + โหรกระต่าย</h4>';
    h+='<div class="pred-section-item"><b>🃏 ไพ่ประจำวัน / ไพ่เหตุการณ์: '+eventName+'</b><br/>'+eventMeaning+'</div>';
    h+='<div class="pred-section-item"><b>ᚠ รูนประจำวัน: '+dailyName+' '+dailySymbol+'</b><br/>'+dailyMeaning+'</div>';
    h+='<div class="pred-section-item"><b>💎 คริสตัลประจำวัน: '+dailyCrystalDate.name+'</b><br/>'+dailyCrystalDate.healing+'</div>';
    h+='<div class="pred-section-item"><b>💎 คริสตัลที่เชื่อมกับโหรกระต่ายวันนี้: '+dailyCrystalRabbitElement.name+'</b><br/>'+dailyCrystalRabbitElement.healing+'</div>';
    h+='<div class="pred-section-item"><b>🌤️ คำทำนายรวมกับโหรกระต่าย (เลข '+code+'):</b><br/>'+rabbitText+' วันนี้ลองนำสิ่งที่ไพ่และรูนสะท้อนมาเทียบกับความรู้สึกและเหตุการณ์จริง ไม่จำเป็นต้องเชื่อทุกอย่างหรือรีบหาคำตอบทันที</div>';
    h+='</div>';
    return h;
  }

  function renderLoveEntrantSection(res) {
    var h='<span class="card-title">👤 ลักษณะคนที่จะเข้ามา · วิเคราะห์ตามโหรกระต่าย</span>';
    h+='<div class="pred-block"><h4>🎯 สรุปให้เข้าใจทันที</h4><div class="pred-section-item">รหัสกระต่าย <b>'+res.R4+'</b> · '+res.rabbit.name+'   '+res.rabbit.short+'<br/>'+res.highlight+'</div></div>';
    h+='<div class="pred-block"><h4>👤 ลักษณะคนที่จะเข้ามา</h4><div class="mth3">';
    h+='<div class="mth"><b>🎂 อายุ</b><br/>'+res.age+'</div>';
    h+='<div class="mth"><b>🧠 ลักษณะนิสัย</b><br/>'+res.personality+'</div>';
    h+='<div class="mth"><b>💼 การงาน / ฐานชีวิต</b><br/>'+res.work+'</div>';
    h+='<div class="mth"><b>👔 บุคลิก / ภาพลักษณ์</b><br/>'+res.image+'</div>';
    h+='<div class="mth"><b>📍 ช่องทางหรือจังหวะที่พบ</b><br/>'+res.meeting+'</div>';
    h+='<div class="mth"><b>❤️ รูปแบบความสัมพันธ์</b><br/>'+res.relationship+'</div>';
    h+='</div></div>';
    h+='<div class="pred-block" style="background:#fff7ed;border-color:#fed7aa;"><h4>🐇 โหรกระต่ายเป็นแกนกลาง</h4><div class="pred-section-item">ใช้รหัสกระต่าย <b>'+res.rabbitJoint.R4+'</b> เป็นแกนอ่านบุคลิกและจังหวะของคนที่มีแนวโน้มเข้ามา โดยควรนำพฤติกรรมจริงและการสื่อสารมาเทียบร่วมด้วย</div><div class="pred-section-item"><b>⚠️ ดูแลเรื่องนี้อย่างอ่อนโยน:</b><br/>'+res.caution+'</div></div>';
    return h;
  }

  // แปลงภาษาคำทำนายโอเรกุรัมให้อ่านง่ายในส่วนแสดงผล โดยไม่แตะสูตรคำนวณ
  function modernOreguText(text) {
    if (text == null) return '';
    return String(text)
      .replace(/เจ้าชะตา/g, 'ตัวคุณ')
      .replace(/ดวงชะตา/g, 'ภาพรวมดวง')
      .replace(/ชะตา/g, 'ดวง')
      .replace(/มีเกณฑ์/g, 'มีแนวโน้ม')
      .replace(/สมประสงค์/g, 'ได้ตามที่หวัง')
      .replace(/ลาภผลเงินทอง/g, 'เงินพิเศษและรายรับ')
      .replace(/ลาภใหญ่/g, 'เงินก้อนใหญ่')
      .replace(/บริวาร/g, 'คนในทีม')
      .replace(/มิตรและบริวาร/g, 'เพื่อนและคนรอบตัว')
      .replace(/ศัตรูคู่แข่ง/g, 'คู่แข่งหรือคนที่ไม่หวังดี')
      .replace(/นิมิตความฝัน/g, 'ความฝันและสัญญาณใจ')
      .replace(/นิมิตหมายดี/g, 'สัญญาณที่เป็นบวก')
      .replace(/อสังหาริมทรัพย์/g, 'บ้านและที่ดิน');
  }

  // แสดงคำอธิบายรหัสโหรกระต่ายร่วมของแต่ละฟีเจอร์ (renderer ใช้ภายในหน้า ไม่ผูกกับ API ของ Engine)
  function rabbitJointText(joint, featureName) {
    if (!joint || !joint.rabbit) return '';
    var r = joint.rabbit, code = joint.R4, feature = featureName || 'เรื่องที่กำลังดู';
    var map = {
      1:'ช่วงนี้เหมาะกับการเปิดทางใหม่และลงมือกับเรื่องที่สำคัญที่สุดก่อน อย่ารอให้ทุกอย่างพร้อม เพราะการเริ่มต้นเล็ก ๆ จะทำให้สถานการณ์เปิดเร็วขึ้น',
      2:'ช่วงนี้ควรฟังและสังเกตให้มากกว่าการรีบตอบ คนหรือข้อมูลที่เข้ามาจะช่วยให้คุณเห็นความจริงของสถานการณ์ชัดขึ้น',
      3:'ช่วงนี้พลังเด่นอยู่ที่การพูด การติดต่อ และการผลักดัน เรื่องที่ค้างจะมีโอกาสเดินเมื่อคุณสื่อสารความต้องการให้ชัด',
      4:'ช่วงนี้ชีวิตต้องการความเป็นระบบ เรื่องที่วางแผนและจัดลำดับไว้ดีจะค่อย ๆ มั่นคง ส่วนสิ่งที่ไม่มีโครงสร้างควรจัดใหม่ก่อนขยับต่อ',
      5:'ช่วงนี้มีโอกาสเปลี่ยนแผนหรือมีทางเลือกมากกว่าหนึ่งทาง ยิ่งยืดหยุ่นและทดลองอย่างมีสติ ยิ่งเปิดโอกาสให้ได้ทางที่เหมาะกว่าเดิม',
      6:'ช่วงนี้มีเรื่องให้รับผิดชอบหลายด้าน ต้องระวังการดูแลทุกคนจนลืมความต้องการของตัวเอง การแบ่งเวลาและตั้งขอบเขตจะทำให้เรื่องต่าง ๆ ดีขึ้น',
      7:'ช่วงนี้เหมาะกับการตรวจสอบข้อมูล คิดให้ลึก และตัดสิ่งที่ไม่ชัดออกก่อนตัดสินใจ สิ่งที่ดูดีภายนอกควรตรวจรายละเอียดให้ครบ',
      8:'ช่วงนี้เด่นเรื่องผลลัพธ์ งาน เงิน อำนาจต่อรอง และการจัดการทรัพยากร หากบริหารสิ่งที่มีอยู่เป็นระบบ มีโอกาสเห็นผลชัดขึ้น',
      9:'ช่วงนี้เป็นจังหวะสะสางเรื่องเก่า ปิดสิ่งที่หมดหน้าที่ และเตรียมพื้นที่สำหรับรอบใหม่ ยิ่งปล่อยสิ่งที่ไม่จำเป็นได้เร็ว ยิ่งเห็นทางใหม่ชัดขึ้น'
    };
    var caution = {1:'อย่ารีบจนข้ามรายละเอียดสำคัญ',2:'อย่าเก็บทุกอย่างไว้ในใจจนพลาดโอกาสพูดความจริง',3:'อย่ารับปากมากกว่าที่ทำได้',4:'อย่าพยายามควบคุมทุกอย่างจนตัวเองเหนื่อย',5:'อย่าเปลี่ยนทางเพียงเพราะกลัวความไม่แน่นอน',6:'อย่ารับภาระของคนอื่นจนกระทบชีวิตตัวเอง',7:'อย่าคิดนานจนพลาดจังหวะที่เหมาะสม',8:'อย่าให้เป้าหมายหรือเงินกลบความต้องการที่แท้จริง',9:'อย่ายึดติดกับเรื่องที่จบไปแล้วเพียงเพราะเสียดาย'};
    return '<div class="pred-block" style="background:#fff7ed;border-color:#fed7aa;border-left:5px solid #ea580c;">' +
      '<h4 style="color:#9a3412;">🐇 คำทำนายโหรกระต่ายที่เชื่อมกับ'+feature+'</h4>' +
      '<div class="pred-section-item"><b>🔮 แนวโน้มหลัก:</b><br/>'+(map[code]||r.desc||r.short||'ช่วงนี้ควรอ่านสถานการณ์จากสิ่งที่เกิดขึ้นจริงและค่อย ๆ เลือกจังหวะที่เหมาะกับตัวเอง')+'</div>' +
      '<div class="pred-section-item"><b>🌟 จุดแข็งที่ใช้ให้เต็มที่:</b><br/>'+(r.desc||r.short||'ใช้จุดแข็งของตัวเองให้สอดคล้องกับสถานการณ์และไม่ฝืนจังหวะ')+'</div>' +
      '<div class="pred-section-item"><b>⚠️ สิ่งที่ต้องระวัง:</b><br/>'+(caution[code]||'อย่าให้ความกังวลทำให้คุณมองข้ามข้อมูลจริง')+'</div>' +
      '</div>';
  }


  // ---------- CTA แอดไลน์: แยกข้อความตามฟีเจอร์ ----------
  function featureCtaHtml(featureKey) {
    if (window.RABBITASTRO_ADMIN_MODE === true) return "";
    var cta = {
      base: {
        title: '🐇 อยากรู้พื้นดวงของตัวเองให้ลึกกว่านี้?',
        text: 'พื้นดวงไม่ได้มีแค่รหัสกระต่าย แต่ยังมีรายละเอียดของตัวตน จุดแข็ง พรสวรรค์ บทเรียน และจังหวะชีวิตที่อ่านต่อได้แบบเฉพาะบุคคล'
      },
      asc: {
        title: '🌅 อยากอ่านลัคนาให้ละเอียดขึ้น?',
        text: 'ลัคนาช่วยเปิดมุมการแสดงออก จิตสำนึก และรูปแบบที่คุณรับมือกับโลกภายนอก หากอยากเจาะรายละเอียดเฉพาะตัวมากขึ้น แอดไลน์เพื่อดูดวงแบบเจาะลึกได้เลย'
      },
      rhd: {
        title: '🐇 อยากอ่าน Rabbit’s Habit Design ให้ละเอียดขึ้น?',
        text: 'RHD ช่วยแยกให้เห็นว่าชีวิตกำลังเผชิญสถานการณ์แบบใด และตัวคุณมีแนวโน้มใช้พลัง ตอบสนอง และตัดสินใจอย่างไรในสถานการณ์นั้น'
      },
      loveEntrant: {
        title: '❤️ อยากรู้เรื่องคนที่จะเข้ามาให้ละเอียดขึ้น?',
        text: 'ดูต่อได้ทั้งลักษณะนิสัย อายุ บุคลิก ช่องทางที่มีโอกาสพบ และรูปแบบความสัมพันธ์ พร้อมอ่านจังหวะของความสัมพันธ์ให้ละเอียดกว่าเดิม'
      },
      topicShort: {
        title: '🎯 อยากรู้ภาพรวมของเรื่องนี้ให้ลึกกว่านี้?',
        text: 'หากอยากเจาะรายละเอียดของเรื่องที่ถาม ทั้งจังหวะ โอกาส จุดที่ต้องระวัง และแนวทางรับมือแบบเฉพาะเรื่อง แอดไลน์เพื่อดูดวงแบบเจาะลึกได้เลย'
      },
      topicMonth: {
        title: '📅 อยากดูแนวโน้ม 3 เดือนแบบละเอียด?',
        text: 'อ่านต่อได้ทั้งจังหวะเปลี่ยนแปลง โอกาสสำคัญ จุดที่ควรเตรียมตัว และแนวทางในแต่ละช่วง เพื่อให้วางแผนเรื่องนี้ได้ละเอียดขึ้น'
      },
      god: {
        title: '⛩️ อยากรู้ว่าองค์เทพจะหนุนเรื่องของคุณอย่างไร?',
        text: 'ดูต่อแบบเจาะลึกได้ทั้งความหมายขององค์เทพที่สัมพันธ์กับดวง จุดที่ควรเสริม วิธีสักการะ และจังหวะที่เหมาะกับเรื่องที่คุณถาม'
      },
      oregu: {
        title: '🔮 อยากได้คำตอบที่ชัดขึ้นสำหรับคำถามนี้?',
        text: 'แอดไลน์เพื่อดูดวงเจาะคำถาม พร้อมอ่านแนวโน้ม จังหวะที่ควรจับตา สิ่งที่ควรระวัง และทางเลือกที่เหมาะกับสถานการณ์ของคุณ'
      },
      oreguWork: {
        title: '💼 อยากรู้ว่าการงานควรไปต่อหรือเปลี่ยนทาง?',
        text: 'แอดไลน์ดูดวงการงานแบบเจาะลึก เพื่อสำรวจโอกาสที่กำลังเปิด จุดติดขัด คนหรือสถานการณ์ที่ควรสังเกต และจังหวะลงมือให้เหมาะกับคุณ'
      },
      oreguMoney: {
        title: '💰 อยากวางแผนเรื่องเงินให้มั่นใจขึ้นไหม?',
        text: 'แอดไลน์ดูดวงการเงิน เพื่ออ่านแนวโน้มรายรับรายจ่าย โอกาสที่ควรพิจารณา จุดเสี่ยงที่ควรระวัง และแนวทางตัดสินใจอย่างรอบคอบ'
      },
      oreguLove: {
        title: '❤️ อยากเห็นทิศทางความรักให้ชัดกว่าเดิม?',
        text: 'แอดไลน์ดูดวงความรักแบบเจาะคำถาม เพื่อทบทวนความรู้สึก ความสัมพันธ์ สัญญาณที่ควรสังเกต และวิธีดูแลหัวใจโดยไม่มองข้ามความจริง'
      },
      tarotRune: {
        title: '🃏 อยากอ่านไพ่ + รูนให้ลึกกว่านี้?',
        text: 'ดูต่อได้ทั้งไพ่ประจำตัว ไพ่เหตุการณ์ รูน และโหรกระต่าย เพื่ออ่านทั้งตัวตน แนวโน้มสถานการณ์ และจังหวะที่ควรลงมือแบบละเอียดขึ้น'
      }
    };
    var x = cta[featureKey] || cta.topicShort;
    return '<section class="line-cta prediction-cta">' +
      '<div class="line-cta-title">' + x.title + '</div>' +
      '<div class="line-cta-text">' + x.text + '</div>' +
      '<a class="line-cta-btn" href="https://lin.ee/6Jwz5RD" target="_blank" rel="noopener noreferrer">💚 แอดไลน์ รับคำปรึกษาดูดวง</a>' +
      '</section>';
  }

  // ---------- Rabbit’s Habit Design renderer ----------
  // Renderer แยกผลคำนวณ RHD ออกจาก Rabbit Astrology และสลับบทบาทเลขสถานการณ์/วิธีรับมือตามที่กำหนด

  function renderAdminDeepSelfSection(inputData, engineKey) {
    if (!window.RABBITASTRO_ADMIN_MODE || !Engine || !inputData) return '';
    var base=Engine.calcPerson(Object.assign({},inputData,{feature:'base'}))||{}, asc=inputData.noBirthTime?null:(Engine.calcPerson(Object.assign({},inputData,{feature:'asc'}))||{});
    var d=base.baseDeep||{}, inner=asc&&Engine.ASC_INNER?Engine.ASC_INNER[asc.ascInner]||{}:{}, face=asc&&Engine.ASC_FACE?Engine.ASC_FACE[asc.ascFace]||{}:{}, shadow=asc&&Engine.ASC_DEEP?Engine.ASC_DEEP[asc.ascNum]||{}:{};
    var map={
      person:[['ตัวตนที่คนอื่นมองเห็น',[['ภาพแรกที่คนอื่นรับรู้',face.impression],['บทบาทในกลุ่ม',face.role],['สิ่งที่คนอื่นอาจเข้าใจผิด',face.misread]]],['ตัวตนที่อยู่ข้างใน',[['แก่นพื้นดวง',d.core],['ตัวตนที่แท้จริง',d.self]]],['ความกลัวและจุดเปราะบาง',[['ความกลัวที่อาจซ่อนอยู่',inner.fear||d.blind],['สิ่งที่ใจต้องการเพื่อรู้สึกปลอดภัย',inner.need]]],['เงาที่อาจไม่อยากยอมรับ',[['เงาของจิตสำนึก',shadow.shadow],['จุดบอดจากพื้นดวง',d.blind]]],['ความขัดแย้งภายใน',[['สิ่งที่คุณอาจต้องการ',inner.need],['สิ่งที่พื้นดวงผลักดัน',d.self]]],['รูปแบบความรักและความผูกพัน',[['รูปแบบความผูกพัน',d.love],['สิ่งที่คนอื่นอาจรับรู้',face.impression]]],['ศักยภาพที่ยังใช้ไม่เต็มที่',[['พรสวรรค์พื้นฐาน',d.gift],['จุดแข็งของจิตสำนึก',shadow.strength]]],['จุดที่ลึกที่สุดภายในจิตใจ',[['แรงปรารถนาที่อยู่ลึกที่สุด',inner.drive||d.core],['เสียงกระซิบในใจ',inner.whisper],['ความต้องการที่อาจไม่ค่อยกล้าขอ',inner.need]]],['บทเรียนที่ต้องเผชิญ',[['บทเรียนหลัก',d.lesson],['จุดเปลี่ยน',d.turn]]]],
      god:[['แรงขับเคลื่อนที่ซ่อนอยู่',[['แรงขับภายใน',inner.drive||d.gift],['เสียงกระซิบในใจ',inner.whisper]]],['จุดที่ลึกที่สุดภายในจิตใจ',[['ความต้องการที่อยู่ลึก',inner.need||d.core],['สิ่งที่ทำให้รู้สึกมีความหมาย',d.lesson]]],['บทเรียนที่ต้องเผชิญ',[['บทเรียนจากพื้นดวง',d.lesson],['จุดเปลี่ยน',d.turn]]]],
      oreguram:[['ความกลัวและจุดเปราะบาง',[['ความกลัวที่อาจซ่อนอยู่',inner.fear||d.blind],['สิ่งที่ใจต้องการเพื่อรู้สึกปลอดภัย',inner.need]]],['เงาที่อาจไม่อยากยอมรับ',[['จุดบอดจากพื้นดวง',d.blind],['ด้านที่ควรระวัง',base.baseElement&&base.baseElement.bad]]],['ความขัดแย้งภายใน',[['ความต้องการภายใน',inner.need],['แรงผลักดันจากพื้นดวง',d.self]]],['บทเรียนที่ต้องเผชิญ',[['บทเรียนหลัก',d.lesson],['แนวทางฝึกฝน',(d.questions||[]).slice(0,2).join(' · ')]]]],
      tarotRune:[['ตัวตนที่อยู่ข้างใน',[['แก่นพื้นดวง',d.core],['ตัวตนที่แท้จริง',d.self]]],['ความกลัวและจุดเปราะบาง',[['ความกลัวที่อาจซ่อนอยู่',inner.fear||d.blind],['สิ่งที่ใจต้องการ',inner.need]]],['รูปแบบความรักและความผูกพัน',[['รูปแบบความผูกพัน',d.love],['สิ่งที่คนอื่นอาจรับรู้',face.impression]]],['ศักยภาพที่ยังใช้ไม่เต็มที่',[['พรสวรรค์พื้นฐาน',d.gift],['จุดแข็งของจิตสำนึก',shadow.strength]]],['จุดที่ลึกที่สุดภายในจิตใจ',[['แรงปรารถนาที่อยู่ลึกที่สุด',inner.drive||d.core],['เสียงกระซิบในใจ',inner.whisper],['จุดบอดที่อาจขวางตัวเอง',d.blind]]]]
    };
    var chosen=map[engineKey]||[], esc=typeof escapeHTML==='function'?escapeHTML:function(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
    if(!chosen.length)return '';
    var out='<div class="pred-block admin-deep-self"><h4>🧠 Deep Self · สำรวจตัวตนและจิตใต้สำนึก</h4><p>ใช้ผลจากสูตรเดิมของระบบ ไม่ใช่ข้อสรุปตายตัว</p>';
    chosen.forEach(function(sec){var fields=sec[1].filter(function(pair){return pair[1]!=null&&String(pair[1]).trim()!=='';});if(!fields.length)return;out+='<div class="pred-section-item"><b>'+esc(sec[0])+'</b>';fields.forEach(function(pair){out+='<p><b>'+esc(pair[0])+':</b> '+esc(pair[1])+'</p>';});out+='</div>';});
    if(inputData.noBirthTime)out+='<p>ไม่ทราบเวลาเกิด จึงไม่สร้างข้อมูลลัคนา/จิตสำนึกทดแทน</p>';
    return out+'</div>';
  }

  function renderRHDSection(res, featureKey, inputData) {
    if (!Engine || !Engine.RHD || !res || featureKey !== 'rhd') return '';
    // บันทึกวันและเวลาจริง ณ จังหวะที่ผู้ใช้กดปุ่มคำนวณ
    var rhdQueryTime = new Date();
    var nameResult = (inputData && inputData.fName && inputData.fLast && typeof calcNameNumber === 'function')
      ? calcNameNumber(inputData.fName, inputData.fLast)
      : null;
    var nameNumber = nameResult ? parseInt(nameResult.num, 10) : parseInt(res.N, 10);
    if (!isFinite(nameNumber) || nameNumber < 1 || nameNumber > 9) nameNumber = 5;

    // วิธีรับมือใช้ข้อมูลประจำตัว: เลขชื่อ-สกุล + วันเดือนปีเกิด + เวลาเกิด (ถ้าทราบ)
    var habitCalc = Engine.RHD.CALCULATOR.calculateHabitNumber({
      nameNumber: nameNumber,
      bDay: inputData && inputData.bDay,
      bMonth: inputData && inputData.bMonth,
      bYear: inputData && inputData.bYear,
      bHour: inputData && inputData.bHour,
      bMin: inputData && inputData.bMin,
      noBirthTime: !!(inputData && inputData.noBirthTime)
    });
    var habit = parseInt(habitCalc && habitCalc.number, 10);
    if (!isFinite(habit) || habit < 1 || habit > 9) habit = 9;

    // สถานการณ์ใช้วันเดือนปีและเวลาที่กดคำนวณในขณะนั้นเท่านั้น
    var situationCalc = Engine.RHD.CALCULATOR.calculateSituationNumber({
      queryDay: rhdQueryTime.getDate(),
      queryMonth: rhdQueryTime.getMonth() + 1,
      queryYear: rhdQueryTime.getFullYear(),
      queryHour: rhdQueryTime.getHours(),
      queryMinute: rhdQueryTime.getMinutes()
    });
    var rabbitNumber = parseInt(situationCalc && situationCalc.number, 10);
    if (!isFinite(rabbitNumber) || rabbitNumber < 1 || rabbitNumber > 9) rabbitNumber = 9;
    var data = {};
    try {
      data = Engine.RHD.getCombined(rabbitNumber, habit) || {};
    } catch (e) {
      data = {};
    }
    if (!data.rabbit && typeof Engine.RHD.synthesize === 'function') {
      try { data = Engine.RHD.synthesize(rabbitNumber, habit) || data; } catch (e) {}
    }
    var rabbit = data.rabbit || (Engine.RABBITS && Engine.RABBITS[rabbitNumber]) || {};
    var hd = data.habit || (Engine.RHD.HABITS && Engine.RHD.HABITS[habit]) || {};
    var h = '<div class="pred-block rhd-combined" style="margin-top:14px;">';
    h += '<h4>🐇 บทสนทนากับจิตใต้สำนึกของคุณ (RHD)</h4>';
    h += '<div class="rhd-section rhd-dialogue-intro" style="background:#fff;border:1px solid #fed7aa;border-radius:10px;padding:11px;margin:8px 0 10px;">ลองอ่านคำทำนายนี้เหมือนกำลังนั่งคุยกับเสียงข้างในของตัวเองอย่างอ่อนโยน ไม่ต้องเชื่อทุกคำทันที ลองสังเกตว่าประโยคไหนตรงกับความรู้สึกของคุณ และประโยคไหนที่คุณอยากตอบกลับ</div>';
    // ซ่อนรายละเอียดสูตรและข้อมูลที่ใช้คำนวณจากหน้าคำทำนาย แต่คงการคำนวณเบื้องหลังไว้
    h += '<div class="rhd-grid">';
    h += '<div class="rhd-tile"><div class="rhd-k">วิธีรับมือ</div><div class="rhd-v">'+(hd.name||'')+'</div><div class="rhd-d">'+(hd.response||'ค่อย ๆ เลือกวิธีที่เหมาะกับตัวเอง')+'</div></div>';
    h += '<div class="rhd-tile"><div class="rhd-k">สถานการณ์</div><div class="rhd-v">'+(rabbit.name||'-')+'</div><div class="rhd-d">'+(rabbit.short||'ลองมองสิ่งที่เกิดขึ้นตามความเป็นจริง')+'</div></div>';
    h += '</div>';
    h += '<div class="rhd-section"><b>🧩 ถ้าจิตใต้สำนึกกำลังบอกอะไรกับฉัน</b><br/><span style="font-style:italic;">“'+(data.description||'ลองกลับมาฟังตัวเอง แล้วค่อย ๆ เลือกแนวทางที่เหมาะกับใจ')+'”</span></div>';
    h += '<div class="rhd-section"><b>🌿 สิ่งที่ใจฉันอยากให้เข้าใจ</b><br/><span style="font-style:italic;">“'+(data.mind||'ฉันอยากให้คุณค่อย ๆ สังเกตความรู้สึกของตัวเอง โดยไม่ต้องตัดสินตัวเอง')+'”</span></div>';
    h += '<div class="rhd-section rhd-corrections" style="background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:11px;"><b>🛠️ สิ่งที่ฉันควรแก้ไข</b><br/>ลองเลือกปรับทีละเรื่อง โดยไม่ตำหนิตัวเอง:<ul style="margin:6px 0 0;padding-left:20px;"><li>แยกความกลัวออกจากข้อเท็จจริงก่อนตัดสินใจ</li><li>บอกความต้องการและขอบเขตให้ชัดเจน</li><li>เลือกปรับทีละเรื่อง แล้วทบทวนโดยไม่ตำหนิตัวเอง</li></ul><div style="margin-top:7px;">ถามตัวเองว่า: <i>พฤติกรรมอะไรที่ฉันอยากเปลี่ยน และก้าวเล็กที่สุดที่ฉันเริ่มทำได้ตอนนี้คืออะไร?</i></div></div>';
    // คำทำนายเพิ่มเติมสำหรับ RHD สังเคราะห์จากเลขสถานการณ์โหรกระต่าย
    // ร่วมกับเลขพฤติกรรม เพื่อให้ทุกหัวข้อพูดกับจิตใต้สำนึกด้วยน้ำเสียงอ่อนโยน
    var rhdReflection = {
      1: {
        goal:'ฉันอยากให้คุณกล้าเริ่มในสิ่งที่สำคัญกับใจ แต่ไม่ต้องพิสูจน์ตัวเองด้วยการทำทุกอย่างเพียงลำพัง',
        overlook:'คุณไม่จำเป็นต้องสนใจทุกคำวิจารณ์ โดยเฉพาะคำพูดที่ไม่ได้ช่วยให้คุณเข้าใจสถานการณ์ตรงหน้า',
        outside:'บางคนอาจมองว่าคุณมั่นใจและพร้อมลุย แม้ข้างในคุณอาจกำลังคิดให้รอบคอบกว่าที่ใครเห็น',
        gift:'คุณมีพลังในการเริ่มต้น มองเห็นทางเลือก และช่วยให้สิ่งที่ค้างอยู่เริ่มขยับได้',
        shadow:'บางครั้งคุณอาจเร่งตัวเองหรืออยากควบคุมทิศทางทั้งหมด ลองให้พื้นที่กับคนอื่นและตัวเองบ้าง',
        accept:'ยอมรับได้ว่าคุณอยากเป็นคนเริ่ม และในบางวันคุณก็ต้องการแรงสนับสนุนเหมือนกัน',
        deny:'อย่าปฏิเสธความเหนื่อยหรือความต้องการความช่วยเหลือ เพียงเพราะคุณคุ้นกับการเป็นคนเข้มแข็ง',
        people:'ชีวิตอาจพาคนที่มีไอเดียหรือรอให้คุณเปิดทางเข้ามา ฝึกแยกให้ออกว่าใครร่วมมือและใครฝากภาระไว้กับคุณ',
        child:'ฉันอยากบอกเธอว่า เธอไม่ต้องเก่งหรือกล้าตลอดเวลาก็ได้ แค่ค่อย ๆ เริ่มในแบบของเธอก็พอ'
      },
      2: {
        goal:'ฉันอยากให้คุณฟังความรู้สึกตัวเอง แล้วค่อยเลือกตอบรับสิ่งที่เข้ามา โดยไม่ต้องรีบเพราะกลัวพลาด',
        overlook:'คุณไม่จำเป็นต้องรอให้ทุกคนเห็นด้วยหรือให้ทุกอย่างชัดร้อยเปอร์เซ็นต์ก่อนจึงจะขยับได้',
        outside:'คนอื่นอาจเห็นว่าคุณสุขุมและสังเกตเก่ง แต่อาจไม่รู้ว่าคุณกำลังชั่งใจอยู่มากแค่ไหน',
        gift:'คุณมีความสามารถในการฟัง จับรายละเอียด และตอบสนองต่อสิ่งที่เกิดขึ้นจริงได้ดี',
        shadow:'การรอความมั่นใจนานเกินไปอาจทำให้คุณพลาดโอกาส ลองกำหนดเวลาทบทวนให้ตัวเอง',
        accept:'ยอมรับได้ว่าคุณต้องการเวลาและข้อมูลก่อนตัดสินใจ นั่นไม่ได้แปลว่าคุณอ่อนแอ',
        deny:'อย่าปฏิเสธความต้องการของตัวเองเพียงเพื่อให้ทุกคนสบายใจหรือไม่ให้เกิดความขัดแย้ง',
        people:'คุณอาจพบคนที่เข้ามาพร้อมคำขอหรือทางเลือกหลายแบบ ฝึกถามตัวเองก่อนว่าเรื่องไหนตรงกับใจคุณจริง ๆ',
        child:'ฉันอยากบอกเธอว่า เธอมีสิทธิ์ใช้เวลาคิด และไม่จำเป็นต้องตอบตกลงเพื่อให้ใครรักเธอ'
      },
      3: {
        goal:'ฉันอยากให้คุณได้ลอง เรียนรู้ และเดินหน้าในสิ่งที่มีความหมาย โดยเลือกให้ชัดว่าอะไรควรได้รับพลังจากคุณก่อน',
        overlook:'ไม่ต้องเสียพลังกับการเปรียบเทียบเส้นทางของตัวเองกับคนอื่น ทุกคนมีจังหวะและบทเรียนต่างกัน',
        outside:'คนอื่นอาจมองว่าคุณคล่องตัว กล้าลอง และปรับตัวไว แม้บางครั้งคุณเองก็ยังค้นหาทางที่ใช่',
        gift:'คุณเรียนรู้จากประสบการณ์จริงได้ดี และมักมองเห็นทางเลือกเมื่อวิธีเดิมใช้ไม่ได้ผล',
        shadow:'การเปลี่ยนใจบ่อยอาจทำให้คุณเหนื่อยและไปไม่สุดสักทาง ลองให้เวลาสิ่งสำคัญได้เติบโต',
        accept:'ยอมรับได้ว่าคุณกำลังเรียนรู้และยังไม่ต้องมีคำตอบทุกอย่างตั้งแต่แรก',
        deny:'อย่าปฏิเสธความรับผิดชอบต่อสิ่งที่คุณเลือกเริ่ม แม้ระหว่างทางจะไม่สนุกเหมือนตอนแรก',
        people:'ชีวิตอาจพาคนที่ชวนคุณลองสิ่งใหม่เข้ามา เลือกทดลองในแบบที่ไม่ทำให้ละเลยสิ่งสำคัญของตัวเอง',
        child:'ฉันอยากบอกเธอว่า การลองผิดไม่ได้ทำให้เธอล้มเหลว เธอกำลังเรียนรู้และเริ่มใหม่ได้เสมอ'
      },
      4: {
        goal:'ฉันอยากให้คุณมองสถานการณ์ให้ชัด แล้วใช้ความเข้าใจนั้นเลือกทางที่เหมาะ ไม่จำเป็นต้องแก้ทุกอย่างด้วยตัวเอง',
        overlook:'คุณไม่ต้องรับผิดชอบความรู้สึกหรือปัญหาของทุกคน บางเรื่องเป็นหน้าที่ของเจ้าของเรื่องเอง',
        outside:'คนอื่นอาจเห็นว่าคุณคิดเป็นระบบและมองภาพรวมได้ดี แต่อาจไม่เห็นว่าคุณก็ต้องการคนรับฟังเช่นกัน',
        gift:'คุณมองเห็นความเชื่อมโยง วิเคราะห์สถานการณ์ และช่วยชี้ทางเลือกที่คนอื่นอาจมองข้าม',
        shadow:'การคิดแทนหรือช่วยจัดการให้ทุกคนอาจทำให้คุณเหนื่อย ลองถามก่อนว่าอีกฝ่ายต้องการความช่วยเหลือแบบไหน',
        accept:'ยอมรับได้ว่าคุณไม่จำเป็นต้องมีคำตอบให้ทุกเรื่อง และคุณเองก็เรียนรู้จากคนอื่นได้',
        deny:'อย่าปฏิเสธความรู้สึกของตัวเองเพียงเพราะกำลังพยายามใช้เหตุผลกับทุกอย่าง',
        people:'คุณอาจพบคนที่มาขอคำแนะนำหรือพึ่งพาการตัดสินใจของคุณ ตั้งขอบเขตให้ชัดเพื่อช่วยโดยไม่แบกแทน',
        child:'ฉันอยากบอกเธอว่า เธอไม่ต้องคอยแก้ปัญหาให้ทุกคนถึงจะมีคุณค่า เธอเองก็สมควรได้รับการดูแล'
      },
      5: {
        goal:'ฉันอยากให้คุณแยกให้ออกว่าอะไรเป็นความรู้สึกของคุณ และอะไรเป็นสิ่งที่รับมาจากคนรอบข้าง',
        overlook:'อย่าเก็บทุกสีหน้า คำพูด หรืออารมณ์ของคนอื่นมาตีความว่าเป็นความผิดของตัวเอง',
        outside:'คนอื่นอาจรู้สึกว่าคุณเข้าใจบรรยากาศและความรู้สึกคนได้ไว แต่ไม่รู้ว่าคุณต้องใช้พลังมากแค่ไหน',
        gift:'คุณรับรู้ความเปลี่ยนแปลงรอบตัวและเข้าใจมุมมองของคนอื่นได้ดี',
        shadow:'การพยายามกลมกลืนกับทุกคนอาจทำให้คุณหลงลืมความต้องการของตัวเอง',
        accept:'ยอมรับได้ว่าคุณอ่อนไหวต่อบรรยากาศ และต้องมีเวลาสงบใจเพื่อกลับมาเป็นตัวเอง',
        deny:'อย่าปฏิเสธความต้องการหรือขอบเขตของตัวเองเพียงเพราะกลัวทำให้ใครผิดหวัง',
        people:'ชีวิตอาจพาคนที่มีอารมณ์หรือความต้องการชัดเจนเข้ามา ฝึกอยู่ข้างเขาโดยไม่ต้องรับทุกอย่างมาเป็นของตัวเอง',
        child:'ฉันอยากบอกเธอว่า ความรู้สึกของเธอก็สำคัญ ไม่จำเป็นต้องดูแลใจทุกคนก่อนใจตัวเอง'
      },
      6: {
        goal:'ฉันอยากให้คุณเชื่อสัญญาณที่ตัวเองรับรู้ พร้อมตรวจสอบข้อเท็จจริงก่อนเลือกทางที่สำคัญ',
        overlook:'ไม่ต้องหาความหมายจากทุกเรื่องเล็ก ๆ บางอย่างเกิดขึ้นได้โดยไม่ใช่สัญญาณเตือนอะไร',
        outside:'คนอื่นอาจเห็นว่าคุณจับความผิดปกติได้ไว แม้อธิบายเหตุผลออกมาเป็นคำพูดได้ไม่ทันที',
        gift:'คุณสังเกตรายละเอียดเล็ก ๆ และรับรู้ความเปลี่ยนแปลงได้รวดเร็ว',
        shadow:'ความกังวลอาจทำให้สัญชาตญาณกับความกลัวปนกัน ลองถามว่ามีหลักฐานอะไรสนับสนุนความรู้สึกนี้',
        accept:'ยอมรับได้ว่าคุณมีความรู้สึกแรกต่อเรื่องต่าง ๆ และคุณสามารถตรวจสอบมันอย่างใจเย็นได้',
        deny:'อย่าปฏิเสธข้อเท็จจริงที่ไม่ตรงกับความรู้สึกแรกของตัวเอง เปิดพื้นที่ให้ข้อมูลใหม่ด้วย',
        people:'คุณอาจพบคนที่ทำให้รู้สึกบางอย่างอย่างรวดเร็ว ให้เวลาสังเกตการกระทำจริงก่อนตัดสินใจ',
        child:'ฉันอยากบอกเธอว่า เธอเชื่อความรู้สึกตัวเองได้ แต่ไม่ต้องกลัวทุกอย่างที่ยังไม่เข้าใจ'
      },
      7: {
        goal:'ฉันอยากให้คุณดูแลใจตัวเองและตัดสินใจเมื่อพร้อม ไม่ต้องบังคับให้ตัวเองตอบทุกเรื่องทันที',
        overlook:'ไม่จำเป็นต้องแก้ทุกอย่างในวันที่อารมณ์หนัก บางเรื่องรอให้ใจสงบก่อนค่อยกลับมาดูก็ได้',
        outside:'คนอื่นอาจเห็นว่าคุณมีอารมณ์ละเอียดและใส่ใจมาก แม้บางครั้งคุณเลือกเงียบเพื่อจัดการความรู้สึก',
        gift:'คุณเข้าใจความรู้สึกที่ซับซ้อนและมองเห็นผลกระทบทางใจที่คนอื่นอาจมองข้าม',
        shadow:'การเก็บความรู้สึกไว้นานหรือรีบตอบตอนอารมณ์แรงอาจทำให้เหนื่อย ลองเว้นจังหวะก่อนพูดหรือตัดสินใจ',
        accept:'ยอมรับได้ว่าอารมณ์ขึ้นลงเป็นเรื่องมนุษย์ และคุณไม่จำเป็นต้องเข้มแข็งตลอดเวลา',
        deny:'อย่าปฏิเสธความรู้สึกที่เกิดขึ้น แต่ก็ไม่จำเป็นต้องทำตามทุกอารมณ์ในทันที',
        people:'ชีวิตอาจพาคนที่กระตุ้นความรู้สึกหลายแบบเข้ามา ฝึกบอกความรู้สึกตรง ๆ เมื่อใจพร้อม',
        child:'ฉันอยากบอกเธอว่า เธอไม่ใช่ภาระเพราะมีความรู้สึกมากมาย เธอสมควรได้รับความเข้าใจและความอ่อนโยน'
      },
      8: {
        goal:'ฉันอยากให้คุณหาความเข้าใจที่เพียงพอ แล้วเลือกก้าวต่อไป แทนการรอจนทุกอย่างแน่นอนทั้งหมด',
        overlook:'ไม่ต้องวิเคราะห์ทุกความเป็นไปได้จนหมดแรง บางคำตอบจะชัดขึ้นเมื่อได้ลงมือทำอย่างระมัดระวัง',
        outside:'คนอื่นอาจเห็นว่าคุณรอบคอบและชอบคิดให้ครบ แต่อาจไม่รู้ว่าคุณกำลังชั่งน้ำหนักหลายทางเลือกอยู่',
        gift:'คุณค้นคว้า ตั้งคำถาม และตรวจสอบรายละเอียดก่อนเชื่อสิ่งใดได้ดี',
        shadow:'การคิดวนหรือหาข้อมูลเพิ่มไม่สิ้นสุดอาจกลายเป็นวิธีเลื่อนสิ่งที่กลัวจะตัดสินใจ',
        accept:'ยอมรับได้ว่าคุณต้องการเหตุผลและข้อมูลเพื่อรู้สึกมั่นใจ นั่นเป็นส่วนหนึ่งของวิธีคิดคุณ',
        deny:'อย่าปฏิเสธความช่วยเหลือหรือมุมมองอื่นเพียงเพราะยังตรวจสอบทุกอย่างด้วยตัวเองไม่ได้',
        people:'คุณอาจพบคนที่มีข้อมูลหรือความเห็นต่างกันมาก ใช้คำถามช่วยแยกข้อเท็จจริงออกจากการคาดเดา',
        child:'ฉันอยากบอกเธอว่า เธอไม่จำเป็นต้องรู้ทุกคำตอบเพื่อเริ่มต้น บางเรื่องเรียนรู้ระหว่างทางได้'
      },
      9: {
        goal:'ฉันอยากให้คุณเชื่อมโยงสิ่งที่เรียนรู้มา แล้วเลือกสิ่งสำคัญที่สุดก่อน ไม่จำเป็นต้องจัดการทุกอย่างพร้อมกัน',
        overlook:'อย่ารอให้ทุกคนเข้าใจตรงกันหรือให้ภาพทั้งหมดสมบูรณ์ก่อนค่อยเดินต่อ',
        outside:'คนอื่นอาจเห็นว่าคุณมองหลายด้านและเชื่อมโยงเรื่องต่าง ๆ ได้ แม้ในใจคุณยังพยายามหาข้อสรุปที่ลงตัว',
        gift:'คุณรวบรวมประสบการณ์และมุมมองที่ต่างกันให้กลายเป็นภาพรวมที่มีความหมายได้',
        shadow:'การพยายามทำความเข้าใจทุกฝ่ายอาจทำให้คุณลังเลหรือแบกรับมากเกินไป',
        accept:'ยอมรับได้ว่าคุณมองเรื่องหนึ่งได้หลายมุม และยังเลือกทางที่เหมาะกับตัวเองได้',
        deny:'อย่าปฏิเสธความต้องการส่วนตัวเพียงเพราะกำลังพยายามเข้าใจเหตุผลของทุกคน',
        people:'ชีวิตอาจพาคนที่มีมุมมองต่างกันเข้ามา คุณไม่จำเป็นต้องเป็นคนกลางหรือหาคำตอบให้ทุกฝ่ายเสมอ',
        child:'ฉันอยากบอกเธอว่า เธอไม่ต้องเข้าใจทุกอย่างในวันนี้ แค่รู้ว่าเธอมีคุณค่าและสมควรได้รับความรักก็พอ'
      }
    };
    var reflection = rhdReflection[habit] || rhdReflection[1];
    var situationName = rabbit.name || 'สถานการณ์ตรงหน้า';
    h += '<div class="rhd-section rhd-reflection"><b>🎯 เป้าหมายของคุณ</b><br/>“'+reflection.goal+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>🍃 สิ่งที่ควรมองข้าม</b><br/>“'+reflection.overlook+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>👀 มุมมองของคนภายนอก</b><br/>“'+reflection.outside+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>✨ พรสวรรค์ที่ติดตัวมา</b><br/>“'+reflection.gift+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>🌘 เงามืดที่ต้องยอมรับ</b><br/>“'+reflection.shadow+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>🤍 สิ่งที่ควรยอมรับ</b><br/>“'+reflection.accept+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>🪞 สิ่งที่ไม่ควรปฏิเสธ</b><br/>“'+reflection.deny+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>🧑‍🤝‍🧑 โลกใบนี้มักจะเหวี่ยงคนแบบไหนมา</b><br/>“ในจังหวะ '+situationName+' '+reflection.people+'”</div>';
    h += '<div class="rhd-section rhd-reflection"><b>🧸 ถ้าวันหนึ่งได้กลับไปคุยกับตัวเองในวัยเด็ก</b><br/>“'+reflection.child+'”</div>';
    var rhdComfort = {
      1:'คุณไม่จำเป็นต้องเป็นคนที่เข้มแข็งหรือเริ่มต้นทุกอย่างด้วยตัวเองเสมอไป การเหนื่อยไม่ได้ทำให้คุณมีค่าน้อยลง คุณพัก ขอความช่วยเหลือ และค่อย ๆ ไปต่อในจังหวะของตัวเองได้',
      2:'คุณไม่จำเป็นต้องทำให้ทุกคนพอใจเพื่อให้ตัวเองเป็นคนที่มีความหมาย ความรู้สึกและขอบเขตของคุณสำคัญเหมือนกัน คุณสามารถใจดีกับคนอื่น พร้อมกับใจดีกับตัวเองไปด้วยได้',
      3:'คุณไม่ต้องทำทุกอย่างให้สำเร็จในครั้งเดียว ความคืบหน้าเล็ก ๆ ก็มีความหมาย และการพักระหว่างทางไม่ได้ลบสิ่งที่คุณพยายามทำมาเลย',
      4:'คุณไม่จำเป็นต้องควบคุมทุกอย่างเพื่อให้ปลอดภัย บางเรื่องค่อย ๆ เรียนรู้ระหว่างทางได้ และคุณไม่ต้องมีคำตอบครบทุกข้อก่อนจึงจะสมควรได้รับความสบายใจ',
      5:'คุณมีสิทธิ์พักโดยไม่ต้องรู้สึกผิด ไม่ต้องรอให้ทุกคนพอใจหรือให้งานทุกอย่างเสร็จก่อนจึงจะดูแลตัวเองได้ ความต้องการของคุณก็สมควรได้รับพื้นที่เช่นกัน',
      6:'การเปลี่ยนแปลงไม่ได้ทำให้สิ่งที่คุณเคยพยายามสูญเปล่า คุณมีสิทธิ์เติบโต เปลี่ยนใจ และเลือกวิธีที่เหมาะกับตัวเองในวันนี้ โดยไม่ต้องตำหนิตัวเองในอดีต',
      7:'คุณไม่จำเป็นต้องรีบจัดการทุกความรู้สึกให้เรียบร้อยในวันนี้ ค่อย ๆ พัก ค่อย ๆ ทำความเข้าใจ และขอความช่วยเหลือได้ คุณไม่จำเป็นต้องผ่านช่วงยาก ๆ เพียงลำพัง',
      8:'คุณไม่จำเป็นต้องรู้ทุกคำตอบก่อนจะเริ่ม และไม่ต้องคิดจนหมดแรงเพื่อให้แน่ใจทุกอย่าง ลองเชื่อใจตัวเองทีละนิด พร้อมเปิดรับความช่วยเหลือและข้อมูลใหม่ ๆ ได้',
      9:'คุณไม่จำเป็นต้องเป็นคนแก้ปัญหาหรือเข้าใจทุกฝ่ายเสมอไป เลือกดูแลสิ่งที่สำคัญกับคุณก่อนก็ได้ คุณมีสิทธิ์วางภาระบางอย่างลงและใช้ชีวิตที่เบาขึ้น'
    };
    h += '<div class="rhd-section rhd-comfort" style="background:#fff7ed;border:1px solid #fed7aa;border-left:4px solid #ea580c;border-radius:10px;padding:11px;margin-top:10px;"><b>🤍 ประโยคปลอบใจที่อยากฝากไว้กับคุณ</b><br/><span style="font-style:italic;">“'+(rhdComfort[habit] || rhdComfort[1])+' '+(data.overall || 'คุณค่อย ๆ ไปต่อในจังหวะของตัวเองได้')+'”</span><div style="font-size:12px;color:#7c5b4b;margin-top:6px;">อ่านเท่าที่ตรงกับใจคุณก็พอ คุณไม่จำเป็นต้องเชื่อทุกคำหรือเร่งเปลี่ยนแปลงตัวเองในทันที</div></div>';
    var questionBank = (window.RHD_SELF_QUESTIONS && typeof window.RHD_SELF_QUESTIONS === 'object' && !Array.isArray(window.RHD_SELF_QUESTIONS)) ? window.RHD_SELF_QUESTIONS : {};
    var candidateQuestions = Object.prototype.hasOwnProperty.call(questionBank, habit) ? questionBank[habit] : questionBank[1];
    var selfQuestions = Array.isArray(candidateQuestions)
      ? candidateQuestions.filter(function(question) { return typeof question === 'string'; }).slice(0, 2).map(function(question) { return question.slice(0, 300); })
      : [];
    h += '<div class="rhd-section rhd-self-questions"><b>❓ คำถามสำรวจแนวทางของตัวเอง</b><ol style="margin:6px 0 0;padding-left:22px;">';
    for (var qi = 0; qi < selfQuestions.length; qi++) { h += '<li style="margin:4px 0;">' + escapeHTML(selfQuestions[qi]) + '</li>'; }
    h += '</ol></div>';
    // สังเคราะห์ทุกคำตอบจากคู่ RHD จริงในรอบนี้: เลขสถานการณ์ + วิธีรับมือ
    // น้ำเสียงเป็นการชวนสำรวจ ไม่ฟันธง ไม่วินิจฉัย และไม่ตัดสินผู้ใช้
    var rhdSituationText = (rabbit.name || 'สถานการณ์ตรงหน้า') + ' — ' + (rabbit.short || rabbit.desc || 'เรื่องที่กำลังเกิดขึ้น');
    var rhdCopingText = hd.response || 'ค่อย ๆ เลือกวิธีที่เหมาะกับตัวเอง';
    var rhdDecisionText = data.decision || hd.decision || 'ลองให้เวลาตัวเองทบทวนก่อนเลือกก้าวต่อไป';
    var rhdCautionText = data.caution || hd.caution || 'ค่อย ๆ สังเกตสิ่งที่เกิดขึ้นโดยไม่ตำหนิตัวเอง';
    var rhdOverallText = data.overall || data.description || 'คุณยังมีทางเลือกและค่อย ๆ ปรับวิธีรับมือได้';
    var rhdGentleAnswers = [
      'อาจมีบางเรื่องที่คุณยังไม่พร้อมเข้าไปแตะ โดยเฉพาะเมื่อสถานการณ์ตอนนี้คือ “'+rhdSituationText+'” วิธีรับมือของคุณมีแนวโน้มเป็นแบบ “'+rhdCopingText+'” บางทีการเว้นระยะหรือคิดให้รอบคอบอาจเป็นวิธีปกป้องใจในช่วงหนึ่ง ไม่ได้แปลว่าคุณอ่อนแอ ลองถามตัวเองเบา ๆ ว่าเรื่องไหนที่อยากค่อย ๆ เข้าไปทำความเข้าใจ และก้าวเล็กที่สุดที่ปลอดภัยสำหรับใจคืออะไร',
      'ความกังวลที่แบกอยู่อาจเกี่ยวข้องกับความไม่แน่นอนหรือผลที่จะตามมาจาก “'+rhdSituationText+'” เมื่อคุณรับมือด้วยการ “'+rhdCopingText+'” ใจอาจพยายามเตรียมพร้อมเพื่อไม่ให้พลาด สิ่งที่ช่วยได้คือแยกสิ่งที่รู้แน่ชัดออกจากสิ่งที่ยังคาดเดา แล้วค่อยพิจารณาตามนี้: '+rhdCautionText+' คุณไม่จำเป็นต้องแก้ทุกความกังวลในคราวเดียว',
      'สิ่งที่อาจขัดกับความต้องการข้างใน คือการใช้วิธีรับมือแบบ “'+rhdCopingText+'” มากเกินไปจนไม่ได้ฟังว่าตัวเองต้องการอะไรในสถานการณ์ “'+rhdSituationText+'” ลองสังเกตกิจวัตรที่ทำเพราะความเคยชิน ความเกรงใจ หรือความกลัว แล้วเลือกปรับเพียงหนึ่งอย่าง โดยไม่ต้องตำหนิตัวเองที่เคยทำเช่นนั้น',
      'สิ่งที่อาจต้องวางลงไม่จำเป็นต้องเป็นคนหรือความสัมพันธ์ แต่อาจเป็นภาระ ความคาดหวัง หรือความคิดว่าคุณต้องจัดการทุกอย่างด้วยวิธีเดิม ในสถานการณ์นี้ คุณอาจคุ้นกับการ “'+rhdCopingText+'” ลองใช้แนวทางนี้เป็นจุดเริ่มต้น: '+rhdDecisionText+' การปล่อยวางทีละนิดไม่ใช่การยอมแพ้ แต่เป็นการเปิดพื้นที่ให้ทั้งสองฝ่ายเดินต่ออย่างเข้าใจกันมากขึ้น',
      'ตัวคุณในวัยเด็กอาจต้องการได้รับการรับฟังและรู้สึกปลอดภัย โดยเฉพาะเมื่อวันนี้คุณกำลังรับมือกับ “'+rhdSituationText+'” ด้วยวิธี “'+rhdCopingText+'” ลองนึกถึงสิ่งที่เด็กคนนั้นต้องการในวันที่เหนื่อย แล้วมอบสิ่งนั้นให้ตัวเองในแบบที่ทำได้ตอนนี้ คุณไม่จำเป็นต้องเข้มแข็งตลอดเวลา และไม่ต้องตำหนิตัวเองที่ยังมีบางเรื่องเปราะบาง',
      'หากไม่ต้องทำให้ใครยอมรับ ชีวิตที่คุณต้องการอาจเป็นชีวิตที่มีพื้นที่ให้เลือกตามความรู้สึกและคุณค่าของตัวเองมากขึ้น สำหรับสถานการณ์ตอนนี้ ลองถามว่า “ถ้าไม่ต้องรีบพิสูจน์อะไร ฉันอยากรับมือกับเรื่องนี้อย่างไร?” วิธี “'+rhdCopingText+'” อาจเป็นจุดแข็งของคุณ แต่คุณก็อนุญาตให้ตัวเองเลือกวิธีใหม่ที่เบาสบายกว่าได้',
      'สิ่งที่ดูดพลังอาจไม่ใช่แค่ตัวเหตุการณ์ แต่อาจเป็นการต้องรับมือกับมันซ้ำ ๆ ด้วยวิธี “'+rhdCopingText+'” หรือการพยายามควบคุมสิ่งที่ยังไม่แน่นอน คุณอาจยังปล่อยไม่ได้เพราะเรื่องนี้มีความหมายหรือมีบางอย่างที่ยังค้างใจ ลองเริ่มจากแยกสิ่งที่คุณดูแลได้กับสิ่งที่อยู่นอกเหนือการควบคุม แล้วใช้คำแนะนำนี้เป็นหลัก: '+rhdDecisionText
    ];
    if (window.RABBITASTRO_ADMIN_MODE) {
      var adminRhdPrompts=[
        'ฉันกำลังหลีกเลี่ยงอะไรบางอย่างอยู่หรือเปล่า',
        'ความกลัวหรือความกังวลที่ใหญ่ที่สุดที่เรากำลังแบกไว้อยู่ตอนนี้ คือเรื่องอะไรกันแน่',
        'สิ่งใดที่ฉันกำลังทำอยู่ในชีวิตประจำวัน ที่ขัดแย้งกับความต้องการที่แท้จริงของเธอ',
        'ฉันต้องปล่อยวางเรื่องอะไร เพื่อให้เราสองคนเป็นหนึ่งเดียวกันและเดินหน้าต่อได้',
        'ตัวฉันในวัยเด็กกำลังรู้สึกอย่างไรกับชีวิตของฉันในตอนนี้ และเขาอยากบอกอะไรฉันมากที่สุด',
        'ถ้าฉันไม่ต้องพยายามทำให้ใครยอมรับหรือประทับใจเลย ชีวิตที่ฉันต้องการจริงๆ จะมีหน้าตาอย่างไร',
        'เรื่องอะไรในตอนนี้ที่สูบพลังงานชีวิตของฉันไปมากที่สุด และทำไมฉันถึงยังปล่อยมันไปไม่ได้'
      ];
      h+='<div class="rhd-section rhd-admin-reflections"><b>🪞 7 คำถามเจาะลึกและคำทำนายจาก RHD</b><p style="margin:6px 0 10px;">คำตอบทั้ง 7 ข้ออ่านจากสถานการณ์ปัจจุบันร่วมกับวิธีรับมือของคุณ จึงอาจเปลี่ยนไปเมื่อวันเวลาและรูปแบบการรับมือเปลี่ยนแปลง</p>';
      for (var ai=0;ai<adminRhdPrompts.length;ai++) {
        h+='<div class="rhd-reflection-answer" style="margin:10px 0;padding:10px;background:#fff;border:1px solid #f3d7bf;border-radius:9px;"><b>'+(ai+1)+'. '+escapeHTML(adminRhdPrompts[ai])+'</b><p style="margin:6px 0 0;line-height:1.85;">'+escapeHTML(rhdGentleAnswers[ai])+'</p></div>';
      }
      h+='</div>';
      h+='<div class="rhd-section rhd-situation-guidance" style="background:#fffaf5;border:1px solid #f3d7bf;border-radius:10px;padding:11px;"><b>🌱 วิธีดูแลตัวเองให้สอดคล้องกับสถานการณ์นี้</b><p>'+escapeHTML(rhdOverallText)+'</p><p><b>แนวทางที่เข้ากับวิธีรับมือของคุณ:</b> '+escapeHTML(rhdCopingText)+'</p><p><b>จุดที่อยากชวนให้ระวังอย่างอ่อนโยน:</b> '+escapeHTML(rhdCautionText)+'</p><p><b>ก้าวถัดไปที่พอทำได้:</b> '+escapeHTML(rhdDecisionText)+'</p></div>';
    }
    h += '<div class="rhd-note">ข้อความเหล่านี้เป็นเพียงกระจกสะท้อนให้คุณสำรวจใจ ไม่ใช่การอ่านใจหรือคำตัดสินตายตัว คุณเป็นคนที่รู้จักตัวเองได้ลึกที่สุด และเลือกตอบกลับเสียงข้างในในแบบของคุณได้เสมอ</div>';
    h += '</div>';
    return h;
  }

  // ปรับถ้อยคำคำทำนายทุก Engine ให้ตรงไปตรงมาและอ่านง่ายขึ้น โดยไม่แตะสูตรหรือข้อมูลคำนวณ
  function improvePredictionReadability(root, rabbitNum, featureKey) {
    if (!root) return;
    var resultTitle = root.querySelector ? root.querySelector('.card-title') : null;
    var resultTitleText = resultTitle ? (resultTitle.textContent || '') : '';
    // คงน้ำเสียงเฉพาะของ Engine 2 ไว้ ส่วน Engine อื่นปรับเป็นภาษาที่เข้าใจง่าย
    if (/คำทำนายมูเทพ|เทพองค์นี้อยากจะบอกอะไรกับคุณ|ข้อความจากองค์เทพ/i.test(resultTitleText)) return;
    var isEngineOne = /ผลการวิเคราะห์พื้นดวงตามโหรกระต่าย|ผลการวิเคราะห์ดวงชะตาบุคคล/.test(resultTitleText);
    var replacements = [
      [/พลังงานขับเคลื่อนเปิดกว้าง/g, 'มีโอกาสเริ่มต้นสิ่งใหม่'],
      [/พลังบวกหนุนนำ/g, 'มีปัจจัยช่วยสนับสนุน'],
      [/ดวงชะตา/g, 'ภาพรวมดวง'],
      [/เจ้าชะตา/g, 'ตัวคุณ'],
      [/มีเกณฑ์/g, 'มีโอกาส'],
      [/จังหวะชีวิต/g, 'ช่วงชีวิต'],
      [/จังหวะทอง/g, 'ช่วงที่โอกาสดี'],
      [/พุ่งทะยาน/g, 'ก้าวหน้าเร็ว'],
      [/ทะยาน/g, 'ก้าวหน้า'],
      [/เก็บเกี่ยวผลลัพธ์/g, 'ได้รับผลจากสิ่งที่ทำไว้'],
      [/เก็บเกี่ยว/g, 'ได้รับผลจากสิ่งที่ทำไว้'],
      [/คลี่คลายลง/g, 'เริ่มดีขึ้น'],
      [/คลี่คลาย/g, 'เริ่มดีขึ้น'],
      [/ภาวะทรงตัว/g, 'สถานการณ์ค่อนข้างคงที่'],
      [/สภาวะทางการเงินทรงตัว/g, 'รายรับรายจ่ายค่อนข้างคงที่'],
      [/สภาพคล่อง/g, 'เงินที่พร้อมใช้'],
      [/บริหารเงิน/g, 'จัดการเงิน'],
      [/รัดเข็มขัด/g, 'ลดค่าใช้จ่าย'],
      [/รากฐาน/g, 'พื้นฐาน'],
      [/ต่อยอด/g, 'นำไปพัฒนาต่อ'],
      [/สะสาง/g, 'จัดการให้เรียบร้อย'],
      [/คาราคาซัง/g, 'ค้างคา'],
      [/ยืดเยื้อ/g, 'ยืดเยื้อ'],
      [/เผชิญกับ/g, 'ต้องรับมือกับ'],
      [/ประคองตัว/g, 'รักษาสถานการณ์ให้มั่นคง'],
      [/ทุ่มเท/g, 'ลงแรงและเวลา'],
      [/พลิกแพลง/g, 'ปรับวิธี'],
      [/วิจารณญาณ/g, 'การคิดไตร่ตรอง'],
      [/อุปสรรค/g, 'ปัญหา'],
      [/ข้อพิพาท/g, 'ความขัดแย้ง'],
      [/บริวาร/g, 'คนรอบตัว'],
      [/นอบน้อม/g, 'สุภาพและให้เกียรติ'],
      [/ปิดดีล/g, 'ปิดข้อตกลง'],
      [/ดีล/g, 'ข้อตกลง'],
      [/แพสชัน/g, 'สิ่งที่สนใจ'],
      [/ออฟฟิศซินโดรม/g, 'อาการปวดเมื่อยจากการทำงาน'],
      [/สัญญาณเตือน/g, 'สิ่งที่ควรระวัง'],
      [/พิจารณา/g, 'ลองดู'],
      [/ดำเนินชีวิต/g, 'ใช้ชีวิต'],
      [/อย่างมีโครงสร้าง/g, 'อย่างเป็นขั้นตอน'],
      [/สม่ำเสมอ/g, 'ต่อเนื่อง'],
      [/โดยสังเขป/g, 'แบบสั้น ๆ'],
      [/ให้ถือเป็นสัญญาณ/g, 'ให้มองว่าเป็นสัญญาณ']
    ];
    // ปรับคำที่ฟังเหมือนตำราให้เป็นภาษาพูดที่อ่อนโยน เฉพาะ Engine 1 และไม่แตะ RHD
    if (isEngineOne) {
      replacements = replacements.concat([
        [/พื้นดวงนี้เป็นโครงของคนที่/g, 'ถ้ามองจากพื้นดวง คุณอาจเป็นคนที่'],
        [/ตัวตนที่แท้จริงของคุณคือ/g, 'ลึก ๆ แล้ว คุณอาจเป็นคนที่'],
        [/พรสวรรค์ติดตัวคือ/g, 'สิ่งที่คุณทำได้ดีโดยธรรมชาติคือ'],
        [/สิ่งที่อาจมองข้ามที่เจ้าตัวมองไม่เห็น/g, 'มุมที่คุณอาจยังไม่ทันสังเกต'],
        [/บทบาทต่อคนรอบข้างคือ/g, 'คนรอบตัวอาจมองคุณเป็นคนที่'],
        [/บทเรียนหลักของพื้นดวงนี้คือ/g, 'เรื่องสำคัญที่ชีวิตอาจกำลังชวนให้คุณเรียนรู้คือ'],
        [/จุดเปลี่ยนสำคัญของชีวิตมักมาในรูปของ/g, 'การเปลี่ยนแปลงครั้งสำคัญอาจเริ่มจาก'],
        [/จุดอ่อนของพื้นดวงนี้คือ/g, 'เรื่องที่คุณควรดูแลตัวเองเป็นพิเศษคือ'],
        [/พื้นดวงนี้เหมาะกับงานที่/g, 'คุณอาจรู้สึกเป็นตัวเองมากขึ้นกับงานที่'],
        [/ความรักของคุณจะยั่งยืนเมื่อ/g, 'ความรักน่าจะไปได้ดีเมื่อ'],
        [/คุณจะมีความสุขที่สุดเมื่อ/g, 'คุณอาจรู้สึกอิ่มใจมากขึ้นเมื่อ'],
        [/ต้องกำหนดวันพักล่วงหน้าเป็นวินัย ไม่ใช่รอให้เหนื่อยก่อน/g, 'ลองเผื่อเวลาพักไว้ก่อนที่จะหมดแรง ไม่ต้องรอให้ร่างกายประท้วง'],
        [/ชีวิตจะเปลี่ยนระดับทันที/g, 'คุณอาจเห็นความเปลี่ยนแปลงชัดขึ้นทีละน้อย'],
        [/โอกาสจะย้ายไปหาคนอื่น/g, 'โอกาสบางอย่างอาจผ่านไป จึงลองเริ่มจากก้าวเล็ก ๆ ที่ทำได้ตอนนี้'],
        [/คุณไม่ทนต่อความซ้ำเดิม/g, 'คุณอาจรู้สึกอึดอัดเมื่อทุกอย่างวนอยู่แบบเดิมนานเกินไป'],
        [/คุณมักไม่รู้ตัวว่า/g, 'บางครั้งคุณอาจไม่ทันสังเกตว่า'],
        [/ดวงนี้เกิดมาเพื่อ/g, 'คุณอาจมีจุดแข็งในการ'],
        [/บทบาทต่อคนรอบข้าง/g, 'สิ่งที่คนรอบตัวได้รับจากคุณ']
      ]);
    }
    function walk(node) {
      if (node.nodeType === 3) {
        var value = node.nodeValue;
        for (var i = 0; i < replacements.length; i++) value = value.replace(replacements[i][0], replacements[i][1]);
        // เปลี่ยน text node เฉพาะเมื่อข้อความต่างจากเดิมจริง ๆ เพื่อลด DOM mutation จำนวนมาก
        if (value !== node.nodeValue) node.nodeValue = value;
        return;
      }
      if (node.nodeType !== 1 || /^(SCRIPT|STYLE|INPUT|TEXTAREA|SELECT|OPTION)$/i.test(node.tagName)) return;
      for (var child = node.firstChild; child; child = child.nextSibling) walk(child);
    }
    walk(root);
    // แปลงถ้อยคำที่เหลือในรอบเดียวกับการสร้างผล ไม่ใช้ MutationObserver แยกอีกตัว
    if (typeof simplifyPredictionOutput === 'function') simplifyPredictionOutput(root);
    // ใช้กรอบสะท้อนใจแบบเดียวกันใน Engine 1, 3 และ 4; ไม่แตะ Engine 2 หรือโครงสร้างเฉพาะของ RHD
    var n = parseInt(rabbitNum, 10);
    if (n >= 1 && n <= 9 && featureKey !== 'rhd' && !root.querySelector('.subconscious-shared-voice')) {
      var voice = rabbitSubconsciousVoice(n);
      var box = document.createElement('div');
      box.className = 'pred-block subconscious-shared-voice';
      box.style.cssText = 'background:#fff7ed;border-color:#fed7aa;border-left:5px solid #ea580c;';
      setSafeHTML(box, '<h4 style="color:#9a3412;">💗 เสียงสะท้อนจากใจคุณ · เลขกระต่าย ' + n + '</h4>' +
        '<div class="pred-section-item"><b>สิ่งที่ใจอาจกำลังบอก:</b><br/>' + voice.core + '</div>' +
        '<div class="pred-section-item"><b>คำถามที่ลองถามตัวเองได้:</b><br/>' + voice.worry + '</div>' +
        '<div class="pred-section-item"><b>สิ่งที่คุณอาจต้องการในตอนนี้:</b><br/>' + voice.need + '</div>' +
        '<div class="pred-section-item"><b>ก้าวเล็ก ๆ ที่อ่อนโยนกับตัวเอง:</b><br/>' + voice.step + '</div>' +
        '<div style="font-size:12px;color:#7c5b46;margin-top:8px;">ข้อความนี้เป็นมุมสะท้อนเพื่อชวนสำรวจใจ ไม่ใช่การสรุปความรู้สึกของคุณอย่างแน่นอน</div>');
      root.appendChild(box);
    }
  }

  // ---------- Engine 1: ดวงบุคคล ----------
  function renderPersonResult(data, fromButton) {
    var isBase = (currentMode === "base");
    var view = isBase ? currentBaseView : currentTopicView;

    // แต่ละส่วนมีฟังก์ชันคำนวณของตัวเอง   คำนวณเฉพาะตัวเลขที่ส่วนนั้นต้องใช้
    var featureKey = 'topicShort';
    if (view === 'natal') featureKey = 'base';
    else if (view === 'rhd') featureKey = 'rhd';
    else if (view === 'asc') featureKey = 'asc';
    else if (view === 'month') featureKey = 'topicMonth';

    if (!Engine || typeof Engine.calcPerson !== 'function') throw new Error('PERSON_ENGINE_MISSING');
    var calcFeature = (featureKey === 'rhd') ? 'base' : featureKey;
    var res = Engine.calcPerson({
      feature: calcFeature,
      fName: data.fName, fLast: data.fLast,
      bDay: data.bDay, bMonth: data.bMonth, bYear: data.bYear,
      bHour: data.bHour, bMin: data.bMin,
      noBirthTime: data.noBirthTime,
      category: currentCategory,
      subTopicKey: currentSubKey
    });

    var titleText;
    if (featureKey === 'base') {
      titleText = 'ผลการวิเคราะห์พื้นดวงตามโหรกระต่าย · พื้นดวงกำเนิด';
    } else if (featureKey === 'rhd') {
      titleText = 'ผลการวิเคราะห์พื้นดวงตามโหรกระต่าย · Rabbit’s Habit Design (RHD)';
    } else if (featureKey === 'asc') {
      titleText = 'ผลการวิเคราะห์พื้นดวงตามโหรกระต่าย · ลัคนาราศี';
    } else if (featureKey === 'loveEntrant') {
      titleText = 'ผลการวิเคราะห์ดวงชะตาบุคคล · คนที่จะเข้ามา';
    } else {
      titleText = 'ผลการวิเคราะห์ดวงชะตาบุคคล · เรื่อง' + res.categoryName +
        (featureKey === 'topicMonth' ? ' · แนวโน้มรายเดือน 3 เดือน' : ' · ภาพรวมของเรื่องที่เลือก');
    }

    var body;
    if (featureKey === 'base') {
      body = renderBaseSection(res);
      body += renderAdminDeepSelfSection(data, 'person');
    } else if (featureKey === 'rhd') {
      body = renderRHDSection(res, featureKey, data);
    } else if (featureKey === 'asc') {
      body = renderAscSection(res);
    } else if (featureKey === 'loveEntrant') {
      body = renderLoveEntrantSection(res);
    } else if (featureKey === 'topicMonth') {
      body = renderTopicMonthSection(res);
    } else {
      body = renderTopicShortSection(res, calcTopicReading(res));
    }

    resultsBox.style.display = "block";
    var rhdBody = '';
    setSafeHTML(resultsBox, '<span class="card-title">' + titleText + '</span>' + body + rhdBody + featureCtaHtml(featureKey));
    improvePredictionReadability(resultsBox, (featureKey === 'topicShort' || featureKey === 'topicMonth') ? res.R4 : (res.baseCode || res.R4), featureKey);
    if (fromButton) resultsBox.scrollIntoView({ behavior: 'smooth' });
    return true;
  }

  function renderTarotRuneStandaloneResult(data, fromButton) {
    var stage = 'เตรียมระบบ';
    if (!Engine || typeof Engine.calcPerson !== 'function') throw new Error('TAROT_RUNE_ENGINE_MISSING: ไม่พบฟังก์ชันคำนวณของ Engine 4');
    // ตรวจวันที่จริงด้วย ไม่ใช่ตรวจเพียงช่วงตัวเลข เพื่อกันวันอย่าง 31 ก.พ. ที่ทำให้สูตรรับค่าผิด
    stage = 'ตรวจสอบข้อมูลวันเกิด';
    var day = parseInt(data.bDay, 10), month = parseInt(data.bMonth, 10), year = parseInt(data.bYear, 10);
    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year) || year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
      throw new Error('INVALID_BIRTH_DATE: กรุณาตรวจสอบวัน เดือน และปีเกิด (ปี ค.ศ.)');
    }
    var dateCheck = new Date(year, month - 1, day);
    if (dateCheck.getFullYear() !== year || dateCheck.getMonth() !== month - 1 || dateCheck.getDate() !== day) {
      throw new Error('INVALID_BIRTH_DATE: วันที่นี้ไม่มีอยู่จริง กรุณาตรวจสอบวันและเดือนเกิด');
    }
    stage = 'คำนวณไพ่ รูน และคริสตัล';
    var hour = data.noBirthTime ? 0 : parseInt(data.bHour || 0, 10);
    var minute = data.noBirthTime ? 0 : parseInt(data.bMin || 0, 10);
    if (!Number.isFinite(hour) || hour < 0 || hour > 23 || !Number.isFinite(minute) || minute < 0 || minute > 59) {
      throw new Error('INVALID_BIRTH_TIME: เวลาเกิดต้องอยู่ระหว่าง 00:00 ถึง 23:59 หรือเลือกไม่ทราบเวลาเกิด');
    }
    var res;
    try {
      res = Engine.calcPerson({
        feature: 'tarotRune', fName: data.fName || '', fLast: data.fLast || '',
        bDay: day, bMonth: month, bYear: year, bHour: hour, bMin: minute,
        noBirthTime: !!data.noBirthTime
      });
    } catch (calculationError) {
      calculationError.message = 'ขั้นตอน ' + stage + ' ล้มเหลว: ' + (calculationError.message || String(calculationError));
      throw calculationError;
    }
    stage = 'ตรวจสอบผลคำนวณ';
    if (!res || !res.birthCard || !res.eventCard || !res.dailyCrystalDate || !res.personalCrystal) {
      throw new Error('TAROT_RUNE_RESULT_INCOMPLETE: Engine 4 ส่งข้อมูลไพ่/คริสตัลกลับมาไม่ครบ');
    }
    stage = 'แสดงผลคำทำนาย';
    resultsBox.style.display = 'block';
    var body = '';
    try {
      body = renderTarotRuneSection(res);
    } catch (renderError) {
      // ป้องกันข้อผิดพลาดในส่วนตกแต่ง/คำอธิบายทำให้ผลคำนวณทั้งหมดหายไป
      console.error('Tarot/Rune detailed renderer failed; using safe fallback:', renderError);
      var bc = res.birthCard || {}, ec = res.eventCard || {}, pr = res.personalCrystal || {}, dc = res.dailyCrystalDate || {};
      var esc = function(v){return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
      body = '<div class="pred-block"><h4>🌙 ผลประจำตัว</h4><p><b>ไพ่ประจำตัว:</b> '+esc(bc.name || 'Not specified')+'</p><p><b>รูนประจำตัว:</b> '+esc(res.rune ? (res.rune[0]+' '+(res.rune[1]||'')) : 'ไม่ได้ระบุเวลาเกิด')+'</p><p><b>คริสตัลประจำตัว:</b> '+esc(pr.name || 'ยังไม่ระบุ')+'</p></div>'+
        '<div class="pred-block"><h4>☀️ ผลประจำวัน</h4><p><b>ไพ่ประจำวัน:</b> '+esc(ec.name || 'Not specified')+'</p><p><b>รูนประจำวัน:</b> '+esc(res.dailyRune ? (res.dailyRune[0]+' '+(res.dailyRune[1]||'')) : 'ยังไม่ระบุ')+'</p><p><b>คริสตัลประจำวัน:</b> '+esc(dc.name || 'ยังไม่ระบุ')+'</p><p>ส่วนคำอธิบายฉบับละเอียดมีปัญหา จึงแสดงผลคำนวณหลักไว้ก่อน</p></div>';
    }
    body += renderAdminDeepSelfSection(data, 'tarotRune');
    setSafeHTML(resultsBox, '<span class="card-title">ผลการวิเคราะห์ไพ่ทาโรต์ + อักษรรูน · ร่วมกับโหรกระต่าย</span>' + body + featureCtaHtml('tarotRune'));
    try { improvePredictionReadability(resultsBox, res.R4 || res.baseCode, 'tarotRune'); }
    catch (readabilityError) { console.warn('Tarot/Rune readability enhancement skipped:', readabilityError); }
    // การเลื่อนหน้าจอเป็นเพียงส่วนเสริม ต้องไม่ทำให้ผลคำนวณที่แสดงแล้วถูกแทนด้วย Error
    if (fromButton && resultsBox.scrollIntoView) { try { resultsBox.scrollIntoView({behavior:'smooth'}); } catch (scrollError) { console.warn('Tarot/Rune auto-scroll skipped:', scrollError); } }
    return true;
  }

  // ===== ตัวควบคุมปุ่มคำนวณแบบปลอดภัย =====
  // ใช้ event delegation เพื่อให้ปุ่มคำนวณยังทำงานได้ แม้มีส่วน UI อื่นเกิด error ระหว่างเริ่มต้น
  document.addEventListener("click", function (e) {
    var target = e.target && e.target.closest ? e.target.closest("#btnCalc") : null;
    if (!target || target.__horakHandled) return;
    target.__horakHandled = true;
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      var data = readSharedInputs();
      if (!isSharedComplete(data)) {
        if (resultsBox) {
          resultsBox.style.display = "block";
          setSafeHTML(resultsBox, '<div class="god-detail-box warn"><b>⚠️ กรุณากรอกข้อมูลให้ครบ</b><br/>กรอกชื่อ นามสกุล วัน เดือน และปีเกิด ก่อนกดคำนวณ</div>');
          resultsBox.scrollIntoView({behavior:"smooth"});
        }
        return;
      }
      var active = activeTabId();
      var ok = showResultFor(active || "tabPerson", true);
      if (!ok && resultsBox) {
        resultsBox.style.display = "block";
        setSafeHTML(resultsBox, '<div class="god-detail-box warn"><b>⚠️ ยังไม่สามารถแสดงคำทำนายได้</b><br/>กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง</div>');
      }
    } catch (err) {
      console.error("Horakratai main calculation error:", err);
      if (resultsBox) {
        resultsBox.style.display = "block";
        setSafeHTML(resultsBox, '<div class="god-detail-box warn"><b>⚠️ ระบบคำนวณขัดข้อง</b><br/>' + escapeHTML(err && err.message ? String(err.message) : "เกิดข้อผิดพลาดระหว่างคำนวณ") + '<br/><small>กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง</small></div>');
      }
    } finally {
      setTimeout(function(){ target.__horakHandled = false; }, 0);
    }
  }, true);

  var btnCalcTarotRune = document.getElementById("btnCalcTarotRune");
  if (btnCalcTarotRune) btnCalcTarotRune.addEventListener("click", function(e){
    if(e) e.preventDefault();
    if(resultsBox){ resultsBox.style.display='none'; resultsBox.innerHTML=''; }
    try { showResultFor('tabTarotRune', true); } catch(err) {
      console.error('Horakratai Tarot/Rune calculation error:',err);
      var tarotRuneError = (err && err.message) ? String(err.message) : String(err || 'ไม่ทราบสาเหตุ'); if (err && err.stack) console.error('Engine 4 Tarot/Rune error stack:', err.stack);
      if(resultsBox){
        var safeError = tarotRuneError.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        resultsBox.style.display='block';
        setSafeHTML(resultsBox,'<div class="god-detail-box warn"><b>⚠️ ระบบไพ่ทาโรต์ + รูนขัดข้อง</b><br/>ขั้นตอนที่ผิดพลาด: <code style="white-space:pre-wrap;overflow-wrap:anywhere;">'+safeError+'</code><br/><small>ระบบได้แยกข้อผิดพลาดจากการคำนวณ การแสดงผล และการเลื่อนหน้าจอแล้ว กรุณาใช้ข้อความนี้เพื่อตรวจจุดที่เหลือ</small></div>');
      }
    }
  });

  // ---------- Engine 2: องค์เทพประจำตัว ----------
  function renderGodResult(data, fromButton) {
    var params = {
      fName:data.fName, fLast:data.fLast,
      bDay:data.bDay, bMonth:data.bMonth, bYear:data.bYear,
      bHour:data.bHour, bMin:data.bMin, noBirthTime:data.noBirthTime
    };
    var godRes = Engine.calcGod(params);
    var god = godRes.godInfo || {}, ritual = godRes.godRitual || {};
    // ใช้เลขกระต่ายจากพื้นดวงตาม Engine โหรกระต่าย ไม่ใช้เลขเทพเป็นตัวเขียนคำทำนาย
    var rabbitRes = Engine.calcPerson(Object.assign({}, params, {feature:'base'})) || {};
    var rabbitNum = parseInt(rabbitRes.baseCode, 10) || 9;
    var rabbitInfo = (Engine.RABBITS && Engine.RABBITS[rabbitNum]) || {name:'พบทางออก',desc:'ค่อย ๆ มองหาทางเลือกที่เหมาะกับตัวเอง'};

    var rabbitMessages = {
      1: {message:'ถึงเวลาลองเริ่มสิ่งที่คุณคิดไว้มานานแล้ว ไม่จำเป็นต้องรอให้ทุกอย่างพร้อม 100% เลือกก้าวเล็ก ๆ ที่ทำได้วันนี้ แล้วค่อยปรับระหว่างทาง แต่อย่าลืมบอกคนที่เกี่ยวข้องให้เข้าใจตรงกัน', action:'เลือกเป้าหมายหนึ่งอย่าง แล้วลงมือทำขั้นแรกภายในวันนี้ อย่าแบกทุกอย่างไว้คนเดียว'},
      2: {message:'ตอนนี้คุณไม่จำเป็นต้องรีบตัดสินใจ ฟังข้อมูลให้ครบ สังเกตการกระทำมากกว่าคำพูด แล้วค่อยเลือกทางที่เหมาะกับตัวเอง การรออย่างมีสติไม่ใช่ความล่าช้า แต่ต้องรู้ด้วยว่ากำลังรออะไร', action:'รวบรวมข้อมูลที่ยังขาด ถามในสิ่งที่สงสัย และกำหนดเวลาทบทวนเพื่อตัดสินใจให้ชัด'},
      3: {message:'ถ้าคุณเห็นโอกาสและอยากเดินหน้า ให้ใช้พลังนั้นลงมือทำได้เลย คุณไม่จำเป็นต้องทำทุกอย่างพร้อมกัน เลือกเรื่องที่สำคัญที่สุดก่อน แล้วพาตัวเองไปทีละขั้น ระวังอย่ารับหลายเรื่องจนหมดแรง', action:'จัดลำดับความสำคัญ เลือกหนึ่งเรื่องที่อยากให้คืบหน้า แล้วทำให้เห็นผลเป็นรูปธรรม'},
      4: {message:'ก่อนจะเดินหน้าต่อ ขอให้ตรวจรายละเอียดให้รอบคอบอีกครั้ง โดยเฉพาะเรื่องเงิน ข้อตกลง และคำสัญญา การชะลอเพื่อตรวจสอบไม่ได้แปลว่าคุณพลาดโอกาส แต่ช่วยลดปัญหาที่แก้ทีหลังได้ยาก', action:'ตรวจข้อเท็จจริงและเงื่อนไขสำคัญ หากยังไม่แน่ใจให้ถามเพิ่มก่อนตกลงหรือลงทุน'},
      5: {message:'ช่วงนี้คุณอาจต้องถอยออกมาพักและเก็บแรงก่อน ไม่จำเป็นต้องอธิบายทุกอย่างให้ทุกคนเข้าใจทันที ดูแลพื้นฐานของตัวเองให้ดี แล้วค่อยกลับไปจัดการเรื่องสำคัญเมื่อพร้อม อย่าปล่อยให้ความเงียบกลายเป็นการหลบปัญหานานเกินไป', action:'กันเวลาพัก จัดการเรื่องจำเป็นทีละอย่าง และเลือกคนที่ไว้ใจได้สักคนเพื่อพูดคุยเมื่อรู้สึกหนักใจ'},
      6: {message:'ถ้าวิธีเดิมทำให้คุณติดอยู่ที่เดิม ลองเปลี่ยนวิธีหรือมุมมองดูได้ คุณไม่จำเป็นต้องฝืนเส้นทางเดิมเพียงเพราะเริ่มมาแล้ว แต่ก่อนเปลี่ยนแผน ควรดูผลกระทบและเลือกทางใหม่ที่ทำได้จริง', action:'ทบทวนว่าอะไรไม่ได้ผล แล้วปรับเพียงหนึ่งอย่างก่อนประเมินผล ไม่ต้องเปลี่ยนทุกอย่างพร้อมกัน'},
      7: {message:'บางคำตอบอาจอยู่ในเรื่องที่คุณเคยผ่านมาก่อน ลองกลับไปดูว่าอะไรเคยได้ผล อะไรทำให้สะดุด และมีสิ่งไหนที่ยังแก้ไขได้ คุณไม่จำเป็นต้องโทษตัวเองกับอดีต ใช้ประสบการณ์เป็นข้อมูลเพื่อเลือกครั้งต่อไปให้ดีขึ้น', action:'ทบทวนบทเรียนจากเรื่องเดิมหนึ่งเรื่อง แล้วกำหนดว่าจะทำต่างจากเดิมอย่างไร'},
      8: {message:'คุณไม่จำเป็นต้องเร่งให้ทุกอย่างเดินหน้าในทันที บางช่วงการรักษาสิ่งที่มีอยู่และดูแลใจตัวเองก็สำคัญพอ ๆ กับการเติบโต ใช้เวลานี้จัดระเบียบชีวิตและรักษาพลัง แต่ยังคงขยับเรื่องเล็ก ๆ ที่จำเป็นต่อไป', action:'ลดสิ่งที่ไม่จำเป็น จัดเวลาพัก และรักษากิจวัตรที่ช่วยให้ชีวิตมั่นคง'},
      9: {message:'เรื่องที่ค้างคาอาจเริ่มเห็นทางออก หากคุณแยกปัญหาออกเป็นส่วน ๆ และจัดการทีละเรื่อง ไม่จำเป็นต้องแก้ทุกอย่างในวันเดียว ขอให้มองหาทางเลือกที่เป็นไปได้และกล้าขอความช่วยเหลือเมื่อจำเป็น', action:'เขียนปัญหาที่กังวลออกมา เลือกข้อที่จัดการได้ก่อนหนึ่งข้อ แล้วเริ่มลงมืออย่างเป็นขั้นตอน'}
    };
    var rabbitMessage = rabbitMessages[rabbitNum] || rabbitMessages[9];
    // บทสนทนาจากองค์เทพประจำตัว เขียนเป็นภาษาพูดโดยอิงความหมายเลขโหรกระต่าย
    var godConversation = {
      1: 'ลูกเอ๋ย… มีความฝันบางอย่างที่เจ้าเก็บเงียบ ๆ ไว้ในใจมานานหรือไม่ บางทีสิ่งที่ทำให้เจ้ายังไม่เริ่ม อาจไม่ใช่เพราะเจ้าไม่เก่งพอ แต่เป็นเพราะกลัวว่าจะผิดหวังอีกครั้ง ข้าอยากให้เจ้ารู้ว่า เจ้าไม่ต้องมั่นใจเต็มร้อยจึงจะเริ่มได้ แค่ซื่อตรงกับสิ่งที่หัวใจต้องการ แล้วค่อย ๆ ก้าวไปทีละก้าวก็พอ วันนี้ขอเพียงอย่าทอดทิ้งความหวังของตัวเองนะ',
      2: 'ลูกเอ๋ย… เจ้าไม่จำเป็นต้องรีบหาคำตอบเพื่อทำให้ทุกคนพอใจ บางครั้งเสียงรอบตัวก็ดังจนเราแทบไม่ได้ยินใจตัวเอง ลองให้เวลาตัวเองได้สงบลง แล้วถามอย่างอ่อนโยนว่า “จริง ๆ แล้ว ฉันต้องการอะไร และอะไรคือสิ่งที่ดีต่อฉัน” เจ้าไม่จำเป็นต้องตัดสินใจในวันที่ใจยังวุ่นวาย ค่อย ๆ ดูให้ชัด แล้วเลือกด้วยความเข้าใจ ไม่ใช่ด้วยความกลัวนะ',
      3: 'ข้าอยากให้เจ้ามองตัวเองด้วยสายตาที่เมตตากว่านี้หน่อย เจ้ามักเห็นสิ่งที่ยังทำไม่สำเร็จ จนลืมมองว่าตัวเองเดินมาไกลแค่ไหนแล้ว เจ้าไม่จำเป็นต้องเก่งทุกเรื่อง หรือทำให้ทุกคนพอใจในวันเดียว เลือกสิ่งสำคัญสักอย่าง แล้วลงมือด้วยแรงที่มี หากวันนี้ทำได้เพียงนิดเดียว นั่นก็ยังเป็นความก้าวหน้า จงอย่าลืมดูแลคนที่พาเจ้ามาถึงตรงนี้ด้วย… ก็คือตัวเจ้าเอง',
      4: 'ลูกเอ๋ย… ความใจดีของเจ้าเป็นสิ่งงดงาม แต่ไม่จำเป็นต้องแลกด้วยการยอมทุกอย่าง หากมีเรื่องใดทำให้ใจเจ้าไม่สบายใจ เจ้าสามารถหยุดถามให้ชัด และขอเวลาคิดได้ การตั้งขอบเขตไม่ได้แปลว่าเจ้าใจร้าย มันคือการดูแลตัวเองอย่างที่เจ้าสมควรได้รับ ก่อนฝากความหวังไว้กับคำพูดของใคร ขอให้ดูการกระทำและข้อเท็จจริงด้วยนะ',
      5: 'มานี่ก่อนลูก… หากช่วงนี้เจ้าเหนื่อย ก็ไม่ต้องฝืนยิ้มให้ใครเห็นตลอดเวลาก็ได้ เจ้าไม่จำเป็นต้องเป็นคนเข้มแข็งอยู่ฝ่ายเดียว และไม่ต้องแก้ทุกปัญหาให้เสร็จในวันนี้ ลองหายใจช้า ๆ ให้ตัวเองได้พัก โดยไม่ต้องรู้สึกผิด แล้วค่อยเริ่มจากสิ่งเล็กที่สุดที่ไหว หากความหนักในใจมากเกินกว่าจะรับไว้คนเดียว ขอให้เอื้อมมือหาคนที่เจ้าไว้ใจ เจ้าเองก็สมควรได้รับการดูแลเช่นกัน',
      6: 'ลูกเอ๋ย… การที่บางอย่างไม่เป็นไปตามที่หวัง ไม่ได้หมายความว่าเจ้าล้มเหลวเสมอไป บางครั้งมันกำลังบอกว่าวิธีเดิมอาจไม่เหมาะกับเจ้าอีกแล้ว เจ้าไม่จำเป็นต้องฝืนเพียงเพราะลงทุนลงแรงมาเยอะ ลองถามตัวเองว่า “ถ้าไม่ต้องกลัวคำตัดสินของใคร ฉันอยากปรับอะไรให้ชีวิตดีขึ้น” ไม่ต้องเปลี่ยนทุกอย่างในคราวเดียว เลือกก้าวใหม่ที่เป็นไปได้ แล้วอนุญาตให้ตัวเองเรียนรู้ระหว่างทางนะ',
      7: 'ข้าอยากให้เจ้าหยุดตำหนิตัวเองกับเรื่องที่ผ่านไปแล้วสักครู่ สิ่งที่เกิดขึ้นอาจมีทั้งความเสียใจและบทเรียน แต่ไม่ได้เป็นคำตัดสินว่าตัวเจ้าไม่มีค่า ลองมองอดีตด้วยความเข้าใจแบบที่เจ้าจะมอบให้คนที่รัก แล้วถามว่า “จากนี้ฉันอยากดูแลตัวเองให้ดีขึ้นอย่างไร” เจ้าเปลี่ยนสิ่งที่ผ่านมาไม่ได้ แต่ยังเลือกได้ว่าจะพาตัวเองเดินต่อไปแบบไหน ขอให้ใช้บทเรียนเป็นแสงนำทาง ไม่ใช่โซ่ที่ล่ามตัวเองไว้นะ',
      8: 'ลูกเอ๋ย… เจ้าไม่จำเป็นต้องพิสูจน์คุณค่าของตัวเองด้วยการทำงานไม่หยุด หรือรับทุกเรื่องไว้บนบ่า คุณมีคุณค่าแม้ในวันที่พัก แม้ในวันที่ยังไม่มีคำตอบ และแม้ในวันที่ทำได้ไม่เท่าที่ตั้งใจ ลองวางสิ่งที่ไม่จำเป็นลงบ้าง แล้วกลับมาดูแลสิ่งพื้นฐานในชีวิตทีละอย่าง การค่อย ๆ ประคองตัวเองให้มั่นคงไม่ใช่การถอยหลัง แต่เป็นการให้ใจมีแรงเดินต่อเมื่อถึงเวลา',
      9: 'ลูกเอ๋ย… หากตอนนี้ทุกอย่างดูพันกันยุ่งไปหมด อย่าเพิ่งตัดสินว่าตัวเองไม่มีทางออกนะ เมื่อใจเหนื่อย ปัญหาทุกเรื่องอาจดูใหญ่กว่าที่เป็นจริง ลองหยุดพัก แล้วแยกสิ่งที่กังวลออกมาทีละข้อ เลือกจัดการเพียงเรื่องเดียวที่พอเริ่มได้ก่อน เจ้าสามารถขอความช่วยเหลือได้ ไม่จำเป็นต้องผ่านทุกอย่างลำพัง แม้วันนี้ยังมองไม่เห็นทางทั้งหมด ก็ไม่เป็นไร ขอเพียงอย่าลืมว่าตัวเองยังมีสิทธิ์เริ่มต้นใหม่ทีละนิด'
    };
    var godConversationText = godConversation[rabbitNum] || godConversation[9];
    var h = '<span class="card-title">💌 เทพองค์นี้อยากจะบอกอะไรกับคุณ</span>';
    h += '<div class="god-card god-card-main">';
    h += '<div class="god-title">⛩️ ' + (god.name || '-') + ' <span class="god-type">' + (god.type || '') + '</span></div>';
    h += '<div class="god-code-row"><span>🐇 เลขโหรกระต่ายของคุณ: ' + rabbitNum + ' · ' + rabbitInfo.name + '</span></div>';
    h += '<div class="answer-box good god-message-box"><b>💌 ข้อความที่อยากให้คุณรับรู้</b><br/>' + rabbitMessage.message + '</div>';
    h += '<div class="god-lead"><b>🌿 ลองทำสิ่งนี้ต่อจากนี้</b><br/>' + rabbitMessage.action + '</div>';
    h += '<div class="god-detail-box" style="margin-top:10px;"><div class="god-detail-title">✨ ความหมายขององค์เทพในความเชื่อ</div>' + (god.bless || 'ใช้สติและความตั้งใจเป็นแนวทางในการดำเนินชีวิต') + '</div>';
    h += '</div>';
    h += '<div class="pred-block god-conversation-block"><h4 style="color:#92400e;">🗣️ ข้อความจากองค์เทพถึงหัวใจของคุณ</h4>';
    h += '<div class="answer-box good god-message-box"><b>⛩️ ' + (god.name || 'เทพประจำตัว') + ' พูดกับคุณว่า...</b><br/>' + godConversationText + '</div>';
    h += '<div class="pred-section-item" style="margin-top:10px;">ลองอ่านช้า ๆ แล้วสังเกตว่าประโยคไหนทำให้คุณหยุดคิดหรือรู้สึกบางอย่าง ไม่จำเป็นต้องเชื่อทุกคำ เลือกเก็บไว้เฉพาะสิ่งที่ช่วยให้เข้าใจตัวเองและดูแลชีวิตได้ดีขึ้น</div>';
    var godComfort = {
      1:'ถึงคุณคนที่พยายามเริ่มต้นอยู่เสมอ… คุณไม่จำเป็นต้องพิสูจน์ว่าตัวเองเก่งพอในทุกวัน แค่ยังไม่ทอดทิ้งสิ่งที่สำคัญกับใจ และยอมให้ตัวเองเริ่มจากก้าวเล็ก ๆ ก็มีความหมายมากแล้ว',
      2:'ถึงคุณที่คอยคิดถึงความรู้สึกของทุกคน… ความต้องการของคุณก็สำคัญไม่แพ้ใคร คุณไม่จำเป็นต้องตอบตกลงเพื่อรักษาความสัมพันธ์ทุกครั้ง คนที่เห็นคุณค่าของคุณควรมีพื้นที่ให้คุณเป็นตัวเองด้วย',
      3:'ถึงคุณที่พยายามทำให้หลายอย่างดีขึ้น… ขอให้คุณเห็นความพยายามของตัวเองบ้าง แม้วันนี้จะไปได้ไม่ไกลเท่าที่หวัง คุณก็ยังมีคุณค่า ไม่จำเป็นต้องเหนื่อยจนหมดแรงเพื่อให้สมควรได้รับคำชื่นชม',
      4:'ถึงคุณที่พยายามระวังไม่ให้ผิดพลาด… คุณมีสิทธิ์หยุดพักและค่อย ๆ ตัดสินใจ ไม่ต้องแบกหน้าที่ดูแลทุกอย่างไว้คนเดียว ความผิดพลาดไม่ได้ลบคุณค่าของคุณ และการขอความชัดเจนก็ไม่ใช่เรื่องน่าอาย',
      5:'ถึงคุณที่เหนื่อยมานาน… คุณไม่จำเป็นต้องยิ้มหรือเข้มแข็งให้ใครสบายใจตลอดเวลา วันนี้ถ้าทำได้แค่พัก หายใจ และดูแลตัวเองให้ผ่านไปอย่างอ่อนโยน นั่นก็เพียงพอแล้ว คุณเองก็สมควรได้รับการดูแล',
      6:'ถึงคุณที่กำลังลังเลว่าจะเปลี่ยนทางดีไหม… การเปลี่ยนใจไม่ได้แปลว่าที่ผ่านมาคุณเลือกผิดเสมอไป บางครั้งคุณแค่เติบโตและต้องการสิ่งที่เหมาะกับตัวเองมากขึ้น คุณค่อย ๆ ปรับได้ โดยไม่ต้องตำหนิตัวเอง',
      7:'ถึงคุณที่ยังนึกถึงเรื่องเก่า ๆ… คุณไม่จำเป็นต้องลงโทษตัวเองซ้ำเพื่อพิสูจน์ว่าได้เรียนรู้แล้ว คุณสามารถยอมรับสิ่งที่เกิดขึ้น เก็บบทเรียนไว้ และอนุญาตให้ตัวเองมีวันที่เบาสบายกว่านั้นได้',
      8:'ถึงคุณที่ผูกคุณค่าของตัวเองไว้กับความสำเร็จ… คุณมีความหมายแม้ในวันที่ยังทำอะไรไม่สำเร็จตามแผน การพักไม่ใช่ความล้มเหลว และคุณไม่จำเป็นต้องทำให้ทุกคนพอใจจึงจะคู่ควรกับความรักและความเข้าใจ',
      9:'ถึงคุณที่กำลังพยายามหาทางออก… คุณไม่จำเป็นต้องมองเห็นคำตอบทั้งหมดในวันนี้ ค่อย ๆ แก้ทีละเรื่อง และขอแรงช่วยเมื่อจำเป็นได้ การเดินช้าลงไม่ได้แปลว่าคุณแพ้ คุณยังมีโอกาสเริ่มใหม่ในจังหวะของตัวเอง'
    };
    h += '<div class="pred-block god-comfort-block" style="margin-top:12px;background:#fff7ed;border:1px solid #fed7aa;border-left:5px solid #ea580c;border-radius:12px;padding:13px;line-height:1.8;"><h4 style="margin:0 0 7px;color:#9a3412;">🤍 ประโยคที่อยากให้หัวใจของคุณได้ยิน</h4><div>' + (godComfort[rabbitNum] || godComfort[9]) + '</div><div style="margin-top:7px;font-size:12px;color:#7c5b4b;">ไม่จำเป็นต้องฝืนให้ตัวเองรู้สึกดีทันที แค่ค่อย ๆ รับฟังใจตัวเองก็พอ</div></div>';
    h += '</div>';
    h += '<p style="font-size:12px;color:var(--text-muted);margin-top:12px;">ผลนี้เป็นการจับคู่ตามศาสตร์เลขศาสตร์และความเชื่อส่วนบุคคล</p>';
    resultsBox.style.display = 'block';
    h += renderAdminDeepSelfSection(params, 'god');
    setSafeHTML(resultsBox, h);
    improvePredictionReadability(resultsBox, rabbitNum, 'god');
    if (fromButton && typeof resultsBox.scrollIntoView === 'function') resultsBox.scrollIntoView({behavior:'smooth'});
    return true;
  }

  var btnCalcGod = document.getElementById("btnCalcGod");
  if (btnCalcGod) btnCalcGod.addEventListener("click", function(e){
    if(e)e.preventDefault(); if(resultsBox){resultsBox.style.display='none';resultsBox.innerHTML='';}
    try{showResultFor("tabGod",true);}catch(err){console.error("Horakratai personal deity calculation error:",err);if(resultsBox){resultsBox.style.display='block';setSafeHTML(resultsBox,'<div class="god-detail-box warn"><b>⚠️ ระบบค้นหาองค์เทพประจำตัวขัดข้อง</b><br/>กรุณาตรวจสอบข้อมูลที่กรอกแล้วลองกดคำนวณใหม่อีกครั้ง</div>');}}
  });

  // ---------- Engine 3: ตำราโอเรกุรัม — คำทำนายที่อบอุ่นและชวนเข้าใจตัวเอง ----------
  // ปรับเฉพาะภาษาที่แสดงใน Engine 3 โดยไม่เปลี่ยนสูตรคำนวณหรือข้อมูลของ Engine อื่น
  function warmOreguramText(text) {
    if (text == null) return '';
    return modernOreguText(String(text))
      .replace(/จะสมประสงค์/g, 'มีโอกาสค่อย ๆ เป็นไปตามที่หวัง')
      .replace(/จะจบลงด้วยดี/g, 'มีโอกาสค่อย ๆ หาทางคลี่คลายได้')
      .replace(/จะเป็นจุดเปลี่ยนที่ดีของชีวิต/g, 'อาจเป็นจุดเปลี่ยนที่พาคุณไปสู่ทางเลือกที่เหมาะขึ้น')
      .replace(/ทำอะไรคุณไม่ได้/g, 'อาจส่งผลกับคุณได้น้อยลง หากคุณดูแลขอบเขตของตัวเองให้ดี')
      .replace(/คุณแทบไม่ต้องออกแรงสู้/g, 'คุณอาจไม่จำเป็นต้องใช้พลังไปกับการต่อสู้ทุกเรื่อง')
      .replace(/สมัครที่ไหนก็มีเกณฑ์ได้/g, 'มีโอกาสได้รับข่าวดีจากการสมัคร หากเตรียมตัวและเลือกสิ่งที่เหมาะกับตัวเอง')
      .replace(/อาการจะทุเลาลงอย่างชัดเจน/g, 'อาการอาจค่อย ๆ ดีขึ้นได้เมื่อได้รับการดูแลที่เหมาะสม')
      .replace(/สุขภาพกลับมาแข็งแรง/g, 'ร่างกายอาจค่อย ๆ ฟื้นตัวเมื่อได้รับการดูแลอย่างต่อเนื่อง')
      .replace(/หาเท่าไรก็ยากพบ/g, 'การตามหาอาจยังไม่ง่าย และคุณอาจต้องเผื่อใจไว้หลายทางเลือก')
      .replace(/แนวโน้มสูญเสียถาวร/g, 'ยังมีความไม่แน่นอน และอาจต้องเตรียมใจรับความเป็นไปได้หลายแบบ')
      .replace(/มีเกณฑ์ถูกโจมตี/g, 'อาจมีสถานการณ์ที่ทำให้คุณรู้สึกถูกกดดัน')
      .replace(/ด่วน/g, 'อย่างใจเย็นและรอบคอบ')
      .replace(/ต้อง/g, 'อาจต้อง')
      .replace(/ควร/g, 'ลอง')
      .replace(/อย่าเพิ่ง/g, 'คุณยังไม่จำเป็นต้องรีบ')
      .replace(/ระวัง/g, 'ลองใส่ใจ');
  }

  function oreguramSelfReflection(category, bucket) {
    var prompts = {
      work: 'เรื่องงานอาจแตะทั้งความมั่นคง ความสามารถ และความรู้สึกว่าตัวเองมีคุณค่า ลองถามใจตัวเองว่า งานแบบไหนที่ทำให้คุณเติบโต โดยไม่ต้องฝืนจนหมดแรง?',
      money: 'เรื่องเงินอาจทำให้ใจไม่มั่นคงได้ง่ายนะ ลองมองตัวเลขตามจริงโดยไม่ตำหนิตัวเอง แล้วถามว่า ตอนนี้สิ่งไหนจะช่วยให้คุณรู้สึกปลอดภัยขึ้นได้ทีละนิด?',
      love: 'ความรักไม่จำเป็นต้องให้คุณเดาใจอีกฝ่ายอยู่คนเดียว ลองสังเกตทั้งคำพูดและการกระทำ พร้อมถามตัวเองว่า ความสัมพันธ์แบบไหนที่ทำให้คุณรู้สึกได้รับความใส่ใจและเป็นตัวเองได้?',
      health: 'ขอให้คุณใจดีกับตัวเองเป็นพิเศษนะ ลองฟังสัญญาณจากร่างกายและให้ความสำคัญกับการดูแลที่เหมาะสม คุณไม่จำเป็นต้องเข้มแข็งหรือรับมือทุกอย่างเพียงลำพัง',
      interest: 'สิ่งที่คุณหวังอาจบอกอะไรบางอย่างเกี่ยวกับความต้องการลึก ๆ ในใจ ลองถามตัวเองว่า หากไม่ต้องกลัวว่าจะทำให้ใครผิดหวัง คุณอยากเลือกอะไรให้ตัวเองมากที่สุด?',
      other: 'ไม่ว่าเรื่องนี้จะลงเอยอย่างไร ความรู้สึกและความต้องการของคุณก็มีความหมาย ลองแยกสิ่งที่ควบคุมได้ออกจากสิ่งที่ควบคุมไม่ได้ แล้วเลือกดูแลส่วนที่อยู่ในมือของคุณก่อนนะ'
    };
    var endings = {
      good: 'ถ้าผลนี้ทำให้คุณมีความหวัง ก็รับความหวังนั้นไว้ได้เลย พร้อมค่อย ๆ ลงมือในแบบที่ปลอดภัยและเหมาะกับชีวิตจริงของคุณ',
      mid: 'ถ้าตอนนี้ยังไม่ชัดเจน คุณไม่จำเป็นต้องรีบหาคำตอบทั้งหมด ค่อย ๆ เก็บข้อมูลและให้เวลาตัวเองได้คิดอย่างสบายใจ',
      warn: 'ถ้าผลนี้ทำให้กังวล ขอให้หายใจลึก ๆ ก่อนนะ นี่ไม่ใช่คำตัดสินอนาคต แต่เป็นโอกาสให้คุณทบทวนทางเลือกและดูแลตัวเองให้รอบคอบขึ้น'
    };
    return (prompts[category] || prompts.other) + ' ' + (endings[bucket] || endings.mid);
  }

  function renderOreguramResult(data, fromButton) {
    if (!data) data = {};
    var q = document.getElementById('oreguramQuestion');
    var qId = q ? parseInt(q.value, 10) : 1;
    if (!qId || !Engine.OREGURAM_QUESTIONS.some(function (x) { return x.id === qId; })) qId = 1;
    var res = Engine.calcOreguram({ questionId: qId, bDay: data.bDay, bMonth: data.bMonth, bYear: data.bYear, bHour: data.bHour, bMin: data.bMin, noBirthTime: !!data.noBirthTime, fName: data.fName || '', fLast: data.fLast || '' });
    var bi = res.bucketInfo || { chip: '', cls: '', emoji: '', label: 'ผลการอ่าน' };
    var h = '<span class="card-title">🔮 คำทำนายโอเรกุรัม</span>';
    h += '<div class="topic-line" style="margin-top:0;">❓ <b>คำถาม:</b> ' + warmOreguramText(res.questionText || '-') + '</div>';
    h += '<div class="answer-box ' + (bi.cls || '') + '"><b>🎯 ผลคำทำนาย</b><br/>' + warmOreguramText(res.directAnswer || '-') + '</div>';
    h += '<div class="pred-block" style="background:#fffaf0;border-color:#fed7aa;border-left:5px solid #ea580c;"><h4 style="color:#9a3412;">🔮 รายละเอียดคำทำนาย</h4>';
    if (res.catPrediction && res.catPrediction.overview) h += '<div class="pred-section-item"><b>แนวโน้ม:</b><br/>' + warmOreguramText(res.catPrediction.overview) + '</div>';
    else if (res.deep && res.deep.focus) h += '<div class="pred-section-item"><b>แนวโน้ม:</b><br/>' + warmOreguramText(res.deep.focus) + '</div>';
    if (res.catPrediction && res.catPrediction.detail) h += '<div class="pred-section-item"><b>สิ่งที่อาจเกิดขึ้น:</b><br/>' + warmOreguramText(res.catPrediction.detail) + '</div>';
    else if (res.catPrediction && res.catPrediction.example) h += '<div class="pred-section-item"><b>สิ่งที่อาจเกิดขึ้น:</b><br/>' + warmOreguramText(res.catPrediction.example) + '</div>';
    if (res.deep && res.deep.action) h += '<div class="pred-section-item"><b>สิ่งที่ควรทำ:</b><br/>' + warmOreguramText(res.deep.action) + '</div>';
    else if (res.catPrediction && res.catPrediction.advice) h += '<div class="pred-section-item"><b>คำแนะนำ:</b><br/>' + warmOreguramText(res.catPrediction.advice) + '</div>';
    if (res.deep && res.deep.caution) h += '<div class="pred-section-item"><b>ข้อควรระวัง:</b><br/>' + warmOreguramText(res.deep.caution) + '</div>';
    h += '</div>';
    h += '<div class="pred-block" style="background:#fff7fb;border-color:#fbcfe8;border-left:5px solid #ec4899;"><h4 style="color:#9d174d;">💗 ลองฟังใจตัวเองสักนิด</h4><div class="pred-section-item" style="line-height:1.85;">' + oreguramSelfReflection(res.category, res.bucket) + '</div><div class="pred-section-item" style="font-size:13px;color:#6b5360;">คำทำนายนี้เป็นเพียงมุมมองหนึ่ง ไม่ใช่คำตัดสินว่าชีวิตต้องเป็นแบบใด คุณยังมีสิทธิ์เลือก ตั้งขอบเขต และเปลี่ยนแปลงสิ่งต่าง ๆ ตามข้อมูลจริงและความต้องการของตัวเองนะ</div></div>';
    h += '<div class="pred-block"><h4>🐇 รหัสคำทำนาย</h4><div class="pred-section-item"><b>' + ((res.rabbit && res.rabbit.name) || 'รหัสกระต่าย ' + res.R4) + ' · เลข ' + res.R4 + '</b></div>';
    h += '<div class="pred-section-item"><b>ธาตุประจำผล:</b> ' + ((res.element && res.element.name) || '-') + ' ' + ((res.element && res.element.symbol) || '') + '</div></div>';

    if (res.pendulumDirection) {
      h += '<div class="pred-block" style="background:#f5f3ff;border-color:#ddd6fe;border-left:5px solid #7c3aed;">';
      h += '<h4 style="color:#5b21b6;">🧭 ทิศทางจากศาสตร์เพนดูลัม</h4>';
      h += '<div class="answer-box" style="margin-top:8px;background:#faf5ff;border-color:#d8b4fe;"><b>' + res.pendulumDirection.symbol + ' ทิศที่เพนดูลัมชี้:</b><br/><span style="font-size:18px;color:#5b21b6;">' + res.pendulumDirection.name + '</span><br/><span style="font-size:12.5px;color:#4a5568;">เลขทิศทาง ' + res.pendulumDirectionNo + ' · ' + res.pendulumDirection.meaning + '</span></div>';
      h += '</div>';
    }
    h += renderAdminDeepSelfSection(data, 'oreguram');
    var ctaKey = res.category === 'work' ? 'oreguWork' : (res.category === 'money' ? 'oreguMoney' : (res.category === 'love' ? 'oreguLove' : 'oregu')); 
    h += featureCtaHtml(ctaKey);
    resultsBox.style.display = 'block';
    setSafeHTML(resultsBox, h);
    improvePredictionReadability(resultsBox, res.R4, 'oreguram');
    if (fromButton && typeof resultsBox.scrollIntoView === 'function') resultsBox.scrollIntoView({ behavior: 'smooth' });
    return true;
  }

  var btnOregu = document.getElementById("btnCalcOreguram");
  if (btnOregu) btnOregu.addEventListener("click", function (e) {
    if (e) e.preventDefault();
    try {
      var data = readSharedInputs();
      if (!isSharedComplete(data)) {
        alert("กรุณากรอกชื่อ-นามสกุล และวัน เดือน ปีเกิด ให้ครบก่อนคำนวณค่ะ");
        return;
      }
      if (resultsBox) {
        resultsBox.style.display = "none";
        resultsBox.innerHTML = "";
      }
      renderOreguramResult(data, true);
    } catch (err) {
      console.error("Horakratai Oreguram calculation error:", err);
      if (resultsBox) {
        resultsBox.style.display = "block";
        var errorMessage = err && err.message != null && String(err.message).trim() ? String(err.message) : (typeof err === "string" && err.trim() ? err : "เกิดข้อผิดพลาดระหว่างคำนวณโอเรกุรัม");
        setSafeHTML(resultsBox, '<div class="god-detail-box warn"><b>⚠️ ระบบคำนวณโอเรกุรัมขัดข้อง</b><br/>เกิดข้อผิดพลาด: ' + escapeHTML(errorMessage) + '<br/><small>กรุณาลองคำนวณใหม่อีกครั้ง</small></div>');
      }
    }
  });
});
  