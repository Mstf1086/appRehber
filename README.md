# Şirket Rehberi

Türkiye'de faaliyet gösteren şirketlerin iletişim ve konum bilgilerini yayımlayan firma rehberi uygulaması. Arayüz Türkçe, kaynak kodu İngilizce olarak geliştirilmiştir.

## Özellikler

- Vue 3 + Vite ile modern frontend
- Firebase Authentication ile yönetici girişi
- Firestore ile firma kaydı ve yönetimi
- Admin panelinde firma ekleme, düzenleme ve silme
- Veri değişikliklerinde otomatik sürüm artırma ve önbellek temizleme
- Firma adı, adres, telefon ve sosyal medya hesaplarına göre canlı arama
- Responsive tasarım ve klavye ile kullanılabilir arayüz

## Teknolojiler

- Frontend: Vue 3 (Composition API), Vue Router, Pinia
- Build: Vite 8
- Backend: Firebase (Firestore, Auth, Hosting)
- Dağıtım alternatifi: Cloudflare Workers (`cloudflare.config.ts`)

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın

```bash
cp .env.example .env
```

`.env` dosyasındaki Firebase değerlerlerini kendi projenize göre doldurun. Uygulama, gerekli değişkenler eksikse çalışma zamanında açıklayıcı bir hata mesajı gösterir.

### 3. Admin kullanıcı oluşturun

Firebase Authentication'da kullanıcıyı oluşturduktan sonra Firestore'da `users/{uid}` belgesini aşağıdaki şekilde oluşturun:

```json
{
  "name": "Admin Adı",
  "role": "admin"
}
```

Admin yetkisi bu belge üzerinden belirlenir ve Firestore kurallarıyla aynı kaynağı kullanır.

### 4. Kuralları ve uygulamayı yayınlayın

```bash
firebase deploy --only firestore:rules
npm run build
firebase deploy --only hosting
```

Kurallar `firestore.rules` dosyasında tanımlıdır.

## Geliştirme

```bash
npm run dev       # Geliştirme sunucusu (http://localhost:5173)
npm run build     # Üretim derlemesi
npm run preview   # Derleme çıktısını yerel sunucuda aç
```

## Proje Yapısı

```text
src/
├── components/   # CompanyCard, CompanyForm, Modal, LoadingSpinner
├── views/        # Home, Admin, Profile, Login sayfaları
├── services/     # Firebase ve sürüm servisleri
├── stores/       # Pinia auth ve company store'ları
├── router/       # Vue Router tanımları ve yetki korumaları
├── styles/       # Global stiller
└── utils/        # Biçimlendirme ve filtre yardımcıları
firestore.rules   # Dağıtılabilir Firestore güvenlik kuralları
firebase.json     # Firebase Hosting + Firestore yapılandırması
```

## Dağıtım

### Firebase Hosting

```bash
npm run deploy
```

Bu komut üretim derlemesini alır, Firestore kurallarını ve Hosting dosyalarını dağıtır.

### Cloudflare Workers

```bash
npm run deploy:cloudflare
```

Cloudflare dağıtımı `cloudflare.config.ts` içindeki SPA fallback davranışını kullanır.

## Güvenlik Notları

- Firma koleksiyonu herkese açık okunur; yazma işlemleri yalnızca admin rolüne sahip kullanıcılara açıktır.
- Kullanıcılar yalnızca kendi profilini okuyabilir ve yalnızca `name` alanını güncelleyebilir; rol alanını değiştiremezler.
- Sürüm belgesini yalnızca admin kullanıcılar güncelleyebilir.
