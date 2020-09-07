const addInviteRouter = require('./add-invite');
const guestsRouter = require('./guests');
const homeRouter = require('./home');
const inviteRouter = require('./invite');
const invitesRouter = require('./invites');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const rsvpRouter = require('./rsvp');
const sendInviteRouter = require('./send-invite');
const sendInvitesRouter = require('./send-invites');
const sendCustomEmailRouter = require('./send-custom-email')

module.exports = {
    addInviteRouter,
    guestsRouter,
    homeRouter,
    inviteRouter,
    invitesRouter,
    loginRouter,
    logoutRouter,
    rsvpRouter,
    sendInviteRouter,
    sendInvitesRouter,
    sendCustomEmailRouter
};



