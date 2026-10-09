import test from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN||'http://localhost:4177';
async function request(route,data,token){const r=await fetch(origin+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{'X-Player-Token':token}:{})},...(data?{body:JSON.stringify(data)}:{})});assert.equal(r.status,200);return r.json();}
test('host enables value ratings before play and both devices see the same purchase and remaining budget',async()=>{
 const settings={categoryId:'heroes',slots:3,budget:20,scoring:'debate'},playPlan={mode:'single'};
 const host=await request('/api/rooms',{name:'FP ev sahibi '+Date.now(),settings,playPlan}),route='/api/rooms/'+host.code,guest=await request(route+'/join',{name:'FP misafiri'});
 const configured=await request(route+'/configure',{settings:{...settings,pricePerformance:true},playPlan},host.token);assert.equal(configured.settings.pricePerformance,true);assert.equal((await request(route,undefined,guest.token)).settings.pricePerformance,true);
 let state=await request(route+'/start',{},host.token);assert.equal(state.game.settings.pricePerformance,true);assert.equal(state.game.openingId,host.you);assert.equal(state.game.current.deal,undefined);
 state=await request(route+'/action',{type:'bid',amount:1,revision:state.game.revision},host.token);
 state=await request(route+'/action',{type:'pass',revision:state.game.revision},guest.token);
 const other=await request(route,undefined,guest.token);assert.deepEqual(state.game,other.game);assert.equal(state.game.lastSale.remainingBudget,19);assert.equal(state.game.lastSale.card.deal.stars,5);assert.equal(state.game.lastSale.card.score,undefined);assert.equal(state.game.players.find(p=>p.id===host.you).budget,19);
});
