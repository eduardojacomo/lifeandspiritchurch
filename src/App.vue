<template>
  <header  :style="{ visibility: navbarVisible }">
    <Navbar />
  </header>
  <main class="main-content">
    <transition name="page-transition" mode="out-in" @before-enter="setNavbarBehind" 
    @after-enter="resetNavbar">
      <router-view />
    </transition>
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router';
import {ref} from 'vue';
import Navbar from './components/Navbar.vue';

const navbarVisible = ref('hidden'); 


function setNavbarBehind() {
  navbarVisible.value = 'hidden';
}


function resetNavbar() {
  navbarVisible.value = 'visible';
}

</script>

<style scoped>
header {
   z-index: 1000;
  position: fixed;
  width: 100%;
  height: 70px; /* Definir a altura da navbar */
  top: 0;
  transition: z-index 0.3s ease;
}
/* A estrutura para a transição de página */
.page-transition-enter-active,
.page-transition-leave-active {
  position: relative;
  overflow: hidden;
}

/* Animação para o quadro branco e preto */
@keyframes slide-in-white {
  0% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes slide-in-black {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }

}

/* Animação de opacidade para o conteúdo */
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Estilos para o quadro branco */
.page-transition-enter-active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #101010; /* Cor do quadro branco */
  animation: slide-in-white 1s ease forwards;
  z-index: 9998;
}

/* Estilos para o quadro preto */
.page-transition-enter-active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000; /* Cor do quadro preto */
  animation: slide-in-black 1s ease 0.1s forwards; /* Delay para o efeito sobreposto */
  z-index: 9999;
}

/* Transição de opacidade para o conteúdo */
.page-transition-enter {
  opacity: 0;
}

.page-transition-enter-active {
  animation: fade-in 1.2s ease 1s forwards; /* Atraso para o conteúdo aparecer após os quadros */
}
</style>

