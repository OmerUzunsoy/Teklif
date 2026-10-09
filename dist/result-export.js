import {categoryById} from './catalog.js';
import {cardInfo} from './card-info.js';
export function formatTeams(game,{details=false}={}){
 const category=categoryById(game.settings.categoryId);
 return `TEKLİF · ${category.name}\n${game.players.length} oyuncu · Kişi başı ${game.settings.slots} kart · Başlangıç ${game.settings.budget} jeton\n\n`+game.players.map(p=>{
  const spent=p.cards.reduce((sum,c)=>sum+c.paid,0);
  return `${p.name}\nHarcanan: ${spent} jeton · Kalan: ${p.budget} jeton${p.total==null?'':' · Oyun puanı: '+p.total}\n`+p.cards.map(c=>`• ${c.name}${c.universe?' ['+c.universe+']':''} — ${c.paid} jeton${details?'\n  '+cardInfo(c).text:''}`).join('\n');
 }).join('\n\n');
}
const criteria={
 heroes:'Takım gücünü; yetenek çeşitliliği, dayanıklılık, takım uyumu ve karşı koyma imkânları açısından karşılaştır. Standart, yaygın bilinen karakter sürümlerini kullan; özel ekipman, Sonsuzluk Taşları veya en güçlü alternatif sürümler otomatik verilmesin. Varsaydığın sürümleri belirt. Hazırlık süresi olmayan tarafsız bir karşılaşmayı esas al; hazırlık süresi olursa sıralamanın değişip değişmeyeceğini ayrıca söyle.',
 villains:'Karakterlerin genel yetenekleri, zekâsı, dayanıklılığı ve beraber çalışabilmesi açısından takımları karşılaştır. Belirtilmeyen özel eşyaları ya da en güçlü alternatif sürümleri otomatik ekleme; varsaydığın sürümleri açıkla.',
 football:'Oyuncuların kariyerlerinin iyi dönemlerini esas al. Pozisyon dengesi, oyun kurma, gol üretimi ve savunmayı karşılaştır. Bu kadrolar 3 veya 5 kişilik seçimlerden oluşuyor; eksik oyuncular veya tam 11 kişilik takım icat etme.',
 basketball:'Oyuncuların kariyerlerinin iyi dönemlerini esas al; şut, oyun kurma, savunma ve rol uyumunu karşılaştır. Listede olmayan oyuncuları ekleme.',
 f1:'Pilotların kariyer başarısı, yarış becerileri ve kadro derinliğini karşılaştır. Eşit araç koşullarını varsay; güncel istatistikleri bilmiyorsan uydurma.',
 food:'Menüleri lezzet çeşitliliği, ana yemek dengesi ve geniş bir müşteri kitlesine hitap etme açısından karşılaştır.',
 'street-food':'Menüleri lezzet çeşitliliği, sokak lezzeti çekiciliği ve geniş kitleye hitap etme açısından karşılaştır.',
 desserts:'Tatlıcıları sütlü, şerbetli, çikolatalı ve hafif seçenek dengesi ile farklı zevklere hitap etme açısından karşılaştır.',
 drinks:'İçecek menülerini sıcak-soğuk dengesi, çeşitlilik ve farklı zevklere hitap etme açısından karşılaştır.',
 clothing:'Mağazaları marka tanınırlığı, stil çeşitliliği, fiyat segmentleri ve geniş kitleye hitap etme açısından karşılaştır. Gerçek satış rakamları icat etme.',
 celebrities:'Reklam yüzü seçimlerini tanınırlık, farklı kitlelere erişim ve birlikte tutarlı bir kampanya oluşturabilme açısından karşılaştır. Ürün ve hedef kitle belirtilmediği için genel değerlendirme yap, varsayımlarını açıkla.',
 travel:'Tatil rotalarını kültür, doğa, dinlenme ve deneyim çeşitliliği açısından karşılaştır. Bütçe, tarih ve ulaşım bilgisi verilmediği için fiyat veya uygulanabilirlik uydurma.'
};
export function analysisPrompt(game){
 const c=categoryById(game.settings.categoryId);
 return `Arkadaşlarımızla “Teklif” adlı bir açık artırma oyunu oynadık. Aşağıdaki sonuçları Türkçe analiz et.\n\nOYUNUN MANTIĞI\nKategori: ${c.name}. Amaç: ${c.brief}\nHerkes ${game.settings.budget} oyun jetonuyla başladı ve ${game.settings.slots} kart aldı. Kartlar geniş bir havuzdan rastgele ve tekrarsız seçildi; gelecek kartlar önceden görünmüyordu. Açılış 1 jetondu. İlk teklif sırası dönüşümlüydü; ilk tekliften sonra isteyen oyuncu sıra beklemeden 1 jeton artırdı veya o karttan kalıcı olarak çekildi. En yüksek teklif sahibi kendi teklifini artıramadı. İlk tekliften sonra ${game.settings.timerSeconds??10} saniyelik sayaç başladı ve her yeni teklif süreyi sıfırladı. Herkes çekilince veya süre dolunca son teklif sahibi kartı aldı. Boş kadro yerleri için birer jeton ayrıldı; yalnızca bir kişinin boş yeri kaldığında kalan kartlar birer jetona verildi.\n${game.settings.jokers?'Jokerler açıktı: her oyuncu açılış sırası kendisindeyken ilk tekliften önce bir kez kart değiştirebildi. Joker bütçeyi veya puanı değiştirmedi.\n':''}Sonuç seçimi: ${game.settings.scoring==='debate'?'Oyuncular tartışarak karar verir; uygulama kazanan ilan etmedi.':'Uygulama sabit, editoryal kart puanlarını topladı. Bu puanlar kesin gerçek dünya verisi veya kanonik güç ölçümü değildir.'}\nÖdenen jeton kartın gerçek gücü veya kalitesi değildir. Kalan bütçeye otomatik zafer puanı verme.\n\nTÜM KADROLAR\n${formatTeams(game,{details:true})}\n\nİSTEDİĞİM ANALİZ\n${criteria[c.id]||`${c.metric} açısından seçimleri karşılaştır. Tanınırlık, çeşitlilik, birbirini tamamlama ve kategori amacına uygunluğu dikkate al. Kişisel zevk ile olgusal bilgiyi ayır; bilinmeyen özellik veya güncel rakam uydurma.`}\nHer oyuncunun güçlü ve zayıf yönlerini kısa şekilde anlat. Ardından gerekçeli bir sıralama öner; değerlendirme yakınsa beraberlik veya belirsizlik belirt. Harcanan bütçeyi ayrı bir fiyat/performans değerlendirmesinde ele al. Kart açıklamaları kısa tanıtımlardır; tanımadığın kartı biliyormuş gibi davranma. Sonuç için önemli bir varsayım varsa açıkça yaz. Listede bulunmayan kartları kadrolara ekleme.`;
}
