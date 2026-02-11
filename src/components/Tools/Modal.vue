<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title'
  },
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        
        <div class="modal-container">
          <header class="modal-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="close">&times;</button>
          </header>

          <main class="modal-content">
            <slot></slot>
          </main>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Overlay que escurece o fundo */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255,255,255,0.8); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Container do Modal */
.modal-container {
  background: #000;
  width: 90%;
  max-width: 1200px;
  max-height: 95vh; /* Altura máxima do modal */
  border-radius: 8px;
  display: flex;
  flex-direction: column; /* Essencial para o scroll funcionar no meio */
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  overflow: hidden;
  color: #fff;
}

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

.modal-header {
  padding: 1rem;
  /* border-bottom: 1px solid #eee; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color:#ccc
}


.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* Estilização da Scrollbar (Webkit - Chrome, Edge, Safari) */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #292929;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #1e1e1e;
  border-radius: 2px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* Footer fixo */
.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Botão padrão */
.btn-default {
  padding: 8px 16px;
  cursor: pointer;
  background: #efefef;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Transição de Fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>