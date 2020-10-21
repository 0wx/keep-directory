const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  chat_id: Number,
  id: Number,
  name: String,
  discriminator: Number,
  avatarUrl: String,
  title: String,
  url: String,
  description: String,
  translateTitle: String,
  translateFrom: String,
  matchTitle: String,
  matchUrl: String,
  confident: Number,
  root: String,
  child: String,
  other: Boolean,
  timestamp: Number,
});

module.exports = mongoose.model('Post', schema);