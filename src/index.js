const { fork } = require('child_process');
const pidusage = require('pidusage');
require('dotenv').config();
const CPU_THRESHOLD = parseFloat(process.env.CPU_THRESHOLD || '70');
const SAMPLE_INTERVAL_MS = parseInt(process.env.SAMPLE_INTERVAL_MS || '5000', 10);

let child;
function spawnChild() {
  child = fork('./src/server.js', { env: process.env, stdio: 'inherit' });
  console.log('spawned child', child.pid);
  child.on('exit', (code, signal) => {
    console.log('child exited', code, signal);
    // restart after brief delay
    setTimeout(spawnChild, 1000);
  });
}

spawnChild();

setInterval(async () => {
  if (!child || child.killed) return;
  try {
    const stat = await pidusage(child.pid);
    const cpu = stat.cpu; // percentage
    // console.log('child cpu', cpu);
    if (cpu >= CPU_THRESHOLD) {
      console.log('CPU threshold exceeded', cpu, 'restarting child');
      child.kill('SIGTERM');
    }
  } catch (err) {
    // process might have ended
  }
}, SAMPLE_INTERVAL_MS);
