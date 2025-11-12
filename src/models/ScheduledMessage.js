const mongoose = require('mongoose');
const ScheduledMessageSchema = new mongoose.Schema({
  message: String,
  runAt: Date,
  delivered: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('ScheduledMessage', ScheduledMessageSchema);
