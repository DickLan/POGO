
// 這是從app.js移動過來的 是 server side
// 新增Namespace來管理不同用戶行為

const { Message, Sequelize } = require('../models/')

const { getMessages } = require('../controllers/user-controller')
const { use } = require('chai')

const initializeSocket = (io) => {
  const adminNamespace = io.of('/admin')
  const userNamespace = io.of('/user')

  // ========= admin =================
  // ========= admin =================
  adminNamespace.on('connection', (socket) => {
    // 這裡只影響連接到 /admin的客戶端 就是adminChat page
    // console.log('Admin connected');
    // 發送確認訊息
    adminNamespace.emit('message', 'Welcome admin')

    // join room
    socket.on('joinRoom', (roomId) => {
      // console.log(`Admin User ${socket.id} has join the room ${roomId}`);
      socket.join(roomId)
      adminNamespace.to(roomId).emit('message', `Admin User ${socket.id} has join the room ${roomId}`)
    })

    // test room
    socket.on('message', async (data) => {
      // 收到從 client 來的訊息
      const { message, receiverId, senderId } = data
      let roomId = data.roomId
      // 將收到的 message 存到 db
      // console.log('server AdminNamespace receive data=', data)
      try {
        await Message.create({
          userId: senderId,
          message, receiverId, senderId
        })
        // console.log('admin message saved to db!')
      } catch (error) {
        // console.log(error)
        console.error('Failed to save message to db')
      }
      // !!!!!!!!!!!!非常重要 roomId 必須是Int 不能是string!!!!!!!!!!!!!!
      roomId = parseInt(roomId)
      // console.log('admin NSpace roomId', roomId)
      // 進行處理後，將要 update view 的訊息傳回給 client 前端
      adminNamespace.to(roomId).emit('updateMyself', data)
      // admin 發的訊息 顯示在 user client 前端
      userNamespace.to(roomId).emit('updateAimTalker', data)

    });

    // member li 點擊時的處理
    socket.on('request-user-messages', async (userId) => {
      await updateIsRead(userId)
      const messages = await getMessagesForUser(userId)
      // console.log('request-user-messages receive=====', messages)
      adminNamespace.emit('receive-user-messages', messages)
      // console.log('receive-user-messages sent')
    })
    // leave room
    socket.on('leaveRoom', async (roomId) => {
      // console.log(`roomId===========`, roomId)
      // console.log(`admin leave room-${roomId.roomId}!`)
      socket.leave(roomId.roomId)
    })

    // load more msg
    socket.on('load-more-messages', async (data) => {
      const messages = await getMessagesForUser(data.userId, data.skipCount)
      socket.emit('receive-more-messages', messages)
    })

  })


  // ==================== user ===========================
  // ==================== user ===========================
  // 如果是io.on則會對所有 非namespace的用戶作用
  userNamespace.on("connection", (socket) => {
    // client send to Admin
    // console.log('New user client connected');

    // join room
    socket.on('joinRoom', async (roomId) => {
      // console.log(`Normal User ${socket.id} has join the room ${roomId}`);
      // console.log(`app.js user roomId: ${roomId}`);

      socket.join(roomId)
      // console.log('joinRoom nameSpace.js', roomId)
      userNamespace.to(roomId).emit('message', `Normal User ${socket.id} has join the room ${roomId}`)

      // 成功 join room 後，發送該 user's歷史訊息
      const historyMessages = await getMessagesForUser(roomId, 0)
      // console.log('historyMessages', historyMessages)
      userNamespace.to(roomId).emit('receive-history-message', historyMessages)
    })


    // 
    socket.on('message', async (data) => {
      const { message, receiverId, senderId } = data
      let roomId = data.roomId
      // 將收到的 message 存到 db
      // console.log('server UserNamespace receive data=', data)
      try {
        await Message.create({
          userId: senderId,
          message, receiverId, senderId
        })
        // console.log('user message saved to db!')
        // console.log('user roomId========', roomId)
      } catch (error) {
        // console.log(error)
        console.error('Failed to save message to db')
      }
      roomId = parseInt(roomId)
      // 存完後，才丟回給前端 
      userNamespace.to(roomId).emit('updateMyself', data)
      // user 發的訊息 顯示在 admin client 前端
      adminNamespace.to(roomId).emit('updateAimTalker', data)

      // normal user 發送訊息時，admin檢查是否為新 member chat
      adminNamespace.emit('newMemberCheck', data)

    })

    // load-more-messages
    // 歷史訊息已載入後，先掛載 loadmore button listener
    socket.on('load-history-message-done', async (data) => {
      roomId = data
      // console.log('load-history-message-done server')
      // console.log('roomId', roomId)
      userNamespace.to(roomId).emit('hang-load-more-button', '0')
      // console.log('userId', userId)
      // console.log('skipCount', skipCount)
      // // moreHistoryMessages

    })

    // 點擊 loadmore button 後 => load more msg
    socket.on('load-more-messages', async (data) => {
      const messages = await getMessagesForUser(data.userId, data.skipCount)
      socket.emit('receive-more-messages', messages)
    })





  });

}



// ====================== fun =================
// 拿出admin與該user的所有對話紀錄
async function getMessagesForUser(userId, skipCount = 0) {
  try {
    // 使用 Sequelize 查詢所有與指定 userId 有關的消息
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: userId, receiverId: 1 },
          { senderId: 1, receiverId: userId }
        ]
      },
      order: [['createdAt', 'DESC']], //取最新的六筆訊息
      limit: 4,
      offset: skipCount,
      raw: true,
      nest: true
    });

    // 返回查詢結果 是從新到舊 但點擊member li，render時會從舊的開始新增 所以要反轉
    // 至於 receive-more-messages 的再一次反轉 就在前端中定義
    return messages.reverse();

  } catch (error) {
    console.error('Error fetching messages for user:', error);
    return [];
  }

}



async function updateIsRead(userId) {
  await Message.update({ isReadAdmin: true }, {
    where: {
      [Sequelize.Op.or]: [
        { senderId: userId, receiverId: 1 },
        { senderId: 1, receiverId: userId }
      ]
    }
  })
}





module.exports = initializeSocket