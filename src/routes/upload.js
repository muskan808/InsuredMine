const express = require('express');
const multer = require('multer');
const path = require('path');
const { Worker } = require('worker_threads');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const filePath = path.resolve(req.file.path);
    const worker = new Worker(path.resolve(__dirname, '../worker/uploadWorker.js'), { workerData: { filePath } });
    worker.on('message', (msg) => {
      console.log('worker:', msg);
    });
    worker.on('error', (err) => console.error('worker error', err));
    worker.on('exit', (code) => console.log('worker exit', code));
    res.json({ status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
