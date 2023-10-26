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
// counters
// socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);  // 將 app 作為參數傳入
const io = new Server(httpServer, { /* options */ });
// 新增Namespace來管理不同用戶行為
const adminNamespace = io.of('/admin')
const userNamespace = io.of('/user')
const { User, Message } = require('./models/')

// ========= admin =================
adminNamespace.on('connection', (socket) => {
  // 這裡只影響連接到 /admin的客戶端 就是adminChat page
  console.log('Admin connected');
  // 發送確認訊息
  adminNamespace.emit('message', 'Welcome admin')

  // join room
  socket.on('joinRoom', (roomId) => {
    console.log(`Admin User ${socket.id} has join the room ${roomId}`);
    socket.join(roomId)
    adminNamespace.to(roomId).emit('message', `Admin User ${socket.id} has join the room ${roomId}`)
  })

  // test room
  socket.on('message', async (data) => {
    // 收到從 client 來的訊息
    const { roomId, message, receiverId, senderId } = data

    // 將收到的 message 存到 db
    console.log('server AdminNamespace receive data=', data)
    try {
      await Message.create({
        userId: senderId,
        message, receiverId, senderId
      })
      console.log('admin message saved to db!')
    } catch (error) {
      console.log(error)
      console.error('Failed to save message to db')
    }


    // 進行處理後，將要 update view 的訊息傳回給 client 前端
    adminNamespace.to(roomId).emit('updateMyself', data)
    // admin 發的訊息 顯示在 user client 前端
    userNamespace.to(data.roomId).emit('updateAimTalker', data)
  })
})


// ========= user =================
// 如果是io.on則會對所有 非namespace的用戶作用
userNamespace.on("connection", (socket) => {
  // client send to Admin
  console.log('New user client connected');

  // join room
  socket.on('joinRoom', (roomId) => {
    console.log(`Normal User ${socket.id} has join the room ${roomId}`);
    socket.join(roomId)
    userNamespace.to(roomId).emit('message', `Normal User ${socket.id} has join the room ${roomId}`)
  })
  // 
  socket.on('message', async (data) => {
    const { roomId, message, receiverId, senderId } = data
    // 將收到的 message 存到 db
    console.log('server UserNamespace receive data=', data)
    try {
      await Message.create({
        userId: senderId,
        message, receiverId, senderId
      })
      console.log('user message saved to db!')
    } catch (error) {
      console.log(error)
      console.error('Failed to save message to db')
    }

    // 存完後，才丟回給前端 
    userNamespace.to(data.roomId).emit('updateMyself', data)
    // user 發的訊息 顯示在 admin client 前端
    adminNamespace.to(data.roomId).emit('updateAimTalker', data)




  })
});

// 改變顯示語言
const cookieParser = require('cookie-parser')
const { ro } = require('faker/lib/locales')
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

httpServer.listen(port, () => {
  console.log('listening now')
})
