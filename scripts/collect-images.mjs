import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {allCategories as categories} from '../dist/catalog.js';
import {imageFor} from '../image-store.mjs';
const sources=['character','media','lifestyle','sports'];
const manifest={};for(const source of sources){try{Object.assign(manifest,JSON.parse(fs.readFileSync('/tmp/teklif-'+source+'-images.json','utf8')));}catch{}}
// Reviewed local assets take precedence over old research files.
try{Object.assign(manifest,JSON.parse(fs.readFileSync(new URL('../dist/image-manifest.json',import.meta.url),'utf8')));}catch{}
for(const cat of categories)for(const card of cat.cards)if(manifest[card.id])manifest[card.id].cardName=card.name;
fs.writeFileSync(new URL('../dist/image-manifest.json',import.meta.url),JSON.stringify(manifest,null,2));
const missing=categories.flatMap(c=>c.cards.filter(card=>!manifest[card.id]).map(card=>({category:c.id,...card})));
fs.writeFileSync(new URL('../image-missing.json',import.meta.url),JSON.stringify(missing,null,2));
console.log('Eşleştirilen',Object.keys(manifest).length,'eksik',missing.length);
if(process.argv.includes('--download')){let done=0,failed=[];let previous=[];try{previous=JSON.parse(fs.readFileSync(new URL('../image-download-errors.json',import.meta.url)));}catch{}const skip=process.argv.includes('--skip-failed')?new Set(previous.filter(x=>!x.url||x.url===manifest[x.id]?.url).map(x=>x.id)):new Set();const entries=Object.keys(manifest).filter(id=>!skip.has(id));let cursor=0;await Promise.all(Array.from({length:4},async()=>{while(cursor<entries.length){const id=entries[cursor++];try{await imageFor(id);}catch(e){failed.push({id,url:manifest[id].url,message:e.message});console.log('Görsel atlandı',id,e.message);}if(++done%100===0)console.log('Kaydedilen/denenen',done,'hata',failed.length);}}));const remaining=[...previous.filter(x=>skip.has(x.id)),...failed].filter(x=>{const a=manifest[x.id];if(!a)return false;const u=new URL(a.url);if(u.hostname.endsWith('.wikimedia.org'))u.search='';return !fs.existsSync(new URL('../.runtime/images/'+createHash('sha256').update(u.href).digest('hex'),import.meta.url));}).map(x=>({...x,url:manifest[x.id].url}));fs.writeFileSync(new URL('../image-download-errors.json',import.meta.url),JSON.stringify(remaining,null,2));console.log('İndirilen',done-failed.length,'hata',failed.length);}

if(process.argv.includes('--publish')){const ready={};for(const [id,a] of Object.entries(manifest)){const url=new URL(a.url);if(url.hostname.endsWith('.wikimedia.org'))url.search='';const key=createHash('sha256').update(url.href).digest('hex');if(fs.existsSync(new URL('../.runtime/images/'+key,import.meta.url))&&fs.existsSync(new URL('../.runtime/images/'+key+'.json',import.meta.url)))ready[id]={kind:a.kind||'photo',subject:a.title||a.cardName,version:key.slice(0,12),...(a.appearance?{appearance:a.appearance}:{})};}
for(const c of categories){const n=c.cards.filter(x=>ready[x.id]).length;console.log(c.id,n);if(n<30)throw new Error(c.name+' için en az30 görsel gerekiyor: '+n);}
fs.writeFileSync(new URL('../dist/image-cards.js',import.meta.url),'export const imageCards='+JSON.stringify(ready)+';\n');console.log('Aktif fotoğraflı kartlar:',Object.keys(ready).length);}
