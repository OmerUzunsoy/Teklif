import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnnouncer} from '../dist/announcer.js';
test('TV announcements start on demand, speak Turkish once per event and honor mute and hidden screens',()=>{
 const oldSpeech=globalThis.speechSynthesis,oldUtterance=globalThis.SpeechSynthesisUtterance,oldDocument=globalThis.document;
 const spoken=[],voice={lang:'tr-TR'};let canceled=0;
 globalThis.document={hidden:false};globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};globalThis.speechSynthesis={cancel(){canceled++;},getVoices(){return [voice];},speak(u){spoken.push(u);}};
 try{
  const a=createAnnouncer(),g={status:'bidding',current:{id:'c1',name:'Thanos'},turnId:'p0',players:[{id:'p0',name:'Ömer'}],activity:[]};
  a.observe(g,null);assert.equal(spoken.length,0);assert.equal(a.enabled,false);
  a.toggle();a.observe(g,null);a.observe(g,null);assert.equal(spoken.length,2);assert.ok(spoken.at(-1).text.includes('Thanos'));assert.equal(spoken.at(-1).lang,'tr-TR');assert.equal(spoken.at(-1).voice,voice);
  g.activity=[{cardId:'c1',seq:1,type:'bid',name:'Ayşe',amount:2}];a.observe(g,null);assert.match(spoken.at(-1).text,/Ayşe, 2 jeton/);
  g.status='sold';g.lastSale={name:'Ayşe',card:{id:'c1',name:'Thanos',paid:2},remainingBudget:18};a.observe(g,null);assert.match(spoken.at(-1).text,/18 jetonu kaldı/);a.observe(g,null);assert.equal(spoken.length,4);
  a.count('next',2999);a.count('next',2500);a.count('next',1999);a.count('next',999);assert.deepEqual(spoken.slice(-3).map(u=>u.text),['3','2','1']);
  globalThis.document.hidden=true;a.count('hidden',2000);assert.equal(spoken.length,7);a.toggle();assert.equal(a.enabled,false);assert.ok(canceled>=8);
 }finally{if(oldSpeech===undefined)delete globalThis.speechSynthesis;else globalThis.speechSynthesis=oldSpeech;if(oldUtterance===undefined)delete globalThis.SpeechSynthesisUtterance;else globalThis.SpeechSynthesisUtterance=oldUtterance;if(oldDocument===undefined)delete globalThis.document;else globalThis.document=oldDocument;}
});
test('a browser without speech support keeps the auction usable with voice disabled',()=>{const a=createAnnouncer();assert.equal(a.available,false);assert.equal(a.toggle(),false);});
