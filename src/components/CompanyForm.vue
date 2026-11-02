<template>
  <div class="company-form-container">
    <form @submit.prevent="handleSubmit" class="company-form" novalidate>
      <div class="form-group">
        <label for="companyName">Firma Adı <span class="required">*</span></label>
        <input
          id="companyName"
          v-model.trim="form.name"
          type="text"
          placeholder="Firma adını girin"
          required
        />
      </div>

      <div class="form-group">
        <label for="companyPhone">Telefon Numarası</label>
        <input
          id="companyPhone"
          v-model.trim="form.phone"
          type="tel"
          placeholder="Telefon numarası"
        />
      </div>

      <div class="form-group">
        <label for="companyWhatsapp">WhatsApp Numarası</label>
        <input
          id="companyWhatsapp"
          v-model.trim="form.whatsapp"
          type="tel"
          placeholder="WhatsApp numarası"
        />
      </div>

      <div class="form-group">
        <label for="companyInstagram">Instagram Kullanıcı Adı</label>
        <input
          id="companyInstagram"
          v-model.trim="form.instagram"
          type="text"
          placeholder="@kullanıcıadı"
        />
      </div>

      <div class="form-group">
        <label for="companyTwitter">Twitter/X Kullanıcı Adı</label>
        <input
          id="companyTwitter"
          v-model.trim="form.twitter"
          type="text"
          placeholder="@kullanıcıadı"
        />
      </div>

      <div class="form-group full-width">
        <label for="companyAddress">Adres <span class="required">*</span></label>
        <textarea
          id="companyAddress"
          v-model.trim="form.address"
          placeholder="Adresi girin"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="form-group full-width" v-if="isAdmin">
        <label for="companyLocation">Koordinatlar (Opsiyonel)</label>
        <div class="location-inputs">
          <input
            id="companyLocation"
            v-model.number="form.location.lat"
            type="number"
            placeholder="Enlem"
            step="0.0001"
            min="-90"
            max="90"
          />
          <input
            v-model.number="form.location.lng"
            type="number"
            placeholder="Boylam"
            step="0.0001"
            min="-180"
            max="180"
          />
        </div>
        <small class="field-hint">Enlem ve boylam birlikte girilmelidir.</small>
      </div>

      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

      <div class="form-actions">
        <button type="button" @click="cancelEdit" class="btn-cancel" :disabled="submitting">
          İptal
        </button>
        <button type="submit" class="btn-save" :disabled="submitting">
          {{ submitting ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Kaydet') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useAuthStore, useCompanyStore } from '../stores/index.js'

const props = defineProps({
  company: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['form-submitted', 'form-canceled', 'form-error'])

const authStore = useAuthStore()
const companyStore = useCompanyStore()
const isAdmin = computed(() => authStore.isAdmin)

const emptyForm = () => ({
  name: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  twitter: '',
  address: '',
  location: {
    lat: null,
    lng: null
  }
})

const form = reactive(emptyForm())
const submitting = ref(false)
const errorMessage = ref('')

const resetForm = () => {
  Object.assign(form, emptyForm())
  errorMessage.value = ''
}

const initializeForm = (company) => {
  resetForm()
  if (!company) return

  Object.assign(form, {
    name: company.name || '',
    phone: company.phone || '',
    whatsapp: company.whatsapp || '',
    instagram: company.instagram || '',
    twitter: company.twitter || '',
    address: company.address || '',
    location: {
      lat: company.location?.lat ?? null,
      lng: company.location?.lng ?? null
    }
  })
}

watch(() => props.company, initializeForm, { immediate: true })

const buildLocation = () => {
  const lat = form.location.lat
  const lng = form.location.lng
  const hasLat = lat !== null && lat !== '' && !Number.isNaN(Number(lat))
  const hasLng = lng !== null && lng !== '' && !Number.isNaN(Number(lng))

  if (!hasLat && !hasLng) return null
  if (!hasLat || !hasLng) throw new Error('Enlem ve boylam birlikte girilmelidir.')
  if (Number(lat) < -90 || Number(lat) > 90) throw new Error('Enlem -90 ile 90 arasında olmalıdır.')
  if (Number(lng) < -180 || Number(lng) > 180) throw new Error('Boylam -180 ile 180 arasında olmalıdır.')

  return { lat: Number(lat), lng: Number(lng) }
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!form.name.trim()) {
    errorMessage.value = 'Firma adı zorunludur.'
    return
  }
  if (!form.address.trim()) {
    errorMessage.value = 'Adres zorunludur.'
    return
  }

  let location = null
  try {
    location = buildLocation()
  } catch (validationError) {
    errorMessage.value = validationError.message
    return
  }

  const companyData = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    whatsapp: form.whatsapp.trim(),
    instagram: form.instagram.trim(),
    twitter: form.twitter.trim(),
    address: form.address.trim(),
    location
  }

  submitting.value = true
  try {
    const savedCompany = props.isEditing
      ? await companyStore.updateCompany(props.company.id, companyData)
      : await companyStore.addCompany(companyData)

    emit('form-submitted', savedCompany)
    resetForm()
  } catch (error) {
    console.error('Form submission failed:', error)
    const message = error?.code === 'permission-denied'
      ? 'Bu işlem için yetkiniz yok.'
      : `İşlem başarısız: ${error?.message || 'Bilinmeyen hata'}`
    errorMessage.value = message
    emit('form-error', message)
  } finally {
    submitting.value = false
  }
}

const cancelEdit = () => {
  resetForm()
  emit('form-canceled')
}
</script>

<style scoped>
.company-form-container {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.company-form {
  display: grid;
  gap: 1rem;
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

.form-group input,
.form-group textarea {
  padding: 0.7rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.field-hint {
  color: #666;
  font-size: 0.85rem;
}

.form-error {
  color: #922b21;
  background: #fdedec;
  border: 1px solid #f5b7b1;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-save {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-save:hover {
  background-color: #2980b9;
}

.btn-save:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}

.location-inputs {
  display: flex;
  gap: 1rem;
}

.location-inputs input {
  flex: 1;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .location-inputs {
    flex-direction: column;
  }
}
</style>
