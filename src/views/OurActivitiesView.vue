<script setup>
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useLanguage } from '../stores/languageStore';
// Importação do repositório de atividades
import { useActivityRepository } from '@/composables/useActivityRepository';

const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);
const { t } = useI18n();

const { activities, fetchActivities, isLoading } = useActivityRepository();

const Activities = {
    title: {
        pt: "Nossas Atividades",
        en: "Our Activities"
    },
    subtitle: {
        pt: "Participe de nossas celebrações e eventos especiais",
        en: "Join our celebrations and special events"
    },
    content: {
        pt: "O Ministério Life & Spirit Church é uma congregação enraizada na Palavra de Deus e dedicada a alcançar vidas de todas as nações e raças. Fundado por Cristiano da Silva e Kauane Gomes da Mata, nosso ministério nasceu da direção divina em junho de 2019 para seguir a única doutrina: a Bíblia, totalmente inspirada por Deus.\n\nSomos uma família vibrante de crentes que vivenciam profundamente o amor e a presença de Deus, unindo-se a Jesus para expressar a alegria e o poder do Seu reino em todas as áreas da vida. Nosso centro de operações está sediado em Claremorris, Co Mayo, Irlanda, e em novembro de 2019 fomos oficialmente registrados como Igreja Cristã na Irlanda, expandindo nosso alcance e conexão com outras igrejas globalmente. Convidamos você a se juntar a nós nesta jornada para que todos possam conhecer verdadeiramente a Deus e Pai.",
        en: "Life & Spirit Church Ministry is a congregation rooted in the Word of God and dedicated to reaching lives of all nations and races. Founded by Cristiano da Silva and Kauane Gomes da Mata, our ministry was born from divine direction in June 2019 to follow the sole doctrine: the Bible, fully inspired by God.\n\nWe are a vibrant family of believers who deeply experience the love and presence of God, uniting with Jesus to express the joy and power of His kingdom in all areas of life. Our operations center is based in Claremorris, Co Mayo, Ireland, and in November 2019 we were officially registered as a Christian Church in Ireland, expanding our reach and connection with other churches globally. We invite you to join us on this journey so that everyone can truly know God the Father."
    }
};

// const activities = ref([
//   {
//     title: { pt: 'Encontro de oração - Mulheres', en: 'Women\'s Prayer Meeting' },
//     day: { pt: 'Quinta-Feira - 7:30 PM', en: 'Thursday - 7:30 PM' },
//     description: {
//       pt: 'Encontro de oração dedicado às mulheres, onde buscamos a presença de Deus em unidade.',
//       en: 'Prayer meeting dedicated to women, where we seek God\'s presence in unity.'
//     },
//     img: '/src/assets/woman.jpg'
//   },
//   {
//     title: { pt: 'Culto Oficial de Sábado', en: 'Official Saturday Service' },
//     day: { pt: 'Sábado - 7:00 PM', en: 'Saturday - 7:00 PM' },
//     description: {
//       pt: 'Nosso culto principal de louvor e adoração, celebrando a fé e a palavra.',
//       en: 'Our main service of praise and worship, celebrating faith and the word.'
//     },
//     img: '/src/assets/DSC00267.jpeg'
//   },
//   {
//     title: { pt: 'Encontro de Jovens', en: 'Youth Gathering' },
//     day: { pt: 'Domingo - 6:30 PM', en: 'Sunday - 6:30 PM' },
//     description: {
//       pt: 'Momento de comunhão e estudo da palavra para a juventude, com louvor e atividades.',
//       en: 'Time of fellowship and word study for youth, with praise and activities.'
//     },
//     img: '/src/assets/kids.jpg'
//   },
//   {
//     title: { pt: 'Culto de Oração e Estudo Bíblico', en: 'Prayer and Bible Study Service' },
//     day: { pt: 'Terça-Feira - 7:00 PM', en: 'Tuesday - 7:00 PM' },
//     description: {
//       pt: 'Um tempo para aprofundar na oração e no conhecimento das escrituras sagradas.',
//       en: 'A time to deepen in prayer and knowledge of the sacred scriptures.'
//     },
//     img: '/src/assets/prayer.jpg'
//   },
//   {
//     title: { pt: 'Encontro Teen', en: 'Teen Gathering' },
//     day: { pt: 'Sexta-Feira - 6:30 PM', en: 'Friday - 6:30 PM' },
//     description: {
//       pt: 'Encontro especial para adolescentes, com dinâmicas, louvor e reflexão.',
//       en: 'Special gathering for teenagers, with dynamics, worship, and reflection.'
//     },
//     img: '/src/assets/teen_gathering.jpg'
//   }
// ]);

watch(locale, () => {
  // Isso forçará a atualização do conteúdo quando o idioma mudar
});

onMounted(async () => {
  const sections = document.querySelectorAll('.animate');
  await fetchActivities();
  // observeElements(sections);
});
</script>

<template>
    <main>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey" class="hero-title">{{ Activities.title?.[locale] }}</h1>
          </Transition>
           <Transition name="fade-blur" mode="out-in">
            <p :key="currentLocaleKey" class="hero-subtitle">{{ Activities.subtitle?.[locale] }}</p>
          </Transition>
          <div class="scroll-indicator">
            <div class="scroll-line"></div>
          </div>
        </div>
        <div class="scroll-indicator">
          <div class="scroll-line"></div>
        </div>
      </section>

      <!-- About Content -->
      <section class="about-section">
        <div class="container">
          <div class="about-text-wrapper">
            <Transition name="fade-blur" mode="out-in">
              <div :key="currentLocaleKey" class="text-bio">
                <p v-for="(paragraph, index) in Activities.content?.[locale].split('\n\n')" :key="index" class="bio-paragraph">
                  {{ paragraph }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <!-- Activities Section -->
      <section class="activities-section">
        <div class="container">
          <div class="section-header">
            <h2>{{ locale === 'pt' ? 'Nossas Celebrações' : 'Our Celebrations' }}</h2>
            <div class="divider"></div>
          </div>
          <div v-if="isLoading" class="loading-state">
             <p>Carregando atividades...</p>
          </div>

          <div v-else class="activities-grid">
            <div 
              v-for="(activity, index) in activities" 
              :key="activity.id"
              class="activity-card"
              :class="{ 'reverse': index % 2 !== 0 }"
            >
              <div class="activity-image">
                <img :src="activity.url" :alt="activity.title?.[locale]" />
                <div class="image-overlay"></div>
              </div>
              
              <div class="activity-content">
                <div class="activity-header">
                  <h3>{{ activity.title?.[locale] }}</h3>
                  <span class="activity-time">{{ activity.day?.[locale] }}</span>
                </div>
                <p class="activity-description">{{ activity.description?.[locale] }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
</template>

<style scoped>
/* About Section */
.about-section {
  padding: 4rem 0;
  background: var(--color-background);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-text-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.about-text {
  text-align: justify;
  line-height: 2;
  font-size: 1.1rem;
  color: var(--color-text);
}

.about-text p {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

/* Activities Section */
.activities-section {
  padding: 6rem 0;
  background: var(--color-background-soft);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

/* .divider {
  width: 80px;
  height: 4px;
  background: var(--color-heading);
  margin: 0 auto;
} */

.activities-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.activity-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  background: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: var(--color-heading);
}

.activity-card.reverse {
  grid-template-columns: 1fr 1fr;
}

.activity-card.reverse .activity-image {
  order: 2;
}

.activity-card.reverse .activity-content {
  order: 1;
}

.activity-image {
  width: 100%;
  height: 100%;
  height: 350px;
  position: relative;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.activity-card:hover .activity-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.activity-card:hover .image-overlay {
  opacity: 1;
}

.activity-content {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-header h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.activity-time {
  font-size: 1rem;
  color: var(--color-text);
  opacity: 0.7;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.activity-description {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--color-text);
  opacity: 0.85;
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

  .activity-card,
  .activity-card.reverse {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .activity-card.reverse .activity-image,
  .activity-card.reverse .activity-content {
    order: initial;
  }

  .activity-image {
    min-height: 280px;
  }

  .activity-content {
    padding: 2rem;
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
    padding: 3rem 0;
  }

  .about-text {
    font-size: 1rem;
    line-height: 1.8;
  }

  .activities-section {
    padding: 4rem 0;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .activities-grid {
    gap: 2rem;
  }

  .activity-image {
    min-height: 250px;
  }

  .activity-content {
    padding: 1.5rem;
  }

  .activity-header h3 {
    font-size: 1.5rem;
  }

  .activity-description {
    font-size: 1rem;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-section {
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .about-section {
    padding: 2rem 0;
  }

  .activities-section {
    padding: 3rem 0;
  }

  .section-header h2 {
    font-size: 1.8rem;
  }

  .activity-image {
    min-height: 220px;
  }

  .activity-content {
    padding: 1.25rem;
    gap: 1rem;
  }

  .activity-header h3 {
    font-size: 1.3rem;
  }

  .activity-time {
    font-size: 0.9rem;
  }

  .activity-description {
    font-size: 0.95rem;
  }
}
</style>