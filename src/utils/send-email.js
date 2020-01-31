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
            // TODO: Log errors somehow/somewhere so we know what email did not send so that we can resend
        }
    });
};

module.exports = sendEmail;