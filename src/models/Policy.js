const mongoose = require('mongoose');
const PolicySchema = new mongoose.Schema({
  policy_number: String,
  start_date: Date,
  end_date: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  lob: { type: mongoose.Schema.Types.ObjectId, ref: 'Lob' },
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  collection_id: String,
  company_collection_id: String
}, { timestamps: true });
module.exports = mongoose.model('Policy', PolicySchema);
