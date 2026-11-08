import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {root,closeDatabase} from './storage.mjs';
import {identityContext} from './identity.mjs';
import {setupRequired,setup,login,sessionUser,userIdentity,endSession,accountAction} from './accounts.mjs';
import {snapshot,mutate} from './service.mjs';
const port=Number(process.env.PORT||5173);
const host=process.env.HOST||'127.0.0.1';
const allowedHosts=process.env.ALLOWED_HOSTS?process.env.ALLOWED_HOSTS.split(',').map(s=>s.trim()):null;

const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
 try{
  const proto=req.headers['x-forwarded-proto']||'http';
  const reqHost=req.headers.host;
  if(allowedHosts){
   if(!allowedHosts.includes(reqHost)){res.writeHead(403);return res.end('Host header not allowed.');}
  }else if(host==='127.0.0.1'&&![`127.0.0.1:${port}`,`localhost:${port}`].includes(reqHost)){
   res.writeHead(403);return res.end('Use the local address printed in the terminal.');
  }
  const origin=`${proto}://${reqHost}`;
  const url=new URL(req.url,origin);
  const cookie=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('noc_session='))?.slice(12);
  const user=sessionUser(cookie);
  if(url.pathname==='/logout'&&req.method==='GET'){endSession(cookie);res.writeHead(302,{'Set-Cookie':`noc_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${proto==='https'?'; Secure':''}`,Location:'/'});return res.end();}
  if(url.pathname==='/api/auth'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({setupRequired:setupRequired(),user}));}
  if(url.pathname==='/api/auth'||url.pathname==='/api/accounts'){
   if(req.method!=='POST'){res.writeHead(405);return res.end();}
   if(req.headers.origin&&req.headers.origin!==origin){res.writeHead(403);return res.end('Invalid request origin');}
   let input='';for await(const chunk of req){input+=chunk;if(Buffer.byteLength(input)>16384){res.writeHead(413);return res.end('Request too large');}}
   const body=JSON.parse(input);let result={ok:true};
   if(url.pathname==='/api/accounts')result=await accountAction(user,body);
   else{let token;if(body.action==='setup')token=await setup(body);else if(body.action==='login')token=await login(body);else throw new Error('Unknown sign-in action.');res.setHeader('Set-Cookie',`noc_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${proto==='https'?'; Secure':''}`);}
   res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify(result));
  }
  if(url.pathname==='/api/records'){
   if(!['GET','POST'].includes(req.method)){res.writeHead(405);return res.end();}
   if(req.method==='POST'&&req.headers.origin&&req.headers.origin!==origin){res.writeHead(403);return res.end('Invalid request origin');}
   const chunks=[];let length=0;
   for await(const chunk of req){length+=chunk.length;if(length>22*1024*1024){res.writeHead(413);res.end('Upload too large');return;}chunks.push(chunk);}
   const request=new Request(`${origin}${url.pathname}${url.search}`,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
   const response=await identityContext.run(userIdentity(user),()=>req.method==='GET'?snapshot(request):mutate(request));
   res.writeHead(response.status,Object.fromEntries(response.headers));return res.end(Buffer.from(await response.arrayBuffer()));
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  const relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
  const publicRoot=path.join(root,'public');const file=path.resolve(publicRoot,'.'+relative);
  if(!file.startsWith(publicRoot+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; frame-src 'self' blob:; object-src 'none'; frame-ancestors 'none'"});
  if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);
 }catch(e){console.error(e.message);if(!res.headersSent){res.writeHead(e.status|| (e.message==='AUTH_REQUIRED'?401:400),{'Content-Type':'application/json'});res.end(JSON.stringify({error:e.message==='AUTH_REQUIRED'?'Open your local workspace to continue.':e.message}));}else res.end();}
});
server.listen(port,host,()=>console.log(`\nNOC EFDMS server\nListening on http://${host}:${port}\nDatabase setup complete. Press Ctrl+C to stop.\n`));
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?`Port ${port} is busy. Stop the other app or run PORT=5174 npm run dev.`:e.message);process.exit(1);});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{closeDatabase();process.exit(0)}));
