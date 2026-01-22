<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Card from './Card.vue';
import { useI18n } from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useLanguage} from '../stores/languageStore'
import { useCollection } from 'vuefire'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
const db = useFirestore()

const users = useCollection(collection(db, 'users'))
const categories = useCollection(collection(db, 'activities'))

const uselanguage = useLanguage();
const { currentLocaleKey} = storeToRefs(uselanguage);

const { t, locale } = useI18n();

const nova = {
  "day": { "pt": "Domingo", "en": "Sanday" }, 
  "hour": "6:30 PM", 
  "active": true, 
  "location": { "en": "Church", "pt": "Igreja" }, 
  "title": { "en": "Youth Meeting", "pt": "Encontro de Jovens" }
}

async function addData(){
  await addDoc(collection(db, 'activities'), nova)
}

const observeElements = (el) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  });

  el.forEach((element) => observer.observe(element));
};

watch(locale, () => {
  // Isso forçará a atualização do conteúdo quando o idioma mudar
});

onMounted(() => {
  const sections = document.querySelectorAll('.animate');
  observeElements(sections);
});
</script>

<template>
  <main>

    <!-- About Content Section -->
    <section class="about-section">
      <div class="container">
        <div class="hero-content animate">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey" class="hero-title">{{ t('_aboutTitle') }}</h1>
          </Transition>
          <div class="divider"></div>
        </div>
        <div class="about-content-grid">
          <!-- Image -->
          <div class="about-image animate">
            <Transition name="fade-blur" mode="out-in">
              <div :key="currentLocaleKey" class="image-wrapper">
                <img src="/src/assets/aboutpicture.jpeg" alt="About Life & Spirit Church" />
              </div>
            </Transition>
          </div>

          <!-- Text Content -->
          <div class="about-text animate">
            <Transition name="fade-blur" mode="out-in">
              <div :key="currentLocaleKey" class="text-content">
                <p>{{ t('_aboutDescription') }}</p>
                
                <div class="pastors-info">
                  <h3>{{ t('_aboutPastor') }}</h3>
                  <h3>{{ t('_aboutPastora') }}</h3>
                </div>

                <router-link to="/about" class="btn-more">
                  {{ t('_aboutButton') }}
                  <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </router-link>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  margin-bottom: 4rem;
}

.animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.in-view {
  opacity: 1;
  transform: translateY(0);
}

.divider {
  width: 80px;
  height: 4px;
  background: var(--color-heading);
  margin: 0 auto;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(1rem, 8vw, 3rem);
  font-weight: 800;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: var(--color-heading);
  margin: 0;
}

/* About Section */
.about-section {
  padding: 4rem 0 6rem 0;
  background: var(--color-background);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-content-grid {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 4rem;
  align-items: start;
}

/* About Image */
.about-image {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.image-wrapper {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
}

.image-wrapper:hover {
  transform: scale(1.02) translateY(-5px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.4s ease;
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

/* About Text */
.about-text {
  display: flex;
  flex-direction: column;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.text-content p {
  font-size: 1.1rem;
  line-height: 2;
  color: var(--color-text);
  text-align: justify;
  opacity: 0.9;
}

/* Pastors Info */
.pastors-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: var(--color-background-soft);
  border-left: 4px solid var(--color-heading);
  border-radius: 8px;
}

.pastors-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  letter-spacing: 0.5px;
}

/* Button */
.btn-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-more:hover {
  background: var(--color-heading);
  color: #000;
  border-color: var(--color-heading);
  transform: translateY(-2px);
}

.btn-more:hover svg {
  transform: translateX(4px);
}

.btn-more svg {
  transition: transform 0.3s ease;
}

/* Transitions */
.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: all 0.5s ease;
}

.fade-blur-enter-from {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
}

.fade-blur-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(-20px);
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .hero-section {
    height: 40vh;
    min-height: 350px;
  }

  .about-content-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about-image {
    position: relative;
    top: 0;
    max-width: 600px;
    margin: 0 auto;
  }

  .image-wrapper {
    height: 450px;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .hero-section {
    height: 35vh;
    min-height: 300px;
    margin-bottom: 3rem;
  }

  .about-section {
    padding: 3rem 0 4rem 0;
  }

  .image-wrapper {
    height: 400px;
  }

  .text-content p {
    font-size: 1rem;
    line-height: 1.8;
  }

  .pastors-info {
    padding: 1.25rem;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-section {
    margin-bottom: 2rem;
    min-height: 250px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .about-section {
    padding: 2rem 0 3rem 0;
  }

  .about-content-grid {
    gap: 2rem;
  }

  .image-wrapper {
    height: 350px;
  }

  .text-content {
    gap: 1.5rem;
  }

  .text-content p {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .pastors-info {
    padding: 1rem;
  }

  .pastors-info h3 {
    font-size: 0.9rem;
  }

  .btn-more {
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
