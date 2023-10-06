const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.put('/accounts/:id', adminController.putAccount)
router.delete('/accounts/:id', adminController.deleteAccount)
router.get('/accounts', adminController.getAccounts)
router.post('/accounts',adminController.postAccount)

module.exports = router