const { raw } = require('express')
const { User, Cart, Account, Message, Sequelize } = require('../models')
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
      console.log('Getmessages=============', messages)
      return res.json(messages)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Error load messages' })
    }
  }




}
module.exports = userController