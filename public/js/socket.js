// 定義 socket client 端的相關設定
// socket 這個 instance 會建立一個 webSocket 並連接到與伺服器關聯的socket.io伺服器
const socket = io();
// 這邊是 public chatbox 的設定
const form = document.getElementById('chatbox-form')
const input = document.getElementById('chatbox-input')
const chatWindowBody = document.getElementById('chat-window-body')
// 抓 server 來的 msg
const messages = document.getElementById('messages')
// client 在chatbox enter => 發訊息給 server
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    // client send to server
    // console.log('client input.value', input.value)
    socket.emit('chat message', input.value)

    const newLine = document.createElement('div')
    newLine.innerHTML = ` 
        <div class="d-flex flex-row justify-content-end mb-4">
          <div>
            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">${input.value}</p>
            <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:11</p>
          </div>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp" alt="avatar 1"
            style="width: 45px; height: 100%;">
        </div>
              `
    chatWindowBody.append(newLine)
    input.value = ''
    chatWindowBody.scrollTo(0, document.body.scrollHeight)

  }
})
// 處理從 server 來的訊息
socket.on('chat message', (msg) => {
  const item = document.createElement('li')
  item.textContent = msg
  messages.appendChild(item)
  // 將瀏覽器視窗滾動到最底部，以確保最新的聊天訊息可見，用戶不用自己手動下滑
  window.scrollTo(0, document.body.scrollHeight)
})

// Common API - Basic emit - From server to client
// 接收伺服器端來的 welcome 訊息
// 需要在 client 端定義好，如何接受 server訊息，以及要做什麼處理
socket.on('welcomeMsg', (msg) => {
  const item = document.createElement('h1')
  item.textContent = msg
  messages.append(item)
  window.scrollTo(0, document.body.scrollHeight)
})


// Common API - Acknowledgements - From server to client
// from  client 監聽 server 'request'
// 並在接收到事件後調用伺服器提供的回調函數 callback，並傳回一個包含 'ok' 狀態的 status。
socket.on('request', (arg1, arg2, callback) => {
  console.log(arg1);
  console.log(arg2);
  callback({
    status: 'Ok ACK from client!'
  })
})

// Common API - Acknowledgements - From client to server 
// from client to server 
// 方便測試 所以按下 submit時才發出訊息
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Acknowledgements - From client to server
  socket.timeout(5000).emit('request', { foo: 'dick' }, 'pussy', (err, response) => {
    if (err) {
      console.log('no ack from server')
    } else {
      console.log(response.status)
    }
  })

})