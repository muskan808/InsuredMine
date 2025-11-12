const express = require('express');
const router = express.Router();
const ScheduledMessage = require('../models/ScheduledMessage');
const { scheduleMessage } = require('../services/schedulerService');

router.post('/schedule', async (req, res) => {
  const { message, day, time } = req.body;
  if (!message || !day || !time) return res.status(400).json({ error: 'message, day, time required' });
  // day expected YYYY-MM-DD and time HH:mm (24h)
  const runAt = new Date(day + 'T' + time + ':00');
  const doc = await ScheduledMessage.create({ message, runAt });
  await scheduleMessage(doc);
  res.json({ status: 'scheduled', id: doc._id, runAt: doc.runAt });
});

module.exports = router;
