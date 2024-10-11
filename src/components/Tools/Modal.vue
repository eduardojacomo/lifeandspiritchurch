<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  project: Object
})

const emit = defineEmits(['close'])
const currentImageIndex = ref(0)

const nextImage = () => {
  if (currentImageIndex.value < props.project.images.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

watch(props.project, () => {
  currentImageIndex.value = 0  // Reseta ao abrir um novo projeto
})
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="emit('close')">X</button>
      <div class="botoes">
        <button @click="prevImage" :disabled="currentImageIndex === 0"><font-awesome-icon icon="fa-solid fa-chevron-left" /></button>
        <button @click="nextImage" :disabled="currentImageIndex === project.images.length - 1"><font-awesome-icon icon="fa-solid fa-chevron-right" /></button>
      </div>
      
      <!-- Image Navigation -->
      <div class="image-slider">
        <transition name="slide">
          <img :key="currentImageIndex" :src="project.images[currentImageIndex]" alt="Imagem do Projeto" />
        </transition>
      </div>
      <div class="legend">
        <h2>{{ project.title }}</h2>
        <p>{{ project.legend[currentImageIndex] }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
} */

.slide-enter-active, .slide-leave-active {
  transition: all 300ms ease-in-out;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scaleY(1);
}

.slide-enter-to, .slide-leave-from {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  padding: 2rem;
  width: 95%;
  height: 95%;
  position: relative;
  align-items: center;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
}

.image-slider {
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  width: clamp(350px, 85%, 1380px);
}

.image-slider img {
  width: 100%;
    height: 100%;
    object-fit: cover;
}

.botoes button{
  background-color: transparent;
  color: var(--color-heading);
  font-size: 1.8rem;
  border: none;
  cursor: pointer;
  padding: 0 3rem;
}

/* .botoes button:hover{
  font-size: 2.3rem;
} */

.botoes button:disabled{
  color: var(--color-border);
  cursor: auto;
}

/* .botoes button:disabled:hover{
  font-size: 1.8rem;
} */

.botoes{
  display: flex;
  flex-direction: row;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  justify-content: space-between;
  z-index: 1001;
}
.legend{
  display: flex;
  flex-direction: column;
  /* position: absolute;
  bottom: -60px; */
  padding: 0 6rem;
  align-items: center;
  color: var(--color-heading);
}
</style>
