# Katkıda bulunma

Yeni bir oyun fikri, kategori önerisi veya hata bulduysan bir issue açabilirsin. Hata bildiriminde oynama biçimini, cihaz/tarayıcıyı, beklenen davranışı ve tekrar adımlarını yaz. Ekran görüntüsü ekliyorsan kişisel bilgileri çıkar.

Kod değişikliği için:

1. Repoyu fork et ve değişikliğin için bir dal aç.
2. `npm start` ile oyunu çalıştır.
3. `npm test` ile kuralları ve oda akışlarını doğrula.
4. Arayüzü değiştirdiysen normal telefon, tek telefon ve TV kumandasını kontrol et.
5. Pull request içinde neyin değiştiğini ve nasıl denediğini açıkla.

Oyun kuralı değişikliklerini ortak `dist/engine.js` üzerinden yap. Kart açıklamaları kısa ve anlaşılır olsun; yeni içerik için kaynak eşleştirmesini de ekle. `.runtime/`, oda anahtarları, kişisel `.env` dosyaları ve görsel önbelleği commit’e dahil edilmemeli.

Geliştirme ayrıntıları: [docs/gelistirme.md](docs/gelistirme.md).
