import {auctionActor} from './auction-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {makeGame,act,expire,viewGame} from '../dist/engine.js';
import {startMatch,syncMatch,rankRound,advanceSeries} from '../dist/series.js';
const settings={categoryId:'heroes',slots:3,budget:20,timerSeconds:5,scoring:'debate',television:true,pricePerformance:true};
const people=Array.from({length:6},(_,i)=>({id:'p'+i,name:'TV oyuncusu '+i}));
test('TV reveals use one absolute three-second deadline and hide the upcoming card',()=>{
 const g=makeGame(settings,people.slice(0,2),()=>.5,1000);
 assert.equal(g.status,'countdown');assert.equal(g.revealDeadline,4000);assert.equal(g.index,-1);
 const view=viewGame(g);assert.equal(view.current,null);assert.equal(view.deck,undefined);assert.deepEqual(view.players.map(p=>p.cards),[[],[]]);
 assert.throws(()=>act(g,'p0','bid',1,g.revision,3999));assert.equal(expire(g,3999),false);
 assert.equal(expire(g,4000),true);assert.equal(g.status,'bidding');assert.equal(g.index,0);assert.equal(g.openingId,'p0');assert.equal(g.deadline,null);
 assert.equal(expire(g,4001),false);assert.ok(viewGame(g).current.name);
});
test('TV sells once, keeps its receipt for five seconds, then counts down to the next card',()=>{
 const g=makeGame(settings,people.slice(0,2),()=>.5,0);expire(g,3000);
 act(g,'p0','bid',1,g.revision,3100);const first=g.deadline;
 act(g,'p1','bid',2,g.revision,3200);assert.ok(g.deadline>first);
 expire(g,8200);assert.equal(g.status,'sold');assert.equal(g.lastSale.playerId,'p1');assert.equal(g.lastSale.card.paid,2);assert.equal(g.lastSale.remainingBudget,18);assert.equal(g.autoNextAt,13200);assert.ok(g.lastSale.card.deal);
 const sale=g.lastSale,oldRevision=g.revision;assert.equal(expire(g,13199),false);
 assert.equal(expire(g,13200),true);assert.equal(g.status,'countdown');assert.equal(g.revealDeadline,16200);assert.equal(viewGame(g).current,null);assert.equal(g.lastSale,sale);assert.equal(g.history.length,1);
 assert.throws(()=>act(g,'p0','next',0,oldRevision,14000));assert.equal(g.players[1].budget,18);
 expire(g,16200);assert.equal(g.status,'bidding');assert.equal(g.index,1);assert.equal(g.openingId,'p1');assert.equal(g.history.length,1);
});
test('six TV remotes finish every roster automatically without duplicate sales or deductions',()=>{
 const g=makeGame(settings,people,()=>.5,0);let now=0,steps=0;
 while(g.status!=='finished'){
  assert.ok(++steps<250);
  if(g.status==='countdown'){now=g.revealDeadline;expire(g,now);}
  else if(g.status==='sold'){now=g.autoNextAt;expire(g,now);}
  else{now+=10;act(g,auctionActor(g),g.price?'pass':'bid',g.price?0:1,g.revision,now);}
 }
 assert.equal(g.history.length,18);assert.equal(g.autoNextAt,null);assert.equal(expire(g,now+100000),false);
 for(const p of g.players){assert.equal(p.cards.length,3);assert.equal(p.budget,20-p.cards.reduce((sum,c)=>sum+c.paid,0));}
 assert.equal(new Set(g.history.map(s=>s.card.id)).size,18);
});
test('TV countdowns survive series round changes and manual ranking stays with the host',()=>{
 const holder=startMatch(settings,people.slice(0,2),{mode:'playlist',playlist:['heroes','food']},()=>.5);let now=holder.game.revealDeadline,steps=0;
 while(holder.game.status!=='finished'){
  const g=holder.game;assert.ok(++steps<100);
  if(g.status==='countdown'){now=g.revealDeadline;syncMatch(holder,now);}
  else if(g.status==='sold'){now=g.autoNextAt;syncMatch(holder,now);}
  else{now+=10;act(g,auctionActor(g),g.price?'pass':'bid',g.price?0:1,g.revision,now);syncMatch(holder,now);}
 }
 assert.equal(holder.series.phase,'review');rankRound(holder,[{id:'p0',rank:1},{id:'p1',rank:2}],holder.series.revision);
 advanceSeries(holder,holder.series.revision);assert.equal(holder.game.status,'countdown');assert.equal(holder.game.settings.television,true);assert.equal(holder.game.settings.categoryId,'food');assert.equal(viewGame(holder.game).current,null);assert.ok(holder.game.players.every(p=>p.budget===20));
});
