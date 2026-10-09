import fs from 'node:fs';
import {categories} from '../dist/catalog.js';
const manifest=JSON.parse(fs.readFileSync(new URL('../dist/image-manifest.json',import.meta.url)));
const overrides={};
function add(names,text){for(const name of names.split('|'))overrides[name]=text;}
const food={
'İskender':'Döner etinin pide, domates sosu, tereyağı ve yoğurtla servis edildiği yemek.',
'Adana kebap':'Baharatlı kıymanın şişte pişirildiği kebap; acılı lezzetiyle bilinir.',
'Mantı':'Küçük hamur parçaları içinde kıyma; genellikle sarımsaklı yoğurt ve sosla sunulur.',
'Lahmacun':'İnce hamurun üzerine kıyma, sebze ve baharat konularak fırınlanan lezzet.',
'Pizza':'Hamur üzerine sos, peynir ve çeşitli malzemeler konularak pişirilen İtalyan yemeği.',
'Hamburger':'Ekmek arasına köfte, sebze ve sos konularak hazırlanan sandviç.',
'Döner':'Dikey şişte döndürülerek pişirilen, ince kesilmiş et veya tavuk.',
'İçli köfte':'Bulgurlu dış kabuğun içinde kıymalı harç bulunan köfte.',
'Karnıyarık':'Patlıcanın kıymalı, domatesli harçla doldurulup pişirildiği yemek.',
'Hünkar beğendi':'Köz patlıcanlı beğendi üzerinde servis edilen et yemeği.',
'Köfte':'Kıyma ve baharatla hazırlanan, ızgara veya tavada pişirilebilen yemek.',
'Beyti':'Kebabın lavaşa sarılıp sos ve yoğurtla sunulduğu et yemeği.',
'Urfa kebap':'Şişte pişirilen kıyma kebabı; Adana kebabına göre genellikle daha az acılıdır.',
'Kuzu tandır':'Kuzu etinin uzun süre, yavaş pişirilerek hazırlandığı yemek.',
'Çökertme kebabı':'İnce kızarmış patates üzerinde yoğurt, et ve sosla servis edilen yemek.',
'Etli ekmek':'İnce uzun hamur üzerine kıymalı harçla hazırlanan, Konya ile anılan fırın lezzeti.',
'Tavuk şiş':'Tavuk parçalarının şişe dizilip ızgarada pişirildiği yemek.',
'Çöp şiş':'Küçük et parçalarının kısa şişlerde pişirildiği kebap.',
'Patlıcan kebabı':'Patlıcan dilimleri ile etin birlikte pişirildiği kebap.',
'Testi kebabı':'Et ve sebzelerin kapalı bir testide pişirildiği yemek.',
'Tas kebabı':'Etin sebze ve sosla yavaş pişirildiği sulu yemek.',
'Levrek':'Izgara, fırın veya tavada hazırlanabilen beyaz etli bir balık.',
'Balık ekmek':'Ekmek içinde balık, soğan ve yeşillikle hazırlanan sandviç.',
'Sushi':'Sirkeli pirinçle hazırlanan Japon yemeği; balık veya sebze gibi farklı içlerle yapılır.',
'Ramen':'Et suyu veya sebze suyunda erişte; üzerine çeşitli malzemeler eklenen Japon yemeği.',
'Pad Thai':'Pirinç eriştesi, sebze ve sosla yapılan Tayland usulü tavada yemek.',
'Taco':'Tortilla içinde et, sebze ve sos gibi malzemelerle hazırlanan Meksika lezzeti.',
'Burrito':'Büyük tortillaya et, fasulye, pirinç gibi malzemeler sarılarak hazırlanan yemek.',
'Fajita':'Etin biber ve soğanla pişirildiği, tortilla ile sunulan yemek.',
'Risotto':'Pirinç ve et ya da sebze suyunun yavaş pişirildiği kremamsı İtalyan yemeği.',
'Lazanya':'Makarna katmanları arasında sos, peynir ve farklı harçlarla fırınlanan yemek.',
'Spagetti':'Uzun, ince makarna; farklı soslarla servis edilir.',
'Fettucine Alfredo':'Geniş şerit makarnanın tereyağı ve parmesanla hazırlandığı yemek; kremalı uyarlamaları da vardır.',
'Falafel':'Nohut veya bakladan hazırlanan baharatlı, kızartılmış köfteler.',
'Humus':'Nohut, tahin, limon ve sarımsakla hazırlanan meze.',
'Kuru fasulye':'Fasulyenin salçalı sosla pişirildiği yemek; çoğunlukla pilavla servis edilir.',
'Dolma':'Sebzelerin pirinçli veya kıymalı harçla doldurulmasıyla yapılan yemek.',
'Yaprak sarma':'Asma yaprağına pirinçli veya kıymalı harç sarılarak yapılan yemek.',
'Menemen':'Yumurta, domates ve biberle hazırlanan tava yemeği.',
'Mücver':'Rendelenmiş kabak, yumurta, un ve otlarla hazırlanan sebze köftesi.',
'Kokoreç':'Baharatlarla servis edilen, şişte pişmiş kuzu veya oğlak bağırsağı.',
'Midye dolma':'Midyenin baharatlı pirinç harcıyla doldurulmasıyla hazırlanan sokak lezzeti.',
'Kumpir':'Fırınlanmış büyük patates; tereyağı, peynir ve seçilen garnitürlerle servis edilir.',
'Islak hamburger':'Köfteli ekmeğin domatesli sosla yumuşatıldığı sıcak sandviç.',
'Tantuni':'İnce doğranmış et veya tavuğun sacda pişirilip dürüm olarak sunulduğu Mersin lezzeti.',
'Simit':'Susam kaplı, halka biçiminde ekmek.',
'Kumru':'Özel ekmekte peynir ve çeşitli sandviç malzemeleriyle hazırlanan İzmir lezzeti.',
'Ayvalık tostu':'Özel tost ekmeğinde peynir, şarküteri ürünleri ve garnitürlerle hazırlanan tost.',
'Gözleme':'İnce açılmış hamurun peynir, patates veya başka bir içle sacda pişirilmesi.',
'Arnavut ciğeri':'Küçük doğranmış ciğerin unlanıp kızartıldığı yemek.',
'Nohut dürüm':'Nohut ve garnitürlerin lavaşa sarıldığı dürüm.',
'Patso':'Ekmek arasında patates kızartması ve soslarla hazırlanan sandviç.',
'Kestane':'Kabuğuyla közde veya fırında pişirilen kestane.',
'Mısır':'Haşlanmış ya da közde pişirilmiş mısır koçanı.',
'Patlamış mısır':'Isıyla patlatılan mısır tanelerinden yapılan atıştırmalık.',
'Lokma':'Kızartılmış küçük hamur parçalarının şerbetle buluşturulduğu tatlı.',
'Tulumba':'Şekil verilmiş hamurun kızartılıp şerbete batırıldığı tatlı.',
'Pamuk şeker':'Şekerin ince liflere dönüştürülmesiyle yapılan hafif, kabarık tatlı.',
'Dondurma':'Sütlü veya farklı bazlarla hazırlanan dondurulmuş tatlı.',
'Waffle':'Özel kalıpta pişirilen hamur; meyve, çikolata gibi malzemelerle sunulur.',
'Krep':'Tavada ince pişirilen hamur; tatlı veya tuzlu içlerle servis edilebilir.',
'Churros':'Uzun biçimli kızarmış hamur; çoğunlukla şeker ve tarçınla servis edilir.',
'Hot dog':'Uzun ekmek içinde sosis ve soslarla hazırlanan sandviç.',
'Corn dog':'Sosisin mısır unlu hamurla kaplanıp kızartıldığı atıştırmalık.',
'Shawarma':'Döner usulü pişirilen etin ekmek veya dürümle sunulduğu Orta Doğu lezzeti.',
'Pretzel':'Düğümlü biçimiyle tanınan, çoğunlukla tuzlu fırın hamur işi.',
'Bagel':'Ortası delik, pişirilmeden önce suda haşlanan ekmek.',
'Empanada':'Et, peynir veya sebze gibi içlerle doldurulmuş kapalı hamur işi.',
'Arepa':'Mısır hamurundan yapılan, içi doldurulabilen yuvarlak ekmek.',
'Banh mi':'Baget ekmekte et, sebze ve otlarla hazırlanan Vietnam sandviçi.',
'Bao':'Buharda pişirilen yumuşak hamur; çeşitli içlerle sunulur.',
'Samosa':'Baharatlı patates veya başka içlerle doldurulan üçgen hamur işi.',
'Patates kızartması':'Patatesin dilimlenip yağda kızartılmasıyla hazırlanan atıştırmalık.',
'Soğan halkası':'Soğan dilimlerinin hamur veya pane kaplamasıyla kızartılması.',
'Çıtır tavuk':'Tavuk parçalarının kaplanıp kızartıldığı çıtır lezzet.',
'Fırın patates':'Patatesin fırında pişirildiği, baharatla zenginleştirilebilen garnitür.',
'Baklava':'İnce yufka katmanları arasında fıstık veya ceviz; şerbetle hazırlanan tatlı.',
'Künefe':'Kadayıf ve eriyen peynirle yapılan, sıcak ve şerbetli tatlı.',
'San Sebastian cheesecake':'Dışı koyu renk pişen, içi kremamsı, tabansız cheesecake.',
'Profiterol':'Kremayla doldurulmuş küçük hamur topları ve çikolata sosu.',
'Sütlaç':'Süt, pirinç ve şekerle yapılan tatlı; fırınlanmış çeşidi de vardır.',
'Kazandibi':'Altı karamelize edilmiş sütlü tatlı.',
'Tiramisu':'Kahveyle ıslatılmış kedi dili, mascarpone kreması ve kakao içeren İtalyan tatlısı.',
'Trileçe':'Süt karışımıyla ıslatılmış sünger kek; sıklıkla karamel sosuyla sunulur.',
'Kadayıf':'İnce tel hamurla yapılan, ceviz veya fıstık eklenebilen şerbetli tatlı.',
'Katmer':'İnce hamurla yapılan lezzet; tatlı çeşidinde fıstık ve kaymak bulunabilir.',
'Şöbiyet':'İnce yufka, fıstık ve kremalı içle hazırlanan şerbetli tatlı.',
'Sütlü Nuriye':'Sütlü şerbetle hazırlanan, fındıklı baklava türü.',
'Revani':'İrmikli kekin şerbetle ıslatılmasıyla yapılan tatlı.',
'Şekerpare':'Küçük hamur kurabiyelerinin şerbete batırılmasıyla yapılan tatlı.',
'Güllaç':'İnce güllaç yaprakları, süt ve şekerle hazırlanır; ceviz gibi içler eklenebilir.',
'Aşure':'Buğday, bakliyat, kuru meyve ve kuruyemişle hazırlanan tatlı.',
'İrmik helvası':'İrmiğin yağda kavrulup şekerli sıvıyla pişirilmesiyle yapılan tatlı.',
'Un helvası':'Kavrulmuş un, yağ ve şekerli sıvıyla hazırlanan helva.',
'Tahin helvası':'Tahin ve şekerle hazırlanan, yoğun dokulu helva.',
'Ekmek kadayıfı':'Özel ekmeğin şerbetle ıslatıldığı, sıklıkla kaymakla servis edilen tatlı.',
'Şambali':'İrmik ağırlıklı hamurla yapılan şerbetli tatlı.',
'Tavukgöğsü':'Geleneksel tarifinde ince tavuk lifleri bulunan sütlü tatlı; tavuksuz çeşitleri de vardır.',
'Keşkül':'Bademli sütlü tatlı.',
'Muhallebi':'Süt, şeker ve nişasta veya unla kıvamlandırılan tatlı.',
'Supangle':'Çikolatalı veya kakaolu, kıvamlı sütlü tatlı.',
'Mozaik pasta':'Kırık bisküvi ve kakaolu karışımla hazırlanıp soğutulan pasta.',
'Ekler':'Uzun biçimli hamurun krema ile doldurulup üzerinin kaplandığı tatlı.',
'Makaron':'Badem unlu iki küçük kabuk arasında krema bulunan Fransız tatlısı.',
'Donut':'Halka biçiminde hamur tatlısı; üzerine şeker veya kaplama eklenebilir.',
'Cupcake':'Tek kişilik küçük kek; çoğunlukla krema ile süslenir.',
'Sorbe':'Meyve ve şekerli suyla hazırlanan, genellikle süt içermeyen dondurulmuş tatlı.',
'Panna cotta':'Krema, şeker ve jelatinle hazırlanan İtalyan tatlısı.',
'Crème brûlée':'Kremalı tatlının üstüne çıtır karamelize şeker tabakası eklenir.',
'Pavlova':'Beze tabanı üzerinde krema ve meyveyle hazırlanan tatlı.',
'Elmalı turta':'Hamur içinde elmalı harçla hazırlanan fırın tatlısı.',
'Havuçlu kek':'Rendelenmiş havuçla hazırlanan kek; ceviz ve tarçın eklenebilir.',
'Dubai çikolatası':'Çikolata içinde fıstık kreması ve çıtır kadayıfla tanınan tatlı.',
'Türk kahvesi':'İnce öğütülmüş kahvenin suyla cezvede pişirildiği, telveli kahve.',
'Çay':'Çay yapraklarının sıcak suda demlenmesiyle hazırlanan içecek.',
'Limonata':'Limon suyu, su ve şekerle hazırlanan ferahlatıcı içecek.',
'Ayran':'Yoğurt, su ve tuzla hazırlanan içecek.',
'Taze portakal suyu':'Portakalın sıkılmasıyla elde edilen meyve suyu.',
'Sıcak çikolata':'Kakao veya çikolatanın süt ya da suyla hazırlandığı sıcak içecek.',
'Latte':'Espresso üzerine bol sıcak süt ve ince süt köpüğü eklenen kahve.',
'Cappuccino':'Espresso, sıcak süt ve süt köpüğüyle hazırlanan kahve.',
'Espresso':'Basınçlı sıcak suyla demlenen, yoğun ve küçük porsiyonlu kahve.',
'Americano':'Espressonun sıcak suyla seyreltilmesiyle yapılan kahve.',
'Flat white':'Espresso ve ince dokulu süt köpüğüyle hazırlanan sütlü kahve.',
'Mocha':'Espresso, çikolata ve sütle hazırlanan kahve.',
'Cold brew':'Kahvenin soğuk suda uzun süre demlenmesiyle hazırlanan içecek.',
'Frappe':'Çalkalanmış kahve ve buzla hazırlanan soğuk içecek.',
'Menengiç kahvesi':'Kahve çekirdeği yerine menengiç meyvesiyle hazırlanan içecek.',
'Salep':'Salep tozu, süt ve şekerle hazırlanan, sıklıkla tarçınla sunulan sıcak içecek.',
'Boza':'Tahılların fermente edilmesiyle hazırlanan kıvamlı içecek.',
'Şalgam':'Siyah havuç, şalgam ve tahılların fermantasyonuyla yapılan ekşi içecek.',
'Gazoz':'Şekerli, aromalı ve gazlı içecek.',
'Kola':'Kendine özgü aromalı, gazlı içecek; şekerli ve şekersiz çeşitleri bulunur.',
'Portakallı gazlı içecek':'Portakal aromalı, gazlı içecek.',
'Limonlu gazlı içecek':'Limon aromalı, gazlı içecek.',
'Sade soda':'Doğal mineralli, gazlı su.',
'Buzlu çay':'Soğuk servis edilen çay; meyve aromalı çeşitleri de vardır.',
'Matcha latte':'Toz yeşil çayın sütle birleştirildiği içecek.',
'Yeşil çay':'Yeşil çay yapraklarının sıcak suda demlenmesiyle hazırlanan içecek.',
'Zencefil çayı':'Zencefilin sıcak suda demlenmesiyle hazırlanan içecek.'};
Object.assign(overrides,food);
for(const n of ['Elma','Vişne','Nar','Üzüm','Havuç','Ananas'])overrides[n+' suyu']=n+' ile hazırlanan meyve veya sebze suyu.';
const heroes={
'Red Hood':'Jason Todd, Batman’in eski Robin’i. Yakın dövüş, strateji ve özel silahlarla savaşan bir anti-kahraman.',
'Batman':'Gotham’ın koruyucusu. Süper güç yerine dedektiflik, dövüş eğitimi, teknoloji ve hazırlığa dayanır.',
'Venom':'Bir insanla birleşen uzaylı simbiyot. Güçlü, çevik ve biçim değiştirebilen bir anti-kahraman.',
'Superman':'Kripton kökenli kahraman; uçuş, çok yüksek güç ve ısı görüşüyle tanınır.',
'Thor':'Asgardlı gök gürültüsü tanrısı; güçlü çekici ve yıldırım yetenekleriyle savaşır.',
'Hulk':'Bruce Banner’ın güçlü dönüşümü; olağanüstü fiziksel güç ve dayanıklılıkla tanınır.',
'Doctor Strange':'Stephen Strange; büyü, koruyucu tılsımlar ve boyutlar arası geçitlerle tanınan kahraman.',
'Scarlet Witch':'Wanda Maximoff; büyü ve gerçekliği etkileyen güçleriyle tanınır.',
'Iron Man':'Tony Stark; uçan, silahlı ve gelişmiş teknolojili zırhla savaşır.',
'Wonder Woman':'Amazon savaşçısı Diana; güç, dövüş ustalığı ve Doğruluk Kementiyle tanınır.',
'Spider-Man':'Örümcek güçleri, ağ atıcıları ve tehlikeyi önceden sezen örümcek hissiyle tanınır.',
'Captain America':'Steve Rogers; gelişmiş fiziksel yetenekleri, kalkanı ve liderliğiyle tanınır.',
'Flash':'Çok yüksek hızla hareket eden, Speed Force ile bağlantılı DC kahramanı.',
'Aquaman':'Atlantis ile bağlantılı kahraman; su altında yaşayabilir, deniz canlılarıyla iletişim kurar.',
'Green Lantern':'Güç yüzüğüyle düşüncelerini enerji yapıları hâline getiren DC kahramanı.',
'Captain Marvel':'Carol Danvers; uçuş, yüksek güç ve enerji yetenekleriyle tanınır.',
'Black Panther':'Wakanda’nın kahramanı; dövüş eğitimi ve vibranyum teknolojisiyle tanınır.',
'Wolverine':'İyileşme yeteneği ve adamantiyum pençeleriyle tanınan X-Men üyesi.',
'Deadpool':'Hızlı iyileşen, silah ve kılıç kullanan, esprileriyle tanınan anti-kahraman.',
'Vision':'Sentetik kahraman; uçuş, yoğunluk değiştirme ve enerji yetenekleriyle tanınır.',
'Ant-Man':'Teknolojik kostümü sayesinde boyutunu küçültebilen veya büyütebilen kahraman.',
'Wasp':'Küçülme, uçuş ve enerji atışları sağlayan teknolojik kostümlü kahraman.',
'Hawkeye':'Usta okçu; farklı amaçlara uygun özel oklar kullanır.',
'Black Widow':'Casusluk, yakın dövüş ve taktik becerileriyle tanınan kahraman.',
'Daredevil':'Görme engelli kahraman; gelişmiş duyuları ve yakın dövüş becerileriyle savaşır.',
'Luke Cage':'Yüksek fiziksel güç ve dayanıklı derisiyle tanınan kahraman.',
'Jessica Jones':'Yüksek fiziksel güce sahip, dedektiflik de yapan Marvel karakteri.',
'Iron Fist':'Dövüş ustası; chi enerjisini yumruğunda yoğunlaştırmasıyla tanınır.',
'Shazam':'Sihirli dönüşümü sayesinde yüksek güç, uçuş ve yıldırım yetenekleri kazanır.',
'Supergirl':'Kriptonlu kahraman; uçuş, yüksek güç ve ısı görüşüyle tanınır.',
'Cyborg':'Vücudu gelişmiş teknolojiyle birleşmiş kahraman; sistemlerle bağlantı ve silah yetenekleri vardır.',
'Green Arrow':'Okçuluk, özel oklar ve taktik becerileriyle tanınan DC kahramanı.',
'Storm':'Havayı kontrol edebilen X-Men üyesi; fırtına ve yıldırım oluşturabilir.',
'Cyclops':'Gözlerinden güçlü enerji ışınları çıkarabilen X-Men liderlerinden biri.',
'Jean Grey':'Telepati ve telekineziyle tanınan mutant; Phoenix bağlantısı sürüme göre değişir.',
'Beast':'Hank McCoy; bilimsel zekâsı, kuvveti ve çevikliğiyle tanınan X-Men üyesi.',
'Nightcrawler':'Işınlanabilen, çevik X-Men üyesi.',
'Rogue':'Dokunarak başkalarının güçlerini ve anılarını emebilen mutant.',
'Gambit':'Nesnelere enerji yükleyebilen mutant; oyun kartlarını silah olarak kullanmasıyla tanınır.',
'Professor X':'Charles Xavier; güçlü telepati yeteneğine sahip X-Men kurucusu.',
'Magneto':'Manyetik alanları ve metalleri kontrol eden mutant.',
'Silver Surfer':'Kozmik güçle uçabilen ve enerji kullanabilen Marvel karakteri.',
'Star-Lord':'Peter Quill; Guardians of the Galaxy ekibinde silah, teknoloji ve taktik kullanan maceracı.',
'Groot':'Ağaç benzeri uzaylı; büyüme ve vücudunu yeniden oluşturma yetenekleriyle tanınır.',
'Rocket':'Silahlar, mekanik ve tuzaklar konusunda yetenekli Guardians of the Galaxy üyesi.',
'Gamora':'Yakın dövüş ve silah kullanımında uzman Guardians of the Galaxy üyesi.',
'Drax':'Yüksek fiziksel gücü ve dövüş becerileriyle tanınan Guardians of the Galaxy üyesi.',
'Thanos':'Titan kökenli güçlü ve zeki Marvel karakteri. Sonsuzluk Taşları bu kartta otomatik olarak verilmez.',
'Darkseid':'Apokolips’in hükümdarı; yüksek güç ve Omega ışınlarıyla tanınır.',
'Joker':'Batman’in baş düşmanlarından; tuzaklar, suç planları ve kaosla tanınır.',
'Lex Luthor':'Superman’in rakibi; zekâ, teknoloji ve kaynaklarına dayanır.',
'Harley Quinn':'Gotham ile bağlantılı, akrobatik dövüş ve sıra dışı silahlar kullanan karakter.',
'Nightwing':'Dick Grayson; eski Robin, akrobasi ve yakın dövüş ustası.',
'Robin':'Batman’in yardımcı kahramanı; dövüş, akrobasi ve dedektiflik eğitimiyle tanınır.',
'Batgirl':'Batman ailesinin kahramanlarından; teknoloji ve dövüş becerileriyle suçla mücadele eder.',
'Invincible':'Mark Grayson; Viltrumlu mirası sayesinde uçuş, yüksek güç ve dayanıklılık kazanır.',
'Omni-Man':'Nolan Grayson; Viltrumlu, uçabilen ve çok yüksek fiziksel güce sahip karakter.',
'Homelander':'The Boys karakteri; uçuş, yüksek fiziksel güç ve ısı görüşüyle tanınır.',
'Starlight':'The Boys karakteri; ışık ve elektrik enerjisiyle bağlantılı güçleri vardır.',
'Atom Eve':'Invincible evreninde maddeyi dönüştürme yeteneğiyle tanınan kahraman.',
'Loki':'Asgardlı hilebaz; büyü, yanılsama ve kurnaz planlarıyla tanınır.',
'Doctor Doom':'Victor von Doom; teknoloji, zırh ve büyüyü bir arada kullanan Marvel karakteri.',
'Ultron':'Yapay zekâ temelli robot; teknoloji ve kendi robot ordularıyla tanınır.',
'Carnage':'İnsan konakla birleşen saldırgan simbiyot; vücudunu silahlara dönüştürebilir.',
'Moon Knight':'Marc Spector ile bağlantılı, yakın dövüş ve özel ekipman kullanan Marvel kahramanı.',
'Blade':'Vampir avcısı; kılıç, dövüş eğitimi ve gelişmiş fiziksel yeteneklerle tanınır.',
'Ghost Rider':'Doğaüstü alevler ve zincir kullanan, intikam ruhuyla bağlantılı anti-kahraman.',
'Sentry':'Çok yüksek güç ve uçuşla tanınan Marvel kahramanı; Void ile karmaşık bir bağlantısı vardır.'};
Object.assign(overrides,heroes);
add('Quicksilver|Reverse-Flash|A-Train','Çok yüksek hızla hareket edebilmesiyle tanınan karakter.');
add('Punisher|Winter Soldier|Deathstroke|Deadshot|Black Noir','Silah kullanımı, taktik ve yakın dövüş becerileriyle tanınan karakter.');
add('Human Torch|Fire|Firestorm','Ateş veya enerjiyle bağlantılı güçlere sahip karakter.');
add('Invisible Woman','Görünmezlik ve koruyucu güç alanları oluşturabilen Fantastic Four üyesi.');
add('Mister Fantastic|Plastic Man|Elongated Man','Vücudunu uzatıp esnetebilen karakter.');
add('The Thing|Colossus','Sert, dayanıklı vücudu ve yüksek fiziksel gücüyle tanınır.');
add('Doctor Fate|Zatanna|Constantine','Büyü ve doğaüstü olaylarla bağlantılı DC karakteri.');
add('Iceman|Ice|Captain Cold|Mr. Freeze','Buz veya soğukla bağlantılı güç ya da ekipmanlarıyla tanınır.');
add('Electro|Black Lightning|Stormfront','Elektrikle bağlantılı güçleriyle tanınan karakter.');
add('Angel|Hawkman|Hawkgirl','Kanatları ve uçabilmesiyle tanınan karakter.');
add('Hawkeye|Kate Bishop|Huntress','Uzaktan hedef alma ve özel silah kullanımıyla tanınan karakter.');
add('Sabretooth|X-23','Pençeleri, iyileşme yeteneği ve yakın dövüş gücüyle tanınır.');
add('Emma Frost|Psylocke','Zihinsel güçleriyle tanınan mutant karakter.');
add('Sandman|Metamorpho','Vücudunun maddesini veya biçimini değiştirebilen karakter.');
add('She-Hulk','Jennifer Walters; yüksek fiziksel güce sahip, avukatlık da yapan Marvel kahramanı.');
add('Martian Manhunter','Marslı DC kahramanı; telepati ve şekil değiştirmeyle tanınır.');
add('Mystique','Görünüşünü başka insanlara benzeyecek şekilde değiştirebilen mutant.');
add('Beast Boy','Farklı hayvanlara dönüşebilen DC kahramanı.');
add('Doctor Octopus','Mekanik kollar kullanan, Spider-Man’in rakiplerinden bilim insanı.');
add('Mysterio','Yanılsamalar ve sahne teknolojisiyle rakiplerini yanıltan Spider-Man düşmanı.');
add('Poison Ivy','Bitkiler ve zehirlerle bağlantılı yetenekleri olan Gotham karakteri.');
add('Bane','Fiziksel gücü ve taktik zekâsıyla tanınan Batman düşmanı.');
add('Darth Vader','Star Wars’ta Güç’ün karanlık tarafını ve ışın kılıcını kullanan Sith.');
add('Voldemort','Harry Potter evreninde karanlık büyüler kullanan baş düşman.');
add('Goku','Dragon Ball’un Saiyan kahramanı; dövüş, uçuş ve ki enerjisiyle tanınır.');
add('Naruto Uzumaki','Naruto serisinin ninja kahramanı; gölge klonları ve Rasengan ile tanınır.');
add('Monkey D. Luffy','One Piece’in korsan kahramanı; lastik gibi esneyen vücuduyla tanınır.');
add('Vegeta','Dragon Ball’un Saiyan savaşçısı; güçlü dövüş ve ki saldırılarıyla tanınır.');
add('Gojo Satoru','Jujutsu Kaisen’de Limitless tekniğiyle tanınan güçlü büyücü.');
add('Sukuna','Jujutsu Kaisen’de tehlikeli lanetli teknikleriyle tanınan karakter.');
add('Nike','Spor ayakkabıları, spor giyim ve ekipmanlarıyla tanınan marka.');
add('Adidas','Spor ayakkabıları, forma ve spor giyim ürünleriyle tanınan marka.');
add('Levi’s|Mavi','Kot pantolon ve denim giyimle tanınan marka.');
add('Gucci|Prada|Louis Vuitton|Chanel|Dior|Versace|Fendi|Burberry','Lüks moda, aksesuar ve giyim ürünleriyle tanınan marka.');
add('Apple','iPhone, Mac ve iPad gibi teknoloji ürünleriyle tanınan marka.');
add('Zara|H&M|Bershka|Pull&Bear|Mango|LC Waikiki|Koton|DeFacto','Günlük giyim ve farklı koleksiyonlar sunan moda markası.');

add('Friends','New York’ta yaşayan altı arkadaşın ilişkileri ve günlük yaşamını anlatan durum komedisi.');
add('Community','Bir toplum kolejinde kurulan çalışma grubunu konu alan komedi dizisi.');
add('The Mandalorian','Star Wars evreninde bir ödül avcısının Grogu ile yolculuğunu anlatan dizi.');
add('Black Mirror','Teknolojinin insan hayatı üzerindeki karanlık etkilerini bağımsız hikâyelerle anlatan dizi.');
add('Westworld','İnsan görünümlü robotların bulunduğu bir eğlence parkında geçen bilim kurgu dizisi.');
add('Supernatural','İki kardeşin doğaüstü yaratıklarla mücadelesini anlatan fantastik dizi.');
add('Scrubs','Bir hastanede genç doktorların hayatını anlatan komedi dizisi.');
add('Star Trek','Uzay keşfi, farklı uygarlıklar ve yıldız gemisi mürettebatlarıyla tanınan bilim kurgu yapımı.');
add('Smallville','Clark Kent’in Superman olmadan önceki gençlik yıllarını anlatan dizi.');
add('Gladiator','Roma döneminde bir generalin gladyatör olarak mücadelesini anlatan tarihî film.');
add('Dune','Arrakis gezegeni ve değerli baharatın kontrolü çevresinde geçen bilim kurgu hikâyesi.');
add('Breaking Bad','Bir kimya öğretmeninin yasa dışı uyuşturucu üretimine girişini anlatan suç ve dram dizisi.');
add('The Shawshank Redemption','Hapishanede dostluk, umut ve özgürlük arayışını anlatan dram filmi.');
add('The Lion King','Genç aslan Simba’nın ailesi ve krallığıyla bağını anlatan animasyon.');
add('Leyla ile Mecnun','İstanbul’da geçen, aşk ve arkadaşlığı absürt mizahla anlatan Türk dizisi.');
add('Minecraft','Bloklarla yapı kurduğun, keşif ve hayatta kalma seçenekleri bulunan oyun.');
add('Cyberpunk 2077','Geleceğin Night City şehrinde geçen, açık dünya rol yapma oyunu.');
add('Counter-Strike','İki takımın görevler etrafında karşılaştığı taktiksel nişancı oyunu.');
add('Pokémon Red','Pokémon yakalama, yetiştirme ve sıra tabanlı mücadele üzerine rol yapma oyunu.');
add('Pokémon GO','Konum temelli keşif ve Pokémon yakalama üzerine mobil oyun.');
add('Tomb Raider','Lara Croft’un keşif, bulmaca ve aksiyon içeren maceralarıyla tanınan oyun serisi.');
add('Marvel’s Spider-Man','Spider-Man olarak New York’ta ağlarla dolaştığın aksiyon ve macera oyunu.');
add('EA Sports FC','Takımlar ve futbolcularla maç yapabildiğin futbol oyunu serisi.');
add('Football Manager','Transfer, taktik ve kadro yönetimine odaklanan futbol menajerliği oyunu.');
add('NBA 2K','NBA takımları ve oyuncularıyla basketbol maçları yapabildiğin oyun serisi.');
add('War Machine','James Rhodes; ağır silahlarla donatılmış teknolojik zırh kullanan kahraman.');
add('Falcon','Sam Wilson ile tanınan kahraman kimliği; teknolojik kanatlarla uçuş ve taktik beceriler kullanır.');
add('Black Bolt','Sesinin yıkıcı gücüyle tanınan Inhuman hükümdarı.');
add('Namor','Atlantis’le bağlantılı Marvel karakteri; su altında yaşam ve yüksek fiziksel güçle tanınır.');
add('Shang-Chi','Dövüş sanatlarında usta Marvel kahramanı; ekipmanı anlatıldığı sürüme göre değişir.');
add('Ms. Marvel','Kamala Khan; çizgi romanlarda biçim ve boyut değiştirme, ekran uyarlamasında farklı güçlerle tanınır.');
add('America Chavez','Yıldız biçiminde boyutlar arası geçitler açabilen Marvel kahramanı.');
add('Medusa','Saçlarını hareket ettirip kontrol edebilen Inhuman karakteri.');
add('Nebula','Sibernetik geliştirmelere sahip, silah ve dövüş kullanan Marvel karakteri.');
add('Mantis','Duygularla bağlantılı yetenekleri bulunan Guardians of the Galaxy karakteri.');
add('Green Goblin','Spider-Man: No Way Home’da Willem Dafoe’nin canlandırdığı Norman Osborn; planörü ve bombalarıyla tanınan düşman.');
add('Vulture','Teknolojik kanatlarla uçan Spider-Man düşmanı.');
add('Kingpin','Wilson Fisk; suç örgütleri, fiziksel gücü ve etkisiyle tanınır.');
add('Red Skull','Captain America’nın düşmanlarından; suç planları ve HYDRA bağlantısıyla tanınır.');
add('Dazzler','Sesi ışığa dönüştürebilen mutant ve sanatçı.');
add('Bishop','Enerjiyi emip yeniden kullanabilen, gelecekten gelen mutant.');
add('Jubilee','Enerji patlamaları oluşturabilmesiyle tanınan X-Men karakteri.');
add('Kitty Pryde','Katı nesnelerin içinden geçebilme yeteneğine sahip X-Men üyesi.');
add('Cable','Gelecek teknolojisi, silahlar ve zihinsel güçlerle tanınan mutant.');
add('Domino','Olasılıkları kendi lehine etkileyen şans yeteneğiyle tanınan mutant.');
add('Sunspot','Güneş enerjisiyle güçlenen mutant.');
add('Banshee','Güçlü ses dalgaları oluşturabilen mutant.');
add('Forge','İcat ve teknoloji geliştirme yeteneğiyle tanınan mutant.');
add('Havok','Enerji patlamaları üretebilen X-Men karakteri.');
add('Polaris','Manyetik alanları kontrol edebilen mutant.');
add('Apocalypse','Çok eski bir mutant; bedenini ve güçlerini değiştirebilmesiyle tanınır.');
add('Mister Sinister','Genetik deneyler ve mutantlar üzerindeki planlarıyla tanınan Marvel karakteri.');
add('Juggernaut','Doğaüstü güç kaynağıyla yüksek kuvvet ve dayanıklılık kazanan Marvel karakteri.');
add('Toad','Sıçrama, çeviklik ve uzun diliyle tanınan mutant.');
add('Raven','Duygular ve karanlık büyüyle bağlantılı güçlere sahip Teen Titans karakteri.');
add('Swamp Thing','Bitkisel yaşamla bağlantılı, bitki bedenine sahip DC karakteri.');
add('Black Adam','Doğaüstü güç, uçuş ve yıldırım yetenekleriyle tanınan DC karakteri.');
add('Doomsday','Olağanüstü fiziksel güç, dayanıklılık ve uyum sağlama yetenekleriyle tanınır.');
add('Brainiac','İleri teknoloji, üstün zekâ ve gezegenler üzerindeki planlarıyla tanınan DC karakteri.');
add('Lobo','Yüksek fiziksel güç ve iyileşme yeteneğine sahip uzaylı ödül avcısı.');
add('Sinestro','Korkuyla bağlantılı sarı güç yüzüğü kullanan Green Lantern düşmanı.');
add('Power Girl|Superboy','Kripton’la bağlantılı, yüksek fiziksel güç ve uçuşla tanınan DC kahramanı.');
add('Mera','Suyu kontrol edebilen, Atlantis ile bağlantılı DC kahramanı.');
add('Starfire','Uçuş ve enerji atışlarıyla tanınan uzaylı Teen Titans üyesi.');
add('Red Tornado','Rüzgâr ve kasırga oluşturabilen robot kahraman.');
add('Blue Beetle','Gelişmiş teknoloji ve özel zırhla tanınan DC kahramanı.');
add('Booster Gold','Gelecekten gelen teknoloji ve koruyucu ekipman kullanan DC kahramanı.');
add('Atom','Boyutunu çok küçük ölçeklere indirebilen DC kahramanı.');
add('Black Canary','Yakın dövüş ve güçlü ses saldırısıyla tanınan DC kahramanı.');
add('Vixen','Hayvanların özelliklerinden güç alabilen DC kahramanı.');
add('Shazam Jr.','Sihirli güçler, uçuş ve gelişmiş fiziksel yeteneklerle tanınan DC kahramanı.');
add('Riddler','Bulmacalar, bilmeceler ve zekâ oyunlarıyla Batman’e meydan okuyan suçlu.');
add('Scarecrow','Korku toksini ve psikolojik saldırılar kullanan Batman düşmanı.');
add('Catwoman','Hırsızlık, akrobasi ve yakın dövüşte yetenekli Gotham karakteri.');
add('Penguin','Gotham’ın suç dünyasında etkili, özel şemsiyeleriyle tanınan karakter.');
add('Two-Face','Harvey Dent; kararlarını yazı tura ile verme alışkanlığıyla tanınan Gotham suçlusu.');
add('Ra’s al Ghul','Suikastçılar ve uzun vadeli planlarıyla tanınan Batman düşmanı.');
add('Killer Croc','Sürüngen benzeri vücudu ve yüksek fiziksel gücüyle tanınan Gotham karakteri.');
add('Batwoman','Batman ailesiyle bağlantılı; dövüş eğitimi, teknoloji ve taktikle savaşır.');
add('Question','Araştırma ve dedektiflik becerileriyle tanınan DC karakteri.');
add('Captain Atom','Enerji kullanımı, uçuş ve yüksek güçle tanınan DC kahramanı.');
add('Spectre','Doğaüstü adalet ve intikamla bağlantılı DC varlığı; güç sınırları hikâyeye göre değişir.');
add('Etrigan','Alev ve doğaüstü güçlerle tanınan, Jason Blood’a bağlı iblis karakter.');
add('Soldier Boy','The Boys evreninde dayanıklılık, yüksek güç ve kalkanıyla tanınan karakter.');
add('The Deep','The Boys evreninde su altında yaşama ve deniz canlılarıyla iletişim yeteneklerine sahip karakter.');
add('Queen Maeve','The Boys evreninde yüksek fiziksel güç ve dayanıklılıkla tanınan karakter.');
add('Kimiko','The Boys evreninde fiziksel güç ve hızlı iyileşme yeteneğiyle tanınır.');
add('Billy Butcher','The Boys ekibinin sert lideri; planlar, silahlar ve süper güçlülerle mücadelesiyle tanınır.');
add('Hughie Campbell','The Boys ekibinin üyesi; süper güçlülerin dünyasına sonradan katılan karakter.');
add('Mother’s Milk','The Boys ekibinde disiplin ve taktik becerileriyle tanınan karakter.');
add('Frenchie','The Boys ekibinin silah, patlayıcı ve kimya konularında yetenekli üyesi.');
add('Allen the Alien','Invincible evreninde yüksek güç ve dayanıklılığıyla tanınan uzaylı.');
add('Thragg','Invincible evreninde güçlü bir Viltrumlu savaşçı ve lider.');
add('Robot','Invincible evreninde robotlar ve gelişmiş teknoloji kullanan karakter.');
add('Rex Splode','Invincible evreninde nesneleri patlayıcı hâle getirebilen karakter.');
add('Dupli-Kate','Invincible evreninde kendisinin kopyalarını oluşturabilen kahraman.');
add('Monster Girl','Invincible evreninde güçlü bir canavara dönüşebilen karakter.');
add('The Immortal','Invincible evreninde uçuş, yüksek güç ve uzun yaşamıyla tanınan kahraman.');
add('Angstrom Levy','Invincible evreninde farklı boyutlara geçitler açabilen karakter.');
const countries={'American':'ABD','United States':'ABD','Turkish':'Türkiye','Turkey':'Türkiye','British':'Birleşik Krallık','English':'İngiltere','England':'İngiltere','Scottish':'İskoçya','Scotland':'İskoçya','Welsh':'Galler','German':'Almanya','Germany':'Almanya','French':'Fransa','France':'Fransa','Spanish':'İspanya','Spain':'İspanya','Italian':'İtalya','Italy':'İtalya','Japanese':'Japonya','Japan':'Japonya','Canadian':'Kanada','Canada':'Kanada','Australian':'Avustralya','Australia':'Avustralya','Argentine':'Arjantin','Argentina':'Arjantin','Brazilian':'Brezilya','Brazil':'Brezilya','Portuguese':'Portekiz','Portugal':'Portekiz','Dutch':'Hollanda','Netherlands':'Hollanda','Swedish':'İsveç','Sweden':'İsveç','Swiss':'İsviçre','Switzerland':'İsviçre','Finnish':'Finlandiya','Finland':'Finlandiya','Danish':'Danimarka','Denmark':'Danimarka','Norwegian':'Norveç','Norway':'Norveç','Belgian':'Belçika','Belgium':'Belçika','Croatian':'Hırvatistan','Croatia':'Hırvatistan','Serbian':'Sırbistan','Serbia':'Sırbistan','Polish':'Polonya','Poland':'Polonya','Austrian':'Avusturya','Austria':'Avusturya','Mexican':'Meksika','Mexico':'Meksika','Egyptian':'Mısır','Egypt':'Mısır','South Korean':'Güney Kore','South Korea':'Güney Kore','Chinese':'Çin','China':'Çin','Indian':'Hindistan','India':'Hindistan','New Zealand':'Yeni Zelanda','Thai':'Tayland','Thailand':'Tayland','Indonesia':'Endonezya','Montenegro':'Karadağ','Morocco':'Fas','United Arab Emirates':'Birleşik Arap Emirlikleri','Vietnam':'Vietnam','Greece':'Yunanistan','Greek':'Yunanistan','Ireland':'İrlanda','Irish':'İrlanda','Russian':'Rusya','Russia':'Rusya','Hungarian':'Macaristan','Hungary':'Macaristan','Czech':'Çekya','Czech Republic':'Çekya','Senegalese':'Senegal','Cameroonian':'Kamerun','Ivorian':'Fildişi Sahili','Saudi Arabia':'Suudi Arabistan','Colombian':'Kolombiya','Chilean':'Şili','Uruguayan':'Uruguay','Uruguay':'Uruguay','Slovenian':'Slovenya','Lithuanian':'Litvanya','Albanian':'Arnavutluk','Georgian':'Gürcistan'};
function facts(card,c,m){
 const d=m.description||'',country=Object.entries(countries).find(([s])=>new RegExp('\\b'+s+'\\b','i').test(d))?.[1];
 const year=d.match(/\b(?:18|19|20)\d{2}\b/)?.[0];
 const origin=country?'Ülke: '+country+'. ':'';
 const era=year&&/born|doğumlu/.test(d)?year+' doğumlu. ':'';
 const genres=[['science fiction','bilim kurgu'],['fantasy','fantastik'],['comedy','komedi'],['drama','dram'],['thriller','gerilim'],['horror','korku'],['action','aksiyon'],['adventure','macera'],['romantic','romantik'],['crime','suç'],['sitcom','durum komedisi'],['animated','animasyon'],['animation','animasyon']].filter(([s])=>d.toLowerCase().includes(s)).map(([,s])=>s);
 const types={football:'Futbolcu.',basketball:'Basketbol oyuncusu.',f1:'Motor sporları pilotu.',athletes:/tennis/i.test(d)?'Tenis sporcusu.':/boxer/i.test(d)?'Boksör.':/swimmer/i.test(d)?'Yüzücü.':/gymnast/i.test(d)?'Jimnastikçi.':/wrestler/i.test(d)?'Güreşçi.':/volleyball/i.test(d)?'Voleybolcu.':/football/i.test(d)?'Futbolcu.':/basketball/i.test(d)?'Basketbol oyuncusu.':/archer/i.test(d)?'Okçu.':/motorcycle/i.test(d)?'Motosiklet yarışçısı.':/racing/i.test(d)?'Yarış pilotu.':/weightlift/i.test(d)?'Halterci.':'Spor dünyasından bir isim.',clubs:'Futbol kulübü.',clothing:/luxury/i.test(d)?'Lüks moda markası.':/sports|athletic/i.test(d)?'Spor giyim ve ekipman markası.':'Giyim ve moda markası.',celebrities:/actor|actress|oyuncu/i.test(d)?'Oyunculukla tanınan isim.':/singer|şarkıcı/i.test(d)?'Şarkıcılıkla tanınan isim.':/model/i.test(d)?'Modellik alanından bir isim.':'Eğlence dünyasından bir isim.',cars:/electric/i.test(d)?'Elektrikli otomobil modeli.':/SUV|crossover/i.test(d)?'SUV veya crossover otomobil modeli.':/sports car/i.test(d)?'Spor otomobil modeli.':'Otomobil modeli.',mall:'Alışveriş merkezinde yer verebileceğin bir marka.',snacks:/chocolate|çikolata/i.test(d+' '+card.name)?'Çikolatalı atıştırmalık.':/biscuit|bisküvi/i.test(d+' '+card.name)?'Bisküvi türü atıştırmalık.':/chips|crisps|cips/i.test(d+' '+card.name)?'Cips türü atıştırmalık.':'Paketli atıştırmalık.'};
 if(['heroes','villains','anime','cartoons','game-characters'].includes(c.id)){
  const identity=d.includes('superhero-api')?d.split(' ·')[0]:'';
  const universe=card.universe||(['Dragon Ball','One Piece','Naruto','Jujutsu Kaisen','Bleach','Death Note','Pokémon','Mortal Kombat','DC Comics','Marvel Comics','Star Wars','Harry Potter','Disney','SpongeBob','Looney Tunes','Invincible','The Boys','League of Legends','Final Fantasy'].find(s=>d.includes(s)))||'';
  return (identity&&identity!==card.name?'Kimliği: '+identity+'. ':'')+(universe?universe+' evreninden bir karakter.':c.name+' kategorisinde yer alan kurgusal karakter.');
 }
 if(['turkish-songs','world-songs'].includes(c.id)&&card.name.includes(' — '))return card.name.split(' — ').slice(1).join(' — ')+' tarafından seslendirilen şarkı.'+(year&&!/born/.test(d)?' '+year+' tarihli kayıt.':'');
 if(['turkish-songs','world-songs'].includes(c.id))return (year&&!/born/.test(d)?year+' tarihli ':'')+'şarkı.'+(m.kind==='artist'?' Görseldeki sanatçı: '+(m.title||card.name)+'.':'')+(/ by /.test(d)?' '+d.split(' by ').slice(1).join(' by ').replace(/\([^)]*\)/g,'').trim()+' tarafından seslendirilir.':'');
 if(['turkish-music','world-music'].includes(c.id))return origin+(/band|group|grup/i.test(d)?(d.match(/rock|pop|metal|jazz|hip hop|rap/i)?.[0]||'Müzik')+' grubu.':'Şarkıcı veya müzisyen.')+(era?' '+era.trim():'');
 if(['turkish-series','foreign-series','movies','animation','tv-shows','games'].includes(c.id))return origin+(year&&!/born/.test(d)?year+' tarihli ':'')+(genres.length?[...new Set(genres)].join(', ')+' türünde ':'')+({games:'video oyunu.',movies:'film.',animation:'animasyon yapımı.', 'turkish-series':'televizyon dizisi.','foreign-series':'dizi.','tv-shows':'televizyon programı.'}[c.id]);
 if(c.id==='travel')return origin+(/capital/i.test(d)?'Başkent olarak bilinen bir seyahat noktası.':/island/i.test(d)?'Ada veya adalar bölgesinde bir seyahat noktası.':/province/i.test(d)?'Bir bölge veya il; seyahat rotasına eklenebilir.':'Gezi rotasına ekleyebileceğin bir şehir veya tatil noktası.');
 return origin+(types[c.id]||'Bu kategoride yer alan bir seçim.')+(era?' '+era.trim():'');
}
const data={};for(const c of categories)for(const card of c.cards){const m=manifest[card.id]||{};data[card.id]={text:card.description||overrides[card.name]||facts(card,c,m),source:card.name==='Red Hood'?'https://www.dc.com/characters/red-hood':card.name==='Batman'?'https://www.dc.com/characters/batman':m.source||null};}
fs.writeFileSync(new URL('../dist/card-descriptions.js',import.meta.url),'// Short Turkish introductions; sources retained for review.\nexport const cardDescriptions='+JSON.stringify(data,null,1)+';\n');
console.log(Object.keys(data).length+' kart açıklaması hazır.');
