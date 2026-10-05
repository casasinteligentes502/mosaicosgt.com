const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Hero slider inspired by the strongest cinematic treatment of the supplied references.
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const dotsWrap = document.getElementById('heroDots');
const prev = document.getElementById('heroPrev');
const next = document.getElementById('heroNext');
const progress = document.getElementById('heroProgressBar');
const titleEl = document.getElementById('heroProjectTitle');
const textEl = document.getElementById('heroProjectText');
const heroData = [
  ['Tortuga ornamental','Composición artesanal de gran formato con geometrías, color y acabado detallado.'],
  ['Piscina con delfines','Un diseño marino que convierte el fondo de la piscina en una pieza central.'],
  ['Escudo personalizado','Identidad familiar transformada en una pieza artesanal de larga duración.'],
  ['Proyecto arquitectónico','Mosaico integrado en un espacio de gran formato para crear presencia y significado.']
];
let heroIndex = 0;
let heroTimer;

function setHero(index) {
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((s,i) => s.classList.toggle('is-active', i === heroIndex));
  document.querySelectorAll('.hero-dot').forEach((d,i) => d.classList.toggle('is-active', i === heroIndex));
  if (titleEl) titleEl.textContent = heroData[heroIndex][0];
  if (textEl) textEl.textContent = heroData[heroIndex][1];
  if (progress) {
    progress.style.transition = 'none';
    progress.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      progress.style.transition = 'width 6s linear';
      progress.style.width = '100%';
    }));
  }
  clearTimeout(heroTimer);
  heroTimer = setTimeout(() => setHero(heroIndex + 1), 6000);
}

if (dotsWrap && slides.length) {
  slides.forEach((_,i) => {
    const b = document.createElement('button');
    b.className = 'hero-dot';
    b.type = 'button';
    b.setAttribute('aria-label', `Ver proyecto ${i+1}`);
    b.addEventListener('click', () => setHero(i));
    dotsWrap.appendChild(b);
  });
  prev?.addEventListener('click', () => setHero(heroIndex - 1));
  next?.addEventListener('click', () => setHero(heroIndex + 1));
  setHero(0);
}

// Portfolio filters.
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card[data-category]');
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  const filter = btn.dataset.filter;
  projects.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('is-hidden', !show);
  });
}));

// WhatsApp quote form.
const form = document.getElementById('quoteForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const lines = [
      'Hola Mosaicos GT, quisiera cotizar un proyecto de mosaico.',
      fd.get('nombre') ? `Nombre: ${fd.get('nombre')}` : '',
      fd.get('tipo') ? `Tipo de proyecto: ${fd.get('tipo')}` : '',
      fd.get('medida') ? `Medida aproximada: ${fd.get('medida')}` : '',
      fd.get('ubicacion') ? `Ciudad / zona: ${fd.get('ubicacion')}` : '',
      fd.get('mensaje') ? `Idea o detalle: ${fd.get('mensaje')}` : ''
    ].filter(Boolean);
    window.open(`https://wa.me/50240040263?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
}

// Clean full-screen lightbox: no titles, no captions, just the original image.
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCount = document.getElementById('lightboxCount');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');
const lightboxItems = Array.from(document.querySelectorAll('.js-lightbox'));
let currentGroup = [];
let currentIndex = 0;

function renderLightbox() {
  if (!currentGroup.length) return;
  const item = currentGroup[currentIndex];
  const src = item.dataset.src || item.querySelector('img')?.src;
  const alt = item.querySelector('img')?.alt || 'Fotografía de Mosaicos GT';
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCount.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
}

lightboxItems.forEach(item => item.addEventListener('click', () => {
  const group = item.dataset.group || 'all';
  currentGroup = lightboxItems.filter(x => (x.dataset.group || 'all') === group && !x.classList.contains('is-hidden'));
  currentIndex = currentGroup.indexOf(item);
  if (currentIndex < 0) currentIndex = 0;
  renderLightbox();
  lightbox.showModal();
  document.body.style.overflow = 'hidden';
}));

function closeLightbox() {
  if (!lightbox.open) return;
  lightbox.close();
  document.body.style.overflow = '';
  lightboxImg.removeAttribute('src');
}
function moveLightbox(delta) {
  if (!currentGroup.length) return;
  currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
  renderLightbox();
}
closeBtn?.addEventListener('click', closeLightbox);
prevBtn?.addEventListener('click', () => moveLightbox(-1));
nextBtn?.addEventListener('click', () => moveLightbox(1));
document.addEventListener('keydown', e => {
  if (!lightbox?.open) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') moveLightbox(-1);
  if (e.key === 'ArrowRight') moveLightbox(1);
});
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
