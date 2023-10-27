const { raw } = require('express')
const { User, Cart, Account, Message, Sequelize, sequelize } = require('../models')
const bcryptjs = require('bcryptjs')

const userController = {

  // login & register
  getLogin: (req, res, next) => {
    console.log(req.cookies.lang)
    res.render('users/login')
  },
  postLogin: (req, res, next) => {
    req.flash('success_msg', 'success login')
    res.redirect('/accounts')
  },

  getRegister: (req, res, next) => {
    res.render('users/register')
  },
  postRegister: (req, res, next) => {
    // console.log(req.body)
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
        if (user) throw new Error('this email already exist')
        return bcryptjs.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          errors,
          name,
          email,
          password: hash,
          confirmPassword
        })
      })
      .then(() => {
        // console.log(77777)
        req.flash('success_msg', '成功註冊帳號！')
        res.redirect('/login')
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
        req.flash('success_msg', 'added to cart!')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  // remove one cart item once
  removeCartItem: (req, res, next) => {
    const cartItemId = req.params.id
    // 從 db Cart 尋找 是否有 accountId = req.params傳來的id相符
    Cart.findOne({ where: { accountId: cartItemId } })
      .then(cartItem => {
        if (!cartItem) throw new Error('no this Item')
        return cartItem.destroy()
      })
      .then(() => {
        req.flash('success_msg', 'Cancel added!')
        res.redirect('back')
      })
      .catch(err => next(err))
  }
  ,
  // 進入購物車
  getCart: (req, res, next) => {

    const userId = req.user.id
    let data = req.user.CartAccounts
    // console.log('================')
    // console.log(data)
    res.render('users/cart', { cartItems: data })
  },
  getMessages: async (req, res, next) => {
    // res.locals.user 是給 view 使用的，在這裡若要使用user
    // 需要從 passport 裡面調用 => req.user
    const user = req.user || null
    // console.log('getMessages user=============', user);
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const messages = await Message.findAll({
        where: {
          [Sequelize.Op.or]: [
            { senderId: user.id, receiverId: 1 },
            { senderId: 1, receiverId: user.id }
          ]
        },
        order: [['createdAt', 'ASC']]
      })
      // console.log('Getmessages=============', messages)
      return res.json(messages)
    } catch (error) {
      console.log(error)
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
      console.log(error)
    }

  })




}
module.exports = userController