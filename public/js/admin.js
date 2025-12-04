document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('imageInputsContainer');
  const addBtn = document.querySelector('.btn-add-more-images');

  function addImageInput() {
    const newRow = document.createElement('div');
    newRow.className = 'image-input-row';
    newRow.innerHTML = `
      <input type="url" name="image_urls" placeholder="https://example.com/image.jpg" class="image-url-input">
      <button type="button" class="btn-remove-image">Remove</button>
    `;
    container.appendChild(newRow);
  }

  function removeImageInput(button) {
    const row = button.closest('.image-input-row');
    if (row) row.remove();
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => addImageInput());
  }

  container?.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList.contains('btn-remove-image')) {
      removeImageInput(target);
    }
  });
});
