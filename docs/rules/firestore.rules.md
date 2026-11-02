# Firestore Güvenlik Kuralları

## Amaç

Firestore veritabanındaki erişim kontrollerini tanımlar. Firma listesini herkes okuyabilir; firma kayıtlarını, sürüm bilgisini ve kullanıcı rollerini yalnızca adminler yönetebilir.

Uygulanabilir kural dosyası proje kökündeki `firestore.rules` dosyasıdır. Aşağıdaki içerik açıklama amaçlıdır.

## Kurallar

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /companies/{companyId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /versions/{versionId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /users/{userId} {
      allow read: if isSignedIn() && request.auth.uid == userId;
      allow create: if isAdmin();
      allow update: if isSignedIn()
        && request.auth.uid == userId
        && request.resource.data.role == resource.data.role
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['name']);
      allow delete: if false;
    }
  }
}
```

## Açıklama

- `isAdmin()` fonksiyonu, uygulamanın kullandığı `users/{uid}` belgesindeki `role` değerini kontrol eder; böylece panel ile kurallar aynı role göre çalışır.
- Firma ve sürüm koleksiyonlarına yazma işlemleri yalnızca adminlere açıktır.
- Kullanıcılar yalnızca kendi profilini okuyabilir.
- Profil güncellemesinde yalnızca `name` alanı değiştirilebilir; `role` alanının korunması zorunludur.
- Kullanıcı silme işlemi herkes için kapalıdır.

## Deploy

```bash
firebase deploy --only firestore:rules
```

## Referanslar

- [Firebase Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
