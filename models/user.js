/**
 * Schema for a user.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Constants = require('../config/constants');

// For any user
var userSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    unique: true
  },
  name: String,
  gId: String,
  token: {
    type: String,
    unique: true
  },
  last_page_id: {   // fake cache for O(1) page creation
    default: 0,
    type: Number
  },
  access_token: String,
  refresh_token: String
});

module.exports = mongoose.model('User', userSchema);
