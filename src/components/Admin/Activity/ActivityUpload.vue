<script setup>
import { reactive, onMounted } from 'vue';
import { useActivityRepository } from '@/composables/useActivityRepository';

const props = defineProps(['editData']);
const emit = defineEmits(['saved']);
const { saveActivity, isLoading } = useActivityRepository();

const form = reactive({
  id: null,
  title: { pt: '', en: '' },
  day: { pt: '', en: '' },
  description: { pt: '', en: '' },
  preview: null,
  url: ''
});

const clearForm = () => {
  Object.assign(form, {
    id: null,
    title: { pt: '', en: '' },
    day: { pt: '', en: '' },
    description: { pt: '', en: '' },
    preview: null,
    url: ''
  });
};

onMounted(() => {
  if (props.editData) {
    Object.assign(form, JSON.parse(JSON.stringify(props.editData)));
    form.preview = props.editData.url;
  }
});

const handleFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (f) => { form.preview = f.target.result; };
  reader.readAsDataURL(file);
};

const handleFileSelect = (e) => processFile(e.target.files[0]);
    const handleDrop = (e) => {
    isDragOver.value = false;
    processFile(e.dataTransfer.files[0]);
};

const processFile = (file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.preview = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleSave = async () => {
  await saveActivity({ ...form, newImagePreview: form.preview });
  emit('saved');
};
</script>

<template>
  <div class="config-section active">
    <div class="image-config-item">
      <div class="previews-column">
        <div class="img-wrapper">
          <div class="upload-card" v-if="!form.preview">
                <div 
                class="upload-area" 
                :class="{ dragover: isDragOver }"
                @dragenter.prevent="isDragOver = true"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleDrop"
                @click="$refs.fileInput.click()"
                >
                <div class="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
                        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
                        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                    </svg>
                    <h3>Arraste a foto do integrante aqui</h3>
                    <p style="color: rgba(255, 255, 255, 0.6)">ou</p>
                </div>
            </div>
        </div>
        <div v-else class="config-preview">
            <img :src="form.preview" alt="Preview">
        </div>
    </div>
    <button class="upload-btn">Selecionar Foto</button>
    <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        style="display: none"
        @change="handleFileSelect"
    >
    <p style="color: rgba(255, 255, 255, 0.5); margin-top: 1rem; font-size: 0.9rem;">
        A foto será salva em: /team/
    </p>
        
      </div>

      <div class="config-form">
        <div class="column">
          <div class="form-group form-half">
            <label>Título (PT)</label>
            <input v-model="form.title.pt" placeholder="Ex: Encontro de Jovens">
          </div>
          <div class="form-group form-half">
            <label>Título (EN)</label>
            <input v-model="form.title.en" placeholder="Ex: Youth Gathering">
          </div>
        </div>

        <div class="column">
          <div class="form-group form-half">
            <label>Dia/Horário (PT)</label>
            <input v-model="form.day.pt" placeholder="Ex: Sábado - 7:00 PM">
          </div>
          <div class="form-group form-half">
            <label>Dia/Horário (EN)</label>
            <input v-model="form.day.en" placeholder="Ex: Saturday - 7:00 PM">
          </div>
        </div>

        <div class="form-group">
          <label>Descrição (PT)</label>
          <textarea v-model="form.description.pt"></textarea>
        </div>
        <div class="form-group">
          <label>Descrição (EN)</label>
          <textarea v-model="form.description.en"></textarea>
        </div>

        <button @click="handleSave" class="upload-btn" :disabled="isLoading">
         {{ isLoading ? 'Processando...' : (props.editData ? 'Atualizar Atividade' : 'Salvar Atividade') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Salvando dados no Firebase...</p>
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
  height: 100%;
  width: 100%;
}

.upload-area {
  border: 3px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
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
  font-size: 1rem;
  /* margin-bottom: 1rem; */
  opacity: 0.6;
}

.upload-area h3 {
  font-size: 1.0rem;
  /* margin-bottom: 1rem; */
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
  gap: .5rem;
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
  object-fit: contain;
  object-position: top;
}

.placeholder-text {
  font-size: 0.8rem;
  color: #555;
  text-align: center;
}

.file-name { font-size: 0.75rem; color: #666; word-break: break-all; }
textarea {
  resize: vertical;
  min-height: 100px;
}
</style>