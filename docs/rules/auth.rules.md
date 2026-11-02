# Authentication ve Rol Kuralları

## Amaç

Firebase Authentication ile Firestore kullanıcı rollerinin nasıl yönetildiğini açıklar. Admin kontrolü özel Firebase token claim'lerine değil, Firestore'daki `users/{uid}` belgesindeki `role` alanına dayanır. Bu sayede uygulamadaki `isAdmin` kontrolü ile Firestore kuralları aynı kaynağı kullanır.

## Rol Yönetimi

### Admin oluşturma

1. Firebase Authentication üzerinden kullanıcıyı oluşturun.
2. Firestore'da kullanıcının UID'siyle aynı adı taşıyan `users/{uid}` belgesini oluşturun.
3. Belgeye `role: "admin"` ve isteğe bağlı `name` alanını ekleyin.

```json
{
  "name": "Admin Adı",
  "role": "admin"
}
```

### Standart kullanıcı

`users/{uid}` belgesi bulunmayan veya `role` değeri `admin` olmayan kullanıcılar standart kullanıcıdır. Uygulama bu durumda en düşük yetkiyle (`role: "user"`) çalışır ve admin paneline erişemez.

## Koruma Önlemleri

- `users` koleksiyonunu yalnızca admin oluşturabilir.
- Kullanıcılar kendi belgelerini okuyabilir.
- Kullanıcılar yalnızca `name` alanını güncelleyebilir; `role` alanını değiştiremez.
- Kullanıcı belgeleri silinemez.

İlgili Firestore kuralları `firestore.rules` dosyasında ve [Firestore kuralları dokümanında](firestore.rules.md) tanımlıdır.

## Referanslar

- [Firebase Authentication](https://firebase.google.com/docs/auth)
