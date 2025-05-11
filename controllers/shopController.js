// Dummy-Daten – später durch Datenbank ersetzen
const videos = [
  { id: '1', title: 'Funny Cats Compilation', price: 9.99 },
  { id: '2', title: 'DIY Home Projects', price: 12.49 },
  { id: '3', title: 'Top 10 Travel Destinations', price: 14.99 },
];

// Altersabfrage (wird in routes/client/shop.js verwendet)
exports.checkAgeCookie = (req, res, next) => {
  if (!req.cookies.isAdult) {
    return res.redirect('/age-check'); // Falls kein Alterscookie gesetzt ist
  }
  next(); // Weiter zur nächsten Middleware/Route
};

// Alle Videos anzeigen
exports.loadVideos = async () => {
  // Hier könnte später eine Datenbankabfrage stattfinden
  return videos;
};

// Videos filtern
exports.filterVideos = async (filters) => {
  // Hier könnten Filter auf die Videos angewendet werden
  return videos.filter(video => {
    return (!filters.price || video.price <= filters.price);
  });
};

// Videos durchsuchen
exports.searchVideos = async (query) => {
  // Sucht Videos basierend auf dem Suchbegriff
  return videos.filter(video => video.title.toLowerCase().includes(query.toLowerCase()));
};

// Gutscheincode prüfen
exports.checkCoupon = async (code) => {
  // Dummy-Logik für Gutscheinprüfung
  if (code === 'DISCOUNT10') {
    return { success: true, discount: 10 };
  }
  return { success: false };
};
