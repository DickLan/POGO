const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

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
  }

}
