// Nodemailer-Konfiguration zum Senden von E-Mails

const nodemailer = require('nodemailer');
const { MAIL_SENDER_ADDRESS, MAIL_SENDER_NAME } = require('./placeholders');

// Verwende hier Umgebungsvariablen für echten SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.MAIL_PORT || 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"${MAIL_SENDER_NAME}" <${MAIL_SENDER_ADDRESS}>`,
      to,
      subject,
      html,
    });
    console.log(`Mail sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

module.exports = sendEmail;
