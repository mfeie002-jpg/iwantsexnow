// Starts the built candidate and checks it within the same loopback namespace.
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','43127'],{stdio:['ignore','pipe','pipe']});
let diagnostics='';for(const stream of [server.stdout,server.stderr])stream.on('data',d=>diagnostics=(diagnostics+d).slice(-3000));
try{
 let ready=false;
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:43127/')).ok){ready=true;break}}catch{}await delay(250)}
 if(!ready)throw Error('Candidate failed to start: '+diagnostics);
 for(const script of ['preview-http-smoke.mjs','catalogue-http-smoke.mjs','analyzer-api-http-smoke.mjs','private-draft-disabled-http.mjs']){
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/'+script],{stdio:'inherit'});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(script+' failed with '+code)))});
 }
}finally{server.kill();}
