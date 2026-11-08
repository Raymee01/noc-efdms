import {AsyncLocalStorage} from 'node:async_hooks';
export const identityContext=new AsyncLocalStorage();
export async function getLocalUser(){return identityContext.getStore()||null;}
