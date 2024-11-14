<script setup>
  import Banner from '../components/Banner.vue'
  import About from '../components/About.vue'
  import Portfolio from '../components/Portfolio.vue'
  import Services from '@/components/Services.vue';
import Contato from '@/components/Contato.vue';
</script>

<template>
  <main>
    <section id="home" class="section">
      <Banner />
    </section>
    <section id="portfolio" class="section">
      <Services />
    </section>
    <section id="about" class="section">
      <About />
    </section>
    <section id="portfolio" class="section">
      <Portfolio />
    </section>
    <!-- <section id="contact" class="section">
      <Contato />
    </section> -->
  </main>
</template>

<style scoped>
 /* main{
  padding-top: 70px;
} */
html {
  scroll-behavior: smooth;
}

.section{
  min-height: 100vh;
}

@media screen and (max-width: 480px){
  .section{
  min-height: auto;
}
}

</style>