const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/accounts', adminController.getAccounts)
router.put('/accounts/:id', adminController.putAccount)

module.exports = router