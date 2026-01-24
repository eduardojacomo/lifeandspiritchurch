<template>
  <section class="app-section">
    <div class="container">
      <div class="app-content">
        <!-- Text Content -->
        <div class="text-area">
          <h2>Baixe nosso aplicativo e tenha a igreja 24 horas com você.</h2>
          
          <div class="features">
            <div class="feature" v-for="(item, index) in features" :key="index">
              <div class="feature-icon">
                <font-awesome-icon :icon="item.icon" />
              </div>
              <div class="feature-text">
                <p>{{ item.text }}</p>
              </div>
            </div>
          </div>

          <div class="store-buttons">
            <a href="#" class="store-link" aria-label="Download on Google Play">
              <img src="@/assets/GooglePlayEN.png" alt="Google Play" />
            </a>
            <a href="#" class="store-link" aria-label="Download on App Store">
              <img src="@/assets/ApleStoreEN.svg" alt="App Store" />
            </a>
          </div>
        </div>

        <!-- Phone Mockup -->
        <div class="mockup-area">
          <div class="mockup-wrapper">
            <img src="@/assets/app-mockup.png" alt="Life & Spirit Church App" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const features = ref([
  { icon: 'fa-solid fa-play', text: 'Receba conteúdos exclusivos.' },
  { icon: 'fa-solid fa-bible', text: 'Tenha a Bíblia no seu bolso.' },
  { icon: 'fa-solid fa-heart', text: 'Faça doações pelo aplicativo.' },
  { icon: 'fa-solid fa-clipboard-list', text: 'Faça inscrições nos eventos.' }
]);

const observeElements = (el) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  });
  el.forEach((element) => observer.observe(element));
};

onMounted(() => {
  const sections = document.querySelectorAll('.animate');
  observeElements(sections);
});
</script>

<style scoped>
/* App Section */
.app-section {
  background: linear-gradient(135deg, #22293b 0%, #031b6a 100%);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.app-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.app-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
  border-radius: 50%;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.app-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* Text Area */
.text-area {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.text-area h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  margin: 0;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(8px);
}

.feature-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  color: #1e40af;
  font-size: 1.3rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.feature:hover .feature-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.feature-text {
  flex: 1;
}

.feature-text p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  font-weight: 500;
}

/* Store Buttons */
.store-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.store-link {
  display: inline-block;
  transition: all 0.3s ease;
}

.store-link:hover {
  transform: translateY(-4px);
}

.store-link img {
  height: 50px;
  width: auto;
  display: block;
  transition: all 0.3s ease;
}

.store-link:hover img {
  filter: brightness(1.1);
}

/* Mockup Area */
.mockup-area {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.mockup-wrapper {
  position: relative;
  max-width: 350px;
  width: 100%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.mockup-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4));
}

/* Animations */
.animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .app-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .mockup-wrapper {
    max-width: 300px;
  }

  .features {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .app-section {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1.5rem;
  }

  .app-content {
    gap: 2.5rem;
  }

  .text-area {
    gap: 2rem;
  }

  .text-area h2 {
    font-size: 1.8rem;
  }

  .feature {
    padding: 1rem;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .feature-text p {
    font-size: 0.95rem;
  }

  .mockup-wrapper {
    max-width: 280px;
  }

  .store-buttons {
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .app-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .text-area h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .feature {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .feature-text p {
    font-size: 0.9rem;
  }

  .store-buttons {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .store-link {
    width: 100%;
    max-width: 200px;
  }

  .store-link img {
    width: 100%;
    height: auto;
  }

  .mockup-wrapper {
    max-width: 250px;
  }
}
</style>