// middleware/authAdmin.js

module.exports.requireAdminAuth = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.redirect('/creator/login'); // absichtlich creator-login
};
