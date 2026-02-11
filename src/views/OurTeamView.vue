<script setup>
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useLanguage } from '../stores/languageStore';
import { useTeamRepository } from '@/composables/useTeamRepository';

const uselanguage = useLanguage();
const { locale, currentLocaleKey } = storeToRefs(uselanguage);

const { teamItems, fetchTeam, isLoading } = useTeamRepository();

onMounted(async () => {
  await fetchTeam();
});

const mainAboutMember = computed(() => {
  return teamItems.value.find(m => m.isMainAbout) || null;
});

// Lógica de ordenação e filtro
const teamList = computed(() => {
  if (!teamItems.value) return [];

  return [...teamItems.value]
    // 1. Filtra para remover quem tem ordem 0 ou nula
    .filter(member => member.ordem !== 0 && member.ordem !== '0' && member.ordem)
    // 2. Ordena
    .sort((a, b) => {
      // Primeiro critério: Ordem numérica (Crescente: 1, 2, 3...)
      const diff = a.ordem - b.ordem;
      
      if (diff !== 0) {
        return diff;
      }

      // Segundo critério (Desempate): Ordem Alfabética
      return a.nome.localeCompare(b.nome);
    });
});
</script>

<template>
  <main class="pastors-page">
    <!-- Hero Section com Gradiente Melhorado -->
    <section class="hero-section">
      <div class="hero-overlay">
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content">
        <!-- <div class="hero-badge">
          {{ locale === 'pt' ? 'Liderança' : 'Leadership' }}
        </div> -->
        <h1 class="hero-title">
          {{ locale === 'pt' ? 'Nossa Equipe' : 'Our Team' }}
        </h1>
        <p class="hero-subtitle">
          {{ locale === 'pt' 
            ? 'Conheça a equipe dedicada que lidera nossa comunidade' 
            : 'Meet the dedicated team leading our community' 
          }}
        </p>
      </div>
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- About Section - Pastor Principal -->
    <section class="about-section">
      <div class="container">
        <div v-if="mainAboutMember" class="about-content-grid">
          <!-- Imagem do Pastor com Overlay -->
          <div class="pastor-image-wrapper">
            <div class="image-decoration"></div>
            <div class="pastor-image-container">
              <img :src="mainAboutMember.url" :alt="mainAboutMember.nome" />
              <div class="image-overlay"></div>
            </div>
          </div>

          <!-- Texto sobre o Pastor -->
          <div class="text-wrapper">
            <div class="section-label">
              {{ locale === 'pt' ? 'Sobre' : 'About' }}
            </div>
            <h2 class="pastor-name">{{ mainAboutMember.nome }}</h2>
            <!-- <div class="pastor-role">
              {{ mainAboutMember.cargo?.[locale] }}
            </div> -->
            
            <Transition name="fade-blur" mode="out-in">
              <div :key="currentLocaleKey + mainAboutMember.id" class="text-bio">
                <p v-for="(p, i) in mainAboutMember.about?.[locale]?.split('\n')" :key="i" class="bio-paragraph">
                  {{ p.trim() }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div class="team-header">
          <div class="section-label centered">
            {{ locale === 'pt' ? 'Nossa Equipe' : 'Our Team' }}
          </div>
          <h2 class="section-title">
            {{ locale === 'pt' ? 'Equipe Ministerial' : 'Ministry Team' }}
          </h2>
          <div class="divider"></div>
        </div>

        <div class="team-grid">
          <div 
            v-for="member in teamList" 
            :key="member.id" 
            class="card"
          >
            <div class="card-image-wrapper">
              <img :src="member.url" :alt="member.nome" class="card-image" />
              <div class="card-overlay"></div>
            </div>
            <div class="card-content">
              <h3 class="card-name">{{ member.nome }}</h3>
              <p class="card-role">{{ member.cargo?.[locale] }}</p>
              <p class="card-role">{{ member.ministerio }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.pastors-page {
  background: var(--color-background);
  overflow-x: hidden;
}


/* ========== ABOUT SECTION ========== */
.about-section {
  padding: 8rem 0;
  position: relative;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-content-grid {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 6rem;
  align-items:flex-start;
}

/* Pastor Image */
.pastor-image-wrapper {
  position: relative;
}

.image-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: -20px;
  left: -20px;
  border: 2px solid rgba(90, 163, 228, 0.2);
  border-radius: 16px;
  z-index: 0;
}

.pastor-image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  z-index: 1;
}

.pastor-image-container img {
  width: 100%;
  height: 650px;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.6s ease;
}

.pastor-image-container:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

/* Pastor Text */
.pastor-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}


.pastor-name {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--color-heading);
  margin: 0;
  line-height: 1.2;
}

.pastor-role {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  margin-bottom: 1rem;
}

.pastor-bio {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bio-paragraph {
  font-size: 1.125rem;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.8);
  text-align: justify;
  margin: 0;
}

.bio-paragraph:first-of-type::first-letter {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  float: left;
  margin: 0.1rem 0.5rem 0 0;
  color: var(--color-primary);
}

/* ========== TEAM SECTION ========== */
.team-section {
  padding: 6rem 0 8rem 0;
  background: linear-gradient(180deg, var(--color-background) 0%, rgba(15, 15, 25, 1) 100%);
}

.team-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--color-heading);
  margin: 1rem 0;
  letter-spacing: -1px;
}



.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Team Card */
.team-card {
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.team-card:hover {
  transform: translateY(-10px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 
    0 20px 40px -10px rgba(99, 102, 241, 0.2),
    0 0 0 1px rgba(99, 102, 241, 0.1);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.6s ease;
}

.team-card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(20, 20, 30, 0.9) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.team-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  padding: 2rem 1.5rem;
  text-align: center;
}

.card-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.card-role {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 500;
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

/* ========== RESPONSIVE ========== */
@media screen and (max-width: 1024px) {
  .hero-section {
    height: 70vh;
    min-height: 500px;
  }

  .about-content-grid {
    grid-template-columns: 1fr;
    gap: 4rem;
  }

  .pastor-image-wrapper {
    max-width: 500px;
    margin: 0 auto;
  }

  .pastor-image-container img {
    height: 550px;
  }

  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
}

@media screen and (max-width: 768px) {
  .hero-section {
    min-height: 450px;
  }

  .hero-badge {
    font-size: 0.75rem;
    padding: 0.4rem 1.2rem;
  }

  .about-section {
    padding: 5rem 0;
  }

  .about-content-grid {
    gap: 3rem;
  }

  .pastor-image-container img {
    height: 500px;
  }

  .bio-paragraph {
    font-size: 1rem;
    line-height: 1.8;
  }

  .team-section {
    padding: 4rem 0 6rem 0;
  }

  .team-header {
    margin-bottom: 3rem;
  }

  .team-grid {
    gap: 1.5rem;
  }

  .card-image-wrapper {
    height: 300px;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1.25rem;
  }

  .hero-section {
    min-height: 400px;
  }

  .scroll-indicator {
    display: none;
  }

  .about-section {
    padding: 4rem 0;
  }

  .pastor-image-wrapper {
    max-width: 100%;
  }

  .image-decoration {
    top: -10px;
    left: -10px;
  }

  .pastor-image-container img {
    height: 450px;
  }

  .bio-paragraph:first-of-type::first-letter {
    font-size: 2.5rem;
  }

  .team-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .card-content {
    padding: 1.5rem 1rem;
  }
}
</style>