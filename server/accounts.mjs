import {randomBytes,randomUUID,scrypt as scryptCallback,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {env} from './storage.mjs';
const scrypt=promisify(scryptCallback);
const roles=['Super Administrator','Records Manager','Department Administrator','Staff Member','Executive / Approver','Read-Only User'];
const stmt=(sql,...args)=>env.DB.prepare(sql).bind(...args);
const one=(sql,...args)=>stmt(sql,...args).all().results[0];
const audit=(actor,action,target)=>stmt('INSERT INTO events VALUES(?,?,?,?,?,?)',randomUUID(),actor,action,target,'',new Date().toISOString());
const sessions=new Map(),attempts=new Map();
const sessionLife=8*60*60*1000;
export function setupRequired(){return !one('SELECT user_id FROM local_credentials LIMIT 1');}
function cleanEmail(value){const email=String(value||'').trim().toLowerCase();if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))throw new Error('Enter a valid email address.');return email;}
function cleanName(value){const name=String(value||'').trim();if(!name||name.length>120)throw new Error('Enter a name up to 120 characters.');return name;}
function checkPassword(value){if(typeof value!=='string'||value.length<12||Buffer.byteLength(value)>1024)throw new Error('Use a password of at least 12 characters (maximum 1,024 bytes).');return value;}
async function hashPassword(value){checkPassword(value);const salt=randomBytes(16).toString('hex');const hash=await scrypt(value,salt,64,{N:16384,r:8,p:1,maxmem:64*1024*1024});return `scrypt$${salt}$${hash.toString('hex')}`;}
async function verifyPassword(value,stored){const [,salt,hash]=stored.split('$');const actual=await scrypt(String(value||''),salt,64,{N:16384,r:8,p:1,maxmem:64*1024*1024});return timingSafeEqual(actual,Buffer.from(hash,'hex'));}
const dummyHash=await hashPassword(randomBytes(24).toString('hex'));
function invalidate(userId){for(const [key,s] of sessions)if(s.id===userId)sessions.delete(key);}
function issueSession(userId){for(const [key,s] of sessions)if(s.expires<Date.now())sessions.delete(key);const token=randomBytes(32).toString('hex');sessions.set(token,{id:userId,expires:Date.now()+sessionLife});return token;}
export function endSession(token){sessions.delete(token);}
export function sessionUser(token){const s=sessions.get(token);if(!s)return null;if(s.expires<Date.now()){sessions.delete(token);return null;}const user=one('SELECT id,email,name,role,active FROM users WHERE id=?',s.id);if(!user?.active){sessions.delete(token);return null;}return user;}
export function userIdentity(user){return user?{userId:user.id,email:user.email,displayName:user.name}:null;}
function requireAdmin(user){if(!user)throw new Error('AUTH_REQUIRED');if(user.role!=='Super Administrator')throw new Error('Administrator permission required.');}
export async function setup(body){
 if(!setupRequired())throw new Error('Administrator setup has already been completed.');
 const email=cleanEmail(body.email),name=cleanName(body.name),hash=await hashPassword(body.password);
 // Recheck after hashing: another request may have completed setup in the meantime.
 if(!setupRequired())throw new Error('Administrator setup has already been completed.');
 const id='local-administrator';
 env.DB.batch([stmt("INSERT INTO users(id,email,name,role,active) VALUES(?,?,?,'Super Administrator',1) ON CONFLICT(id) DO UPDATE SET email=excluded.email,name=excluded.name,role='Super Administrator',active=1",id,email,name),stmt('INSERT INTO local_credentials VALUES(?,?,?)',id,email,hash),audit(id,'Configured administrator login',id)]);
 return issueSession(id);
}
export async function login(body){
 const email=String(body.email||'').trim().toLowerCase();
 if(email.length>254||typeof body.password!=='string'||Buffer.byteLength(body.password)>1024)throw new Error('Email or password is incorrect.');
 const now=Date.now();for(const [key,value] of attempts)if(value.until<now)attempts.delete(key);
 const count=attempts.get(email)||{count:0,until:now+15*60*1000};
 if(count.count>=10){const error=new Error('Too many attempts. Try again in 15 minutes.');error.status=429;throw error;}
 count.count++;attempts.set(email,count);
 const row=one('SELECT c.*,u.active FROM local_credentials c JOIN users u ON u.id=c.user_id WHERE c.login=?',email);
 const matches=await verifyPassword(body.password,row?.password_hash||dummyHash);
 if(!matches||!row?.active)throw new Error('Email or password is incorrect.');
 attempts.delete(email);return issueSession(row.user_id);
}
export async function accountAction(user,body){
 if(!user)throw new Error('AUTH_REQUIRED');
 if(body.action==='changePassword'){
  const credentials=one('SELECT password_hash FROM local_credentials WHERE user_id=?',user.id);
  if(typeof body.currentPassword!=='string'||Buffer.byteLength(body.currentPassword)>1024||!await verifyPassword(body.currentPassword,credentials.password_hash))throw new Error('Current password is incorrect.');
  const hash=await hashPassword(body.password);
  env.DB.batch([stmt('UPDATE local_credentials SET password_hash=? WHERE user_id=?',hash,user.id),audit(user.id,'Changed own password',user.id)]);invalidate(user.id);return {ok:true,signInAgain:true};
 }
 requireAdmin(user);
 if(body.action==='create'){
  const name=cleanName(body.name),email=cleanEmail(body.email);if(!roles.includes(body.role))throw new Error('Choose a valid role.');
  const hash=await hashPassword(body.password);if(one('SELECT user_id FROM local_credentials WHERE login=?',email))throw new Error('An account with this email already exists.');
  const id=randomUUID();env.DB.batch([stmt('INSERT INTO users VALUES(?,?,?,?,1)',id,email,name,body.role),stmt('INSERT INTO local_credentials VALUES(?,?,?)',id,email,hash),audit(user.id,'Created user account',id)]);return {ok:true};
 }
 if(body.action==='resetPassword'){
  const id=String(body.id||'');if(id===user.id)throw new Error('Use Change password for your own account.');
  if(!one('SELECT user_id FROM local_credentials WHERE user_id=?',id))throw new Error('Account not found.');
  const hash=await hashPassword(body.password);env.DB.batch([stmt('UPDATE local_credentials SET password_hash=? WHERE user_id=?',hash,id),audit(user.id,'Reset user password',id)]);invalidate(id);return {ok:true};
 }
 throw new Error('Unknown account action.');
}
