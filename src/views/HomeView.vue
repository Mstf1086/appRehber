<template>
  <div class="home-view">
    <div class="search-section">
      <h2>Şirket Arama</h2>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Firma adı, şehir veya iletişim bilgisi ara..."
          class="search-input"
          aria-label="Şirketlerde ara"
        />
      </div>
      <p v-if="!loading" class="result-count" aria-live="polite">
        {{ filteredCompanies.length }} firma listeleniyor
      </p>
    </div>

    <div v-if="companyStore.error" class="error-banner" role="alert">
      <span>{{ companyStore.error }}</span>
      <button type="button" class="retry-btn" @click="companyStore.fetchCompanies">Tekrar Dene</button>
    </div>

    <div v-if="loading" class="loading-message">
      <LoadingSpinner message="Firmalar yükleniyor..." />
    </div>

    <div v-else class="companies-grid">
      <CompanyCard
        v-for="company in filteredCompanies"
        :key="company.id"
        :company="company"
        @company-selected="handleCompanySelect"
      />
      <div v-if="filteredCompanies.length === 0" class="no-results">
        <p>Aradığınız kriterlere uygun şirket bulunamadı.</p>
      </div>
    </div>

    <CompanyModal
      v-if="selectedCompany"
      :title="selectedCompany.name"
      @close="companyStore.setSelectedCompany(null)"
    >
      <div class="company-detail">
        <p v-if="selectedCompany.phone">
          <strong>Telefon:</strong>
          <a :href="telLink(selectedCompany.phone)">{{ formatPhone(selectedCompany.phone) }}</a>
        </p>
        <p v-if="selectedCompany.address"><strong>Adres:</strong> {{ selectedCompany.address }}</p>

        <div class="detail-links">
          <a
            v-if="selectedCompany.whatsapp"
            :href="whatsappLink(selectedCompany.whatsapp)"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn whatsapp-btn"
          >
            WhatsApp
          </a>
          <a
            v-if="selectedCompany.instagram"
            :href="instagramLink(selectedCompany.instagram)"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn instagram-btn"
          >
            Instagram
          </a>
          <a
            v-if="selectedCompany.twitter"
            :href="twitterLink(selectedCompany.twitter)"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn twitter-btn"
          >
            Twitter/X
          </a>
          <a
            v-if="hasLocation(selectedCompany)"
            :href="mapsLink(selectedCompany)"
            target="_blank"
            rel="noopener noreferrer"
            class="location-btn"
          >
            Konum
          </a>
        </div>
      </div>
    </CompanyModal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCompanyStore } from '../stores/index.js'
import CompanyCard from '../components/CompanyCard.vue'
import CompanyModal from '../components/Modal.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import {
  filterCompanies,
  formatPhone,
  hasLocation,
  instagramLink,
  mapsLink,
  telLink,
  twitterLink,
  whatsappLink
} from '../utils/format.js'

const companyStore = useCompanyStore()
const searchQuery = ref('')

const loading = computed(() => companyStore.loading)
const selectedCompany = computed(() => companyStore.selectedCompany)
const filteredCompanies = computed(() => filterCompanies(companyStore.companies, searchQuery.value))

const handleCompanySelect = (company) => {
  companyStore.setSelectedCompany(company)
}

onMounted(() => {
  companyStore.fetchCompanies()
})
</script>

<style scoped>
.home-view {
  padding: 2rem 0;
}

.search-section {
  text-align: center;
  margin-bottom: 2rem;
}

.search-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  padding: 0.8rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
}

.result-count {
  margin-top: 0.75rem;
  color: #666;
  font-size: 0.9rem;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #f5b7b1;
  border-radius: 8px;
  background: #fdedec;
  color: #922b21;
}

.retry-btn {
  border: 1px solid #922b21;
  background: white;
  color: #922b21;
  border-radius: 6px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.loading-message {
  text-align: center;
  padding: 3rem;
  color: #3498db;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
  grid-column: 1 / -1;
}

.company-detail p {
  margin: 0.5rem 0;
  color: #333;
}

.detail-links {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.detail-links a {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  color: white;
}

.whatsapp-btn { background-color: #25d366; }
.instagram-btn { background-color: #e1306c; }
.twitter-btn { background-color: #1da1f2; }
.location-btn { background-color: #ff5722; }

@media (max-width: 768px) {
  .companies-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    max-width: 100%;
  }

  .error-banner {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
