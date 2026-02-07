<template>
  <div class="hero-animated">
    <!-- Background com partículas -->
    <div class="particles-bg">
      <div class="particle" v-for="n in 50" :key="n" :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- Gradient overlay -->
    <div class="gradient-overlay"></div>

    <!-- Conteúdo -->
    <div class="hero-content">
      <div class="container">
        <!-- Tag/Badge -->
        <div v-if="tag" class="tag">{{ tag }}</div>

        <!-- Título com texto rotativo -->
        <h1 class="hero-title">
          {{ titlePrefix }}
          <span class="rotating-text">
            <transition name="slide-up" mode="out-in">
              <span :key="currentWordIndex" class="word">
                {{ rotatingWords[currentWordIndex] }}
              </span>
            </transition>
          </span>
          <span class="cursor">|</span>
        </h1>

        <!-- Subtítulo -->
        <p class="hero-subtitle">{{ subtitle }}</p>

        <!-- Stats/Números -->
        <div v-if="stats && stats.length > 0" class="stats">
          <div v-for="(stat, index) in stats" :key="index" class="stat-item">
            <div class="stat-number">
              <animated-number :value="stat.value" :duration="2000" />{{ stat.suffix || '' }}
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          <button 
            v-for="(action, index) in actions" 
            :key="index"
            :class="['btn', action.variant || 'primary']"
            @click="action.onClick"
          >
            <span>{{ action.label }}</span>
            <svg v-if="action.icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        <!-- Scroll indicator -->
        <div v-if="showScrollIndicator" class="scroll-indicator">
          <div class="scroll-mouse">
            <div class="scroll-wheel"></div>
          </div>
          <span>Role para explorar</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  titlePrefix: {
    type: String,
    default: 'Bem-vindo à'
  },
  rotatingWords: {
    type: Array,
    default: () => ['Igreja', 'Família', 'Comunidade', 'Casa']
  },
  subtitle: {
    type: String,
    default: 'Um lugar onde você pode crescer, servir e se conectar'
  },
  tag: {
    type: String,
    default: ''
  },
  stats: {
    type: Array,
    default: () => []
  },
  actions: {
    type: Array,
    default: () => []
  },
  showScrollIndicator: {
    type: Boolean,
    default: true
  },
  rotationInterval: {
    type: Number,
    default: 3000
  }
});

const currentWordIndex = ref(0);
let rotationTimer = null;


const getParticleStyle = (n) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 10}s`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
  };
};

const rotateWords = () => {
  currentWordIndex.value = (currentWordIndex.value + 1) % props.rotatingWords.length;
};

onMounted(() => {
  rotationTimer = setInterval(rotateWords, props.rotationInterval);
  
});

onUnmounted(() => {
  if (rotationTimer) clearInterval(rotationTimer);
});
</script>

<script>
export default {
  components: {
    'animated-number': {
      props: ['value', 'duration'],
      data() {
        return {
          displayValue: 0
        };
      },
      mounted() {
        const increment = this.value / (this.duration / 16);
        const timer = setInterval(() => {
          this.displayValue += increment;
          if (this.displayValue >= this.value) {
            this.displayValue = this.value;
            clearInterval(timer);
          }
        }, 16);
      },
      template: '<span>{{ Math.floor(displayValue) }}</span>'
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');

.hero-animated {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 50%, #020617 100%);
}

/* Partículas de fundo */
.particles-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.3) 0%,
    rgba(15, 23, 42, 0.5) 50%,
    rgba(2, 6, 23, 0.7) 100%
  );
}

/* Conteúdo */
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 100px 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.tag {
  display: inline-block;
  padding: 10px 24px;
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 30px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #60a5fa;
  margin-bottom: 40px;
  animation: fadeIn 0.8s ease-out;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(40px, 7vw, 90px);
  font-weight: 700;
  line-height: 1.1;
  color: #ffffff;
  margin-bottom: 30px;
  animation: fadeSlideUp 0.8s ease-out 0.2s both;
}

.rotating-text {
  display: inline-block;
  position: relative;
  color: #60a5fa;
  min-width: 300px;
  text-align: left;
}

.word {
  display: inline-block;
}

.cursor {
  display: inline-block;
  color: #60a5fa;
  animation: blink 1s step-end infinite;
  margin-left: 4px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.hero-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  max-width: 700px;
  margin: 0 auto 50px;
  animation: fadeSlideUp 0.8s ease-out 0.4s both;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
  max-width: 800px;
  margin: 0 auto 50px;
  padding: 40px 0;
  animation: fadeSlideUp 0.8s ease-out 0.6s both;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  color: #60a5fa;
  line-height: 1;
  margin-bottom: 12px;
}

.stat-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
}

/* Actions */
.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeSlideUp 0.8s ease-out 0.8s both;
}

.btn {
  padding: 18px 40px;
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
}

.btn.secondary {
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: fadeIn 1s ease-out 1.5s both;
}

.scroll-mouse {
  width: 28px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-wheel {
  width: 3px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  animation: scrollWheel 1.5s ease-in-out infinite;
}

@keyframes scrollWheel {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

.scroll-indicator span {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    padding: 80px 24px;
  }
  
  .rotating-text {
    min-width: 200px;
  }
  
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .actions {
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>