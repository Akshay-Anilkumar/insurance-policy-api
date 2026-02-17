const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  policyNumber: String,
  startDate: Date,
  endDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  lobId: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' }
});

schema.index({ userId: 1 });
schema.index({ carrierId: 1 });
schema.index({ lobId: 1 });

schema.index({ policyNumber: 1 }, { unique: true });

module.exports = mongoose.model('Policy', schema);