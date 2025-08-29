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
})();