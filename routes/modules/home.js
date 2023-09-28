const express = require('express')
const router = express.Router()





router.get('/accounts',(req,res)=>{
  res.render('admin/accounts')
})
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