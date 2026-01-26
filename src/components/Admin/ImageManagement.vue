<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ManagementGaleryImages from './ManagementGaleryImages.vue'

const storage = getStorage();
const db = getFirestore();

const metadata_type = {
  cacheControl: 'public,max-age=31536000',
  contentType: 'image/webp'
};

function dataURLtoBlob(dataURL) {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// State
const activeTab = ref('upload')
const isDragOver = ref(false)
const uploadedImages = ref([])
const savedImages = ref([])
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

// Refs
const fileInput = ref(null)
//novo
const canvasEditor = ref(null)
const selectedImage = ref(null)
const showEditModal = ref(false)
const selectedType = ref('desktop')

const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
let imgObj = null
let isDragging = false
let lastX = 0
let lastY = 0
const moveStep = 5
const uploadedSection = ref(null)


const auth = getAuth();
const currentUser = ref(null);

onAuthStateChanged(auth, (user) => {
    if (user) {
    currentUser.value = user; 
    } else {
    currentUser.value = null; 
    }
});

const locationOptions = {
  home: ["Hero", "About", "App", "Scheadle"],
  about: ["Aboutchurch", "Aboutpastors"],
  logo: ["Logo"],
  activities: [] // será carregado do Firestore
};



const pageOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'home', label: 'Home' },
    { value: 'about', label: 'Sobre' },
    { value: 'activities', label: 'Atividades' },
    // { value: 'scheadle', label: 'Agenda' },
    // { value: 'content', label: 'Conteúdo' },
    {value: 'logo', label: 'Logo' }
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


// Computed
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const filteredImages = computed(() => {
  return savedImages.value.filter(img => {
    if (filters.value.page !== 'all' && img.page !== filters.value.page) return false
    if (filters.value.device === 'desktop' && !img.desktop) return false
    if (filters.value.device === 'mobile' && !img.mobile) return false
    
    const expired = isExpired(img)
    if (filters.value.status === 'active' && expired) return false
    if (filters.value.status === 'expired' && !expired) return false
    
    return true
  })
})

// Methods
async function loadActivities() {
  const querySnapshot = await getDocs(collection(db, "activities"));
  locationOptions.activities = querySnapshot.docs.map(doc => doc.id); 
  // ou doc.data().nome se você tiver um campo "nome"
}

function updateLocations(img) {
  if (img.page === "activities") {
    img.availableLocations = locationOptions.activities;
  } else {
    img.availableLocations = locationOptions[img.page] || [];
  }
}


const handleDrop = (e) => {
  isDragOver.value = false
  const files = e.dataTransfer.files
  handleFiles(files)
}

const getCanvasSizeByType = (type) => {
  if (type === 'desktop') return { width: 800, height: 450 }
  if (type === 'mobile') return { width: 360, height: 640 }
  
  // Se for original, retornamos as dimensões nativas do objeto da imagem
  if (type === 'original' && imgObj) {
    return { width: imgObj.naturalWidth, height: imgObj.naturalHeight }
  }
  return { width: 800, height: 450 } // fallback
}


const handleFileSelect = (e) => {
  const files = e.target.files
  handleFiles(files)
}


const handleFiles = (files) => {
  const validFiles = [...files].filter(file => {
    if (!file.type.startsWith('image/')) {
      showToast(`${file.name} não é uma imagem válida`, 'error')
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast(`${file.name} excede 10MB`, 'error')
      return false
    }
    return true
  })

  if (validFiles.length > 0) {
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Em vez de salvar direto, abre o modal de edição
        selectedImage.value = {
          file,
          preview: e.target.result,
          name: file.name
        }
        // setType('desktop');
        showEditModal.value = true;
        nextTick(() => {
          setType('desktop')
        })
      }
      reader.readAsDataURL(file)
    })
  }
}


const removeUploadedImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

async function saveAllImages() {
  if (!currentUser.value) {
    showToast("Você precisa estar autenticado para salvar imagens", "error");
    return;
  }

  if (uploadedImages.value.length === 0) {
    showToast("Nenhuma imagem para salvar", "error");
    return;
  }

    for (const img of uploadedImages.value) {
        try {
            if (!img.page || !img.location) {
            showToast("Preencha página e localização antes de salvar", "error");
            continue;
            }

            const isHomeHero = img.page === 'home' && img.location === 'hero';

            const hash = Math.random().toString(36).substring(2, 7);
            const blob = dataURLtoBlob(img.preview);
            const dataAtual = new Date().toISOString().split("T")[0];
        //   const nameCreated = `${img.page}_${img.location}_${dataAtual}_${hash}.jpg`;
            const nameCreated = `${img.page}_${img.location}_${dataAtual}_${hash}.webp`;
            let finalFormat = 'all'; // Default caso ambos estejam marcados ou nenhum esteja
            
            if (img.desktop && !img.mobile) {
            finalFormat = 'desktop';
            } else if (!img.desktop && img.mobile) {
            finalFormat = 'mobile';
            } else if (img.desktop && img.mobile) {
            finalFormat = 'all';
            }

            if (!isHomeHero) {
                try {
                    const qDesativar = query(
                    collection(db, img.page === "activities" ? `activities/${img.location}/images` : "images"),
                    where("page", "==", img.page),
                    where("location", "==", img.location),
                    where("status", "==", "active")
                    );

                    const snapshotAtivos = await getDocs(qDesativar);
                    
                    // Para cada imagem ativa encontrada, mudamos para inactive
                    const promises = snapshotAtivos.docs.map(docSnap => {
                    return updateDoc(docSnap.ref, { status: 'inactive' });
                    });
                    
                    await Promise.all(promises);
                    console.log(`Imagens anteriores em ${img.location} desativadas.`);
                } catch (err) {
                    console.error("Erro ao desativar imagens anteriores:", err);
                }
            }   

            const fileRef = storageRef(storage, `images/${nameCreated}`);
            await uploadBytes(fileRef, blob, metadata_type);

            const metadata = {
            name: nameCreated,
            page: img.page,
            location: img.location.toLowerCase(),
            format: finalFormat,
            alt: img.description || "",
            path: `gs://church-lifeandspirit.firebasestorage.app/images/${nameCreated}`,
            created_at: new Date().toISOString(),
            expired_at: img.expirationDate || null,
            status: "active",
            userId: currentUser.value.uid // opcional: vincular ao usuário
            };

            if (img.page === "activities") {
            const activityRef = doc(db, "activities", img.location);
            await addDoc(collection(activityRef, "images"), metadata);
            } else {
            await addDoc(collection(db, "images"), metadata);
            }

            showToast(`Imagem ${nameCreated} salva com sucesso!`, "success");
        } catch (error) {
            console.log("Erro ao salvar imagem:", error);
            showToast(`Erro ao salvar ${img.name}, erro ${error.message}`, "error");
        }
    }

    uploadedImages.value = [];
    if (fileInput.value) fileInput.value.value = "";
    activeTab.value = "gallery";
};

const deleteImage = (id) => {
  if (confirm('Tem certeza que deseja excluir esta imagem?')) {
    savedImages.value = savedImages.value.filter(img => img.id !== id)
    localStorage.setItem('churchImages', JSON.stringify(savedImages.value))
    showToast('Imagem excluída com sucesso!')
  }
}

const editImage = (img) => {
  showToast('Funcionalidade de edição em desenvolvimento', 'info')
}

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

//novo

const setType = (type) => {
  selectedType.value = type
  const canvas = canvasEditor.value
  
  // Garantimos que a imagem está carregada para pegar as dimensões
  imgObj = new Image()
  imgObj.src = selectedImage.value.preview

  imgObj.onload = () => {
    const { width, height } = getCanvasSizeByType(type)

    // Lógica visual: não deixa o canvas maior que a tela do usuário
    const maxHeight = window.innerHeight * 0.7
    const maxWidth = window.innerWidth * 0.8
    const scaleView = Math.min(maxWidth / width, maxHeight / height, 1)

    canvas.width = width * scaleView
    canvas.height = height * scaleView

    // Se for original, centralizamos e resetamos o zoom
    if (type === 'original') {
      scale.value = scaleView
      offsetX.value = 0
      offsetY.value = 0
    } else {
      // Para desktop/mobile, fazemos o "cover" (preencher tudo)
      scale.value = Math.max(canvas.width / imgObj.width, canvas.height / imgObj.height)
      offsetX.value = (canvas.width - imgObj.width * scale.value) / 2
      offsetY.value = (canvas.height - imgObj.height * scale.value) / 2
    }

    draw()
  }
}


const draw = () => {
  const canvas = canvasEditor.value
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(
    imgObj,
    offsetX.value,
    offsetY.value,
    imgObj.width * scale.value,
    imgObj.height * scale.value
  )
}

const onWheel = (e) => {
  e.preventDefault()

  const zoom = e.deltaY < 0 ? 1.1 : 0.9
  scale.value *= zoom

  draw()
}


const startDrag = (e) => {
  isDragging = true
  lastX = e.offsetX
  lastY = e.offsetY
}

const drag = (e) => {
  if (!isDragging) return

  offsetX.value += e.offsetX - lastX
  offsetY.value += e.offsetY - lastY

  lastX = e.offsetX
  lastY = e.offsetY

  draw()
}

const endDrag = () => {
  isDragging = false
}


const saveEditedImage = async () => {
  const displayCanvas = canvasEditor.value
  
  // Criamos um canvas oculto para renderizar na resolução REAL (sem o scaleView da tela)
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  
  const targetSize = getCanvasSizeByType(selectedType.value)
  tempCanvas.width = targetSize.width
  tempCanvas.height = targetSize.height

  // Calculamos a proporção entre o que o usuário vê e a realidade
  const ratio = targetSize.width / displayCanvas.width

  // Desenha no canvas de alta resolução
  tempCtx.drawImage(
    imgObj,
    offsetX.value * ratio,
    offsetY.value * ratio,
    (imgObj.width * scale.value) * ratio,
    (imgObj.height * scale.value) * ratio
  )

  const editedPreview = tempCanvas.toDataURL('image/webp', 0.8)
  
  uploadedImages.value.push({
    id: Date.now(),
    preview: editedPreview,
    page: '',
    name: selectedImage.value.name.replace(/\.[^/.]+$/, "") + ".webp",
    // Se for original, ele habilita ambos por padrão ou você escolhe um
    desktop: selectedType.value === 'desktop' || selectedType.value === 'original',
    mobile: selectedType.value === 'mobile' || selectedType.value === 'original',
    availableLocations: []
  })

  showEditModal.value = false
  await nextTick()
  document.getElementById('edit-image-section')?.scrollIntoView({ behavior: 'smooth' })
}



const zoomIn = () => {
  scale.value *= 1.1
  draw()
}

const zoomOut = () => {
  scale.value *= 0.9
  draw()
}

const moveUp = () => {
  offsetY.value += moveStep
  draw()
}

const moveDown = () => {
  offsetY.value -= moveStep
  draw()
}

const moveLeft = () => {
  offsetX.value += moveStep
  draw()
}

const moveRight = () => {
  offsetX.value -= moveStep
  draw()
}



// Lifecycle
onMounted(() => {
  const stored = localStorage.getItem('churchImages')
  if (stored) {
    savedImages.value = JSON.parse(stored)
  }
})
</script>

<template>
  <div class="container">

<div class="modal" v-if="showEditModal">
  <div class="modal-content">
    <button class="modal-close" @click="showEditModal = false">✖</button>

    <!-- Área da imagem + botões -->
    <div class="image-area">
      <div class="canvas-container">
        <div class="canvas-wrapper">
            <canvas
            ref="canvasEditor"
            @mousedown="startDrag"
            @mousemove="drag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @wheel="onWheel"
            />
        </div>
        </div>


      <div class="image-actions">
        <div class="editor-controls">
            <!-- Zoom -->
            <div class="control-group">
                <button class="control-btn" @click="zoomIn">+</button>
                <button class="control-btn" @click="zoomOut">−</button>
            </div>

            <!-- Movimento -->
            <div class="control-group">
                <button class="control-btn" @click="moveUp">↑</button>
                <button class="control-btn" @click="moveLeft">←</button>
                <button class="control-btn" @click="moveRight">→</button>
                <button class="control-btn" @click="moveDown">↓</button>
            </div>
            </div>

       <div class="type-selector">
            <button 
                :class="{ active: selectedType === 'desktop' }" 
                @click="setType('desktop')"
            >Desktop (16:9)</button>
            
            <button 
                :class="{ active: selectedType === 'mobile' }" 
                @click="setType('mobile')"
            >Mobile (9:16)</button>
            
            <button 
                :class="{ active: selectedType === 'original' }" 
                @click="setType('original')"
            >Tamanho Original</button>
        </div>

        <button class="btn-save-edit" @click="saveEditedImage">Confirmar Edição</button>
      </div>
    </div>
  </div>
</div>


    <div class="header">
      <h1>Gerenciamento de Imagens</h1>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="['tab', { active: activeTab === 'upload' }]" 
        @click="activeTab = 'upload'"
      >
        📤 Upload
      </button>
      <button 
        :class="['tab', { active: activeTab === 'gallery' }]" 
        @click="activeTab = 'gallery'"
      >
        🖼️ Galeria
      </button>
    </div>

    <!-- Upload Tab -->
    <div v-show="activeTab === 'upload'" class="tab-content active">
    <section id="upload-section">
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
              <div>
                <div class="config-preview">
                  <img :src="img.preview" :alt="img.name">
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">
                  {{ img.name }}
                </p>
              </div>
              
              
              <div class="config-form">
                <div class="form-group">      
                    <label>Descrição</label>
                    <input type="text" v-model="img.description" placeholder="Descrição da imagem">
                </div>
              <div class="form-group">
                <label>Exibição da imagem</label>
                <select v-model="img.page" @change="updateLocations(img)">
                    <option value="" disabled>Selecione o destino da imagem</option>  
                    <option v-for="option in pageOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                    </option>
                    <!-- <option value="home">Home</option>
                    <option value="about">Sobre</option>
                    <option value="activities">Atividades</option> -->
                </select>
              </div>

              <div class="form-group">
                <label>Localização da imagem</label>
                <select v-model="img.location">
                    <option value="" disabled>Selecione a localização da imagem</option>  
                    <option v-for="loc in img.availableLocations" :key="loc" :value="loc">
                    {{ loc }}
                    </option>
                </select>
              </div>

                
                <div class="form-group">
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
                </div>
  
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
          <button class="upload-btn" style="width: 100%; margin-top: 2rem;" @click="saveAllImages">
            Salvar Todas as Imagens
          </button>
        </div>
    </section>
    </div>

    <!-- Gallery Tab -->
    <div v-show="activeTab === 'gallery'" class="tab-content active">
      <ManagementGaleryImages />
    </div>

    <!-- Toast Notification -->
    <transition name="slide">
      <div v-if="toast.show" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
    </transition>
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

.type-selector button.active {
  background-color: var(--cor-azul-medio);
  color: white;
  border-color: transparent;
}

.type-selector{
    display: flex;
    flex-direction: row;
    gap: .5rem;
}

</style>