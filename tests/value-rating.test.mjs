import {auctionActor} from './auction-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {categoryById} from '../dist/catalog.js';
import {valueRating} from '../dist/value-rating.js';
import {makeGame,act,viewGame} from '../dist/engine.js';
import {startMatch,advanceSeries,syncMatch} from '../dist/series.js';
const settings={categoryId:'heroes',variant:'all',slots:3,budget:20,scoring:'debate',pricePerformance:true};
const people=[{id:'a',name:'A'},{id:'b',name:'B'}];
function buyFirst(g){act(g,auctionActor(g),'bid',1,g.revision);act(g,auctionActor(g),'pass',null,g.revision);return g;}
test('a one-token Thanos is five stars; increasing price never improves value',()=>{
 const thanos=categoryById('heroes').cards.find(c=>c.name==='Thanos');assert.ok(thanos);
 assert.equal(valueRating({...thanos,paid:1},settings).stars,5);
 const ratings=Array.from({length:20},(_,i)=>valueRating({...thanos,paid:i+1},settings).stars);
 assert.ok(ratings.every((v,i)=>i===0||v<=ratings[i-1]));assert.equal(ratings.at(-1),1);
 assert.ok(valueRating({...thanos,paid:5},{...settings,budget:50}).stars>=valueRating({...thanos,paid:5},settings).stars);
});
test('optional purchase ratings and exact remaining budgets survive views without revealing unbought scores',()=>{
 const g=makeGame(settings,people),before=viewGame(g);assert.equal(before.current.deal,undefined);assert.equal(before.current.score,undefined);
 buyFirst(g);const v=viewGame(g),winner=v.players.find(p=>p.id===v.lastSale.playerId);
 assert.equal(v.lastSale.remainingBudget,19);assert.equal(winner.budget,19);assert.equal(v.lastSale.card.deal.stars,5);assert.deepEqual(winner.cards[0].deal,v.lastSale.card.deal);assert.equal(v.current.deal,undefined);assert.equal(winner.cards[0].score,undefined);
 act(g,null,'next',null,g.revision);assert.equal(viewGame(g).lastSale.remainingBudget,19);assert.equal(viewGame(g).current.deal,undefined);
 const off=buyFirst(makeGame({...settings,pricePerformance:false},people));assert.equal(off.lastSale.card.deal,undefined);assert.equal(viewGame(off).lastSale.card.deal,undefined);
});
test('value stars cannot alter card scores, winners, budgets or series points',()=>{
 const on=makeGame({...settings,scoring:'points'},people,()=>.2),off=makeGame({...settings,scoring:'points',pricePerformance:false},people,()=>.2);
 for(const g of [on,off])while(g.status!=='finished')act(g,auctionActor(g),g.status==='sold'?'next':g.price?'pass':'bid',g.price?null:1,g.revision);
 assert.deepEqual(on.players.map(p=>({budget:p.budget,cards:p.cards.map(c=>({id:c.id,score:c.score,paid:c.paid}))})),off.players.map(p=>({budget:p.budget,cards:p.cards.map(c=>({id:c.id,score:c.score,paid:c.paid}))})));
 const holder=startMatch({...settings,scoring:'points'},people,{mode:'playlist',playlist:['heroes','food']},()=>.2);
 while(holder.game.status!=='finished')act(holder.game,auctionActor(holder.game),holder.game.status==='sold'?'next':holder.game.price?'pass':'bid',holder.game.price?null:1,holder.game.revision);
 syncMatch(holder);advanceSeries(holder,holder.series.revision);assert.equal(holder.game.settings.pricePerformance,true);assert.ok(holder.game.players.every(p=>p.budget===20));
});
