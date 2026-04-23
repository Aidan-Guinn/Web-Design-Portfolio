AOS.init({
  duration: 650,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
});

const HERO_DELAYS = {
  h0: 150,
  h1: 320,
  h2: 480,
  h3: 640,
  h4: 780,
  h5: 500,
};

function animateHero() {
  const el = (sel) => document.querySelector(sel);

  setTimeout(() => el('.js-h0')?.classList.add('is-vis'),   HERO_DELAYS.h0);
  setTimeout(() => el('.js-h1')?.classList.add('is-vis'),   HERO_DELAYS.h1);
  setTimeout(() => el('.js-h2')?.classList.add('is-vis'),   HERO_DELAYS.h2);
  setTimeout(() => el('.js-h3')?.classList.add('is-vis'),   HERO_DELAYS.h3);
  setTimeout(() => el('.js-h4')?.classList.add('is-vis'),   HERO_DELAYS.h4);
  setTimeout(() => el('.js-h5')?.classList.add('is-vis'),   HERO_DELAYS.h5);
}

// Solid nav on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 40
    ? 'rgba(8, 8, 15, 0.97)'
    : 'rgba(8, 8, 15, 0.85)';
}, { passive: true });

document.fonts.ready.then(animateHero);
