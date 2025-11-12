const mongoose = require('mongoose');
const LobSchema = new mongoose.Schema({
  category_name: String,
  collection_id: String
}, { timestamps: true });
module.exports = mongoose.model('Lob', LobSchema);
