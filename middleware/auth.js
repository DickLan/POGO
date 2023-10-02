module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', 'please log in first ^_^')
    res.redirect('/login')
  }
}