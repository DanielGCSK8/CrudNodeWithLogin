function isAdmin(req, res, next) {
    if (req.session.loggedin == true) {
      next();
    } else {
        res.redirect('/');
    }
  }