// ── PROGRESS BAR ──────────────────────────────────
(function () {
  const wrap = document.querySelector('.progress-bar-wrap');
  const fill = document.querySelector('.progress-bar-fill');
  if (!wrap || !fill) return;

  let hoverTimer;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.width = pct + '%';

    // Show on scroll, hide after idle
    wrap.classList.add('visible');
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      if (!wrap.matches(':hover')) wrap.classList.remove('visible');
    }, 1800);
  }

  wrap.addEventListener('mouseenter', () => wrap.classList.add('visible'));
  wrap.addEventListener('mouseleave', () => {
    hoverTimer = setTimeout(() => wrap.classList.remove('visible'), 600);
  });

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// ── SIDEBAR ───────────────────────────────────────
(function () {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const main = document.querySelector('.training-main');
  if (!sidebar || !toggle) return;

  let open = false;

  function setSidebar(state) {
    open = state;
    sidebar.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    if (main) main.classList.toggle('sidebar-open', open);
    toggle.setAttribute('aria-expanded', open);
  }

  toggle.addEventListener('click', () => setSidebar(!open));

  // Auto-open on desktop
  if (window.innerWidth >= 1100) setSidebar(true);

  // Active section tracking
  const sections = document.querySelectorAll('.content-section[data-id]');
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-target]');

  if (sections.length && navItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.id;
          navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.target === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  // Smooth scroll on nav click
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('[data-id="' + item.dataset.target + '"]');
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // On mobile, close sidebar after click
      if (window.innerWidth < 1100) setSidebar(false);
    });
  });
})();
