const { pinyin } = require('pinyin-pro')
// 定義拼音對應的英文名稱表
// 火精靈火伊布這種特殊名字 可以考慮另外新增

const translationMap = require('../pokeDictionary')

// const translationMap = {
//   'penhuolong': 'Charizard',
//   'miaowawangzi': 'Venusaur',
// }

module.exports = {
  // input:'噴火龍／火伊布／...' 是word複製來的手打字串
  // 將該字串轉為 [a,b,c...]正確英文名稱陣列
  cToE: function (input) {
    // terms:變量名稱
    if (!input) throw new Error('no input on accounts-helper')
    // if (input.length)
    console.log('ahelpr', input)
    const terms = input.split('／')
    const translatedTerms = terms.map(term => {
      // console.log(term)
      // replace:正則表達式將空格變為空字串
      const pininResult = pinyin(term, { toneType: 'none' }).replace(/\s/g, '')
      // 返回轉換後的英文名稱
      // 若沒轉成功 回傳原先的中文名稱 方便辨認
      return translationMap[pininResult] || term
    })
    return translatedTerms
  }
}