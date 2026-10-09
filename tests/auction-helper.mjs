// Choose an eligible challenger; this is a test actor, not a gameplay turn.
export function auctionActor(g){return g.price===0?g.turnId:g.activeIds.find(id=>id!==g.leaderId);}
