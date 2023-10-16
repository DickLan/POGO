document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById('chat-icon');
  const chatWindow = document.getElementById('chat2');

  chatIcon.addEventListener('click', function () {
    if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
      chatWindow.style.display = 'block';
    } else {
      chatWindow.style.display = 'none';
    }
  });
});
