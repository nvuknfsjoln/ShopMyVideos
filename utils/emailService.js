// utils/emailService.js

const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require('../config/constants');

// Erstelle ein Transporter-Objekt für den E-Mail-Versand
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // true für 465, false für andere Ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Funktion zum Senden einer E-Mail
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"ShopMyVideos" <${EMAIL_USER}>`, // Absender
    to, // Empfänger
    subject, // Betreff
    text, // Textversion der E-Mail
    html, // HTML-Version der E-Mail
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-Mail erfolgreich gesendet!');
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
  }
};

module.exports = { sendEmail };
