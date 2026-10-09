import {cardDescriptions} from './card-descriptions.js';
export function cardInfo(card){return cardDescriptions[card.id]||{text:'Bu kategoride açık artırmaya çıkan bir seçim.',source:null};}
