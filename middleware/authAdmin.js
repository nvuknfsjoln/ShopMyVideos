// middleware/authAdmin.js

const requireAdminAuth = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
};

module.exports = { requireAdminAuth };
