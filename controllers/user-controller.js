

const userController = {
  // cart
  getCart: (req, res, next) => {
    res.render('users/cart')
  },
  // login & register
  getLogin: (req, res, next) => {
    res.render('users/login')
  },
  getRegister: (req, res, next) => {
    res.render('users/register')
  }


}
module.exports = userController