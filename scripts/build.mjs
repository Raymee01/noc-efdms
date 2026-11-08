import {build} from 'esbuild';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
await build({entryPoints:['src/main.tsx'],bundle:true,outfile:'public/assets/app.js',format:'esm',platform:'browser',target:['safari15','chrome100'],jsx:'automatic',minify:true,define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
await build({entryPoints:['src/service.ts'],bundle:true,outfile:'server/service.mjs',format:'esm',platform:'node',target:'node22',external:['../server/storage.mjs','../server/identity.mjs']});
console.log('Local edition built.');
