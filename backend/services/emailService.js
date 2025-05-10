const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendMail(to, subject, html) {
    const mailOptions = {
        from: `"ShopMyVideos" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
