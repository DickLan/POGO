const express = require('express')
const router = express.Router()
const accountController = require('../../controllers/account-controller')
const userController = require('../../controllers/user-controller')
const passport = require('passport');
const { authenticated } = require('../../middleware/auth')

// ========= account ==========
// 測試用 之後要刪
router.get('/accounts/detailTemp', accountController.getDetail)

// 下兩行也可以寫成 
router.get('/accounts/:id', accountController.getAccount)
router.get('/accounts/:id/Legend', accountController.getAccount)

router.get('/accounts', accountController.getAccounts)

// ========= user ==========
// cart
router.get('/cart', authenticated, userController.getCart)
router.post('/cart/:id', authenticated, userController.postCart)

// auth
router.get('/login', userController.getLogin)
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login', failureFlash: true
}), userController.postLogin)

router.get('/logout', authenticated, (req, res) => {
  req.logout()
  req.flash('success_msg', 'success logout ^_^')
  res.redirect('/login')
})


router.get('/register', userController.getRegister)
router.post('/register', userController.postRegister)



// router.get('/accounts', (req, res) => {
//   res.render('admin/accounts')
// })
router.get('/search', (req, res) => {
  res.render('admin/search')
})
router.get('/contact', (req, res) => {
  res.render('admin/contact')
})

router.get('/', (req, res) => {
  res.render('index')
})
module.exports = router




