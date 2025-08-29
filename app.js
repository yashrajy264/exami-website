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

      showMessage('Thanks! You’re on the list. We’ll reach out soon.', 'success');
      form.reset();
    });
  }

  // Respect reduced motion preferences
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

  // On-scroll reveal animations (kept)
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
    const damp = 18; // easing steps
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
  // Respects reduced-motion by disabling dynamic updates
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spotlightTargets = document.querySelectorAll('.feature, .screen-card, .roadmap-card, .bento-card');
  if (spotlightTargets.length) {
    spotlightTargets.forEach(card => {
      const update = (e) => {
        if (prefersReduced) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // use px to support gradient positioned by pixels
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      };
      card.addEventListener('pointermove', update);
      card.addEventListener('pointerenter', update);
    });
  }

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

      showSurveyMessage('Thanks for your feedback! We’ve recorded your response.', 'success');
      surveyForm.reset();
    });
  }
})();