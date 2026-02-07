<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => []
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000 // Reduzi para 5s para exemplo, ajuste conforme necessário
  }
});

/* ================= STATE ================= */
const currentSlide = ref(0);
const progressWidth = ref(0);
const isMobile = ref(false); // Controle de dispositivo
let autoplayInterval = null;
let progressInterval = null;

/* ================= DEVICE DETECTION ================= */
const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768;
};

/* ================= HELPERS (MULTI-LANGUAGE & MEDIA) ================= */
// Retorna a URL correta (Mobile ou Desktop) baseada no dispositivo
const getMediaUrl = (slide) => {
  if (isMobile.value && slide.url_mobile) {
    return slide.url_mobile;
  }
  return slide.url; // Fallback para desktop
};

// Retorna o texto traduzido baseado no local atual (pt ou en)
const getLocaleText = (obj) => {
  if (!obj) return '';
  return obj[locale.value] || obj['pt'] || ''; // Fallback para PT
};

/* ================= SLIDER LOGIC ================= */
const goToSlide = (index) => {
  currentSlide.value = index;
  resetProgress();
};

const nextSlide = () => {
  if (props.slides.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % props.slides.length;
  resetProgress();
};

const prevSlide = () => {
  if (props.slides.length === 0) return;
  currentSlide.value = (currentSlide.value - 1 + props.slides.length) % props.slides.length;
  resetProgress();
};

const resetProgress = () => {
  progressWidth.value = 0;
  clearInterval(progressInterval);
  startProgress();
};

const startProgress = () => {
  const step = 100 / (props.interval / 50);
  progressInterval = setInterval(() => {
    progressWidth.value += step;
    if (progressWidth.value >= 100) progressWidth.value = 0;
  }, 50);
};

const startAutoplay = () => {
  if (props.autoplay && props.slides.length > 1) {
    autoplayInterval = setInterval(nextSlide, props.interval);
  }
};

const stopAutoplay = () => {
  clearInterval(autoplayInterval);
  clearInterval(progressInterval);
};

onMounted(() => {
  checkDevice();
  window.addEventListener('resize', checkDevice);
  startAutoplay();
  startProgress();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice);
  stopAutoplay();
});
</script>

<template>
  <div class="hero-slider">
    <div class="slides">
      <div 
        v-for="(slide, index) in slides" 
        :key="slide.id || index"
        class="slide"
        :class="{ active: currentSlide === index }"
      >
        <div class="slide-bg">
          <img 
            :src="getMediaUrl(slide)" 
            :alt="getLocaleText(slide.heroTitle)"
            class="slide-media"
          >
          <div class="overlay"></div>
        </div>

        <div class="slide-content" :class="[`text-${slide.textPosition || 'left'}`]">
          <div class="container">
            
            <h1 class="title">{{ getLocaleText(slide.heroTitle) }}</h1>
            <p class="subtitle">{{ getLocaleText(slide.heroDesc) }}</p>
            
            <div class="actions" v-if="slide.buttonLabel && slide.buttonLink && slide.buttonLink !== ''">
              <a 
                v-if="slide.buttonLink"
                :href="slide.buttonLink"
                class="btn primary"
              >
                {{ getLocaleText(slide.buttonLabel) }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-container">
      <div class="container">
        <div class="nav-dots">
          <button 
            v-for="(slide, index) in slides" 
            :key="'dot-' + index"
            :class="['dot', { active: currentSlide === index }]"
            @click="goToSlide(index)"
          >
            <div class="dot-label"></div>
          </button>
        </div>
      </div>
    </div>

    <button class="arrow arrow-prev" @click="prevSlide">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <button class="arrow arrow-next" @click="nextSlide">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800&display=swap');

.hero-slider {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000000;
}

/* Slides */
.slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 1s ease, visibility 1s ease;
}

.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}

.slide-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.slide-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s ease; /* Suaviza a entrada */
}

/* Opcional: Reinicia o Ken Burns apenas no slide ativo */
.slide.active .slide-media {
  animation: kenBurns 20s ease-out forwards;
}

@keyframes kenBurns {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

/* Conteúdo */
.slide-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 100px 40px;
}

/* Alinhamento à Esquerda (Padrão) */
.slide-content.text-left {
  justify-content: flex-start;
  text-align: left;
}

/* Centralizado */
.slide-content.text-center {
  justify-content: center;
  text-align: center;
}

/* Alinhamento à Direita */
.slide-content.text-right {
  justify-content: flex-end;
  text-align: right;
}

/* Ajuste nos botões para seguirem o alinhamento */
.text-center .actions {
  justify-content: center;
}

.text-right .actions {
  justify-content: flex-end;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 50px;
}



.title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 8vw, 120px);
  font-weight: 400;
  letter-spacing: 2px;
  line-height: 0.95;
  color: #ffffff;
  margin-bottom: 12px;
  text-transform: uppercase;

}

.subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 20px;

}

.actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

}

.slide:not(.active) .title,
.slide:not(.active) .subtitle,
.slide:not(.active) .actions {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.5s ease; /* Transição suave ao sair */
}

/* Quando o slide for ativo, anime os filhos */
.slide.active .title {
  animation: fadeSlideUp 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s both;
}

.slide.active .subtitle {
  animation: fadeSlideUp 1s cubic-bezier(0.23, 1, 0.32, 1) 0.6s both;
}

.slide.active .actions {
  animation: fadeSlideUp 1s cubic-bezier(0.23, 1, 0.32, 1) 0.8s both;
}

.btn {
  padding: 18px 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn.primary {
  background: #ffffff;
  color: #000000;
}

.btn.primary:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
}

.btn.secondary {
  background: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Navegação */
.nav-container {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 3;
  padding: 0 40px;
}

.nav-dots {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.dot {
  position: relative;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot-label {
  /* font-family: 'Bebas Neue', sans-serif;
  font-size: 28px; */
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  border: none;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.4);
  /* display: block;
  letter-spacing: 2px; */
}

.dot.active .dot-label {
  background-color: #ffffff;
  font-size: 36px;
}


.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.arrow:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.arrow-prev {
  left: 5px;
}

.arrow-next {
  right: 5px;
}

/* Progress bar */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 3;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  transition: width 0.05s linear;
}

/* Animações */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px) skewY(2deg); /* Um leve inclinar dá um toque moderno */
  }
  to {
    opacity: 1;
    transform: translateY(0) skewY(0deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .slide-content {
    padding: 0 24px;
  }
  
  .nav-container {
    bottom: 100px;
    padding: 0 24px;
  }
  
  .nav-dots {
    gap: 20px;
  }
  
  .dot-label {
    font-size: 20px;
  }
  
  .dot.active .dot-label {
    font-size: 28px;
  }
  
  .arrow {
    width: 50px;
    height: 50px;
  }
  
  .arrow-prev {
    left: 24px;
  }
  
  .arrow-next {
    right: 24px;
  }
  
  .actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}
</style>