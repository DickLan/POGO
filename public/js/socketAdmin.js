// socket.js是讓view 載入使用的script
// socket 定義好後 要到app.js去接他

const User = require('../../models')

// 定義 socketAdmin client 端的相關設定
// socket 這個 instance 會建立一個 webSocket 並連接到與伺服器關聯的socket.io伺服器
// 加上 namespace
const socketAdmin = io('/admin');
// 這邊是 public chatbox 的設定
const formAdmin = document.getElementById('chatbox-formAdmin')
const inputAdmin = document.getElementById('chatbox-inputAdmin')
// admin和每一個用戶的對話
const messagesAdmin = document.getElementById('messagesAdmin')

const roomId = 2
socketAdmin.emit('joinRoom', roomId)
socketAdmin.on('message', msg => {
  console.log('message from AdminNamespace=', msg, '123');
})

// const messagesAdmin = document.getElementById('messagesAdmin')
// clientAdmin 在chatbox enter => 發訊息給 server
formAdmin.addEventListener('submit', (e) => {
  e.preventDefault();
  if (inputAdmin.value) {
    // client send to server
    // console.log('client inputAdmin.value', inputAdmin.value)
    // 在 adminChatbox中 sender固定為admin id為１
    const senderId = "1"

    // admin 發消息到伺服器 並指定roomId
    socketAdmin.emit('message', { 
      roomId: roomId, 
      message: inputAdmin.value })

    // 初始化輸入
    inputAdmin.value = ''
    messagesAdmin.scrollTo(0, document.body.scrollHeight)
  }
})
// 新增一條 chatbox 中 admin使用者的發言
socketAdmin.on('updateMyself', (data) => {
  const { roomId, message } = data
  console.log('admin client receive data=======', data)
  const newLine = document.createElement('li')
  newLine.classList.add('d-flex', 'each-message', 'justify-content-between', 'mb-4')
  newLine.innerHTML = `
            <div class="card w-100">
              <div class="card-header d-flex justify-content-between p-3">
                <p class="fw-bold mb-0">Me admin</p>
                <p class="text-muted small mb-0"><i class="far fa-clock"></i> 13 mins ago</p>
              </div>
              <div class="card-body">
                <p class="mb-0">
                  ${message}
                </p>
              </div>
            </div>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp" alt="avatar"
              class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60">
          `

  messagesAdmin.append(newLine)
})
// 新增一條 chatbox 中 一般使用者的發言
socketAdmin.on('updateAimTalker', (data) => {
  const { roomId, message } = data
  console.log('admin client receive data=======', data)
  const newLine = document.createElement('li')
  newLine.classList.add('d-flex', 'each-message', 'justify-content-between', 'mb-4')
  newLine.innerHTML = `
            
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp" alt="avatar"
              class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
            <div class="card w-100">
              <div class="card-header d-flex justify-content-between p-3">
                <p class="fw-bold mb-0">Aim talker</p>
                <p class="text-muted small mb-0"><i class="far fa-clock"></i> 12 mins ago</p>
              </div>
              <div class="card-body">
                <p class="mb-0">
                  ${message}
                </p>
              </div>
            </div>
          `

  messagesAdmin.append(newLine)
})