# Görselli sürüm doğrulaması — 6 Ekim 2026

- 30 kategoride 1.840 aktif görselli kart; her kategoride en az 33 kart. Tam kaynak katalogdaki 2.241 kayıt korunur; 401 kayıtta görsel eşleştirmesi veya indirme tamamlanmadığı için bunlar yeni maçlarda kullanılmaz.
- Bütün aktif kartların dosyaları bilgisayara kaydedildi. Dosya boyutları, gerçek resim imzaları, kaynak bilgileri ve kategori başına HTTP görüntü yanıtları doğrulandı.
- On iki otomatik kontrol geçti. 300 tam maç simülasyonu, bütçe ve kadro korunumu, geçersiz hamleler, altı bağımsız istemcide aynı final ve tartışma modu kontrol edildi. Oda maçlarında açılan her kartın aktif görsel havuzunda bulunduğu da sınandı.
- Telefon görünümünde fotoğraflı kahraman maçı baştan sona tamamlandı; finaldeki altı kartın görselleri yüklendi. İki ayrı tarayıcı oturumunda yemek açık artırması başlatıldı; aynı fotoğraf, fiyat ve kart sahibi görüldü.
- Oda bağlantısı yenilendiğinde üye anahtarıyla otomatik geri dönüş, mevcut bütçe ve alınmış kart görseli doğrulandı.
- 390 ve 360 piksel genişliklerde yeni arayüz ve yatay taşma kontrol edildi. Masaüstü genişliğinde kategori ve oda yerleşimleri incelendi.
- Kart görselleri, marka logoları, afişler ve kişi/ürün/yemek fotoğrafları kullanılır. Şarkı kapağı bulunmadığında sanatçı portresi açıkça etiketlenir. Özgün kaynaklar dist/image-manifest.json içinde tutulur.

Fiziksel iPhone ve Android cihazları üzerinden ayrı cihaz denemesi bu bilgisayardan yapılmadı. Puanlar prototipe ait sabit editoryal değerlerdir. Önceki maçların kaydedilmiş desteleri korunur; görsel garantisi yeni maçlar içindir. Kapsam tek telefon ve aynı Wi-Fi ağı üzerinden oyundur.

## 7 Ekim 2026 — Birer jeton artırma

Her açılış 1 jeton; sonraki teklifler tam 1 jeton artar. Daha yüksek teklif seçenekleri ve özel tutar girişi kaldırıldı. Tek telefon kuralları ve oda sunucusu aynı sınırlamayı uygular. Sıra ve fiyat korunarak geçersiz sıçramaların reddedildiği yeni kontrol dahil 13 otomatik kontrol geçti. Tarayıcıda iki oyuncunun 1 ve 2 jeton teklifleri, sıranın dönüşmesi ve tek artırma düğmesi doğrulandı.


## 7 Ekim 2026 — Sayaç, kart tanıtımları ve paylaşılabilir sonuç

- İlk tekliften sonra başlayan 5/10/15 saniyelik süre; her yeni teklifte yenilenir, çekilmede yenilenmez. Süre bitişinde son teklif sahibine tek satış ve tek bütçe kesintisi doğrulandı.
- Oda sunucusu istemciler sorgu yapmasa bile süreyi sonuçlandırır. Geç gelen teklif, eski sürüm ve yinelenen satış engellendi. Sunucu zamanı ile telefon saati arasındaki fark hesaba katılır.
- Eski kayıtlar tek seferlik süre başlangıcıyla uyarlanır. Sayfa yenileme yeni teklif gibi süreyi sıfırlamaz.
- 1.840 aktif kartta kısa Türkçe tanıtım ve kaynak bağlantısı kaydı var. Kahramanlar ve yemekler için ek tanıtımlar; diğer içeriklerde kaynak metadatasına dayanan kısa kimlik, tür veya köken bilgileri kullanıldı. Red Hood ve Batman tanıtımları DC’nin resmî karakter sayfalarıyla kontrol edildi. Bunlar tam karakter dosyaları değildir.
- “Masada şimdi” son teklifleri ve çekilmeleri gösterir; yeni hareketin kısa animasyonu vardır. Hareket azaltma tercihi gözetilir.
- Finalde iki ayrı çıktı: sade kadro listesi ve tüm kadroları, açıklamalarını, ödenen/kalan bütçeleri, kuralları ve kategoriye uygun analiz isteğini içeren ChatGPT promptu. Tarayıcıdaki gerçek kopyalama düğmelerinden çıkan metin doğrulandı.
- Oda paylaş düğmesi yerel HTTP bağlantısında kopyalama yoluna geçti; ayrı bağlantı kopyalama düğmesi de var. Destekleyen tarayıcılarda Web Share kullanılır. Fiziksel iPhone/Android paylaşma menüsü bu Mac üzerinde doğrulanmadı.
- 390 px mobil ekranında fotoğraf, tanıtım, sayaç ve iki teklif düğmesinin taşmadan görünmesi kontrol edildi. Yeni oyun ve aynı oyuncularla yeniden oynama akışları denendi.
- Otomatik kontroller: 19/19 başarılı. Tam 30 kategori ve 2–6 oyunculu 300 maç simülasyonu; görsel dosyaları, altı bağımsız oda istemcisi, süre ve sonuç dışa aktarma kontrolleri dahil.
- Ekran kayıtları: `test-results/sayac-mobil.png`, `test-results/sonuc-kopyalama.png`.


## 7 Ekim 2026 — Oyun listesi, oylama ve seri finali

- Oda ekranı yeniden düzenlendi: davet ve oyuncu listesi yanında oyun akışı; tek tur, oyun listesi ve oylamalı seri seçenekleri. Listeye kategori ekleme/çıkarma ve sıralama değiştirme; misafir ekranında güncellemelerin görünmesi denendi. İlk kategori özeti seçilen listeyle eşleşir.
- Oyuncu sayısına göre N…1 seri puanı, ev sahibi sıralaması, otomatik puanlı sıralama, 1/1/3 beraberliği, yinelenen kaydın reddi, turlar arasında yeni bütçe/kadro ve seri finali kontrol edildi. Ortak kahraman evreni tercihi liste ve oda yeniden açılışında korunur.
- İlk oyda 10 saniye, herkes oy verdiğinde en fazla 3 saniye, oy değişiminde süreyi uzatmama, eksik oylarla süre sonunda ilerleme ve en çok oy alanlar arasından eşitlik çözümü sınandı. Altı bağımsız istemciyle liste serisi, iki istemciyle oylama ve ortak sonraki tur doğrulandı.
- Tarayıcıda tek telefonla iki turluk tartışma serisi tamamlandı: Ömer ve Abdullah 3'er toplam puanla eşit birinci oldu. Puanlı turdan otomatik sıralamaya ve kategori oylamasına geçiş de denendi. Tüm tur kadrolarını içeren gerçek ChatGPT kopyalama çıktısı kontrol edildi.
- Seslerin ilk dokunuşla açılması, sessize alma, arka planda çalmama ve her saniye yalnızca bir sayaç sesi otomatik kontrol edildi. Fiziksel telefon hoparlörü kontrol edilmedi.
- 360 px genişlikte oda, oylama ve seri finali incelendi; oda ekranında yatay taşma bulunmadı. Tarayıcıdaki yerel sayaç hatası giderilip aynı maç başarıyla tamamlandı.
- Otomatik kontroller: **30/30 başarılı**. Önceki oyun, görsel, süre ve dışa aktarma kontrolleri dahil.
- Ekran görüntüleri: `test-results/seri-oda.png`, `test-results/seri-oda-mobil.png`, `test-results/seri-oylama-mobil.png`, `test-results/seri-final-mobil.png`.

Gerçek iPhone/Android cihazları ve telefonların paylaşma menüleri bu geliştirme oturumunda fiziksel olarak denenmedi. Seri oyunu tek telefon ve aynı Wi-Fi üzerinden sunulur.


## 7 Ekim 2026 — Yeni oyun masası ve isteğe bağlı F/P

- İlk teklif sırası, her hamlede sırası gelen oyuncu, en yüksek teklif, kalan bütçe, oyuncuların bekleme/çekilme durumu ve kadroları yeniden düzenlendi. Kısa sıra/satış animasyonları hareket azaltma tercihini gözetir.
- Satın alma özetinde alıcı, ödenen tutar ve satış anındaki kalan bütçe birlikte görünür; telefonda bu özet kart görselinin önüne gelir. Yeni kart ve satış sonucunda ekran başa döner. Son kartın özeti tur/final ekranında da gösterilir.
- F/P başlangıçta kapalı; oyun öncesinde açılır. Yıldızlar yalnızca satın alınan kartlarda, fiyat ve kategori oyun değeri üzerinden hesaplanır. Puanları ve bütçeyi değiştirmeme, aynı kartta fiyat arttıkça yıldızın artmaması, bir jetonluk Thanos'un beş yıldız olması kontrol edildi.
- Ayrı iki istemcide oda sahibinin F/P ayarı, ortak satış özeti, 19 jeton kalan bütçe ve aynı yıldızlar doğrulandı. Satılmayan kartın puanı veya yıldızı yanıtta gösterilmez.
- Tarayıcıda 1/2 jeton teklif, çekilme, alıcının 18 jeton kalması ve 5 yıldız; sonraki kartın açılış oyuncusu; tüm kadroların dolması ve son alış özetiyle final geçişi denendi. Sayfa yenilemeyle kart, bütçe ve yıldızlar korundu.
- 360 px telefon ve 1280 px masaüstü yerleşimleri incelendi; yatay taşma bulunmadı. F/P açıklaması ve kadro yıldızları görünür. Fiziksel iPhone/Android denemesi bu oturumda yapılmadı.
- 33 otomatik kontrolün tamamı ve ek oda F/P kontrolü geçti: toplam **34 başarılı kontrol**.
- Görseller: `test-results/oyun-yeni-acilis.png`, `test-results/oyun-yeni-satis.png`, `test-results/oyun-yeni-satis-mobil.png`.


## 7 Ekim 2026 — Sabit telefon masası ve TV kumandaları

- Telefonda satış, F/P ve yeni kart arasında otomatik kaydırma kaldırıldı. Kart ve düğmeler aynı alanda; uzun kadrolar, tam tanıtım ve F/P açıklaması ayrı detay penceresinde. Pencere kapanınca masa konumu korunur; arka plandaki kontroller pasifleştirilir ve klavye odağı pencerede tutulur.
- 390×844 ve 320×568 boyutlarında iki ve altı oyunculu normal açık artırma/satış incelendi. Sayfa ve görünüm yüksekliği eşit, yatay taşma ve sayfa kaydırması yok. Teklif/satış alanının konumu aynı kaldı. 844×390 yatay telefon görünümünde kart ve satış alanı yan yana, altı oyuncu bütçesi tek satırda; sayfa taşması yok. Küçük altı kişilik ekranda tanıtım kısaltılır; tam metin detay penceresindedir.
- TV seçeneği oyun başlamadan açılır. Ayrı salt okunur bağlantı üyelik istemez, oyuncu kontenjanına eklenmez ve yönetim/teklif yetkisi vermez. TV kapalı odalar üyelik olmadan okunamaz. Gelecek kart/deste ve üye anahtarları paylaşılmaz.
- İlk kart ve yeni turlar 3 saniyelik mutlak sunucu zamanıyla açılır; satış 5 saniye gösterilip yeni kartın geri sayımına geçilir. İki gerçek tarayıcı oturumuyla tekliflerin TV'de görünmesi, son teklif sahibine satış, kalan bütçe, alınan kadrolar ve yeni kartlara otomatik geçiş kontrol edildi. Altı kumandayı temsil eden otomatik maçta her kadro doldu; her kart için tek satış ve doğru toplam harcama doğrulandı.
- TV kumandası 390×844 ve 320×568 boyutlarında incelendi: büyük teklif/çekilme düğmesi, kendi bütçesi ve kendi kadrosu tek görünümde. Masa detaylarının açılıp kapanması denendi. TV açık artırması 1280×720, tur sonucu mevcut büyük ekran görünümünde incelendi.
- TV tur sonucu kadroları gösterir; sıralama ve sonraki tur telefonla yönetilir. Oyun listelerinde TV tercihi, yeni bütçeler ve gizli kart açılışı korunur. Mevcut seri/oylama/sıralama kontrolleri de geçti.
- Sunucu sesi başlangıçta kapalı ve dokunarak açılır. Tarayıcıda düğmenin açılıp kapanması kontrol edildi. Türkçe teklif/satış metinleri, tek anons, 3–2–1, sessize alma, arka plan ve desteklenmeyen tarayıcı davranışı otomatik olarak sınandı; fiziksel TV hoparlörü/Türkçe ses kalitesi denenmedi.
- Otomatik doğrulama: tüm mevcut ve TV kontrolleri **40/40**, ek sesli anons kontrolleri **2/2** başarılı; toplam **42 başarılı kontrol**.
- Görseller: `test-results/telefon-sabit-fp.png`, `test-results/tv-telefon-kumanda.png`, `test-results/tv-acik-artirma.png`, `test-results/tv-tur-sonucu.png`.

Fiziksel iPhone, Android ve akıllı TV bu Mac üzerinde denenmedi. TV'nin tarayıcısı ve konuşma desteği cihazda kontrol edilmeli; HDMI üzerinden bilgisayar tarayıcısı da kullanılabilir.

## 7 Ekim — Altı kategori ve film görselleri

- 36 kategori, 2.095 aktif kart; yeni altı kategoride 255 görselli kart ve kart başına kısa Türkçe tanıtım. Yeni havuzların büyüklükleri 43, 52, 35, 42, 44 ve 39.
- 30 ayrı karakterde 36 kart eşleştirmesi yenilendi. Green Goblin’in No Way Home’daki Willem Dafoe görüntüsü ve Batman’in Bruce Wayne / Christian Bale kimliği görsel olarak incelendi. Ortak karakterler iki havuzda aynı görünümü kullanır; Iron Man filmi ve Loki dizisi gibi ayrı medya kartları değişmez.
- Yeni portre, afiş ve yiyecek görselleri temas sayfalarında incelendi. Yanlış ürün, çekim mekânı ve grup fotoğrafı eşleştirmeleri çıkarıldı. Marka dosyaları gerçek logolarla eşleştirildi; Apple için beyaz zeminde görünen siyah logo, ASUS için tanıdık yazı logosu seçildi.
- 360 tam maç simülasyonu dahil 43 otomatik kontrol geçti. Bütçe korunumu, altı kişilik tam kadrolar, eski kaynak kataloğu, görsel dosya imzaları, açıklamalar, sunucunun bütün kategorilerdeki resim yanıtları, seri ve TV akışları doğrulandı.
- Tarayıcıda Yeni filtresi altı kategoriyi gösterdi. Türkçe kahvaltı araması tek sonuç verdi; boş sonuç durumu ve arama temizleme denendi. 390 piksel telefon görünümünde altı kategori fotoğrafı yüklendi; yatay taşma yok. Küçük ekran ve masaüstü son kontrolleri test-results içinde kaydedildi.

Fiziksel iPhone, Android ve TV cihazlarında yeni kategoriler bu bilgisayardan denenmedi. Aktif dosyalar yerelde saklanır; kaynak görsel indirilemeyen veya yanlış eşleşen kayıtlar yeni maçların havuzuna eklenmez.

## 8 Ekim 2026 — QR, sıra uyarıları ve joker

- Ayrı 4178 sunucusu ve ayrı oda kayıt diziniyle 55 otomatik testin tamamı geçti. Önceki testler, 36 kategoride altı kişilik jokerli maçların tamamlanması ve yeni özelliklerin kontrolleri birlikte çalıştırıldı.
- Jokerin kapalı oyunda, yanlış oyuncuda, eski sürümle, ikinci kez veya ilk tekliften sonra kullanılması durumu değiştirmeden reddediliyor. Açılış oyuncusu, para, kadro sayısı, gelecek deste ve sayaç korunuyor. Gizli yedek havuz istemci ve TV yanıtlarına çıkmıyor.
- Dar havuzlu İçecek menüsü dahil bütün kategorilerde altı joker kullanılarak 30 tekrarsız kartla kadrolar tamamlanıyor. Yeni seri turunda herkesin jokeri yenileniyor. TV geri sayımında joker kullanılamıyor; açıldıktan sonra yerinde değiştirme çalışıyor.
- Sıra bildirimleri yoklamalarda ve joker değişiminde tekrarlanmıyor. Tekrar sana dönen sıra, yeni tur ve yeni masa uyarı veriyor. Kapalı/bağlantısız ekranda bekleme, tercihler ve titreşim desteği olmayan ortam kontrol edildi. Ses, titreşim ve ekran uyarısı ayrı ayrı yönetiliyor.
- QR'dan üç farklı katılım adresi bağımsız macOS Vision çözücüsüyle tam olarak geri okundu. TV'nin gerçek ekran görüntüsü de çözüldü ve doğru oda bağlantısı elde edildi. QR hizmetine ağ isteği yapılmıyor.
- Tarayıcıda QR üzerinden hazır kodla ikinci oyuncu katıldı; TV salt okunur kaldı. Joker kullanımı kartı değiştirdi ve kalan hakkı sıfıra indirdi.
- Telefon kontrol çerçevelerinde 320×568 ve 390×844 boyutları kullanıldı. 320 piksel görünümünde belge genişliği/yüksekliği ekrana eşitti; joker ve kumanda alanı sayfayı kaydırmadı. `test-results/joker-telefon-kontrol.jpg` ve `tv-qr-katilim.jpg` görsel kayıtları vardır.
- Sıra ayarları penceresi klavye/fokus ve Escape ile kapatma için mevcut pencere düzenine bağlandı. Tercihler yereldir; oda ayarı olarak diğer oyunculara gönderilmez.
- Gerçek telefon titreşimi veya fiziksel TV kamera okutması bu Mac'te yapılmış değildir. iPhone Safari'de standart web titreşimi desteklenmez; ses ve ekran uyarısı devam eder.


## Serbest artırma — 8 Ekim 2026

- İlk teklif yalnızca dönüşümlü açılış oyuncusundan gelir. Ardından turnId boşalır; çekilmemiş, kadrosunda yeri ve bütçesi olan herkes +1 artırabilir. Lider kendi teklifini artıramaz veya geri çekemez.
- Her kabul edilen teklif ortak sayacı yeniden başlatır; çekilmek süreyi değiştirmez. Aynı anda aynı tutarla gelen iki isteğin biri kabul edilir; diğeri güncel fiyatı alır. Eski istek otomatik olarak daha yüksek tutara çevrilmez.
- Normal telefon, tek telefon oyuncu seçimi, TV kumandası, TV anonsları, açılış bildirimleri, kurallar ve sonuç promptu yeni kurala uyarlanmıştır. Eski kayıtların devam eden açık artırma sırası temizlenir; bütçe ve mevcut son tarih korunur.
- Ayrı test sunucusunda tüm 61 test geçti. Yeni kontroller serbest teklif sırası, eşzamanlı istek, çekilen/lider/dolu/bütçesiz oyuncular, sayaç, kayıt geçişi ve düğme durumlarını kapsıyor. Mevcut kategori, seri, joker, F/P ve TV kontrolleri de geçti.
- Tarayıcıda Ömer’in açılışından sonra üçüncü oyuncu Can seçilerek 2 jetonluk teklif verildi ve öne geçti.
- Ortak oyun bileşenleriyle 320 × 568 boyutunda normal telefon, tek telefon ve TV kumandası kontrol edildi; üçünde de sayfa yatay/dikey taşmadı.


## GitHub hazırlığı — 9 Ekim 2026

- Türkçe/İngilizce kısa tanıtım, SVG kapak, telefon ekranı, ayrıntılı oyun ve geliştirme rehberi hazırlandı.
- Bağımsız Git deposuna yalnızca proje kaynakları ve belgeler eklendi. Oda kayıtları, üyelik anahtarları, görsel önbelleği ve yerel test çıktıları hariç tutuldu.
- `npm test`, geçici oda dizini ve boş portla kendi sunucusunu başlatır. `npm run test:images` ek görsel doğrulamasını açar. `npm run images:cache` aktif kartları indirmek için eklendi.
- Mevcut önbellekle tüm 61 test geçti. Git'e eklenecek dosyalardan üretilen temiz kopyada 59 test geçti; önbellek gerektiren 2 test açıkça atlandı.
- Linux/Node.js 22 için GitHub Actions tanımlandı. Uzak GitHub çalıştırmasının sonucu, repo oluşturulup ilk commit yüklendikten sonra ayrıca doğrulanmalıdır.
