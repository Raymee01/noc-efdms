import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Automatically load .env if present
try{
 const envPath=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','.env');
 if(fs.existsSync(envPath)&&process.loadEnvFile){process.loadEnvFile(envPath);}
}catch(e){}

export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const dataDir=path.resolve(process.env.NOC_DATA_DIR||path.join(root,'data'));
fs.mkdirSync(dataDir,{recursive:true,mode:0o700});
const db=new DatabaseSync(path.join(dataDir,'records.sqlite'));
db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS local_migrations(name TEXT PRIMARY KEY)');
for(const name of fs.readdirSync(path.join(root,'drizzle')).filter(n=>n.endsWith('.sql')).sort()){
 if(db.prepare('SELECT name FROM local_migrations WHERE name=?').get(name))continue;
 db.exec('BEGIN IMMEDIATE');
 try{db.exec(fs.readFileSync(path.join(root,'drizzle',name),'utf8'));db.prepare('INSERT INTO local_migrations VALUES(?)').run(name);db.exec('COMMIT');}
 catch(e){db.exec('ROLLBACK');throw e;}
}
class Statement{
 constructor(sql,args=[]){this.sql=sql;this.args=args;}
 bind(...args){return new Statement(this.sql,args);}
 all(){return {results:db.prepare(this.sql).all(...this.args)};}
 run(){return db.prepare(this.sql).run(...this.args);}
}
const uploads=path.join(dataDir,'uploads');fs.mkdirSync(uploads,{recursive:true,mode:0o700});
function objectPath(key){if(!/^documents\/[a-f0-9-]+\/[a-f0-9-]+$/.test(key))throw new Error('Invalid storage key');return path.join(uploads,key);}

let bucketStorage={
 async put(key,bytes){const p=objectPath(key);fs.mkdirSync(path.dirname(p),{recursive:true,mode:0o700});fs.writeFileSync(p,bytes,{mode:0o600});},
 async get(key){try{return {body:new Uint8Array(fs.readFileSync(objectPath(key)))}}catch(e){if(e.code==='ENOENT')return null;throw e;}},
 async delete(key){fs.rmSync(objectPath(key),{force:true});}
};

const r2AccountId=process.env.R2_ACCOUNT_ID;
const r2AccessKeyId=process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey=process.env.R2_SECRET_ACCESS_KEY;
const r2BucketName=process.env.R2_BUCKET_NAME;

if(r2AccountId&&r2AccessKeyId&&r2SecretAccessKey&&r2BucketName){
 try{
  const {S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand}=await import('@aws-sdk/client-s3');
  const s3=new S3Client({
   region:'auto',
   endpoint:`https://${r2AccountId}.r2.cloudflarestorage.com`,
   credentials:{
    accessKeyId:r2AccessKeyId,
    secretAccessKey:r2SecretAccessKey
   }
  });
  bucketStorage={
   async put(key,bytes,options={}){
    const cmd=new PutObjectCommand({
     Bucket:r2BucketName,
     Key:key,
     Body:Buffer.from(bytes),
     ContentType:options?.httpMetadata?.contentType||'application/octet-stream'
    });
    await s3.send(cmd);
   },
   async get(key){
    try{
     const cmd=new GetObjectCommand({Bucket:r2BucketName,Key:key});
     const res=await s3.send(cmd);
     const chunks=[];
     for await(const chunk of res.Body){chunks.push(chunk);}
     return {body:new Uint8Array(Buffer.concat(chunks))};
    }catch(e){
     if(e.name==='NoSuchKey'||e.$metadata?.httpStatusCode===404)return null;
     throw e;
    }
   },
   async delete(key){
    const cmd=new DeleteObjectCommand({Bucket:r2BucketName,Key:key});
    await s3.send(cmd);
   }
  };
  console.log(`Cloudflare R2 active: connected to bucket "${r2BucketName}".`);
 }catch(err){
  console.error('Failed to initialize Cloudflare R2 client, falling back to local disk storage:',err.message);
 }
}

export const env={DB:{prepare:sql=>new Statement(sql),batch(statements){db.exec('BEGIN IMMEDIATE');try{const results=statements.map(s=>s.run());db.exec('COMMIT');return results;}catch(e){db.exec('ROLLBACK');throw e;}}},BUCKET:bucketStorage};
export function closeDatabase(){db.close();}
