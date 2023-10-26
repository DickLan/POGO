// socket.js是讓view 載入使用的script
// socket 定義好後 要到app.js去接他


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
// load admin msg
async function loadMessageAdmin(userId) {
  try {
    // console.log('user=========321===========', user)
    // console.log('loadM run')
    const response = await fetch(`/messages/${userId}`)
    const messages = await response.json()
    await console.log('response=', response)
    await console.log('messages=', messages)
    messagesAdmin.innerHTML = ''

    messages.forEach(msg => {
      // if senderId = 1 => + admin
      if (msg.senderId === 1) {
        messagesAdmin.innerHTML += generateChatMsgAdminSocketAdmin(msg.message)
        // if not 1 => + user
      } else {
        messagesAdmin.innerHTML += generateChatMsgUserSocketAdmin(msg.message)

      }

    })
    messagesAdmin.scrollTo(0, document.body.scrollHeight)

  } catch (error) {
    console.error('Failed to load messages', error);
  }
}
console.log('userAdmin=========123===========', user)
loadMessageAdmin(user.id)


// const messagesAdmin = document.getElementById('messagesAdmin')
// clientAdmin 在chatbox enter => 發訊息給 server
formAdmin.addEventListener('submit', (e) => {
  e.preventDefault();
  if (inputAdmin.value) {
    // client send to server
    // console.log('client inputAdmin.value', inputAdmin.value)
    // 在 adminChatbox中 sender固定為admin id為１
    const senderId = "1"
    const receiverId = 2

    // admin 發消息到伺服器 並指定roomId
    socketAdmin.emit('message', {
      roomId: roomId,
      message: inputAdmin.value,
      receiverId: receiverId,
      senderId: parseInt(senderId)
    })

    // 初始化輸入
    inputAdmin.value = ''
    messagesAdmin.scrollTo(0, document.body.scrollHeight)
  }
})
// 新增一條 chatbox 中 admin使用者的發言
socketAdmin.on('updateMyself', (data) => {
  const { roomId, message } = data
  console.log('admin client receive data=======', data)
  messagesAdmin.innerHTML += generateChatMsgAdminSocketAdmin(message)

})
// 新增一條 chatbox 中 一般使用者的發言
socketAdmin.on('updateAimTalker', (data) => {
  const { roomId, message } = data
  console.log('admin client receive data=======', data)
  messagesAdmin.innerHTML += generateChatMsgUserSocketAdmin(message)
})


// fun 區



function generateChatMsgUserSocketAdmin(msg) {
  return ` 
  <div class="d-flex flex-row justify-content-start mb-4">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp" alt="avatar 1"
                  style="width: 45px; height: 100%;">
          <div>
            <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">${msg}</p>
            <p class="small ms-3 mb-3 rounded-3 text-muted">00:11</p>
          </div>
                
  </div>`
}

function generateChatMsgAdminSocketAdmin(msg) {
  return `
                <div class="d-flex flex-row justify-content-end mb-4">
          <div>
            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">${msg}</p>
            <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:11</p>
          </div>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp" alt="avatar 1"
            style="width: 45px; height: 100%;">
        </div>`
}