const { Account } = require('../models')
const accountsHelper = require('../helpers/accounts-helper')
const { ne } = require('faker/lib/locales')

const accountController = {
  getAccounts: (req, res, next) => {
    Account.findAll({
      raw: true,
      // nest: true
    })
      .then(accounts => {
        // 透過自訂的cToE 
        // 把excel的iv100寶可夢 從word字串轉成英文名稱陣列
        // 圓陸鯊／過動員／噴火龍... => [aa,bbb,ccc,]
        let data = accounts.map(act => ({
          ...act,
          // 見一個新的array 辨認圖片用
          // 只傳前９個item作為展示用 到detail時再全部顯示
          contentsIv100Array: accountsHelper.cToE(act.contentsIv100).slice(0, 9)
        }))
        // console.log(data)
        // accounts.contents_iv100 = accounts.contents_iv100.split('／')
        // 因為對照用的dict來源 中英文是excel表 來自網路上
        // 共有1035筆 但實際上 圖庫的檔案只有907張 且部分名稱會有差異
        // 若遇到 再手動改pokeDictionary.js 的英文名稱就好
        // 英文名稱只要和圖庫檔案名稱相同 就可以正確顯示
        return res.render('admin/accounts', { accounts: data })
      })
      .catch(err => next(err))
  },
  getAccount: (req, res, next) => {
    const id = req.params.id
    // console.log(id)
    Account.findByPk(id, { raw: true })
      .then(account => {
        let data = account
        data.contentsIv100Array = accountsHelper.cToE(data.contentsIv100)
        console.log('data=', data)
        res.render('admin/detail', { account: data })
      })
      .catch(err => next(err))
  },




  // getAccount 改view 測試用 之後要刪
  getDetail: (req, res, next) => {
    res.render('admin/detail')
  }
}

module.exports = accountController