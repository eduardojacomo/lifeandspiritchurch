<script setup>
import { onMounted, ref } from 'vue';
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import HeroSlider from './Tools/HeroSlider.vue';
import { text } from '@fortawesome/fontawesome-svg-core';

const db = getFirestore();

const CACHE_KEY = 'church_hero_cache_v2'; // Versão 2 por causa da nova estrutura
const CACHE_TIME = 1000 * 60 * 60 * 4; 

const slidesData = ref([]);
const isLoading = ref(true);

async function loadHeroImages() {
  isLoading.value = true;

  // 1. Tenta Cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TIME) {
      slidesData.value = data;
      isLoading.value = false;
      return;
    }
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // 2. Query no Firestore
    const q = query(
      collection(db, 'images'),
      where('page', '==', 'home'),
      where('location', '==', 'hero'),
      where('status', '==', 'active')
    );

    const querySnapshot = await getDocs(q);
    const fetchedSlides = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      console.log('Hero Image Data:', data); // Log para depuração
      // Filtro de expiração
      if (data.expired_at && data.expired_at < today) return;

      // Passamos o objeto quase como ele é, o Slider resolve a tradução
      fetchedSlides.push({
        id: docSnap.id,
        url: data.url,
        url_mobile: data.url_mobile,
        heroTitle: data.heroTitle, // { pt, en }
        heroDesc: data.heroDesc,   // { pt, en }
        buttonLabel: data.buttonLabel, // { pt, en }
        buttonLink: data.buttonLink,
        order: data.order || 0,
        location: data.location,
        textPosition: data.textPosition || 'left'
      });
    });

    // 3. Ordenação
    fetchedSlides.sort((a, b) => a.order - b.order);

    // 4. Salva Cache e Atualiza State
    slidesData.value = fetchedSlides;
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: fetchedSlides
    }));

  } catch (err) {
    console.error('Erro ao carregar hero section:', err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadHeroImages();
});
</script>

<template>
  <main>
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="skeleton-container">
      <div class="skeleton-banner"></div>
      <div class="skeleton-nav">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <!-- Hero Slider -->
    <hero-slider 
      v-else-if="slidesData.length > 0"
      :slides="slidesData"
      :autoplay="true"
      :interval="10000"
    />

    <!-- Fallback quando não há imagens -->
    <div v-else class="empty-hero">
      <div class="empty-content">
        <h2>Bem-vindo</h2>
        <p>Nenhuma imagem disponível no momento</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  position: relative;
}

/* Skeleton Styles */
.skeleton-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: #f0f0f0;
}

.skeleton-banner {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-nav {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.skeleton-nav span {
  width: 14px;
  height: 14px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: skeleton-pulse 1.5s infinite;
}

.skeleton-nav span:nth-child(2) {
  animation-delay: 0.2s;
}

.skeleton-nav span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes skeleton-loading {
  0% { 
    background-position: 200% 0; 
  }
  100% { 
    background-position: -200% 0; 
  }
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

/* Empty Hero */
.empty-hero {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.empty-content {
  text-align: center;
  padding: 40px;
}

.empty-content h2 {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  margin-bottom: 16px;
}

.empty-content p {
  font-size: clamp(16px, 2vw, 20px);
  opacity: 0.9;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .skeleton-container {
    height: 100vh;
  }
  
  .skeleton-nav {
    bottom: 100px;
  }
}
</style>