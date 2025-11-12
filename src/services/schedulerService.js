const ScheduledMessage = require('../models/ScheduledMessage');
const timers = new Map();

function scheduleMessage(doc) {
  const now = Date.now();
  const runAt = new Date(doc.runAt).getTime();
  const delay = runAt - now;
  if (delay <= 0) {
    // immediate: mark delivered and save (or process)
    doc.delivered = true;
    return doc.save();
  }
  const t = setTimeout(async () => {
    try {
      doc.delivered = true;
      await doc.save();
      timers.delete(String(doc._id));
    } catch (err) { console.error('schedule fire error', err); }
  }, delay);
  timers.set(String(doc._id), t);
  return Promise.resolve();
}

async function loadAndScheduleAll() {
  const pending = await ScheduledMessage.find({ delivered: false });
  for (const p of pending) scheduleMessage(p);
}

module.exports = { scheduleMessage, loadAndScheduleAll };
