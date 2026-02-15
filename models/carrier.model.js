const mongoose = require('mongoose');

module.exports = mongoose.model('Carrier', new mongoose.Schema({
  companyName: String
}));
