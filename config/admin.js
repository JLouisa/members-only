module.exports = {
  isAdmin: function (req, res, next) {
    if (req.user.isAdmin) {
      return next();
    } else {
      res.redirect("/login");
    }
  },
};
