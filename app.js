document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fluid blob parallax — reacts across the whole page
  if (!reduceMotion) {
    const blobField = document.querySelector('.blob-field');
    if (blobField) {
      const wraps = [...blobField.querySelectorAll('.blob-wrap')];
      let tx = 0, ty = 0, cx = 0, cy = 0;
      window.addEventListener('pointermove', (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 90;
        ty = (e.clientY / window.innerHeight - 0.5) * 90;
      });
      const tick = () => {
        cx += (tx - cx) * 0.1;
        cy += (ty - cy) * 0.1;
        wraps.forEach(w => {
          const depth = parseFloat(w.dataset.depth || '1');
          w.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
        });
        requestAnimationFrame(tick);
      };
      tick();
    }

    // Cursor spotlight
    const glow = document.getElementById('cursorGlow');
    if (glow && !('ontouchstart' in window)) {
      window.addEventListener('pointermove', (e) => {
        glow.style.transform = `translate(${e.clientX - 230}px, ${e.clientY - 230}px)`;
      });
    } else if (glow) {
      glow.style.display = 'none';
    }

    // Click ripple on buttons
    document.querySelectorAll('.btn').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', (e) => {
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = (e.clientX - r.left) + 'px';
        ripple.style.top = (e.clientY - r.top) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
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
