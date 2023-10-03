const { ensureAuthenticated, getUser } = require('../helpers/auth-helper')
const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  req.flash('warning_msg', 'please log in first ^_^')
  res.redirect('/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  }
  req.flash('warning_msg', 'please log in first ^_^')
  res.redirect('/login')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}