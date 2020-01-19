const nodemailer = require('nodemailer');

const sendEmail = (message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
    });

    transporter.sendMail(message, function(err, info) {
        if (err) {
            console.log(err);
        }
    });
};

module.exports = sendEmail;