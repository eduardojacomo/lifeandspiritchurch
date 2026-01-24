<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage"
import CustomSelect from '../Forms/CustomSelect.vue'

const db = getFirestore()
const storage = getStorage()

// Estado
const savedImages = ref([])
const filters = ref({
  page: 'all',
  device: 'all',
  status: 'all'
})

// Opções de filtros
const pageOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'Sobre' },
  { value: 'activities', label: 'Atividades' }
]

const deviceOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' }
]

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativas' },
  { value: 'expired', label: 'Expiradas' }
]

// Funções auxiliares
const isExpired = (img) => {
  return img.expirationDate && new Date(img.expirationDate) < new Date()
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

// Computed para aplicar filtros
const filteredImages = computed(() => {
  return savedImages.value.filter(img => {
    const page = (img.page || '').toLowerCase()
    const format = (img.format || '').toLowerCase()
    const filterPage = filters.value.page.toLowerCase()
    const filterDevice = filters.value.device.toLowerCase()
    const filterStatus = filters.value.status.toLowerCase()

    // Filtro por página
    if (filterPage !== 'all' && page !== filterPage) return false

    // Filtro por dispositivo
    if (filterDevice !== 'all' && format !== filterDevice) return false

    // Filtro por status
    const expired = isExpired(img)
    if (filterStatus === 'active' && expired) return false
    if (filterStatus === 'expired' && !expired) return false

    return true
  })
})

// Carregar imagens do Firestore
async function loadAllImages() {
  const allImages = []

  // 1. Coleção principal "images"
  const imagesSnapshot = await getDocs(collection(db, "images"))
  for (const docSnap of imagesSnapshot.docs) {
    const data = docSnap.data()
    let url = null

    try {
      const fileRef = storageRef(storage, `images/${data.name}`)
      url = await getDownloadURL(fileRef)
    } catch (error) {
      console.warn(`Arquivo não encontrado no Storage: ${data.name}`, error)
      // fallback: imagem de erro
      url = "/img/error.png" // coloque aqui o caminho da sua imagem de erro
    }

    allImages.push({
      id: docSnap.id,
      preview: url,
      ...data
    })
  }

  // 2. Subcoleções "activities/{id}/images"
  const activitiesSnapshot = await getDocs(collection(db, "activities"))
  for (const activityDoc of activitiesSnapshot.docs) {
    const imagesSubSnapshot = await getDocs(collection(db, `activities/${activityDoc.id}/images`))
    for (const imgDoc of imagesSubSnapshot.docs) {
      const data = imgDoc.data()
      let url = null

      try {
        const fileRef = storageRef(storage, `images/${data.name}`)
        url = await getDownloadURL(fileRef)
      } catch (error) {
        console.warn(`Arquivo não encontrado no Storage: ${data.name}`, error)
        url = "/img/error.png"
      }

      allImages.push({
        id: imgDoc.id,
        preview: url,
        ...data,
        activityId: activityDoc.id
      })
    }
  }

  savedImages.value = allImages
}
// Lifecycle
onMounted(async () => {
  await loadAllImages()
})

// Ações
const editImage = (img) => {
  console.log("Editar imagem:", img)
}

const deleteImage = (id) => {
  savedImages.value = savedImages.value.filter(img => img.id !== id)
}
</script>

<template>
  <!-- Gallery Tab -->
  <div class="tab-content active">
    <div class="gallery-filters">
      <div class="filter-group">
        <label>Página</label>
        <CustomSelect v-model="filters.page" :options="pageOptions" />
      </div>

      <div class="filter-group">
        <label>Dispositivo</label>
        <CustomSelect v-model="filters.device" :options="deviceOptions" />
      </div>

      <div class="filter-group">
        <label>Status</label>
        <CustomSelect v-model="filters.status" :options="statusOptions" />
      </div>
    </div>

    <div v-if="filteredImages.length > 0" class="gallery-grid">
      <div v-for="img in filteredImages" :key="img.id" class="gallery-item">
        <div class="gallery-image">
          <img :src="img.preview" :alt="img.name">
        </div>
        <div class="gallery-info">
          <div class="gallery-tags">
            <span v-if="img.desktop" class="tag desktop">Desktop</span>
            <span v-if="img.mobile" class="tag mobile">Mobile</span>
            <span v-if="isExpired(img)" class="tag expired">Expirada</span>
          </div>
          <div class="gallery-details">
            <strong>Página:</strong> {{ capitalizeFirst(img.page) }}
          </div>
          <div v-if="img.expirationDate" class="gallery-details">
            <strong>Expira em:</strong> {{ formatDate(img.expirationDate) }}
          </div>
          <div class="gallery-details" style="font-size: 0.8rem; margin-top: 0.5rem;">
            Enviada em: {{ formatDate(img.created_at) }}
          </div>
          <div class="gallery-actions">
            <button class="btn-edit" @click="editImage(img)">Editar</button>
            <button class="btn-delete" @click="deleteImage(img.id)">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="icon">🖼️</div>
      <h3>Nenhuma imagem encontrada</h3>
      <p>Faça upload de imagens para começar</p>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 85px 2rem 2rem 2rem;
  background: #000;
  color: #fff;
  min-height: 100vh;
}

/* Header */
.header {
  background: #0a0a0a;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: .5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: .5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab {
  padding: 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab:hover {
  color: rgba(255, 255, 255, 0.9);
}

.tab.active {
  color: #fff;
  border-bottom-color: #fff;
}

/* Tab Content */
.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Upload Section */
.upload-card {
  background: #0a0a0a;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.upload-area {
  border: 3px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.02);
}

.upload-area.dragover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.upload-icon {
  font-size: 3rem;
  /* margin-bottom: 1rem; */
  opacity: 0.6;
}

.upload-area h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.upload-btn {
  padding: 1rem 2.5rem;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
}

.upload-btn:hover {
  background: #fff;
  color: #000;
}

/* Image Configuration */
.config-section {
  background: #0a0a0a;
  border-radius: 12px;
  padding: 1rem 2rem;
}

.config-grid {
  display: grid;
  gap: 2rem;
}

.image-config-item {
  background: #111;
  border-radius: 8px;
  padding: 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  align-items: start;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.config-preview {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.config-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.config-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.form-group select {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  border-radius: 4px;
  transition: all 0.3s ease;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  color-scheme: dark;
}

.form-group select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.form-group select option {
  background-color: #111;
  color: #fff;
}

.form-group select option:checked {
  background-color: #222;
  color: #fff;
}

.device-toggle {
  display: flex;
  gap: 1rem;
}

.device-option {
  flex: 1;
  padding: .5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.device-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.device-option.selected {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-remove {
  padding: 1rem 2rem;
  background: transparent;
  color: #ff4444;
  border: 2px solid #ff4444;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-remove:hover {
  background: rgba(255, 68, 68, 0.1);
}

/* Image Gallery */
.gallery-filters {
  background: #0a0a0a;
  padding: 1rem;
  border-radius: 12px;
  /* margin-bottom: 2rem; */
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-group label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.filter-group select {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.gallery-item {
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.gallery-item:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
}

.gallery-image {
  width: 100%;
  height: 200px;
  background: #000;
  overflow: hidden;
  position: relative;
}

.gallery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-info {
  padding: 1.5rem;
}

.gallery-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.75rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag.desktop { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.tag.mobile { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
.tag.expired { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.gallery-details {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.gallery-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.btn-edit:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-delete:hover {
  background: rgba(255, 68, 68, 0.1);
  border-color: #ff4444;
  color: #ff4444;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state .icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #4ade80;
  color: #000;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  z-index: 1000;
}

.toast.error {
  background: #ff4444;
  color: #fff;
}

.toast.info {
  background: #3b82f6;
  color: #fff;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 968px) {
  .image-config-item {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}


/* novo */
/* Overlay do modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}


.modal-content {
  background: #000; /* fundo preto */
  padding: 2rem;
  border-radius: 8px;
  position: relative;
  width: 80%;
  max-width: 900px;
  text-align: center;
  color: #fff;
  max-height: 95vh;
}

/* Botão fechar */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
}

/* Botões Desktop/Mobile */
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  /* margin-top: 2rem; */
}

.modal-buttons button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: #fff;
  transition: background 0.3s;
}

.modal-buttons button:hover {
  background: #666;
}

/* Área da imagem + botões abaixo */
.image-area {
  margin-top: .5rem;
}

.image-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.image-actions button {
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: #fff;
}

.canvas-container {
  max-height: 80vh;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-wrapper {
  position: relative;
  border: 2px dashed rgba(255,255,255,0.5);
  /* padding: 4px; */
  max-height: 80vh;
  max-width: 100%;
}

.canvas-wrapper canvas {
  display: block;
  max-height: 80vh;
  max-width: 100%;
  height: auto;
  width: auto;
}

canvas {
  display: block;
  background: #111;
  cursor: grab;
}

canvas:active {
  cursor: grabbing;
}

.editor-controls {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  /* margin-top: 1.5rem; */
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 30px;
  height: 30px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.control-btn:hover {
  background: #555;
}

.control-btn:active {
  transform: scale(0.95);
}


</style>