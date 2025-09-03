// ===== BASE FUNCTIONALITY ===== 
(function() {
    'use strict';

    // ===== CUSTOM CURSOR =====
    class CustomCursor {
        constructor() {
            this.cursor = document.querySelector('.cursor');
            this.follower = document.querySelector('.cursor-follower');
            this.magnetic = document.querySelector('.cursor-magnetic');
            
            if (this.cursor && this.follower && this.magnetic) {
                this.init();
            }
        }

        init() {
            this.bindEvents();
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
            this.magnetic.style.opacity = '1';
        }

        bindEvents() {
            document.addEventListener('mousemove', this.updatePosition.bind(this));
            document.addEventListener('mouseenter', this.show.bind(this));
            document.addEventListener('mouseleave', this.hide.bind(this));
        }

        updatePosition(e) {
            const x = e.clientX;
            const y = e.clientY;

            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';

            setTimeout(() => {
                this.follower.style.left = x + 'px';
                this.follower.style.top = y + 'px';
            }, 50);

            setTimeout(() => {
                this.magnetic.style.left = x + 'px';
                this.magnetic.style.top = y + 'px';
            }, 100);
        }

        show() {
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
            this.magnetic.style.opacity = '1';
        }

        hide() {
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
            this.magnetic.style.opacity = '0';
        }
    }

    // ===== NAVIGATION =====
    class Navigation {
        constructor() {
            this.nav = document.querySelector('.nav');
            this.mobileToggle = document.querySelector('.mobile-menu-toggle');
            this.navLinks = document.querySelector('.nav-links');
            this.init();
        }

        init() {
            this.bindEvents();
            this.handleScroll();
        }

        bindEvents() {
            window.addEventListener('scroll', this.handleScroll.bind(this));
            
            if (this.mobileToggle) {
                this.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
            }

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', this.handleAnchorClick.bind(this));
            });
        }

        handleScroll() {
            if (!this.nav) return;
            
            const scrolled = window.scrollY > 50;
            this.nav.style.background = scrolled 
                ? 'rgba(255, 255, 255, 0.95)' 
                : 'rgba(255, 255, 255, 0.8)';
        }

        toggleMobileMenu() {
            if (this.navLinks) {
                this.navLinks.classList.toggle('active');
            }
        }

        handleAnchorClick(e) {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }
        }
    }

    // ===== PAGE TRANSITIONS =====
    class PageTransitions {
        constructor() {
            this.init();
        }

        init() {
            this.createOverlay();
            this.bindEvents();
        }

        createOverlay() {
            const overlay = document.createElement('div');
            overlay.className = 'page-transition';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--primary);
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(overlay);
            this.overlay = overlay;
        }

        bindEvents() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[data-nav]');
                if (link && this.isInternalLink(link.href)) {
                    e.preventDefault();
                    this.transition(link.href);
                }
            });
        }

        isInternalLink(href) {
            try {
                const url = new URL(href, window.location.href);
                return url.origin === location.origin;
            } catch {
                return false;
            }
        }

        transition(href) {
            this.overlay.style.opacity = '1';
            this.overlay.style.visibility = 'visible';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    }

    // ===== PERFORMANCE OPTIMIZER =====
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
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
            fontLink.as = 'style';
            document.head.appendChild(fontLink);
        }

        optimizeAnimations() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (prefersReducedMotion) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
                document.documentElement.style.setProperty('--transition-duration', '0.01ms');
            }
        }
    }

    // ===== INITIALIZATION =====
    function initializeBase() {
        new CustomCursor();
        new Navigation();
        new PageTransitions();
        new PerformanceOptimizer();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBase);
    } else {
        initializeBase();
    }

    // Export for use in other modules
    window.ExamiBase = {
        CustomCursor,
        Navigation,
        PageTransitions,
        PerformanceOptimizer
    };
})();