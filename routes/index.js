const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const { generalErrorHandler } = require('../middleware/error-handler')


router.use('/', home)
router.use('/', generalErrorHandler)

module.exports = router
