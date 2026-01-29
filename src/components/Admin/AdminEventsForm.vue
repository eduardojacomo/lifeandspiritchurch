<script setup>
import { ref, watch, onMounted } from 'vue'
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ImageEditor from '@/components/ImageEditor.vue'

const db = getFirestore()
const storage = getStorage()

// Estados
const isSaving = ref(false)
// const imageFile = ref(null)
// const imagePreview = ref(null)
const speakerFiles = ref([])
const showImageEditor = ref(false)
const editorImageSrc = ref(null)
const editorType = ref('custom')





const bannerDesktop = ref({ blob: null, preview: null })
const bannerMobile = ref({ blob: null, preview: null })

const metadata_type = {
  cacheControl: 'public,max-age=31536000',
  contentType: 'image/webp'
};

const auth = getAuth();
const currentUser = ref(null);

onAuthStateChanged(auth, (user) => {
    if (user) {
    currentUser.value = user; 
    } else {
    currentUser.value = null; 
    }
});

const props = defineProps({
  initialData: { type: Object, default: null }
})

const emit = defineEmits(['saved', 'cancel'])

const eventForm = ref({
  title: { pt: '', en: '' },
  description: { pt: '', en: '' },
  dateStart: '',
  dateEnd: '',
  category: '',
  address: { label: '', street: '', city: '', mapUrl: '' },
  schedules: [],
  // Novos Campos
  hasRegistration: false,
  registration: { value: 0, link: '' },
  hasSpeakers: false,
  speakers: [] 
})

const categories = [
  { value: '', label: 'Selecione uma categoria' },
  { value: 'conferencia', label: 'Conferência' },
  { value: 'festa', label: 'Festa' },
  { value: 'batismo', label: 'Batismo' },
  { value: 'encontro', label: 'Encontro' },
  { value: 'culto', label: 'Culto Especial' }
]

const editorContext = ref({
  target: null,       // banner-desktop | banner-mobile | speaker
  speakerIndex: null
})

const openEditor = (file, type, context = {}) => {
  editorImageSrc.value = URL.createObjectURL(file)
  editorType.value = type
  editorContext.value = context
  showImageEditor.value = true
}

// --- Lógica de Preletores ---
const addSpeaker = () => {
  eventForm.value.speakers.push({ nome: '', funcao: '', imagem: '', preview: '' })
}

const removeSpeaker = (index) => {
  eventForm.value.speakers.splice(index, 1)
}

const handleSpeakerImage = (e, index) => {
  const file = e.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    eventForm.value.speakers[index].preview = event.target.result
    // Armazenamos o arquivo bruto para upload depois
    eventForm.value.speakers[index].rawFile = file 
  }
  reader.readAsDataURL(file)
}

const onEditorConfirm = ({ blob, preview }) => {
  const ctx = editorContext.value

  if (ctx.target === 'banner-desktop') {
    bannerDesktop.value = { blob, preview }
  }

  if (ctx.target === 'banner-mobile') {
    bannerMobile.value = { blob, preview }
  }

  if (ctx.target === 'speaker') {
    const speaker = eventForm.value.speakers[ctx.speakerIndex]
    speaker.preview = preview
    speaker.rawFile = blob
  }

  showImageEditor.value = false
}

const closeImageEditor = () => {
  showImageEditor.value = false
  editorImageSrc.value = null
  editorContext.value = { target: null, speakerIndex: null }
}

// --- Lógica de Upload Principal ---
async function uploadImage(file, path) {
  const fileRef = storageRef(storage, path)
  const metadata = { contentType: 'image/webp' }
  const snapshot = await uploadBytes(fileRef, file, metadata)
  return await getDownloadURL(snapshot.ref)
}

// Gerenciamento de Horários
const addSchedule = () => eventForm.value.schedules.push({ day: '', start: '', end: '' })
const removeSchedule = (index) => eventForm.value.schedules.splice(index, 1)

// if (props.initialData?.imageUrl) {
//   imagePreview.value = props.initialData.imageUrl
// }

const populateForm = () => {
  if (!props.initialData) return

  eventForm.value = JSON.parse(JSON.stringify(props.initialData))

  // Banner Desktop
  if (props.initialData.bannerDesktop) {
    bannerDesktop.value.preview = props.initialData.bannerDesktop
  }

  // Banner Mobile
  if (props.initialData.bannerMobile) {
    bannerMobile.value.preview = props.initialData.bannerMobile
  }
}



// Salvar Registro
async function saveEvent() {
  if (isSaving.value) return
  isSaving.value = true

  try {
    const eventId = props.initialData?.id || `event_${Date.now()}`

    // Upload banners
    if (bannerDesktop.value.blob) {
      eventForm.value.bannerDesktop = await uploadImage(
        bannerDesktop.value.blob,
        `events/${eventId}/banner_desktop.webp`
      )
    }

    if (bannerMobile.value.blob) {
      eventForm.value.bannerMobile = await uploadImage(
        bannerMobile.value.blob,
        `events/${eventId}/banner_mobile.webp`
      )
    }

    // Upload preletores
    for (let i = 0; i < eventForm.value.speakers.length; i++) {
      const speaker = eventForm.value.speakers[i]
      if (speaker.rawFile) {
        speaker.imagem = await uploadImage(
          speaker.rawFile,
          `events/${eventId}/speakers/speaker_${i}.webp`
        )
        delete speaker.rawFile
        delete speaker.preview
      }
    }

    const docData = {
      ...eventForm.value,
      updated_at: new Date().toISOString()
    }

    if (props.initialData?.id) {
      await updateDoc(doc(db, 'events', props.initialData.id), docData)
    } else {
      docData.status = 'active'
      docData.created_at = new Date().toISOString()
      await addDoc(collection(db, 'events'), docData)
    }

    // ✅ SUCESSO
    showToast('success', 'Evento salvo com sucesso 🎉')

    
    setTimeout(() => {
      resetForm()
      emit('saved')
    }, 3000)

  } catch (err) {
    console.error(err)


    showToast(
      'error',
      'Erro ao salvar o evento. Verifique os dados e tente novamente.'
    )
  } finally {
    isSaving.value = false
  }
}


// inicio toast
const toast = ref({
  show: false,
  type: 'success', // success | error
  message: ''
})

let toastTimeout = null

const showToast = (type, message, duration = 3000) => {
  toast.value = { show: true, type, message }

  if (toastTimeout) clearTimeout(toastTimeout)

  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, duration)
}
// fim toast

const resetForm = () => {
  eventForm.value = {
    title: { pt: '', en: '' },
    description: { pt: '', en: '' },
    dateStart: '',
    dateEnd: '',
    category: '',
    address: { label: '', street: '', city: '', mapUrl: '' },
    schedules: [],
    hasRegistration: false,
    registration: { value: 0, link: '' },
    hasSpeakers: false,
    speakers: []
  }

  bannerDesktop.value = { blob: null, preview: null }
  bannerMobile.value = { blob: null, preview: null }
}

watch(() => eventForm.value.hasSpeakers, (val) => {
  if (!val) eventForm.value.speakers = []
})


watch([() => eventForm.value.dateStart, () => eventForm.value.dateEnd], ([start, end]) => {
  if (start && end) {
    const startDate = new Date(start + 'T00:00:00');
    const endDate = new Date(end + 'T00:00:00');
    const days = [];

    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      
      // VERIFICAÇÃO: Se já existe esse dia no schedule (edição), mantém o que está lá
      const existingDay = eventForm.value.schedules.find(s => s.day === dateStr);
      
      if (existingDay) {
        days.push(existingDay);
      } else {
        days.push({
          day: dateStr,
          start: '19:00',
          end: '21:00'
        });
      }
      current.setDate(current.getDate() + 1);
    }
    eventForm.value.schedules = days;
  }
});

onMounted(populateForm)
</script>

<template>
  <div class="event-admin-container">
    <header class="section-header">
      <h2>📅 Gerenciar Agenda de Eventos</h2>
      <p>Cadastre novos eventos, conferências e reuniões especiais.</p>
    </header>

    <div class="event-grid">
      <div class="form-column">
        <section class="form-card">
          <h3>Informações Básicas</h3>
          
          <div class="dual-input">
            <div class="form-group">
              <label>Título (PT)</label>
              <input type="text" v-model="eventForm.title.pt" placeholder="Ex: Conferência de Mulheres">
            </div>
            <div class="form-group">
              <label>Título (EN)</label>
              <input type="text" v-model="eventForm.title.en" placeholder="Ex: Women's Conference">
            </div>
          </div>

          <div class="form-group">
            <label>Descrição (PT)</label>
            <textarea v-model="eventForm.description.pt" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Descrição (EN)</label>
            <textarea v-model="eventForm.description.en" rows="3"></textarea>
          </div>

          <div class="dual-input">
            <div class="form-group">
              <label>Data Início</label>
              <input type="date" v-model="eventForm.dateStart">
            </div>
            <div class="form-group">
              <label>Data Fim</label>
              <input type="date" v-model="eventForm.dateEnd">
            </div>
            <div class="form-group">
              <label>Categoria</label>
              <select v-model="eventForm.category">
                <option v-for="cat in categories" :key="cat.value" :value="cat.value" :disabled="cat.value === ''">
                  {{ cat.label }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <section class="form-card">
          <h3>Localização</h3>
          <div class="form-group">
            <label>Nome do Local</label>
            <input type="text" v-model="eventForm.address.label" placeholder="Ex: Auditório Principal">
          </div>
          <div class="dual-input">
            <input type="text" v-model="eventForm.address.street" placeholder="Endereço">
            <input type="text" v-model="eventForm.address.city" placeholder="Cidade">
          </div>
          <div class="form-group">
            <label>URL Google Maps</label>
            <input type="text" v-model="eventForm.address.mapUrl" placeholder="https://goo.gl/maps/...">
          </div>
        </section>
      </div>

      <div class="form-column">
        <section class="form-card image-upload-card">
          <h3>Imagem do Evento</h3>

          <div class="banner-grid">
            <!-- Desktop -->
            <div class="image-preview-container" @click="$refs.bannerDesktopInput.click()">
              <img v-if="bannerDesktop.preview" :src="bannerDesktop.preview">
              <div v-else class="upload-placeholder">Banner Desktop</div>
              <input
                type="file"
                hidden
                ref="bannerDesktopInput"
                accept="image/*"
                @change="e => openEditor(e.target.files[0], 'desktop', { target: 'banner-desktop' })"
              >
            </div>

            <!-- Mobile -->
            <div class="image-preview-container" @click="$refs.bannerMobileInput.click()">
              <img v-if="bannerMobile.preview" :src="bannerMobile.preview">
              <div v-else class="upload-placeholder">Banner Mobile</div>
              <input
                type="file"
                hidden
                ref="bannerMobileInput"
                accept="image/*"
                @change="e => openEditor(e.target.files[0], 'mobile', { target: 'banner-mobile' })"
              >
            </div>
          </div>
        </section>


        <section class="form-card">
          <div class="header-with-action">
            <h3>Horários</h3>
            <button class="btn-add" @click="addSchedule">+ Novo Dia</button>
          </div>
          
          <div v-for="(slot, index) in eventForm.schedules" :key="index" class="schedule-item">
            <input type="date" v-model="slot.day">
            <input type="time" v-model="slot.start">
            <input type="time" v-model="slot.end">
            <button class="btn-remove" @click="removeSchedule(index)" v-if="eventForm.schedules.length > 1">✕</button>
          </div>
        </section>

        <!-- novo -->
        <section class="form-card full-width-card">
          <div class="header-with-action">
            <div class="title-group">
              <h3>🎟️ Inscrição</h3>
              <p>Habilitar cobrança ou link de cadastro externo</p>
            </div>
            <label class="toggle-container">
              <input type="checkbox" v-model="eventForm.hasRegistration">
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <transition name="fade">
            <div v-if="eventForm.hasRegistration" class="registration-details">
              <div class="form-group">
                <label>Valor da Inscrição (R$)</label>
                <input type="number" v-model="eventForm.registration.value" placeholder="0.00">
              </div>
              <div class="form-group">
                <label>Link da Inscrição (URL)</label>
                <input type="text" v-model="eventForm.registration.link" placeholder="https://exemplo.com/inscricao">
              </div>
            </div>
          </transition>
        </section>

        <section class="form-card">
          <div class="header-with-action">
            <h3>🎤 Preletores</h3>
            <button class="btn-add" @click="addSpeaker">+ Adicionar Preletor</button>
          </div>

          <div class="speakers-list">
            <div v-for="(speaker, index) in eventForm.speakers" :key="index" class="speaker-card-item">
              <div
                class="speaker-image-side"
                @click="$refs[`speakerInput${index}`][0].click()"
              >
                <img v-if="speaker.preview || speaker.imagem" :src="speaker.preview || speaker.imagem">
                <div v-else class="upload-msg">📸</div>

                <input
                  type="file"
                  hidden
                  :ref="`speakerInput${index}`"
                  accept="image/*"
                  @change="e => openEditor(
                    e.target.files[0],
                    'custom',
                    { target: 'speaker', speakerIndex: index }
                  )"
                >
              </div>

              <div class="speaker-info-side">
                <div class="speaker-inputs-row">
                  <div class="form-group flex-1">
                    <label>Nome Completo</label>
                    <input type="text" v-model="speaker.nome" placeholder="Ex: Pr. João Silva">
                  </div>
                  <div class="form-group flex-1">
                    <label>Função / Cargo</label>
                    <input type="text" v-model="speaker.funcao" placeholder="Ex: Preletor Principal">
                  </div>
                </div>
                <button class="btn-remove-speaker" @click="removeSpeaker(index)">Remover Preletor</button>
              </div>
            </div>
          </div>
        </section>
        <!-- fim novo -->
        <div class="actions">
          <button class="btn-save-full" @click="saveEvent" :disabled="isSaving">
            {{ isSaving ? 'Salvando Evento...' : '🚀 Publicar Evento na Agenda' }}
          </button>
        </div>
      </div>
    </div>
  </div>
<!-- IMAGE EDITOR MODAL -->
<div v-if="showImageEditor" class="image-editor-overlay">
  <div class="image-editor-modal">
    
    <!-- header -->
    <div class="modal-header">
      <h3>
        {{
          editorContext.target === 'banner-desktop' ? 'Editar Banner Desktop' :
          editorContext.target === 'banner-mobile' ? 'Editar Banner Mobile' :
          'Editar Foto do Preletor'
        }}
      </h3>

      <button class="btn-close" @click="closeImageEditor">✕</button>
    </div>

    <!-- content -->
    <div class="modal-body">
      <ImageEditor
        v-if="showImageEditor"
        :image-src="editorImageSrc"
        :edit-type="editorType"
        @confirm="onEditorConfirm"
        @cancel="closeImageEditor"
      />
      </div>
      
  </div>
</div>

<!-- TOAST -->
<transition name="toast">
  <div v-if="toast.show" class="toast" :class="toast.type">
    <span class="icon">
      {{ toast.type === 'success' ? '✅' : '⚠️' }}
    </span>
    <span>{{ toast.message }}</span>
  </div>
</transition>

</template>
<style scoped>
.event-admin-container {
  padding: 1rem;
  color: white;
  background: #1a1a1a;
  min-height: 100vh;
}

.event-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.form-card {
  background: #252525;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid #333;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #aaa;
}

input, textarea, select {
  background: #111;
  border: 1px solid #444;
  padding: 0.8rem;
  color: white;
  border-radius: 6px;
}

.dual-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.image-preview-container {
  width: clamp(150px, 100%, 410px);
  aspect-ratio: 16/9;
  background: #111;
  border: 2px dashed #444;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.schedule-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  align-items: center;
}

.btn-add {
  background: #2d5a27;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save-full {
  width: 100%;
  padding: 1.2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
}

.btn-save-full:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}




.full-width-card {
  grid-column: 1 / -1; /* Ocupa as duas colunas se estiver dentro de um grid */
}

.registration-details {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333;
}

/* Toggle Switch Customizado */
.toggle-container {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-container input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #444;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 4px; bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider { background-color: #3b82f6; }
input:checked + .toggle-slider:before { transform: translateX(24px); }

/* --- Estilos de Preletores (Layout Novo) --- */
.speakers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.speaker-card-item {
  display: grid;
  grid-template-columns: 120px 1fr; /* Imagem com 120px de largura */
  gap: 1.5rem;
  background: #1a1a1a;
  padding: 1.2rem;
  border-radius: 10px;
  border: 1px solid #333;
  align-items: start;
}

.speaker-image-side {
  width: 120px;
  height: 120px;
  background: #252525;
  border: 2px dashed #444;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
}

.speaker-image-side:hover { border-color: #3b82f6; }

.speaker-image-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.speaker-info-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.speaker-inputs-row {
  display: flex;
  gap: 1rem;
}

.flex-1 { flex: 1; }

.btn-remove-speaker {
  align-self: flex-end;
  background: transparent;
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.3s;
}

.btn-remove-speaker:hover {
  background: #ff4d4d;
  color: white;
}

/* Animação simples */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }


.image-editor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-editor-modal {
  background: #0f0f0f;
  width: 95%;
  max-width: 1200px;
  max-height: 90vh;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalIn .2s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #141414;
  border-bottom: 1px solid #222;
}

.modal-header h3 {
  color: #fff;
  font-size: 15px;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.banner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.image-preview-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.image-preview-container {
  max-height: min(230px, 30vh);
}

@media (max-width: 768px) {
  .banner-grid {
    grid-template-columns: 1fr;
  }
}

/* animação */
@keyframes modalIn {
  from { opacity: 0; transform: scale(.96) }
  to   { opacity: 1; transform: scale(1) }
}

/* mobile */
@media (max-width: 768px) {
  .image-editor-modal {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}

@media (max-width: 1024px) {
  .event-grid { grid-template-columns: 1fr; }
}


@media (max-width: 600px) {
  .speaker-card-item { grid-template-columns: 1fr; text-align: center; }
  .speaker-image-side { margin: 0 auto; }
  .speaker-inputs-row { flex-direction: column; }
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  z-index: 10000;
  box-shadow: 0 10px 30px rgba(0,0,0,.4);
}

.toast.success {
  background: linear-gradient(135deg, #16a34a, #22c55e);
}

.toast.error {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

/* animação */
.toast-enter-active,
.toast-leave-active {
  transition: all .3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

</style>