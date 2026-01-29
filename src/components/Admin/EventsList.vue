<script setup>
import { ref, onMounted, computed } from 'vue'
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore"
import AdminEventsForm from './AdminEventsForm.vue'


const db = getFirestore()
const events = ref([])
const isLoading = ref(false)

// Estado dos Filtros
const searchFilter = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const isEditModalOpen = ref(false)
const selectedEvent = ref(null)

const categories = [
  { value: 'all', label: 'Todas Categorias' },
  { value: 'conferencia', label: 'Conferência' },
  { value: 'festa', label: 'Festa' },
  { value: 'batismo', label: 'Batismo' },
  { value: 'encontro', label: 'Encontro' },
  { value: 'culto', label: 'Culto Especial' }
]

// Carregar Eventos
const loadEvents = async () => {
  isLoading.value = true
  try {
    const q = query(collection(db, "events"), orderBy("dateStart", "asc"))
    const querySnapshot = await getDocs(q)
    events.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Erro ao carregar agenda:", error)
  } finally {
    isLoading.value = false
  }
}

const openEdit = (event) => {
  selectedEvent.value = JSON.parse(JSON.stringify(event)) // Clone profundo para evitar alteração reativa direta na lista
  isEditModalOpen.value = true
}

const closeEdit = () => {
  isEditModalOpen.value = false
  selectedEvent.value = null
}

const handleEditSuccess = () => {
  closeEdit()
  loadEvents() // Recarrega a lista para mostrar os dados novos
}


// Lógica de Filtro (Computed)
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const search = searchFilter.value.toLowerCase()

    const titlePT = event.title?.pt?.toLowerCase() ?? ''
    const titleEN = event.title?.en?.toLowerCase() ?? ''

    const matchesSearch =
      titlePT.includes(search) || titleEN.includes(search)

    const matchesStatus =
      statusFilter.value === 'all' ||
      (event.status ?? 'active') === statusFilter.value

    const matchesCategory =
      categoryFilter.value === 'all' ||
      event.category === categoryFilter.value

    return matchesSearch && matchesStatus && matchesCategory
  })
})


const toggleStatus = async (event) => {
  const newStatus = (event.status ?? 'active') === 'active'
    ? 'inactive'
    : 'active'

  try {
    await updateDoc(doc(db, "events", event.id), { status: newStatus })
    event.status = newStatus
  } catch {
    alert("Erro ao mudar status")
  }
}

const deleteEvent = async (id) => {
  if (!confirm("Tem certeza que deseja remover este evento?")) return
  try {
    await deleteDoc(doc(db, "events", id))
    events.value = events.value.filter(e => e.id !== id)
  } catch (error) {
    alert("Erro ao excluir")
  }
}

onMounted(loadEvents)
</script>

<template>
   
    <div class="events-list-container">
      <div v-if="isEditModalOpen" class="modal-overlay">
      <div class="modal-full-content">
          <div class="modal-header">
          <h2>Editar Evento: {{ selectedEvent?.title.pt }}</h2>
          <button @click="closeEdit" class="btn-close">✕</button>
          </div>
          <div class="modal-body">
          <AdminEventsForm 
              :initialData="selectedEvent" 
              @saved="handleEditSuccess" 
              @cancel="closeEdit" 
          />
          </div>
      </div>
      </div>
    
    <div class="gallery-filters">
      <div class="filter-group search">
        <label>Buscar Evento</label>
        <input type="text" v-model="searchFilter" placeholder="Nome do evento (PT/EN)..." class="filter-input">
      </div>

      <div class="filter-group">
        <label>Status</label>
        <select v-model="statusFilter" class="filter-select">
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Categoria</label>
        <select v-model="categoryFilter" class="filter-select">
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>
      
      <button class="btn-refresh" @click="loadEvents" :disabled="isLoading">
        🔄 {{ isLoading ? '...' : 'Atualizar' }}
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Buscando agenda...</p>
    </div>
    
    <div v-else-if="filteredEvents.length === 0" class="empty-state">
      <div class="icon">📅</div>
      <h3>Nenhum evento encontrado</h3>
      <p>Tente ajustar os filtros ou cadastrar um novo evento.</p>
    </div>

    <div v-else class="events-grid">
      <div v-for="event in filteredEvents" :key="event.id" :class="['event-card', { inactive: event.status === 'inactive' }]">
        <div class="event-img">
          <img
            :src="event.bannerDesktop || event.bannerMobile || '/img/placeholder.png'"
            alt="Banner do evento"
          />
          <span :class="['status-badge', event.status]">{{ event.status === 'active' ? 'Ativo' : 'Inativo' }}</span>
        </div>
        
        <div class="event-content">
          <div class="event-header">
             <span class="category-tag">{{ event.category }}</span>
             <small>{{ event.dateStart }}</small>
          </div>
          <h3>{{ event.title.pt }}</h3>
          <p class="description">{{ event.description.pt?.substring(0, 80) }}...</p>
          
          <div class="card-actions">
            <button class="btn-edit" @click="openEdit(event)">✏️ Editar</button>
            <button class="btn-status" @click="toggleStatus(event)">
                {{ event.status === 'active' ? '🚫 Inativar' : '✅ Ativar' }}
            </button>
            <button class="btn-delete" @click="deleteEvent(event.id)">🗑️ Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reutilizando os estilos de filtros que você já possui */
.gallery-filters {
  background: #0a0a0a;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
  border: 1px solid #1a1a1a;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group.search { flex: 2; min-width: 200px; }

.filter-group label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 1px;
}

.filter-input, .filter-select {
  background: #111;
  border: 1px solid #333;
  padding: 0.6rem;
  color: white;
  border-radius: 6px;
  outline: none;
}

.filter-input:focus, .filter-select:focus {
  border-color: #3b82f6;
}

.btn-refresh {
  padding: 0.6rem 1rem;
  background: #222;
  border: 1px solid #333;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

/* Grid e Cards */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.event-content{
    padding: .5rem 1rem
}

.event-card {
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #1a1a1a;
  transition: all 0.3s ease;
}

.event-card.inactive {
  opacity: 0.6;
  filter: grayscale(0.8);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.category-tag {
  font-size: 0.7rem;
  background: #1e3a8a;
  color: #60a5fa;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.description {
  font-size: 0.85rem;
  color: #777;
  height: 40px;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.card-actions button {
  flex: 1;
  padding: 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #333;
  background: transparent;
  color: #fff;
  font-weight: 500;
  transition: 0.2s;
}

.btn-delete:hover { background: #450a0a; border-color: #991b1b; color: #f87171; }
.btn-status:hover { background: #111827; border-color: #3b82f6; }

/* Loading Spinner */
.loading-state {
  text-align: center;
  padding: 4rem;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

.event-img {
  height: 150px;
  position: relative;
}

.event-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 2rem;
}

.modal-full-content {
  background: #1a1a1a;
  width: 100%;
  max-width: 1190px;
  max-height: 95vh;
  border-radius: 12px;
  overflow-y: auto;
  border: 1px solid #333;
}

.modal-header {
  padding: 1.0rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  background: #1a1a1a;
  z-index: 10;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-edit {
  background: #1e1e1e !important;
  color: #fbbf24 !important; /* Amarelo âmbar */
  border-color: #444 !important;
}

</style>