/* ════════════════════════════════
   MUFQI ANDIKA PANGESTU — PORTFOLIO
   script.js
════════════════════════════════ */

// ── THEME ──────────────────────────────────────────
const R = document.documentElement;
const saved = localStorage.getItem('theme') || 'light';
R.setAttribute('data-theme', saved);

document.getElementById('themeBtn').addEventListener('click', () => {
  const t = R.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  R.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

// ── BURGER MENU ────────────────────────────────────
const burg = document.getElementById('burg');
const nls = document.getElementById('nls');
burg.addEventListener('click', () => nls.classList.toggle('open'));
document.querySelectorAll('.nl').forEach(l =>
  l.addEventListener('click', () => nls.classList.remove('open'))
);

// ── SCROLL: Navbar shadow + active link + back-to-top ──
const navEl = document.getElementById('nav');
const bttEl = document.getElementById('btt');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navEl.classList.toggle('sx', y > 40);
  bttEl.classList.toggle('show', y > 400);
  sections.forEach(s => {
    if (y >= s.offsetTop - 120 && y < s.offsetTop + s.offsetHeight - 120) {
      document.querySelectorAll('.nl').forEach(l => l.classList.remove('on'));
      const a = document.querySelector('.nl[href="#' + s.id + '"]');
      if (a) a.classList.add('on');
    }
  });
});

bttEl.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── TYPED ROLES ────────────────────────────────────
const roles = [
  'Fullstack Developer',
  'Mobile App Engineer',
  'Data & Business Analyst',
  'UI/UX Designer',
  'Management Trainee Candidate',
  'Digital Strategist'
];
const typedEl = document.getElementById('typed');
let ri = 0, ci = 0, deleting = false;

function type() {
  const cur = roles[ri];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 45 : 80);
}
setTimeout(type, 300);

// ── COUNT UP (Hero Stats) ──────────────────────────
let counted = false;
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    function countUp(id, target, isFloat) {
      const el = document.getElementById(id);
      if (!el) return;
      const suffix = el.textContent.includes('+') ? '+' : '';
      let start = 0;
      const step = target / (1600 / 16);
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = (isFloat ? start.toFixed(2) : Math.floor(start)) + suffix;
        if (start >= target) clearInterval(timer);
      }, 16);
    }
    countUp('c1', 3.66, true);
    countUp('c2', 8, false);
    countUp('c3', 15, false);
    countUp('c4', 2, false);
  }
}, { threshold: 0.3 });

const statsEl = document.querySelector('.hstats');
if (statsEl) statsObs.observe(statsEl);

// ── COMPETENCY BARS ────────────────────────────────
const compVals = [86, 83, 84, 81, 82, 72, 73, 73, 45];
let barsAnimated = false;

function animateBars() {
  if (barsAnimated) return;
  barsAnimated = true;
  compVals.forEach((val, i) => {
    const el = document.getElementById('cbf' + (i + 1));
    if (el) setTimeout(() => { el.style.width = val + '%'; }, i * 80);
  });
}

const compObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) animateBars();
}, { threshold: 0.2 });

const compEl = document.querySelector('.comp');
if (compEl) compObs.observe(compEl);

// ── SKILL TABS ─────────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('on'));
    document.querySelectorAll('.tp').forEach(p => p.classList.remove('on'));
    btn.classList.add('on');
    const pane = document.getElementById('tp-' + btn.dataset.t);
    if (pane) pane.classList.add('on');
    // Trigger bars if comp section is visible
    const c = document.querySelector('.comp');
    if (c && c.getBoundingClientRect().top < window.innerHeight) animateBars();
  });
});

// ── PROJECT FILTER ─────────────────────────────────
document.querySelectorAll('.pfb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pfb').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const filter = btn.dataset.f;
    document.querySelectorAll('.pj').forEach(card => {
      card.classList.toggle('hide', filter !== 'all' && card.dataset.c !== filter);
    });
  });
});

// ── PROJECT IMAGE SLIDERS ──────────────────────────
document.querySelectorAll('.pj').forEach(card => {
  const slides = card.querySelectorAll('.sl');
  const dotsWrap = card.querySelector('.pds');
  const prevBtn = card.querySelector('.pp');
  const nextBtn = card.querySelector('.pnx');

  if (slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  let cur = 0;
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'pd' + (i === 0 ? ' on' : '');
    if (dotsWrap) dotsWrap.appendChild(d);
  });
  const dots = card.querySelectorAll('.pd');

  function goTo(n) {
    slides[cur].classList.remove('on');
    if (dots[cur]) dots[cur].classList.remove('on');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('on');
    if (dots[cur]) dots[cur].classList.add('on');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(cur - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(cur + 1));
  setInterval(() => goTo(cur + 1), 4500);
});

// ── SMOOTH SCROLL ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
