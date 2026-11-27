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

  var selectedWeather = null;
  var resultsBox = document.getElementById('results');
  var weatherOptions = document.getElementById('emotionalWeatherOptions');
  var skipButton = document.getElementById('emotionalWeatherSkip');

  // Keep a small public state value for optional client-side inspection.
  window.rabbitastroEmotionalWeather = null;

  function clearPreviousPresentation() {
    if (!resultsBox) return;
    var oldIntro = resultsBox.querySelector('[data-emotional-weather-intro]');
    var oldGuide = resultsBox.querySelector('[data-emotional-weather-reading]');
    if (oldIntro) oldIntro.remove();
    if (oldGuide) oldGuide.remove();
    resultsBox.removeAttribute('data-emotional-weather-mode');
  }

  function setSelectedWeather(id) {
    selectedWeather = id && weatherData[id] ? { id: id, data: weatherData[id] } : null;
    window.rabbitastroEmotionalWeather = selectedWeather
      ? { id: selectedWeather.id, label: selectedWeather.data.label }
      : null;

    if (weatherOptions) {
      Array.prototype.forEach.call(weatherOptions.querySelectorAll('.emotional-weather-option'), function (button) {
        var active = !!selectedWeather && button.getAttribute('data-weather-id') === selectedWeather.id;
        button.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }
    if (skipButton) {
      skipButton.classList.toggle('is-selected', !selectedWeather);
      skipButton.setAttribute('aria-pressed', selectedWeather ? 'false' : 'true');
    }
    clearPreviousPresentation();
  }

  function initWeatherCheckin() {
    if (!weatherOptions || !skipButton) return;

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
        setSelectedWeather(id);
      });
      weatherOptions.appendChild(button);
    });

    skipButton.addEventListener('click', function () {
      setSelectedWeather(null);
    });
    setSelectedWeather(null);
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

  initWeatherCheckin();
  initResultsObserver();
})();
