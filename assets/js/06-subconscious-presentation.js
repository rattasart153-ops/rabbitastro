
/* ชั้นการนำเสนอคำทำนายเป็นบทสนทนากับจิตใต้สำนึก: ใช้กับทุก Engine ยกเว้น Engine 2 */
(function () {
  'use strict';
  function startSubconsciousPresentation() {
    var box = document.getElementById('results');
    if (!box || box.__subconsciousObserverInstalled) return;
    box.__subconsciousObserverInstalled = true;
    var lastSource = '';
    var processing = false;

    function isEngineTwo() {
      var title = box.querySelector('.card-title');
      return !!(title && /คำทำนายมูเทพ/.test(title.textContent || ''));
    }

    function isEngineOneNonRHD() {
      var title = box.querySelector('.card-title');
      if (!title) return false;
      var t = (title.textContent || '').trim();
      if (/RHD|Rabbit’s Habit Design|Rabbit's Habit Design/i.test(t)) return false;
      return /ผลการวิเคราะห์พื้นดวงตามโหรกระต่าย|ผลการวิเคราะห์ดวงชะตาบุคคล/.test(t);
    }

    function softenTextNodes(root) {
      var replacements = [
        [/เจ้าชะตา/g, 'คุณ'], [/ดวงชะตา/g, 'ภาพรวมชีวิต'], [/ชะตากรรม/g, 'เส้นทางชีวิต'],
        [/พึงระวัง/g, 'ลองใส่ใจเรื่องนี้เป็นพิเศษ'], [/พึงกระทำ/g, 'สิ่งที่ลองทำได้คือ'],
        [/มีเกณฑ์/g, 'มีแนวโน้ม'], [/เกื้อหนุน/g, 'ช่วยส่งเสริม'], [/บั่นทอน/g, 'ทำให้เหนื่อยใจ'],
        [/บริวาร/g, 'คนรอบตัว'], [/มิตรสหาย/g, 'เพื่อนและคนรอบตัว'], [/ศัตรูคู่แข่ง/g, 'คนที่เห็นต่างหรือคู่แข่ง'],
        [/ลาภผลเงินทอง/g, 'รายรับและโอกาสทางการเงิน'], [/อสังหาริมทรัพย์/g, 'บ้านหรือที่ดิน'],
        [/โดยพลัน/g, 'อย่างรวดเร็ว'], [/อันควร/g, 'ที่เหมาะกับคุณ'], [/จงระวัง/g, 'ลองสังเกตให้ดี'],
        [/ศักยภาพ/g, 'ความสามารถที่มี'], [/จงเชื่อมั่นในตนเอง/g, 'ค่อย ๆ เชื่อมั่นในตัวเองนะ'],
        [/อย่าท้อถอย/g, 'อย่าเพิ่งหมดกำลังใจนะ'], [/อดทนอดกลั้น/g, 'ให้เวลาตัวเองได้พักและตั้งหลัก'],
        [/ใช้สติปัญญาไตร่ตรอง/g, 'ค่อย ๆ คิดและดูข้อเท็จจริงให้รอบด้าน'],
        [/ความสำเร็จ/g, 'ความก้าวหน้า'], [/อุปสรรค/g, 'เรื่องที่ต้องค่อย ๆ รับมือ'],
        [/จังหวะชีวิต/g, 'ช่วงชีวิต'], [/พลังงาน/g, 'แรงใจและกำลัง']
      ];
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var nodes = [], node;
      while ((node = walker.nextNode())) nodes.push(node);
      nodes.forEach(function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return;
        var value = n.nodeValue;
        replacements.forEach(function (pair) { value = value.replace(pair[0], pair[1]); });
        if (value !== n.nodeValue) n.nodeValue = value;
      });
    }

    function reflectionFor(n) {
      var messages = {
        1: 'บางครั้งคุณอาจรู้สึกว่าต้องเข้มแข็งและจัดการทุกอย่างด้วยตัวเอง จนลืมถามว่าจริง ๆ แล้วตัวเองเหนื่อยแค่ไหน การขอความช่วยเหลือไม่ได้ทำให้คุณอ่อนแอ และคุณไม่จำเป็นต้องพิสูจน์คุณค่าของตัวเองตลอดเวลา',
        2: 'คุณอาจรับความรู้สึกของคนอื่นเก่ง จนเผลอเก็บความต้องการของตัวเองไว้ทีหลัง ลองถามตัวเองอย่างอ่อนโยนว่า สิ่งที่กำลังยอมอยู่เป็นเพราะคุณเต็มใจ หรือเพราะกลัวทำให้ใครผิดหวัง',
        3: 'เวลาที่ไม่แน่ใจ คุณอาจพยายามทำอะไรให้มากขึ้นเพื่อกลบความกังวล แต่บางครั้งการหยุดฟังใจตัวเองสักนิดอาจช่วยให้เห็นว่าอะไรสำคัญจริง ๆ คุณไม่จำเป็นต้องรีบไปให้ทันทุกคน',
        4: 'คุณอาจต้องการความแน่นอนมาก เพราะไม่อยากกลับไปเจ็บจากเรื่องเดิม การระวังตัวช่วยปกป้องคุณได้ แต่ถ้าระวังจนไม่กล้าขยับเลย ก็อาจทำให้พลาดสิ่งดี ๆ ที่ค่อย ๆ เข้ามา',
        5: 'คุณอาจคุ้นเคยกับการเป็นคนที่ทุกคนพึ่งพา จนรู้สึกผิดเวลาตัวเองต้องการพัก ลองจำไว้ว่าการหยุดพักไม่ใช่การถอยหลัง และคุณมีสิทธิ์ดูแลตัวเองโดยไม่ต้องรอให้ทุกอย่างเสร็จก่อน',
        6: 'ลึก ๆ คุณอาจรู้อยู่แล้วว่าบางอย่างไม่เหมือนเดิม แต่ยังลังเลเพราะเสียดายเวลา ความผูกพัน หรือสิ่งที่ลงทุนไป ลองแยกให้ออกว่าอะไรยังมีความหมายกับคุณ และอะไรที่คุณฝืนเก็บไว้เพราะไม่อยากยอมรับว่าถึงเวลาปรับเปลี่ยน',
        7: 'คุณอาจคิดทบทวนเรื่องเดิมซ้ำ ๆ เพราะอยากเข้าใจว่าตัวเองพลาดตรงไหน แต่อย่าลืมว่าการเรียนรู้ไม่จำเป็นต้องมาพร้อมการตำหนิตัวเอง คุณสามารถยอมรับสิ่งที่เกิดขึ้นและยังอ่อนโยนกับตัวเองได้',
        8: 'คุณอาจเก็บความรู้สึกไว้เงียบ ๆ เพราะไม่อยากเป็นภาระของใคร แต่การเงียบไม่ได้แปลว่าคุณต้องรับทุกอย่างคนเดียว ลองเริ่มจากบอกความรู้สึกจริง ๆ กับคนที่คุณไว้ใจสักคน',
        9: 'เมื่อเจอเรื่องที่หาทางออกยาก คุณอาจคิดว่าต้องแก้ทุกอย่างให้ได้ในครั้งเดียว ลองลดขนาดปัญหาให้เหลือเพียงก้าวถัดไปที่ทำได้ก่อน คุณไม่จำเป็นต้องเห็นทางทั้งหมด ถึงจะเริ่มเดินได้'
      };
      return messages[n] || 'ลองสังเกตความรู้สึกที่เกิดขึ้นระหว่างอ่านคำทำนาย บางครั้งสิ่งที่สะกิดใจเราอาจช่วยให้เห็นความต้องการที่ยังไม่ได้พูดออกมา';
    }

    function apply() {
      if (processing || !box || !box.innerHTML.trim()) return;
      var source = box.innerHTML;
      if (source === lastSource) return;
      lastSource = source;
      if (isEngineTwo()) return;
      processing = true;
      Array.prototype.forEach.call(box.querySelectorAll('.subconscious-prompt'), function (el) { el.remove(); });
      if (isEngineOneNonRHD()) {
        softenTextNodes(box);
        var fullText = box.textContent || '';
        var match = fullText.match(/รหัส(?:พื้นดวง|คำทำนายพื้นฐาน|คำทำนาย)\s*เลข\s*([1-9])/);
        var num = match ? parseInt(match[1], 10) : 0;
        if (num) {
          var panel = document.createElement('div');
          panel.className = 'subconscious-prompt pred-block';
          panel.style.cssText = 'margin-top:12px;background:#fffaf5;border:1px solid #f3d6c5;border-left:5px solid #c27855;border-radius:12px;padding:14px;color:#513b32;line-height:1.8;';
          var panelTitle = document.createElement('h4');
          panelTitle.style.cssText = 'margin:0 0 8px;color:#8b4a32;';
          panelTitle.textContent = '💗 ลองฟังอีกเสียงหนึ่งในใจของคุณ';
          var reflectionText = document.createElement('p');
          reflectionText.style.cssText = 'margin:0 0 8px;';
          reflectionText.textContent = reflectionFor(num);
          var panelNote = document.createElement('p');
          panelNote.style.cssText = 'margin:0;font-size:0.95em;';
          panelNote.textContent = 'ข้อความนี้ไม่ใช่คำตัดสินว่าคุณเป็นคนแบบไหน แค่ชวนสำรวจใจอย่างอ่อนโยน: ตอนนี้คุณต้องการอะไร และมีอะไรที่ทำให้ยังไม่กล้าบอกความต้องการนั้นกับตัวเองหรือคนอื่น?';
          panel.appendChild(panelTitle);
          panel.appendChild(reflectionText);
          panel.appendChild(panelNote);
          box.appendChild(panel);
        }
      }
      processing = false;
      lastSource = box.innerHTML;
    }

    // ตัดวงจร MutationObserver: หยุดสังเกตระหว่างที่ apply แก้ DOM ของตัวเอง
    var observer = new MutationObserver(function () {
      if (processing) return;
      observer.disconnect();
      try {
        apply();
      } catch (err) {
        console.warn("Subconscious presentation skipped:", err);
      } finally {
        observer.observe(box, { childList: true, subtree: true, characterData: true });
      }
    });
    observer.observe(box, { childList: true, subtree: true, characterData: true });
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startSubconsciousPresentation);
  else startSubconsciousPresentation();
})();
