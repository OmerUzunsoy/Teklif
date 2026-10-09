import {imageCards} from './image-cards.js';
import {extraCategories,heroExpansion} from './extra-catalog.js';
import {newCategories} from './new-catalog.js';
const baseCategories = [
 {id:'heroes',name:'Kahraman takımı',group:'Karakterler',icon:'🦸',brief:'En iyi kahraman takımını topla.',metric:'Takım gücü',basis:'Güç, dayanıklılık ve çok yönlülük üzerine oyun içi değerlendirme.',cards:'Superman|Thor|Hulk|Doctor Strange|Scarlet Witch|Iron Man|Wonder Woman|Batman|Spider-Man|Captain America|Flash|Aquaman|Green Lantern|Captain Marvel|Black Panther|Wolverine|Deadpool|Vision|Ant-Man|Wasp|Hawkeye|Black Widow|Daredevil|Luke Cage|Jessica Jones|Iron Fist|Shazam|Supergirl|Cyborg|Green Arrow|Storm|Cyclops|Jean Grey|Beast|Nightcrawler|Rogue|Gambit|Professor X|Magneto|Silver Surfer|Star-Lord|Groot|Rocket|Gamora|Drax|Invincible|Omni-Man|Starlight|Queen Maeve|Kimiko'},
 {id:'clothing',name:'Giyim mağazası',group:'Yaşam',icon:'👕',brief:'Mağazanda hangi markalar olsun?',metric:'Mağaza cazibesi',basis:'Tanınırlık ve algılanan marka çekiciliği üzerine oyun içi değerlendirme.',cards:'Nike|Adidas|Zara|H&M|Levi’s|Puma|Lacoste|Tommy Hilfiger|Ralph Lauren|Calvin Klein|Gucci|Prada|Louis Vuitton|Chanel|Dior|Versace|Burberry|Armani|Fendi|Balenciaga|New Balance|Converse|Vans|Reebok|Under Armour|The North Face|Columbia|Timberland|Skechers|Mango|Massimo Dutti|Bershka|Pull&Bear|Stradivarius|Uniqlo|Gap|Benetton|Diesel|Guess|Superdry|LC Waikiki|Koton|Mavi|DeFacto|Colin’s|İpekyol|Vakko|Beymen|Kiğılı|D’S Damat'},
 {id:'food',name:'Restoran menüsü',group:'Yeme içme',icon:'🍽️',brief:'Masaya hangi lezzetleri getirirsin?',metric:'Menü cazibesi',basis:'Yaygın beğeni ve menü çekiciliği üzerine öznel oyun değerlendirmesi.',cards:'İskender|Adana kebap|Mantı|Lahmacun|Pizza|Hamburger|Döner|İçli köfte|Karnıyarık|Hünkar beğendi|Köfte|Beyti|Urfa kebap|Kuzu tandır|Çökertme kebabı|Ali nazik|Etli ekmek|Kuşbaşılı pide|Kaşarlı pide|Tavuk şiş|Çöp şiş|Patlıcan kebabı|Testi kebabı|Tas kebabı|Et sote|Tavuk sote|Fırında tavuk|Izgara somon|Levrek|Hamsi tava|Balık ekmek|Sushi|Ramen|Pad Thai|Taco|Burrito|Fajita|Risotto|Lazanya|Spagetti|Fettucine Alfredo|Falafel|Humus|Kuru fasulye|Nohut|Dolma|Yaprak sarma|Menemen|Mücver|Sebzeli güveç'}
].map(c=>({...c,cards:c.cards.split('|').map((name,i)=>({id:c.id+'-'+i,name,score:Math.round(95-i/(c.cards.split('|').length-1)*35),tag:c.group}))}));
const hero=baseCategories[0];
const marvel=new Set('Thor|Hulk|Doctor Strange|Scarlet Witch|Iron Man|Spider-Man|Captain America|Captain Marvel|Black Panther|Wolverine|Deadpool|Vision|Ant-Man|Wasp|Hawkeye|Black Widow|Daredevil|Luke Cage|Jessica Jones|Iron Fist|Storm|Cyclops|Jean Grey|Beast|Nightcrawler|Rogue|Gambit|Professor X|Magneto|Silver Surfer|Star-Lord|Groot|Rocket|Gamora|Drax'.split('|'));
hero.cards=hero.cards.map(c=>({...c,universe:marvel.has(c.name)?'Marvel':['Invincible','Omni-Man'].includes(c.name)?'Invincible':['Starlight','Queen Maeve','Kimiko'].includes(c.name)?'The Boys':'DC'}));
for(const c of heroExpansion){if(!hero.cards.some(old=>old.name===c.name))hero.cards.push({...c,id:'heroes-'+hero.cards.length,tag:c.universe});}
for(const c of hero.cards)c.tag=c.universe;
export const originalCategories=[...baseCategories,...extraCategories];
export const allCategories=[...originalCategories,...newCategories];
export const categories=allCategories.map(c=>({...c,cards:c.cards.filter(card=>imageCards[card.id])}));
export const categoryById = id => categories.find(c=>c.id===id);
export const groups=['Hepsi','Yeni','Spor','Karakterler','Ekran','Müzik','Yeme içme','Yaşam'];
export const scoringNote='İlk denemeye ait editoryal oyun puanlarıdır; gerçek reyting, satış veya maç sonucu değildir. Aldığın kartların puanları toplanır. Harcanan jeton ek puan getirmez.';
