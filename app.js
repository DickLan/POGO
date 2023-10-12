const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = 3001
const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helper')
const methodOverride = require('method-override')

const session = require('express-session')
const usePassport = require('./config/passport')
const { getUser } = require('./helpers/auth-helper')
const flash = require('connect-flash')

// require('./associations')
const en = require('./locales/en-US.json')
const zh = require('./locales/zh-TW.json')
// 改變顯示語言
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// helpers ssss別忘
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
// 載入 passport 設定檔，要在express-session 之後
// 呼叫 passport 函式並傳入app 要寫在路由之前
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  // req.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = getUser(req)
  // for search level 1~50
  res.locals.options = Array.from(Array(50).keys()).map(i => i + 1)
  // 增加全局語言包
  const reqLang = req.cookies.lang || req.acceptsLanguages('zh-TW', 'en-US') || 'en-US'
  if (reqLang === 'en-US') {
    res.locals.lang = en
  } else if (reqLang === 'zh-TW') {
    res.locals.lang = zh
  }

  next()
})

app.use(routes)

app.listen(port, () => {
  console.log('listening now')
})
