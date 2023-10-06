const { Account } = require('../models')
const accountsHelper = require('../helpers/accounts-helper')

const adminController = {
  getAccounts: (req, res, next) => {
    Account.findAll({
      raw: true,
      // nest: true
    })
      .then(accounts => {
        // console.log('accounts=',accounts)

        return res.render('admin/accounts', { accounts })
      })
      .catch(err => next(err))
  },
  putAccount: (req, res, next) => {
    // account在db的id (PK)
    const dbActId = req.params.id
    // load from modal form, and modal form load from previous getAccounts
    const { accountId, level, startdust, price, contentsIv100, contentsLegend } = req.body
    console.log('===================')
    console.log('req.body=', req.body)
    if (!accountId) throw new Error('accountId is required!')
    Account.findByPk(dbActId)
      .then(acct => {
        if (!acct) throw new Error('no this acct admin')

        return acct.update({
          accountId, level, startdust, price, contentsIv100, contentsLegend, youtube
        })
      })
      .then(() => {
        req.flash('success_msg', 'update success!')
        res.redirect('/admin/accounts')
      })
      .catch(err => next(err))
  },
  postAccount: (req, res, next) => {

    const { accountId, level, startdust, price, contentsIv100, youtube } = req.body
    let contentsLegend = req.body.contentsLegend || ('Null／無')
    console.log('============', accountId, level, price, contentsIv100)

    // 檢查項目 星砂移除 因為有時沒記錄到
    if (!accountId || !level || !price || !contentsIv100 || !contentsLegend) throw new Error('All fields is required! (except U2)')
    Account.create({
      accountId,
      level: parseInt(level),
      startdust: parseInt(startdust),
      price: parseInt(price),
      contentsIv100,
      contentsLegend,
      youtube
    })
      .then(() => res.redirect('/admin/accounts'))
      .catch(err => next(err))
  }
}

module.exports = adminController