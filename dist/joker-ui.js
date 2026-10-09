export function jokerButton(game,player,{mine,busy,connectionError,className=''}={}){
 const opening=game.status==='bidding'&&game.price===0;
 if(!game.settings.jokers||!opening)return '';
 const remaining=player?.jokersLeft||0;
 return `<button class="btn ghost joker-button ${className}" data-action="joker" ${!mine||!remaining||busy||connectionError?'disabled':''} aria-label="${remaining?'Joker kullan: ilk tekliften önce kartı değiştir':'Bu turdaki jokerini kullandın'}">${remaining?'Kartı değiştir · 1 joker':'Joker kullanıldı'}</button>`;
}
