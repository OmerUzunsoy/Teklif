import {auctionActor} from './auction-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {makeGame,act,expire,prepareTimer,viewGame} from '../dist/engine.js';
import {categories} from '../dist/catalog.js';
import {cardInfo} from '../dist/card-info.js';
import {formatTeams,analysisPrompt} from '../dist/result-export.js';
const settings={categoryId:'heroes',slots:3,budget:20,scoring:'debate',timerSeconds:10};
const people=[{id:'a',name:'Ömer'},{id:'b',name:'Ayşe'},{id:'c',name:'Can'}];
test('clock starts on first bid, resets on each bid, stays unchanged on pass and awards exactly once',()=>{
 const game=makeGame(settings,people);
 assert.equal(game.deadline,null);assert.equal(expire(game,100000),false);
 act(game,'a','bid',1,0,100000);assert.equal(game.deadline,110000);
 act(game,'b','bid',2,1,105000);assert.equal(game.deadline,115000);
 act(game,'c','pass',null,2,106000);assert.equal(game.deadline,115000);
 assert.equal(expire(game,114999),false);assert.equal(expire(game,115000),true);
 assert.equal(game.status,'sold');assert.equal(game.players[1].budget,18);assert.equal(game.players[1].cards.length,1);assert.equal(game.players[1].cards[0].paid,2);
 assert.equal(game.revision,4);assert.equal(game.deadline,null);assert.equal(expire(game,200000),false);
 act(game,null,'next',null,4,200000);assert.equal(game.price,0);assert.equal(game.deadline,null);
});
test('a late bid cannot revive an expired auction or charge the wrong player',()=>{
 const game=makeGame(settings,people);act(game,'a','bid',1,0,100000);
 assert.throws(()=>act(game,'b','bid',2,1,110000),/Süre doldu/);
 assert.equal(game.price,1);assert.equal(game.players[0].cards.length,1);assert.equal(game.players[1].budget,20);
 assert.equal(game.status,'sold');assert.equal(game.revision,2);
});
test('legacy saves receive a timer once, not on every poll; invalid durations are rejected',()=>{
 const game=makeGame(settings,people);act(game,'a','bid',1,0,100000);
 delete game.deadline;delete game.settings.timerSeconds;delete game.activity;
 prepareTimer(game,200000);assert.equal(game.deadline,210000);prepareTimer(game,205000);assert.equal(game.deadline,210000);
 assert.throws(()=>makeGame({...settings,timerSeconds:0},people),/saniye/);
});
test('full result exports include every team, paid prices, remaining budgets, context and no future deck',()=>{
 const game=makeGame(settings,people);
 while(game.status!=='finished'){
  if(game.status==='sold')act(game,null,'next',null,game.revision);
  else act(game,auctionActor(game),game.price===0?'bid':'pass',1,game.revision);
 }
 const view=viewGame(game),plain=formatTeams(view),prompt=analysisPrompt(view);
 assert.match(prompt,/OYUNUN MANTIĞI/);assert.match(prompt,/10 saniyelik/);assert.match(prompt,/Sonsuzluk Taşları/);
 for(const p of view.players){assert.ok(prompt.includes(p.name));assert.ok(plain.includes(p.name));assert.ok(prompt.includes('Kalan: '+p.budget));for(const c of p.cards){assert.ok(prompt.includes(c.name));assert.ok(plain.includes(c.name));assert.ok(prompt.includes(cardInfo(c).text));assert.ok(prompt.includes(c.paid+' jeton'));}}
 assert.ok(!plain.includes('İSTEDİĞİM ANALİZ'));assert.ok(!prompt.includes('undefined'));assert.ok(!prompt.includes('null'));
 const food=analysisPrompt({...view,settings:{...view.settings,categoryId:'food'}});assert.match(food,/Menüleri lezzet çeşitliliği/);assert.ok(!food.includes('Hazırlık süresi olmayan'));
});
test('every active card has a short introduction and the unfamiliar hero and foods have useful details',()=>{
 for(const c of categories)for(const card of c.cards){const info=cardInfo(card);assert.ok(info.text.length>12,card.name);assert.ok(info.text.length<300,card.name);assert.match(info.source,/^https:\/\//,card.name);}
 const hood=categories.find(c=>c.id==='heroes').cards.find(c=>c.name==='Red Hood');assert.match(cardInfo(hood).text,/Jason Todd/);assert.match(cardInfo(hood).text,/silah/);
 const kunefe=categories.find(c=>c.id==='desserts').cards.find(c=>c.name==='Künefe');assert.match(cardInfo(kunefe).text,/peynir/);
});
