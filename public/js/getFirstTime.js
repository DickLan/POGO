document.addEventListener('DOMContentLoaded', function () {
  const firstVisitTime = localStorage.getItem('firstVisitTime')
  // console.log('用戶訪問')
  if (!firstVisitTime) {
    const currentTime = new Date().toISOString()
    localStorage.setItem('firstVisitTime', currentTime)
    // console.log('用戶是第一次訪問', firstVisitTime)
  } else {

    // 用戶不是第一次訪問
    // console.log('用戶第一次訪問的時間是', firstVisitTime)
  }

})