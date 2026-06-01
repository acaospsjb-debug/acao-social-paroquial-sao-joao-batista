const { spawn } = require('child_process');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const processes = [
  spawn(npm, ['--prefix', 'server', 'run', 'dev'], { stdio: 'inherit', shell: true }),
  spawn(npm, ['--prefix', 'client', 'run', 'dev'], { stdio: 'inherit', shell: true })
];

function shutdown() {
  processes.forEach((processRef) => {
    if (!processRef.killed) processRef.kill();
  });
}

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

processes.forEach((processRef) => {
  processRef.on('exit', (code) => {
    if (code && code !== 0) {
      shutdown();
      process.exit(code);
    }
  });
});
