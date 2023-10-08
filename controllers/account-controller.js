const { Account, Sequelize } = require('../models')
const accountsHelper = require('../helpers/accounts-helper')

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

          contentsIv100Array: accountsHelper.cToE(act.contentsIv100).slice(0, 9),
          // 檢查是否有 req.user 有的話才進行下一步動作
          // 將 CartAccounts依序拿出 每次都會查出一個cartAccount
          // 並將拿出的cartAccount變為cartAccount.id 再做include檢查
          isAddedToCart: req.user && req.user.CartAccounts.map(cartAccount => cartAccount.id).includes(act.id)
        }))
        // console.log(data)
        // accounts.contents_iv100 = accounts.contents_iv100.split('／')
        // 因為對照用的dict來源 中英文是excel表 來自網路上
        // 共有1035筆 但實際上 圖庫的檔案只有907張 且部分名稱會有差異
        // 若遇到 再手動改pokeDictionary.js 的英文名稱就好
        // 英文名稱只要和圖庫檔案名稱相同 就可以正確顯示
        return res.render('public/accounts', { accounts: data })
      })
      .catch(err => next(err))
  },
  getAccount: (req, res, next) => {
    const id = req.params.id
    // console.log('req', req.originalUrl)
    Account.findByPk(id, { raw: true })
      .then(account => {
        let data = account
        // 從字串轉Iv100寶可夢為對應英文名稱之陣列
        data.contentsIv100Array = accountsHelper.cToE(data.contentsIv100)
        // 從字串轉Legend寶可夢為對應英文名稱之陣列
        data.contentsLegendArray = accountsHelper.cToE(data.contentsLegend)
        // console.log('data=', data)
        if (req.originalUrl.includes('Legend')) {
          return res.render('public/account-Legend', { account: data })
        }
        return res.render('public/account-Iv100', { account: data })
      })
      .catch(err => next(err))
  },
  getSearchedAccounts: (req, res, next) => {

    // req.body 是 post  req.query 是 get 
    // console.log(req.query)

    const { accountId, level, stardust } = req.query
    // query 拿到的單個變數 會是字串，如果是多個變數，才會是陣列包起來的字串

    let { team, price, pokemonContains } = req.query
    console.log('{accountId,team,level,stardust,price,pokemonContains}', { accountId, team, level, stardust, price, pokemonContains })
    const whereCondition = {}
    // for checkboxes
    whereCondition[Sequelize.Op.and] = []
    // accountId
    if (accountId) {
      whereCondition.accountId = { [Sequelize.Op.like]: `%${accountId}%` }
    }
    // team
    if (team) {
      const teamConditions = {
        [Sequelize.Op.or]: []
      }
      // 單的變數通常不加括號 typeof === 'string' 比較的項目要用''包起來
      if (typeof (team) === 'string') {
        console.log('L=1')
        team = [team]
      }

      // console.log('========================')
      // console.log(team)
      const validTeams = ['red', 'blue', 'yellow', 'yet']
      teamConditions[Sequelize.Op.or] = team
        .filter(teamName => validTeams.includes(teamName))
        // map把[ 'red', 'blue' ]轉為[{ team: 'red' }, { team: 'blue' }]
        // 對每一個teamName創建一個物件team，team的屬性設為teamName
        .map(teamName => ({ team: teamName }))
      // 原先的寫法如下
      // team.map(team => {
      //   console.log('team=', team)
      //   if (team.includes('red')) {
      //     teamConditions[Sequelize.Op.or].push({ team: 'red' })
      console.log('========================')
      console.log('teamConditions', teamConditions)

      whereCondition[Sequelize.Op.and].push(teamConditions)
    }
    // level
    if (level) {
      whereCondition.level = { [Sequelize.Op.gt]: level }
    }
    // startdust
    if (stardust) {
      whereCondition.stardust = { [Sequelize.Op.gt]: stardust }
    }
    // price 
    // =================Correct==========
    if (price) {
      const validPrice = ['0to1k', '0to2k', '2kto4k', '4kto6k', '6kUp'];
      const priceConditions = {
        [Sequelize.Op.or]: []
      };

      if (typeof price === 'string') {
        price = [price];
      }

      price.forEach(selectedPriceRange => {
        if (validPrice.includes(selectedPriceRange)) {
          switch (selectedPriceRange) {
            case '0to1k':
              priceConditions[Sequelize.Op.or].push({
                price: {
                  [Sequelize.Op.between]: [0, 1000]
                }
              });
              break;
            case '0to2k':
              priceConditions[Sequelize.Op.or].push({
                price: {
                  [Sequelize.Op.between]: [0, 2000]
                }
              });
              break;
            case '2kto4k':
              priceConditions[Sequelize.Op.or].push({
                price: {
                  [Sequelize.Op.between]: [2000, 4000]
                }
              });
              break;
            case '4kto6k':
              priceConditions[Sequelize.Op.or].push({
                price: {
                  [Sequelize.Op.between]: [4000, 6000]
                }
              });
              break;
            case '6kUp':
              priceConditions[Sequelize.Op.or].push({
                price: {
                  [Sequelize.Op.gte]: 6000
                }
              });
              break;
            // 如果上面都沒執行到 就執行default
            default:
              break;
          }
        }
      });
      whereCondition[Sequelize.Op.and].push(priceConditions)
    }
    // contains pokemon
    if (pokemonContains) {
      const pokemonContainsConditions = []
      // pokemonContains=字串 'aa/bb/cc'
      // 防呆 trim前後空格與空行
      trimPokemonContains = pokemonContains.trim()
      containsArray = trimPokemonContains.split('/')
      console.log(containsArray)

      // 開始邏輯運算
      containsArray.forEach(searchPokemon => {
        pokemonContainsConditions.push({
          contentsIv100: {
            [Sequelize.Op.like]: `%${searchPokemon}%`
          }
        })
      })
      // 因為 pokemonContainsConditions是一個包含搜尋條件的陣列
      // 所以用展開運算子搭配push 將每個元素作為獨立元素，增加到whereCond之中
      whereCondition[Sequelize.Op.and].push(...pokemonContainsConditions)

    }


    Account.findAll({
      raw: true,
      where: whereCondition
      // nest: true
    })
      .then(accounts => {
        let data = accounts.map(act => ({
          ...act,
          contentsIv100Array: accountsHelper.cToE(act.contentsIv100).slice(0, 9),
          // 檢查是否有 req.user 有的話才進行下一步動作
          isAddedToCart: req.user && req.user.CartAccounts.map(cartAccount => cartAccount.id).includes(act.id)
        }))
        // console.log(data)
        // accounts.contents_iv100 = accounts.contents_iv100.split('／')
        return res.render('public/accounts', { accounts: data })
      })
      .catch(err => next(err))
  }
}

module.exports = accountController