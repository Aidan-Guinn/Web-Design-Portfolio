/* ═══════════════════════════════════════════════════════════
   TextScramble — DOM-based, no innerHTML
═══════════════════════════════════════════════════════════ */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}=+*^?#▓▒░█';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const promise = new Promise(res => (this.resolve = res));
    this.queue = newText.split('').map((to, i) => ({
      to,
      start: Math.floor(Math.random() * 10),
      end:   (Math.floor(Math.random() * 14) + 10 + i * 1.5) | 0,
      char:  '',
    }));
    cancelAnimationFrame(this.frameReq);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    this.el.textContent = '';
    let done = 0;

    for (const item of this.queue) {
      const { to, start, end } = item;
      const span = document.createElement('span');

      if (this.frame >= end) {
        done++;
        if (to === '.') span.className = 'hero__period';
        span.textContent = to;
      } else if (this.frame >= start) {
        if (!item.char || Math.random() < 0.3) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        span.style.color = 'var(--muted)';
        span.textContent = item.char;
      } else {
        span.style.opacity = '0';
        span.textContent = to;
      }

      this.el.appendChild(span);
    }

    if (done === this.queue.length) {
      this.resolve();
    } else {
      this.frameReq = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   Cursor glow — smooth lag follow
═══════════════════════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursor-glow');
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let cx = mx, cy = my;

if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  (function moveCursor() {
    cx += (mx - cx) * 0.085;
    cy += (my - cy) * 0.085;
    cursorGlow.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(moveCursor);
  })();

  document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });
}

/* ═══════════════════════════════════════════════════════════
   Magnetic buttons
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.js-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 0.35;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 0.35;
    btn.style.transform = `translate(${x * r.width}px, ${y * r.height}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.5s var(--ease-out), box-shadow 0.2s, background 0.2s, border-color 0.2s';
    btn.style.transform = '';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});

/* ═══════════════════════════════════════════════════════════
   3D tilt on project mock browsers
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.js-tilt-proj').forEach(proj => {
  const target = proj.querySelector('.js-tilt-target');
  if (!target) return;

  proj.addEventListener('mousemove', e => {
    const r = proj.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    target.style.transition = 'none';
    target.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 6}deg) scale(1.03) translateY(-5px)`;
  });

  proj.addEventListener('mouseleave', () => {
    target.style.transition = 'transform 0.7s var(--ease-out)';
    target.style.transform = '';
  });
});

/* ═══════════════════════════════════════════════════════════
   Count-up on scroll into view
═══════════════════════════════════════════════════════════ */
function countUp(el, target, duration = 1300) {
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(start);
}

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target, parseInt(e.target.dataset.target, 10));
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.js-count').forEach(el => countObserver.observe(el));

/* ═══════════════════════════════════════════════════════════
   Scroll reveals
═══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || '0', 10);
      setTimeout(() => e.target.classList.add('is-vis'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.js-reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════════
   Hero entry
═══════════════════════════════════════════════════════════ */
function initHero() {
  document.querySelectorAll('.js-fade').forEach(el => {
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('is-vis'), delay);
  });

  const line1 = document.getElementById('scramble-1');
  const line2 = document.getElementById('scramble-2');
  if (!line1 || !line2) return;

  setTimeout(() => {
    line1.classList.add('is-vis');
    new TextScramble(line1).setText('AIDAN');
  }, 500);

  setTimeout(() => {
    line2.classList.add('is-vis');
    new TextScramble(line2).setText('GUINN.');
  }, 720);
}

/* ═══════════════════════════════════════════════════════════
   Nav solidify on scroll
═══════════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('nav--solid', window.scrollY > 40);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   Boot
═══════════════════════════════════════════════════════════ */
document.fonts.ready.then(initHero);
