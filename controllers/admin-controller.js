const { Account } = require('../models')
const accountsHelper = require('../helpers/accounts-helper')

const adminController = {
  getAccounts: (req, res, next) => {
    Account.findAll({
      raw: true,
      // nest: true
    })
      .then(accounts => {

        return res.render('admin/accounts', { accounts })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController