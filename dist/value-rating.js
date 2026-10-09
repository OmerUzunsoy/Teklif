import {categoryById} from './catalog.js';
// Compare the editorial value with the normal per-card budget in this category.
export function valueRating(card,settings){
 const pool=categoryById(settings.categoryId)?.cards.filter(c=>!settings.variant||settings.variant==='all'||c.universe===settings.variant)||[];
 if(!pool.length||!(card.paid>0)||!(card.score>0))return null;
 const average=pool.reduce((sum,c)=>sum+c.score,0)/pool.length;
 const reference=settings.budget/settings.slots*card.score/average,ratio=reference/card.paid;
 const stars=ratio>=1.6?5:ratio>=1.15?4:ratio>=.8?3:ratio>=.5?2:1;
 return {stars,referencePrice:Math.round(reference*10)/10,label:['','Pahalı seçim','Biraz pahalı','Dengeli alış','İyi fırsat','Harika fırsat'][stars]};
}
