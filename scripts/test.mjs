import {fork, spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const runtime=await fs.mkdtemp(path.join(os.tmpdir(),'teklif-tests-'));
const withImages=process.argv.includes('--images');
const env={...process.env,PORT:'0',TEKLIF_RUNTIME_DIR:runtime};
const server=fork(path.join(root,'server.mjs'),[],{cwd:root,env,stdio:['ignore','ignore','inherit','ipc']});
let tests;
const onSignal=()=>{tests?.kill('SIGTERM');server.kill('SIGTERM');};
process.once('SIGINT',onSignal);process.once('SIGTERM',onSignal);
try{
 const port=await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('Test sunucusu zamanında başlamadı.')),10000);
  server.once('error',error=>{clearTimeout(timeout);reject(error);});
  server.once('exit',code=>{clearTimeout(timeout);reject(new Error('Test sunucusu kapandı: '+code));});
  server.once('message',message=>{clearTimeout(timeout);if(message.type==='ready')resolve(message.port);else reject(new Error('Test sunucusu yanıtı geçersiz.'));});
 });
 const files=(await fs.readdir(path.join(root,'tests'))).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>path.join(root,'tests',name));
 tests=spawn(process.execPath,['--test',...files],{cwd:root,env:{...process.env,TEST_ORIGIN:`http://127.0.0.1:${port}`,TEKLIF_TEST_IMAGES:withImages?'1':'0'},stdio:'inherit'});
 const [code]=await once(tests,'exit');process.exitCode=code??1;
}catch(error){console.error(error.message);process.exitCode=1;}
finally{
 if(server.exitCode===null&&server.signalCode===null){const stopped=once(server,'exit');server.kill('SIGTERM');await stopped;}
 await fs.rm(runtime,{recursive:true,force:true});
 process.removeListener('SIGINT',onSignal);process.removeListener('SIGTERM',onSignal);
}
