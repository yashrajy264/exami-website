(function(){
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for anchor links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  for (const link of navLinks) {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${targetId}`);
      }
    });
  }

  // Waitlist form handling
  const form = document.getElementById('waitlist-form');
  const message = document.getElementById('form-message');

  function showMessage(text, type = 'info'){
    if (!message) return;
    message.textContent = text;
    message.hidden = false;
    message.style.color = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : 'inherit';
  }

  function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = /** @type {HTMLInputElement} */(document.getElementById('email')).value.trim();
      const role = /** @type {HTMLSelectElement} */(document.getElementById('role')).value;

      if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate submit (no backend wired yet). Store locally for now.
      try {
        const existing = JSON.parse(localStorage.getItem('exami_waitlist') || '[]');
        existing.push({ email, role, ts: Date.now() });
        localStorage.setItem('exami_waitlist', JSON.stringify(existing));
      } catch { /* ignore storage errors */ }

      // Fake a network delay for UX
      showMessage('Submitting...', 'info');
      await new Promise(r => setTimeout(r, 600));

      showMessage('Thanks! You\'re on the list. We\'ll reach out soon.', 'success');
      form.reset();
    });
  }

  // Respect reduced motion preferences
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
  }

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const primaryNav = document.getElementById('primary-nav');
  if (hamburger && primaryNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    primaryNav.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Element && target.tagName === 'A') {
        primaryNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Page transition on navigation (internal links)
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  function isInternal(href){
    try { const u = new URL(href, window.location.href); return u.origin === location.origin; } catch { return false; }
  }

  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[data-nav]') : null;
    if (!a) return;
    const href = a.getAttribute('href') || '#';
    // Hash links on same page should scroll normally
    if (href.startsWith('#')) return;
    if (isInternal(href)) {
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(() => { window.location.href = href; }, 220);
    }
  });

  // On-scroll reveal animations
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (revealItems.length) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(() => {
            el.classList.add('reveal-visible');
          }, delay);
          io.unobserve(el);
        }
      }
    }, { threshold: 0.12 });
    revealItems.forEach(el => io.observe(el));
  }

  // Tilt effect for interactive cards (mouse only)
  const tiltEls = document.querySelectorAll('[data-tilt]');
  if (tiltEls.length) {
    const maxTilt = 10; // degrees
    tiltEls.forEach(el => {
      let rx = 0, ry = 0, frame;
      const rectFor = () => el.getBoundingClientRect();

      function onMove(e){
        const rect = rectFor();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const px = (e.clientX - cx) / (rect.width/2);
        const py = (e.clientY - cy) / (rect.height/2);
        ry = px * maxTilt;
        rx = -py * maxTilt;
        if (!frame) frame = requestAnimationFrame(apply);
      }

      function apply(){
        el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
        frame = null;
      }

      function reset(){
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      }

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', reset);
      el.addEventListener('touchstart', reset, { passive: true });
      el.addEventListener('touchmove', reset, { passive: true });
      el.addEventListener('touchend', reset, { passive: true });
    });
  }

  // Spotlight glow on hover for cards (follows cursor)
  const spotlightTargets = document.querySelectorAll('.feature, .screen-card, .roadmap-card, .bento-card, .concept-item, .progress-card');
  if (spotlightTargets.length) {
    spotlightTargets.forEach(card => {
      const update = (e) => {
        if (prefersReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      };
      card.addEventListener('pointermove', update);
      card.addEventListener('pointerenter', update);
    });
  }

  // Animated counters for metrics
  (function initCounters(){
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const format = (n) => {
      const rounded = n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
      return rounded.toLocaleString();
    };

    const animate = (el) => {
      const to = parseFloat(el.getAttribute('data-count-to') || '0');
      const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (prefersReducedMotion || duration <= 0) {
        el.textContent = format(to) + suffix;
        return;
      }

      const start = performance.now();
      const from = 0;
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = from + (to - from) * eased;
        el.textContent = format(current) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animate(el);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => io.observe(el));
  })();

  // Progress bar animations
  const progressBars = document.querySelectorAll('.progress-fill');
  if (progressBars.length) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = width;
          }, 200);
          progressObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => progressObserver.observe(bar));
  }

  // Early access form handling
  const earlyAccessForm = document.querySelector('.early-access-form');
  if (earlyAccessForm) {
    earlyAccessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(earlyAccessForm);
      const email = formData.get('email') || earlyAccessForm.querySelector('input[type="email"]').value;
      const role = formData.get('role') || earlyAccessForm.querySelector('select').value;
      
      // Simulate form submission
      const submitBtn = earlyAccessForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Joining...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = '✓ Joined!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          earlyAccessForm.reset();
        }, 2000);
      }, 1500);
    });
  }

  // Mockup interaction
  const mockupFrames = document.querySelectorAll('.mockup-frame');
  mockupFrames.forEach(frame => {
    frame.addEventListener('mouseenter', () => {
      if (frame.classList.contains('wireframe')) {
        frame.style.transform = 'rotate(0deg)';
        frame.style.opacity = '1';
      }
    });
    
    frame.addEventListener('mouseleave', () => {
      if (frame.classList.contains('wireframe')) {
        frame.style.transform = 'rotate(5deg)';
        frame.style.opacity = '0.7';
      }
    });
  });

  // Survey form handling
  const surveyForm = document.getElementById('survey-form');
  const surveyMsg = document.getElementById('survey-message');

  function showSurveyMessage(text, type = 'info'){
    if (!surveyMsg) return;
    surveyMsg.textContent = text;
    surveyMsg.hidden = false;
    surveyMsg.style.color = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : 'inherit';
  }

  function validEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (surveyForm) {
    surveyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = /** @type {HTMLInputElement} */(document.getElementById('survey_name')).value.trim();
      const email = /** @type {HTMLInputElement} */(document.getElementById('survey_email')).value.trim();
      const role = /** @type {HTMLSelectElement} */(document.getElementById('survey_role')).value;
      const feedback = /** @type {HTMLTextAreaElement} */(document.getElementById('survey_feedback')).value.trim();

      if (!name || !email || !role || !feedback) {
        showSurveyMessage('Please fill all fields.', 'error');
        return;
      }
      if (!validEmail(email)) {
        showSurveyMessage('Please enter a valid email.', 'error');
        return;
      }

      try {
        const existing = JSON.parse(localStorage.getItem('exami_survey') || '[]');
        existing.push({ name, email, role, feedback, ts: Date.now() });
        localStorage.setItem('exami_survey', JSON.stringify(existing));
      } catch { /* ignore storage errors */ }

      showSurveyMessage('Thanks for your feedback! We\'ve recorded your response.', 'success');
      surveyForm.reset();
    });
  }
})();