const { Account } = require('../models')

const accountController = {
  getAccounts: (req, res, next) => {
    Account.findAll({ raw: true })
      .then(accts => {
        return res.render('accounts', { accts })
      })
  }
}

module.exports = accountController