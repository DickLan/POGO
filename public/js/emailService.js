const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  // 設定信箱服務
  // 敏感資料之後要放到 .env
  host: 'smtp.migadu.com',// Migadu 的 SMTP 服務器地址
  port: 587, // SMTP 服務器的端口，587 是一個常用的非加密端口，如果使用加密連接可以使用465
  secure: false, // 如果端口是587設為false，如果是465設為true
  auth: {
    user: process.env.EMAIL_SERVICE_USER,
    pass: process.env.EMAIL_SERVICE_PASSWORD
  }

})

// 在 nodemailer 的 mailOptions 設定中同時提供了 text 和 html 屬性時，收件人的郵件客戶端會根據其支持的格式顯示郵件內容。如果郵件客戶端支持 HTML，它通常會顯示 html 屬性中的內容，因為它提供了更豐富的文本格式和樣式。如果郵件客戶端不支持 HTML，則會顯示 text 屬性中的純文本內容。



// 撰寫郵件選項
const sendResetPasswordEmail = (user, resetToken) => {

  const isDevelopment = process.env.NODE_ENV === 'development';
  // 本地開發時才發這連結
  const testLink = isDevelopment ? `<p><a href="http://localhost:3001/users/resetPassword?token=${resetToken}&id=${user.id}&name=${encodeURIComponent(user.name)}" target="_blank">Reset your password TEST</a></p>`
    : ''

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; }
  .header { background: #4CAF50; padding: 10px; text-align: center; }
  .header h1 { color: #ffffff; }
  .content { margin: 20px; }
  .footer { background: #f1f1f1; padding: 10px; text-align: center; }
  .button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
</style>
</head>
<body>

<div class="header">
  <h1>Password Reset Request</h1>
</div>

<div class="content">
  <p><strong>Dear ${user.name},</strong></p>
  <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
  <p>Please click on the button below to reset your password:</p>

  ${testLink}

// 開發測試時
<p><a href="http://localhost:3001/users/resetPassword?token=${resetToken}&id=${user.id}&name=${user.name}" target="_blank">Reset your password TEST</a></p>

  <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
</div>

<div class="footer">
  <p>Regards,</p>
  <p>Little Sheng Service Team</p>
</div>

</body>
</html>
`

  console.log('發件人', process.env.EMAIL_SERVICE_USER)
  console.log('收件人', user.email)
  const mailOptions = {
    from: `'Little Sheng Service' ${process.env.EMAIL_SERVICE_USER}`, //發件人
    to: user.email, //收件人
    subject: "Password Reset", //標題
    //內文
    html: html // HTML正文
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    })
  })
}
// `
//   <p>Dear user ${user.name}:</p>

//   <p>You are receiving this because you have requested the reset of the password for your account.</p>

//   <p>Please click on the following link, or paste this into your browser to complete the process:</p>

//   <p><a href="https://www.littlesheng.com/users/resetPassword?token=${resetToken}&id=${user.id}&name=${user.name}" target="_blank">Reset your password</a></p>

//   <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>

// <p>Regards.</p>
// <p>Little Sheng service agent.</p>

//   `



module.exports = {
  sendResetPasswordEmail
}