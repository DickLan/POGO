const searchForm = document.querySelector('#searchForm')

const clearSearchBtn = document.querySelector('#clearSearchBtn')
const searchedPokemons = document.querySelector('#searchedPokemons')


clearSearchBtn.addEventListener('click', function () {
  searchForm.reset() // reset 把 form 所有 value 重置為初始值
  // 這對於 <input> 標籤來說是 value 屬性，但對於 <textarea> 來說，是它的子元素。
  // 如果想要在點擊清除按鈕時清空 <textarea>，需要在JavaScript中明確地設置其內容為空字符串
  searchedPokemons.value = ''
})  