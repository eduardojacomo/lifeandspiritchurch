<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useVideoWatch } from '@/stores/videoviewStore';
import { useLanguage } from '../stores/languageStore';
import videoWatch from '@/components/videoWatch.vue';
import SwiperVideosRelacionados from '@/components/SwiperVideosRelacionados.vue';
import { useI18n } from 'vue-i18n';
import {
  collection,
  getDocs,
  getDoc,
  where,
  query,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  doc
} from 'firebase/firestore';
import { useFirestore } from 'vuefire';
const videos = ref([]);
const db = useFirestore();

const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);
const { t } = useI18n();

const usevideowatch = useVideoWatch();
const { videoviewStore } = storeToRefs(usevideowatch);

// Pegando o parâmetro da rota
const route = useRoute();
const videoIdFromRoute = ref(route.params.id);

const show = ref(false);
const currentUrl = window.location.href;

const fetchVideos = async () => {
  
  const t = query(
    collection(db, 'videos'),
    where('youtubeId', '==', videoIdFromRoute.value)
  );

  const typetemp = await getDocs(t);
  const temp = typetemp.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const currentType = temp[0].type;

  const q = query(
    collection(db, 'videos'),
    where('type', '==', currentType),
    where('youtubeId', '!=', videoIdFromRoute.value),
    orderBy('publishedAt', 'desc'),
    limit(10)
  );
  const snapshot = await getDocs(q);
  console.log('snapshot', snapshot)

  videos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

function toggleMenu() {
  show.value = !show.value;
}

function shareFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  window.open(url, '_blank');
  show.value = false;
}

function shareWhatsApp() {
  const text = `Confira esse link: ${currentUrl}`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  show.value = false;
}

function copyLink() {
  navigator.clipboard.writeText(currentUrl).then(() => {
    alert('Link copiado para a área de transferência!');
    show.value = false;
  });
}


onMounted(() => {
  fetchVideos();
});

// Atualiza quando o ID mudar
watch(() => route.params.id, (newId) => {
  videoIdFromRoute.value = newId;
});

</script>

<template>
  <div class="video-page">
    <!-- Breadcrumb -->
    <div class="container">
      <div class="breadcrumb">
        <router-link class="breadcrumb-link" to="/">Home</router-link>
        <span class="separator">›</span>
        <router-link class="breadcrumb-link" to="/content/">{{ t('_nav._content') }}</router-link>
        <span class="separator">›</span>
        <span class="current">{{ t('_videoWatch._title') }}</span>
      </div>
    </div>

    <!-- Video Section -->
    <section class="video-section">
      <div class="container">
        <div class="video-layout">
          <!-- Main Video Player -->
          <div class="video-player-wrapper">
            <div class="video-player">
              <videoWatch :videoId="videoIdFromRoute" :key="videoIdFromRoute" :autoplay="false" />
            </div>

            <!-- Video Info -->
            <div class="video-info">
              <div class="video-header">
                <h1 class="video-title">{{ videoviewStore.title?.[locale] }}</h1>
                <button class="btn-share" @click="toggleMenu()">
                  <font-awesome-icon icon="fa-solid fa-share-nodes" /> 
                  <span>{{ t('_btnShare') }}</span>
                </button>

                <!-- Share Menu -->
                <Transition name="fade-scale">
                  <div v-if="show" class="share-menu">
                    <button @click="shareFacebook" class="share-option">
                      <span class="share-icon">📘</span>
                      Facebook
                    </button>
                    <button @click="shareWhatsApp" class="share-option">
                      <span class="share-icon">💬</span>
                      WhatsApp
                    </button>
                    <button @click="copyLink" class="share-option">
                      <span class="share-icon">🔗</span>
                      {{ t('_btnCopyLink') }}
                    </button>
                  </div>
                </Transition>
              </div>

              <div class="video-description">
                <p>{{ videoviewStore.description?.[locale] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Videos Section -->
    <section class="related-videos-section">
      <div class="container">
        <h2 class="section-title">{{ t('_videoWatch._title') }}</h2>
        <SwiperVideosRelacionados :videos="videos" />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Page Wrapper */
.video-page {
  min-height: 100vh;
  background: var(--color-background);
  padding-top: 80px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.breadcrumb-link:hover {
  opacity: 1;
  color: var(--color-heading);
}

.separator {
  color: var(--color-text);
  opacity: 0.5;
}

.current {
  color: var(--color-heading);
  font-weight: 500;
}

/* Video Section */
.video-section {
  padding: 2rem 0 4rem 0;
}

.video-layout {
  display: grid;
  gap: 2rem;
}

/* Video Player */
.video-player-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.video-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
}

.video-player iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Video Info */
.video-info {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-border);
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
}

.video-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.3;
  flex: 1;
}

/* Share Button */
.btn-share {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
}

.btn-share:hover {
  background: var(--color-heading);
  color: #000;
  border-color: var(--color-heading);
  transform: translateY(-2px);
}

/* Share Menu */
.share-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-size: 0.95rem;
  text-align: left;
}

.share-option:hover {
  background: var(--color-background-soft);
  color: var(--color-heading);
}

.share-icon {
  font-size: 1.2rem;
}

/* Video Description */
.video-description {
  line-height: 1.8;
  color: var(--color-text);
  opacity: 0.9;
}

.video-description p {
  font-size: 1.05rem;
}

/* Related Videos Section */
.related-videos-section {
  padding: 4rem 0 6rem 0;
  background: var(--color-background-mute);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Responsive */
@media screen and (max-width: 968px) {
  .container {
    padding: 0 1.5rem;
  }

  .video-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-share {
    align-self: flex-start;
  }

  .video-title {
    font-size: 1.5rem;
  }

  .share-menu {
    right: auto;
    left: 0;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .video-page {
    padding-top: 70px;
  }

  .breadcrumb {
    font-size: 0.8rem;
    padding: 1rem 0;
  }

  .video-section {
    padding: 1rem 0 3rem 0;
  }

  .video-info {
    padding: 1.5rem;
  }

  .video-title {
    font-size: 1.3rem;
  }

  .video-description p {
    font-size: 0.95rem;
  }

  .related-videos-section {
    padding: 3rem 0 4rem 0;
  }

  .section-title {
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  .video-player {
    border-radius: 8px;
  }

  .video-info {
    padding: 1.25rem;
  }

  .video-title {
    font-size: 1.2rem;
  }

  .btn-share {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>