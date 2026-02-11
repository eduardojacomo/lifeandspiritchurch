<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore"

import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useLanguage } from '../stores/languageStore';

const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);
const { t } = useI18n();

const db = getFirestore()
const allEvents = ref([]) // Armazena tudo que vem do banco
const isLoading = ref(false)

// Estado dos Filtros
const categoryFilter = ref('all')
const showPastEvents = ref(false)

const isMobile = window.matchMedia('(max-width: 768px)').matches

const categories = [
  { value: 'all', label: 'Todas Categorias' },
  { value: 'conferencia', label: 'Conferência' },
  { value: 'festa', label: 'Festa' },
  { value: 'batismo', label: 'Batismo' },
  { value: 'encontro', label: 'Encontro' },
  { value: 'culto', label: 'Culto Especial' }
]

const headerEvents = ref({
  title: {
    pt: 'Eventos',
    en: 'Events'
  },
  subtitle: {
    pt: 'Fique por dentro dos nossos próximos eventos e celebrações.',
    en: 'Stay informed about our upcoming events and celebrations.'
  }
})

// Carregamento simples sem filtros de query
const loadEvents = async () => {
  isLoading.value = true
  try {
    const q = query(collection(db, "events"), orderBy("dateStart", "asc"))
    const querySnapshot = await getDocs(q)
    allEvents.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Erro ao carregar:", error)
  } finally {
    isLoading.value = false
  }
}

// Lógica Centralizada de Filtragem
const filteredEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD

  return allEvents.value.filter(event => {
    // 1. Apenas Ativos (Regra fixa para o site público)
    const isActive = event.status === 'active'
    
    // 2. Filtro de Categoria
    const matchesCategory = categoryFilter.value === 'all' || event.category === categoryFilter.value
    
    // 3. Lógica de Data (Comparação de Strings YYYY-MM-DD funciona perfeitamente)
    // Se showPastEvents for true, mostra menores que hoje. Se false, mostra >= hoje.
    const isPast = event.dateStart < today
    const matchesTimeline = showPastEvents.value ? isPast : !isPast

    return isActive && matchesCategory && matchesTimeline
  })
})

const getEventBanner = (event) => {
  if (isMobile) {
    return event.bannerMobile || event.bannerDesktop || '/img/placeholder.png'
  }
  return event.bannerDesktop || event.bannerMobile || '/img/placeholder.png'
}


const getEventLocation = (event) => {
  if (!event.address) return 'A definir'

  return (
    event.address.label ||
    event.address.city ||
    'A definir'
  )
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

watch(locale, () => {
  // Isso forçará a atualização do conteúdo quando o idioma mudar
});

onMounted(loadEvents)
</script>

<template>
    <section class="hero-section">
        <div class="hero-overlay">
        </div>
        <div class="hero-content">
      <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey" class="hero-title">{{ headerEvents.title?.[locale] }}</h1>
          </Transition>
           <Transition name="fade-blur" mode="out-in">
            <p :key="currentLocaleKey" class="hero-subtitle">{{ headerEvents.subtitle?.[locale] }}</p>
          </Transition>
        </div>
        <div class="scroll-indicator">
          <div class="scroll-line"></div>
        </div>
    </section>
  <div class="events-container">
    
    <header class="filter-bar">
      <div class="filter-group">
        <label>Explorar por Categoria</label>
        <select v-model="categoryFilter" class="custom-select">
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Período</label>
        <div class="toggle-pill">
          <button :class="{ active: !showPastEvents }" @click="showPastEvents = false">Próximos</button>
          <button :class="{ active: showPastEvents }" @click="showPastEvents = true">Anteriores</button>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="loading-wrapper">
      <div class="loader"></div>
    </div>

    <div v-else-if="filteredEvents.length === 0" class="no-results">
      <p>Nenhum evento encontrado para os critérios selecionados.</p>
    </div>

    <main v-else class="events-grid">
      <article
        v-for="event in filteredEvents"
        :key="event.id"
        class="event-card"
      >
        <div class="image-box">
          <img
            :src="getEventBanner(event)"
            :alt="event.title?.pt"
          >
          <div class="category-tag">{{ event.category }}</div>
        </div>

        <div class="content-box">
          <h2 class="title">{{ event.title?.pt }}</h2>

          <div>
            <span class="date">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
               {{ formatDate(event.dateStart) }}
            </span>

            <span class="location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               {{ getEventLocation(event) }}
            </span>
          </div>

          <router-link
            :to="`/events/detail_event/${event.id}`"
            class="btn-more"
          >
            Detalhes
          </router-link>
        </div>
      </article>
    </main>
  </div>
</template>

<style scoped>
/* Container Principal */
.events-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: sans-serif;
  color: #eee;
}

/* Filtros */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 50px;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.custom-select {
  background: #1a1a1a;
  color: white;
  border: 1px solid #333;
  padding: 10px 15px;
  border-radius: 8px;
  min-width: 200px;
}

.toggle-pill {
  background: #1a1a1a;
  padding: 4px;
  border-radius: 50px;
  border: 1px solid #333;
  display: flex;
}

.toggle-pill button {
  background: transparent;
  border: none;
  color: #888;
  padding: 8px 20px;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.2s;
}

.toggle-pill button.active {
  background: #2563eb;
  color: white;
}

/* Grid e Cards */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.event-card {
  background: #141414;
  border-radius: 15px;
  overflow: hidden;
  border: 3px solid var(--color-border);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.event-card:hover {
  transform: translateY(-8px);
  border-color: #3b82f6;
}

.image-box {
  height: 180px;
  position: relative;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11px;
  text-transform: uppercase;
}

.content-box {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: .5rem
}

.content-box h2{
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: px;
    color: #fff;
    text-transform: uppercase;
}

.content-box span{
    font-size: 1rem;
    color: var(--color-text);
    display: block;
    margin-bottom: 6px;
}

.title {
  font-size: 1.4rem;
  /* margin-bottom: 10px; */
  color: #fff;
}

.summary {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  /* margin-bottom: 20px; */
  height: 45px;
  overflow: hidden;
}

.btn-more {
  display: block;        
  text-align: center;    
  text-decoration: none; 
  width: 100%;
  background: #1e1e1e;
  color: #fff;
  border: 1px solid #333;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
  box-sizing: border-box; 
}

.btn-more:hover {
  background: #fff;
  color: #000;
  text-decoration: none; 
}

/* Feedback */
.loading-wrapper { text-align: center; padding: 50px; }
.loader {
  border: 3px solid #222;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.no-results {
  text-align: center;
  padding: 100px 20px;
  color: #666;
}
</style>