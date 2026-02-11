<template>
  <div class="container">
    <div class="header">
      <h1>Gerenciamento de Equipe</h1>
    </div>

    <div class="tabs">
      <button
        :class="['tab', { active: activeTab === 'list' }]"
        @click="activeTab = 'list'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
        </svg>
        Equipe
      </button>

      <button
        :class="['tab', { active: activeTab === 'form' }]"
        @click="prepareForm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
        </svg>
        {{ editingMember ? 'Editar' : 'Novo Membro' }}
      </button>
    </div>

    <div v-show="activeTab === 'list'" class="tab-content active">
      <TeamGallery @edit="handleEdit" :key="counter" />
    </div>

    <div v-show="activeTab === 'form'" class="tab-content active">
      <TeamUpload 
        :editData="editingMember"
        :key="editingMember ? editingMember.id : 'new'" 
        @saved="onSaved" 
        @cancel="activeTab = 'list'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TeamGallery from './TeamGallery.vue';
import TeamUpload from './TeamUpload.vue';

const activeTab = ref('list');
const editingMember = ref(null);
const counter = ref(0);


const prepareForm = () => {
  editingMember.value = null;
  activeTab.value = 'form';
};

const handleEdit = (member) => {
  editingMember.value = member;
  activeTab.value = 'form';
};

const onSaved = () => {
  editingMember.value = null;
  activeTab.value = 'list';
  counter.value++; // Força atualização do gallery
};
</script>

<style scoped>
/* Importamos exatamente os seus estilos base */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 85px 2rem 2rem 2rem;
  background: #000;
  color: #fff;
  min-height: 100vh;
}

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab.active {
  color: #fff;
  border-bottom-color: #fff;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>