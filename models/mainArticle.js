const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  data: Object,
  results: Array,
  lastUpdate: {
    type: Number,
    default: Date.now(),
  },
  type: {
    type: String,
    default: 'all'
  }
});

module.exports = mongoose.model('Main', schema);