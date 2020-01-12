const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const initializePassport = require('./passport-config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const User = require('./models/User');

initializePassport(
  passport,
  username => User.findOne({username: username}),
  id => User.findOne({user_id: id})
)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(require('./routes'));

const url = process.env.DB_URL;
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true,});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000
}

app.listen(port);
