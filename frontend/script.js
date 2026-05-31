document.addEventListener('DOMContentLoaded', function () {
  // Using SMTP relay backend; no EmailJS initialization required on client

  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
    });
  } else {
    console.warn('AOS is not available; skipping AOS initialization.');
  }

  const typed = window.Typed ? new Typed('#typed', {
    strings: [
      'Data Scientist.',
      'AI Developer.',
      'Full Stack Developer.',
      'Big Data Specialist.',
    ],
    typeSpeed: 80,
    backSpeed: 45,
    backDelay: 1800,
    loop: true,
  }) : null;
  if (!typed) {
    console.warn('Typed.js is not available; skipping typing animation.');
  }

  const themeSwitch = document.getElementById('theme-switch');
  const themeToggle = document.querySelector('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('portfolioTheme');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

  function updateThemeIcon(isDark) {
    if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
  }

  function applyTheme(isDark) {
    if (themeSwitch) themeSwitch.checked = isDark;
    updateThemeIcon(isDark);
    localStorage.setItem('portfolioTheme', isDark ? 'dark' : 'light');
    console.log('Theme set:', isDark ? 'dark' : 'light');
  }

  if (!themeSwitch || !themeToggle) {
    console.warn('Theme switch or toggle button not found');
  } else {
    const isDarkSaved = currentTheme === 'dark';
    applyTheme(isDarkSaved);

    themeSwitch.addEventListener('change', () => {
      applyTheme(themeSwitch.checked);
    });
  }

  const navMenu = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  console.log('Contact form handler active');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      message: contactForm.message.value,
    };

    formMessage.textContent = 'Sending message...';
    formMessage.className = 'form-message info';
    console.log('Submitting contact form', formData);

    try {
      // ✅ Updated to use Render backend URL
      const backendURL = "https://portfolio-backend-prpc.onrender.com/send";;
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let errorMsg = 'Failed to send';
        try {
          const body = JSON.parse(text || '{}');
          errorMsg = body.error || errorMsg;
        } catch (e) {
          if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
      }

      formMessage.textContent = 'Thanks for your message! I will reply soon.';
      formMessage.className = 'form-message success';
      contactForm.reset();
    } catch (error) {
      console.error('Send error:', error);
      formMessage.textContent = 'Failed to send message. ' + (error.message || 'Please try again later.');
      formMessage.className = 'form-message error';
    }
  });
});
