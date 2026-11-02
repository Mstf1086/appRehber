<template>
  <article
    class="company-card"
    role="button"
    tabindex="0"
    :aria-label="`${company.name} detaylarını aç`"
    @click="emit('company-selected', company)"
    @keydown.enter.prevent="emit('company-selected', company)"
    @keydown.space.prevent="emit('company-selected', company)"
  >
    <div class="card-header">
      <h3 class="company-name">{{ company.name }}</h3>
    </div>
    <div class="card-body">
      <p v-if="company.phone">
        <strong>Telefon:</strong>
        <a :href="telLink(company.phone)" class="phone-link" @click.stop>{{ formatPhone(company.phone) }}</a>
      </p>
      <p v-if="company.address"><strong>Adres:</strong> {{ company.address }}</p>

      <div class="social-links" v-if="hasSocialMedia(company)">
        <a
          v-if="company.whatsapp"
          :href="whatsappLink(company.whatsapp)"
          target="_blank"
          rel="noopener noreferrer"
          class="social-btn whatsapp-btn"
          title="WhatsApp"
          @click.stop
        >
          WhatsApp
        </a>
        <a
          v-if="company.instagram"
          :href="instagramLink(company.instagram)"
          target="_blank"
          rel="noopener noreferrer"
          class="social-btn instagram-btn"
          title="Instagram"
          @click.stop
        >
          Instagram
        </a>
        <a
          v-if="company.twitter"
          :href="twitterLink(company.twitter)"
          target="_blank"
          rel="noopener noreferrer"
          class="social-btn twitter-btn"
          title="Twitter/X"
          @click.stop
        >
          Twitter/X
        </a>
      </div>

      <a
        v-if="hasLocation(company)"
        :href="mapsLink(company)"
        target="_blank"
        rel="noopener noreferrer"
        class="location-btn"
        title="Konum"
        @click.stop
      >
        Konum
      </a>
    </div>
  </article>
</template>

<script setup>
import {
  formatPhone,
  hasLocation,
  hasSocialMedia,
  instagramLink,
  mapsLink,
  telLink,
  twitterLink,
  whatsappLink
} from '../utils/format.js'

defineProps({
  company: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['company-selected'])
</script>

<style scoped>
.company-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.company-card:hover,
.company-card:focus-visible {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

.card-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.company-name {
  color: #2c3e50;
  font-size: 1.2rem;
  margin: 0;
}

.card-body p {
  margin: 0.5rem 0;
  color: #333;
}

.phone-link {
  color: #2980b9;
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
  transition: background 0.3s;
}

.location-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  background-color: #ff5722;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .social-links {
    justify-content: center;
    gap: 0.2rem;
    margin: 0.3rem 0;
  }

  .social-btn {
    flex: 1;
    justify-content: center;
    min-width: 65px;
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .location-btn {
    min-width: 80px;
    justify-content: center;
    font-size: 0.75rem;
    padding: 0.35rem 0.6rem;
  }
}
</style>
