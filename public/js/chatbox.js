// 定義畫面 按鈕被點擊時的行為
document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById('chat-icon');
  const chatWindow = document.getElementById('chat-window');

  chatIcon.addEventListener('click', function () {
    if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
      chatWindow.style.display = 'block';
    } else {
      chatWindow.style.display = 'none';
    }
  });
});
