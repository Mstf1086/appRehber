<template>
  <div class="admin-view">
    <div class="admin-content">
      <section class="version-section card">
        <div>
          <h2>Versiyon Yönetimi</h2>
          <div class="version-info">
            <p><strong>Mevcut Versiyon:</strong> {{ authStore.currentVersion }}</p>
            <p><strong>Son Güncelleme:</strong> {{ formatDate(authStore.lastUpdate) }}</p>
          </div>
        </div>
        <button @click="refreshData" class="btn-version" :disabled="refreshLoading">
          {{ refreshLoading ? 'Yenileniyor...' : 'Verileri Yenile' }}
        </button>
      </section>

      <p v-if="successMessage" class="success-banner" role="status">{{ successMessage }}</p>
      <p v-if="pageError" class="error-banner" role="alert">{{ pageError }}</p>

      <section class="company-management card">
        <h2>Firma Yönetimi</h2>

        <div class="controls">
          <button @click="openAddForm" class="btn-primary">+ Yeni Firma Ekle</button>
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Firma adı veya telefon ara..."
              aria-label="Yönetim panelinde firmalarda ara"
            />
          </div>
        </div>

        <CompanyForm
          v-if="showAddForm || selectedCompanyForEdit"
          :company="selectedCompanyForEdit"
          :is-editing="!!selectedCompanyForEdit"
          @form-submitted="handleFormSubmit"
          @form-canceled="closeForm"
          @form-error="handleFormError"
        />

        <div v-if="companyStore.loading" class="loading-section">
          <LoadingSpinner message="Firmalar yükleniyor..." />
        </div>

        <div v-else class="companies-list">
          <div
            v-for="company in filteredCompanies"
            :key="company.id"
            class="admin-company-card"
          >
            <div class="card-header">
              <h3>{{ company.name }}</h3>
              <div class="card-actions">
                <button @click="editCompany(company)" class="btn-edit">Düzenle</button>
                <button @click="confirmDelete(company)" class="btn-delete">Sil</button>
              </div>
            </div>
            <div class="card-body">
              <p><strong>Telefon:</strong> {{ formatPhone(company.phone) || 'Yok' }}</p>
              <p><strong>Adres:</strong> {{ company.address }}</p>
              <p><strong>WhatsApp:</strong> {{ formatPhone(company.whatsapp) || 'Yok' }}</p>
              <p><strong>Instagram:</strong> {{ company.instagram || 'Yok' }}</p>
              <p><strong>Twitter:</strong> {{ company.twitter || 'Yok' }}</p>
              <p v-if="company.location">
                <strong>Koordinatlar:</strong> {{ company.location.lat }}, {{ company.location.lng }}
              </p>
              <p><strong>Son Güncelleme:</strong> {{ formatDate(company.updatedAt) }}</p>
            </div>
          </div>
          <div v-if="filteredCompanies.length === 0" class="no-results">
            <p>Kayıtlı firma bulunamadı.</p>
          </div>
        </div>
      </section>
    </div>

    <CompanyModal
      v-if="showDeleteModal"
      title="Firma Silme Onayı"
      confirm-text="Evet, Sil"
      @close="closeDeleteModal"
      @confirm="deleteCompanyConfirmed"
    >
      <p>"{{ selectedCompanyToDelete?.name }}" firmasını silmek istediğinize emin misiniz?</p>
      <p>Bu işlem geri alınamaz.</p>
    </CompanyModal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore, useCompanyStore } from '../stores/index.js'
import CompanyForm from '../components/CompanyForm.vue'
import CompanyModal from '../components/Modal.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { filterCompanies, formatDate, formatPhone } from '../utils/format.js'

const authStore = useAuthStore()
const companyStore = useCompanyStore()

const showAddForm = ref(false)
const selectedCompanyForEdit = ref(null)
const showDeleteModal = ref(false)
const selectedCompanyToDelete = ref(null)
const refreshLoading = ref(false)
const searchQuery = ref('')
const successMessage = ref('')
const pageError = ref('')

const filteredCompanies = computed(() => filterCompanies(companyStore.companies, searchQuery.value))

const refreshData = async () => {
  refreshLoading.value = true
  pageError.value = ''
  try {
    await Promise.all([companyStore.fetchCompanies(), authStore.syncVersion()])
  } catch (error) {
    console.error('Refresh failed:', error)
    pageError.value = 'Veriler yenilenemedi. Lütfen tekrar deneyin.'
  } finally {
    refreshLoading.value = false
  }
}

const openAddForm = () => {
  selectedCompanyForEdit.value = null
  showAddForm.value = true
  pageError.value = ''
}

const editCompany = (company) => {
  selectedCompanyForEdit.value = company
  showAddForm.value = false
  pageError.value = ''
}

const confirmDelete = (company) => {
  selectedCompanyToDelete.value = company
  showDeleteModal.value = true
}

const deleteCompanyConfirmed = async () => {
  const company = selectedCompanyToDelete.value
  if (!company) return

  try {
    await companyStore.deleteCompany(company.id)
    successMessage.value = `"${company.name}" firması silindi.`
    pageError.value = ''
  } catch (error) {
    console.error('Delete failed:', error)
    pageError.value = error?.code === 'permission-denied'
      ? 'Silme işlemi için yetkiniz yok.'
      : 'Firma silinemedi. Lütfen tekrar deneyin.'
  } finally {
    closeDeleteModal()
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedCompanyToDelete.value = null
}

const handleFormSubmit = (company) => {
  closeForm()
  successMessage.value = `"${company.name}" firması kaydedildi.`
  pageError.value = ''
}

const handleFormError = (message) => {
  pageError.value = message
}

const closeForm = () => {
  showAddForm.value = false
  selectedCompanyForEdit.value = null
}

onMounted(() => {
  companyStore.fetchCompanies()
  authStore.syncVersion().catch((error) => console.error('Version sync failed:', error))
})
</script>

<style scoped>
.admin-view {
  padding: 2rem 0;
}

.admin-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.version-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.version-section h2 {
  margin: 0;
  color: #2c3e50;
}

.version-info p {
  margin: 0.2rem 0;
}

.btn-version {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-version:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-banner,
.error-banner {
  padding: 0.9rem 1.2rem;
  border-radius: 8px;
  margin: 0;
}

.success-banner {
  background: #eafaf1;
  border: 1px solid #a9dfbf;
  color: #1e8449;
}

.error-banner {
  background: #fdedec;
  border: 1px solid #f5b7b1;
  color: #922b21;
}

.company-management h2 {
  margin: 0 0 1rem;
  color: #2c3e50;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-box input {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid #ddd;
  border-radius: 4px;
}

.loading-section {
  text-align: center;
  padding: 2rem;
}

.admin-company-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
  transition: background 0.3s;
}

.admin-company-card:hover {
  background-color: #f8f9fa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-edit {
  background-color: #ffc107;
  color: #333;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.card-body p {
  margin: 0.3rem 0;
  font-size: 0.95rem;
  color: #333;
}

.card-body p strong {
  color: #2c3e50;
  font-weight: 600;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .version-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
