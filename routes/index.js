const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticatedAdmin } = require('../middleware/auth')

router.use('/admin', authenticatedAdmin, admin)
router.use('/', home)
router.use('/', generalErrorHandler)

module.exports = router
