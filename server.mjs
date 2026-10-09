import http from 'node:http';
import {serveImage} from './image-store.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {act,viewGame,check,prepareTimer} from './dist/engine.js';
import {normalizePlan,startMatch,syncMatch,rankRound,advanceSeries,castVote} from './dist/series.js';
const root=path.dirname(fileURLToPath(import.meta.url)),assets=path.join(root,'dist'),port=Number(process.env.PORT||4177),statePath=path.join(process.env.TEKLIF_RUNTIME_DIR||path.join(root,'.runtime'),'rooms.json');
let rooms={};try{rooms=JSON.parse(fs.readFileSync(statePath,'utf8'));}catch{}
let migrated=false;for(const room of Object.values(rooms))if(room.game){if(room.game.settings.timerSeconds==null||room.game.activity==null||room.game.status==='bidding'&&room.game.price>0&&room.game.deadline==null)migrated=true;prepareTimer(room.game);room.settings.timerSeconds=room.game.settings.timerSeconds;}if(migrated)persist();
const token=()=>randomBytes(24).toString('hex');
const ips=Object.entries(os.networkInterfaces()).sort(([a],[b])=>a==='en0'?-1:b==='en0'?1:0).flatMap(([,entries])=>entries.filter(i=>i.family==='IPv4'&&!i.internal).map(i=>i.address));
function persist(){fs.mkdirSync(path.dirname(statePath),{recursive:true});fs.writeFileSync(statePath+'.tmp',JSON.stringify(rooms),{mode:0o600});fs.renameSync(statePath+'.tmp',statePath);}
function snapshot(room,t,display=false){const member=display?{host:false,id:null}:room.members.find(m=>m.token===t);check(member,'Odaya yeniden katılın.');return {serverNow:Date.now(),code:room.code,host:member.host,you:member.id,phase:room.series?.phase==='voting'?'vote':room.series?.phase==='finished'?'series-final':room.game?'game':'lobby',playPlan:room.playPlan||{mode:'single',playlist:[],rounds:1},series:room.series||null,settings:room.settings,members:room.members.map(({token,...m})=>m),game:room.game?viewGame(room.game):null};}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function body(req){let value='';for await(const chunk of req){value+=chunk;check(value.length<=16000,'İstek çok büyük.');}try{return JSON.parse(value||'{}');}catch{throw new Error('İstek okunamadı.');}}
export const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 const picture=url.pathname.match(/^\/api\/image\/([a-z][a-z0-9-]*-\d+)$/);if(picture&&(req.method==='GET'||req.method==='HEAD')){await serveImage(picture[1],req,res);return;}
 if(url.pathname==='/api/network'&&req.method==='GET'){json(res,200,{urls:ips.map(ip=>`http://${ip}:${server.address().port}`)});return;}
 if(url.pathname==='/api/rooms'&&req.method==='POST'){const data=await body(req);const name=String(data.name||'').trim().slice(0,24);check(name,'İsmini yaz.');const active=Object.values(rooms).filter(r=>Date.now()-r.updated<86400000);rooms=Object.fromEntries(active.map(r=>[r.code,r]));check(active.length<100,'Şimdilik yeni oda açılamıyor.');let code;do{code=randomBytes(3).toString('hex').slice(0,5).toUpperCase();}while(rooms[code]);const member={id:token().slice(0,12),name,host:true,token:token()};const room={code,members:[member],settings:data.settings,playPlan:normalizePlan(data.playPlan,data.settings?.categoryId,true),series:null,game:null,updated:Date.now()};rooms[code]=room;persist();json(res,200,{token:member.token,...snapshot(room,member.token)});return;}
 const match=url.pathname.match(/^\/api\/rooms\/([A-Z0-9]{5})(?:\/(join|start|action|restart|remove|configure|rank|series-next|vote|screen))?$/);
 if(match){const room=rooms[match[1]];check(room,'Bu oda bulunamadı. Kodu kontrol edin.');const endpoint=match[2];
  if(syncMatch(room)){room.updated=Date.now();persist();}
  if(req.method==='GET'&&endpoint==='screen'){check(room.settings?.television===true||room.game?.settings.television===true,'Bu odada TV modu açık değil.');json(res,200,snapshot(room,null,true));return;}
  if(req.method==='GET'&&!endpoint){json(res,200,snapshot(room,req.headers['x-player-token']));return;}
  check(req.method==='POST','Bu işlem desteklenmiyor.');const data=await body(req);
  if(endpoint==='join'){check(!room.game,'Oyun başladı. Sonraki maç için bekleyin.');check(room.members.length<6,'Oda dolu: en fazla 6 kişi.');const name=String(data.name||'').trim().slice(0,24);check(name,'İsmini yaz.');check(!room.members.some(m=>m.name.toLocaleLowerCase('tr')===name.toLocaleLowerCase('tr')),'Bu isim kullanılıyor. Başka bir isim seç.');const member={id:token().slice(0,12),name,host:false,token:token()};room.members.push(member);room.updated=Date.now();persist();json(res,200,{token:member.token,...snapshot(room,member.token)});return;}
  const t=req.headers['x-player-token'];const member=room.members.find(m=>m.token===t);check(member,'Odaya yeniden katılın.');
  if(endpoint==='configure'){check(member.host&&!room.game,'Ayarları bekleme odasında oda sahibi değiştirir.');const settings=data.settings||room.settings;const plan=normalizePlan(data.playPlan||room.playPlan,settings.categoryId,true);const preview=plan.mode==='playlist'&&!plan.playlist.length?startMatch(settings,[{id:'preview1',name:'Birinci'},{id:'preview2',name:'İkinci'}],{mode:'playlist',playlist:[settings.categoryId]}):startMatch(settings,[{id:'preview1',name:'Birinci'},{id:'preview2',name:'İkinci'}],plan);room.settings={...(preview.series?.settings||preview.game.settings),categoryId:preview.game.settings.categoryId};room.playPlan=plan;}
  else if(endpoint==='start'){check(member.host,'Oyunu oda sahibi başlatır.');check(!room.game,'Oyun zaten başladı.');const settings=data.settings||room.settings;const plan=normalizePlan(data.playPlan||room.playPlan,settings.categoryId);Object.assign(room,startMatch(settings,room.members,plan));room.settings={...(room.series?.settings||room.game.settings),categoryId:room.game.settings.categoryId};room.playPlan=plan;}
  else if(endpoint==='action'){check(room.game,'Oyun henüz başlamadı.');check(!room.series||room.series.phase==='playing','Şu an tur sonuçları veya oylama açık.');if(data.type==='next')check(member.host,'Sıradaki kartı oda sahibi açar.');try{act(room.game,member.id,data.type,data.amount,data.revision);}catch(error){persist();throw error;}}
  else if(endpoint==='restart'){check(member.host,'Yeni maçı oda sahibi açar.');check(room.game?.status==='finished','Önce bu maçı tamamlayın.');check(!room.series||room.series.phase==='finished','Önce seriyi tamamlayın.');room.game=null;room.series=null;}
  else if(endpoint==='rank'){check(member.host,'Tur sıralamasını oda sahibi belirler.');rankRound(room,data.placements,data.revision);}
  else if(endpoint==='series-next'){check(member.host,'Sıradaki turu oda sahibi açar.');advanceSeries(room,data.revision);}
  else if(endpoint==='vote'){castVote(room,member.id,data.categoryId,data.round);}
  else if(endpoint==='remove'){check(member.host&&!room.game,'Oyuncular yalnızca bekleme odasında çıkarılabilir.');check(data.id!==member.id,'Oda sahibi çıkarılamaz.');room.members=room.members.filter(m=>m.id!==data.id);}
  else throw new Error('İşlem bulunamadı.');
  syncMatch(room);room.updated=Date.now();persist();json(res,200,snapshot(room,t));return;
 }
 check(req.method==='GET'||req.method==='HEAD','Bu işlem desteklenmiyor.');const allowed=['/','/index.html','/style.css','/app.js','/catalog.js','/extra-catalog.js','/new-catalog.js','/engine.js','/favicon.svg','/image-cards.js','/card-info.js','/card-descriptions.js','/result-export.js','/series.js','/sounds.js','/series-ui.js','/auction-ui.js','/value-rating.js','/tv-ui.js','/announcer.js','/join-qr.js','/qr-code-generator.js','/turn-notice.js','/joker-ui.js'];if(!allowed.includes(url.pathname)){res.writeHead(404);res.end('Bulunamadı');return;}
 const target=path.join(assets,url.pathname==='/'?'index.html':url.pathname.slice(1));const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'}[path.extname(target)];res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});if(req.method==='HEAD')res.end();else fs.createReadStream(target).pipe(res);
 }catch(e){json(res,400,{error:e.message||'İşlem tamamlanamadı.'});}});
setInterval(()=>{let changed=false;for(const room of Object.values(rooms))if(syncMatch(room)){room.updated=Date.now();changed=true;}if(changed)persist();},250).unref();
server.listen(port,'0.0.0.0',()=>{const listeningPort=server.address().port;console.log(`TEKLİF hazır: http://localhost:${listeningPort}`);ips.forEach(ip=>console.log(`Telefon bağlantısı: http://${ip}:${listeningPort}`));process.send?.({type:'ready',port:listeningPort});});
