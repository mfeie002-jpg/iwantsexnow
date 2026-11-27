import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';

async function run(name, args) {
  const child = spawn(process.execPath, args, {windowsHide: true, stdio: ['ignore', 'pipe', 'pipe']});
  let log = '';
  child.stdout.on('data', data => {log += data.toString();});
  child.stderr.on('data', data => {log += data.toString();});
  const code = await new Promise((resolve,reject) => {child.on('error',reject);child.on('close',resolve);});
  await fs.writeFile(`docs/verification/${name}.log`, log, 'utf8');
  console.log(`${name}: exit ${code}\n${log.slice(-1400)}`);
  if (code !== 0) throw new Error(`${name} failed with exit ${code}`);
}
if (process.argv[2] === 'build') {
  await run('build', ['node_modules/next/dist/bin/next','build']);
  process.exit(0);
}
const tests = (await fs.readdir('tests')).filter(f => f.endsWith('.test.mjs')).map(f=>`tests/${f}`);
await Promise.all([
  run('tests', ['--test', ...tests]),
  run('lint', ['node_modules/next/dist/bin/next','lint','--quiet']),
  run('typecheck', ['node_modules/typescript/bin/tsc','--noEmit','--pretty','false'])
]);
