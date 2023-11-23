const { pinyin } = require('pinyin-pro')
// 目前圖片素材庫有1~8世代 缺９

// a:中文名稱字串
const a = require('./pokeNamesChinese')
// b:中文名稱陣列
const b = a.split('\n')
// console.log(b)
// bb 拼音陣列
const bb = b.map(item => {
  const result = pinyin(item, { toneType: 'none' })
  return result.replace(/\s/g, '')
})

// console.log('bb=', bb)
// c:英文名稱字串

const c = require('./pokeNamesEng')
// d:英文名稱陣列
const d = c.split('\n')
// console.log('d=', d)

const dict = {}
for (let i = 0; i < bb.length; i++) {
  dict[bb[i]] = d[i]
}
// console.log(dict)
// console.log(bb.length)
// console.log(bb[1])
// English name transfer to Traditional Chinese Name, not pinyin
const dictForAccountDetail = {}
for (let i = 0; i < bb.length; i++) {
  dict[d[i]] = b[i]
}
module.exports = dict 