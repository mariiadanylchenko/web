function setupCarousels() {
  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach((carousel) => {
    const rail = carousel.querySelector('[data-rail]');
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const step = 260;

    if (!rail) return;

    const scrollBy = (dir) => {
      rail.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    prev?.addEventListener('click', () => scrollBy(-1));
    next?.addEventListener('click', () => scrollBy(1));

  });
}

function init() {
  setupCarousels();
}

document.addEventListener('DOMContentLoaded', init);
