import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { auth, db } from '../services/firebase.js'
import { getVersionState, incrementDataVersion } from '../services/version.js'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const currentVersion = ref(0)
  const lastUpdate = ref(null)
  const isAuthenticated = computed(() => Boolean(user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  let authReadyPromise = null

  const ensureInitialized = () => {
    if (!authReadyPromise) {
      authReadyPromise = new Promise((resolve) => {
        onAuthStateChanged(auth, async (currentUser) => {
          if (!currentUser) {
            user.value = null
            resolve()
            return
          }

          const fallbackUser = {
            uid: currentUser.uid,
            email: currentUser.email,
            name: '',
            role: 'user'
          }

          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
            user.value = userDoc.exists()
              ? { ...fallbackUser, ...userDoc.data() }
              : fallbackUser
          } catch (error) {
            console.error('Failed to load user profile:', error)
            user.value = fallbackUser
          }

          resolve()
        })
      })
    }

    return authReadyPromise
  }

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))

    user.value = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: '',
      role: 'user',
      ...(userDoc.exists() ? userDoc.data() : {})
    }

    return user.value
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
  }

  const updateUserProfile = async (name) => {
    if (!user.value) throw new Error('Kullanıcı oturumu yok')

    const cleanName = (name || '').trim()
    if (!cleanName) throw new Error('Ad alanı boş bırakılamaz')

    await updateDoc(doc(db, 'users', user.value.uid), { name: cleanName })
    user.value = { ...user.value, name: cleanName }
    return user.value
  }

  const syncVersion = async () => {
    const state = await getVersionState()
    currentVersion.value = state.version
    lastUpdate.value = state.lastUpdate
    return state
  }

  const incrementVersion = async () => {
    const version = await incrementDataVersion()
    currentVersion.value = version
    localStorage.setItem('appVersion', String(version))
    localStorage.removeItem('cachedCompanies')
    return version
  }

  const checkVersion = async () => {
    try {
      const state = await getVersionState()
      currentVersion.value = state.version
      lastUpdate.value = state.lastUpdate

      const cachedVersion = localStorage.getItem('appVersion')
      if (cachedVersion === null) {
        localStorage.setItem('appVersion', String(state.version))
        return false
      }

      if (state.version !== Number(cachedVersion)) {
        localStorage.setItem('appVersion', String(state.version))
        localStorage.removeItem('cachedCompanies')
        window.location.reload()
        return true
      }

      return false
    } catch (error) {
      console.error('Version check failed:', error)
      return false
    }
  }

  return {
    user,
    currentVersion,
    lastUpdate,
    isAuthenticated,
    isAdmin,
    ensureInitialized,
    login,
    logout,
    updateUserProfile,
    syncVersion,
    incrementVersion,
    checkVersion
  }
})

const serializeCompany = (company) => ({
  ...company,
  createdAt: company.createdAt?.toDate?.().toISOString() || company.createdAt,
  updatedAt: company.updatedAt?.toDate?.().toISOString() || company.updatedAt
})

export const useCompanyStore = defineStore('company', () => {
  const companies = ref([])
  const selectedCompany = ref(null)
  const loading = ref(false)
  const error = ref('')

  const cacheCompanies = () => {
    localStorage.setItem('cachedCompanies', JSON.stringify(companies.value.map(serializeCompany)))
  }

  const fetchCompanies = async () => {
    loading.value = true
    error.value = ''

    try {
      const snapshot = await getDocs(collection(db, 'companies'))
      companies.value = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
      }))
      cacheCompanies()
    } catch (fetchError) {
      console.error('Failed to fetch companies:', fetchError)
      error.value =
        fetchError?.code === 'permission-denied'
          ? 'Firmaları görüntüleme yetkiniz yok.'
          : 'Firmalar yüklenemedi. Lütfen daha sonra tekrar deneyin.'

      const cached = localStorage.getItem('cachedCompanies')
      if (cached) {
        try {
          companies.value = JSON.parse(cached)
        } catch {
          localStorage.removeItem('cachedCompanies')
        }
      }
    } finally {
      loading.value = false
    }
  }

  const bumpVersion = async () => {
    try {
      await useAuthStore().incrementVersion()
    } catch (versionError) {
      console.error('Data version could not be incremented:', versionError)
    }
  }

  const addCompany = async (companyData) => {
    const companyRef = doc(collection(db, 'companies'))
    const payload = {
      ...companyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: 1
    }

    await setDoc(companyRef, payload)
    const newCompany = { id: companyRef.id, ...companyData, version: 1 }
    companies.value.push(newCompany)
    cacheCompanies()
    await bumpVersion()
    return newCompany
  }

  const updateCompany = async (id, updatedData) => {
    const currentCompany = companies.value.find((company) => company.id === id)
    if (!currentCompany) throw new Error('Şirket bulunamadı')

    const nextVersion = (currentCompany.version || 0) + 1
    await updateDoc(doc(db, 'companies', id), {
      ...updatedData,
      updatedAt: serverTimestamp(),
      version: nextVersion
    })

    const updatedCompany = {
      ...currentCompany,
      ...updatedData,
      version: nextVersion,
      updatedAt: new Date()
    }
    companies.value = companies.value.map((company) =>
      company.id === id ? updatedCompany : company
    )
    cacheCompanies()
    await bumpVersion()
    return updatedCompany
  }

  const deleteCompany = async (id) => {
    await deleteDoc(doc(db, 'companies', id))
    companies.value = companies.value.filter((company) => company.id !== id)
    cacheCompanies()
    await bumpVersion()
  }

  const setSelectedCompany = (company) => {
    selectedCompany.value = company
  }

  return {
    companies,
    selectedCompany,
    loading,
    error,
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    setSelectedCompany
  }
})
