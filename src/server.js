require('dotenv').config();

require('./models'); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('./db/mongoose');
const uploadRoute = require('./routes/upload');
const policyRoute = require('./routes/policy');
const schedulerRoute = require('./routes/scheduler');
const { loadAndScheduleAll } = require('./services/schedulerService');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Server is running' }));

app.use('/upload', uploadRoute);
app.use('/policies', policyRoute);
app.use('/scheduler', schedulerRoute);

const PORT = process.env.PORT || 3000;

async function start() {
  await connect();

  try {
    const mongoose = require('mongoose');
    console.log('Registered mongoose models:', mongoose.modelNames());
  } catch (err) {
    console.warn('Could not print model names', err.message || err);
  }

  await loadAndScheduleAll();
  app.listen(PORT, () => console.log('Server listening on', PORT));
}

start().catch(err => { console.error(err); process.exit(1); });
