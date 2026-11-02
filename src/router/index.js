import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/index.js'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Şirket Rehberi - Ana Sayfa' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        title: 'Admin Panel - Veri Yönetimi',
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        title: 'Profil Sayfası',
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Giriş Yap - Şirket Rehberi' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.ensureInitialized()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { path: '/' }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { path: authStore.isAdmin ? '/admin' : '/' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Apprehber - Şirket Rehberi'
})

export default router
