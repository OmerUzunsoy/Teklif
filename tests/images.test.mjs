import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {categories} from '../dist/catalog.js';
import {imageCards} from '../dist/image-cards.js';
import {imageManifest,imageFor} from '../image-store.mjs';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:4177';
test('screen appearances keep character identities and do not overwrite similarly named media',()=>{
 const manifest=imageManifest();
 for(const id of ['heroes-79','villains-19']){
  assert.equal(manifest[id].kind,'screen');
  assert.match(manifest[id].title,/Willem Dafoe.*Green Goblin.*No Way Home/);
  assert.match(manifest[id].description,/Norman Osborn/);
 }
 assert.equal(manifest['heroes-79'].url,manifest['villains-19'].url);
 assert.match(manifest['heroes-7'].description,/Bruce Wayne/);
 assert.match(manifest['heroes-7'].title,/Christian Bale/);
 assert.notEqual(manifest['heroes-5'].url,manifest['movies-43'].url);
 assert.equal(manifest['movies-43'].kind,'cover');
 assert.notEqual(manifest['heroes-66'].url,manifest['foreign-series-67'].url);
});
test('every playable card has a downloaded factual image with matching metadata',{skip:process.env.TEKLIF_TEST_IMAGES!=='1'},async()=>{const manifest=imageManifest();for(const category of categories)for(const card of category.cards){const asset=manifest[card.id];assert.ok(asset?.source&&asset.title,card.name);assert.ok(imageCards[card.id]?.version,card.name);const url=new URL(asset.url);if(url.hostname.endsWith('.wikimedia.org'))url.search='';const key=createHash('sha256').update(url.href).digest('hex');assert.ok(fs.existsSync(new URL('../.runtime/images/'+key,import.meta.url)),card.name+' must already be saved');const image=await imageFor(card.id);assert.equal(fs.statSync(image.file).size,image.size,card.name);const file=fs.openSync(image.file,'r'),bytes=Buffer.alloc(4096);const n=fs.readSync(file,bytes,0,4096,0);fs.closeSync(file);const b=bytes.subarray(0,n);const valid=image.type==='image/jpeg'?b[0]===255&&b[1]===216:image.type==='image/png'?b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):image.type==='image/webp'?b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP':image.type==='image/gif'?b.toString('ascii',0,3)==='GIF':image.type==='image/svg+xml'?b.toString().includes('<svg'):image.type==='image/avif'?b.toString('ascii',4,8)==='ftyp':false;assert.ok(valid,card.name+' image bytes');}});
test('the server serves real image files across all categories and rejects unknown cards',{skip:process.env.TEKLIF_TEST_IMAGES!=='1'},async()=>{for(const c of categories){const r=await fetch(origin+'/api/image/'+c.cards[0].id,{method:'HEAD'});assert.equal(r.status,200,c.name);assert.match(r.headers.get('content-type'),/^image\//);}assert.equal((await fetch(origin+'/api/image/not-a-card-999999')).status,404);});
