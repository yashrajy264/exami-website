// ===== HOME PAGE SPECIFIC FUNCTIONALITY =====
(function() {
    'use strict';

    // ===== HERO ANIMATIONS =====
    class HeroAnimations {
        constructor() {
            this.init();
        }

        init() {
            this.animateHeroElements();
            this.setupFloatingAnimation();
        }

        animateHeroElements() {
            const elements = document.querySelectorAll('[data-reveal]');
            
            elements.forEach((element, index) => {
                const delay = element.dataset.revealDelay || index * 100;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            });
        }

        setupFloatingAnimation() {
            const mockup = document.querySelector('.mockup-phone');
            if (mockup) {
                mockup.classList.add('floating');
            }
        }
    }

    // ===== WAITLIST FORM =====
    class WaitlistForm {
        constructor() {
            this.form = document.getElementById('waitlist-form');
            this.message = document.getElementById('form-message');
            
            if (this.form) {
                this.init();
            }
        }

        init() {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        async handleSubmit(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const role = document.getElementById('role').value;

            if (!this.isValidEmail(email)) {
                this.showMessage('Please enter a valid email address.', 'error');
                return;
            }

            this.showMessage('Submitting...', 'info');
            
            try {
                // Store locally for now (replace with actual API call)
                const existing = JSON.parse(localStorage.getItem('exami_waitlist') || '[]');
                existing.push({ email, role, timestamp: Date.now() });
                localStorage.setItem('exami_waitlist', JSON.stringify(existing));
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 600));
                
                this.showMessage('Thanks! You\'re on the list. We\'ll reach out soon.', 'success');
                this.form.reset();
            } catch (error) {
                this.showMessage('Something went wrong. Please try again.', 'error');
            }
        }

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        showMessage(text, type = 'info') {
            if (!this.message) return;
            
            this.message.textContent = text;
            this.message.hidden = false;
            
            const colors = {
                error: '#ef4444',
                success: '#10b981',
                info: 'inherit'
            };
            
            this.message.style.color = colors[type] || colors.info;
        }
    }

    // ===== BENTO GRID ANIMATIONS =====
    class BentoAnimations {
        constructor() {
            this.init();
        }

        init() {
            this.setupScrollAnimations();
        }

        setupScrollAnimations() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('.bento-item, .solution-card').forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    item.style.transition = 'all 0.6s ease';
                    observer.observe(item);
                });
            }
        }
    }

    // ===== INITIALIZATION =====
    function initializeHomePage() {
        new HeroAnimations();
        new WaitlistForm();
        new BentoAnimations();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHomePage);
    } else {
        initializeHomePage();
    }
})();