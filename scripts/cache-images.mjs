import {categories} from '../dist/catalog.js';
import {imageFor} from '../image-store.mjs';
const cards=categories.flatMap(category=>category.cards);
let cursor=0,done=0,failed=0;
console.log(`${cards.length} aktif kartın görselleri hazırlanıyor. Mevcut dosyalar yeniden indirilmez.`);
await Promise.all(Array.from({length:3},async()=>{
 while(cursor<cards.length){const card=cards[cursor++];try{await imageFor(card.id);}catch(error){failed++;console.error(`${card.id} · ${card.name}: ${error.message}`);}if(++done%100===0||done===cards.length)console.log(`${done}/${cards.length} kontrol edildi · ${failed} hata`);}
}));
console.log(failed?'Bazı görseller alınamadı. Aynı komutu daha sonra tekrar çalıştırabilirsiniz.':'Tüm aktif kart görselleri hazır.');
if(failed)process.exitCode=1;
