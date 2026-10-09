import test from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN||'http://localhost:4177';
async function request(route,data,token){const res=await fetch(origin+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{'X-Player-Token':token}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:res.status,...await res.json()};}
test('TV is a separate read-only display with synchronized card reveal, bids and sale',async()=>{
 const settings={categoryId:'heroes',slots:3,budget:20,timerSeconds:5,scoring:'debate',television:true,pricePerformance:true};
 const host=await request('/api/rooms',{name:'TV test '+Date.now(),settings,playPlan:{mode:'single'}}),route='/api/rooms/'+host.code;
 const guest=await request(route+'/join',{name:'TV kumandası'});
 const waiting=await request(route+'/screen');assert.equal(waiting.status,200);assert.equal(waiting.members.length,2);assert.equal(waiting.you,null);assert.equal(waiting.host,false);assert.ok(waiting.members.every(m=>!m.token));
 assert.equal((await request(route)).status,400);assert.equal((await request(route+'/screen',{})).status,400);assert.equal((await request(route+'/start',{})).status,400);
 let state=await request(route+'/start',{},host.token);assert.equal(state.game.status,'countdown');assert.equal(state.game.current,null);
 const screen=await request(route+'/screen');assert.equal(screen.game.revealDeadline,state.game.revealDeadline);assert.equal(screen.game.current,null);assert.equal(screen.game.deck,undefined);
 assert.equal((await request(route+'/action',{type:'bid',amount:1,revision:state.game.revision},host.token)).status,400);
 await new Promise(resolve=>setTimeout(resolve,3150));state=await request(route,undefined,host.token);assert.equal(state.game.status,'bidding');assert.equal(state.game.turnId,host.you);
 state=await request(route+'/action',{type:'bid',amount:1,revision:state.game.revision},host.token);
 state=await request(route+'/action',{type:'bid',amount:2,revision:state.game.revision},guest.token);
 assert.deepEqual((await request(route+'/screen')).game,state.game);
 state=await request(route+'/action',{type:'pass',revision:state.game.revision},host.token);
 const sold=await request(route+'/screen');assert.equal(sold.game.status,'sold');assert.equal(sold.game.lastSale.name,'TV kumandası');assert.equal(sold.game.lastSale.remainingBudget,18);assert.equal(sold.game.lastSale.card.paid,2);assert.ok(sold.game.lastSale.card.deal);assert.equal(sold.members.length,2);
 assert.equal((await request(route+'/action',{type:'next',revision:sold.game.revision})).status,400);
});
test('rooms without TV mode cannot be read without a player membership',async()=>{
 const host=await request('/api/rooms',{name:'Normal test '+Date.now(),settings:{categoryId:'food',slots:3,budget:20,scoring:'debate'}});
 assert.equal((await request('/api/rooms/'+host.code+'/screen')).status,400);
});
