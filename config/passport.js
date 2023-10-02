const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models')

module.exports = app => {
  // 初始化模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, cb) => {
    console.log(666)
    console.log(User)
    User.findOne({ where: { email } })
      .then(user => {
        console.log('user=', user)
        if (!user) {
          return cb(null, false, { message: 'That email is not registered!' })
        }
        if (user.password !== password) {
          return cb(null, false, { message: 'Email or Password incorrect.' })
        }
        
        return cb(null, user)
      })
      .catch(err => cb(err, false))
  }))
  // 序列化與反序列化
  passport.serializeUser((user, cb) => {
    console.log(666)
    cb(null, user.id)
  })
  passport.deserializeUser((id, cb) => {
    console.log(666)
    User.findByPk(id)
      // lean是mongodb ; toJSON是 sequelize
      .then(user => cb(null, user.toJSON()))
      .catch(err => cb(err, null))
  })

}