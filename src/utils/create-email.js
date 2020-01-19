const createRsvpEmail = ({ isNewRsvp, name, email, attending, numberAttending, names, notes }) => {
    const emailText = `
        Name: ${name}<br/>
        Email: ${email}<br/>
        Attending: ${attending}<br/>
        Number: ${numberAttending}<br/>
        Names: ${names}<br/>Notes: ${notes}
    `;

    return Object.freeze({
        from: '"RSVP" <rsvp@brittaniandriley.com>',
        to: 'brittaniandriley@gmail.com',
        subject: (isNewRsvp) ? 'New RSVP!' : 'Updated RSVP!',
        html: emailText
    });
};

const createInviteEmail = ({ guid, email, names }) => {
    const url = `${process.env.HOST}/invite/${guid}`
    const emailText = `
        ${names},<br/><br/>
        You are invited to our wedding! <a href='${url}'>View your invite</a> for the wedding details and use the 
        form on the website to RSVP.<br/><br/> If you have any questions, feel free to reply to this email! <br/><br/>
        We hope to see you there!<br/>
        Brittani and Riley
    `;

    return Object.freeze({
        from: '"Brittani and Riley" <brittaniandriley@gmail.com>',
        to: email,
        subject: 'Wedding Invite - Brittani and Riley!',
        html: emailText
    });
};

module.exports = {
    createRsvpEmail,
    createInviteEmail
};