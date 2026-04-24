/* ══════════════════════════════════════════════
   FONDATION AHR — Main JavaScript
══════════════════════════════════════════════ */

'use strict';

/* ── PAGE LOADER ── */
(function initLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-logo">AH<span>R</span></div>
    <div class="loader-bar"><div class="loader-progress"></div></div>
  `;
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1800);
  });
})();

/* ── NAVBAR SCROLL ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const handler = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
})();

/* ── MOBILE NAV TOGGLE ── */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close on nav link click
  menu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

/* ── ACTIVE NAV LINK ── */
(function initActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── REVEAL ON SCROLL ── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number, .impact-num');
  
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 2200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOut(progress) * target);

      if (target >= 10000) {
        el.textContent = current.toLocaleString('fr-FR');
      } else {
        el.textContent = current;
      }

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target >= 10000 ? target.toLocaleString('fr-FR') : target;
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── HERO PARTICLES ── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 20}%;
      --duration: ${Math.random() * 6 + 6}s;
      --delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
})();

/* ── TESTIMONIALS SLIDER ── */
(function initSlider() {
  const track  = document.getElementById('testimonialsTrack');
  const prev   = document.getElementById('prevBtn');
  const next   = document.getElementById('nextBtn');
  const dotsEl = document.getElementById('sliderDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoPlay;
  const getVisible = () => window.innerWidth < 768 ? 1 : 2;

  // Build dots
  const buildDots = () => {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const pages = Math.ceil(total / getVisible());
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  };

  const updateDots = (idx) => {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  };

  const goTo = (idx) => {
    const pages = Math.ceil(total / getVisible());
    current = (idx + pages) % pages;
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * getVisible() * cardWidth}px)`;
    updateDots(current);
  };

  if (prev) prev.addEventListener('click', () => { goTo(current - 1); restartAuto(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); restartAuto(); });

  const restartAuto = () => {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  };

  window.addEventListener('resize', () => { buildDots(); goTo(0); });
  buildDots();
  restartAuto();
})();

/* ── PROGRAM CARD GLOW ── */
(function initCardGlow() {
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
})();

/* ── DONATE AMOUNT BUTTONS ── */
(function initDonateAmounts() {
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

/* ── CONTACT FORM ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
      btn.style.background = 'linear-gradient(135deg, #2e7d32, #1b5e20)';
      btn.style.color = '#fff';
      showToast('✅ Votre message a été envoyé. Nous vous répondrons sous 48h.');
      form.reset();
      setTimeout(() => {
        btn.innerHTML = 'Envoyer le message <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 4000);
    }, 1800);
  });
})();

/* ── NEWSLETTER FORM ── */
(function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form, #newsletterForm');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Abonné !';
      showToast('📬 Merci ! Vous êtes désormais abonné à notre newsletter.');
      form.reset();
      setTimeout(() => btn.innerHTML = original, 3000);
    });
  });
})();

/* ── BACK TO TOP ── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── TOAST NOTIFICATION ── */
function showToast(message, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
