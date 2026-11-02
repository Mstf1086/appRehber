<template>
  <div class="app-root">
    <header class="main-header" v-if="!isLoginPage">
      <h1>Şirket Rehberi</h1>
      <nav aria-label="Ana menü">
        <router-link to="/" class="nav-link">Ana Sayfa</router-link>
        <router-link to="/admin" class="nav-link" v-if="authStore.isAdmin">Admin Panel</router-link>
        <router-link to="/profile" class="nav-link" v-if="isAuthenticated">Profil</router-link>
        <button @click="handleLogout" v-if="isAuthenticated" class="logout-btn">Çıkış Yap</button>
        <router-link to="/login" class="nav-link" v-if="!isAuthenticated">Giriş Yap</router-link>
      </nav>
    </header>

    <main class="container">
      <router-view></router-view>
    </main>

    <footer class="main-footer">
      <p>© {{ currentYear }} Şirket Rehberi - Tüm hakları saklıdır</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/index.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoginPage = computed(() => router.currentRoute.value.path === '/login')
const currentYear = new Date().getFullYear()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

onMounted(async () => {
  await authStore.ensureInitialized()
  authStore.checkVersion()
})
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.main-header h1 {
  margin: 0;
  font-size: 2rem;
}

nav {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active:not(.router-link-exact-active) {
  background: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.container {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.main-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
}

@media (max-width: 640px) {
  .main-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-header h1 {
    font-size: 1.5rem;
  }

  .container {
    padding: 1rem;
  }
}
</style>
