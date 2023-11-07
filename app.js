const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
// if (process.env.NODE_ENV !== 'production') {
// 打算讓生產環境也用相同的 env 所以不特別設條件
require('dotenv').config()
// }
const port = 3001
const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helper')
const methodOverride = require('method-override')

const session = require('express-session')
// session to mysql
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { sequelize } = require('./models/')


const usePassport = require('./config/passport')
const { getUser } = require('./helpers/auth-helper')
const flash = require('connect-flash')

// require('./associations')
const en = require('./locales/en-US.json')
const zh = require('./locales/zh-TW.json')
// counters
const { getMessages } = require('./controllers/user-controller')

// socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);  // 將 app 作為參數傳入

// socket
const initializeSocket = require('./sockets/namespaceSockets')
const io = new Server(httpServer, { /* options */ });
initializeSocket(io)

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
  store: new SequelizeStore({
    db: sequelize,//使用之前已配置好的 sequelize 實例
  }),
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
  res.locals.choosenLang = reqLang || 'zh-TW'
  // console.log('req.lang', req.choosenLang)
  if (reqLang === 'en-US') {
    res.locals.lang = en
  } else if (reqLang === 'zh-TW') {
    res.locals.lang = zh
  }
  // 
  // console.log(req.path)
  // console.log('headers', req.headrs)

  next()
})

app.use(routes)

// 確保了在服務器開始接收請求之前，所有的數據庫表都已經準備好了
sequelize.sync({ force: false }) // 預設為 false ： 若表已存在，就不會覆蓋，不會新建表，會用舊的表． 若表不存在，就創立新的表
  // 這裡指的是 在 db 建立表，沒事不要開 true，會把資料都清空
  .then(() => {
    console.log('Session table created')
    httpServer.listen(port, () => {
      console.log('listening now')
    })
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });


