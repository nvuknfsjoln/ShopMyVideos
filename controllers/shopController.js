// controllers/shopController.js

// Dummy-Daten – später durch Datenbank ersetzen
const videos = [
  { id: '1', title: 'Funny Cats Compilation', price: 9.99 },
  { id: '2', title: 'DIY Home Projects', price: 12.49 },
  { id: '3', title: 'Top 10 Travel Destinations', price: 14.99 },
];

// Startseite
exports.getHome = (req, res) => {
  res.render('shop/home', {
    title: 'ShopMyVideos – Deine Videoplattform',
  });
};

// Alle Videos anzeigen
exports.getAllVideos = (req, res) => {
  res.render('shop/videos', {
    title: 'Alle Videos',
    videos,
  });
};

// Einzelnes Video anzeigen
exports.getVideoById = (req, res) => {
  const video = videos.find(v => v.id === req.params.id);
  if (!video) {
    return res.status(404).send('Video nicht gefunden');
  }
  res.render('shop/video-detail', {
    title: video.title,
    video,
  });
};
