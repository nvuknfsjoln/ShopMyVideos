const roleAccess = (...roles) => {
  return (req, res, next) => {
    const user = req.user; // Der Benutzer muss im Request-Objekt verfügbar sein (durch Auth Middleware)

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access Denied: Insufficient Role' });
    }

    next();
  };
};

module.exports = roleAccess;
