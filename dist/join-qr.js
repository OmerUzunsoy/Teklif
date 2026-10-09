import {qrcodegen} from './qr-code-generator.js';
const cache=new Map();
export function qrSVG(text){
 if(cache.has(text))return cache.get(text);
 const code=qrcodegen.QrCode.encodeText(text,qrcodegen.QrCode.Ecc.MEDIUM),border=4,size=code.size+border*2,parts=[];
 for(let y=0;y<code.size;y++)for(let x=0;x<code.size;x++)if(code.getModule(x,y))parts.push(`M${x+border},${y+border}h1v1h-1z`);
 const svg=`<svg class="join-qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="256" height="256" role="img" aria-label="Odaya katılmak için QR kod" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${parts.join('')}" fill="#111"/></svg>`;
 if(cache.size>=20)cache.delete(cache.keys().next().value);cache.set(text,svg);return svg;
}
export function joinQR(link){
 try{return `<div class="join-qr-box">${qrSVG(link)}<strong>Kameranla okut, masaya katıl.</strong><small>Telefonun aynı Wi-Fi’ye bağlı olsun.</small></div>`;}
 catch{return '<p class="fine">QR gösterilemiyor. Katılmak için oda bağlantısını kullanabilirsin.</p>';}
}
