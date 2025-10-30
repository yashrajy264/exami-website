// Utility function for class name merging (vanilla JS equivalent of clsx + tailwind-merge)
// Note: This is a simplified version for vanilla JS - full clsx and tailwind-merge require build step
// For now, we'll use a basic implementation

function cn(...inputs) {
  const classes = [];
  inputs.forEach(input => {
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(...input.filter(Boolean));
    } else if (typeof input === 'object' && input !== null) {
      Object.keys(input).forEach(key => {
        if (input[key]) {
          classes.push(key);
        }
      });
    }
  });
  // Basic conflict resolution (last one wins for now)
  return classes.join(' ');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cn;
} else {
  window.cn = cn;
}

