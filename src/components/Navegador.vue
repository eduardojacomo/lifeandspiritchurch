<template>
    <div class="browser-window">
      <!-- Top Bar of Browser -->
      <div class="browser-header">
        <div class="controls">
          <span class="close"></span>
          <span class="minimize"></span>
          <span class="maximize"></span>
        </div>
        <div class="address-bar">
          <input type="text" v-model="props.url" readonly />
        </div>
      </div>
      <!-- Display Image Area -->
      <div class="browser-content">
        <img :src="props.imageSrc" alt="Imagem do Site" />
        <!-- <iframe :src="url" frameborder="0" class="iframe-content"></iframe> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
  imageSrc: Text,
  url: Text
})

  // Define a ref for the image source and a URL for the mock address bar
//   const imageSrc = ref('/src/assets/psirenatamachado.png')
//   const url = ref('https://www.psirenatamachado.com')
  </script>
  
  <style scoped>
  .browser-window {
    width: 100%;
    max-width: 1024px;
    border-radius: 8px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--color-border);
    /* border: 1px solid #e0e0e0; */
    overflow: hidden;
  }
  
  .browser-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* background-color: #f6f6f6; */
    background-color: var(--color-background-soft);
    padding: 8px;
  }
  
  .controls {
    display: flex;
    gap: 6px;
  }
  
  .controls span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .close {
    background-color: #ff5f56;
  }
  
  .minimize {
    background-color: #ffbd2e;
  }
  
  .maximize {
    background-color: #27c93f;
  }
  
  .address-bar input {
    width: 100%;
    border: none;
    background-color: var(--color-background-mute);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    color: var(--color-heading);
  }
  
  .address-bar input:focus {
    outline: none;
  }
  
  .browser-content {
    background-color: var(--color-background-mute);
    display: flex;
    height: 600px;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    overflow-y: auto;
  }

  .browser-content img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  }
  </style>
  