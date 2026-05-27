/* ===== TRANSLATIONS ===== */
const i18n = {
  th: {
    sectionLabel:    'กรอกข้อมูลการวิ่ง',
    labelDistance:   'ระยะทาง',
    labelPace:       'เพซ',
    labelTime:       'เวลา',
    labelCalories:   'แคลอรี่',
    unitDistance:    'กม.',
    unitPace:        'นาที/กม.',
    unitTime:        'นาที',
    btnText:         'สร้างสถิติ',
    cardTag:         'วิ่ง',
    statPace:        'เพซ',
    statTime:        'เวลา',
    distanceUnit:    'กิโลเมตร',
    footerText:      'RUNSTAT',
  },
  en: {
    sectionLabel:    'Enter Your Run Data',
    labelDistance:   'Distance',
    labelPace:       'Pace',
    labelTime:       'Time',
    labelCalories:   'Calories',
    unitDistance:    'km',
    unitPace:        'min/km',
    unitTime:        'min',
    btnText:         'Generate Stats',
    cardTag:         'RUN',
    statPace:        'Pace',
    statTime:        'Time',
    distanceUnit:    'Kilometers',
    footerText:      'RUNSTAT',
  },
  kr: {
    sectionLabel:    '러닝 데이터 입력',
    labelDistance:   '거리',
    labelPace:       '페이스',
    labelTime:       '시간',
    labelCalories:   '칼로리',
    unitDistance:    'km',
    unitPace:        '분/km',
    unitTime:        '분',
    btnText:         '통계 생성',
    cardTag:         '러닝',
    statPace:        '페이스',
    statTime:        '시간',
    distanceUnit:    '킬로미터',
    footerText:      'RUNSTAT',
  }
};

/* ===== STATE ===== */
let currentLang = 'th';

/* ===== LANGUAGE SWITCH ===== */
function setLang(lang) {
  currentLang = lang;
  const t = i18n[lang];

  document.getElementById('label-input').textContent     = t.sectionLabel;
  document.getElementById('label-distance').textContent  = t.labelDistance;
  document.getElementById('label-pace').textContent      = t.labelPace;
  document.getElementById('label-time').textContent      = t.labelTime;
  document.getElementById('label-calories').textContent  = t.labelCalories;
  document.getElementById('unit-distance').textContent   = t.unitDistance;
  document.getElementById('unit-pace').textContent       = t.unitPace;
  document.getElementById('unit-time').textContent       = t.unitTime;
  document.getElementById('btn-text').textContent        = t.btnText;

  // Font class on body
  document.body.classList.remove('lang-th', 'lang-kr');
  if (lang === 'th') document.body.classList.add('lang-th');
  if (lang === 'kr') document.body.classList.add('lang-kr');

  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // If card is visible, refresh labels
  const rs = document.getElementById('resultSection');
  if (rs.classList.contains('visible')) {
    updateCardLabels(t);
  }
}

function updateCardLabels(t) {
  document.getElementById('card-tag').textContent         = t.cardTag;
  document.getElementById('stat-label-pace').textContent  = t.statPace;
  document.getElementById('stat-label-time').textContent  = t.statTime;
  document.getElementById('display-distance-unit').textContent = t.distanceUnit;
  document.getElementById('footer-text').textContent      = t.footerText;
}

/* ===== DATE FORMATTER ===== */
function getFormattedDate(lang) {
  const now = new Date();
  const opts = { day: '2-digit', month: 'short', year: 'numeric' };
  if (lang === 'th') {
    return now.toLocaleDateString('th-TH', opts);
  } else if (lang === 'kr') {
    return now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    return now.toLocaleDateString('en-US', opts).toUpperCase();
  }
}

/* ===== GENERATE ===== */
function generateCard() {
  const t = i18n[currentLang];

  const rawDist = document.getElementById('distance').value.trim();
  const rawPace = document.getElementById('pace').value.trim();
  const rawTime = document.getElementById('time').value.trim();
  const rawCal  = document.getElementById('calories').value.trim();

  // Distance
  const dist = rawDist !== '' ? parseFloat(rawDist).toFixed(2) : '—';

  // Pace — format as M'SS"
  let paceDisplay = '—';
  if (rawPace !== '') {
    if (rawPace.includes(':')) {
      const parts = rawPace.split(':');
      const m = parseInt(parts[0]) || 0;
      const s = parseInt(parts[1]) || 0;
      paceDisplay = `${m}'${String(s).padStart(2,'0')}"`;
    } else {
      paceDisplay = rawPace;
    }
  }

  // Time — format as MM:SS or H:MM:SS
  let timeDisplay = '—';
  if (rawTime !== '') {
    if (rawTime.includes(':')) {
      const parts = rawTime.split(':');
      if (parts.length === 2) {
        timeDisplay = `${parseInt(parts[0])}:${String(parseInt(parts[1])).padStart(2,'0')}`;
      } else if (parts.length === 3) {
        timeDisplay = `${parseInt(parts[0])}:${String(parseInt(parts[1])).padStart(2,'0')}:${String(parseInt(parts[2])).padStart(2,'0')}`;
      }
    } else {
      timeDisplay = rawTime;
    }
  }

  // Calories
  const calDisplay = rawCal !== '' ? parseInt(rawCal).toLocaleString() : '—';

  // Fill card
  document.getElementById('display-distance').textContent = dist;
  document.getElementById('display-pace').textContent     = paceDisplay;
  document.getElementById('display-time').textContent     = timeDisplay;
  document.getElementById('display-calories').textContent = calDisplay;
  document.getElementById('card-date').textContent        = getFormattedDate(currentLang);
  updateCardLabels(t);

  // Show and animate
  const rs   = document.getElementById('resultSection');
  const card = document.getElementById('statsCard');

  rs.classList.add('visible');

  card.classList.remove('animate');
  void card.offsetWidth; // reflow
  card.classList.add('animate');

  // Scroll to result
  setTimeout(() => {
    rs.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

/* ===== INPUT ENTER KEY ===== */
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') generateCard();
  });
});

/* ===== LANG BUTTONS ===== */
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

/* ===== INIT ===== */
setLang('th');
