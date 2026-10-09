import test from 'node:test';
import assert from 'node:assert/strict';
import {createSounds} from '../dist/sounds.js';
test('sound cues require an unlocked context, tick once per second and respect mute and visibility',()=>{
 const previousAudio=globalThis.AudioContext,previousDocument=globalThis.document;let starts=0;
 class FakeAudio{constructor(){this.state='running';this.currentTime=0;this.destination={};}createOscillator(){return {frequency:{value:0},connect(){},start(){starts++;},stop(){}};}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}}
 try{
  globalThis.AudioContext=FakeAudio;globalThis.document={hidden:false};const sound=createSounds();sound.play('bid');assert.equal(starts,0);sound.unlock();sound.play('bid');assert.equal(starts,2);
  sound.clock('auction1',2999);assert.equal(starts,3);sound.clock('auction1',2800);assert.equal(starts,3);sound.clock('auction1',1999);assert.equal(starts,4);
  assert.equal(sound.toggle(),false);sound.play('win');sound.clock('auction1',999);assert.equal(starts,4);
  globalThis.document.hidden=true;sound.toggle();sound.play('lose');assert.equal(starts,4);
  globalThis.document.hidden=false;sound.play('win');assert.equal(starts,7);
  const game={current:{id:'heroes-1'},status:'finished',settings:{scoring:'points'},players:[{id:'a',total:100},{id:'b',total:90}]};sound.observe(game,null,'a');assert.equal(starts,10);sound.observe(game,null,'a');assert.equal(starts,10);
 }finally{if(previousAudio===undefined)delete globalThis.AudioContext;else globalThis.AudioContext=previousAudio;if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;}
});
