const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const dictForNameTrans = require('../pokeDictionary')

module.exports = {
  // 獲得當前年份
  currentYear: () => dayjs().year(),
  // 計算一個日期到當前時間 已經過了多久
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    // hbs {{#if}} {{else}}
    // options.fn(this)代表
    // true 則執行if的部分
    // false 則執行else的部分
    return a === b ? options.fn(this) : options.inverse(this)
  },
  lookup: function (array, index) {
    // return hbs array[index]
    return array[index]
  },
  ifInclude: function (a, b, options) {
    if ((typeof a) === String) {
      return a.includes(b) ? options.fn(this) : options.inverse(this)

    }
  },
  subString: function (string, start, end) {
    // console.log('================', string)
    return string.length ? string.substring(start, end) : string
  },
  // pokemon english name transfer to Chinese
  toChinese: function (string) {
    return dictForNameTrans[this]
  },
  ifInclude2: function (a, b, options) {
    if (a) {
      return a.includes(b) ? options.fn(this) : options.inverse(this)
    }
  },
  arrayCount: function (array, counts, options) {
    // array不用type of ，要用Array.isArray(arrayPara)
    if (Array.isArray(array)) {
      // console.log('array', array)
      return array.length === parseInt(counts, 10) ? options.fn(this) : options.inverse(this)
    }
  }

}
