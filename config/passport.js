const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User, Account } = require('../models')
const bcryptjs = require('bcryptjs')
const { use } = require('chai')

module.exports = app => {
  // 初始化模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, cb) => {
    // console.log(666)
    // console.log(User)
    User.findOne({
      where: { email },
      raw: true
    })
      .then(user => {
        // console.log('user=', user)
        if (!user) {
          return cb(null, false, { message: 'That email is not registered!' })
        }
        return bcryptjs.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return cb(null, false, { message: "Email or Pw incorrect" })
            }
            // 如果信箱未驗證 跳出驗證提示
            console.log('c==============================', user)
            if (!user.mailIsVerified) {
              console.log('d==============================')
              return cb(null, false, { message: "Email not yet verified." })
            }
            return cb(null, user)
          })
      })
      .catch(err => cb(err, false))
  }))
  // 序列化與反序列化
  passport.serializeUser((user, cb) => {
    // console.log(666)
    cb(null, user.id)
  })
  passport.deserializeUser((id, cb) => {
    // console.log(666)
    User.findByPk(id, {
      include: [{
        model: Account, as: 'CartAccounts'
      }]
    })
      // lean是mongodb ; toJSON是 sequelize
      .then(user => user ? cb(null, user.toJSON()) : cb(null, null))
      .catch(err => cb(err, null))
  })

}