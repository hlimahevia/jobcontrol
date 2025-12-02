const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

  const mailOptions = {
    from: '"Job-Control Support" <no-reply@jobcontrol.com>',
    to,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
