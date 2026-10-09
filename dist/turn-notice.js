const defaults={sound:true,vibration:true,visual:true};
export function createTurnNotice({preferences={},play=()=>{},onNotice=()=>{},isVisible=()=>!globalThis.document?.hidden,vibrate=pattern=>globalThis.navigator?.vibrate?.(pattern),supported=()=>typeof globalThis.navigator?.vibrate==='function'}={}){
 let prefs={...defaults,...preferences},lastKey='',activated=false;
 function emit(name){
  if(!isVisible())return;
  if(prefs.visual)onNotice(name);
  if(prefs.sound)play('turn');
  if(prefs.vibration&&activated&&supported())try{vibrate([90,60,90]);}catch{}
 }
 return {
  get preferences(){return {...prefs};},get vibrationSupported(){return supported();},
  unlock(){activated=true;},
  setPreferences(next){for(const key of Object.keys(defaults))if(typeof next[key]==='boolean')prefs[key]=next[key];if(!prefs.visual)onNotice(null);return {...prefs};},
  preview(){activated=true;emit('Deneme');},
  observe(game,{you=null,shared=false,scope='',round=1,connected=true}={}){
   if(!game){lastKey='';onNotice(null);return;}
   if(!isVisible())return;
   if(!connected){lastKey='';onNotice(null);return;}
   const key=`${scope}:${round}:${game.index}:${game.turnId}:${game.status}`;
   const mine=connected&&game.status==='bidding'&&!(game.price>0)&&game.turnId&&(shared||game.turnId===you);
   if(!mine){lastKey=key;onNotice(null);return;}
   if(key===lastKey)return;lastKey=key;
   emit(game.players.find(p=>p.id===game.turnId)?.name||'Oyuncu');
  }
 };
}
