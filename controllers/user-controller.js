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
    req.flash('success_msg', 'success login')
    res.redirect('/')
  },

  getRegister: (req, res, next) => {
    res.render('users/register')
  },
  postRegister: (req, res, next) => {
    // console.log(req.body)
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'password not same.' })
    }

    if (errors.length) {
      return res.render('users/register', { errors, name, email, password, confirmPassword })
    }
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('this email already exist')
        return bcryptjs.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      })
      .then(() => {
        // console.log(77777)
        req.flash('success_msg', '成功註冊帳號！')
        res.redirect('/login')
      })
      .catch(err => next(err))
  }





}
module.exports = userController