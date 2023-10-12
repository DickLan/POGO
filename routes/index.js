const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticatedAdmin } = require('../middleware/auth')

router.use('/change-lang/:lang', (req, res) => {
  const lang = req.params.lang
  res.cookie('lang', lang, { maxAge: 9000000, httpOnly: true })
  res.redirect('back')
})
router.use('/admin', authenticatedAdmin, admin)
router.use('/', home)
router.use('/', generalErrorHandler)

module.exports = router
