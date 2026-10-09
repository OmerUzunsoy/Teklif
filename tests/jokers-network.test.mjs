import test from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN||'http://localhost:4177';
async function request(route,data,token){const res=await fetch(origin+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{'X-Player-Token':token}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:res.status,...await res.json()};}
test('room jokers enforce membership, opening order and one use across every phone',async()=>{
 const config={categoryId:'drinks',slots:5,budget:20,scoring:'debate',jokers:true};const host=await request('/api/rooms',{name:'Joker ev sahibi',settings:config}),route='/api/rooms/'+host.code;const clients=[host];for(let i=1;i<6;i++)clients.push(await request(route+'/join',{name:'Joker oyuncu '+i}));
 let state=await request(route+'/start',{settings:config},host.token);assert.equal(state.status,200);const old=state.game.current.id,payload={type:'joker',revision:state.game.revision};assert.equal((await request(route+'/action',payload)).status,400);assert.equal((await request(route+'/action',payload,clients[1].token)).status,400);
 state=await request(route+'/action',payload,host.token);assert.equal(state.status,200);assert.notEqual(state.game.current.id,old);assert.equal(state.game.turnId,host.you);assert.equal(state.game.totalCards,30);assert.ok(!('jokerPool' in state.game));assert.equal(state.game.players[0].jokersLeft,0);
 assert.equal((await request(route+'/action',payload,host.token)).status,400);assert.equal((await request(route+'/action',{type:'joker',revision:state.game.revision},host.token)).status,400);
 for(const c of clients)assert.deepEqual((await request(route,undefined,c.token)).game,state.game);
 state=await request(route+'/action',{type:'bid',amount:1,revision:state.game.revision},host.token);assert.equal(state.status,200);assert.equal((await request(route+'/action',{type:'joker',revision:state.game.revision},clients[1].token)).status,400);
});
test('QR and notification modules are served locally without exposing private room state',async()=>{
 for(const file of ['join-qr.js','qr-code-generator.js','turn-notice.js','joker-ui.js']){const response=await fetch(origin+'/'+file);assert.equal(response.status,200,file);assert.match(response.headers.get('content-type'),/javascript/);}
 assert.equal((await fetch(origin+'/.runtime/rooms.json')).status,404);
});
