<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { getStorage, ref as storageRef, getDownloadURL, deleteObject } from "firebase/storage"
import CustomSelect from '../Forms/CustomSelect.vue'
import UploadImagesPanel from './UploadImagesPanel.vue'
import Modal from '../Tools/Modal.vue'

const db = getFirestore()
const storage = getStorage()


// Estado
const savedImages = ref([])
const showDeleteModal = ref(false);
const imageToDelete = ref(null);
const isDeleting = ref(false);
const isLoading = ref(false)


//novo
const showEditModal = ref(false);
const editingImage = ref(null);
const isSaving = ref(false);

const filters = ref({
  page: 'all',
  device: 'all',
  status: 'all'
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Opções de filtros
const pageOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'Sobre' },
  { value: 'activities', label: 'Atividades' },
  {value: 'logo', label: 'Logo' }
]

const locationOptions = {
  home: ["Hero", "About", "App", "Scheadle"],
  about: ["Aboutchurch", "Aboutpastors"],
  logo: ["Logo"],
  activities: [] // será carregado do Firestore
};

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

const confirmDelete = (img) => {
  imageToDelete.value = img;
  showDeleteModal.value = true;
};

// Fecha o modal e limpa o estado
const closeModal = () => {
  showDeleteModal.value = false;
  imageToDelete.value = null;
  isDeleting.value = false;
};

const executeDelete = async () => {
  if (!imageToDelete.value) return;
  
  const img = imageToDelete.value;
  isDeleting.value = true;

  try {
    // 1. Referência do documento
    let docRef;
    if (img.page === "activities") {
      docRef = doc(db, "activities", img.activityId, "images", img.id);
    } else {
      docRef = doc(db, "images", img.id);
    }

    
    await deleteDoc(docRef);
    const fileRef = storageRef(storage, `images/${img.name}`);
    await deleteObject(fileRef);

    
    localStorage.removeItem('church_hero_cache'); 

    await loadAllImages();
    
    showToast('Imagem excluída com sucesso!');
    closeModal();
  } catch (error) {
    console.error("Erro ao deletar:", error);
    showToast('Erro ao excluir. Verifique se o arquivo existe no storage.', 'error');
    isDeleting.value = false;
  }
};

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

    // 1. Filtro por página
    if (filterPage !== 'all' && page !== filterPage) return false

    // 2. Filtro por dispositivo (Lógica solicitada)
    if (filterDevice !== 'all') {
      // Só bloqueia se: o formato da imagem NÃO for 'all' E NÃO for igual ao filtro
      if (format !== 'all' && format !== filterDevice) {
        return false
      }
    }

    // 3. Filtro por status
    const expired = isExpired(img)
    if (filterStatus === 'active' && expired) return false
    if (filterStatus === 'expired' && !expired) return false

    return true
  })
})

//edit images
const editImage = (img) => {
 
  editingImage.value = { 
    ...img,
    // Mapeia o 'format' do banco para os checkboxes do modal
    desktop: img.format === 'desktop' || img.format === 'all',
    mobile: img.format === 'mobile' || img.format === 'all',
    availableLocations: locationOptions[img.page] || []
  };
  showEditModal.value = true;
};

// Atualiza as opções de localização se mudar a página no modal
const updateEditLocations = (img) => {
  img.availableLocations = locationOptions[img.page] || [];
  img.location = ""; // Reseta a localização para obrigar nova escolha
};

async function saveUpdate() {
  if (!editingImage.value) return;
  isSaving.value = true;
  
  try {
    const img = editingImage.value;
    
    // 1. Tratamento do Formato (all, desktop, mobile)
    let finalFormat = 'all';
    if (img.desktop && !img.mobile) finalFormat = 'desktop';
    else if (!img.desktop && img.mobile) finalFormat = 'mobile';

    // 2. Preparação do objeto de dados (limpo)
    const updateData = {
      alt: img.description || img.alt || "", // Garante que pegamos o campo preenchido
      page: img.page,
      location: img.location,
      format: finalFormat,
      // Se houver expirationDate (do input date), salva. Caso contrário, mantém o que existia.
      expired_at: img.expirationDate || img.expired_at || null 
    };

    // 3. Definição da Referência do Documento
    let docRef;
    if (img.page === "activities") {
      // Importante: usamos img.activityId que salvamos no loadAllImages
      if (!img.activityId) {
         throw new Error("activityId não encontrado para esta imagem de atividades.");
      }
      docRef = doc(db, "activities", img.activityId, "images", img.id);
    } else {
      docRef = doc(db, "images", img.id);
    }

    console.log("Tentando atualizar documento:", docRef.path);

    // 4. Execução da atualização
    await updateDoc(docRef, updateData);
    
    showToast("Dados atualizados com sucesso!");
    showEditModal.value = false;
    
    // 5. Atualização local para evitar recarregamento pesado se possível
    // Ou simplesmente recarrega tudo:
    await loadAllImages(); 
    
  } catch (error) {
    console.error("Erro detalhado ao atualizar:", error);
    showToast(`Erro ao atualizar: ${error.message}`, "error");
  } finally {
    isSaving.value = false;
  }
}


async function loadAllImages() {
  isLoading.value = true // Inicia o loading
  const allImages = []

  try {
    // 1. Coleção principal "images"
    const imagesSnapshot = await getDocs(collection(db, "images"))
    for (const docSnap of imagesSnapshot.docs) {
      const data = docSnap.data()
      let url = null
      try {
        const fileRef = storageRef(storage, `images/${data.name}`)
        url = await getDownloadURL(fileRef)
      } catch (error) {
        url = "/img/error.png"
      }
      allImages.push({
        id: docSnap.id,
        preview: url,
        ...data,
        expirationDate: data.expired_at || "" // Garante compatibilidade com input date
      })
    }

    // 2. Subcoleções "activities"
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
          url = "/img/error.png"
        }
        allImages.push({
          id: imgDoc.id,
          preview: url,
          ...data,
          activityId: activityDoc.id,
          expirationDate: data.expired_at || ""
        })
      }
    }
    savedImages.value = allImages
  } catch (error) {
    console.error("Erro ao carregar imagens:", error)
    showToast("Erro ao carregar a galeria", "error")
  } finally {
    isLoading.value = false // Finaliza o loading independente de erro ou sucesso
  }
}

const deleteImage = async (img) => {
  if (!confirm(`Tem certeza que deseja excluir a imagem "${img.name}"?`)) return;

  try {
    
    let docRef;
    if (img.page === "activities") {
    
      docRef = doc(db, "activities", img.location, "images", img.id);
    } else {
    
      docRef = doc(db, "images", img.id);
    }

    
    await deleteDoc(docRef);

    
    const fileRef = storageRef(storage, `images/${img.name}`);
    await deleteObject(fileRef);

    // 4. Atualizar a UI e Cache Local
    savedImages.value = savedImages.value.filter(i => i.id !== img.id);
    localStorage.setItem('churchImages', JSON.stringify(savedImages.value));

    showToast('Imagem removida do banco e do storage com sucesso!');
  } catch (error) {
    console.error("Erro ao deletar:", error);
    showToast('Erro ao excluir imagem. Verifique o console.', 'error');
  } finally {
    closeModal();
  } 
};

const handleEditSuccess = async () => {
  showEditModal.value = false;
  editingImage.value = null;
  await loadAllImages(); // Recarrega a galeria
};

const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Lifecycle
onMounted(async () => {
  await loadAllImages()
})

</script>

<template>
    <!-- <div class="modal" v-if="showEditModal">
        <div class="modal-content edit-modal">
            <div class="header-modal">
              <h3>Editar Informações</h3>
              <button class="modal-close" @click="showEditModal = false">✖</button>
            </div>
            <div class="modal-container">
              <UploadImagesPanel 
                :edit-data="editingImage" 
                @close="showEditModal = false"
                @success="handleEditSuccess"
              />
            </div>
            
        </div>
    </div> -->
    <Modal v-model="showEditModal" title="Editar Imagem">
      <UploadImagesPanel 
        :edit-data="editingImage" 
        @close="showEditModal = false"
        @success="handleEditSuccess"
      />
    </Modal>

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

        <div v-if="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Buscando imagens na nuvem...</p>
        </div>

        <div v-else-if="filteredImages.length > 0" class="gallery-grid">
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
                    <strong>Descrição:</strong> {{ capitalizeFirst(img.alt) }}
                </div>
                <div class="gallery-details">
                    <strong>Página:</strong> {{ capitalizeFirst(img.page) }}
                </div>
                 <div class="gallery-details">
                    <strong>Location:</strong> {{ capitalizeFirst(img.location) }}
                </div>
                <div v-if="img.expirationDate" class="gallery-details">
                    <strong>Expira em:</strong> {{ formatDate(img.expirationDate) }}
                </div>
                <div class="gallery-details" style="font-size: 0.8rem; margin-top: 0.5rem;">
                    Enviada em: {{ formatDate(img.created_at) }}
                </div>
                <div class="gallery-actions">
                    <button class="btn-edit" @click="editImage(img)">Editar</button>
                    <button class="btn-delete" @click="confirmDelete(img)">Excluir</button>
                </div>
            </div>
            </div>
            <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                <div class="modal-header">
                    <span class="warning-icon">⚠️</span>
                    <h3>Confirmar Exclusão</h3>
                </div>
                
                <div class="modal-body">
                    <p>Você tem certeza que deseja excluir <strong>{{ imageToDelete?.name }}</strong>?</p>
                    <p class="warning-text">Esta ação removerá o arquivo permanentemente do banco de dados e do servidor.</p>
                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" @click="closeModal" :disabled="isDeleting">Cancelar</button>
                    <button class="btn-confirm-delete" @click="executeDelete" :disabled="isDeleting">
                    <span v-if="isDeleting">Excluindo...</span>
                    <span v-else>Sim, excluir agora</span>
                    </button>
                </div>
                </div>
            </div>
            </Teleport>
        </div>

        <div v-else class="empty-state">
            <div class="icon">🖼️</div>
            <h3>Nenhuma imagem encontrada</h3>
            <p>Faça upload de imagens para começar</p>
        </div>
    </div>
     <transition name="slide">
      <div v-if="toast.show" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
    </transition>
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
  margin-bottom: 1rem;
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
  z-index: 9999;
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
  width: 90%;
  max-width: 1200px;
  text-align: center;
  color: #fff;
  max-height: 95vh;
}

.modal-container {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
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
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.control-btn:hover {
  background: #555;
}

.control-btn:active {
  transform: scale(0.95);
}


/* novo modal */
/* Overlay para escurecer o fundo */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px); /* Ar profissional */
}

/* Caixa do Modal */
.modal-content {
  background: var(--color-background-mute);
  padding: 2rem;
  border-radius: 12px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(41, 41, 41, 0.1);
}

.modal-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;
}

.warning-icon { font-size: 1.5rem; }

.warning-text {
  color: #ef4444; font-size: 0.85rem; margin-top: 10px; font-style: italic;
}

.modal-footer {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 2rem;
}

/* Botões do Modal */
.btn-cancel {
  background: #f3f4f6; color: #374151; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer;
}

.btn-confirm-delete {
  background: #ef4444; color: white; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer;
  transition: background 0.2s;
}

.btn-confirm-delete:hover { background: #dc2626; }
.btn-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }

.edit-modal {
  max-width: 1200px;
  width: 90%;
}

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.filename {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #888;
  word-break: break-all;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-save {
  background-color: var(--cor-azul-medio);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background: transparent;
  color: #ccc;
  border: 1px solid #444;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
}

.config-form-modal {
  display: grid;
  gap: .5rem;
}


@media (max-width: 600px) {
  .edit-grid {
    grid-template-columns: 1fr;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--cor-azul-claro);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--cor-azul-medio);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Garante que o grid não "pule" ao carregar */
.gallery-grid {
  min-height: 400px;
}
</style>