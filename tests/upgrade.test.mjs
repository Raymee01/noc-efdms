import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'noc-upgrade-'));
process.env.NOC_DATA_DIR=dir;
const old=new DatabaseSync(path.join(dir,'records.sqlite'));
old.exec('CREATE TABLE local_migrations(name TEXT PRIMARY KEY)');
for(const name of fs.readdirSync('drizzle').filter(n=>n.endsWith('.sql')&&!n.startsWith('0003')).sort()){old.exec(fs.readFileSync('drizzle/'+name,'utf8'));old.prepare('INSERT INTO local_migrations VALUES(?)').run(name);}
old.prepare('INSERT INTO users VALUES(?,?,?,?,?)').run('local-administrator','local@noc.test','Local Administrator','Super Administrator',1);
old.prepare('INSERT INTO folders VALUES(?,?,?,?,?,?,?)').run('legacy','Legacy folder',null,'',0,0,new Date().toISOString());
old.prepare('INSERT INTO documents(id,ref,title,folder,owner,classification,created,updated) VALUES(?,?,?,?,?,?,?,?)').run('legacy-doc','LEGACY/001','Existing record','legacy','local-administrator','CONFIDENTIAL','2026-10-01','2026-10-01');
old.close();
const {closeDatabase}=await import('../server/storage.mjs');
try{
 const {setup,setupRequired,sessionUser}=await import('../server/accounts.mjs');
 assert.equal(setupRequired(),true);
 const token=await setup({email:'owner@example.test',name:'Existing owner',password:'Migration-password-123'});
 assert.equal(sessionUser(token).id,'local-administrator');assert.equal(setupRequired(),false);
 const check=new DatabaseSync(path.join(dir,'records.sqlite'));
 assert.equal(check.prepare('SELECT COUNT(*) n FROM users').get().n,1);
 assert.equal(check.prepare('SELECT owner FROM documents').get().owner,'local-administrator');
 assert.equal(check.prepare('SELECT COUNT(*) n FROM local_migrations').get().n,4);
 const credentials=check.prepare('SELECT password_hash FROM local_credentials').get();assert.ok(credentials.password_hash.startsWith('scrypt$'));assert.ok(!credentials.password_hash.includes('Migration-password-123'));
 check.close();console.log('PASS upgrade preserves existing administrator identity and documents; passwords stored as salted hashes');
}finally{closeDatabase();fs.rmSync(dir,{recursive:true,force:true});}
