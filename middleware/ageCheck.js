module.exports = function (req, res, next) {
  if (req.session && req.session.isAdult) {
    return next(); // Zugriff erlaubt
  }

  // Keine gültige Session → zur Altersabfrage weiterleiten
  res.redirect('/age-check');
};
