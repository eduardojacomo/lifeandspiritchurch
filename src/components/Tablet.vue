<template>
  <div class="tablet">
    <div class="camera"></div>
    <div class="screen">
        <img :src="props.imageSrc" alt="Imagem do Site" />
      
    </div>
    <div class="home-button"></div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
  imageSrc: Text,
  url: Text
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}


.tablet {
  position: relative;
  width: 400px;  /* Ajuste a largura conforme necessário */
  height: 600px; /* Ajuste a altura conforme necessário */
  background-color: #333;
  border-radius: 20px;
  padding: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}


.camera {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 15px;
  height: 15px;
  background-color: #555;
  border-radius: 50%;
  transform: translateX(-50%);
}


.screen {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.screen img{
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.app {
  text-align: center;
  font-size: 1.2rem;
}


.home-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 35px;
  height: 35px;
  background-color: #444;
  border-radius: 50%;
  transform: translateX(-50%);
}

</style>