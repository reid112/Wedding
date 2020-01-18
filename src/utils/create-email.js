const createRsvpEmail = ({ isNewRsvp, name, email, rsvpBool, numberAttending, names, notes }) => {
    return Object.freeze({
        from: 'rsvp@brittaniandriley.com',
        to: 'brittaniandriley@gmail.com',
        subject: (isNewRsvp) ? 'New RSVP!' : 'Updated RSVP!',
        text: 'Name: ' + name + '\nEmail: ' + email + '\nAttending: ' + rsvpBool + '\nNumber: ' + numberAttending + '\nNames: ' + names + '\nNotes: ' + notes
    });
};

const createInviteEmail = () => {
    // TODO:
};

module.exports = {
    createRsvpEmail,
    createInviteEmail
};