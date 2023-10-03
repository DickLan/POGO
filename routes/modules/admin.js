const express = require('express')
const router = express.Router()

router.get('/accounts', (req, res, next) => {
  res.render('accounts')
})

module.exports = router