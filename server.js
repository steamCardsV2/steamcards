const express = require('express')
const passport = require('passport')
const User = require('./models/user')
const mongoose = require('mongoose')
// const LocalStrategy = require('passport-local').Strategy;
const SteamStrategy = require('passport-steam').Strategy

const applyRoutes = require('./routes')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/asf-server')
  .then(() => console.log('Mongodb connected!'))
  .catch(err => console.err(err))

// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new SteamStrategy({
  returnURL: 'http://steamcards.cn/auth/steam/return',
  realm: 'http://steamcards.cn/',
  apiKey: '4CAA9BCAA65B878DE302F03FB40B392E'
}, function(identifier, profile, done) {
  done(null, new User({
    steamId: profile._json.steamid,
    personaName: profile._json.personaname,
    avatar: profile._json.avatar
  }))
}))

// use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

applyRoutes(app, passport)

app.listen(80);
