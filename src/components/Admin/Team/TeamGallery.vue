<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTeamRepository } from '../../../composables/useTeamRepository';
import CustomSelect from '@/components/Forms/CustomSelect.vue';

const emit = defineEmits(['edit']);
const { teamItems, fetchTeam, deleteMember, isLoading } = useTeamRepository();

const showDeleteConfirm = ref(false);
const memberToDelete = ref(null);
const filters = ref({
  ministerio: '',
  cargo: '',
});


onMounted(async () => {
  await fetchTeam();
  console.log('Membros da equipe carregados:', teamItems.value);
});

const cargos = [
  { value: 'pastor', label: 'Pastor' },
  { value: 'presbitero', label: 'Presbítero' },
//   { value: 'diacono', label: 'Diácono' },
//   { value: 'outro', label: 'Outro' }
];

const ministerios = [
  { value: 'Louvor', label: 'Louvor' },
  { value: 'Evangelismo', label: 'Evangelismo' },
  { value: 'Crianças', label: 'Crianças' },
  { value: 'Adolescentes', label: 'Adolescentes' },
  { value: 'Jovens', label: 'Jovens' },
  { value: 'Mulheres', label: 'Mulheres' },
  { value: 'Homens', label: 'Homens' },
  { value: 'Casais', label: 'Casais' },
]

const filteredTeam = computed(() => {
  return teamItems.value.filter(member => {
    const matchesMinisterio = filters.value.ministerio ? member.ministerio === filters.value.ministerio : true;
    const matchesCargo = filters.value.cargo ? member.cargo?.pt === filters.value.cargo : true;
    return matchesMinisterio && matchesCargo;
  });
});

// Helpers
const truncate = (text, limit) => {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
};

async function confirmDelete(member) {
  memberToDelete.value = member;
  showDeleteConfirm.value = true;
}

const handleDelete = async () => {
  if (memberToDelete.value) {
    await deleteMember(memberToDelete.value.id, memberToDelete.value.url);
    showDeleteConfirm.value = false;
    memberToDelete.value = null;
  }
};
</script>

<template>
  <div class="tab-content active">
    <div class="gallery-filters">
        <div class="filter-group">
             <label>Cargo</label>
             <CustomSelect v-model="filters.cargo" :options="cargos" />
        </div>
        <div class="filter-group">
             <label>Ministério</label>
             <CustomSelect v-model="filters.ministerio" :options="ministerios" />
        </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Buscando membros da equipe...</p>
    </div>

    <div v-else-if="teamItems.length > 0" class="gallery-grid">
      <div v-for="member in filteredTeam" :key="member.id" class="gallery-item">
        <div class="gallery-tags">
            <span v-if="member.isMainAbout" class="tag destaque" style="background: #f1c40f; color: #000;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                Destaque About</span>
        </div>
        <div class="gallery-image">
          <img :src="member.url" :alt="member.nome">
        </div>
        
        <div class="gallery-info">
          <div class="gallery-tags">
            <span class="tag desktop">{{ member.ministerio }}</span>
          </div>

          <div class="gallery-details">
            <strong>Nome:</strong> {{ member.nome }}
          </div>
          
          <div class="gallery-details">
            <strong>Cargo:</strong> {{ member.cargo?.pt }}
          </div>

          <div class="gallery-details" style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.6;">
            ID: {{ member.id.substring(0, 8) }}...
          </div>

          <div class="gallery-actions">
            <button class="btn-edit" @click="$emit('edit', member)">Editar</button>
            <button class="btn-delete" @click="confirmDelete(member)">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="icon">👥</div>
      <h3>Nenhum membro encontrado</h3>
      <p>Adicione pessoas à sua equipe na aba "Novo Membro"</p>
    </div>

    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal-content delete-confirmation">
          <div class="modal-header">
            <span class="warning-icon">⚠️</span>
            <h3>Remover Integrante</h3>
          </div>
          
          <div class="modal-body">
            <p>Deseja realmente remover <strong>{{ memberToDelete?.nome }}</strong>?</p>
            <p class="warning-text">Esta ação é irreversível e a imagem será removida do Storage.</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn-confirm-delete" @click="handleDelete" :disabled="isDeleting">
              {{ isDeleting ? 'Removendo...' : 'Confirmar Exclusão' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
  object-position: top;
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

.tag.destaque {
  color: #f1c40f;
  background: #4f4f4f7b;
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

 .custom-select {
  /*padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  appearance: none;*/
  min-width: 150px;
} 

.delete-confirmation {
  max-width: 400px;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Garante que o grid não "pule" ao carregar */
.gallery-grid {
  min-height: 400px;
}
</style>