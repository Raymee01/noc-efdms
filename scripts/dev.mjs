import {spawn} from 'node:child_process';
import {existsSync,watch} from 'node:fs';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const installed=existsSync('node_modules/esbuild');
async function build(){await import('./build.mjs?time='+Date.now());}
if(installed)await build();
else console.log('Using included build. To edit source: npm install, then restart npm run dev.');
let child=spawn(process.execPath,['server/index.mjs'],{stdio:'inherit'}),timer;
if(installed){for(const dir of ['src','server'])watch(dir,{recursive:true},(_,name)=>{if(!name||name==='service.mjs')return;clearTimeout(timer);timer=setTimeout(async()=>{try{await build();child.kill();await new Promise(resolve=>child.once('exit',resolve));child=spawn(process.execPath,['server/index.mjs'],{stdio:'inherit'});console.log('Rebuilt. Refresh your browser.');}catch(e){console.error(e.message)}},300)});}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{child.kill(signal);process.exit(0)});
