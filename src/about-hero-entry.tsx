import React from 'react';
import { createRoot } from 'react-dom/client';
import HeroAbout from '../components/about/HeroAbout';
import '../components/about/HeroAbout.css';

const container = document.getElementById('about-hero-root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <HeroAbout />
    </React.StrictMode>
  );
} else {
  console.error('Could not find #about-hero-root element');
}

