import test from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN||'http://localhost:4177';
async function request(route,data,token){const res=await fetch(origin+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{'X-Player-Token':token}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:res.status,...await res.json()};}
test('six phones can bid out of seat order; simultaneous bids charge only the displayed amount once',async()=>{
 const settings={categoryId:'heroes',slots:3,budget:20,scoring:'debate',timerSeconds:15};const host=await request('/api/rooms',{name:'Serbest teklif testi',settings}),route='/api/rooms/'+host.code,members=[host];
 for(let i=1;i<6;i++)members.push(await request(route+'/join',{name:'Telefon '+i}));
 let state=await request(route+'/start',{settings},host.token);
 assert.equal((await request(route+'/action',{type:'bid',amount:1,revision:state.game.revision},members[5].token)).status,400);
 state=await request(route+'/action',{type:'bid',amount:1,revision:state.game.revision},host.token);assert.equal(state.status,200);
 state=await request(route+'/action',{type:'bid',amount:2,revision:state.game.revision},members[5].token);assert.equal(state.status,200);assert.equal(state.game.leaderId,members[5].you);assert.equal(state.game.turnId,null);
 const payload={type:'bid',amount:3,revision:state.game.revision};const raced=await Promise.all([request(route+'/action',payload,members[2].token),request(route+'/action',payload,members[4].token)]);assert.deepEqual(raced.map(r=>r.status).sort(),[200,400]);
 state=await request(route,undefined,host.token);assert.equal(state.game.price,3);assert.equal(state.game.revision,payload.revision+1);assert.equal(state.game.activity.filter(a=>a.type==='bid'&&a.amount===3).length,1);assert.ok(state.game.players.every(p=>p.budget===20));
 const loser=raced[0].status===400?members[2]:members[4];const deadline=state.game.deadline;
 state=await request(route+'/action',{type:'bid',amount:4,revision:state.game.revision},loser.token);assert.equal(state.status,200);assert.equal(state.game.leaderId,loser.you);assert.ok(state.game.deadline>=deadline);
 assert.equal((await request(route+'/action',{type:'bid',amount:5,revision:state.game.revision},loser.token)).status,400);
 for(const member of members.filter(m=>m.you!==loser.you)){state=await request(route+'/action',{type:'pass',revision:state.game.revision},member.token);assert.equal(state.status,200);}
 assert.equal(state.game.status,'sold');assert.equal(state.game.lastSale.card.paid,4);assert.equal(state.game.lastSale.remainingBudget,16);
 for(const member of members)assert.deepEqual((await request(route,undefined,member.token)).game,state.game);
});
