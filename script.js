/* ===========================
   MUFQI ANDIKA PANGESTU
   Portfolio Script
=========================== */

// ---- LOADER ----
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.style.display = 'none', 700);
        }
        triggerHeroAnimations();
    }, 1900);
});

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor interactions
document.querySelectorAll('a, button, .filter-btn, .contact-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
        follower.style.borderColor = 'rgba(0,212,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.borderColor = 'rgba(0,212,255,0.5)';
    });
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    toggleBackToTop();
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 80;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ---- BACK TO TOP ----
const btt = document.getElementById('backToTop');
function toggleBackToTop() {
    if (window.scrollY > 400) btt.classList.add('visible');
    else btt.classList.remove('visible');
}
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- HERO ANIMATIONS ----
function triggerHeroAnimations() {
    document.querySelectorAll('.fade-in-hero').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.15}s`;
        el.style.opacity = '1';
    });
}

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

function checkReveal() {
    revealEls.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            const delay = el.dataset.delay || (idx % 5) * 0.1;
            el.style.transitionDelay = `${delay}s`;
            el.classList.add('visible');
            checkSkillBars(el);
        }
    });
}

function checkSkillBars(visibleEl) {
    // Animate skill bars when their parent becomes visible
    visibleEl.querySelectorAll('.sb-fill').forEach(bar => {
        const targetWidth = bar.dataset.width || '70';
        bar.style.width = targetWidth + '%';
    });
}

// Also check skill bars when any section becomes visible
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.sb-fill').forEach(bar => {
                setTimeout(() => {
                    bar.style.width = (bar.dataset.width || '70') + '%';
                }, 300);
            });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-domain').forEach(domain => skillBarObserver.observe(domain));

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', () => setTimeout(checkReveal, 100));
checkReveal();

// ---- PROJECT SLIDERS ----
document.querySelectorAll('.project-slider-wrap').forEach(wrap => {
    const slides = wrap.querySelectorAll('.slide');
    const dotsContainer = wrap.querySelector('.slide-dots');
    const prevBtn = wrap.querySelector('.slide-prev');
    const nextBtn = wrap.querySelector('.slide-next');

    if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    let current = 0;
    let autoTimer = null;

    // Build dots
    if (dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });
    }

    function goTo(idx) {
        slides[current].classList.remove('active');
        if (dotsContainer) dotsContainer.querySelectorAll('.slide-dot')[current]?.classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (dotsContainer) dotsContainer.querySelectorAll('.slide-dot')[current]?.classList.add('active');
    }

    function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1), 3500);
    }
    function stopAuto() {
        clearInterval(autoTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);

    // Touch support
    let touchStartX = 0;
    wrap.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            stopAuto();
            goTo(diff > 0 ? current + 1 : current - 1);
            startAuto();
        }
    });

    startAuto();
});

// ---- PROJECT FILTERS ----
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.4s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ---- STAGGERED CARD ANIMATIONS ----
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.text-block, .soft-skill-card, .tl-item, .contact-card');
            children.forEach((child, i) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'none';
                }, i * 100);
            });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.about-text-blocks, .soft-skills-grid, .timeline, .contact-methods').forEach(el => {
    el.querySelectorAll('.text-block, .soft-skill-card, .tl-item, .contact-card').forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    staggerObserver.observe(el);
});

// ---- CHART BAR ANIMATION ON SCROLL ----
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.cbd-bar div').forEach((bar, i) => {
                const w = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1s cubic-bezier(0.4,0,0.2,1)';
                    bar.style.width = w;
                }, i * 100 + 200);
            });
            chartObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.data-chart-demo').forEach(chart => chartObserver.observe(chart));

// ---- CURSOR HIDE WHEN LEAVING WINDOW ----
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
});

// ---- INIT CONSOLE MESSAGE ----
console.log('%c Mufqi Andika Pangestu — Portfolio ', 'background:#00d4ff;color:#050a0e;padding:6px 12px;font-weight:bold;border-radius:4px;');
console.log('%c Mobile & Web Developer · Data Analyst · Digital Manager ', 'color:#7b2fff;');
