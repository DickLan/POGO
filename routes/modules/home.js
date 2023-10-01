const express = require('express')
const router = express.Router()
const accountController = require('../../controllers/account-controller')
const userController = require('../../controllers/user-controller')

// ========= account ==========
// 測試用 之後要刪
router.use('/accounts/detailTemp', accountController.getDetail)
router.use('/accounts/:id', accountController.getAccount)
router.use('/accounts', accountController.getAccounts)

// ========= user ==========
router.use('/cart', userController.getCart)
router.use('/login', userController.getLogin)
router.use('/register', userController.getRegister)


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