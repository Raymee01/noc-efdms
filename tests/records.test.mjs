import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const testDir=fs.mkdtempSync(path.join(os.tmpdir(),'noc-local-test-'));
process.env.NOC_DATA_DIR=testDir;
const {closeDatabase}=await import('../server/storage.mjs');
const {identityContext}=await import('../server/identity.mjs');
identityContext.enterWith({userId:'integration-admin',email:'admin@example.test',displayName:'Integration Administrator'});
const {snapshot,mutate}=await import('../server/service.mjs');
const origin='https://records.test';
const get=async(q='')=>(await snapshot(new Request(origin+'/api/records'+q))).json();
const post=async b=>(await mutate(new Request(origin+'/api/records',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(b)}))).json();
const upload=async(folder,document)=>{const f=new FormData();f.set('folder',folder);f.set('file',new File(['NOC test record version '+(document?2:1)],'record.txt',{type:'text/plain'}));f.set('title','Integration document');f.set('classification','CONFIDENTIAL');if(document)f.set('document',document);return (await mutate(new Request(origin+'/api/records',{method:'POST',headers:{Origin:origin},body:f}))).json();};
let checks=0;const check=(label,fn)=>{assert.ok(fn());checks++;console.log('PASS',label);};
try{
 let state=await get();check('initial owner is administrator',()=>state.user.role==='Super Administrator');check('all 79 folders seeded',()=>state.folders.length===79);await get();state=await get();check('seed idempotency',()=>state.folders.length===79);
 await post({action:'folder',parent:'administration',name:'Integration folder'});state=await get();const f=state.folders.find(x=>x.name==='Integration folder');check('folder persisted',()=>!!f);await assert.rejects(()=>post({action:'folder',id:'administration',parent:f.id,name:'Bad move'}));checks++;console.log('PASS protected root / cycle rejected');
 const record=await upload(f.id);state=await get();const d=state.documents.find(x=>x.id===record.id);check('upload metadata committed after file storage',()=>d.version===1&&d.classification==='CONFIDENTIAL');let file=await snapshot(new Request(origin+'/api/records?file='+d.id));check('authorized download returns exact stored bytes',()=>file.status===200);assert.equal(await file.text(),'NOC test record version 1');
 identityContext.enterWith({userId:'integration-reader',email:'reader@example.test',displayName:'Integration Reader'});state=await get();check('new members default read-only',()=>state.user.role==='Read-Only User');check('confidential titles excluded from snapshot',()=>state.documents.length===0);await assert.rejects(()=>get('?document='+d.id));await assert.rejects(()=>snapshot(new Request(origin+'/api/records?file='+d.id)));await assert.rejects(()=>post({action:'folder',parent:'administration',name:'No permission'}));checks+=3;console.log('PASS unauthorized details, download and mutation rejected');
 identityContext.enterWith({userId:'integration-admin',email:'admin@example.test',displayName:'Integration Administrator'});
 await upload(f.id,d.id);let info=await get('?document='+d.id);check('revision preserves original version',()=>info.versions.length===2&&info.document.version===2);await post({action:'restoreVersion',id:d.id,number:1});info=await get('?document='+d.id);check('version restoration creates new version',()=>info.versions.length===3&&info.document.version===3);
 await post({action:'submit',id:d.id,reviewer:'integration-admin',due:'2026-12-01'});await post({action:'review',id:d.id});await post({action:'approve',id:d.id,note:'Integration approved'});info=await get('?document='+d.id);check('approval end-to-end',()=>info.document.status==='Approved'&&info.events.some(e=>e.detail.includes('Approved')));
 await post({action:'hold',id:d.id,hold:true});await assert.rejects(()=>post({action:'delete',id:d.id}));checks++;console.log('PASS legal hold blocks deletion');await post({action:'hold',id:d.id,hold:false});await post({action:'archive',id:d.id});info=await get('?document='+d.id);check('archive preserves versions',()=>info.document.archived===1&&info.versions.length===3);await post({action:'restore',id:d.id});await post({action:'delete',id:d.id});await post({action:'recover',id:d.id});info=await get('?document='+d.id);check('soft deletion and recovery',()=>info.document.deleted===0&&info.versions.length===3);
 await post({action:'correspondence',direction:'Incoming',subject:'Integration correspondence',party:'Test federation',priority:'Normal',document:d.id});state=await get();const c=state.correspondence[0];check('correspondence persisted',()=>c.subject==='Integration correspondence');await post({action:'closeCorrespondence',id:c.id});state=await get();check('correspondence resolved',()=>state.correspondence[0].status==='Closed');check('notifications persisted',()=>state.notifications.length>=2);check('audit trail persisted',()=>state.events.length>10);
 identityContext.enterWith(null);await assert.rejects(()=>get(),/AUTH_REQUIRED/);checks++;console.log('PASS anonymous access rejected');
 console.log(`\n${checks} integration checks passed using local SQLite + filesystem.`);
}finally{closeDatabase();fs.rmSync(testDir,{recursive:true,force:true});}
