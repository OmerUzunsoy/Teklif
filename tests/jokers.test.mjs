import {auctionActor} from './auction-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {categories} from '../dist/catalog.js';
import {makeGame,act,viewGame,expire} from '../dist/engine.js';
import {startMatch,syncMatch,advanceSeries} from '../dist/series.js';
const settings={categoryId:'heroes',slots:3,budget:20,scoring:'points',jokers:true};
const people=n=>Array.from({length:n},(_,i)=>({id:'p'+i,name:'Oyuncu '+i}));
function step(g){act(g,auctionActor(g),g.status==='sold'?'next':g.price===0?'bid':'pass',g.price===0?1:null,g.revision);}
test('one opening joker replaces only the current card, preserving money, order and hidden reserves',()=>{
 const g=makeGame(settings,people(3));const opener=g.turnId,index=g.index,future=g.deck.slice(1).map(c=>c.id),old=g.deck[0].id,cursor=g.openingCursor;
 act(g,opener,'joker',null,g.revision);
 assert.notEqual(g.deck[0].id,old);assert.deepEqual(g.deck.slice(1).map(c=>c.id),future);assert.equal(g.turnId,opener);assert.equal(g.index,index);assert.equal(g.openingCursor,cursor);assert.equal(g.price,0);assert.equal(g.deadline,null);assert.equal(g.players[0].jokersLeft,0);assert.ok(g.players.every(p=>p.budget===20));
 const view=viewGame(g);assert.ok(!('deck' in view));assert.ok(!('jokerPool' in view));assert.ok(!('score' in view.current));assert.equal(view.activity[0].type,'joker');assert.equal(view.totalCards,9);
});
test('disabled, wrong-player, reused, stale and post-bid jokers cannot alter game state',()=>{
 let g=makeGame(settings,people(3));const reject=(id,revision=g.revision)=>{const before=JSON.stringify(g);assert.throws(()=>act(g,id,'joker',null,revision));assert.equal(JSON.stringify(g),before);};
 reject('p1');reject('p0',-1);act(g,'p0','joker',null,g.revision);reject('p0');act(g,'p0','bid',1,g.revision);reject('p1');
 g=makeGame({...settings,jokers:false},people(2));reject('p0');
});
test('all 36 joker categories still fill six rosters without duplicate purchases or extra charges',()=>{
 for(const category of categories){const g=makeGame({...settings,categoryId:category.id,slots:5},people(6));let operations=0;
  while(g.status!=='finished'){assert.ok(++operations<1000,category.name);if(g.status==='bidding'&&g.price===0&&g.players.find(p=>p.id===g.turnId).jokersLeft){act(g,auctionActor(g),'joker',null,g.revision);continue;}step(g);}
  const won=g.players.flatMap(p=>p.cards);assert.equal(won.length,30,category.name);assert.equal(new Set(won.map(c=>c.id)).size,30,category.name);assert.ok(g.players.every(p=>p.cards.length===5&&p.jokersLeft===0&&p.budget+p.cards.reduce((s,c)=>s+c.paid,0)===20));
 }
});
test('TV countdown blocks jokers; the replacement stays on the same opening turn',()=>{
 const g=makeGame({...settings,television:true},people(2),Math.random,1000);const before=JSON.stringify(g);assert.throws(()=>act(g,'p0','joker',null,g.revision,1500));assert.equal(JSON.stringify(g),before);expire(g,4000);const card=g.deck[0].id;act(g,auctionActor(g),'joker',null,g.revision,4001);assert.notEqual(g.deck[0].id,card);assert.equal(g.status,'bidding');assert.equal(g.revealDeadline,null);assert.equal(g.turnId,'p0');assert.equal(g.deadline,null);
});
test('each series round renews one joker per player while the setting is retained',()=>{
 const holder=startMatch(settings,people(2),{mode:'playlist',playlist:['heroes','drinks']});act(holder.game,'p0','joker',null,holder.game.revision);
 while(holder.game.status!=='finished')step(holder.game);syncMatch(holder);advanceSeries(holder,holder.series.revision);
 assert.equal(holder.series.round,2);assert.equal(holder.game.settings.jokers,true);assert.ok(holder.game.players.every(p=>p.jokersLeft===1));
});
