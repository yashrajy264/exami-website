/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './about.html',
    './vision.html',
    './student.html',
    './institution.html',
    './government.html',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1575FF',
        primaryDark: '#0D5CE6',
        primaryLight: '#4A90FF',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        success: '#10B981',
        error: '#EF4444',
        text: '#1A1A1A',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        exami: {
          primary: '#1575FF',
          secondary: '#06B6D4',
          accent: '#F59E0B',
          neutral: '#111827',
          'base-100': '#FFFFFF',
          success: '#10B981',
          error: '#EF4444',
        },
      },
      'light',
    ],
  },
};
