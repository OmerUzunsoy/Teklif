import {auctionActor} from './auction-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {act} from '../dist/engine.js';
import {normalizePlan,startMatch,syncMatch,rankRound,advanceSeries,castVote,standings,automaticPlacements,seriesSummary} from '../dist/series.js';
const settings={categoryId:'heroes',slots:3,budget:20,scoring:'debate',timerSeconds:10};
const members=Array.from({length:4},(_,i)=>({id:'p'+i,name:'Oyuncu '+i}));
function finish(holder){const g=holder.game;while(g.status!=='finished'){if(g.status==='sold')act(g,null,'next',null,g.revision);else act(g,auctionActor(g),g.price?'pass':'bid',1,g.revision);}syncMatch(holder);}
function ranks(holder){return holder.series.players.map((p,i)=>({id:p.id,rank:i+1}));}
function voteReady(){const h=startMatch(settings,members,{mode:'vote',rounds:3});finish(h);rankRound(h,ranks(h),h.series.revision);advanceSeries(h,h.series.revision);return h;}
test('plans validate category IDs, round bounds and empty lobby drafts',()=>{
 assert.equal(normalizePlan().mode,'single');assert.equal(normalizePlan({mode:'vote',rounds:5}).rounds,5);
 assert.throws(()=>normalizePlan({mode:'vote',rounds:0}));assert.throws(()=>normalizePlan({mode:'vote',rounds:11}));assert.throws(()=>normalizePlan({mode:'playlist',playlist:[]}));
 assert.equal(normalizePlan({mode:'playlist',playlist:[]},'heroes',true).rounds,0);
 assert.throws(()=>normalizePlan({mode:'playlist',playlist:['fake']}));assert.throws(()=>normalizePlan({mode:'playlist',playlist:Array(11).fill('food')}));
 assert.throws(()=>startMatch({...settings,slots:5,variant:'The Boys'},members,{mode:'playlist',playlist:['food','heroes']}),/havuzu/);
});
test('playlist order, host-reviewed results, fresh budgets and overall points survive an entire series',()=>{
 const h=startMatch(settings,members,{mode:'playlist',playlist:['food','clothing']});assert.equal(h.game.settings.categoryId,'food');
 finish(h);assert.equal(h.series.phase,'review');assert.equal(h.series.results.length,0);
 assert.throws(()=>advanceSeries(h,h.series.revision),/sıralamasını/);rankRound(h,ranks(h),h.series.revision);
 assert.equal(h.series.phase,'between');assert.deepEqual(h.series.players.map(p=>p.total),[4,3,2,1]);
 const before=JSON.stringify(h);assert.throws(()=>rankRound(h,ranks(h),0));assert.equal(JSON.stringify(h),before);assert.equal(syncMatch(h),false);
 advanceSeries(h,h.series.revision);assert.equal(h.game.settings.categoryId,'clothing');assert.equal(h.series.round,2);assert.ok(h.game.players.every(p=>p.budget===20&&p.cards.length===0));
 finish(h);rankRound(h,[...ranks(h)].map(p=>({...p,rank:5-p.rank})),h.series.revision);
 assert.equal(h.series.phase,'finished');assert.ok(h.series.players.every(p=>p.total===5));assert.ok(standings(h.series).every(p=>p.rank===1));assert.equal(h.series.results.length,2);
 assert.ok(h.series.results.every(r=>!('deck' in r.game)));assert.ok(seriesSummary(h.series).includes('2/2 tur'));
});
test('manual standings must include every player once and handle competition ties consistently',()=>{
 const h=startMatch(settings,members,{mode:'playlist',playlist:['food']});finish(h);const before=JSON.stringify(h);
 for(const placements of [[{id:'p0',rank:1}],ranks(h).map(p=>({...p,id:'p0'})),ranks(h).map(p=>({...p,rank:2})),[{id:'p0',rank:1},{id:'p1',rank:1},{id:'p2',rank:2},{id:'p3',rank:3}]]){assert.throws(()=>rankRound(h,placements,h.series.revision));assert.equal(JSON.stringify(h),before);}
 rankRound(h,[{id:'p0',rank:1},{id:'p1',rank:1},{id:'p2',rank:3},{id:'p3',rank:4}],h.series.revision);assert.deepEqual(h.series.players.map(p=>p.total),[4,4,2,1]);
});
test('points mode records a finished round automatically, including equal card totals',()=>{
 const h=startMatch({...settings,scoring:'points'},members,{mode:'playlist',playlist:['food']});const g=h.game;
 while(g.status!=='finished'){if(g.status==='sold')act(g,null,'next',null,g.revision);else act(g,auctionActor(g),g.price?'pass':'bid',1,g.revision);}
 for(const p of g.players)for(const c of p.cards)c.score=80;
 assert.ok(automaticPlacements(g).every(p=>p.rank===1));assert.equal(syncMatch(h),true);assert.equal(h.series.phase,'finished');assert.ok(h.series.players.every(p=>p.total===4));assert.equal(syncMatch(h),false);
});
test('first vote starts ten seconds, subsequent votes do not reset it and all voters shorten it',()=>{
 const h=voteReady(),v=h.series.vote;assert.equal(v.deadline,null);assert.equal(v.candidates.length,3);assert.equal(new Set(v.candidates).size,3);assert.ok(!v.candidates.includes('heroes'));
 castVote(h,'p0',v.candidates[0],2,100000);assert.equal(v.deadline,110000);castVote(h,'p1',v.candidates[1],2,102000);assert.equal(v.deadline,110000);
 castVote(h,'p2',v.candidates[0],2,102000);castVote(h,'p3',v.candidates[0],2,102000);assert.equal(v.deadline,105000);
 castVote(h,'p1',v.candidates[0],2,103000);assert.equal(v.deadline,105000);const revision=h.series.revision;castVote(h,'p1',v.candidates[0],2,104000);assert.equal(h.series.revision,revision);
 assert.equal(syncMatch(h,104999),false);assert.equal(syncMatch(h,105000,()=>.2),true);assert.equal(h.series.phase,'playing');assert.equal(h.series.round,2);assert.equal(h.game.settings.categoryId,v.candidates[0]);assert.equal(h.series.lastVote.chosen,v.candidates[0]);assert.ok(h.game.players.every(p=>p.budget===20&&p.cards.length===0));
 assert.throws(()=>castVote(h,'p1',v.candidates[0],2,105001));assert.equal(syncMatch(h,105001),false);
});
test('missing voters cannot stall a started timer and ties are resolved only among most-voted categories',()=>{
 const h=voteReady(),v=h.series.vote;castVote(h,'p0',v.candidates[0],2,100000);castVote(h,'p1',v.candidates[1],2,100100);
 assert.throws(()=>castVote(h,'p2',v.candidates[2],2,110000),/doldu/);
 const restored=JSON.parse(JSON.stringify(h));assert.equal(restored.series.vote.deadline,110000);syncMatch(restored,110000,()=>.7);
 assert.ok(v.candidates.slice(0,2).includes(restored.game.settings.categoryId));assert.equal(restored.series.lastVote.tied,true);assert.equal(restored.series.round,2);assert.equal(h.series.phase,'voting');
});
test('bad votes and stale series commands do not change the match',()=>{
 const h=voteReady(),v=h.series.vote,before=JSON.stringify(h);
 for(const command of [()=>castVote(h,'unknown',v.candidates[0],2),()=>castVote(h,'p0','fake',2),()=>castVote(h,'p0',v.candidates[0],1),()=>advanceSeries(h,0),()=>rankRound(h,ranks(h),0)]){assert.throws(command);assert.equal(JSON.stringify(h),before);}
});
test('a six-player, three-category playlist completes with consistent overall totals',()=>{
 const all=Array.from({length:6},(_,i)=>({id:'x'+i,name:'Kişi '+i}));const h=startMatch({...settings,slots:5,scoring:'points'},all,{mode:'playlist',playlist:['heroes','football','desserts']});
 for(let i=0;i<3;i++){finish(h);assert.equal(h.series.results.length,i+1);if(i<2)advanceSeries(h,h.series.revision);}
 assert.equal(h.series.phase,'finished');for(const p of h.series.players)assert.equal(p.total,h.series.results.reduce((sum,r)=>sum+r.placements.find(other=>other.id===p.id).points,0));
});
