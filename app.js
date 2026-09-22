document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fluid blob parallax
  if (!reduceMotion) {
    const blobField = document.querySelector('.blob-field');
    const heroEl = document.querySelector('.hero');
    if (blobField && heroEl) {
      const wraps = [...blobField.querySelectorAll('.blob-wrap')];
      let tx = 0, ty = 0, cx = 0, cy = 0;
      heroEl.addEventListener('mousemove', (e) => {
        const r = heroEl.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 40;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 40;
      });
      const tick = () => {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        wraps.forEach(w => {
          const depth = parseFloat(w.dataset.depth || '1');
          w.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
        });
        requestAnimationFrame(tick);
      };
      tick();
    }
  }

  // Card tilt
  if (!reduceMotion) {
    document.querySelectorAll('.compound-card').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }
});
