const { Account } = require('../models')
const accountsHelper = require('../helpers/accounts-helper')

const adminController = {
  getAccounts: (req, res, next) => {
    Account.findAll({
      raw: true,
      // nest: true
    })
      .then(accounts => {
        console.log(accounts)

        return res.render('admin/accounts', { accounts })
      })
      .catch(err => next(err))
  },
  putAccount: (req, res, next) => {
    // account在db的id (PK)
    const dbActId = req.params.id
    // load from modal form, and modal form load from previous getAccounts
    const { accountId, level, startdust, price, contentsIv100, contentsLegend } = req.body
    Account.findByPk(dbActId)
      .then(acct => {
        if (!acct) throw new Error('no this acct admin')
        console.log('===================')
        // console.log(acct)
        return Account.update({

          accountId, level, startdust, price, contentsIv100, contentsLegend
        })
      })
      .then(() => res.redirect('/admin/accounts'))
      .catch(err => next(err))
  }
}

module.exports = adminController