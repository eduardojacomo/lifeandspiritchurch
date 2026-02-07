<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Banner from '../components/Banner.vue'
import About from '../components/About.vue'
import ContentSection from '../components/ContentSection.vue'
import Scheadle from '@/components/Scheadle.vue';
import Contact from '@/components/Contact.vue';
import MobileApp from '@/components/MobileApp.vue';
import HeroSection from '@/components/HeroSection.vue';

// Registrar o plugin (necessário quando instalado via npm)
gsap.registerPlugin(ScrollTrigger);

const loader = ref(null);
const mainContent = ref(null);

onMounted(() => {
  const tl = gsap.timeline({ paused: true }); // Criamos a timeline pausada

  // 1. Configuração da Animação do Preloader
  tl.to(".loader-title", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
  })
  .to(".loader-bar-inner", {
    width: "100%",
    duration: 1.5, 
    ease: "power2.inOut"
  }, "-=0.2")
  .to(loader.value, {
    yPercent: -100,
    duration: 0.8,
    ease: "expo.inOut"
  })
  .to(mainContent.value, {
    opacity: 1,
    duration: 0.1
  }, "-=0.4")
  .from("#home", {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power3.out"
  }, "-=0.2");

  // EXCUÇÃO REAL: Espera o window.load (imagens, fontes, etc)
  if (document.readyState === 'complete') {
    tl.play();
  } else {
    window.addEventListener('load', () => {
      tl.play();
    });
  }

  ScrollTrigger.create({
    trigger: "#home",
    start: "top top",
    end: "bottom top",
    pin: true,          // Trava o Hero na tela
    pinSpacing: false,   // Permite que o About suba por cima dele
  });

  // Efeito de Parallax Sutil na Imagem do Hero enquanto o About sobe
  gsap.to("#home HeroSection", {
    yPercent: -20, // Move levemente para cima para dar profundidade
    opacity: 0.5,
    scrollTrigger: {
      trigger: "#about",
      start: "top bottom", 
      end: "top top",
      scrub: true
    }
  });

  // 2. Animações de Scroll para as demais seções (ajustado)
  const sections = ['#about', '#scheadle', '#content', '#contact'];
  
  sections.forEach((id) => {
    const element = document.querySelector(id);
    if (element) {
      gsap.from(`${id} > *`, {
        scrollTrigger: {
          trigger: id,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2
      });
    }
  });
});
</script>

<template>
  <!-- Preloader Estruturado com CSS Puro -->
  <div id="preloader" ref="loader">
    <div class="loader-content">
      <h1 class="loader-title">LIFE & SPIRIT</h1>
      <div class="loader-bar-bg">
        <div class="loader-bar-inner"></div>
      </div>
    </div>
  </div>

  <main ref="mainContent" class="main-content">
    <section id="home" class="section">
      <HeroSection />
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
    
    <section id="mobile" class="section">
      <MobileApp />
    </section>
  </main>
</template>

<style scoped>
/* Estilos do Preloader */
#preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-content {
  text-align: center;
}

.loader-title {
  color: #ffffff;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(20px);
}

.loader-bar-bg {
  width: 200px;
  height: 2px;
  background-color: #333;
  margin: 0 auto;
  overflow: hidden;
}

.loader-bar-inner {
  width: 0%;
  height: 100%;
  background-color: #ffffff;
}

/* Estrutura da Página */
.main-content {
  opacity: 0;
  overflow-x: hidden;
}

html {
  scroll-behavior: smooth;
}

.section {
  /* min-height: 100vh; */
  width: 100%;
  position: relative;
  margin: 0; 
  padding: 0;
  display: block;
}

#home {
  z-index: 1;
  position: relative;
  height: 100vh;
}


#about {
  z-index: 2; 
  position: relative;
  background-color: var(--color-background);
  box-shadow: 0 -10px 30px rgba(0,0,0,0.5); 
  margin-top: 0; 
  /* Se o componente About tiver um <h2> no topo, 
     o padding evita que a margem do <h2> crie o espaço branco */
  padding-top: 1px;
}
:deep(html) {
  scroll-behavior: auto !important;
}

/* As demais seções seguem o fluxo normal */
#scheadle, #content, #mobile {
  z-index: 2;
  position: relative;
  background-color: var(--color-background); 
}

@media screen and (max-width: 768px) {
  .section {
    min-height: auto;
    padding: 40px 0;
  }
}
</style>