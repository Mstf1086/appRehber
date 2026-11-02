# Storage (R2) Güvenlik Kuralları

## Amaç

Firebase Storage/R2 için dosya yükleme kurallarını hazırlar. Şu anda uygulama dosya yükleme özelliği kullanmaz ve Firebase Storage istemcisini başlatmaz; bu belge, medya yükleme özelliği eklendiğinde referans olarak kullanılmak üzere tutulmaktadır.

## Kurallar

### Dosya yükleme ve okuma kuralları

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null
        && firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /company-media/{companyId}/{fileName} {
      allow read: if true;
      allow write: if isAdmin()
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.metadata.owner == request.auth.uid;
    }
  }
}
```

## Açıklama

- Admin rolü Firestore `users/{uid}` belgesinden okunur; uygulamadaki yetki kontrolüyle aynı kaynak kullanılır.
- Yalnızca admin kullanıcılar dosya yükleyebilir.
- Yüklenen dosyaların sahibi, yükleyen kullanıcının UID'siyle eşleşmelidir.
- Dosya boyutu 5 MB ile sınırlandırılır.

## Referanslar

- [Firebase Storage Güvenliği](https://firebase.google.com/docs/storage/security)
