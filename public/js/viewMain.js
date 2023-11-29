document.addEventListener('DOMContentLoaded', function () {
  var langSwitchers = document.querySelectorAll('input[name="switch-one"]')
  langSwitchers.forEach(function (switcher) {
    switcher.addEventListener('change', function () {
      console.log('change', this.value)
      if (this.value === 'en') {
        window.location.href = '/change-lang/en-US'
      } else if (this.value === 'zh') {
        window.location.href = '/change-lang/zh-TW'
      }
    })
  })
})