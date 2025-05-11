document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#searchInput');
  const videoGrid = document.querySelector('.video-grid');
  const commentToggles = document.querySelectorAll('.toggle-comments');

  // Live-Suche
  if (searchInput) {
    searchInput.addEventListener('input', async () => {
      const query = searchInput.value.trim();
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const videos = await res.json();
      updateVideoGrid(videos);
    });
  }

  // Kommentarbereich umschalten
  commentToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const commentSection = toggle.nextElementSibling;
      commentSection.classList.toggle('open');
    });
  });

  // Vorschaueffekt (optional mit Video)
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
    });
  });

  function updateVideoGrid(videos) {
    videoGrid.innerHTML = '';
    videos.forEach(video => {
      const div = document.createElement('div');
      div.className = 'video-card';
      div.innerHTML = `
        <img src="${video.thumbnail}" class="thumbnail" />
        <div class="video-title">${video.title}</div>
      `;
      videoGrid.appendChild(div);
    });
  }
});
