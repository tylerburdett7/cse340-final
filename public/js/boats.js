
// had AI help me out with multiple images on a listing and the carousel

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('boat-modal');
  if (!modal) return;

  const modalImage = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('.modal-title');
  const modalMeta = modal.querySelector('.modal-meta');
  const modalDesc = modal.querySelector('.modal-description');
  const dotsNav = modal.querySelector('.carousel-nav');
  const closeBtn = modal.querySelector('.close');
  const leftArrow = modal.querySelector('.carousel-prev');
  const rightArrow = modal.querySelector('.carousel-next');

  let currentImages = [];
  let currentIndex = 0;

  function currency(val) {
    const n = Number(val);
    if (Number.isFinite(n)) return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return 'N/A';
  }

  function openModalForCard(card) {
    const title = card.dataset.title || 'Boat';
    const year = card.dataset.year || 'N/A';
    const price = currency(card.dataset.price);
    const condition = card.dataset.condition || 'N/A';
    const desc = card.dataset.description || '';
    try {
      currentImages = JSON.parse(card.dataset.images || '[]');
    } catch (_) {
      currentImages = [];
    }
    currentIndex = 0;

    modalTitle.textContent = title;
    modalMeta.innerHTML = `<strong>Condition:</strong> ${condition} • <strong>Year:</strong> ${year} • <strong>Price:</strong> ${price}`;
    modalDesc.textContent = desc;

    renderImage();
    renderDots();

    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderImage() {
    const url = currentImages.length ? currentImages[currentIndex].image_url : '';
    modalImage.src = url || '';
    modalImage.alt = url ? 'Boat image' : 'No image';
    const showArrows = currentImages.length > 1;
    leftArrow.style.display = showArrows ? 'block' : 'none';
    rightArrow.style.display = showArrows ? 'block' : 'none';
  }

  function renderDots() {
    dotsNav.innerHTML = '';
    if (currentImages.length <= 1) return;
    currentImages.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => {
        currentIndex = i;
        renderImage();
        renderDots();
      });
      dotsNav.appendChild(dot);
    });
  }

  function nextImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    renderImage();
    renderDots();
  }

  function prevImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    renderImage();
    renderDots();
  }

  document.querySelectorAll('.boat-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const openTrigger = e.target.closest('[data-action="open-modal"]');
      if (openTrigger || e.currentTarget === card) {
        openModalForCard(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  rightArrow.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  leftArrow.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  document.addEventListener('keydown', (e) => {
    if (modal.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
});
