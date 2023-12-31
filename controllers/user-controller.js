const { raw } = require('express')
const { User, Cart, Account, Message, Sequelize, sequelize } = require('../models')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const emailService = require('../public/js/emailService')
const { use } = require('chai')
// c:英文名稱字串
const c = require('../pokeNamesEng')
// d:英文名稱陣列
const pokeNames = c.split('\n')
// console.log('d=', d)

const userController = {

  // login & register
  getLogin: (req, res, next) => {
    // console.log(req.cookies.lang)
    const errors_login = req.flash('error');
    console.log('err==get==========', errors_login)
    const randomIndex = Math.floor(Math.random() * 916 + 1)
    const pokeName = pokeNames[randomIndex]
    res.render('users/login', { pokeName, errors_login })
  },
  postLogin: (req, res, next) => {
    // const rememberMe = req.body['remember-me']
    // console.log(req.body)
    // console.log('rememberMe=========', rememberMe)
    // console.log('req.session=========', req.session)
    // console.log('req.user=========', req.user.id)

    // // 如果登入時有勾選 rememberMe
    // if (rememberMe === '1') {
    //   const oneWeek = 7 * 24 * 3600 * 1000; // cookie 的有效期，這裡設定為一週
    //   userId = req.user.id
    //   // secure for https, httpOnly for http
    //   res.cookis('rememberMe', userId, { maxAge: oneWeek, httpOnly: true, secure: true })
    // }

    const errors = req.flash('error');
    console.log('err==post==========', errors)
    // 錯誤處理
    if (errors.length > 0) {
      console.log('Login errors:', errors);
      res.render('login', { errors }); // 把錯誤傳給視圖
    } else {
      req.flash('success_msg', 'Success login');
      req.session.save(err => {
        res.redirect('/accounts')
      })
    }
  },

  getRegister: (req, res, next) => {
    res.render('users/register')
  },
  postRegister: (req, res, next) => {
    // // console.log(req.body)
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'password not same.' })
    }

    if (errors.length) {
      return res.render('users/register', { errors, name, email, password, confirmPassword })
    }
    User.findOne({ where: { email } })
      .then(user => {

        // 如果找到用戶，並且郵箱已經驗證，拋出錯誤
        if (user && user.mailIsVerified) {
          throw new Error('This email is already registered and verified.');
        }
        // 如果找到用戶，但郵箱未驗證，拋出錯誤
        if (user && !user.mailIsVerified) {
          throw new Error('This account is already registered but not verified, please check your email to verify your account.');
        }
        // 如果沒有找到用戶，則繼續執行密碼加密
        return bcryptjs.hash(password, 10)
      })
      .then(hash => {
        const verifyMailToken = crypto.randomBytes(20).toString('hex')
        const verifyMailExpires = Date.now() + 36000000
        // token 有效期限 10 小時 
        return User.create({
          errors,
          name,
          email,
          password: hash,
          confirmPassword,
          mailIsVerified: false, // 預設信箱未驗證，需要點擊信箱連結才會 true
          verifyMailToken,
          verifyMailExpires: verifyMailExpires
        })
      })
      .then((user) => {
        return emailService.sendVerifyEmail(user)
      })
      .then(() => {
        // // console.log(77777)
        req.flash('success_msg', `Verification email sent. Please click the verification link in your inbox within one hour to complete the verification.
        已發送驗證信件，請於一小時內點擊信箱驗證連結，以完成驗證^_^`)
        // 確保 flash 已經存到 session，才重新導向
        req.session.save(err => {
          if (err) return next(err)
          res.redirect('/users/login')
        })

      })
      .catch(err => next(err))
  },
  // 新增購物車的項目
  addCartItem: (req, res, next) => {
    const accountId = req.params.id
    const userId = req.user.id
    Promise.all([
      Account.findByPk(accountId),
      Cart.findOne({ where: { userId, accountId } })
    ])
      .then(([account, cart]) => {
        if (!account) throw new Error('no this POGO account')
        if (cart) throw new Error('this already added in cart')

        return Cart.create({
          accountId,
          userId
        })
      })
      .then(() => {
        req.flash('success_msg', 'Added to cart.')
        req.session.save(err => {
          res.redirect(`/accounts?accountId=${accountId}`)
        })
      })
      .catch(err => next(err))
  },
  // remove one cart item once
  removeCartItem: (req, res, next) => {
    // 這裡的id是account's id 0123456，而不是Y01這種id
    const accountId = req.params.id
    // 從 db Cart 尋找 是否有 accountId = req.params傳來的id相符
    Cart.findOne({ where: { accountId } })
      .then(cartItem => {
        if (!cartItem) throw new Error('no this Item')
        return cartItem.destroy()
      })
      .then(() => {
        req.flash('success_msg', 'Cancel added!')
        req.session.save(err => {
          res.redirect(`/accounts?accountId=${accountId}`)
        })
      })
      .catch(err => next(err))
  }
  ,
  // 進入購物車
  getCart: (req, res, next) => {

    const userId = req.user.id
    let data = req.user.CartAccounts
    // // console.log('================')
    // // console.log(data)
    res.render('users/cart', { cartItems: data })
  },
  getMessages: async (req, res, next) => {
    // res.locals.user 是給 view 使用的，在這裡若要使用user
    // 需要從 passport 裡面調用 => req.user
    const user = req.user || null
    // console.log('user:', user);

    // // console.log('getMessages user=============', user);
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // // console.log('============1=============')
    try {
      // // console.log('============2=============')
      const messages = await Message.findAll({
        where: {
          [Sequelize.Op.or]: [
            { senderId: user.id, receiverId: 1 },
            { senderId: 1, receiverId: user.id }
          ]
        },
        order: [['createdAt', 'ASC']]
      })
      // check 該 user 有多少 unReadMsg
      // console.log('============3=============')
      const unReadCounts = await Message.count({
        where: {
          isReadUser: false,
          [Sequelize.Op.or]: [
            { senderId: 1 },
            { receiverId: user.id }
          ]
        }
      })
      // console.log('============4=============')
      // console.log('controller unReadCounts', unReadCounts)
      // // console.log('Getmessages=============', messages)
      return res.json({ messages, unReadCounts })
    } catch (error) {
      // console.log(error)
      return res.status(500).json({ error: 'Error load messages' })
    }
  },
  // 給 admin message member list 使用的
  getUsers: (async (req, res, next) => {
    try {
      const userIds = await Message.findAll({
        attributes: ['userId'], // 只選取該屬性
        group: ['userId'], // 進行分組，確保每個用戶只被計算一次
        having: sequelize.where(sequelize.fn('COUNT', sequelize.col('message')), '>', 0) //僅選擇消息數量大於０的用戶
      })

      const usersWithMsg = await User.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: userIds.map(user => user.userId)
            // in 用來查詢 id是否符合任何map到的userId
          }
        },
        include: [{
          model: Message,
          seperate: true, // 使子查詢成立，才可以分別獲取每個用戶的最新訊息
          order: [['created_at', 'DESC']],
          limit: 1
        }]
      })
      return res.json(usersWithMsg)
    } catch (error) {
      // console.log(error)
    }

  }),
  postAsRead: async (req, res, next) => {
    const user = req.user
    try {
      await Message.update(
        { isReadUser: true },
        {
          where: {
            isReadUser: false,
            [Sequelize.Op.or]: [
              { senderId: 1 },
              { receiverId: user.id }
            ]
          }
        })
      res.status(200).send('Updated successfully');
    } catch (error) {
      // console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
  getForgotPassword: (req, res) => {
    res.render('users/forgotPassword')
  },
  postForgotPassword: (req, res) => {
    console.log(req.body)
    const { userName, email } = req.body

    User.findOne({ where: { email, name: userName } })
      .then(user => {
        // 1 處理用戶不存在，或是名稱與信箱不完全正確的情況
        if (!user) {
          console.log('no this user or email')
        }
        // 2 生成 reset TOKEN and ExpireTime
        console.log('2 生成 reset TOKEN and ExpireTime')
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenExpiry = Date.now() + 3600000 // token 有效期限 1 小時
        console.log('resetToken', resetToken)
        // 3 將 token 和有效期存儲到用戶記錄中
        return user.update({
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        })
      })
      .then(user => {
        // 4 發送郵件給用戶 包含重置密碼連結
        return emailService.sendResetPasswordEmail(user)

        // 先用假傳送
        // console.log('user=======', user)
        // console.log('Pretend to send email to:', user.email, 'with token:', user.resetPasswordToken);
        // return Promise.resolve({
        //   message: "Fake email sent success",
        //   resetToken: user.resetPasswordToken
        // });
      })
      .then(info => {
        console.log('Reset password email sent', info)
        res.status(200).send('A pw reset eamil has been sent')
      })
      .catch(error => {
        console.error('Error sending reset password email:', error);
        res.status(500).send('An error occurred while sending password reset email.')
      })
  },


  // 從信箱點擊 重設連結時 呈現的畫面
  getResetPassword: (req, res, next) => {
    const { id, token, name } = req.query
    User.findOne({ where: { id, resetPasswordToken: token } })
      .then(user => {
        if (!user) {
          req.flash('error_msg', 'Reset token not valid or expired already')
          return res.send('Reset token not valid or expired already')
        }
        console.log('req.query', req.query)
        return res.render('users/resetPassword', { id, token, name })
      })
      .catch(err => next(err))
  },
  postResetPassword: (req, res, next) => {
    const { id, token, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Password and Confirm Password is not match');
      return res.redirect('back'); // 或者是指定的URL
    }
    let resetUser
    User.findOne({ where: { id, resetPasswordToken: token } })
      .then(user => {
        if (!user) {
          req.flash('error_msg', 'Reset token not valid or expired already')
          throw new Error('Not allow to reset password')
        }
        console.log('user=======', user)
        resetUser = user
        return bcryptjs.hash(password, 10)
      })
      .then(hash => {
        return resetUser.update({
          password: hash,
          resetPasswordToken: null, // 清除 token
          resetTokenExpiry: null
        })
      })
      .then(() => {
        // // console.log(77777)
        req.flash('success_msg', 'Password changed successfully.')
        res.redirect('/users/login')
      })
      .catch(err => next(err))


  },
  getVerifyMail: (req, res, next) => {
    const { id, token } = req.query
    User.findOne({ where: { id, verifyMailToken: token } })
      .then(user => {
        if (!user) {

          req.flash('error_msg', 'Verify Mail token not valid or token expired already  ')
          console.log('warning_msg', '沒有成功驗證信箱！')
          throw new Error('Not allow to Verify Mail')
        }
        user.update({
          mailIsVerified: true
          // 正式上線時 要清空 token
        })
      })
      .then(() => {
        // // console.log(77777)
        console.log('success_msg', 'Email verified successfully.')
        req.flash('success_msg', 'Email verified successfully.')
        // 確保 flash 已經存到 session，才重新導向
        req.session.save(err => {
          if (err) return next(err)
          res.redirect('/users/login')
        })

      })
      .catch(err => next(err))

  }

}

module.exports = userController