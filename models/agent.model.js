const mongoose = require('mongoose');

module.exports = mongoose.model('Agent', new mongoose.Schema({
  agentName: String
}));
