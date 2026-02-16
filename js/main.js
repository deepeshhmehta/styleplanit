document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const serviceGrids = Array.from(document.querySelectorAll('.services-grid'));

  function openTab(tabName, button) {
    serviceGrids.forEach((g) => {
      g.style.display = 'none';
      g.classList.remove('active');
    });

    tabButtons.forEach((b) => b.classList.remove('active'));

    const target = document.getElementById(tabName);
    if (!target) return;
    target.style.display = 'grid';
    // allow layout to settle before animation class
    setTimeout(() => target.classList.add('active'), 10);

    if (button) button.classList.add('active');
  }

  // wire up buttons
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tab = btn.dataset.tab;
      if (tab) openTab(tab, btn);
    });
  });

  // initialize first active
  const initial = tabButtons.find((b) => b.classList.contains('active')) || tabButtons[0];
  if (initial && initial.dataset.tab) openTab(initial.dataset.tab, initial);

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('active');
    });

    // close on nav click
    Array.from(navLinks.querySelectorAll('a')).forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hero slideshow for mobile
  function heroSlideshow() {
    const heroBgs = document.querySelectorAll('.hero-bg');
    let current = 0;
    if (heroBgs.length === 0) return;

    // Initial state
    heroBgs.forEach((bg, i) => {
        bg.style.opacity = '0';
        bg.style.transition = 'opacity 1s ease-in-out';
    });
    heroBgs[current].style.opacity = '1';
    heroBgs[current].classList.add('active');


    setInterval(() => {
        heroBgs[current].style.opacity = '0';
        heroBgs[current].classList.remove('active');
        current = (current + 1) % heroBgs.length;
        heroBgs[current].style.opacity = '1';
        heroBgs[current].classList.add('active');
    }, 2000);
  }

  if (window.innerWidth <= 768) {
    heroSlideshow();
  }
});
