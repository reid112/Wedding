const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const initializePassport = require('./utils/passport-config');
const { User } = require('./models');
const { 
  addInviteRouter,
  guestsRouter,
  homeRouter,
  inviteRouter,
  invitesRouter,
  loginRouter,
  logoutRouter,
  rsvpRouter,
  sendInviteRouter,
  sendInvitesRouter
 } = require('./routes');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

initializePassport(
  passport,
  username => User.findOne({username: username}),
  id => User.findOne({user_id: id})
)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));
app.use(helmet());
app.use(compression());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Routes
app.use('/', homeRouter);
app.use('/add-invite', addInviteRouter);
app.use('/guests', guestsRouter);
app.use('/invite', inviteRouter);
app.use('/invites', invitesRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/rsvp', rsvpRouter);
app.use('/send-invite', sendInviteRouter);
app.use('/send-invites', sendInvitesRouter);

app.use(function(req, res){
  res.status(404);

  if (req.accepts('html')) {
    res.render('pages/404');
    return;
  }
});

// Mongoose
const url = process.env.DB_URL;
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true,});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000
}

app.listen(port);
