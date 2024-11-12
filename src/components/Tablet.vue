<template>
  <div class="tablet">
    <div class="camera"></div>
    <div class="screen">
      <!-- Conteúdo que aparece na tela do tablet -->
      <div class="app">
        <h2>Bem-vindo ao Mockup do Tablet</h2>
        <p>Exemplo de interface para um tablet.</p>
      </div>
    </div>
    <div class="home-button"></div>
  </div>
</template>

<script setup>

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
  padding: 25px;
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