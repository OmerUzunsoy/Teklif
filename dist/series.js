import {categories,categoryById} from './catalog.js';
import {makeGame,viewGame,expire,check,shuffle} from './engine.js';

export function normalizePlan(plan={},firstCategory='heroes',allowEmpty=false){
 const mode=plan.mode||'single';check(['single','playlist','vote'].includes(mode),'Oynama şeklini seçin.');
 const playlist=Array.isArray(plan.playlist)?[...plan.playlist]:[firstCategory];
 if(mode==='playlist'){check(playlist.length>=(allowEmpty?0:1)&&playlist.length<=10,'Oyun listesine 1–10 tur ekleyin.');check(playlist.every(id=>categoryById(id)),'Listede bilinmeyen kategori var.');}
 const rounds=Number(plan.rounds??5);if(mode==='vote')check(Number.isInteger(rounds)&&rounds>=1&&rounds<=10,'1–10 tur seçin.');
 return {mode,playlist:mode==='playlist'?playlist:[],rounds:mode==='playlist'?playlist.length:mode==='single'?1:rounds};
}
function roundSettings(series,categoryId){return {...series.settings,categoryId,variant:categoryId==='heroes'?series.settings.variant:'all'};}
function people(series){return series.players.map(({id,name})=>({id,name}));}
function eligible(series){return categories.filter(c=>c.cards.filter(card=>c.id!=='heroes'||series.settings.variant==='all'||card.universe===series.settings.variant).length>=series.players.length*series.settings.slots+(series.settings.jokers?1:0));}
export function startMatch(settings,members,plan={},rng=Math.random){
 const config=normalizePlan(plan,settings.categoryId);
 if(config.mode==='single')return {game:makeGame(settings,members,rng),series:null};
 const first=config.mode==='playlist'?config.playlist[0]:settings.categoryId;
 const game=makeGame({...settings,categoryId:first,variant:first==='heroes'?settings.variant:'all'},members,rng);
 const series={mode:config.mode,playlist:config.playlist,totalRounds:config.rounds,round:1,phase:'playing',revision:0,settings:{...game.settings,variant:settings.variant||'all'},players:game.players.map(({id,name})=>({id,name,total:0})),results:[],vote:null,lastVote:null};
 const valid=eligible(series).map(c=>c.id);
 if(config.mode==='playlist')check(config.playlist.every(id=>valid.includes(id)),'Bir kategorinin havuzu bu oyuncu ve kart sayısına yetmiyor.');
 else check(valid.length>=3,'Oylama için en az üç uygun kategori gerekli.');
 return {game,series};
}
export function standings(series){const sorted=[...series.players].sort((a,b)=>b.total-a.total);return sorted.map(p=>({...p,rank:1+sorted.filter(other=>other.total>p.total).length}));}
export function automaticPlacements(game){const totals=game.players.map(p=>({id:p.id,total:p.cards.reduce((sum,c)=>sum+c.score,0)}));return totals.map(p=>({id:p.id,rank:1+totals.filter(other=>other.total>p.total).length}));}
function validatePlaces(series,placements){
 check(Array.isArray(placements)&&placements.length===series.players.length,'Her oyuncunun sırasını belirleyin.');
 check(new Set(placements.map(p=>p.id)).size===series.players.length&&placements.every(p=>series.players.some(player=>player.id===p.id)),'Oyuncu listesi eşleşmiyor.');
 check(placements.every(p=>Number.isInteger(p.rank)&&p.rank>=1&&p.rank<=series.players.length),'Geçerli sıralar seçin.');
 // Competition ranking: 1,1,3 is valid; 1,1,2 would reward the same place twice.
 const sorted=[...placements].sort((a,b)=>a.rank-b.rank);
 for(let i=0;i<sorted.length;i++)check(sorted[i].rank===1+sorted.filter(p=>p.rank<sorted[i].rank).length,'Beraberlikte aynı sırayı verin; sonraki sırayı atlayın (1, 1, 3 gibi).');
}
function recordRound(holder,placements){
 const {game,series}=holder;check(game.status==='finished','Önce turu bitirin.');check(!series.results.some(r=>r.round===series.round),'Bu tur zaten puanlandı.');
 validatePlaces(series,placements);
 const result={round:series.round,categoryId:game.settings.categoryId,game:viewGame(game),placements:placements.map(p=>({id:p.id,name:series.players.find(other=>other.id===p.id).name,rank:p.rank,points:series.players.length-p.rank+1}))};
 for(const p of result.placements)series.players.find(other=>other.id===p.id).total+=p.points;
 series.results.push(result);series.phase=series.round===series.totalRounds?'finished':'between';series.revision++;
}
export function rankRound(holder,placements,revision){const s=holder.series;check(s&&s.phase==='review','Bu tur sıralama beklemiyor.');check(s.revision===revision,'Sıralama güncellendi. Yeniden deneyin.');recordRound(holder,placements);return holder;}
function nextRound(holder,categoryId,rng){const s=holder.series;const game=makeGame(roundSettings(s,categoryId),people(s),rng);holder.game=game;s.round++;s.phase='playing';s.vote=null;s.revision++;}
export function advanceSeries(holder,revision,now=Date.now(),rng=Math.random){
 const s=holder.series;check(s&&s.phase==='between','Önce tur sıralamasını kesinleştirin.');check(s.revision===revision,'Seri ilerledi. Güncel ekrandan deneyin.');
 if(s.mode==='playlist')nextRound(holder,s.playlist[s.round],rng);
 else{
  const used=s.results.map(r=>r.categoryId),pool=eligible(s),fresh=pool.filter(c=>!used.includes(c.id)),options=fresh.length>=3?fresh:pool;
  s.vote={round:s.round+1,candidates:shuffle(options.map(c=>c.id),rng).slice(0,3),votes:{},deadline:null};s.phase='voting';s.revision++;
 }
 return holder;
}
export function castVote(holder,playerId,categoryId,round,now=Date.now()){
 const s=holder.series;check(s?.phase==='voting'&&s.vote.round===round,'Bu oylama sona erdi.');check(s.players.some(p=>p.id===playerId),'Oyuncu bulunamadı.');check(s.vote.candidates.includes(categoryId),'Bu kategori oylamada yok.');
 check(!s.vote.deadline||now<s.vote.deadline,'Oylama süresi doldu.');
 if(s.vote.votes[playerId]===categoryId)return holder;
 s.vote.votes[playerId]=categoryId;s.vote.deadline??=now+10000;
 if(s.players.every(p=>s.vote.votes[p.id]))s.vote.deadline=Math.min(s.vote.deadline,now+3000);
 s.revision++;return holder;
}
export function syncMatch(holder,now=Date.now(),rng=Math.random){
 let changed=holder.game?expire(holder.game,now):false;const s=holder.series;if(!s)return changed;
 if(s.phase==='playing'&&holder.game.status==='finished'){
  if(holder.game.settings.scoring==='points')recordRound(holder,automaticPlacements(holder.game));
  else{s.phase='review';s.revision++;}changed=true;
 }
 if(s.phase==='voting'&&s.vote.deadline&&now>=s.vote.deadline){
  const counts=s.vote.candidates.map(id=>({id,count:Object.values(s.vote.votes).filter(v=>v===id).length}));
  const best=Math.max(...counts.map(c=>c.count)),tied=counts.filter(c=>c.count===best),chosen=shuffle(tied,rng)[0].id;
  const lastVote={round:s.vote.round,counts,chosen,tied:tied.length>1};
  nextRound(holder,chosen,rng);s.lastVote=lastVote;changed=true;
 }
 return changed;
}
export function seriesSummary(series){
 return `TEKLİF · ${series.mode==='playlist'?'Oyun listesi':'Oylamalı seri'}\n${series.results.length}/${series.totalRounds} tur tamamlandı\n\nGENEL SIRALAMA\n`+standings(series).map(p=>`${p.rank}. ${p.name} — ${p.total} seri puanı`).join('\n')+'\n\nTUR SONUÇLARI\n'+series.results.map(r=>`${r.round}. tur · ${categoryById(r.categoryId).name}\n`+[...r.placements].sort((a,b)=>a.rank-b.rank).map(p=>`${p.rank}. ${p.name} — +${p.points} puan`).join('\n')).join('\n\n');
}
