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

// member
const memberUl = document.getElementById('memberUl')

let currentUserId = 1

const roomId = currentUserId
socketAdmin.emit('joinRoom', roomId)
socketAdmin.on('message', msg => {
  console.log('message from AdminNamespace=', msg, '123');
})

// console.log('userAdmin=========123===========', user)
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
    const receiverId = currentUserId

    // admin 發消息到伺服器 並指定roomId
    socketAdmin.emit('message', {
      roomId: receiverId,
      message: inputAdmin.value,
      receiverId: receiverId,
      senderId: parseInt(senderId)
    })

    // 初始化輸入
    inputAdmin.value = ''
    messagesAdmin.scrollTo(0, document.body.scrollHeight)
  }
})
// 收到新訊息 新增一條 chatbox 中 admin使用者的發言
socketAdmin.on('updateMyself', (data) => {
  const { roomId, message } = data
  // console.log('admin client receive data=======', data)
  messagesAdmin.innerHTML += generateChatMsgAdminSocketAdmin(message)

})
// 收到新訊息 新增一條 chatbox 中 一般使用者的發言
socketAdmin.on('updateAimTalker', (data) => {
  console.log('updateAimTalker=============data', data)
  const { roomId, message } = data
  // console.log('admin client receive data=======', data)
  messagesAdmin.innerHTML += generateChatMsgUserSocketAdmin(message)
})


// fun 區



function generateChatMsgUserSocketAdmin(msg) {
  return ` 
  <div class="d-flex flex-row justify-content-start mb-4">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp" alt="avatar 1"
                  style="width: 45px; height: 100%;">
          <div>
            <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7; font-size: 20px">${msg}</p>
            <p class="small ms-3 mb-3 rounded-3 text-muted">00:11</p>
          </div>
                
  </div>`
}

function generateChatMsgAdminSocketAdmin(msg) {
  return `
                <div class="d-flex flex-row justify-content-end mb-4">
          <div>
            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary" style="background-color: #f5f6f7; font-size: 20px">${msg}</p>
            <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:11</p>
          </div>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp" alt="avatar 1"
            style="width: 45px; height: 100%;">
        </div>`
}


function generateMemberHTML(user) {
  return `
    <li class="p-2 border-bottom" data-user-id="${user.id}">
                <div class="d-flex justify-content-between">
                  <div class="d-flex flex-row">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp" alt="avatar"
                      class="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60">
                    <div class="pt-1">
                      <p class="fw-bold mb-0">${user.name}</p>
                      <p class="small text-muted">${user.Messages[0].message}</p>
                    </div>
                  </div>
                  <div class="pt-1">
                    <p class="small text-muted mb-1">5 mins ago</p>
                  </div>
                </div>
              </li>
    `
}


// load admin msg
async function loadMessageAdmin(userId) {
  try {
    // console.log('user=========321===========', user)
    // console.log('loadM run')

    const response = await fetch(`/messages/${userId}`)
    const messages = await response.json()
    // await console.log('response=', response)
    // await console.log('messages=', messages)
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

// load admin chatbox member list 左側顯示有歷史訊息的對話
async function fetchDataAndLoadMembers() {
  try {
    const memberResponse = await fetch(`/messages/allUsers`)
    const usersWithMsg = await memberResponse.json()
    // await console.log('memberResponse=', memberResponse)
    // await console.log('usersWithMsg=', usersWithMsg)
    loadMember(usersWithMsg)
  } catch (error) {
    console.log('發生錯誤：', error);
  }
}


fetchDataAndLoadMembers()



async function loadMember(users) {
  memberUl.innerHTML = ''
  // forEach載入每一個user 
  users.forEach(user => {
    memberUl.innerHTML += generateMemberHTML(user)
    // console.log('user=============', user)
  })
  // 渲染 用戶名 ＆ 最新訊息在 member list
  // member list order by time
  // 點擊member可以在右側顯示完整對話


  // 定義點擊 member li時的行為
  document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', function () {

      // getAttribute是string 所以要轉int !!!!!!!!!!!!!!!!
      const userId = parseInt(li.getAttribute('data-user-id'))
      console.log('userId=====6=====', userId)
      console.log(typeof userId)
      console.log('userId=====6=====', currentUserId)
      console.log(typeof currentUserId)
      // 先離開舊房
      socketAdmin.emit('leaveRoom', { roomId: currentUserId })
      currentUserId = userId
      socketAdmin.emit('request-user-messages', userId)
      // 再加入新房
      socketAdmin.emit('joinRoom', { roomId: currentUserId })
      // console.log('request-user-messages sent')
      // console.log('member userId', userId)
    })
  })

  // 但這功能是進入 admin chat page時執行一次
  // 若已經在admin chat page時，有新用戶發訊息來
  // 該如何渲染新用戶？
  // １ 靠socket監聽，有新用戶發送訊息時，再loadMessage一次
}
// get history msg
socketAdmin.on('receive-user-messages', (messages) => {
  // console.log('receive-user-messages receive')
  displayMessages(messages)

})

function displayMessages(messages) {
  const roomId = currentUserId
  socketAdmin.emit('joinRoom', roomId)

  // console.log('receive-user-messages', messages)
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
}