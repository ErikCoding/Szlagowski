/* ============================================================
   script.js — Personal Trainer Landing Page
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   0. MOBILE VIEWPORT — lock accidental horizontal pan
   ────────────────────────────────────────────── */
(function lockHorizontalViewport() {
  let touchStartX = 0;
  let touchStartY = 0;

  function resetHorizontalScroll() {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  }

  window.addEventListener('scroll', resetHorizontalScroll, { passive: true });
  window.addEventListener('resize', resetHorizontalScroll);

  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    if (e.target.closest('#sliderTrack')) return;

    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    const isHorizontalSwipe = Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2;

    if (isHorizontalSwipe) {
      e.preventDefault();
      resetHorizontalScroll();
    }
  }, { passive: false });
})();

/* ──────────────────────────────────────────────
   1. NAVBAR — scroll-triggered glass effect
   ────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ──────────────────────────────────────────────
   2. MOBILE MENU — open / close
   ────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburgerBtn');
  const mobileMenu  = document.getElementById('mobileMenu');
  const closeBtn    = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Stagger animate links
    mobileLinks.forEach((link, i) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(24px)';
      link.style.transition = `opacity 0.4s ${i * 0.07}s ease, transform 0.4s ${i * 0.07}s ease`;
      requestAnimationFrame(() => {
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
      });
    });
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    mobileLinks.forEach(link => {
      link.style.transition = '';
    });
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ──────────────────────────────────────────────
   3. SCROLL REVEAL — IntersectionObserver
   ────────────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   4. SLIDER — transformation cards
   ────────────────────────────────────────────── */
(function initSlider() {
  const track      = document.getElementById('sliderTrack');
  const btnLeft    = document.getElementById('sliderLeft');
  const btnRight   = document.getElementById('sliderRight');
  if (!track || !btnLeft || !btnRight) return;

  function getScrollAmount() {
    return track.offsetWidth * 0.8;
  }

  btnLeft.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
  btnRight.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  // Touch / drag support
  let startX = 0;
  let startScroll = 0;
  let isDragging = false;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    startScroll = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDragging = false; track.style.cursor = ''; });
  track.addEventListener('mouseup',    () => { isDragging = false; track.style.cursor = ''; });
  track.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = startScroll - (x - startX);
  });
})();


/* ──────────────────────────────────────────────
   5. FAQ ACCORDION
   ────────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => i.classList.remove('open'));

      // Open clicked (if wasn't open)
      if (!isOpen) item.classList.add('open');
    });
  });
})();


/* ──────────────────────────────────────────────
   6. CONTACT FORM — submit feedback
   ────────────────────────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const submit = document.getElementById('formSubmit');
  if (!form || !submit) return;

  const originalHTML = submit.innerHTML;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show success state
    submit.disabled = true;
    submit.innerHTML = `
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Wysłano!
    `;

    // Reset after 4s
    setTimeout(() => {
      submit.disabled = false;
      submit.innerHTML = originalHTML;
      form.reset();
    }, 4000);
  });
})();


/* ──────────────────────────────────────────────
   7. SMOOTH ANCHOR SCROLLING (offset for fixed nav)
   ────────────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ──────────────────────────────────────────────
   8. FOOTER YEAR
   ────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ──────────────────────────────────────────────
   9. OFFER CARDS — subtle parallax on hover
   ────────────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.offer-card');
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `scale(1.02) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ──────────────────────────────────────────────
   10. BUTTON SONAR PULSE EFFECT on click
   ────────────────────────────────────────────── */
(function initSonarPulse() {
  document.querySelectorAll('.btn-primary, .nav-cta, .offer-btn--premium, .form-submit, .mobile-cta').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: 10px; height: 10px;
        background: rgba(204,255,0,0.45);
        transform: scale(0);
        animation: sonarRipple 0.7s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;

      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - 5;
      const y    = e.clientY - rect.top  - 5;
      ripple.style.left = x + 'px';
      ripple.style.top  = y + 'px';

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject keyframes once
  if (!document.getElementById('sonarStyle')) {
    const style = document.createElement('style');
    style.id = 'sonarStyle';
    style.textContent = `
      @keyframes sonarRipple {
        to { transform: scale(30); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();
