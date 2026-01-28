<script setup>
import { ref } from 'vue'
import AdminEventsForm from './AdminEventsForm.vue' // O componente de cadastro
import EventsList from './EventsList.vue' // O componente de listagem que criaremos abaixo

const activeTab = ref('list') // Aba padrão: Agenda
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Agenda de Eventos</h1>
    </div>

    <div class="tabs">
      <button 
        :class="['tab', { active: activeTab === 'list' }]" 
        @click="activeTab = 'list'"
      >
        📅 Ver Agenda
      </button>
      <button 
        :class="['tab', { active: activeTab === 'create' }]" 
        @click="activeTab = 'create'"
      >
        ➕ Novo Evento
      </button>
    </div>

    <div v-show="activeTab === 'list'" class="tab-content">
      <EventsList />
    </div>

    <div v-show="activeTab === 'create'" class="tab-content">
      <AdminEventsForm @event-saved="activeTab = 'list'" />
    </div>
  </div>
</template>

<style scoped>
/* Aproveitando os estilos que você já enviou */
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
  margin-bottom: 1rem;
}
h1{
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.tab {
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}
.tab.active {
  color: #fff;
  border-bottom-color: #3b82f6; /* Azul destaque */
}
</style>