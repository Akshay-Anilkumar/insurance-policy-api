const mongoose = require('mongoose');

module.exports = mongoose.model('Account', new mongoose.Schema({
  accountName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));
