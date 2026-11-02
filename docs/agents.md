# Şirket Rehberi Projesi - Agent Entegrasyonu

## Proje Özeti

Bu proje, Türkiye'de faaliyet gösteren şirketlerle ilgili firma rehberi oluşturmak üzere geliştirilmiştir. Vite + Vue.js kullanılarak hazırlanan bu uygulama, Firebase ekosistemini (Hosting, Auth, Firestore) temel alır.

## Güvenlik Kuralları

- [Firestore Kuralları](rules/firestore.rules.md) - Veri erişim kontrolleri (uygulanabilir dosya: `firestore.rules`)
- [Auth ve Rol Kuralları](rules/auth.rules.md) - Kullanıcı yönetimi ve rol bazlı erişim
- [Storage Kuralları](rules/storage.rules.md) - Dosya yükleme güvenliği (ileride kullanılabilir)

## Özellikler

- Türkçe Arayüz: Tüm kullanıcı arayüzü Türkçe olarak tasarlanmıştır
- Responsive Tasarım: Mobil ve masaüstü cihazlarda sorunsuz çalışır
- Rol Bazlı Erişim: Admin ve standart kullanıcı rolleri
- Versiyon Sistemi: Firma verisi değiştiğinde sürüm otomatik artar, önbellek temizlenir
- Konum Özellikleri: Google Haritalar entegrasyonu
- İletişim Bilgileri: Telefon, WhatsApp, Instagram, Twitter

## Teknoloji Yığını

- Frontend: Vite + Vue.js 3 (Composition API)
- State Management: Pinia
- Routing: Vue Router
- Backend: Firebase (Firestore, Auth, Hosting)
- Styling: CSS Variables, Flexbox, Grid

## Kurulum ve Kullanım

### 1. Firebase Projesine Bağlanma

```bash
# Firebase CLI ile oturum açın
firebase login --project=firma-rehber

# VITE_* ortam değişkenlerini .env dosyasından ayarlayın
cp .env.example .env

# Vitayı çalıştırın
npm run dev
```

### 2. Admin Kullanıcı Hazırlığı

Admin yetkisi, Firebase Authentication'da oluşturulan kullanıcı için Firestore'da `users/{uid}` belgesi oluşturularak verilir. Belge `role: "admin"` içermelidir.

### 3. Veri Ekleme

Admin girişi yaptıktan sonra Admin Panel'den yeni şirket ekleyebilirsiniz. Her ekleme, düzenleme ve silme işlemi veri sürümünü otomatik artırır.

## Referanslar

- [Vue.js Resmi Dokümantasyon](https://vuejs.org/guide/introduction.html)
- [Firestore Güvenlik Kuralları](rules/firestore.rules.md)
- [Auth ve Rol Kuralları](rules/auth.rules.md)
- [Pinia State Management](https://pinia.vuejs.org/guide/introduction.html)
- [Vue Router ile Routing](https://router.vuejs.org/guide/installation.html)

## Ekran Görüntüleri

- Ana Sayfa: Şirket listesi ve arama
- Admin Panel: Veri yönetimi ve versiyon kontrolü
- Profil Sayfası: Kullanıcı profil bilgileri
- Giriş Sayfası: Yönetici girişi

## Sonraki Adımlar

1. Firebase projesi oluştur ve `.env` yapılandırmasını tamamla
2. Firestore koleksiyonlarını kur (companies, users, versions)
3. `firebase deploy --only firestore:rules` ile güvenlik kurallarını uygula
4. Admin kullanıcı belgesini (`users/{uid}`) oluştur
5. Versiyon ve önbellek davranışını canlı verilerle test et
6. Prodüksiyona yayınlayın

## Dağıtım

```bash
# Firebase Hosting + Firestore kuralları
npm run deploy

# Cloudflare Workers alternatifi
npm run deploy:cloudflare
```
