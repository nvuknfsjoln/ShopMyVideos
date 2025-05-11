// middleware/ageCheck.js

function ageCheck(req, res, next) {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  if (user.age >= 18) {
    return next();
  } else {
    return res.status(403).send('Zugriff verweigert: Du musst mindestens 18 Jahre alt sein.');
  }
}

module.exports = ageCheck;
