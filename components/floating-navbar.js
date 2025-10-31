// Floating Navbar Component (Vanilla JS)
// Adapted from Aceternity UI React component

class FloatingNav {
  constructor(config = {}) {
    this.navItems = config.navItems || [];
    this.className = config.className || '';
    this.containerId = config.containerId || 'floating-navbar';
    this.visible = true; // Start visible on page load
    this.lastScrollY = window.scrollY || 0;
    this.scrollThreshold = 0.05;
    this.isMobile = window.innerWidth <= 768;
    this.modalOpen = false;
    
    // Load Lucide icons if not already loaded
    this.loadLucideIcons();
    
    this.init();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      if (wasMobile !== this.isMobile) {
        this.render();
      }
    });
  }

  loadLucideIcons() {
    if (window.lucide) return; // Already loaded
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
    script.onload = () => {
      if (window.lucide) {
        window.lucide.createIcons();
      }
    };
    document.head.appendChild(script);
  }

  init() {
    // Create navbar container if it doesn't exist
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      this.container.className = 'floating-nav-container';
      document.body.appendChild(this.container);
    }

    this.render();
    this.attachEventListeners();
    
    // Initialize visibility based on scroll position
    this.updateVisibility(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
  }

  render() {
    // Home page link - always points to index.html
    const homeLink = './index.html';

    // Mobile view: only logo + hamburger
    if (this.isMobile) {
      this.renderMobile();
      return;
    }

    // Desktop view: full navbar
    // Check if Solutions item exists and create dropdown structure
    const solutionsItem = this.navItems.find(item => item.name === 'Solutions');
    const otherItems = this.navItems.filter(item => item.name !== 'Solutions');

    let navItemsHTML = '';
    
    // Render regular items
    otherItems.forEach((item, idx) => {
      // Add data-nav attribute for page transition handling
      const hasDataNav = item.link && !item.link.startsWith('#');
      navItemsHTML += `
        <a
          href="${item.link}"
          class="floating-nav-item"
          data-nav-index="${idx}"
          ${hasDataNav ? 'data-nav' : ''}
        >
          <span class="floating-nav-icon">${item.icon || ''}</span>
          <span class="floating-nav-text">${item.name}</span>
        </a>
      `;
    });

    // Render Solutions with dropdown if it exists
    if (solutionsItem) {
      navItemsHTML += `
        <div class="floating-nav-dropdown" id="solutions-dropdown">
          <a href="#" class="floating-nav-item floating-nav-dropdown-trigger">
            <span class="floating-nav-icon">${solutionsItem.icon || ''}</span>
            <span class="floating-nav-text">Solutions</span>
            <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 4.5 3 3 3-3"/>
            </svg>
          </a>
          <div class="floating-dropdown-menu">
            <a href="./student.html" class="floating-dropdown-item" data-nav>
              <svg class="dropdown-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5M2 10l10 5M2 10v6l10 5M12 15v6M22 10l-10 5"/>
                <path d="M6 12.5v5M18 12.5v5"/>
              </svg>
              <div>
                <div class="dropdown-item-title">For Students</div>
                <div class="dropdown-item-desc">Enhanced learning experience</div>
              </div>
            </a>
            <a href="./institution.html" class="floating-dropdown-item" data-nav>
              <svg class="dropdown-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                <path d="M6 12h12M6 18h12M6 6h12"/>
              </svg>
              <div>
                <div class="dropdown-item-title">For Institutions</div>
                <div class="dropdown-item-desc">Streamlined administration</div>
              </div>
            </a>
            <a href="./government.html" class="floating-dropdown-item" data-nav>
              <svg class="dropdown-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
              <div>
                <div class="dropdown-item-title">For Government</div>
                <div class="dropdown-item-desc">Policy & compliance tools</div>
              </div>
            </a>
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="floating-nav ${this.className}" id="floating-nav">
        <a href="${homeLink}" class="floating-nav-logo" data-nav>
          <img src="exami-logo.webp" alt="Exami Logo" width="100" height="28">
        </a>
        ${navItemsHTML}
        <button class="floating-nav-login" id="floating-nav-login">
          <span>Take Survey</span>
          <span class="login-gradient-line"></span>
        </button>
      </div>
    `;

    // Handle Solutions dropdown
    const solutionsDropdown = document.getElementById('solutions-dropdown');
    if (solutionsDropdown) {
      const trigger = solutionsDropdown.querySelector('.floating-nav-dropdown-trigger');
      const menu = solutionsDropdown.querySelector('.floating-dropdown-menu');
      
      if (trigger && menu) {
        // Click handler for mobile/desktop
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          solutionsDropdown.classList.toggle('active');
        });

        // Hover handler for desktop
        if (window.innerWidth >= 640) {
          solutionsDropdown.addEventListener('mouseenter', () => {
            solutionsDropdown.classList.add('active');
          });
          
          solutionsDropdown.addEventListener('mouseleave', () => {
            solutionsDropdown.classList.remove('active');
          });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!solutionsDropdown.contains(e.target)) {
            solutionsDropdown.classList.remove('active');
          }
        });
      }
    }

    // Attach login button handler (preserve existing functionality)
    const loginBtn = document.getElementById('floating-nav-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        // Preserve existing login functionality
        const originalLoginBtns = document.querySelectorAll('.btn-primary');
        if (originalLoginBtns.length > 0) {
          originalLoginBtns[0].click();
        }
      });
    }

    // Close dropdown when clicking dropdown menu links (let app.js handle navigation)
    const dropdownLinks = this.container.querySelectorAll('.floating-dropdown-item[href]');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close dropdown after navigation
        const dropdown = document.getElementById('solutions-dropdown');
        if (dropdown) {
          dropdown.classList.remove('active');
        }
      });
    });
  }

  renderMobile() {
    const homeLink = './index.html';
    
    // Mobile navbar: logo + hamburger
    this.container.innerHTML = `
      <div class="floating-nav ${this.className} floating-nav-mobile" id="floating-nav">
        <a href="${homeLink}" class="floating-nav-logo" data-nav>
          <img src="exami-logo.webp" alt="Exami Logo" width="100" height="28">
        </a>
        <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Open menu">
          <i data-lucide="menu"></i>
        </button>
      </div>
    `;

    // Initialize Lucide icons after render
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      // Wait for Lucide to load
      const checkLucide = setInterval(() => {
        if (window.lucide) {
          window.lucide.createIcons();
          clearInterval(checkLucide);
        }
      }, 100);
    }

    // Create modal if it doesn't exist
    this.createModal();

    // Attach hamburger click handler
    const hamburgerBtn = document.getElementById('mobile-menu-toggle');
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        this.openModal();
      });
    }
  }

  createModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('mobile-nav-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Find Vision link from navItems
    const visionItem = this.navItems.find(item => item.name === 'Vision');
    const visionLink = visionItem ? visionItem.link : './vision.html';
    
    // Find About link from navItems
    const aboutItem = this.navItems.find(item => item.name === 'About');
    const aboutLink = aboutItem ? aboutItem.link : './about.html';

    const modalHTML = `
      <div class="mobile-nav-modal-backdrop" id="mobile-nav-modal-backdrop"></div>
      <div class="mobile-nav-modal" id="mobile-nav-modal">
        <button class="mobile-nav-modal-close" id="mobile-nav-modal-close" aria-label="Close menu">
          <i data-lucide="x"></i>
        </button>
        <nav class="mobile-nav-modal-nav">
          <a href="./index.html" class="mobile-nav-modal-item mobile-tree-item" data-nav>
            <span class="mobile-tree-label">Home</span>
          </a>
          <a href="${aboutLink}" class="mobile-nav-modal-item mobile-tree-item" data-nav>
            <span class="mobile-tree-label">About</span>
          </a>
          <div class="mobile-nav-section" aria-hidden="true">Solutions</div>
          <a href="./student.html" class="mobile-nav-modal-item" data-nav>Students</a>
          <a href="./institution.html" class="mobile-nav-modal-item" data-nav>Institutions</a>
          <a href="./government.html" class="mobile-nav-modal-item" data-nav>Government</a>
          <a href="${visionLink}" class="mobile-nav-modal-item mobile-tree-item" data-nav>
            <span class="mobile-tree-label">Vision</span>
          </a>
          <a href="#contact" class="mobile-nav-modal-item mobile-tree-item" data-nav>
            <span class="mobile-tree-label">Contact</span>
          </a>
          <div class="mobile-tree-cta">
            <button class="floating-nav-login" id="mobile-nav-take-survey">
              <span>Take Survey</span>
              <span class="login-gradient-line"></span>
            </button>
          </div>
        </nav>
      </div>
    `;

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'mobile-nav-modal-container';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Initialize Lucide icons in modal
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      // Wait for Lucide to load
      const checkLucide = setInterval(() => {
        if (window.lucide) {
          window.lucide.createIcons();
          clearInterval(checkLucide);
        }
      }, 100);
    }

    // Attach event listeners
    this.attachModalListeners();
  }

  attachModalListeners() {
    // Close button
    const closeBtn = document.getElementById('mobile-nav-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Backdrop click
    const backdrop = document.getElementById('mobile-nav-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Navigation links - close modal on click
    const navLinks = document.querySelectorAll('.mobile-nav-modal-item[href], .mobile-nav-modal-subitem');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Take Survey button
    const takeSurveyBtn = document.getElementById('mobile-nav-take-survey');
    if (takeSurveyBtn) {
      takeSurveyBtn.addEventListener('click', () => {
        const originalLoginBtns = document.querySelectorAll('.btn-primary');
        if (originalLoginBtns.length > 0) {
          originalLoginBtns[0].click();
        }
        this.closeModal();
      });
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOpen) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.modalOpen = true;
    const modal = document.getElementById('mobile-nav-modal');
    const backdrop = document.getElementById('mobile-nav-modal-backdrop');
    const container = document.getElementById('mobile-nav-modal-container');
    
    if (container) {
      container.style.display = 'block';
      // Trigger animation
      setTimeout(() => {
        if (backdrop) backdrop.classList.add('active');
        if (modal) modal.classList.add('active');
      }, 10);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    // Re-initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  closeModal() {
    this.modalOpen = false;
    const modal = document.getElementById('mobile-nav-modal');
    const backdrop = document.getElementById('mobile-nav-modal-backdrop');
    const container = document.getElementById('mobile-nav-modal-container');
    
    if (modal) modal.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    
    // Allow body scroll
    document.body.style.overflow = '';

    // Hide container after animation
    setTimeout(() => {
      if (container) {
        container.style.display = 'none';
      }
    }, 300);
  }

  // (accordion removed)

  attachEventListeners() {
    // Use requestAnimationFrame for smooth scroll tracking
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = scrollHeight > 0 ? currentScrollY / scrollHeight : 0;

          this.updateVisibility(scrollProgress, currentScrollY);
          
          this.lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle initial scroll position
    handleScroll();
  }

  updateVisibility(scrollProgress, currentScrollY) {
    const navbar = document.getElementById('floating-nav');
    if (!navbar) return;

    // Check if we're near the top - always show at top of page
    if (scrollProgress < this.scrollThreshold || currentScrollY < 50) {
      this.visible = true;
    } else {
      // Determine scroll direction
      const scrollDelta = currentScrollY - this.lastScrollY;
      
      if (scrollDelta < 0) {
        // Scrolling up - show navbar
        this.visible = true;
      } else if (scrollDelta > 0) {
        // Scrolling down - hide navbar
        this.visible = false;
      }
    }

    // Apply visibility state
    if (this.visible) {
      navbar.classList.add('floating-nav-visible');
      navbar.classList.remove('floating-nav-hidden');
    } else {
      navbar.classList.add('floating-nav-hidden');
      navbar.classList.remove('floating-nav-visible');
    }
  }

  destroy() {
    if (this.container) {
      this.container.remove();
    }
    // Clean up modal
    const modalContainer = document.getElementById('mobile-nav-modal-container');
    if (modalContainer) {
      modalContainer.remove();
    }
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FloatingNav;
} else {
  window.FloatingNav = FloatingNav;
}

