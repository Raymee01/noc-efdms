import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'noc-http-'));
const port=19283,base=`http://127.0.0.1:${port}`;
let child;
async function start(){child=spawn(process.execPath,['server/index.mjs'],{env:{...process.env,NOC_DATA_DIR:dir,PORT:String(port)},stdio:['ignore','pipe','pipe']});await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Startup timed out')),10000);child.stdout.on('data',chunk=>{if(chunk.toString().includes('Database setup complete')){clearTimeout(timer);resolve();}});child.on('exit',code=>{clearTimeout(timer);reject(new Error('Server exited '+code))});});}
async function stop(){const done=once(child,'exit');child.kill();await done;}
async function post(route,body,cookie='',origin=base){return fetch(base+route,{method:'POST',headers:{cookie,origin,'content-type':'application/json'},body:JSON.stringify(body)});}
async function login(email='admin@example.test',password='Administrator-pass-123'){const r=await post('/api/auth',{action:'login',email,password});assert.equal(r.status,200,await r.clone().text());return r.headers.get('set-cookie').split(';')[0];}
async function state(cookie){return (await fetch(base+'/api/records',{headers:{cookie}})).json();}
async function upload(cookie,classification='INTERNAL'){const form=new FormData();form.set('file',new File(['Persistent file'],'persist.txt'));form.set('folder','administration');form.set('title','Persistence test');form.set('classification',classification);return fetch(base+'/api/records',{method:'POST',headers:{cookie,origin:base},body:form});}
try{
 await start();assert.equal((await fetch(base)).status,200);assert.equal((await fetch(base+'/api/records')).status,401);
 assert.equal((await fetch(base+'/login',{redirect:'manual'})).status,404);
 assert.equal((await(await fetch(base+'/api/auth')).json()).setupRequired,true);
 let r=await post('/api/auth',{action:'setup',email:'admin@example.test',name:'Administrator',password:'Administrator-pass-123'});assert.equal(r.status,200);let admin=r.headers.get('set-cookie').split(';')[0];
 assert.equal((await post('/api/auth',{action:'setup'})).status,400);
 assert.equal((await state(admin)).folders.length,79);
 assert.equal((await post('/api/auth',{action:'login',email:'admin@example.test',password:'wrong'})).status,400);
 assert.equal((await post('/api/accounts',{action:'create'},'',base)).status,401);
 assert.equal((await post('/api/accounts',{action:'create'},admin,'https://other.test')).status,403);
 const roles=['Super Administrator','Records Manager','Department Administrator','Staff Member','Executive / Approver','Read-Only User'];
 const members=[];
 for(let i=0;i<roles.length;i++){
  const email=`user${i}@example.test`,password=`Member-password-${i}`;
  r=await post('/api/accounts',{action:'create',name:`Member ${i}`,email,password,role:roles[i]},admin);assert.equal(r.status,200,await r.clone().text());
  const cookie=await login(email,password),s=await state(cookie);assert.equal(s.user.role,roles[i]);members.push({email,password,cookie,id:s.user.id});
 }
 console.log('PASS separate password login for all six roles');
 assert.equal((await post('/api/accounts',{action:'create',name:'Duplicate',email:members[0].email,password:'Example-pass-123',role:roles[0]},admin)).status,400);
 const reader=members[5],staff=members[3],reviewer=members[4];
 assert.equal((await post('/api/accounts',{action:'create'},reader.cookie)).status,400);
 assert.equal((await post('/api/records',{action:'folder',parent:'administration',name:'Denied'},reader.cookie)).status,400);
 assert.equal((await upload(reader.cookie)).status,400);
 r=await upload(staff.cookie,'CONFIDENTIAL');assert.equal(r.status,200);const {id}=await r.json();
 assert.equal((await state(reader.cookie)).documents.length,0);
 assert.equal((await fetch(base+'/api/records?file='+id,{headers:{cookie:reader.cookie}})).status,400);
 assert.equal((await post('/api/records',{action:'submit',id,reviewer:reviewer.id},staff.cookie)).status,200);
 assert.equal((await state(reviewer.cookie)).documents.length,1);
 assert.equal((await post('/api/records',{action:'review',id},reviewer.cookie)).status,200);
 assert.equal((await post('/api/records',{action:'approve',id},reviewer.cookie)).status,200);
 assert.equal((await state(staff.cookie)).documents[0].status,'Approved');
 console.log('PASS cross-account confidentiality, read-only restrictions and independent approval');
 r=await post('/api/accounts',{action:'resetPassword',id:staff.id,password:'Replacement-pass-123'},admin);assert.equal(r.status,200);
 assert.equal((await fetch(base+'/api/records',{headers:{cookie:staff.cookie}})).status,401);
 assert.equal((await post('/api/auth',{action:'login',email:staff.email,password:staff.password})).status,400);
 staff.cookie=await login(staff.email,'Replacement-pass-123');
 assert.equal((await post('/api/accounts',{action:'changePassword',currentPassword:'wrong',password:'Changed-password-123'},staff.cookie)).status,400);
 assert.equal((await post('/api/accounts',{action:'changePassword',currentPassword:'Replacement-pass-123',password:'Changed-password-123'},staff.cookie)).status,200);
 assert.equal((await fetch(base+'/api/records',{headers:{cookie:staff.cookie}})).status,401);staff.cookie=await login(staff.email,'Changed-password-123');
 assert.equal((await post('/api/records',{action:'user',id:staff.id,role:'Staff Member',active:false},admin)).status,200);
 assert.equal((await fetch(base+'/api/records',{headers:{cookie:staff.cookie}})).status,401);
 assert.equal((await post('/api/auth',{action:'login',email:staff.email,password:'Changed-password-123'})).status,400);
 assert.equal((await post('/api/records',{action:'user',id:staff.id,role:'Staff Member',active:true},admin)).status,200);
 console.log('PASS password changes, resets, invalidated sessions and suspension');
 await stop();await start();assert.equal((await(await fetch(base+'/api/auth')).json()).setupRequired,false);admin=await login();
 assert.equal((await state(admin)).folders.length,79);assert.equal((await state(admin)).documents.length,1);
 assert.equal(await(await fetch(base+'/api/records?file='+id,{headers:{cookie:admin}})).text(),'Persistent file');
 assert.equal((await fetch(base+'/data/records.sqlite')).status,404);
 await fetch(base+'/logout',{headers:{cookie:admin},redirect:'manual'});assert.equal((await fetch(base+'/api/records',{headers:{cookie:admin}})).status,401);
 console.log('PASS session logout, automatic migrations, password and upload persistence after restart');
}finally{if(child?.exitCode===null)await stop();fs.rmSync(dir,{recursive:true,force:true});}
