import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const banned=['decrypt','mythos','pylingo','ballet','cipher','ritual','glyph','myth','oracle','signal','founder','hat','hourglass','license gate','roomgate','studioos','openai','anthropic','audit payload','backend secret','operator-only','raw source filenames'];
const targets=['src/pages','src/components'];
function files(d){return readdirSync(d).flatMap(n=>{const p=join(d,n);return statSync(p).isDirectory()?files(p):[p];});}
let bad=[];
for(const t of targets){for(const f of files(new URL(`../${t}`,import.meta.url).pathname)){const c=readFileSync(f,'utf8').toLowerCase();for(const b of banned){if(c.includes(b)) bad.push(`${f}: ${b}`);}}}
if(bad.length){console.error('Banned terms found:\n'+bad.join('\n'));process.exit(1);}console.log('Guest-bound banned terms check passed.');
