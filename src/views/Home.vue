<script setup>
  import Banner from '../components/Banner.vue'
  import About from '../components/About.vue'
  import ContentSection from '../components/ContentSection.vue'
  import Scheadle from '@/components/Scheadle.vue';
  import Contact from '@/components/Contact.vue';

</script>

<template>
  <main>
    <section id="home" class="section">
      <Banner />
    </section>
    <section id="about" class="section">
      <About />
    </section>
    <section id="scheadle" class="section">
      <Scheadle />
    </section>
    <section id="content" class="section">
      <ContentSection />
    </section>
    <section id="contact" class="section">
      <Contact />
    </section>
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