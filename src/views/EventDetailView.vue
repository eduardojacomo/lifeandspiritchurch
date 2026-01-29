<script setup>
import { ref, onMounted, computed } from 'vue'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const db = getFirestore()
const event = ref(null)
const loading = ref(true)
const error = ref(null)
const lang = 'pt'

// Busca do evento
const fetchEventData = async () => {
  loading.value = true
  error.value = null

  try {
    const docRef = doc(db, 'events', props.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      event.value = docSnap.data()
    } else {
      error.value = 'Evento não encontrado.'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao carregar os detalhes do evento.'
  } finally {
    loading.value = false
  }
}


const bannerImage = computed(() => {
  if (!event.value) return '/img/placeholder.png'

  const isMobile = window.innerWidth <= 768

  if (isMobile && event.value.bannerMobile) {
    return event.value.bannerMobile
  }

  return (
    event.value.bannerDesktop ||
    event.value.bannerMobile ||
    '/img/placeholder.png'
  )
})


// Formatação de data
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d
    .toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    .replace('.', '')
}

// Ação inscrição
const handleRegister = () => {
  const url = event.value?.registration?.link
  if (!url) return

  const absoluteUrl = /^https?:\/\//i.test(url)
    ? url
    : `https://${url}`

  window.open(absoluteUrl, '_blank')
}

onMounted(fetchEventData)
</script>


<template>

  <!-- loading -->
  <div class="event-detail-wrapper">
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Buscando detalhes do evento...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h2>⚠️ {{ error }}</h2>
      <button @click="fetchEventData" class="hero-btn">Tentar novamente</button>
    </div>

    <div  v-else-if="event" class="event-detail">
      <div class="event-hero">
       <div
          class="hero-background"
          :style="{ backgroundImage: `url(${bannerImage})` }"
        ></div>
        
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="event-title">{{ event.title?.[lang] || event.title?.pt }}</h1>
            <!-- <p class="event-subtitle">{{ event.category }}</p> -->
          </div>
          
        <button
          v-if="event.hasRegistration"
          class="hero-btn"
          @click="handleRegister"
        >
          {{ event.registration?.value > 0
            ? `Inscrição: R$ ${event.registration.value}`
            : 'Inscreva-se Grátis'
          }}
        </button>
        </div>
      </div>
      <div class="event-content">
        <div class="container">
          <div class="event-info-bar">
            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div>
                <span class="info-label">Início</span>
                <span class="info-value">{{ formatDate(event.dateStart) }}</span>
              </div>
            </div>
  
            <div class="info-divider"></div>
  
             <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div>
                <span class="info-label">Fim</span>
                <span class="info-value">{{ formatDate(event.dateEnd) }}</span>
              </div>
            </div>
  
            <div class="info-divider"></div>
  
            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <div>
                <span class="info-label">Local</span>
                <span class="info-value">{{ event.address?.city }}</span>
              </div>
            </div>
          </div>
  
          <div class="content-grid">
            <div class="main-content">
              <div class="description-content" v-html="event.description?.[lang] || event.description?.pt"></div>
  
              <div class="schedule-section" v-if="event.schedules && event.schedules.length > 0">
                <h2 class="section-title">Programação</h2>
                <div class="schedule-list">
                  <div class="schedule-item" v-for="(item, index) in event.schedules" :key="index">
                    <div class="schedule-time">{{ item.start }}</div>
                    <div class="schedule-details">
                      <h3>Dia {{ formatDate(item.day) }}</h3>
                      <p>Das {{ item.start }} às {{ item.end }}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="speakers-section" v-if="event.speakers?.length > 0">
                <h2 class="section-title">Preletores</h2>
                <div class="speakers-list">
                  <div class="speaker-card" v-for="(speaker, index) in event.speakers" :key="index">
                    <div
                      class="speaker-image"
                      :style="{ backgroundImage: `url(${speaker.imagem || '/img/avatar.png'})` }"
                    ></div>
                    <div class="speaker-info">
                      <h3>{{ speaker.nome }}</h3>
                      <p>{{ speaker.funcao }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="sidebar">
              <div class="register-card" v-if="event.hasRegistration">
                <h3>Inscreva-se</h3>
                <p>Participe deste encontro. Valor: <strong>{{ event.registration?.value > 0 ? `R$ ${event.registration.value}` : 'Gratuito' }}</strong></p>
                
                <button class="register-button" @click="handleRegister">
                  {{ event.registration?.link ? 'Fazer Inscrição' : 'Em breve' }}
                </button>
  
                <div class="register-meta">
                  <span class="event-category">{{ event.category }}</span>
                  <span class="event-status" :class="event.status?.toLowerCase()">{{ event.status }}</span>
                </div>
              </div>
  
              <div class="contact-card">
                <h4>📍 Localização</h4>
                <p><strong>{{ event.address?.label }}</strong></p>
                <p>{{ event.address?.street }}</p>
                <a v-if="event.address?.mapUrl" :href="event.address.mapUrl" target="_blank" class="contact-link">
                  Ver no Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- end loading -->
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.event-detail {
  width: 100%;
  background: #000000;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

/* Hero Section */
.event-hero {
  position: relative;
  height: 75vh;
  min-height: 600px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: #000000;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: grayscale(100%) brightness(0.4);
}

.hero-graphic {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  max-width: 800px;
  width: 80%;
}

.hero-graphic img {
  width: 100%;
  height: auto;
  display: block;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
}

.hero-text {
  flex: 1;
}

.event-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
}

.event-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  line-height: 1.5;
  color: #d1d5db;
  margin: 0;
  max-width: 600px;
}

.hero-btn {
  padding: 18px 48px;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.hero-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
}

/* Main Content */
.event-content {
  background: #000000;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Event Info Bar */
.event-info-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 60px 0;
  border-bottom: 1px solid #1f1f1f;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-item svg {
  color: #ffffff;
  flex-shrink: 0;
}

.info-item > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  color: #9ca3af;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.info-divider {
  width: 1px;
  height: 40px;
  background: #1f1f1f;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 80px;
  padding: 80px 0 120px;
}

/* Main Content */
.main-content {
  max-width: 800px;
}

.description-content {
  font-size: 18px;
  line-height: 1.8;
  color: #d1d5db;
  margin-bottom: 80px;
}

.description-content p {
  margin: 0 0 24px 0;
}

.description-content strong {
  color: #ffffff;
  font-weight: 600;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 32px 0;
  color: #ffffff;
}

/* Schedule */
.schedule-section {
  margin-bottom: 80px;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.schedule-item {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.schedule-item:hover {
  border-color: #3f3f3f;
  transform: translateX(8px);
}

.schedule-time {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  min-width: 80px;
}

.schedule-details h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #ffffff;
}

.schedule-details p {
  font-size: 15px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.6;
}

/* Speakers */
.speakers-section {
  margin-bottom: 80px;
}

.speakers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 32px;
}

.speaker-card {
  text-align: center;
}

.speaker-image {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin: 0 auto 16px;
  border: 3px solid #1f1f1f;
  transition: all 0.3s ease;
}

.speaker-card:hover .speaker-image {
  border-color: #ffffff;
  transform: scale(1.05);
}

.speaker-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.speaker-info p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 40px;
}

/* Register Card */
.register-card {
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-radius: 16px;
  padding: 32px;
}

.register-card h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #ffffff;
}

.register-card > p {
  font-size: 15px;
  color: #9ca3af;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.capacity-info {
  margin-bottom: 24px;
}

.capacity-text {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.capacity-number {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
}

.capacity-total {
  font-size: 16px;
  color: #9ca3af;
}

.capacity-bar {
  height: 8px;
  background: #1f1f1f;
  border-radius: 10px;
  overflow: hidden;
}

.capacity-fill {
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  transition: width 0.6s ease-out;
}

.register-button {
  width: 100%;
  padding: 18px 32px;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.register-button:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
}

.register-meta {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #1f1f1f;
}

.event-category {
  display: inline-block;
  padding: 6px 16px;
  background: #1f1f1f;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.event-status {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-status.ativo {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.event-status.inativo {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* Share Card */
.share-card {
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-radius: 16px;
  padding: 24px;
}

.share-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #ffffff;
}

.share-buttons {
  display: flex;
  gap: 12px;
}

.share-btn {
  flex: 1;
  padding: 12px;
  background: #1f1f1f;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-btn:hover {
  background: #2f2f2f;
  transform: translateY(-2px);
}

/* Contact Card */
.contact-card {
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-radius: 16px;
  padding: 24px;
}

.contact-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #ffffff;
}

.contact-card p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.contact-link {
  display: block;
  font-size: 14px;
  color: #ffffff;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr 350px;
    gap: 60px;
  }
}

@media (max-width: 968px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .sidebar {
    position: static;
    max-width: 500px;
    margin: 0 auto;
  }

  .event-info-bar {
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
  }

  .info-divider {
    display: none;
  }

  .speakers-list {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 24px;
  }

  .hero-content {
    padding: 0 24px 60px;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-btn {
    padding: 14px 32px;
    font-size: 14px;
  }

  .hero-graphic {
    width: 90%;
    max-width: 600px;
  }

  .event-info-bar {
    padding: 40px 0;
  }

  .content-grid {
    padding: 60px 0 80px;
  }

  .description-content {
    font-size: 16px;
  }

  .section-title {
    font-size: 28px;
  }
}

.loading-state, .error-state {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  color: white;
}

.loader {
  border: 4px solid #1f1f1f;
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Garante que o HTML renderizado na descrição tenha cor correta */
.description-content :deep(p) {
  margin-bottom: 1.5rem;
}
.description-content :deep(strong) {
  color: #fff;
}
</style>