(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const Engine = window.Horakratai;
  const form = $("deepCalcForm");
  const result = $("deepCalcResult");
  if (!Engine || !form || !result) return;

  const sections = [
    { title: "1. ตัวตนที่คนอื่นมองเห็น", key: "outer" },
    { title: "2. ตัวตนที่อยู่ข้างใน", key: "inner" },
    { title: "3. แรงขับเคลื่อนที่ซ่อนอยู่", key: "drive" },
    { title: "4. ความกลัวและจุดเปราะบาง", key: "fear" },
    { title: "5. เงาที่อาจไม่อยากยอมรับ", key: "shadow" },
    { title: "6. ความขัดแย้งภายใน", key: "conflict" },
    { title: "7. รูปแบบความรักและความผูกพัน", key: "love" },
    { title: "8. ศักยภาพที่ยังใช้ไม่เต็มที่", key: "gift" },
    { title: "9. จุดที่ลึกที่สุดภายในจิตใจ", key: "deepest" },
    { title: "10. บทเรียนที่ต้องเผชิญ", key: "lesson" }
  ];

  function paragraph(parent, text) {
    if (!text) return;
    const p = document.createElement("p");
    p.textContent = String(text);
    parent.append(p);
  }
  function field(parent, label, value) {
    if (!value) return;
    const wrap = document.createElement("div");
    wrap.className = "insight-field";
    const strong = document.createElement("strong");
    strong.textContent = label;
    const p = document.createElement("p");
    p.textContent = String(value);
    wrap.append(strong, p);
    parent.append(wrap);
  }
  function card(parent, title, content, featured) {
    const article = document.createElement("article");
    article.className = "insight-card" + (featured ? " deepest-card" : "");
    const h = document.createElement("h3");
    h.textContent = title;
    article.append(h);
    if (Array.isArray(content)) content.forEach(item => field(article, item[0], item[1]));
    else paragraph(article, content);
    parent.append(article);
  }
  function validate(v) {
    if (!v.fName.trim() || !v.fLast.trim()) return "กรุณากรอกชื่อและนามสกุล";
    const d = new Date(v.bYear, v.bMonth - 1, v.bDay);
    if (!Number.isInteger(v.bDay) || !Number.isInteger(v.bMonth) || !Number.isInteger(v.bYear) ||
        d.getFullYear() !== v.bYear || d.getMonth() !== v.bMonth - 1 || d.getDate() !== v.bDay) {
      return "กรุณาตรวจสอบวันเดือนปีเกิดให้ถูกต้อง";
    }
    if (!v.noBirthTime && ($("deepBirthHour").value.trim() === "" || $("deepBirthMinute").value.trim() === "" ||
        !Number.isInteger(v.bHour) || v.bHour < 0 || v.bHour > 23 ||
        !Number.isInteger(v.bMin) || v.bMin < 0 || v.bMin > 59)) {
      return "กรุณากรอกเวลาเกิดให้ถูกต้อง หรือเลือกไม่ทราบเวลาเกิด";
    }
    return "";
  }
  function readValues() {
    const noBirthTime = $("deepNoBirthTime").checked;
    return {
      fName: $("deepFirstName").value.trim(),
      fLast: $("deepLastName").value.trim(),
      bDay: Number($("deepBirthDay").value),
      bMonth: Number($("deepBirthMonth").value),
      bYear: Number($("deepBirthYear").value),
      bHour: noBirthTime ? 0 : Number($("deepBirthHour").value),
      bMin: noBirthTime ? 0 : Number($("deepBirthMinute").value),
      noBirthTime
    };
  }
  $("deepNoBirthTime").addEventListener("change", e => {
    ["deepBirthHour", "deepBirthMinute"].forEach(id => {
      $(id).disabled = e.target.checked;
      $(id).required = !e.target.checked;
      if (e.target.checked) $(id).value = "";
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const values = readValues();
    const error = validate(values);
    result.replaceChildren();
    if (error) {
      const p = document.createElement("p");
      p.className = "message";
      p.textContent = error;
      result.append(p);
      result.hidden = false;
      return;
    }
    try {
      // เรียกสูตรเดิมโดยตรง ไม่มีการคำนวณซ้ำหรือแก้ไขค่าที่ Engine ส่งกลับ
      const base = Engine.calcPerson(Object.assign({}, values, { feature: "base" }));
      const asc = values.noBirthTime ? null : Engine.calcPerson(Object.assign({}, values, { feature: "asc" }));
      const habit = Engine.RHD.CALCULATOR.calculateHabitNumber({
        nameNumber: base.N, bDay: values.bDay, bMonth: values.bMonth, bYear: values.bYear,
        bHour: values.bHour, bMin: values.bMin, noBirthTime: values.noBirthTime
      });
      const rhd = Engine.RHD.getCombined(base.baseCode, habit.number);
      const baseDeep = base.baseDeep || {};
      const ascInner = asc ? (Engine.ASC_INNER && Engine.ASC_INNER[asc.ascInner]) : null;
      const ascDeep = asc ? (Engine.ASC_DEEP && Engine.ASC_DEEP[asc.ascNum]) : null;
      const ascFace = asc ? (Engine.ASC_FACE && Engine.ASC_FACE[asc.ascFace]) : null;

      const resultTitle = document.createElement("header");
      resultTitle.className = "insight-summary";
      const h2 = document.createElement("h2");
      h2.textContent = "แผนที่ตัวตนและจิตใต้สำนึก";
      const summary = document.createElement("p");
      summary.textContent = "รหัสพื้นดวง " + base.baseCode + " · " + (base.baseRabbit && base.baseRabbit.name || "กระต่าย") +
        " · ธาตุ" + (base.baseElement && base.baseElement.name || "-") +
        (asc ? " · รหัสจิตสำนึก " + asc.ascInner : " · ไม่คำนวณลัคนาเพราะไม่ทราบเวลาเกิด");
      resultTitle.append(h2, summary);
      result.append(resultTitle);

      const grid = document.createElement("div");
      grid.className = "insight-grid";
      card(grid, sections[0].title, ascFace ? [
        ["ภาพแรกที่คนอื่นรับรู้", ascFace.impression],
        ["สิ่งที่ดึงดูดคนรอบตัว", ascFace.magnet],
        ["สิ่งที่คนอื่นอาจเข้าใจผิด", ascFace.misread],
        ["บทบาทในกลุ่ม", ascFace.role]
      ] : [["ตัวตนภายนอก", baseDeep.social || baseDeep.core]]);
      card(grid, sections[1].title, [
        ["แก่นพื้นดวง", baseDeep.core],
        ["ตัวตนที่แท้จริง", baseDeep.self],
        ["ภาพรวมบุคลิก", base.baseRabbit && base.baseRabbit.desc]
      ]);
      card(grid, sections[2].title, ascInner ? [
        ["แรงขับภายใน", ascInner.drive],
        ["เสียงกระซิบในใจ", ascInner.whisper],
        ["จังหวะที่แรงขับนี้มักปรากฏ", ascInner.when]
      ] : [
        ["แรงขับจากพื้นดวง", baseDeep.gift],
        ["สิ่งที่ทำให้รู้สึกมีความหมาย", baseDeep.lesson]
      ]);
      card(grid, sections[3].title, ascInner ? [
        ["ความกลัวที่อาจซ่อนอยู่", ascInner.fear],
        ["สิ่งที่ใจต้องการเพื่อรู้สึกปลอดภัย", ascInner.need]
      ] : [["จุดเปราะบางที่ควรสำรวจ", baseDeep.blind]]);
      card(grid, sections[4].title, [
        ["เงาของจิตสำนึก", ascDeep && ascDeep.shadow],
        ["จุดบอดจากพื้นดวง", baseDeep.blind],
        ["ด้านที่ควรระวัง", base.baseElement && base.baseElement.bad]
      ]);
      card(grid, sections[5].title, [
        ["สิ่งที่คุณอาจต้องการ", ascInner && ascInner.need],
        ["สิ่งที่พื้นดวงผลักดัน", baseDeep.self],
        ["จุดที่ควรสังเกต", "ลองเปรียบเทียบว่าความต้องการภายในกับบทบาทที่คุณรับไว้สอดคล้องกันหรือไม่ โดยใช้ประสบการณ์จริงของตัวเองเป็นตัวตรวจสอบ"]
      ]);
      card(grid, sections[6].title, [
        ["รูปแบบความผูกพัน", baseDeep.love],
        ["สิ่งที่คนอื่นอาจรับรู้", ascFace && ascFace.impression],
        ["ข้อควรสังเกต", ascFace && ascFace.misread]
      ]);
      card(grid, sections[7].title, [
        ["พรสวรรค์พื้นฐาน", baseDeep.gift],
        ["จุดแข็งของจิตสำนึก", ascDeep && ascDeep.strength],
        ["วิธีต่อยอด", "เลือกใช้จุดแข็งนี้กับเป้าหมายหนึ่งเรื่องอย่างต่อเนื่อง แทนการพยายามใช้ทุกความสามารถพร้อมกัน"]
      ]);
      card(grid, sections[8].title, [
        ["แรงปรารถนาที่อยู่ลึกที่สุด", ascInner ? ascInner.drive : baseDeep.core],
        ["ประโยคที่สะท้อนเสียงภายใน", ascInner ? ascInner.whisper : "ไม่สามารถคำนวณเสียงกระซิบจากชั้นจิตสำนึกได้เมื่อไม่ทราบเวลาเกิด"],
        ["ความกลัวที่อาจอยู่ใต้แรงปรารถนา", ascInner ? ascInner.fear : baseDeep.blind],
        ["ความต้องการที่อาจไม่ค่อยกล้าขอ", ascInner ? ascInner.need : baseDeep.lesson],
        ["ข้อจำกัดของการคำนวณ", values.noBirthTime ? "ไม่ทราบเวลาเกิด ระบบจึงไม่สร้างค่าจิตสำนึกหรือลัคนาทดแทนด้วยเวลาอื่น ตามหลักการของสูตรเดิม" : "ชั้นจิตสำนึกนี้คำนวณจากเวลาเกิดตามสูตรเดิม"],
        ["จุดบอดที่อาจขวางตัวเอง", baseDeep.blind],
        ["คำถามที่ควรถามตัวเอง", (baseDeep.questions || [])[0] || "สิ่งที่ฉันพยายามพิสูจน์อยู่จริง ๆ คืออะไร และฉันกำลังพิสูจน์ให้ใครเห็น?"]
      ], true);
      card(grid, sections[9].title, [
        ["บทเรียนหลัก", baseDeep.lesson],
        ["จุดเปลี่ยน", baseDeep.turn],
        ["แนวทางฝึกฝน", (baseDeep.questions || []).slice(0, 3).join(" · ")]
      ]);
      result.append(grid);

      const rhdCard = document.createElement("article");
      rhdCard.className = "insight-card rhd-insight";
      const rhdTitle = document.createElement("h3");
      rhdTitle.textContent = "รูปแบบการรับมือ · RHD";
      rhdCard.append(rhdTitle);
      const rabbitInfo = rhd.rabbit || {};
      const habitInfo = rhd.habit || {};
      field(rhdCard, "รหัส Rabbit + Habit", rhd.label);
      field(rhdCard, "สถานการณ์หรือแรงกระทบที่กำลังเผชิญ", rabbitInfo.desc || rabbitInfo.short);
      field(rhdCard, "รูปแบบที่มักใช้รับมือ", habitInfo.description);
      field(rhdCard, "พฤติกรรมที่มักแสดงออก", habitInfo.response);
      field(rhdCard, "วิธีตัดสินใจเมื่อเจอสถานการณ์", habitInfo.decision || rhd.decision);
      field(rhdCard, "จุดแข็งของวิธีรับมือ", habitInfo.strength || habitInfo.gift || "จุดแข็งจะเห็นชัดเมื่อคุณใช้รูปแบบนี้อย่างยืดหยุ่นและเหมาะกับสถานการณ์");
      field(rhdCard, "เงาหรือข้อจำกัดที่ควรระวัง", habitInfo.caution || rhd.caution);
      field(rhdCard, "สิ่งที่จิตใต้สำนึกกำลังสะท้อน", rhd.description);
      field(rhdCard, "สิ่งที่ใจอยากให้เข้าใจ", rhd.mind);
      field(rhdCard, "จังหวะที่เหมาะกับการลงมือ", rhd.timing);
      field(rhdCard, "ภาพรวมของการรับมือในช่วงนี้", rhd.overall);
      field(rhdCard, "คำถามเพื่อสำรวจตัวเอง", (Engine.RHD_SELF_QUESTIONS && Engine.RHD_SELF_QUESTIONS[habitInfo.number] || [])[0] || "ตอนนี้ฉันกำลังตอบสนองต่อสิ่งที่เกิดขึ้น หรือกำลังตอบสนองต่อประสบการณ์เก่าของตัวเอง?");
      result.append(rhdCard);

      const note = document.createElement("p");
      note.className = "insight-disclaimer";
      note.textContent = "การตีความนี้อ้างอิงชุดคำทำนายและสูตรเดิมของ Rabbitastro ใช้เพื่อสำรวจตัวเอง ไม่ใช่ข้อสรุปตายตัวหรือการวินิจฉัยทางจิตวิทยา";
      result.append(note);
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      const p = document.createElement("p");
      p.className = "message";
      p.textContent = "คำนวณไม่สำเร็จ: " + (err && err.message ? err.message : "เกิดข้อผิดพลาด");
      result.append(p);
      result.hidden = false;
    }
  });
})();