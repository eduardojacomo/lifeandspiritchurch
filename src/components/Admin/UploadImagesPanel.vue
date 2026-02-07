<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import ImageEditorModal from './ImageEditorModal.vue'
import { useImageRepository } from '@/composables/useImageRepository'
import { useImageRules } from '@/composables/useImageRules'
import { useToast } from '@/composables/useToast'

const repo = useImageRepository()
const rules = useImageRules()
const toast = useToast()
const emit = defineEmits(['saved'])

/* ================= STATE ================= */
const uploadedImages = ref([])
const selectedImage = ref(null)
const showEditModal = ref(false)
const fileInput = ref(null)
const isDragOver = ref(false)

/* ================= OPTIONS ================= */
const locationOptions = {
  home: ["Hero", "About", "App", "Scheadle"],
  about: ["Aboutchurch", "Aboutpastors"],
  logo: ["Logo"],
  activities: []
};

const updateLocations = (page) => {
  return locationOptions[page] || [];
}

const pageOptions = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'Sobre' },
  { value: 'activities', label: 'Atividades' },
  { value: 'logo', label: 'Logo' }
]

/* ================= HANDLERS ================= */
const handleFileSelect = (e) => handleFiles(e.target.files)

const handleFiles = (files) => {
  const validFiles = [...files].filter(file => {
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} não é uma imagem válida`)
      return false
    }
    return true
  })

  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = { file, preview: e.target.result, name: file.name }
      showEditModal.value = true
    }
    reader.readAsDataURL(file)
  })
}

const onImageEdited = ({ preview, name }) => {
  uploadedImages.value.push({
    id: Date.now(),
    preview, // Desktop Path
    previewMobile: null, // Mobile Path
    name,
    alt: '',
    page: '',
    location: '',
    expirationDate: null,
    devices: { desktop: true, mobile: false },
    heroTitle: { pt: '', en: '' },
    heroDesc: { pt: '', en: '' },
    order: 0,
    buttonLabel: { pt: '', en: '' },
    buttonLink: '',
    textPosition: 'left',
  })
  showEditModal.value = false
  toast.success(`Imagem preparada!`)
  scrollToSection('edit-image-section')
}

// Upload específico para Mobile dentro do card
const handleMobileUpload = (e, index) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    uploadedImages.value[index].previewMobile = event.target.result
    uploadedImages.value[index].devices.mobile = true // Ativa mobile automaticamente
    toast.info("Versão mobile adicionada!")
  }
  reader.readAsDataURL(file)
}

const removeUploadedImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

/* ================= SAVE ================= */
async function saveAllImages() {
  if (!repo.user.value) {
    toast.error('Sessão expirada. Faça login novamente.')
    return
  }

  let successCount = 0
  const imagesToProcess = [...uploadedImages.value]

  for (const img of imagesToProcess) {
    try {
      rules.validateBeforeSave(img)
      
      await repo.saveImage({
        preview: img.preview,
        previewMobile: img.previewMobile,
        page: img.page,
        location: img.location,
        alt: img.alt,
        expirationDate: img.expirationDate,
        devices: img.devices,
        ...(img.page === 'home' && img.location === 'Hero' && {
          heroTitle: img.heroTitle,
          heroDesc: img.heroDesc,
          order: img.order,
          buttonLabel: img.buttonLabel,
          buttonLink: img.buttonLink,
          textPosition: img.textPosition || 'left'
        })
      })

      successCount++
      uploadedImages.value = uploadedImages.value.filter(i => i.id !== img.id)
    } catch (err) {
      toast.error(`Erro em ${img.name}: ${err.message}`)
    }
  }

  if (successCount > 0) {
    toast.success(`${successCount} imagem(ns) salva(s)!`)
    emit('saved')
  }
}

const scrollToSection = (id) => {
  nextTick(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
</script>
<template>

<ImageEditorModal
  :show="showEditModal"
  :image="selectedImage"
  @confirm="onImageEdited"
  @close="showEditModal = false"
/>

<div class="tab-content active">
    <section id="upload-section" v-if="uploadedImages.length === 0">
        <div class="upload-card">
            <div 
              class="upload-area" 
              :class="{ dragover: isDragOver }"
              @dragenter.prevent="isDragOver = true"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleDrop"
            >
              <div class="upload-icon">📷</div>
              <h3>Arraste suas imagens aqui</h3>
              <p style="color: rgba(255, 255, 255, 0.6); margin: 1rem 0;">ou</p>
              <button class="upload-btn" @click="$refs.fileInput.click()">
                Selecionar Imagens
              </button>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                multiple
                style="display: none"
                @change="handleFileSelect"
              >
              <p style="color: rgba(255, 255, 255, 0.5); margin-top: 1rem; font-size: 0.9rem;">
                Formatos aceitos: JPG, PNG, GIF (máx. 10MB)
              </p>
            </div>
          </div>

    </section>  
    <section id="edit-image-section">
        <!-- Configuration Section -->
        <div v-if="uploadedImages.length > 0" class="config-section active">
          <h2 style="margin-bottom: 2rem; font-size: 1.8rem;">Configure as Imagens</h2>
          <div class="config-grid">
            <div 
              v-for="(img, index) in uploadedImages" 
              :key="img.id" 
              class="image-config-item"
            >
              
              <!-- <div>
                <div class="config-preview">
                  <img :src="img.preview" :alt="img.name">
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">
                  {{ img.name }}
                </p>
              </div> -->
              <div class="previews-column">
                <div class="main-preview">
                  <label>🖥️ Desktop (Principal)</label>
                  <div class="img-wrapper">
                    <img :src="img.preview" :alt="img.name">
                  </div>
                </div>

                <div class="mobile-upload-zone" @click="$refs['mobileInput' + index][0].click()">
                  <label>📱 Mobile (Opcional)</label>
                  <div class="mobile-preview-box" :class="{ hasImage: img.previewMobile }">
                    <img v-if="img.previewMobile" :src="img.previewMobile">
                    <div v-else class="placeholder-text">+ Adicionar Versão Mobile</div>
                  </div>
                  <input 
                    :ref="'mobileInput' + index" 
                    type="file" 
                    accept="image/*" 
                    style="display:none" 
                    @change="e => handleMobileUpload(e, index)"
                  >
                </div>
                <p class="file-name">{{ img.name }}</p>
              </div>
              
              <div class="config-form">
                <div class="form-group">      
                    <label>Descrição</label>
                    <input type="text" v-model="img.alt" placeholder="Descrição da imagem">
                </div>
                
                <div class="column">
                  <div class="form-group form-half">
                    <label>Exibição da imagem</label>
                    <select v-model="img.page" @change="updateLocations(img)">
                        <option value="" disabled>Selecione o destino da imagem</option>  
                        <option v-for="option in pageOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                        </option>
                    </select>
                  </div>
  
                  <div class="form-group form-half">
                    <label>Localização da imagem</label>
                    <select v-model="img.location">
                        <option value="" disabled>Selecione a localização da imagem</option>  
                        <option v-for="loc in updateLocations(img.page)" :key="loc" :value="loc">
                        {{ loc }}
                        </option>
                    </select>
                  </div>
                </div>

              <div v-if="img.page === 'home' && img.location.toLowerCase() === 'hero'" class="hero-special-fields">

                  <div class="column">  
                    <div class="form-group form-half">
                      <label>Ordem Hero</label>
                      <input type="number" v-model.number="img.order" min="0">
                    </div>
                    
                    <div class="form-group form-half">
                      <label>Alinhamento do Texto</label>
                      <select v-model="img.textPosition">
                        <option value="left">Esquerda</option>
                        <option value="center">Centralizado</option>
                        <option value="right">Direita</option>
                      </select>
                    </div>
                  </div>


                  <div class="column">
                    <div class="form-group form-half">
                      <label>Título Hero (PT)</label>
                      <input type="text" v-model="img.heroTitle.pt" placeholder="Título em Português">
                    </div>
                    <div class="form-group form-half">
                      <label>Título Hero (EN)</label>
                      <input type="text" v-model="img.heroTitle.en" placeholder="Título em Inglês">
                    </div>

                  </div>
                  <div class="column">
                    <div class="form-group form-half">
                      <label>Descrição Hero (PT)</label>
                      <textarea v-model="img.heroDesc.pt" placeholder="Descrição em Português"></textarea>
                    </div>
                    <div class="form-group form-half">
                      <label>Descrição Hero (EN)</label>
                      <textarea v-model="img.heroDesc.en" placeholder="Descrição em Inglês"></textarea>
                    </div>
                  </div>

                  <div class="column">
                    <div class="form-group form-half">
                      <label>Texto do Botão (PT)</label>
                      <input type="text" v-model="img.buttonLabel.pt" placeholder="Ex: Saiba Mais">
                    </div>
                    <div class="form-group form-half">
                      <label>Texto do Botão (EN)</label>
                      <input type="text" v-model="img.buttonLabel.en" placeholder="Ex: Learn more">
                    </div>
                    <div class="form-group form-half">
                      <label>Link do Botão</label>
                      <input type="text" v-model="img.buttonLink" placeholder="https://...">
                    </div>
                  </div>

              </div>

                
                <!-- <div class="form-group">
                  <label>Dispositivos</label>
                  <div class="device-toggle">
                    <label :class="['device-option', { selected: img.desktop }]">
                      <input type="checkbox" v-model="img.desktop">
                      🖥️ Desktop
                    </label>
                    <label :class="['device-option', { selected: img.mobile }]">
                      <input type="checkbox" v-model="img.mobile">
                      📱 Mobile
                    </label>
                  </div>
                </div> -->
  
                <div class="form-group">
                  <label>Data de Expiração (opcional)</label>
                  <input 
                    type="date" 
                    v-model="img.expirationDate"
                    :min="minDate"
                  >
                </div>
  
                <div class="action-buttons">
                  <button class="btn-remove" @click="removeUploadedImage(index)">
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button class="upload-btn" style="width: 100%; margin-top: 2rem;" @click="saveAllImages()" :disabled="repo.isLoading.value">
            {{ repo.isLoading.value ? 'Salvando Arquivos...' : 'Salvar Imagem' }}
          </button>

          <div v-if="repo.isLoading.value" class="loading-overlay">
            <div class="spinner"></div>
            <p>Enviando para o Firebase...</p>
          </div>
        </div>
    </section>
    </div>

 
<!-- Toast Notification -->
<div class="toast-container">
  <transition-group name="slide">
    <div 
      v-for="t in toast.toasts" 
      :key="t.id" 
      :class="['toast', t.type]"
      @click="toast.remove(t.id)"
    >
      {{ t.message }}
    </div>
  </transition-group>
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.column{
  display: flex;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
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

.hero-special-fields{
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-half {
  flex: 1;
} 

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input, .form-group textarea {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group input:focus, .form-group textarea:focus {
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
.toast-container {
 position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 999999; /* Aumentado para garantir que fique sobre o overlay */
  pointer-events: none; /* Não bloqueia cliques na tela */
}

.toast {
  pointer-events: auto;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  min-width: 250px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  font-weight: 500;
  /* Animação suave para quando outros toasts subirem */
  transition: all 0.3s ease; 
}

.toast.success { background-color: #2ecc71; }
.toast.error   { background-color: #e74c3c; }
.toast.warning { background-color: #f1c40f; color: #333; }
.toast.info    { background-color: #3498db; }

.slide-move,
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  transform: translateX(120%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(120%);
  opacity: 0;
}

.slide-leave-active {
  position: absolute; /* Importante para o slide-move funcionar nos outros itens */
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


/* Feedback de Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  backdrop-filter: blur(4px);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estilo para botão desabilitado */
.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}



.previews-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.img-wrapper, .mobile-preview-box {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  border: 1px solid #222;
}

.img-wrapper { height: 160px; }
.mobile-preview-box { 
  height: 120px; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #333;
}
.mobile-preview-box:hover { border-color: #555; }
.mobile-preview-box.hasImage { border: none; }

.img-wrapper img, .mobile-preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-text {
  font-size: 0.8rem;
  color: #555;
  text-align: center;
}

.file-name { font-size: 0.75rem; color: #666; word-break: break-all; }
</style>