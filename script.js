/**
 * script.js — Mufqi Andika Pangestu Portfolio
 * ─────────────────────────────────────────────
 *  1.  Theme Switcher (3 modes: earthy / denim / aurora)
 *  2.  Mobile Navigation + burger toggle + outside-click close
 *  3.  Typewriter hero tagline (4 rotating lines)
 *  4.  Scroll Reveal — IntersectionObserver
 *  5.  Progress Bar Animations — IntersectionObserver
 *  6.  Project Filter (all / mobile / web / uiux)
 *  7.  Project Image Sliders (auto-advance + manual + dots + touch swipe)
 *  8.  Scrollspy — Active nav link highlight
 *  9.  Back-to-Top button
 * 10.  Navbar scroll shadow
 * 11.  Lazy loading for images
 */

(function () {
  'use strict';

  /* ============================================================
     HELPERS
  ============================================================ */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  /* ============================================================
     1. THEME SWITCHER — 3 Modes
  ============================================================ */
  (function initTheme () {
    var html     = document.documentElement;
    var allBtns  = $$('.ts-btn');    // desktop 3 buttons
    var mobBtns  = $$('.mts');       // mobile 3 buttons

    /** Apply a theme to the page and update all buttons */
    function applyTheme (name) {
      html.setAttribute('data-theme', name);

      // Update desktop buttons
      allBtns.forEach(function (b) {
        var isActive = b.dataset.t === name;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });

      // Update mobile buttons
      mobBtns.forEach(function (b) {
        b.classList.toggle('active', b.dataset.t === name);
      });

      // Save preference
      try { localStorage.setItem('map-theme', name); } catch (e) {}

      // Re-animate progress bars on theme change
      $$('.pb-fill, .db-f').forEach(function (el) {
        var w = el.dataset.w || 0;
        el.style.width = '0';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.width = w + '%';
          });
        });
      });
    }

    // Bind desktop buttons
    allBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.dataset.t);
      });
    });

    // Bind mobile buttons
    mobBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.dataset.t);
      });
    });

    // Load saved preference (or default to earthy)
    var saved = 'earthy';
    try { saved = localStorage.getItem('map-theme') || 'earthy'; } catch (e) {}
    applyTheme(saved);
  }());

  /* ============================================================
     2. MOBILE NAVIGATION
  ============================================================ */
  (function initMobileNav () {
    var burger = $('#burgerBtn');
    var mobNav = $('#mobNav');
    if (!burger || !mobNav) return;

    function openNav () {
      mobNav.classList.add('open');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      mobNav.setAttribute('aria-hidden', 'false');
    }
    function closeNav () {
      mobNav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobNav.setAttribute('aria-hidden', 'true');
    }

    burger.addEventListener('click', function () {
      mobNav.classList.contains('open') ? closeNav() : openNav();
    });

    // Close when a nav link is tapped
    $$('.mnl', mobNav).forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobNav.classList.contains('open') &&
        !mobNav.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        closeNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }());

  /* ============================================================
     3. TYPEWRITER HERO TAGLINE
  ============================================================ */
  (function initTypewriter () {
    var el = $('#typed');
    if (!el) return;

    var lines = [
      'S1 Sistem & Teknologi Informasi UHAMKA',
      'Mobile & Web Developer Full-Stack',
      'Data Analyst · Project Management',
      'UI/UX Designer · Capital Market Enthusiast',
    ];

    var lineIdx  = 0;
    var charIdx  = 0;
    var deleting = false;
    var timer    = null;

    var SPEED_TYPE = 70;
    var SPEED_DEL  = 36;
    var PAUSE_FULL = 2400;

    function tick () {
      var current = lines[lineIdx];

      if (!deleting) {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          timer = setTimeout(tick, PAUSE_FULL);
          return;
        }
        timer = setTimeout(tick, SPEED_TYPE);
      } else {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          lineIdx  = (lineIdx + 1) % lines.length;
        }
        timer = setTimeout(tick, SPEED_DEL);
      }
    }

    timer = setTimeout(tick, 900);

    // Pause when tab is hidden to save CPU
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(timer);
      } else {
        timer = setTimeout(tick, 400);
      }
    });
  }());

  /* ============================================================
     4. SCROLL REVEAL
  ============================================================ */
  (function initReveal () {
    var els = $$('.reveal');
    if (!els.length || !window.IntersectionObserver) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }());

  /* ============================================================
     5. PROGRESS BAR ANIMATIONS
     Handles both .pb-fill (skills) and .db-f (data section)
  ============================================================ */
  (function initProgressBars () {
    var fills = $$('.pb-fill, .db-f');
    if (!fills.length || !window.IntersectionObserver) {
      fills.forEach(function (el) {
        el.style.width = (el.dataset.w || 0) + '%';
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.width = (el.dataset.w || 0) + '%';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.35 });

    fills.forEach(function (el) {
      el.style.width = '0';
      io.observe(el);
    });
  }());

  /* ============================================================
     6. PROJECT FILTER
  ============================================================ */
  (function initFilter () {
    var btns  = $$('.pfbtn');
    var cards = $$('.pjcard');
    if (!btns.length || !cards.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.dataset.f;

        cards.forEach(function (card) {
          var show = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('hidden', !show);

          if (show) {
            // Brief re-trigger of reveal animation
            card.classList.remove('in');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { card.classList.add('in'); });
            });
          }
        });
      });
    });
  }());

  /* ============================================================
     7. PROJECT IMAGE SLIDERS
     Features: auto-advance · prev/next buttons · dot nav · touch swipe
  ============================================================ */
  (function initSliders () {
    $$('.pj-media').forEach(function (media) {
      var imgs    = $$('.pjimg',    media);
      var dotWrap = $('.pj-dotrow', media);
      var prevBtn = $('.pj-prev',   media);
      var nextBtn = $('.pj-next',   media);
      var slidesEl = $('.pj-slides', media);
      var autoplay = slidesEl && slidesEl.dataset.auto === '1';

      // Skip if only 1 image — remove nav controls
      if (imgs.length <= 1) {
        if (prevBtn) prevBtn.remove();
        if (nextBtn) nextBtn.remove();
        return;
      }

      var cur   = 0;
      var timer = null;

      // Build dot buttons
      imgs.forEach(function (_, i) {
        var dot      = document.createElement('button');
        dot.type     = 'button';
        dot.className = 'pjdot' + (i === 0 ? ' on' : '');
        dot.setAttribute('aria-label', 'Tampilkan foto ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); restartAuto(); });
        dotWrap.appendChild(dot);
      });

      /** Show a specific slide index (wraps around) */
      function goTo (idx) {
        imgs[cur].classList.remove('active');
        dotWrap.children[cur].classList.remove('on');
        cur = ((idx % imgs.length) + imgs.length) % imgs.length;
        imgs[cur].classList.add('active');
        dotWrap.children[cur].classList.add('on');
      }

      function startAuto () {
        if (!autoplay) return;
        timer = setInterval(function () { goTo(cur + 1); }, 3600);
      }

      function restartAuto () {
        clearInterval(timer);
        startAuto();
      }

      // Prev / Next buttons
      if (prevBtn) {
        prevBtn.addEventListener('click', function () { goTo(cur - 1); restartAuto(); });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () { goTo(cur + 1); restartAuto(); });
      }

      // Touch / swipe
      var touchX = 0;
      media.addEventListener('touchstart', function (e) {
        touchX = e.changedTouches[0].clientX;
      }, { passive: true });
      media.addEventListener('touchend', function (e) {
        var diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 42) {
          diff > 0 ? goTo(cur + 1) : goTo(cur - 1);
          restartAuto();
        }
      }, { passive: true });

      // Pause on hover, resume on leave
      media.addEventListener('mouseenter', function () { clearInterval(timer); });
      media.addEventListener('mouseleave', startAuto);

      // Keyboard navigation when focused inside media
      media.setAttribute('tabindex', '0');
      media.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { goTo(cur + 1); restartAuto(); }
        if (e.key === 'ArrowLeft')  { goTo(cur - 1); restartAuto(); }
      });

      startAuto();
    });
  }());

  /* ============================================================
     8. SCROLLSPY — Active nav link highlight
  ============================================================ */
  (function initScrollSpy () {
    var links    = $$('.nav-links a');
    if (!links.length) return;

    var sections = links
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    function update () {
      var scrollY = window.scrollY + 80;
      var curId   = '';
      sections.forEach(function (sec) {
        if (scrollY >= sec.offsetTop) curId = sec.id;
      });
      links.forEach(function (a) {
        var match = a.getAttribute('href') === '#' + curId;
        a.classList.toggle('active-link', match);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }());

  /* ============================================================
     9. BACK TO TOP
  ============================================================ */
  (function initBackTop () {
    var btn = $('#backTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 450);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }());

  /* ============================================================
    10. NAVBAR SCROLL SHADOW
  ============================================================ */
  (function initNavShadow () {
    var nav = $('#siteNav');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 12
        ? '0 3px 24px rgba(0,0,0,0.38)'
        : 'none';
    }, { passive: true });
  }());

  /* ============================================================
    11. LAZY LOADING — native fallback polyfill
  ============================================================ */
  (function initLazy () {
    // Modern browsers support loading="lazy" natively.
    // For older browsers, manually observe images.
    if ('loading' in HTMLImageElement.prototype) return;
    if (!window.IntersectionObserver) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
          io.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    $$('img[data-src]').forEach(function (img) { io.observe(img); });
  }());

}());
