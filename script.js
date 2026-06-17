// ── Typing effect ──
const roles = [
  'Python Developer 🐍',
  'Machine Learning Enthusiast 🤖',
  'Flask & Django Developer 🌐',
  'AWS Cloud Practitioner ☁️',
  'Problem Solver 🚀'
];

let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = roles[roleIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  if (!isDeleting && charIndex === current.length + 1) {
    setTimeout(() => isDeleting = true, 1800);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(type, isDeleting ? 60 : 100);
}
type();

// ── Particle canvas ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 80;
const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.5,
  dx: (Math.random() - 0.5) * 0.4,
  dy: (Math.random() - 0.5) * 0.4,
  alpha: Math.random() * 0.5 + 0.2
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const color = isDark ? '168,85,247' : '124,58,237';

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color},${p.alpha})`;
    ctx.fill();
  });

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', next);
});

// ── Mobile menu ──
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ── Active nav on scroll ──
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${section.id}`) a.classList.add('active');
      });
    }
  });

  // Back to top
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);
});

document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Fade-in on scroll ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.about-card, .skill-item, .project-card, .contact-card, .stats-grid img, .timeline-card, .skill-category')
  .forEach(el => { el.classList.add('fade-in'); observer.observe(el); });

// ── Skill bar animation ──
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));
