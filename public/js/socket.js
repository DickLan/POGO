// 定義 socket client 端的相關設定
// socket 這個 instance 會建立一個 webSocket 並連接到與伺服器關聯的socket.io伺服器
const socketUser = io('/user');

// const User = require('../../models/user')
// 這邊是 public chatbox 的設定
const form = document.getElementById('chatbox-form')
const input = document.getElementById('chatbox-input')
const chatWindowBody = document.getElementById('chat-window-body')
// 抓 server 來的 msg
const messages = document.getElementById('messages')

const certainRoomId = 2
// 加入一個房間
socketUser.emit('joinRoom', certainRoomId)
// 載入歷史訊息
async function loadMessage(userId) {
  try {
    // console.log('user=========321===========', user)
    // console.log('loadM run')
    const response = await fetch(`/messages/${userId}`)
    const messages = await response.json()
    await console.log('response=', response)
    await console.log('messages=', messages)
    chatWindowBody.innerHTML = ''

    messages.forEach(msg => {
      // 確認可以讀到再加上完整樣板
      // if senderId = 1 => + admin
      if (msg.senderId === 1) {
        chatWindowBody.innerHTML += generateChatMsgAdmin(msg.message)
        // if not 1 => + user
      } else {
        chatWindowBody.innerHTML += generateChatMsgUser(msg.message)
      }
    })
    chatWindowBody.scrollTo(0, document.body.scrollHeight)

  } catch (error) {
    console.error('Failed to load messages', error);
  }
}
// console.log('user=========123===========', user)
loadMessage(user.id)


// client 在chatbox enter => 發訊息給 server
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {

    // 在 normal user Chatbox中 receiver固定為admin id為１
    const receiverId = "1"
    const senderId = user.id
    // console.log('user====================', user)

    // client send to server
    // console.log('client input.value', input.value)
    // socketUser.emit('chat message', input.value)

    // 發送消息到服務器
    socketUser.emit('message', {
      roomId: certainRoomId,
      message: input.value,
      receiverId: parseInt(receiverId),
      senderId: senderId
    })
  }
})
// 新增一條 chatbox 中 一般使用者的發言
socketUser.on('updateMyself', (data) => {
  const { roomId, message } = data
  // console.log('user client receive data=======', data)
  const newLine = document.createElement('div')
  newLine.innerHTML = generateChatMsgUser(message)
  chatWindowBody.append(newLine)
  input.value = ''
  chatWindowBody.scrollTo(0, document.body.scrollHeight)

})
// 新增一條 chatbox 中 admin使用者的發言
socketUser.on('updateAimTalker', (data) => {
  const { roomId, message } = data
  // console.log('user client receive data=======', data)
  const newLine = document.createElement('div')
  // newLine.classList.add('d-flex', 'flex-row', 'justify-content-start', 'mb-4')
  newLine.innerHTML = generateChatMsgAdmin(message)
  chatWindowBody.append(newLine)
  input.value = ''
  chatWindowBody.scrollTo(0, document.body.scrollHeight)

})


// fun 區

function generateChatMsgUser(msg) {
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

function generateChatMsgAdmin(msg) {
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