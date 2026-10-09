// Speech stays on the shared screen and only starts after its voice button is pressed.
export function createAnnouncer(){
 const available=typeof globalThis.speechSynthesis!=='undefined'&&typeof globalThis.SpeechSynthesisUtterance==='function';
 let enabled=false,lastEvent='',lastCount='';
 function say(text){if(!enabled||!available||document.hidden)return;try{const speech=globalThis.speechSynthesis,utterance=new globalThis.SpeechSynthesisUtterance(text),turkish=speech.getVoices().find(v=>v.lang.toLowerCase().startsWith('tr'));utterance.lang='tr-TR';if(turkish)utterance.voice=turkish;utterance.rate=1.08;speech.cancel();speech.speak(utterance);}catch{}}
 return {available,get enabled(){return enabled;},toggle(){if(!available)return false;enabled=!enabled;lastEvent='';lastCount='';if(enabled)say('Açık artırmaya hoş geldiniz.');else globalThis.speechSynthesis.cancel();return enabled;},count(key,remaining){if(!enabled||remaining<=0)return;const second=Math.ceil(remaining/1000),event=key+':'+second;if(second<=3&&event!==lastCount){lastCount=event;say(String(second));}},observe(g,s){
  if(!enabled||!g||s&&s.phase!=='playing'&&g.status!=='finished')return;
  const event=g.status==='sold'||g.status==='finished'?`${s?.round||1}:sale:${g.lastSale?.card.id}`:g.status==='bidding'?`${s?.round||1}:${g.current.id}:${g.activity?.[0]?.seq||'open'}`:'';
  if(!event||event===lastEvent)return;lastEvent=event;
  if(g.status==='sold'||g.status==='finished'){const sale=g.lastSale;if(sale)say(`${sale.name}, ${sale.card.name} kartını ${sale.card.paid} jetona aldı. ${sale.remainingBudget} jetonu kaldı.`);}
  else{const latest=g.activity?.[0];if(latest?.cardId===g.current.id&&latest.type==='joker'){say(`${latest.name} joker kullandı. Yeni kart ${g.current.name}. İlk teklif sırası değişmedi.`);return;}if(latest?.cardId===g.current.id&&latest.type==='pass'){say(`${latest.name} bu karttan çekildi. Artıran var mı?`);return;}const bid=g.activity?.find(a=>a.cardId===g.current.id&&a.type==='bid'),person=g.players.find(p=>p.id===g.turnId);if(bid)say(`${bid.name}, ${bid.amount} jeton teklif verdi. Artıran var mı? İsteyen artırabilir.`);else say(`${g.current.name} ortada. İlk teklif sırası ${person?.name}.`);}
 }};
}
