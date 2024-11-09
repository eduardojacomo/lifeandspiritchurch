<script setup>
import { ref, watch } from 'vue'
import Navegador from '../Navegador.vue';

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
  currentImageIndex.value = 0 
})
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="emit('close')"><font-awesome-icon icon="fa-solid fa-arrow-left" /></button>
      <div class="description">
          <h2>{{ project.title }}</h2>
          <p>{{ project.details }}</p>
          <ul>
            <li v-for="(t, index) in project.tags" :key="index">{{ t }}</li>
          </ul>
          <div class="links">
            <div v-for="(l,index) in project.links" :key="index">
              <a :href="l.link" target="_blank"><span class="links-text"> <font-awesome-icon :icon="l.icon" />  {{ l.plataforma }}</span></a>
            </div>
          </div>
      </div>
      <div class="content-projeto">
        <Navegador :imageSrc = "project.images[currentImageIndex].src" :url="project.url"/>
        <!-- <img :key="currentImageIndex" :src="project.images[currentImageIndex]" alt="Imagem do Projeto" /> -->
         <div class="botoes">
          <button @click="prevImage" :disabled="currentImageIndex === 0"><font-awesome-icon icon="fa-solid fa-chevron-left" /></button>
          <button @click="nextImage" :disabled="currentImageIndex === project.images.length - 1"><font-awesome-icon icon="fa-solid fa-chevron-right" /></button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 300ms ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%); 
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-enter-to, .slide-leave-from {
  opacity: 1;
  transform: translateX(0); 
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(000, 000, 000,1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  background-color: var(--color-backgroud);
  color: var(--color-text);
  padding: 2rem;
  width: 100%;
  height: 100%;
  /* position: relative; */
  align-items: center;
}

.content-projeto{
  display: flex;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: var(--color-heading);
  font-size: 1.5rem;
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

.botoes button {
  background-color: transparent;
  color: var(--color-heading);
  font-size: 1.8rem;
  border: none;
  cursor: pointer;
  padding: 0 .5rem;
}

.botoes button:disabled {
  color: var(--color-border);
  cursor: auto;
}

.botoes {
  display: flex;
  flex-direction: row;
  width: 100px;
  position: absolute;
  /* top: 50%; */
  top: 10px;
  left: 0;
  padding: 0 0 0 150px;
  justify-content: center;
  z-index: 1001;
}

.legend {
  display: flex;
  flex-direction: column;
  padding: 0 6rem;
  align-items: center;
  color: var(--color-heading);
}

.description{
  display: flex;
  width: 400px;
flex-direction: column;
padding: 0 .5rem;
}

.description h2{
  font-size: 2rem;
  font-weight: 600;
}

.description p{
  text-align: justify;
  padding-bottom: .5rem;
}
ul{
  list-style-type: none;
  margin: 0;
  padding: 0;
  
}
ul li{
  display: inline-flex;
  flex-direction: row;
  padding: .5rem 1rem;
  margin-inline: 5px;
  text-align: center;
  border: none;
  border-radius: 16px;
  /* background-color: var(--color-backgroud-soft); */
  background-color:var(--color-background-mute); 
}

.links{
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: .5rem;
  margin-top: 2rem;
}

.links a{
  text-decoration: none;
  display: flex;
  padding: 5px 15px;
  border: solid 3px var(--color-background-soft);
  border-radius: 8px;
  background-color: var(--color-background-soft);
  cursor: pointer;
  transition: 400ms;
}

.links-text{
  color: var(--color-text);
  transition: 400ms;
}

.links a:hover{
  background-color: transparent;
  border: solid 3px var(--color-border);
}

.links a:hover .links-text{
  color: var(--color-heading);
}
</style>
