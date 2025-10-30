// Reusable site footer injection
(function(){
  if (document.getElementById('exami-site-footer')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'exami-site-footer';

  const html = `
  <footer class="footer-root">
    <div class="footer-glow-wrap" aria-hidden="true">
      <div class="footer-glow footer-glow-1"></div>
      <div class="footer-glow footer-glow-2"></div>
    </div>
    <div class="glass footer-card">
      <div class="footer-brand">
        <a href="./index.html" class="footer-logo-link" aria-label="Exami Home">
          <span class="footer-logo-img">
            <img src="./exami-logo.webp" alt="Exami Logo" width="36" height="28" loading="lazy">
          </span>
          <span class="footer-logo-text">Exami</span>
        </a>
        <p class="footer-description">Exami provides a unified, secure, and scalable platform to modernize India's examination infrastructure.</p>
        <div class="footer-socials">
          <a href="#" aria-label="Twitter" class="footer-social-link" rel="noopener"> 
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.633 7.997c.013.176.013.353.013.53 0 5.387-4.099 11.605-11.604 11.605A11.561 11.561 0 010 18.29c.373.044.734.074 1.12.074a8.189 8.189 0 005.065-1.737 4.102 4.102 0 01-3.834-2.85c.25.04.5.065.765.065.37 0 .734-.049 1.08-.147A4.092 4.092 0 01.8 8.582v-.05a4.119 4.119 0 001.853.522A4.099 4.099 0 01.812 5.847c0-.02 0-.042.002-.062a11.653 11.653 0 008.457 4.287A4.62 4.62 0 0122 5.924a8.215 8.215 0 002.018-.559 4.108 4.108 0 01-1.803 2.268 8.233 8.233 0 002.368-.648 8.897 8.897 0 01-2.062 2.112z"/></svg>
          </a>
          <a href="#" aria-label="GitHub" class="footer-social-link" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .29a12 12 0 00-3.797 23.401c.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.415-4.042-1.415-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.084-.729.084-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.306 3.495.999.106-.775.418-1.307.76-1.608-2.665-.301-5.466-1.332-5.466-5.933 0-1.31.469-2.381 1.236-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.007-.322 3.301 1.23a11.502 11.502 0 016.002 0c2.292-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.119 3.176.77.841 1.235 1.912 1.235 3.222 0 4.61-2.805 5.629-5.476 5.925.429.369.813 1.096.813 2.211v3.285c0 .32.217.694.825.576A12 12 0 0012 .29"></path></svg>
          </a>
          <a href="#" aria-label="LinkedIn" class="footer-social-link" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11 19h-3v-9h3zm-1.5-10.268a1.752 1.752 0 110-3.505 1.752 1.752 0 010 3.505zm15.5 10.268h-3v-4.5c0-1.07-.02-2.450-1.492-2.450-1.495 0-1.725 1.166-1.725 2.372v4.578h-3v-9h2.88v1.23h.04a3.157 3.157 0 012.847-1.568c3.042 0 3.605 2.003 3.605 4.612v4.726z"/></svg>
          </a>
        </div>
      </div>

      <nav class="footer-nav">
        <div class="footer-group">
          <div class="footer-heading">Product</div>
          <ul>
            <li><a href="./index.html#features">Features</a></li>
            <li><a href="./index.html#solutions">Solutions</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="./about.html" data-nav>About</a></li>
          </ul>
        </div>
        <div class="footer-group">
          <div class="footer-heading">Company</div>
          <ul>
            <li><a href="./about.html" data-nav>About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-group">
          <div class="footer-heading">Resources</div>
          <ul>
            <li><a href="#">Docs</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="footer-copy">© <span id="year">2025</span> Exami. All rights reserved.</div>
  </footer>`;

  wrapper.innerHTML = html;

  const mount = document.getElementById('site-footer');
  if (mount) {
    mount.appendChild(wrapper);
  } else {
    document.body.appendChild(wrapper);
  }
})();


