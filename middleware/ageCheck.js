module.exports = function (req, res, next) {
  // Wenn das Alter bereits in der Session gespeichert ist, weitermachen
  if (req.session && req.session.isAdult) {
    return next();
  }

  // Prüfen, ob das Alter im POST-Body mitgesendet wurde
  const age = parseInt(req.body.age, 10);

  if (!isNaN(age)) {
    if (age >= 18) {
      // In Session speichern, dass der Nutzer volljährig ist
      req.session.isAdult = true;
      return next();
    } else {
      return res.status(403).send('Zugriff verweigert: Mindestalter 18 Jahre.');
    }
  }

  // Wenn kein Alter übergeben wurde und nichts in der Session ist: Weiterleitung zur Altersabfrage
  res.redirect('/age-check');
};
