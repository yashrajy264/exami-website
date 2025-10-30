// Dark/Light mode toggle functionality
class ThemeToggle {
  constructor() {
    this.theme = this.getStoredTheme() || this.getPreferredTheme();
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.theme);
    
    // Listen for system preference changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (!this.getStoredTheme()) {
          this.setTheme(mediaQuery.matches ? 'dark' : 'light');
        }
      });
    }
  }

  getPreferredTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  toggle() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme() {
    return this.theme;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeToggle;
} else {
  window.ThemeToggle = ThemeToggle;
}

