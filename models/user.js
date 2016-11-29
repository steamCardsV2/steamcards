const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
  steamId: String,
  avatar: String,
  personaName: String
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)
