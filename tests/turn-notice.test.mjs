import test from 'node:test';
import assert from 'node:assert/strict';
import {createTurnNotice} from '../dist/turn-notice.js';
function fixture(){const sounds=[],notices=[],vibrations=[];let visible=true,support=true;const notice=createTurnNotice({play:kind=>sounds.push(kind),onNotice:name=>{if(name)notices.push(name);},isVisible:()=>visible,supported:()=>support,vibrate:pattern=>vibrations.push(pattern)});const g={index:0,status:'bidding',turnId:'a',current:{id:'one'},players:[{id:'a',name:'Ayşe'},{id:'b',name:'Ömer'}]};return {notice,g,sounds,notices,vibrations,hidden(v){visible=!v;},support(v){support=v;}};}
test('turn alerts belong to the current player, fire once per turn and ignore polling and card swaps',()=>{
 const f=fixture();f.notice.unlock();f.notice.observe(f.g,{you:'b'});assert.equal(f.notices.length,0);f.g.turnId='b';f.notice.observe(f.g,{you:'b'});f.notice.observe(f.g,{you:'b'});f.g.current.id='joker-replacement';f.notice.observe(f.g,{you:'b'});assert.deepEqual(f.notices,['Ömer']);assert.deepEqual(f.sounds,['turn']);assert.equal(f.vibrations.length,1);
 f.g.turnId='a';f.notice.observe(f.g,{you:'b'});f.g.turnId='b';f.notice.observe(f.g,{you:'b'});assert.equal(f.notices.length,2);f.g.status='sold';f.notice.observe(f.g,{you:'b'});assert.equal(f.notices.length,2);
});
test('hidden and disconnected phones wait until the game is visible and connected',()=>{
 const f=fixture();f.notice.unlock();f.hidden(true);f.notice.observe(f.g,{you:'a'});assert.equal(f.sounds.length,0);f.hidden(false);f.notice.observe(f.g,{you:'a',connected:false});assert.equal(f.sounds.length,0);f.notice.observe(f.g,{you:'a'});assert.equal(f.sounds.length,1);
});
test('sound, vibration and visual controls are independent, safe without vibration and need interaction',()=>{
 const f=fixture();f.notice.observe(f.g,{you:'a'});assert.equal(f.vibrations.length,0);f.notice.unlock();f.notice.setPreferences({sound:false,visual:false});f.g.index++;f.notice.observe(f.g,{you:'a'});assert.equal(f.sounds.length,1);assert.equal(f.notices.length,1);assert.equal(f.vibrations.length,1);
 f.notice.setPreferences({sound:true,visual:true,vibration:false});f.g.index++;f.notice.observe(f.g,{you:'a'});assert.equal(f.vibrations.length,1);assert.equal(f.sounds.length,2);f.support(false);f.notice.setPreferences({vibration:true});f.notice.preview();assert.equal(f.vibrations.length,1);assert.equal(f.notice.vibrationSupported,false);
});
test('shared phones announce both players and a new round or table restarts notifications',()=>{
 const f=fixture();f.notice.observe(f.g,{shared:true});f.g.turnId='b';f.notice.observe(f.g,{shared:true});f.notice.observe(f.g,{shared:true,round:2});f.notice.observe(null);f.notice.observe(f.g,{shared:true,round:2});assert.deepEqual(f.notices,['Ayşe','Ömer','Ömer','Ömer']);
});
