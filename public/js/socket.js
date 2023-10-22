// 定義 socket client 端的相關設定
// socket 這個 instance 會建立一個 webSocket 並連接到與伺服器關聯的socket.io伺服器
const socketUser = io('/user');
// 這邊是 public chatbox 的設定
const form = document.getElementById('chatbox-form')
const input = document.getElementById('chatbox-input')
const chatWindowBody = document.getElementById('chat-window-body')
// 抓 server 來的 msg
const messages = document.getElementById('messages')

const certainRoomId = 2
// 加入一個房間
socketUser.emit('joinRoom', certainRoomId)
// client 在chatbox enter => 發訊息給 server
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    // client send to server
    // console.log('client input.value', input.value)
    socketUser.emit('chat message', input.value)

    // 發送消息到服務器
    socketUser.emit('message', { roomId: certainRoomId, message: input.value })
  }
})

socketUser.on('updateMyself', (data) => {
  const { roomId, message } = data
  console.log('user client receive data=======', data)
  const newLine = document.createElement('div')
  newLine.innerHTML = ` 
        <div class="d-flex flex-row justify-content-end mb-4">
          <div>
            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">updateMyself${message}</p>
            <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:11</p>
          </div>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp" alt="avatar 1"
            style="width: 45px; height: 100%;">
        </div>
              `
  chatWindowBody.append(newLine)
  input.value = ''
  chatWindowBody.scrollTo(0, document.body.scrollHeight)

})

socketUser.on('updateAimTalker', (data) => {
  const { roomId, message } = data
  console.log('user client receive data=======', data)
  const newLine = document.createElement('div')
  newLine.innerHTML = ` 
        <div class="d-flex flex-row justify-content-end mb-4">
          <div>
            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">updateAimTalker${message}</p>
            <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:11</p>
          </div>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp" alt="avatar 1"
            style="width: 45px; height: 100%;">
        </div>
              `
  chatWindowBody.append(newLine)
  input.value = ''
  chatWindowBody.scrollTo(0, document.body.scrollHeight)

})