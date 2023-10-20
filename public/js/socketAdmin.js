// 定義 socketAdmin client 端的相關設定
// socket 這個 instance 會建立一個 webSocket 並連接到與伺服器關聯的socket.io伺服器
const socketAdmin = io();
// 這邊是 public chatbox 的設定
const formAdmin = document.getElementById('chatbox-formAdmin')
const inputAdmin = document.getElementById('chatbox-inputAdmin')
// admin和每一個用戶的對話
const messagesAdmin = document.getElementById('messagesAdmin')

// 抓 server 來的 msg
// const messagesAdmin = document.getElementById('messagesAdmin')
// client 在chatbox enter => 發訊息給 server
formAdmin.addEventListener('submit', (e) => {
  e.preventDefault();
  if (inputAdmin.value) {
    // client send to server
    // console.log('client inputAdmin.value', inputAdmin.value)
    socketAdmin.emit('chat message', inputAdmin.value)

    const newLine = document.createElement('li')
    newLine.classList.add('d-flex', 'each-message', 'justify-content-between', 'mb-4')
    newLine.innerHTML = `
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp" alt="avatar"
              class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
            <div class="card">
              <div class="card-header d-flex justify-content-between p-3">
                <p class="fw-bold mb-0">Brad Pitt</p>
                <p class="text-muted small mb-0"><i class="far fa-clock"></i> 12 mins ago</p>
              </div>
              <div class="card-body">
                <p class="mb-0">
                  ${inputAdmin.value}
                </p>
              </div>
            </div>           `
    // 找出 messagesAdmin 中所有的 li => 要記得這是 nodelist
    const listItems = messagesAdmin.querySelectorAll('li')
    // 轉為 array 才能使用陣列的方法
    const listItemsArray = Array.from(listItems)
    // console.log('listItemsArray=======', listItemsArray)
    console.log('listItemsArray.length=======', listItemsArray.length)

    messagesAdmin.append(newLine)

    inputAdmin.value = ''
    messagesAdmin.scrollTo(0, document.body.scrollHeight)
  }
})
// 處理從 server 來的訊息
socketAdmin.on('chat message', (msg) => {
  const item = document.createElement('li')
  item.textContent = msg
  messagesAdmin.appendChild(item)
  // 將瀏覽器視窗滾動到最底部，以確保最新的聊天訊息可見，用戶不用自己手動下滑
  window.scrollTo(0, document.body.scrollHeight)
})

// Common API - Basic emit - From server to client
// 接收伺服器端來的 welcome 訊息
// 需要在 client 端定義好，如何接受 server訊息，以及要做什麼處理
socketAdmin.on('welcomeMsg', (msg) => {
  const item = document.createElement('h1')
  item.textContent = msg
  messagesAdmin.append(item)
  window.scrollTo(0, document.body.scrollHeight)
})


// Common API - Acknowledgements - From server to client
// from  client 監聽 server 'request'
// 並在接收到事件後調用伺服器提供的回調函數 callback，並傳回一個包含 'ok' 狀態的 status。
socketAdmin.on('request', (arg1, arg2, callback) => {
  console.log(arg1);
  console.log(arg2);
  callback({
    status: 'Ok ACK from client!'
  })
})

// Common API - Acknowledgements - From client to server 
// from client to server 
// 方便測試 所以按下 submit時才發出訊息
formAdmin.addEventListener('submit', (e) => {
  e.preventDefault();

  // Acknowledgements - From client to server
  socketAdmin.timeout(5000).emit('request', { foo: 'dick' }, 'pussy', (err, response) => {
    if (err) {
      console.log('no ack from server')
    } else {
      console.log(response.status)
    }
  })

})