const sgMail = require('@sendgrid/mail');

const sendEmail = async (message) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            ...message,
            text: "Email"
        };
        await sgMail.send(msg);
    } catch (e) {
        console.log("REIDREIDREID: " + e);
    }
};

module.exports = sendEmail;