const userLoggedIn = user ? true : false
// console.log('userLoggedIn', userLoggedIn)
const loginCheck = document.querySelector('#log-check-chatbox')

if (userLoggedIn) {
  // loginCheck.style.display = 'none'
  loginCheck.classList.remove('d-flex')
} else {
  // loginCheck.style.display = 'block'
  loginCheck.classList.add('d-flex')
}

// window.onload = function () {
//   const userLoggedIn = req.user.isAuthenticaed()
//   console.log('userLoggedIn', userLoggedIn)
// }