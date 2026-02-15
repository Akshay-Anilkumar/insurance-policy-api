const mongoose = require('mongoose');

module.exports = mongoose.model('Policy', new mongoose.Schema({
  policyNumber: String,
  startDate: Date,
  endDate: Date,
  lobId: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));
