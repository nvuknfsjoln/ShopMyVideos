document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.querySelector('#uploadForm');
  const fileInput = document.querySelector('#videoFile');
  const statusMsg = document.querySelector('#statusMessage');

  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!fileInput.files[0]) {
        statusMsg.textContent = 'Bitte wähle eine Datei aus.';
        return;
      }

      const formData = new FormData(uploadForm);
      statusMsg.textContent = 'Wird hochgeladen...';

      try {
        const res = await fetch('/creator/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();
        statusMsg.textContent = result.success ? 'Upload erfolgreich!' : result.message;
      } catch (err) {
        console.error(err);
        statusMsg.textContent = 'Fehler beim Upload.';
      }
    });
  }

  // Weitere Interaktionen (Statistik-Update, z. B. Views oder Likes)
  const statButtons = document.querySelectorAll('.refresh-stats');
  statButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const videoId = btn.dataset.videoId;
      const res = await fetch(`/creator/stats/${videoId}`);
      const stats = await res.json();
      const target = document.querySelector(`#stats-${videoId}`);
      if (target) target.textContent = `Views: ${stats.views}, Likes: ${stats.likes}`;
    });
  });
});
