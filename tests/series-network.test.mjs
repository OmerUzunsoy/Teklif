import {auctionActor} from './auction-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN||'http://localhost:4177';
async function req(route,data,token){const r=await fetch(origin+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{'X-Player-Token':token}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:r.status,...await r.json()};}
async function finish(route,state,members){const host=members[0];let actions=0;while(state.game.status!=='finished'){assert.ok(++actions<250);const g=state.game,actor=members.find(m=>m.you===auctionActor(g));state=await req(route+'/action',g.status==='sold'?{type:'next',revision:g.revision}:g.price?{type:'pass',revision:g.revision}:{type:'bid',amount:1,revision:g.revision},g.status==='sold'?host.token:actor.token);assert.equal(state.status,200);}return state;}
test('six members share editable playlists, host rankings and a persistent two-round final',async()=>{
 const settings={categoryId:'food',variant:'DC',slots:3,budget:20,scoring:'debate',timerSeconds:10},playPlan={mode:'playlist',playlist:['food','clothing']};
 const host=await req('/api/rooms',{name:'Liste ev sahibi '+Date.now(),settings,playPlan}),route='/api/rooms/'+host.code,members=[host];
 for(let i=1;i<6;i++)members.push(await req(route+'/join',{name:'Liste misafiri '+i}));
 assert.equal((await req(route+'/configure',{settings,playPlan},members[1].token)).status,400);
 const empty=await req(route+'/configure',{settings,playPlan:{mode:'playlist',playlist:[]}},host.token);assert.deepEqual(empty.playPlan.playlist,[]);assert.equal((await req(route+'/start',{settings,playPlan:{mode:'playlist',playlist:[]}},host.token)).status,400);
 const configured=await req(route+'/configure',{settings,playPlan},host.token);assert.deepEqual(configured.playPlan.playlist,['food','clothing']);assert.deepEqual((await req(route,undefined,members[1].token)).playPlan,configured.playPlan);
 let state=await req(route+'/start',{settings,playPlan},host.token);assert.equal(state.status,200);assert.equal(state.series.totalRounds,2);assert.equal(state.series.settings.variant,'DC');
 for(let round=1;round<=2;round++){
  state=await finish(route,state,members);assert.equal(state.series.phase,'review');assert.equal(state.series.results.length,round-1);
  const placements=state.series.players.map((p,i)=>({id:p.id,rank:i+1})),revision=state.series.revision;
  assert.equal((await req(route+'/rank',{placements,revision},members[1].token)).status,400);
  state=await req(route+'/rank',{placements,revision},host.token);assert.equal(state.status,200);
  assert.equal((await req(route+'/rank',{placements,revision},host.token)).status,400);
  assert.deepEqual((await req(route,undefined,members[1].token)).series,state.series);
  if(round===1){assert.equal((await req(route+'/series-next',{revision:state.series.revision},members[1].token)).status,400);state=await req(route+'/series-next',{revision:state.series.revision},host.token);assert.equal(state.game.settings.categoryId,'clothing');assert.equal(state.series.round,2);assert.ok(state.game.players.every(p=>p.budget===20&&p.cards.length===0));}
 }
 assert.equal(state.phase,'series-final');assert.deepEqual(state.series.players.map(p=>p.total),[12,10,8,6,4,2]);
 for(const m of members)assert.deepEqual((await req(route,undefined,m.token)).series,state.series);
 const restart=await req(route+'/restart',{},host.token);assert.equal(restart.phase,'lobby');assert.equal(restart.series,null);assert.deepEqual(restart.playPlan.playlist,['food','clothing']);assert.equal(restart.members.length,6);assert.equal(restart.settings.variant,'DC');
});
test('voting starts once, shortens after everyone votes and changes every device to the selected second round',async()=>{
 const settings={categoryId:'food',slots:3,budget:20,scoring:'points'},playPlan={mode:'vote',rounds:2};
 const host=await req('/api/rooms',{name:'Oy ev sahibi '+Date.now(),settings,playPlan}),route='/api/rooms/'+host.code,guest=await req(route+'/join',{name:'Oy misafiri'}),members=[host,guest];
 let state=await req(route+'/start',{settings,playPlan},host.token);state=await finish(route,state,members);assert.equal(state.series.phase,'between');assert.equal(state.series.results.length,1);
 state=await req(route+'/series-next',{revision:state.series.revision},host.token);assert.equal(state.phase,'vote');const vote=state.series.vote;assert.equal(vote.deadline,null);assert.equal(vote.candidates.length,3);
 state=await req(route+'/vote',{categoryId:vote.candidates[0],round:2},host.token);const first=state.series.vote.deadline;assert.ok(first-state.serverNow>9000);
 state=await req(route+'/vote',{categoryId:vote.candidates[0],round:2},guest.token);assert.ok(state.series.vote.deadline<first);assert.ok(state.series.vote.deadline-state.serverNow<=3000);
 const invalid=await req(route+'/vote',{categoryId:'fake',round:2},guest.token);assert.equal(invalid.status,400);
 await new Promise(resolve=>setTimeout(resolve,3300));state=await req(route,undefined,host.token);const other=await req(route,undefined,guest.token);
 assert.equal(state.phase,'game');assert.equal(state.series.round,2);assert.equal(state.game.settings.categoryId,vote.candidates[0]);assert.deepEqual(other.series,state.series);assert.deepEqual(other.game,state.game);
 assert.equal((await req(route+'/vote',{categoryId:vote.candidates[0],round:2},guest.token)).status,400);
 state=await finish(route,state,members);assert.equal(state.phase,'series-final');assert.equal(state.series.results.length,2);
});
