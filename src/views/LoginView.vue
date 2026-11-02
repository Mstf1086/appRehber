<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Giriş Yap</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-posta Adresi</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="E-posta adresinizi girin"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Şifre</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Şifrenizi girin"
            required
          />
        </div>
        <button
          type="submit"
          class="login-btn"
          :disabled="loading"
        >
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/index.js'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const authErrorMessages = {
  'auth/invalid-email': 'Geçersiz e-posta adresi.',
  'auth/user-disabled': 'Hesabınız devre dışı bırakılmış.',
  'auth/user-not-found': 'Kullanıcı bulunamadı.',
  'auth/wrong-password': 'Hatalı şifre.',
  'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  'auth/too-many-requests': 'Çok fazla hatalı deneme. Lütfen daha sonra tekrar deneyin.',
  'auth/network-request-failed': 'Ağ hatası. İnternet bağlantınızı kontrol edin.'
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Lütfen e-posta ve şifre girin'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)

    // Only allow internal paths as post-login redirect targets
    const redirect = String(route.query.redirect || '')
    if (redirect.startsWith('/') && !redirect.startsWith('//')) {
      router.push(redirect)
    } else if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = authErrorMessages[error.code] || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input {
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.login-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 0.5rem;
}

.login-btn:hover {
  background-color: #2980b9;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
