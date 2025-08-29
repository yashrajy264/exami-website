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

  // ===== UTILITY FUNCTIONS =====
  const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  };
  
  const throttle = (func, limit) => {
      let inThrottle;
      return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
          }
      }
  };
  
  // ===== CUSTOM CURSOR =====
  class CustomCursor {
      constructor() {
          this.cursor = null;
          this.cursorDot = null;
          this.init();
      }
  
      init() {
          // Create cursor elements
          this.cursor = document.createElement('div');
          this.cursor.className = 'custom-cursor';
          this.cursorDot = document.createElement('div');
          this.cursorDot.className = 'custom-cursor-dot';
          
          document.body.appendChild(this.cursor);
          document.body.appendChild(this.cursorDot);
  
          // Mouse move handler
          this.handleMouseMove = throttle((e) => {
              this.cursor.style.left = e.clientX + 'px';
              this.cursor.style.top = e.clientY + 'px';
              this.cursorDot.style.left = e.clientX + 'px';
              this.cursorDot.style.top = e.clientY + 'px';
          }, 16);
  
          document.addEventListener('mousemove', this.handleMouseMove);
          
          // Hover effects
          this.addHoverEffects();
      }
  
      addHoverEffects() {
          const hoverElements = document.querySelectorAll('a, button, .interactive, .card, .feature-card, .solution-card');
          
          hoverElements.forEach(element => {
              element.addEventListener('mouseenter', () => {
                  this.cursor.classList.add('cursor-hover');
                  this.cursorDot.classList.add('cursor-hover');
              });
              
              element.addEventListener('mouseleave', () => {
                  this.cursor.classList.remove('cursor-hover');
                  this.cursorDot.classList.remove('cursor-hover');
              });
          });
      }
  }
  
  // ===== SCROLL ANIMATIONS =====
  class ScrollAnimations {
      constructor() {
          this.observerOptions = {
              threshold: 0.1,
              rootMargin: '0px 0px -50px 0px'
          };
          this.init();
      }
  
      init() {
          if ('IntersectionObserver' in window) {
              this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
              this.observeElements();
          } else {
              // Fallback for older browsers
              this.fallbackAnimation();
          }
      }
  
      observeElements() {
          const elements = document.querySelectorAll('.animate-on-scroll, .feature-card, .solution-card, .stat-item, .faq-item');
          elements.forEach(el => {
              el.classList.add('animate-hidden');
              this.observer.observe(el);
          });
      }
  
      handleIntersection(entries) {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('animate-visible');
                  entry.target.classList.remove('animate-hidden');
                  this.observer.unobserve(entry.target);
              }
          });
      }
  
      fallbackAnimation() {
          const elements = document.querySelectorAll('.animate-on-scroll, .feature-card, .solution-card, .stat-item, .faq-item');
          elements.forEach((el, index) => {
              setTimeout(() => {
                  el.classList.add('animate-visible');
              }, index * 100);
          });
      }
  }
  
  // ===== ANIMATED COUNTERS =====
  class AnimatedCounters {
      constructor() {
          this.counters = document.querySelectorAll('.counter');
          this.init();
      }
  
      init() {
          if ('IntersectionObserver' in window) {
              this.observer = new IntersectionObserver(this.handleCounterIntersection.bind(this), {
                  threshold: 0.5
              });
              
              this.counters.forEach(counter => {
                  this.observer.observe(counter);
              });
          }
      }
  
      handleCounterIntersection(entries) {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  this.animateCounter(entry.target);
                  this.observer.unobserve(entry.target);
              }
          });
      }
  
      animateCounter(counter) {
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = 2000;
          const start = performance.now();
          const startValue = 0;
  
          const animate = (currentTime) => {
              const elapsed = currentTime - start;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function
              const easeOutCubic = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(startValue + (target - startValue) * easeOutCubic);
              
              counter.textContent = current.toLocaleString();
              
              if (progress < 1) {
                  requestAnimationFrame(animate);
              } else {
                  counter.textContent = target.toLocaleString();
              }
          };
          
          requestAnimationFrame(animate);
      }
  }
  
  // ===== ACCORDION FUNCTIONALITY =====
  class Accordion {
      constructor() {
          this.accordions = document.querySelectorAll('.faq-item');
          this.init();
      }
  
      init() {
          this.accordions.forEach(accordion => {
              const header = accordion.querySelector('.faq-question');
              const content = accordion.querySelector('.faq-answer');
              
              if (header && content) {
                  header.addEventListener('click', () => this.toggle(accordion));
                  
                  // Set initial state
                  content.style.maxHeight = '0';
                  content.style.overflow = 'hidden';
                  content.style.transition = 'max-height 0.3s ease';
              }
          });
      }
  
      toggle(accordion) {
          const content = accordion.querySelector('.faq-answer');
          const icon = accordion.querySelector('.faq-icon');
          const isOpen = accordion.classList.contains('active');
          
          // Close all other accordions
          this.accordions.forEach(item => {
              if (item !== accordion) {
                  item.classList.remove('active');
                  const otherContent = item.querySelector('.faq-answer');
                  const otherIcon = item.querySelector('.faq-icon');
                  if (otherContent) otherContent.style.maxHeight = '0';
                  if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
              }
          });
          
          // Toggle current accordion
          if (isOpen) {
              accordion.classList.remove('active');
              content.style.maxHeight = '0';
              if (icon) icon.style.transform = 'rotate(0deg)';
          } else {
              accordion.classList.add('active');
              content.style.maxHeight = content.scrollHeight + 'px';
              if (icon) icon.style.transform = 'rotate(45deg)';
          }
      }
  }
  
  // ===== CARD INTERACTIONS =====
  class CardInteractions {
      constructor() {
          this.cards = document.querySelectorAll('.feature-card, .solution-card');
          this.init();
      }
  
      init() {
          this.cards.forEach(card => {
              this.addTiltEffect(card);
              this.addHoverEffects(card);
          });
      }
  
      addTiltEffect(card) {
          card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              
              const rotateX = (y - centerY) / centerY * -10;
              const rotateY = (x - centerX) / centerX * 10;
              
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
          });
          
          card.addEventListener('mouseleave', () => {
              card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
          });
      }
  
      addHoverEffects(card) {
          card.addEventListener('mouseenter', () => {
              card.classList.add('card-hover');
          });
          
          card.addEventListener('mouseleave', () => {
              card.classList.remove('card-hover');
          });
      }
  }
  
  // ===== FORM HANDLING =====
  class FormHandler {
      constructor() {
          this.forms = document.querySelectorAll('form');
          this.init();
      }
  
      init() {
          this.forms.forEach(form => {
              form.addEventListener('submit', this.handleSubmit.bind(this));
              
              // Add input validation
              const inputs = form.querySelectorAll('input, textarea');
              inputs.forEach(input => {
                  input.addEventListener('blur', this.validateInput.bind(this));
                  input.addEventListener('input', this.clearErrors.bind(this));
              });
          });
      }
  
      async handleSubmit(e) {
          e.preventDefault();
          const form = e.target;
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.textContent;
          
          // Validate form
          if (!this.validateForm(form)) {
              return;
          }
          
          // Show loading state
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
          submitBtn.classList.add('loading');
          
          try {
              // Simulate API call
              await this.simulateSubmission();
              
              // Success state
              this.showSuccess(form);
              form.reset();
          } catch (error) {
              // Error state
              this.showError(form, 'Something went wrong. Please try again.');
          } finally {
              // Reset button
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
              submitBtn.classList.remove('loading');
          }
      }
  
      validateForm(form) {
          const inputs = form.querySelectorAll('input[required], textarea[required]');
          let isValid = true;
          
          inputs.forEach(input => {
              if (!this.validateInput({ target: input })) {
                  isValid = false;
              }
          });
          
          return isValid;
      }
  
      validateInput(e) {
          const input = e.target;
          const value = input.value.trim();
          let isValid = true;
          let errorMessage = '';
          
          // Remove existing errors
          this.clearInputError(input);
          
          // Required validation
          if (input.hasAttribute('required') && !value) {
              errorMessage = 'This field is required';
              isValid = false;
          }
          
          // Email validation
          if (input.type === 'email' && value) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                  errorMessage = 'Please enter a valid email address';
                  isValid = false;
              }
          }
          
          // Phone validation
          if (input.type === 'tel' && value) {
              const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
              if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                  errorMessage = 'Please enter a valid phone number';
                  isValid = false;
              }
          }
          
          if (!isValid) {
              this.showInputError(input, errorMessage);
          }
          
          return isValid;
      }
  
      showInputError(input, message) {
          input.classList.add('error');
          
          let errorElement = input.parentNode.querySelector('.error-message');
          if (!errorElement) {
              errorElement = document.createElement('span');
              errorElement.className = 'error-message';
              input.parentNode.appendChild(errorElement);
          }
          
          errorElement.textContent = message;
      }
  
      clearInputError(input) {
          input.classList.remove('error');
          const errorElement = input.parentNode.querySelector('.error-message');
          if (errorElement) {
              errorElement.remove();
          }
      }
  
      clearErrors(e) {
          this.clearInputError(e.target);
      }
  
      showSuccess(form) {
          const successMessage = document.createElement('div');
          successMessage.className = 'success-message';
          successMessage.textContent = 'Thank you! Your message has been sent successfully.';
          
          form.parentNode.insertBefore(successMessage, form.nextSibling);
          
          setTimeout(() => {
              successMessage.remove();
          }, 5000);
      }
  
      showError(form, message) {
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message-form';
          errorMessage.textContent = message;
          
          form.parentNode.insertBefore(errorMessage, form.nextSibling);
          
          setTimeout(() => {
              errorMessage.remove();
          }, 5000);
      }
  
      simulateSubmission() {
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  // 90% success rate for demo
                  if (Math.random() > 0.1) {
                      resolve();
                  } else {
                      reject(new Error('Network error'));
                  }
              }, 1500);
          });
      }
  }
  
  // ===== NAVIGATION =====
  class Navigation {
      constructor() {
          this.nav = document.querySelector('.nav');
          this.mobileToggle = document.querySelector('.mobile-toggle');
          this.dropdowns = document.querySelectorAll('.dropdown');
          this.init();
      }
  
      init() {
          this.handleScroll();
          this.handleMobileToggle();
          this.handleDropdowns();
  
          window.addEventListener('scroll', throttle(this.handleScroll.bind(this), 16));
      }
  
      handleScroll() {
          if (window.scrollY > 100) {
              this.nav.classList.add('nav-scrolled');
          } else {
              this.nav.classList.remove('nav-scrolled');
          }
      }
  
      handleMobileToggle() {
          if (this.mobileToggle) {
              this.mobileToggle.addEventListener('click', () => {
                  this.nav.classList.toggle('nav-open');
                  document.body.classList.toggle('nav-open');
              });
          }
      }
  
      handleDropdowns() {
          this.dropdowns.forEach(dropdown => {
              const trigger = dropdown.querySelector('.dropdown-trigger');
              const menu = dropdown.querySelector('.dropdown-menu');
              
              if (trigger && menu) {
                  trigger.addEventListener('click', (e) => {
                      e.preventDefault();
                      dropdown.classList.toggle('active');
                  });
                  
                  // Close on outside click
                  document.addEventListener('click', (e) => {
                      if (!dropdown.contains(e.target)) {
                          dropdown.classList.remove('active');
                      }
                  });
              }
          });
      }
  }
  
  // ===== MOCKUP ANIMATIONS =====
  class MockupAnimations {
      constructor() {
          this.mockups = document.querySelectorAll('.dashboard-mockup, .animated-mockup');
          this.init();
      }
  
      init() {
          this.mockups.forEach(mockup => {
              this.addFloatingAnimation(mockup);
              this.addInteractiveElements(mockup);
          });
      }
  
      addFloatingAnimation(mockup) {
          // Add subtle floating animation
          let startTime = Date.now();
          
          const animate = () => {
              const elapsed = Date.now() - startTime;
              const y = Math.sin(elapsed * 0.001) * 5;
              const x = Math.cos(elapsed * 0.0008) * 3;
              
              mockup.style.transform = `translate(${x}px, ${y}px)`;
              requestAnimationFrame(animate);
          };
          
          requestAnimationFrame(animate);
      }
  
      addInteractiveElements(mockup) {
          const interactiveElements = mockup.querySelectorAll('.mockup-button, .mockup-card, .mockup-element');
          
          interactiveElements.forEach(element => {
              element.addEventListener('mouseenter', () => {
                  element.style.transform = 'scale(1.05)';
                  element.style.transition = 'transform 0.2s ease';
              });
              
              element.addEventListener('mouseleave', () => {
                  element.style.transform = 'scale(1)';
              });
          });
      }
  }
  
  // ===== PERFORMANCE OPTIMIZATIONS =====
  class PerformanceOptimizer {
      constructor() {
          this.init();
      }
  
      init() {
          this.lazyLoadImages();
          this.preloadCriticalResources();
          this.optimizeAnimations();
      }
  
      lazyLoadImages() {
          if ('IntersectionObserver' in window) {
              const imageObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting) {
                          const img = entry.target;
                          if (img.dataset.src) {
                              img.src = img.dataset.src;
                              img.classList.remove('lazy');
                              imageObserver.unobserve(img);
                          }
                      }
                  });
              });
  
              document.querySelectorAll('img[data-src]').forEach(img => {
                  imageObserver.observe(img);
              });
          }
      }
  
      preloadCriticalResources() {
          // Preload critical fonts
          const fontLink = document.createElement('link');
          fontLink.rel = 'preload';
          fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
          fontLink.as = 'style';
          document.head.appendChild(fontLink);
      }
  
      optimizeAnimations() {
          // Respect user's motion preferences
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          if (prefersReducedMotion) {
              document.documentElement.style.setProperty('--animation-duration', '0.01ms');
              document.documentElement.style.setProperty('--transition-duration', '0.01ms');
          }
      }
  }
  
  // ===== ERROR HANDLING =====
  class ErrorHandler {
      constructor() {
          this.init();
      }
  
      init() {
          window.addEventListener('error', this.handleError.bind(this));
          window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
      }
  
      handleError(event) {
          console.error('JavaScript Error:', {
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              error: event.error
          });
          
          // Optional: Send error to analytics service
          // this.sendErrorToAnalytics(event);
      }
  
      handlePromiseRejection(event) {
          console.error('Unhandled Promise Rejection:', event.reason);
          
          // Prevent the default browser behavior
          event.preventDefault();
      }
  
      sendErrorToAnalytics(error) {
          // Implementation for error tracking service
          // Example: Google Analytics, Sentry, etc.
      }
  }
  
  // ===== INITIALIZATION =====
  class ExamiWebsite {
      constructor() {
          this.components = [];
          this.init();
      }
  
      init() {
          // Wait for DOM to be ready
          if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', this.initializeComponents.bind(this));
          } else {
              this.initializeComponents();
          }
      }
  
      initializeComponents() {
          try {
              // Initialize all components
              this.components.push(new ErrorHandler());
              this.components.push(new PerformanceOptimizer());
              this.components.push(new CustomCursor());
              this.components.push(new Navigation());
              this.components.push(new ScrollAnimations());
              this.components.push(new AnimatedCounters());
              this.components.push(new Accordion());
              this.components.push(new CardInteractions());
              this.components.push(new FormHandler());
              this.components.push(new MockupAnimations());
              
              console.log('Exami website initialized successfully');
          } catch (error) {
              console.error('Error initializing website components:', error);
          }
      }
  
      // Method to reinitialize components if needed
      reinitialize() {
          this.components = [];
          this.initializeComponents();
      }
  }
  
  // ===== START THE APPLICATION =====
  const examiWebsite = new ExamiWebsite();
  
  // Export for potential use in other scripts
  if (typeof module !== 'undefined' && module.exports) {
      module.exports = ExamiWebsite;
  }
})(); // Close the IIFE

