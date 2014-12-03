/**
 * Schema for a page.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Constants = require('../config/constants');

// For any user
var pageSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  page: {
    page_id: String,
    title: String,
    content: String
  }
});

module.exports = mongoose.model('Page', pageSchema);
