const mongoose = require('mongoose');
const CarrierSchema = new mongoose.Schema({
  company_name: String,
  collection_id: String
}, { timestamps: true });
module.exports = mongoose.model('Carrier', CarrierSchema);
