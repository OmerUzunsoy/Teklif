import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {deflateSync} from 'node:zlib';
import {qrSVG} from '../dist/join-qr.js';
let canDecode=process.platform==='darwin';
if(canDecode)try{execFileSync('/usr/bin/xcode-select',['-p'],{stdio:'ignore'});}catch{canDecode=false;}
function crc32(data){let c=0xffffffff;for(const byte of data){c^=byte;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;}return (c^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),body=Buffer.concat([name,data]),size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(body));return Buffer.concat([size,body,crc]);}
function svgPNG(svg){const size=Number(svg.match(/viewBox="0 0 (\d+)/)[1]),scale=8,width=size*scale,pixels=Buffer.alloc(width*(width+1),255);for(let y=0;y<width;y++)pixels[y*(width+1)]=0;for(const match of svg.matchAll(/M(\d+),(\d+)h1v1h-1z/g)){const x=Number(match[1])*scale,y=Number(match[2])*scale;for(let dy=0;dy<scale;dy++)pixels.fill(0,(y+dy)*(width+1)+1+x,(y+dy)*(width+1)+1+x+scale);}const header=Buffer.alloc(13);header.writeUInt32BE(width,0);header.writeUInt32BE(width,4);header[8]=8;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);}
test('room QR images decode to the exact join URLs with an independent macOS decoder',{skip:!canDecode,timeout:60000},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'teklif-qr-')),urls=['http://192.168.1.69:4177/?room=A7B92','http://10.0.0.12:4177/?room=F7C41','https://example.test/oyun?room=AAAA1&isim=Ömer'];
 try{const files=urls.map((url,i)=>{const file=path.join(dir,i+'.png');fs.writeFileSync(file,svgPNG(qrSVG(url)));return file;});const output=execFileSync('/usr/bin/swift',[new URL('../scripts/verify-qr.swift',import.meta.url).pathname,...files],{encoding:'utf8',timeout:55000});assert.deepEqual(JSON.parse(output),urls);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
