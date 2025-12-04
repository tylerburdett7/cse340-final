document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-image');
    if (!btn) return;

    const imageId = btn.getAttribute('data-image-id');
    if (!imageId) return;

    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/admin/delete-image/${imageId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert('Failed to delete image');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error deleting image');
    }
  });
});
