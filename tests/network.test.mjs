import {auctionActor} from './auction-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {imageCards} from '../dist/image-cards.js';
const origin=process.env.TEST_ORIGIN||'http://localhost:4177';
async function request(route,data,token){const res=await fetch(origin+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{'X-Player-Token':token}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:res.status,...await res.json()};}
test('six-device rooms enforce identity, opening order and revisions, and complete the same final',async()=>{
 const config={categoryId:'football',slots:3,budget:20,scoring:'points'};
 const host=await request('/api/rooms',{name:'Test Ev Sahibi '+Date.now(),settings:config});assert.equal(host.status,200);const route='/api/rooms/'+host.code;
 const members=[host];for(let i=1;i<6;i++){const member=await request(route+'/join',{name:'Test Telefon '+i});assert.equal(member.status,200);members.push(member);}
 const extra=await request(route+'/join',{name:'Yedinci Telefon'});assert.equal(extra.status,400);
 assert.equal((await request(route)).status,400);
 assert.equal((await request(route+'/start',{settings:config},members[1].token)).status,400);
 let state=await request(route+'/start',{settings:config},host.token);assert.equal(state.status,200);assert.equal(state.game.totalCards,18);assert.ok(!('deck' in state.game));assert.ok(state.members.every(m=>!('token' in m)));
 const byId=new Map(members.map(m=>[m.you,m]));let operations=0;
 while(state.game.status!=='finished'){
  assert.ok(++operations<250);
  const game=state.game;assert.ok(imageCards[game.current.id],game.current.name+' must have an image');const actor=byId.get(auctionActor(game));const data=game.status==='sold'?{type:'next',revision:game.revision}:game.price===0?{type:'bid',amount:1,revision:game.revision}:{type:'pass',revision:game.revision};
  const token=game.status==='sold'?host.token:actor.token;
  if(operations===1){const jump=await request(route+'/action',{type:'bid',amount:2,revision:game.revision},actor.token);assert.equal(jump.status,400);assert.equal((await request(route,undefined,host.token)).game.revision,game.revision);const wrong=members.find(m=>m.you!==game.turnId);assert.equal((await request(route+'/action',data,wrong.token)).status,400);}
  const before=game.revision;state=await request(route+'/action',data,token);assert.equal(state.status,200);assert.equal(state.game.revision,before+1);
  const duplicate=await request(route+'/action',data,token);assert.equal(duplicate.status,400);const read=await request(route,undefined,host.token);assert.equal(read.game.revision,state.game.revision);
 }
 const final=state.game;assert.ok(final.players.every(p=>p.cards.length===3));
 for(const m of members){const view=await request(route,undefined,m.token);assert.deepEqual(view.game,final);}
 assert.equal((await request(route+'/join',{name:'Geç katılan'})).status,400);
 const restart=await request(route+'/restart',{},host.token);assert.equal(restart.phase,'lobby');assert.equal(restart.members.length,6);
 const remove=await request(route+'/remove',{id:members[5].you},host.token);assert.equal(remove.members.length,5);assert.equal((await request(route,undefined,members[5].token)).status,400);
});
test('debate finals omit player totals',async()=>{const config={categoryId:'food',slots:3,budget:20,scoring:'debate'};const host=await request('/api/rooms',{name:'Tartışma testi '+Date.now(),settings:config});const route='/api/rooms/'+host.code;const guest=await request(route+'/join',{name:'Misafir'});let state=await request(route+'/start',{settings:config},host.token);while(state.game.status!=='finished'){const g=state.game;assert.ok(imageCards[g.current.id],g.current.name+' must have an image');const t=g.status==='sold'?host.token:auctionActor(g)===host.you?host.token:guest.token;state=await request(route+'/action',g.status==='sold'?{type:'next',revision:g.revision}:g.price===0?{type:'bid',amount:1,revision:g.revision}:{type:'pass',revision:g.revision},t);assert.equal(state.status,200);}assert.ok(state.game.players.every(p=>p.total===null));});

test('the server awards timed auctions without active polling and rejects stale bids',async()=>{
 const config={categoryId:'food',slots:3,budget:20,scoring:'debate',timerSeconds:5};
 const host=await request('/api/rooms',{name:'Sayaç '+Date.now(),settings:config});const route='/api/rooms/'+host.code;
 const guest=await request(route+'/join',{name:'Sayaç misafiri'});let state=await request(route+'/start',{settings:config},host.token);
 assert.equal(state.game.deadline,null);
 state=await request(route+'/action',{type:'bid',amount:1,revision:state.game.revision},host.token);const firstDeadline=state.game.deadline;
 await new Promise(resolve=>setTimeout(resolve,250));
 state=await request(route+'/action',{type:'bid',amount:2,revision:state.game.revision},guest.token);
 assert.ok(state.game.deadline>firstDeadline);const revision=state.game.revision;
 await new Promise(resolve=>setTimeout(resolve,5300));
 const hostView=await request(route,undefined,host.token),guestView=await request(route,undefined,guest.token);
 assert.equal(hostView.game.status,'sold');assert.equal(hostView.game.revision,revision+1);
 assert.equal(hostView.game.lastSale.playerId,guest.you);assert.equal(hostView.game.lastSale.card.paid,2);
 assert.deepEqual(hostView.game,guestView.game);
 assert.equal((await request(route+'/action',{type:'bid',amount:3,revision},host.token)).status,400);
 assert.equal((await request(route,undefined,host.token)).game.players.find(p=>p.id===guest.you).cards.length,1);
});
