const mongoose = require('mongoose');

module.exports = mongoose.model('LOB', new mongoose.Schema({
  categoryName: String
}));
