<template>
  <div class="profile-view">
    <div class="profile-card">
      <h2>Profil Bilgileri</h2>

      <div class="profile-info">
        <div class="info-item">
          <label>E-posta:</label>
          <span>{{ authStore.user?.email }}</span>
        </div>
        <div class="info-item">
          <label for="profileName">Adı Soyadı:</label>
          <input id="profileName" v-model.trim="name" type="text" placeholder="Adınızı girin" />
        </div>
        <div class="info-item">
          <label>Şifre:</label>
          <button @click="openPasswordModal" class="btn-change-password">
            Şifre Değiştir
          </button>
        </div>
      </div>

      <p v-if="statusMessage" class="status-message" role="status">{{ statusMessage }}</p>
      <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

      <div class="profile-actions">
        <button @click="saveProfile" class="btn-save" :disabled="saving">
          {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
        </button>
      </div>
    </div>

    <CompanyModal
      v-if="showPasswordChange"
      title="Şifre Değiştir"
      confirm-text="Şifreyi Değiştir"
      :close-on-click-outside="false"
      @close="closePasswordModal"
      @confirm="handlePasswordChange"
    >
      <div class="password-form">
        <div class="form-group">
          <label for="currentPassword">Mevcut Şifre</label>
          <input
            id="currentPassword"
            v-model="currentPassword"
            type="password"
            placeholder="Mevcut şifrenizi girin"
            autocomplete="current-password"
          />
        </div>
        <div class="form-group">
          <label for="newPassword">Yeni Şifre</label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            placeholder="Yeni şifre girin (en az 6 karakter)"
            autocomplete="new-password"
          />
        </div>
        <div class="form-group">
          <label for="newPasswordConfirm">Yeni Şifre (Tekrar)</label>
          <input
            id="newPasswordConfirm"
            v-model="newPasswordConfirm"
            type="password"
            placeholder="Yeni şifreyi tekrar girin"
            autocomplete="new-password"
          />
        </div>
        <p v-if="passwordError" class="error-message" role="alert">{{ passwordError }}</p>
      </div>
    </CompanyModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/index.js'
import { auth } from '../services/firebase.js'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import CompanyModal from '../components/Modal.vue'

const authStore = useAuthStore()

const name = ref(authStore.user?.name || '')
const saving = ref(false)
const showPasswordChange = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
const statusMessage = ref('')
const errorMessage = ref('')
const passwordError = ref('')

const saveProfile = async () => {
  statusMessage.value = ''
  errorMessage.value = ''

  if (!name.value.trim()) {
    errorMessage.value = 'Lütfen adınızı girin.'
    return
  }

  saving.value = true
  try {
    await authStore.updateUserProfile(name.value)
    statusMessage.value = 'Profil başarıyla güncellendi.'
  } catch (error) {
    console.error('Profile update failed:', error)
    errorMessage.value = error?.code === 'permission-denied'
      ? 'Profil güncelleme yetkiniz yok.'
      : 'Profil güncelleme başarısız.'
  } finally {
    saving.value = false
  }
}

const openPasswordModal = () => {
  passwordError.value = ''
  showPasswordChange.value = true
}

const closePasswordModal = () => {
  showPasswordChange.value = false
  currentPassword.value = ''
  newPassword.value = ''
  newPasswordConfirm.value = ''
  passwordError.value = ''
}

const handlePasswordChange = async () => {
  passwordError.value = ''

  if (!currentPassword.value || !newPassword.value || !newPasswordConfirm.value) {
    passwordError.value = 'Lütfen tüm şifre alanlarını doldurun.'
    return
  }

  if (newPassword.value.length < 6) {
    passwordError.value = 'Yeni şifre en az 6 karakter olmalıdır.'
    return
  }

  if (newPassword.value !== newPasswordConfirm.value) {
    passwordError.value = 'Yeni şifreler uyuşmuyor.'
    return
  }

  try {
    const currentUser = auth.currentUser
    if (!currentUser?.email) throw new Error('Kullanıcı oturumu bulunamadı.')

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword.value)
    await reauthenticateWithCredential(currentUser, credential)
    await updatePassword(currentUser, newPassword.value)
    statusMessage.value = 'Şifre başarıyla değiştirildi.'
    closePasswordModal()
  } catch (error) {
    console.error('Password change failed:', error)
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      passwordError.value = 'Mevcut şifreniz hatalı.'
    } else if (error.code === 'auth/too-many-requests') {
      passwordError.value = 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.'
    } else {
      passwordError.value = 'Şifre değiştirme başarısız.'
    }
  }
}
</script>

<style scoped>
.profile-view {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.profile-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.profile-card h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.info-item span,
.info-item input {
  padding: 0.7rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.info-item span {
  background: #f8f9fa;
}

.info-item input {
  width: 100%;
}

.btn-change-password {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
  align-self: flex-start;
}

.btn-change-password:hover {
  background-color: #2980b9;
}

.profile-actions {
  display: flex;
  justify-content: center;
}

.btn-save {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-save:hover {
  background-color: #219150;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-message,
.error-message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin: 0 0 1rem;
}

.status-message {
  background: #eafaf1;
  border: 1px solid #a9dfbf;
  color: #1e8449;
}

.error-message {
  background: #fdedec;
  border: 1px solid #f5b7b1;
  color: #922b21;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-form .form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.password-form .form-group input {
  padding: 0.6rem;
  border: 2px solid #ddd;
  border-radius: 4px;
}
</style>
