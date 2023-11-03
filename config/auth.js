module.exports = {
  isAuth: function (req, res, next) {
    console.log(req.body);
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  },
};
