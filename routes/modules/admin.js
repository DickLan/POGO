const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/accounts', adminController.getAccounts)

module.exports = router