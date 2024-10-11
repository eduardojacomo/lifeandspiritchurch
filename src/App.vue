<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>

header{
  z-index:1000;
  position: fixed;
  width: 100%;
  height: 70px; /* Definir a altura da navbar */
  top: 0;
 }
/*.main-content {
  padding-top: 70px;
  min-height: calc(100vh -80px);
} */
</style>
