// middleware/authCreator.js
module.exports = (req, res, next) => {
  if (req.session && req.session.creatorId) {
    return next();
  }
  res.redirect('/creator/login');
};
