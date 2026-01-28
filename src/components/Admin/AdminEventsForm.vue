<script setup>
import { ref, watch, onMounted } from 'vue'
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore()
const storage = getStorage()

// Estados
const isSaving = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)

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

// const eventForm = ref({
//   title: { pt: '', en: '' },
//   description: { pt: '', en: '' },
//   dateStart: '',
//   dateEnd: '',
//   category: 'conferencia',
//   address: {
//     label: '',
//     street: '',
//     city: '',
//     mapUrl: ''
//   },
//   schedules: [{ day: '', start: '', end: '' }]
// })

const eventForm = ref({
  title: { pt: '', en: '' },
  description: { pt: '', en: '' },
  dateStart: '',
  dateEnd: '',
  category: '',
  address: { label: '', street: '', city: '', mapUrl: '' },
  schedules: [],
  address: {
     label: '',
     street: '',
     city: '',
     mapUrl: ''
   },
})

const categories = [
  { value: '', label: 'Selecione uma categoria' },
  { value: 'conferencia', label: 'Conferência' },
  { value: 'festa', label: 'Festa' },
  { value: 'batismo', label: 'Batismo' },
  { value: 'encontro', label: 'Encontro' },
  { value: 'culto', label: 'Culto Especial' }
]

// Gerenciamento de Horários
const addSchedule = () => eventForm.value.schedules.push({ day: '', start: '', end: '' })
const removeSchedule = (index) => eventForm.value.schedules.splice(index, 1)

if (props.initialData?.imageUrl) {
  imagePreview.value = props.initialData.imageUrl
}

const populateForm = () => {
  if (props.initialData) {
    // Usamos o spread para garantir que todos os campos sejam carregados
    eventForm.value = JSON.parse(JSON.stringify(props.initialData))
    
    // Se houver imagem, atualiza o preview
    if (props.initialData.imageUrl) {
      imagePreview.value = props.initialData.imageUrl
    }
  }
}

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Converte para WebP (qualidade 0.8)
      canvas.toBlob((blob) => {
        imageFile.value = blob;
        imagePreview.value = URL.createObjectURL(blob);
      }, 'image/webp', 0.8);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Salvar Registro
async function saveEvent() {
  if (isSaving.value) return
  isSaving.value = true

  try {
    let imageUrl = eventForm.value.imageUrl || ""

    // Upload se houver nova imagem (conversão WebP já inclusa na sua handleImageChange)
    if (imageFile.value) {
      const fileName = `events/${Date.now()}_banner.webp`
      const fileRef = storageRef(storage, fileName)
      const snapshot = await uploadBytes(fileRef, imageFile.value, metadata_type)
      imageUrl = await getDownloadURL(snapshot.ref)
    }

    const docData = {
      ...eventForm.value,
      imageUrl,
      updated_at: new Date().toISOString()
    }

    if (props.initialData?.id) {
      // MODO EDIÇÃO
      const eventRef = doc(db, "events", props.initialData.id)
      await updateDoc(eventRef, docData)
    } else {
      // MODO NOVO
      docData.status = 'active'
      docData.created_at = new Date().toISOString()
      await addDoc(collection(db, "events"), docData)
    }
    
    emit('saved')
    if (!props.initialData) resetForm()
  } catch (error) {
    console.error(error)
    alert("Erro ao processar")
  } finally {
    isSaving.value = false
  }
}

// async function saveEvent() {
//   if (isSaving.value) return
//   isSaving.value = true

//   try {
//     let imageUrl = ""

//     // 1. Upload da Imagem (se houver)
//     if (imageFile.value) {
//       const fileName = `events/${Date.now()}_${imageFile.value.name}`
//       const fileRef = storageRef(storage, fileName)
//       const snapshot = await uploadBytes(fileRef, imageFile.value)
//       imageUrl = await getDownloadURL(snapshot.ref)
//     }

//     // 2. Salvar no Firestore (A coleção 'events' será criada automaticamente aqui)
//     const docData = {
//       ...eventForm.value,
//       imageUrl,
//       status: 'active',
//       created_at: new Date().toISOString()
//     }

//     await addDoc(collection(db, "events"), docData)
    
//     alert("Evento cadastrado com sucesso!")
//     resetForm()
//   } catch (error) {
//     console.error("Erro ao salvar:", error)
//     alert("Erro ao salvar evento: " + error.message)
//   } finally {
//     isSaving.value = false
//   }
// }

const resetForm = () => {
  eventForm.value = {
    title: { pt: '', en: '' },
    description: { pt: '', en: '' },
    dateStart: '',
    dateEnd: '',
    category: '',
    address: { label: '', street: '', city: '', mapUrl: '' },
    schedules: [{ day: '', start: '', end: '' }]
  }
  imageFile.value = null
  imagePreview.value = null
}


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
          <div class="image-preview-container" @click="$refs.fileInput.click()">
            <img v-if="imagePreview" :src="imagePreview" class="preview-img">
            <div v-else class="upload-placeholder">
              <span>📸 Clique para subir imagem</span>
            </div>
            <input type="file" ref="fileInput" @change="handleImageChange" hidden accept="image/*">
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

        <div class="actions">
          <button class="btn-save-full" @click="saveEvent" :disabled="isSaving">
            {{ isSaving ? 'Salvando Evento...' : '🚀 Publicar Evento na Agenda' }}
          </button>
        </div>
      </div>
    </div>
  </div>
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
  width: 100%;
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
  object-fit: cover;
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

@media (max-width: 1024px) {
  .event-grid { grid-template-columns: 1fr; }
}
</style>