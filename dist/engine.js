import {categoryById} from './catalog.js';
import {valueRating} from './value-rating.js';
export function check(condition,message){if(!condition)throw new Error(message);}
export function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function makeGame(settings,people,rng=Math.random,now=Date.now()){
 const category=categoryById(settings.categoryId);check(category,'Kategori bulunamadı.');
 const slots=Number(settings.slots),budget=Number(settings.budget),timerSeconds=Number(settings.timerSeconds??10);
 check([5,10,15].includes(timerSeconds),'Teklif süresi 5, 10 veya 15 saniye olmalı.');
 check([3,5].includes(slots),'Kişi başına 3 veya 5 kart seçin.');check([20,30,50].includes(budget),'Geçerli bir bütçe seçin.');
 check(['debate','points'].includes(settings.scoring),'Sonuç seçeneği geçersiz.');check(people.length>=2&&people.length<=6,'2–6 oyuncu gerekli.');
 const names=people.map(p=>String(p.name||'').trim().slice(0,24));check(names.every(Boolean),'Her oyuncuya bir isim yazın.');check(new Set(names.map(n=>n.toLocaleLowerCase('tr'))).size===names.length,'Oyuncu isimleri farklı olsun.');
 const pool=category.cards.filter(c=>!settings.variant||settings.variant==='all'||c.universe===settings.variant);
 check(pool.length>=slots*people.length,'Bu havuz için oyuncu veya kart sayısını azaltın.');
 const jokers=settings.jokers===true;
 check(!jokers||pool.length>slots*people.length,'Joker için havuzda en az bir yedek kart gerekli. Evreni değiştir veya kart sayısını azalt.');
 const shuffled=shuffle(pool,rng),total=slots*people.length;
 const game={settings:{categoryId:category.id,slots,budget,timerSeconds,television:settings.television===true,pricePerformance:settings.pricePerformance===true,jokers,scoring:settings.scoring,variant:settings.variant||'all'},players:people.map((p,i)=>({id:p.id||'p'+i,name:names[i],budget,cards:[],jokersLeft:jokers?1:0})),deck:shuffled.slice(0,total),jokerPool:jokers?shuffled.slice(total):[],index:-1,revision:0,status:'bidding',price:0,leaderId:null,turnId:null,activeIds:[],openingCursor:0,history:[],lastSale:null,deadline:null,activity:[]};
 if(game.settings.television)queueReveal(game,now);else reveal(game,now);return game;
}
export function maxBid(game,id){const p=game.players.find(p=>p.id===id);return p?p.budget-Math.max(0,game.settings.slots-p.cards.length-1):0;}
// Only the opening bid has a turn. After that, every eligible challenger may bid.
export function canBid(game,id){
 const p=game.players.find(p=>p.id===id);
 return !!p&&game.status==='bidding'&&game.activeIds.includes(id)&&p.cards.length<game.settings.slots&&id!==game.leaderId&&maxBid(game,id)>=game.price+1&&(game.price>0||game.turnId===id);
}
function sell(game,now=Date.now()){const winner=game.players.find(p=>p.id===game.leaderId);check(winner,'Alıcı bulunamadı.');winner.budget-=game.price;const card={...game.deck[game.index],paid:game.price};if(game.settings.pricePerformance)card.deal=valueRating(card,game.settings);winner.cards.push(card);game.lastSale={playerId:winner.id,name:winner.name,remainingBudget:winner.budget,card};game.history.unshift(game.lastSale);game.status='sold';game.turnId=null;game.deadline=null;if(game.players.every(p=>p.cards.length===game.settings.slots))game.status='finished';game.autoNextAt=game.settings.television&&game.status==='sold'?now+5000:null;}
function settle(game,now){
 if(game.price>0){game.activeIds=game.activeIds.filter(id=>id===game.leaderId||maxBid(game,id)>=game.price+1);if(game.activeIds.length===1){sell(game,now);return;}}
 game.turnId=null;
}
function queueReveal(game,now){game.status='countdown';game.revealDeadline=now+3000;game.autoNextAt=null;game.deadline=null;game.turnId=null;game.leaderId=null;game.activeIds=[];game.price=0;}
function reveal(game,now=Date.now()){
 game.revealDeadline=null;game.autoNextAt=null;
 game.index++;if(game.index>=game.deck.length){game.status='finished';return;}
 game.status='bidding';game.deadline=null;game.price=0;game.leaderId=null;game.activeIds=game.players.filter(p=>p.cards.length<game.settings.slots).map(p=>p.id);
 let opener=null;for(let n=0;n<game.players.length;n++){const i=(game.openingCursor+n)%game.players.length;if(game.activeIds.includes(game.players[i].id)){opener=game.players[i];game.openingCursor=(i+1)%game.players.length;break;}}
 game.turnId=opener?.id||null;game.openingId=opener?.id||null;
 if(game.activeIds.length===1){game.leaderId=game.activeIds[0];game.price=1;sell(game,now);}
}
// Absolute deadlines keep all phones on the same auction clock.
export function prepareTimer(game,now=Date.now()){
 game.settings.timerSeconds??=10;game.activity??=[];
 game.settings.jokers??=false;for(const p of game.players)p.jokersLeft??=0;
 if(game.status==='bidding'&&game.price>0)game.turnId=null;
 if(game.status==='bidding'&&game.price>0&&game.deadline==null)game.deadline=now+game.settings.timerSeconds*1000;
}
export function expire(game,now=Date.now()){
 prepareTimer(game,now);
 if(game.status==='countdown'&&now>=game.revealDeadline){reveal(game,now);game.revision++;return true;}
 if(game.settings.television&&game.status==='sold'&&game.autoNextAt&&now>=game.autoNextAt){queueReveal(game,now);game.revision++;return true;}
 if(game.status!=='bidding'||!game.leaderId||now<game.deadline)return false;
 sell(game,now);game.revision++;return true;
}
export function act(game,id,type,amount,revision,now=Date.now()){
 const before=game.status;if(expire(game,now))throw new Error(before==='bidding'?'Süre doldu. Kart son teklif sahibine gitti.':'Oyun ilerledi. Güncel ekrandan tekrar deneyin.');
 check(revision===game.revision,'Oyun ilerledi. Güncel ekrandan tekrar deneyin.');
 if(type==='next'){check(game.status==='sold','Henüz sıradaki karta geçilemez.');if(game.settings.television)queueReveal(game,now);else reveal(game,now);}
 else{check(game.status==='bidding','Bu açık artırma bitti.');
  check(game.players.some(p=>p.id===id),'Oyuncu bulunamadı.');
  if(game.price===0)check(game.turnId===id,'İlk teklifi açılış sırasındaki oyuncu vermeli.');
  check(game.activeIds.includes(id),'Bu karta artık teklif veremezsin.');
  check(game.leaderId!==id,'En yüksek teklif zaten sende. Başka birinin artırmasını bekle.');
  if(type==='bid'){check(canBid(game,id),'Bu karta teklif vermek için yeterli bütçen veya boş yerin yok.');const value=Number(amount);check(Number.isInteger(value)&&value===game.price+1,'Teklif yalnızca 1 jeton artırılabilir.');check(value<=maxBid(game,id),'Diğer kartların için en az birer jeton ayırmalısın.');game.price=value;game.leaderId=id;game.deadline=now+game.settings.timerSeconds*1000;game.activity.unshift({seq:game.revision+1,cardId:game.deck[game.index].id,name:game.players.find(p=>p.id===id).name,type:'bid',amount:value,at:now});game.activity=game.activity.slice(0,12);settle(game,now);}
  else if(type==='pass'){check(game.price>0,'Açılış sırası sende: 1 jeton teklif ver.');game.activeIds=game.activeIds.filter(active=>active!==id);game.activity.unshift({seq:game.revision+1,cardId:game.deck[game.index].id,name:game.players.find(p=>p.id===id).name,type:'pass',at:now});game.activity=game.activity.slice(0,12);settle(game,now);}
  else if(type==='joker'){
   check(game.settings.jokers,'Bu oyunda jokerler kapalı.');check(game.price===0&&!game.leaderId,'Joker yalnızca ilk tekliften önce kullanılabilir.');
   const player=game.players.find(p=>p.id===id);check(player.jokersLeft>0,'Bu turdaki jokerini kullandın.');check(game.jokerPool?.length,'Yedek kart bulunamadı.');
   const previous=game.deck[game.index],replacement=game.jokerPool.shift();game.deck[game.index]=replacement;game.jokerPool.push(previous);player.jokersLeft--;
   game.activity.unshift({seq:game.revision+1,cardId:replacement.id,name:player.name,type:'joker',previousCardName:previous.name,at:now});game.activity=game.activity.slice(0,12);
  }
  else throw new Error('İşlem tanınmadı.');
 }
 game.revision++;return game;
}
export function viewGame(game){const {deck,jokerPool,...view}=game;const finished=game.status==='finished';const hide=card=>finished?card:{id:card.id,name:card.name,tag:card.tag,universe:card.universe,paid:card.paid,...(game.settings.pricePerformance&&card.deal?{deal:card.deal}:{})};return {...view,totalCards:deck.length,current:game.status==='countdown'?null:hide(deck[game.index]),players:game.players.map(p=>({...p,cards:p.cards.map(hide),total:finished&&game.settings.scoring==='points'?p.cards.reduce((sum,c)=>sum+c.score,0):null})),history:game.history.map(s=>({...s,card:hide(s.card)})),lastSale:game.lastSale?{...game.lastSale,card:hide(game.lastSale.card)}:null};}
