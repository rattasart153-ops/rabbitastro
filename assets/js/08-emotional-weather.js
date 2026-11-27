(function () {
  'use strict';

  // Emotional Weather Check-in: UI-only layer. It never reads or changes
  // calculation inputs, formulas, or the calculation result data.
  var weatherData = {
    clear_sky: {
      icon: '☀️',
      label: 'ฟ้าโปร่ง แดดอุ่น',
      description: 'ใจโล่ง สบายๆ พร้อมเปิดรับมุมมองใหม่',
      introMessage: 'ในวันที่ใจคุณเปิดกว้างแบบนี้ ตัวเลขของโหรกระต่ายจะช่วยสะท้อนทิศทางที่คุณสามารถต่อยอดได้อย่างเต็มที่',
      readingTitle: 'อ่านคำทำนายในวันที่ใจเปิดรับโอกาส',
      readingLead: 'ใช้คำทำนายเป็นกระจกสะท้อนสิ่งที่กำลังเติบโตในตัวคุณ แล้วมองหาจุดที่สามารถต่อยอดได้จริง',
      focus: 'จุดแข็ง โอกาส และทางเลือกที่ช่วยให้คุณก้าวต่อ',
      nextStep: 'เลือกหนึ่งเรื่องที่อยากพัฒนา แล้วกำหนดก้าวเล็ก ๆ ที่เริ่มทำได้ในวันนี้',
      gentleNote: 'เปิดรับโอกาสได้เต็มที่ โดยไม่จำเป็นต้องตอบตกลงกับทุกอย่าง'
    },
    light_rain: {
      icon: '🌧️',
      label: 'ฝนตกปรอยๆ',
      description: 'รู้สึกหน่วงๆ เหนื่อยล้า อยากพักใจเงียบๆ',
      introMessage: 'ไม่เป็นไรเลยถ้าวันนี้ใจจะรู้สึกหนักไปบ้าง ลองอ่านความหมายของตัวเลขนี้เหมือนเป็นเพื่อนที่นั่งอยู่ข้างๆ โดยไม่ต้องรีบตัดสินตัวเอง',
      readingTitle: 'อ่านคำทำนายในวันที่ใจต้องการพัก',
      readingLead: 'ค่อย ๆ อ่านทีละส่วน เหมือนมีใครสักคนนั่งฟังอยู่ข้าง ๆ ไม่ต้องรีบหาคำตอบหรือบังคับตัวเองให้รู้สึกดี',
      focus: 'สิ่งที่กำลังใช้พลังใจ ขอบเขตที่ต้องการ และสิ่งที่พอจะวางลงได้',
      nextStep: 'เลือกดูแลเรื่องจำเป็นที่สุดเพียงหนึ่งเรื่อง ส่วนเรื่องอื่นอนุญาตให้ตัวเองพักไว้ก่อนได้',
      gentleNote: 'ความเหนื่อยไม่ใช่ความผิด และคุณไม่จำเป็นต้องพิสูจน์คุณค่าด้วยการฝืนตลอดเวลา'
    },
    stormy: {
      icon: '⛈️',
      label: 'พายุเข้า คลื่นลมแรง',
      description: 'สับสน กดดัน ใจว้าวุ่นจนจับต้นชนปลายไม่ถูก',
      introMessage: 'เวลาพายุเข้า เราไม่จำเป็นต้องเห็นทางออกทั้งหมดในวันนี้ ลองโฟกัสแค่จุดเล็กๆ เพียงจุดเดียวที่ตัวเลขกำลังชี้ให้เห็นก่อน',
      readingTitle: 'อ่านคำทำนายในวันที่ใจมีคลื่นลม',
      readingLead: 'ไม่ต้องพยายามแก้ทุกเรื่องพร้อมกัน แยกคำทำนายออกเป็นประเด็นเล็ก ๆ แล้วค่อยพิจารณาทีละข้อ',
      focus: 'ข้อเท็จจริง สิ่งที่ควบคุมได้ และเรื่องที่ยังไม่จำเป็นต้องตัดสินใจตอนนี้',
      nextStep: 'หยุดพักก่อนการตัดสินใจเรื่องใหญ่ แล้วเลือกจัดการสิ่งที่อยู่ตรงหน้าได้หนึ่งอย่าง',
      gentleNote: 'คำทำนายไม่ใช่คำสั่งให้รีบลงมือ และไม่ควรใช้แทนข้อมูลจริงเมื่อมีเรื่องสำคัญต้องตัดสินใจ'
    },
    foggy: {
      icon: '🌫️',
      label: 'หมอกลงจัด',
      description: 'ว่างเปล่า มึนงง มองไม่เห็นทิศทางข้างหน้า',
      introMessage: 'ในวันที่หมอกลงจัด การเดินช้าๆ ทีละก้าวคือเรื่องปกติมาก ตัวเลขนี้จะช่วยเป็นตะเกียงดวงเล็กๆ ให้คุณเห็นพื้นที่ตรงหน้าชัดขึ้น',
      readingTitle: 'อ่านคำทำนายในวันที่ยังมองทางไม่ชัด',
      readingLead: 'เริ่มจากข้อความที่เข้าใจง่ายหรือรู้สึกเชื่อมโยงที่สุด ไม่จำเป็นต้องตีความทุกอย่างให้ได้ในครั้งเดียว',
      focus: 'สิ่งที่ชัดเจนอยู่แล้ว สิ่งที่ยังเป็นคำถาม และก้าวถัดไปที่พอมองเห็น',
      nextStep: 'เขียนสิ่งที่คุณรู้แน่หนึ่งข้อ แล้วเลือกก้าวเล็ก ๆ ที่ทำได้โดยไม่ต้องรู้คำตอบทั้งหมด',
      gentleNote: 'การยังไม่รู้ว่าจะไปทางไหน ไม่ได้แปลว่าคุณกำลังล้มเหลว คุณค่อย ๆ มองหาเส้นทางได้'
    }
  };

  var calculationButtonSelector = '#btnCalc, #btnCalcGod, #btnCalcOreguram, #btnCalcTarotRune';
  var bypassButtons = new WeakSet();
  var selectedWeather = null;
  var modal = null;
  var resultsBox = document.getElementById('results');

  // Keep a small public state value for optional client-side inspection.
  window.rabbitastroEmotionalWeather = null;

  function createModal() {
    if (modal) return modal;

    modal = document.createElement('section');
    modal.className = 'emotional-weather-overlay';
    modal.id = 'emotionalWeatherCheckin';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'emotionalWeatherTitle');
    modal.hidden = true;

    var panel = document.createElement('div');
    panel.className = 'emotional-weather-panel';

    var eyebrow = document.createElement('div');
    eyebrow.className = 'emotional-weather-eyebrow';
    eyebrow.textContent = 'EMOTIONAL WEATHER CHECK-IN';

    var title = document.createElement('h2');
    title.id = 'emotionalWeatherTitle';
    title.textContent = 'เช็กบรรยากาศในใจ';

    var prompt = document.createElement('p');
    prompt.className = 'emotional-weather-prompt';
    prompt.textContent = 'ก่อนจะเปิดดูความหมายของตัวเลข... ลองสูดหายใจเข้าลึกๆ 1 ครั้ง แล้วเลือกบรรยากาศที่ตรงกับใจคุณตอนนี้ที่สุด';

    var options = document.createElement('div');
    options.className = 'emotional-weather-options';
    options.setAttribute('aria-label', 'เลือกบรรยากาศในใจ');

    Object.keys(weatherData).forEach(function (id) {
      var item = weatherData[id];
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'emotional-weather-option';
      button.setAttribute('data-weather-id', id);
      button.setAttribute('aria-pressed', 'false');

      var icon = document.createElement('span');
      icon.className = 'emotional-weather-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = item.icon;

      var copy = document.createElement('span');
      copy.className = 'emotional-weather-copy';

      var label = document.createElement('strong');
      label.textContent = item.label;

      var description = document.createElement('small');
      description.textContent = item.description;

      copy.appendChild(label);
      copy.appendChild(description);
      button.appendChild(icon);
      button.appendChild(copy);
      button.addEventListener('click', function () {
        selectedWeather = { id: id, data: item };
        window.rabbitastroEmotionalWeather = { id: id, label: item.label };
        closeModal();
        continueCalculation();
      });
      options.appendChild(button);
    });

    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'emotional-weather-skip';
    skip.textContent = 'ข้ามขั้นตอนนี้เพื่อดูผลลัพธ์เลย';
    skip.addEventListener('click', function () {
      selectedWeather = null;
      window.rabbitastroEmotionalWeather = null;
      closeModal();
      continueCalculation();
    });

    panel.appendChild(eyebrow);
    panel.appendChild(title);
    panel.appendChild(prompt);
    panel.appendChild(options);
    panel.appendChild(skip);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        // The check-in is intentional in the flow; tapping outside does not
        // silently skip it. The explicit skip control remains available.
        var first = modal.querySelector('.emotional-weather-option');
        if (first) first.focus();
      }
    });

    return modal;
  }

  function openModal(button) {
    createModal();
    modal.hidden = false;
    modal.classList.remove('is-closing');
    document.body.classList.add('emotional-weather-open');
    var firstOption = modal.querySelector('.emotional-weather-option');
    if (firstOption) firstOption.focus();
    modal.__pendingButton = button;
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('is-closing');
    modal.hidden = true;
    document.body.classList.remove('emotional-weather-open');
  }

  function continueCalculation() {
    if (!modal || !modal.__pendingButton) return;
    var button = modal.__pendingButton;
    modal.__pendingButton = null;
    bypassButtons.add(button);
    button.click();
  }

  function formIsComplete() {
    var requiredIds = ['fName', 'fLast', 'bDay', 'bMonth', 'bYear'];
    return requiredIds.every(function (id) {
      var field = document.getElementById(id);
      return !!(field && String(field.value || '').trim());
    });
  }

  function renderIntro() {
    if (!resultsBox || !selectedWeather || resultsBox.style.display === 'none') return;
    var existing = resultsBox.querySelector('[data-emotional-weather-intro]');
    if (existing && existing.getAttribute('data-emotional-weather-intro') === selectedWeather.id) return;
    if (existing) existing.remove();

    var intro = document.createElement('div');
    intro.className = 'emotional-weather-intro';
    intro.setAttribute('data-emotional-weather-intro', selectedWeather.id);

    var icon = document.createElement('span');
    icon.className = 'emotional-weather-intro-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = selectedWeather.data.icon;

    var message = document.createElement('p');
    message.textContent = selectedWeather.data.introMessage;

    intro.appendChild(icon);
    intro.appendChild(message);
    resultsBox.insertBefore(intro, resultsBox.firstChild);
  }

  function renderWeatherReadingGuide() {
    if (!resultsBox || !selectedWeather || resultsBox.style.display === 'none') return;

    var existing = resultsBox.querySelector('[data-emotional-weather-reading]');
    if (existing && existing.getAttribute('data-emotional-weather-reading') === selectedWeather.id) return;
    if (existing) existing.remove();

    var data = selectedWeather.data;
    var guide = document.createElement('section');
    guide.className = 'emotional-weather-reading';
    guide.setAttribute('data-emotional-weather-reading', selectedWeather.id);
    guide.setAttribute('aria-label', 'แนวทางอ่านคำทำนายตามบรรยากาศในใจ');

    var heading = document.createElement('h3');
    heading.textContent = data.readingTitle;

    var lead = document.createElement('p');
    lead.className = 'emotional-weather-reading-lead';
    lead.textContent = data.readingLead;

    var focus = document.createElement('div');
    focus.className = 'emotional-weather-reading-row';
    var focusLabel = document.createElement('strong');
    focusLabel.textContent = 'ลองโฟกัส';
    var focusText = document.createElement('span');
    focusText.textContent = data.focus;
    focus.appendChild(focusLabel);
    focus.appendChild(focusText);

    var next = document.createElement('div');
    next.className = 'emotional-weather-reading-row';
    var nextLabel = document.createElement('strong');
    nextLabel.textContent = 'ก้าวเล็ก ๆ ที่ทำได้';
    var nextText = document.createElement('span');
    nextText.textContent = data.nextStep;
    next.appendChild(nextLabel);
    next.appendChild(nextText);

    var note = document.createElement('p');
    note.className = 'emotional-weather-reading-note';
    note.textContent = data.gentleNote;

    guide.appendChild(heading);
    guide.appendChild(lead);
    guide.appendChild(focus);
    guide.appendChild(next);
    guide.appendChild(note);

    var intro = resultsBox.querySelector('[data-emotional-weather-intro]');
    if (intro && intro.parentNode === resultsBox) {
      intro.insertAdjacentElement('afterend', guide);
    } else {
      resultsBox.insertBefore(guide, resultsBox.firstChild);
    }
  }

  function applyEmotionalWeatherPresentation() {
    if (!selectedWeather || !resultsBox || resultsBox.style.display === 'none') return;
    renderIntro();
    renderWeatherReadingGuide();
    resultsBox.setAttribute('data-emotional-weather-mode', selectedWeather.id);
  }

  function initResultsObserver() {
    if (!resultsBox || !window.MutationObserver) return;
    var observer = new MutationObserver(function () {
      if (selectedWeather && resultsBox.style.display !== 'none') {
        applyEmotionalWeatherPresentation();
      } else if (!selectedWeather) {
        resultsBox.removeAttribute('data-emotional-weather-mode');
      }
    });
    observer.observe(resultsBox, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  }

  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest
      ? event.target.closest(calculationButtonSelector)
      : null;
    if (!button) return;

    if (bypassButtons.has(button)) {
      bypassButtons.delete(button);
      return;
    }

    if (!formIsComplete()) return;
    if (button.id === 'btnCalcOreguram') {
      var question = document.getElementById('oreguramQuestion');
      if (!question || !parseInt(question.value, 10)) return;
    }

    // Keep the existing validation and calculation handlers intact. This layer
    // only pauses the click, asks for an optional mood selection, then replays it.
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();

    selectedWeather = null;
    window.rabbitastroEmotionalWeather = null;
    if (resultsBox) {
      var oldIntro = resultsBox.querySelector('[data-emotional-weather-intro]');
      if (oldIntro) oldIntro.remove();
    }
    openModal(button);
  }, true);

  initResultsObserver();
})();
