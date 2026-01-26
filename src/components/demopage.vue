<template>
  <div class="demo-page">
    <h1>Efeitos de Scroll para Landing Page</h1>
    <p class="subtitle">Role a página para ver os efeitos em ação</p>

    <!-- 1. FADE IN UP (Mais Comum) -->
    <section class="demo-section">
      <h2>1. Fade In Up (Entrada de Baixo)</h2>
      <div class="fade-in-up" ref="fadeInUp">
        <div class="demo-card">
          <h3>Efeito Clássico</h3>
          <p>Elemento surge de baixo com fade. Perfeito para textos e cards.</p>
        </div>
      </div>
    </section>

    <!-- 2. FADE IN LEFT/RIGHT (Entradas Laterais) -->
    <section class="demo-section">
      <h2>2. Fade In Left & Right (Entradas Laterais)</h2>
      <div class="grid-2">
        <div class="fade-in-left" ref="fadeInLeft">
          <div class="demo-card">
            <h3>Da Esquerda</h3>
            <p>Ideal para imagens ao lado de texto</p>
          </div>
        </div>
        <div class="fade-in-right" ref="fadeInRight">
          <div class="demo-card">
            <h3>Da Direita</h3>
            <p>Cria alternância visual interessante</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SCALE (Zoom) -->
    <section class="demo-section">
      <h2>3. Scale In (Zoom)</h2>
      <div class="scale-in" ref="scaleIn">
        <div class="demo-card highlight">
          <h3>Efeito Zoom</h3>
          <p>Começa pequeno e cresce. Ótimo para CTAs e destaques.</p>
        </div>
      </div>
    </section>

    <!-- 4. ROTATE IN -->
    <section class="demo-section">
      <h2>4. Rotate In (Rotação)</h2>
      <div class="rotate-in" ref="rotateIn">
        <div class="demo-card">
          <h3>Rotação Sutil</h3>
          <p>Adiciona um toque de dinamismo. Use com moderação.</p>
        </div>
      </div>
    </section>

    <!-- 5. BLUR IN -->
    <section class="demo-section">
      <h2>5. Blur In (Desfoque)</h2>
      <div class="blur-in" ref="blurIn">
        <div class="demo-card">
          <h3>Efeito Desfoque</h3>
          <p>Começa embaçado e fica nítido. Moderno e elegante.</p>
        </div>
      </div>
    </section>

    <!-- 6. STAGGER (Sequencial) -->
    <section class="demo-section">
      <h2>6. Stagger (Efeito Sequencial)</h2>
      <div class="stagger-container" ref="staggerContainer">
        <div class="stagger-item" v-for="n in 4" :key="n" :style="{ '--index': n - 1 }">
          <div class="demo-card small">
            <h4>Item {{ n }}</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. PARALLAX -->
    <section class="demo-section parallax-section" ref="parallaxSection">
      <div class="parallax-bg" :style="{ transform: `translateY(${parallaxOffset}px)` }"></div>
      <div class="parallax-content">
        <h2>7. Parallax Scroll</h2>
        <p>Background se move em velocidade diferente</p>
      </div>
    </section>

    <!-- 8. REVEAL (Cortina) -->
    <section class="demo-section">
      <h2>8. Reveal (Efeito Cortina)</h2>
      <div class="reveal-container" ref="revealContainer">
        <div class="reveal-content">
          <div class="demo-card">
            <h3>Revelação Gradual</h3>
            <p>Elemento é revelado como uma cortina abrindo</p>
          </div>
        </div>
        <div class="reveal-overlay"></div>
      </div>
    </section>

    <!-- 9. SPLIT TEXT -->
    <section class="demo-section">
      <h2>9. Split Text (Texto Dividido)</h2>
      <div class="split-text-container" ref="splitText">
        <h3 class="split-text">CHURCH</h3>
      </div>
    </section>

    <!-- 10. COUNTER -->
    <section class="demo-section">
      <h2>10. Counter (Contador Animado)</h2>
      <div class="counter-container" ref="counterContainer">
        <div class="counter-item">
          <h3 class="counter-number">{{ counter1 }}</h3>
          <p>Membros</p>
        </div>
        <div class="counter-item">
          <h3 class="counter-number">{{ counter2 }}</h3>
          <p>Eventos</p>
        </div>
        <div class="counter-item">
          <h3 class="counter-number">{{ counter3 }}</h3>
          <p>Países</p>
        </div>
      </div>
    </section>

    <!-- CÓDIGO PARA COPIAR -->
    <section class="code-section">
      <h2>📋 Como Usar (Copie e Cole)</h2>
      <div class="code-box">
        <h3>1. Composable para Scroll Animation</h3>
        <pre><code>// composables/useScrollAnimation.js
import { onMounted, onUnmounted, ref } from 'vue';

export const useScrollAnimation = () => {
  const observer = ref(null);

  const observeElements = (elements, options = {}) => {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    };

    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, defaultOptions);

    elements.forEach((el) => observer.value.observe(el));
  };

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect();
    }
  });

  return { observeElements };
};
</code></pre>

        <h3>2. No seu componente Vue</h3>
        <pre><code>// YourComponent.vue
import { onMounted } from 'vue';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

const { observeElements } = useScrollAnimation();

onMounted(() => {
  const elements = document.querySelectorAll('.fade-in-up');
  observeElements(elements);
});
</code></pre>

        <h3>3. Adicione as classes CSS no seu style global</h3>
        <p>Copie o CSS abaixo para seu arquivo de estilos global</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Parallax
const parallaxOffset = ref(0);
const parallaxSection = ref(null);

// Counters
const counter1 = ref(0);
const counter2 = ref(0);
const counter3 = ref(0);

const handleScroll = () => {
  if (parallaxSection.value) {
    const rect = parallaxSection.value.getBoundingClientRect();
    const scrolled = window.scrollY;
    parallaxOffset.value = scrolled * 0.5;
  }
};

const animateCounter = (target, start, end, duration, setter) => {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      setter(end);
      clearInterval(timer);
    } else {
      setter(Math.floor(current));
    }
  }, 16);
};

onMounted(() => {
  // Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Counter animation
        if (entry.target.classList.contains('counter-container')) {
          animateCounter(0, 0, 500, 2000, (val) => counter1.value = val);
          animateCounter(0, 0, 150, 2000, (val) => counter2.value = val);
          animateCounter(0, 0, 8, 2000, (val) => counter3.value = val);
        }
      }
    });
  }, { threshold: 0.1 });

  const animatedElements = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, ' +
    '.rotate-in, .blur-in, .stagger-container, .reveal-container, ' +
    '.split-text-container, .counter-container'
  );

  animatedElements.forEach((el) => observer.observe(el));

  window.addEventListener('scroll', handleScroll);

  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<style scoped>
/* Base Styles */
.demo-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #0a0a0a;
  color: #fff;
}

h1 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  opacity: 0.7;
  margin-bottom: 4rem;
}

.demo-section {
  margin: 8rem 0;
}

.demo-section h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #60a5fa;
}

.demo-card {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;
}

.demo-card.highlight {
  background: linear-gradient(135deg, #1e3a8a, #1e40af);
  border-color: #3b82f6;
}

.demo-card.small {
  padding: 1.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* 1. FADE IN UP */
.fade-in-up {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-up.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* 2. FADE IN LEFT/RIGHT */
.fade-in-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-left.in-view {
  opacity: 1;
  transform: translateX(0);
}

.fade-in-right {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-right.in-view {
  opacity: 1;
  transform: translateX(0);
}

/* 3. SCALE IN */
.scale-in {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-in.in-view {
  opacity: 1;
  transform: scale(1);
}

/* 4. ROTATE IN */
.rotate-in {
  opacity: 0;
  transform: rotate(-10deg) scale(0.9);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.rotate-in.in-view {
  opacity: 1;
  transform: rotate(0) scale(1);
}

/* 5. BLUR IN */
.blur-in {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.blur-in.in-view {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0);
}

/* 6. STAGGER */
.stagger-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stagger-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: calc(var(--index) * 0.1s);
}

.stagger-container.in-view .stagger-item {
  opacity: 1;
  transform: translateY(0);
}

/* 7. PARALLAX */
.parallax-section {
  position: relative;
  height: 500px;
  overflow: hidden;
  border-radius: 12px;
}

.parallax-bg {
  position: absolute;
  top: -50%;
  left: 0;
  width: 100%;
  height: 200%;
  background: linear-gradient(135deg, #1e3a8a, #7c3aed);
  z-index: 0;
}

.parallax-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

/* 8. REVEAL */
.reveal-container {
  position: relative;
  overflow: hidden;
}

.reveal-content {
  transform: translateX(-100%);
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #60a5fa;
  transform: translateX(-100%);
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-container.in-view .reveal-content {
  transform: translateX(0);
}

.reveal-container.in-view .reveal-overlay {
  transform: translateX(100%);
  transition-delay: 0.3s;
}

/* 9. SPLIT TEXT */
.split-text-container {
  text-align: center;
  overflow: hidden;
}

.split-text {
  font-size: 6rem;
  font-weight: 900;
  letter-spacing: -2px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.split-text-container.in-view .split-text {
  opacity: 1;
  transform: translateY(0);
}

/* 10. COUNTER */
.counter-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: center;
}

.counter-item {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;
}

.counter-number {
  font-size: 4rem;
  font-weight: 900;
  color: #60a5fa;
  margin-bottom: 0.5rem;
}

/* Code Section */
.code-section {
  margin-top: 8rem;
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
}

.code-box {
  margin-top: 2rem;
}

.code-box h3 {
  color: #60a5fa;
  margin: 2rem 0 1rem 0;
}

pre {
  background: #0a0a0a;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #333;
}

code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .grid-2,
  .stagger-container,
  .counter-container {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2rem;
  }

  .split-text {
    font-size: 3rem;
  }

  .counter-number {
    font-size: 3rem;
  }
}
</style>