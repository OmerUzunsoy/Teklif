import test from 'node:test';
import assert from 'node:assert/strict';
import {makeGame,act,canBid,prepareTimer,expire,viewGame} from '../dist/engine.js';
import {createAuctionUI} from '../dist/auction-ui.js';
import {createTVUI} from '../dist/tv-ui.js';
import {createTurnNotice} from '../dist/turn-notice.js';
const people=Array.from({length:6},(_,i)=>({id:'p'+i,name:'Oyuncu '+i}));
const settings={categoryId:'heroes',slots:3,budget:20,scoring:'debate',timerSeconds:10};
const game=()=>makeGame(settings,people,()=>.5,1000);
const bid=(g,id,now)=>act(g,id,'bid',g.price+1,g.revision,now);
function rejected(g,action){const before=JSON.stringify(g);assert.throws(action);assert.equal(JSON.stringify(g),before);}
test('after the designated opener, any challenger can raise in arbitrary order and each bid resets the clock',()=>{
 const g=game();assert.deepEqual(people.filter(p=>canBid(g,p.id)).map(p=>p.id),['p0']);
 rejected(g,()=>bid(g,'p5',1000));bid(g,'p0',1000);assert.equal(g.turnId,null);
 assert.deepEqual(people.filter(p=>canBid(g,p.id)).map(p=>p.id),['p1','p2','p3','p4','p5']);
 for(const [i,id] of ['p5','p2','p5','p0','p3'].entries()){bid(g,id,2000+i*500);assert.equal(g.leaderId,id);assert.equal(g.turnId,null);assert.equal(g.deadline,12000+i*500);}
 rejected(g,()=>bid(g,'p3',4500));rejected(g,()=>act(g,'p3','pass',null,g.revision,4500));
 assert.equal(expire(g,g.deadline-1),false);assert.equal(expire(g,g.deadline),true);assert.equal(g.lastSale.playerId,'p3');assert.equal(g.lastSale.card.paid,6);assert.equal(g.lastSale.remainingBudget,14);
 act(g,null,'next',null,g.revision,20000);assert.equal(g.turnId,'p1');assert.equal(g.deadline,null);
});
test('withdrawal is available to any challenger, remains final for this card and does not reset the clock',()=>{
 const g=game();bid(g,'p0',1000);act(g,'p4','pass',null,g.revision,2000);assert.equal(g.deadline,11000);assert.equal(canBid(g,'p4'),false);rejected(g,()=>bid(g,'p4',2500));
 for(const id of ['p2','p5','p3','p1'])act(g,id,'pass',null,g.revision,3000);
 assert.equal(g.status,'sold');assert.equal(g.lastSale.playerId,'p0');assert.equal(g.lastSale.card.paid,1);
});
test('full rosters and reserved budgets still exclude ineligible bidders; old saves lose their obsolete mid-auction turn',()=>{
 const g=game();g.players[5].budget=3;g.players[4].cards=[{id:'old1'},{id:'old2'},{id:'old3'}];g.activeIds=g.activeIds.filter(id=>id!=='p4');bid(g,'p0',1000);
 assert.equal(canBid(g,'p5'),false);assert.equal(canBid(g,'p4'),false);rejected(g,()=>bid(g,'p5',2000));rejected(g,()=>bid(g,'p4',2000));
 const deadline=g.deadline,revision=g.revision;g.turnId='p1';prepareTimer(g,2000);assert.equal(g.turnId,null);assert.equal(g.deadline,deadline);assert.equal(g.revision,revision);assert.equal(canBid(g,'p3'),true);
});
const uiDeps={esc:v=>String(v??''),photo:()=>'',photoNote:()=>'',cardInfo:()=>({text:'Kart açıklaması'}),timerUI:()=>'',activityUI:()=>'',seriesUI:{}};
const auction=createAuctionUI(uiDeps),tv=createTVUI(uiDeps);
const disabled=html=>/disabled/.test(html.match(/<button[^>]*data-action="bid"[^>]*>/)?.[0]||'disabled');
test('phone and TV controller buttons enable every eligible challenger, with shared-phone identity selection',()=>{
 const g=game();
 for(const p of people)assert.equal(disabled(tv.controller(viewGame(g),{you:p.id,cap:18})),p.id!=='p0');
 bid(g,'p0',1000);
 for(const p of people){const opts={you:p.id,actorId:p.id,cap:18};assert.equal(disabled(tv.controller(viewGame(g),opts)),p.id==='p0');const html=auction.stage(viewGame(g),{name:'Kahraman',group:'Karakter'},opts);assert.equal(disabled(html),p.id==='p0');assert.match(html,/Serbest artırma/);assert.ok(!html.includes('undefined'));}
 const shared=auction.stage(viewGame(g),{name:'Kahraman'},{shared:true,actorId:null,cap:0});assert.match(shared,/name="bidderId"/);assert.equal(disabled(shared),true);
 assert.equal(disabled(auction.stage(viewGame(g),{name:'Kahraman'},{shared:true,actorId:'p5',cap:18})),false);
 act(g,'p2','pass',null,g.revision,2000);assert.equal(disabled(tv.controller(viewGame(g),{you:'p2',cap:18})),true);
 const display=tv.display({game:viewGame(g)},()=>({name:'Kahraman'}));assert.match(display,/İsteyen artırabilir/);assert.ok(!display.includes('Şimdi sıra'));assert.ok(!display.includes('undefined'));
});
test('opening alerts stop once free bidding starts, even for a stale saved turn',()=>{
 const g=game(),notices=[];const notice=createTurnNotice({onNotice:n=>{if(n)notices.push(n);}});notice.observe(g,{shared:true});assert.equal(notices.length,1);bid(g,'p0',1000);g.turnId='p5';notice.observe(g,{shared:true});assert.equal(notices.length,1);
});
