const express = require('express')
const router = express.Router()
const accountController = require('../../controllers/account-controller')
const userController = require('../../controllers/user-controller')
const passport = require('passport');
const { authenticated } = require('../../middleware/auth');
const adminController = require('../../controllers/admin-controller');
const { use } = require('chai');

// ========= account ==========
// 測試用 之後要刪
// router.get('/accounts/detailTemp', accountController.getDetail)


router.post('/accounts/search', accountController.postSearchedAccounts)
router.get('/accounts/sort', accountController.getAccounts)
router.get('/accounts/:id', accountController.getAccount)
router.get('/accounts/:id/Legend', accountController.getAccount)

router.get('/accounts', adminController.postCounts, accountController.getAccounts)

// ========= user ==========
// cart
// getCart:進入Cart頁面  
router.get('/cart', authenticated, userController.getCart)
router.post('/cart/:id', authenticated, userController.addCartItem)
router.delete('/cart/:id', authenticated, userController.removeCartItem)

// messages
router.get('/messages/allUsers', userController.getUsers)
router.get('/messages/:userId', userController.getMessages)


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
//   res.render('public/accounts')
// })
// router.get('/search', (req, res) => {
//   res.render('public/search')
// })

router.get('/contact', (req, res) => {
  res.render('public/contact', { activeRoute: 'contact' })
})

router.get('/feedback', (req, res) => {
  res.render('public/feedback', { activeRoute: 'feedback' })
})


router.get('/', (req, res) => {
  res.render('index', { activeRoute: "home" })
})
module.exports = router




