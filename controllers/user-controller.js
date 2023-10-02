const { User } = require('../models')
const bcryptjs = require('bcryptjs')

const userController = {
  // cart
  getCart: (req, res, next) => {
    res.render('users/cart')
  },
  // login & register
  getLogin: (req, res, next) => {
    res.render('users/login')
  },
  postLogin: (req, res, next) => {

  },

  getRegister: (req, res, next) => {
    res.render('users/register')
  },
  postRegister: (req, res, next) => {
    console.log(req.body)
    const { name, email, password, confirmPassword } = req.body
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('this email already exist')
        return bcryptjs.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          email,
          password,
          confirmPassword
        })
      })
      .then(() => {
        return res.redirect('/login')
      })
      .catch(err => next(err))
  }





}
module.exports = userController