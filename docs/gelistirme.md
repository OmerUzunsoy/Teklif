# Geliştirici rehberi

## Çalıştırma

Node.js 22+ ve `curl` kullanılır. Harici npm çalışma zamanı bağımlılığı, paket derleyici veya veritabanı yoktur.

```sh
npm start
```

Varsayılan port `4177`. `PORT` sunucu portunu, `TEKLIF_RUNTIME_DIR` oda kayıtlarının konumunu değiştirir. Örneğin macOS/Linux üzerinde:

```sh
PORT=4178 TEKLIF_RUNTIME_DIR=/tmp/teklif-deneme node server.mjs
```

Görseller, oda kayıtlarından bağımsız olarak proje içindeki `.runtime/images/` klasöründe saklanır. Bu klasör ve `.runtime/rooms.json` Git’e dahil edilmez.

## Mimari

Tarayıcı yerel oyunda `engine.js` kurallarını doğrudan çalıştırır. Ayrı cihaz modunda aynı kurallar Node.js sunucusunda çalışır; telefonlar yalnızca hamle gönderir. Sunucu oyuncu üyeliğini, hamlenin sürümünü, bütçeyi ve açık artırmaya katılım hakkını denetler. Eşzamanlı teklifler aynı görünen fiyatla gelirse yalnızca ilki kabul edilir; eski istek kendiliğinden daha yüksek tutara dönüştürülmez.

`turnId` yalnızca ilk teklifi verecek oyuncuyu belirtir. İlk tekliften sonra `null` olur. Artırma hakkı için `canBid` kullanılır; sıradaki koltuğa bakılmaz. Her kabul edilen teklif ortak bitiş zamanını yeniler. Çekilmek süreyi yenilemez. Odaya ait üye anahtarları diğer oyunculara veya TV ekranına gönderilmez.

`series.js`; tur sonuçlarını, seri puanlarını ve kategori oylamasını yönetir. TV salt okunur ortak ekrandır. Kart öncesi 3 saniye, satış sonrası 5 saniye geçişi sunucu zamanına bağlıdır. Gelecek kartlar ve joker yedek havuzu istemciye gönderilmez.

## Testler

`npm test` geçici bir oda dizini ve boş bir portta test sunucusu oluşturur; sonunda kapatır. Çalışan aile odalarının portunu veya kayıtlarını kullanmaz. Testler bittiğinde geçici dizin temizlenir.

```sh
npm test
npm run test:images
```

İkinci komut, `.runtime/images/` içindeki tüm aktif kartları ve HTTP üzerinden sunulan görselleri de doğrular. Önce `npm run images:cache` çalıştırın. Varsayılan testlerde iki önbellek testi atlanır; bu, görsel kontrolünün geçtiği anlamına gelmez.

Belirli testleri mevcut bir **test sunucusuna** karşı doğrudan çalıştırmak için:

```sh
TEST_ORIGIN=http://localhost:4178 node --test tests/free-bidding-network.test.mjs
```

GitHub Actions temel paketi Linux üzerinde Node.js 22 ile çalıştırır. macOS Vision çözme testi yalnızca Swift araçları bulunan Mac’lerde çalışır. Gerçek telefon titreşimi, TV konuşma sesi ve cihaz uyumluluğu fiziksel cihaz denemesi gerektirir.

## Katalog ve görseller

- Kaynak katalog: `dist/catalog.js`, `dist/extra-catalog.js`, `dist/new-catalog.js`.
- Aktif kartlar: `dist/image-cards.js`.
- Görsel kaynağı ve eşleştirme: `dist/image-manifest.json`.
- Kart tanıtımları: `dist/card-descriptions.js` ve `scripts/build-descriptions.mjs`.

`npm run images:cache` mevcut aktif havuzu indirir; kartları etkinleştirmez veya kaldırmaz. `scripts/collect-images.mjs` içerik bakım aracıdır; `--publish` yalnızca indirilen kartları aktif listeye yazar. Bu nedenle boş önbellekte kurulum amacıyla `--publish` kullanmayın.

## Arayüz değişikliği kontrolü

Normal telefon, tek telefon ve TV kumandasını ayrı ayrı kontrol edin. İlk teklif, serbest artırma, çekilme, sayaç bitişi ve satış/F/P ekranları aynı telefon alanında kalmalı. Küçük bir ekranda 320 × 568 boyutunu da deneyin. Kaynak dosyalar doğrudan `dist/` içinde düzenlenir; ayrı build komutu yoktur.
