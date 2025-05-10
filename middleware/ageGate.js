const ageGate = (req, res, next) => {
  const user = req.user; // Der Benutzer muss im Request-Objekt verfügbar sein (durch Auth Middleware)

  if (!user || !user.age || user.age < 18) {
    return res.status(403).json({ message: 'Access Denied: Age Restriction' });
  }

  next();
};

module.exports = ageGate;
