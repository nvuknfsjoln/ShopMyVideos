// Middleware, die sicherstellt, dass der Creator eingeloggt ist
module.exports.requireCreatorAuth = (req, res, next) => {
  // Überprüfen, ob der Creator in der Session vorhanden ist
  if (req.session && req.session.creatorId) {
    // Wenn der Creator eingeloggt ist, fahre mit der Anfrage fort
    return next();
  } else {
    // Falls nicht eingeloggt, Weiterleitung zur Login-Seite
    return res.redirect('/creator/login');
  }
};
