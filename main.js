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
});
