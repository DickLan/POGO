const express = require('express')
const router = express.Router()
const accountController = require('../../controllers/account-controller')

router.use('/accounts/detailTemp', accountController.getAccount)
router.use('/accounts/:id', accountController.getAccount)
router.use('/accounts', accountController.getAccounts)

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