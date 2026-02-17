const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstName: String,
  dob: Date,
  address: String,
  phone: String,
  state: String,
  zipCode: String,
  email: String,
  gender: String,
  userType: String
});

schema.index({ firstName: 1 });

schema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', schema);