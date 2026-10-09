// Tiny synthesized cues: no downloaded media, no network or permission needed.
export function createSounds(enabled=true){
 let context=null,lastTick='',lastFinish='',lastCard='';
 const notes={turn:[[660,0,.09],[880,.12,.13]],bid:[[520,0,.055],[760,.055,.08]],card:[[380,0,.07],[510,.065,.11]],tick:[[650,0,.025]],urgent:[[920,0,.065]],finish:[[440,0,.1],[550,.12,.15]],win:[[523,0,.1],[659,.12,.1],[784,.24,.22]],lose:[[392,0,.13],[330,.14,.18]],vote:[[660,0,.07],[880,.07,.1]]};
 function unlock(){if(!enabled)return;try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;context??=new Audio();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}}
 function play(kind){if(!enabled||!context||context.state!=='running'||document.hidden)return;try{for(const [frequency,delay,length] of notes[kind]||[]){const osc=context.createOscillator(),gain=context.createGain(),at=context.currentTime+delay;osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(kind==='tick'?.008:.035,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+length);osc.connect(gain);gain.connect(context.destination);osc.start(at);osc.stop(at+length+.01);}}catch{}}
 return {unlock,play,get enabled(){return enabled;},toggle(){enabled=!enabled;if(enabled){unlock();play('bid');}return enabled;},clock(key,remaining){if(remaining==null||remaining<=0)return;const second=Math.ceil(remaining/1000),tick=key+':'+second;if(tick!==lastTick){lastTick=tick;play(second<=3?'urgent':'tick');}},observe(game,series,you){
  if(!game)return;const card=(series?.round||1)+':'+game.current?.id;
  if(card!==lastCard){if(lastCard)play('card');lastCard=card;}
  let placements=null;
  if(series?.phase==='finished')placements=series.players.map(p=>({id:p.id,rank:1+series.players.filter(other=>other.total>p.total).length}));
  else if(series?.results.some(r=>r.round===series.round))placements=series.results.find(r=>r.round===series.round).placements;
  else if(!series&&game.status==='finished'&&game.settings.scoring==='points')placements=game.players.map(p=>({id:p.id,rank:1+game.players.filter(other=>other.total>p.total).length}));
  const done=placements?card+(series?.phase==='finished'?':series-final':':ranked'):game.status==='finished'?card+':finished':'';
  if(done&&done!==lastFinish){lastFinish=done;const me=placements?.find(p=>p.id===you);play(me?me.rank===1?'win':'lose':'finish');}
 }};
}
