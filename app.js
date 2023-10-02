const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helper')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const session = require('express-session')


// require('./associations')
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// helpers ssss別忘
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
// 載入 passport 設定檔，要在express-session 之後
const usePassport = require('./config/passport')
// 呼叫 passport 函式並傳入app 要寫在路由之前
usePassport(app)

app.use(routes)

app.listen(port, () => {
  console.log('listening now')
})