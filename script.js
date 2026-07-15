// =============================================================
// Sticky header + mobile nav
// =============================================================
const header = document.querySelector('header');
const menu = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  header.classList.toggle('shadow', window.scrollY > 10);
});

menu.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

navbar.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navbar.classList.remove('active'));
});

// =============================================================
// Dynamic hero role text — letter-by-letter reveal
// =============================================================
const textArray = ['satellite', 'terrain', 'hydrological', 'spatial'];
let currentIndex = 0;
const dynamicTextElement = document.querySelector('.dynamic-text');

function updateText() {
  const text = textArray[currentIndex];
  dynamicTextElement.innerHTML = '';

  for (const char of text) {
    const letter = document.createElement('span');
    letter.textContent = char;
    dynamicTextElement.appendChild(letter);
  }

  dynamicTextElement.querySelectorAll('span').forEach((letter, index) => {
    letter.style.animationDelay = `${index * 0.04}s`;
  });

  currentIndex = (currentIndex + 1) % textArray.length;
}

updateText();
setInterval(updateText, 2600);

// =============================================================
// Portfolio — show more / less
// =============================================================
const toggleBtn = document.getElementById('toggle-more');
const hiddenProjects = document.querySelectorAll('.portfolio-box.hidden');

toggleBtn.addEventListener('click', () => {
  const isShowingMore = toggleBtn.dataset.state === 'more';

  hiddenProjects.forEach((project) => {
    project.style.display = isShowingMore ? 'none' : 'block';
  });

  toggleBtn.textContent = isShowingMore ? 'Show more work' : 'Show less';
  toggleBtn.dataset.state = isShowingMore ? 'less' : 'more';
});

// =============================================================
// Scroll-reveal + animated counters + skill bar fill
// (single IntersectionObserver drives all reveal-on-scroll work)
// =============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (prefersReducedMotion) {
    el.textContent = target;
    return;
  }
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    if (el.classList.contains('stat-num')) {
      animateCount(el);
    }

    if (el.classList.contains('bar')) {
      const fill = el.querySelector('.fill');
      const width = fill.dataset.width;
      requestAnimationFrame(() => { fill.style.width = `${width}%`; });
    }

    if (el.classList.contains('services-box') || el.classList.contains('portfolio-box')) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }

    obs.unobserve(el);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-num, .bar').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('.services-box, .portfolio-box').forEach((el, i) => {
  if (!prefersReducedMotion) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s var(--ease) ${(i % 6) * 0.06}s, transform 0.6s var(--ease) ${(i % 6) * 0.06}s`;
  }
  revealObserver.observe(el);
});
