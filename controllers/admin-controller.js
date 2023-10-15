const { Account, Counter } = require('../models')
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
    const { accountId, team, level, startdust, price, contentsIv100, contentsLegend, youtube } = req.body
    // 檢查項目 星砂移除 因為有時沒記錄到
    if (!accountId || !level || !price || !contentsIv100 || !contentsLegend) throw new Error('All fields is required! (except U2)')
    Account.findByPk(dbActId)
      .then(acct => {
        if (!acct) throw new Error('no this acct admin')

        return acct.update({
          accountId, team, level, startdust, price, contentsIv100, contentsLegend, youtube
        })
      })
      .then(() => {
        req.flash('success_msg', 'update success!')
        res.redirect('/admin/accounts')
      })
      .catch(err => next(err))
  },
  postAccount: (req, res, next) => {

    const { accountId, team, level, startdust, price, contentsIv100, youtube } = req.body
    let contentsLegend = req.body.contentsLegend || ('Null／無')
    // console.log('============', accountId, level, price, contentsIv100)

    // 檢查項目 星砂移除 因為有時沒記錄到
    if (!accountId || !level || !price || !contentsIv100 || !contentsLegend) throw new Error('All fields is required! (except U2)')
    Account.create({
      accountId,
      team,
      level: parseInt(level),
      startdust: parseInt(startdust),
      price: parseInt(price),
      contentsIv100,
      contentsLegend,
      youtube
    })
      .then(() => res.redirect('/admin/accounts'))
      .catch(err => next(err))
  },
  deleteAccount: (req, res, next) => {
    const id = req.params.id
    if (!id) throw new Error('No this id')
    Account.findByPk(id)
      .then(acct => {
        if (!acct) throw new Error('No this account')
        acct.destroy()
      })
      .then(() => {
        req.flash('success_msg', 'success delet')
        res.redirect('/admin/accounts')
      })
      .catch(err => next(err))
  },
  postCounts: (req, res, next) => {

    // get client IP for counter
    // 宣告 clientIP，使其在整個函數範圍內都可見，若是const在if else裡面，就只能在判斷區域中使用
    let clientIP
    // console.log(`req.header['x-forwarder-for']`, req.header['x-forwarder-for'])
    // console.log(`req`, req)
    // IP在rawHeader 裡面的'x-forwarder-for'之後
    clientIP = req.rawHeaders[7] || '127.0.0.1'
    // 之後搞清楚怎麼用 production 運行後 再改回下面這段
    // if (process.env.NODE_ENV === 'production') {

    //   clientIP = req.header['x-forwarder-for'] || '127.0.0.1'
    // } else {
    //   // 開發環境 設一個固定ＩＰ
    //   console.log('dev')
    //   clientIP = '127.0.0.5'
    // }
    Promise.all([
      Counter.findOne({ where: { name: 'counterNoLimit' } }),
      Counter.findOne({ where: { name: 'counterCheckIP' } })
    ])
      .then(async ([counterNoLimit, counterCheckIP]) => {
        // 增加無限制 counter ，只要進入 accounts page 就加一
        if (!counterNoLimit) throw new Error('no this Counter')
        await counterNoLimit.increment('counts1')
        // 增加 IP 檢查的counter ， 訪客 IP 不同 瀏覽計數才加一
        if (!counterCheckIP) throw new Error('no this counterCheckIP')
        // console.log('counterCheckIP', counterCheckIP)
        let ipSet = counterCheckIP.ipSet || []
        // console.log('counterCheckIP', counterCheckIP)
        // console.log('ipSet', ipSet)
        // console.log('clientIP', clientIP)

        if (!ipSet.includes(clientIP)) {
          // console.log('clientIP', clientIP)
          // console.log('123')
          counterCheckIP.increment('counts1')
          // ipSet.push(clientIP)
          // console.log('ipSet', ipSet)
          ipSet = [...ipSet, clientIP]
          // console.log('ipSet', ipSet)
          await counterCheckIP.update({
            ipSet: ipSet,
            counts2: 111
          })
            .then(() => {
              console.log('保存成功');
            })
            .catch(err => {
              console.log('保存失敗：', err);
            });
        }

      })
      .then(() => next())
      .catch(err => console.log(err))

  },
  getChats: (req, res, next) => {
    res.render('admin/chat')
  }



}

module.exports = adminController