// 定義main layout 畫面 normal user 的chatbox按鈕被點擊時的行為
document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById('chat-icon');
  const chatWindow = document.getElementById('chat-window');
  const chatWindowBody = document.getElementById('chat-window-body');


  chatIcon.addEventListener('click', async function () {
    if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
      chatWindow.style.display = 'block';

      // 點擊交談視窗時 將訊息標示為已讀
      try {
        const response = await fetch('/messages/markAsRead', {
          method: 'POST'
        })
        if (response.status === 200) {

          const notYetReadMsgCounts = document.querySelector('.notYetReadMsgCounts')
          const newMsgIcon = document.querySelector('#newMsgIcon')
          notYetReadMsgCounts.style.display = 'none'
          newMsgIcon.style.display = 'none'

          console.log('Messages marked as read');
          chatWindowBody.scrollTo(0, document.body.scrollHeight)
        } else {
          console.log('Failed to mark messages as read');
        }
      } catch (error) {
        console.log('Error:', error);
      }



    } else {
      chatWindow.style.display = 'none';
    }
  });
});
