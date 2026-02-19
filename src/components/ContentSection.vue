<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useLanguage} from '../stores/languageStore'
import { useVideoWatch } from '@/stores/videoviewStore';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  doc
} from 'firebase/firestore';
import { useFirestore } from 'vuefire';

const db = useFirestore();
const videos = ref([]);

const uselanguage = useLanguage();
const { currentLocaleKey, locale} = storeToRefs(uselanguage);

const usevideowatch = useVideoWatch();
const {setVideo} = usevideowatch;
const {videoviewStore} = storeToRefs(usevideowatch);

const router = useRouter();
const resolucao = ref('');
const { t } = useI18n();

const fetchVideos = async () => {
  const q = query(collection(db, 'videos'), orderBy('publishedAt', 'desc'), limit(5));
  const snapshot = await getDocs(q);
  videos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
};

function openVideoSelected(videoData){
  setVideo(videoData);
  router.push({
    name: 'videowatch',
    params: {
      id: videoData.youtubeId
    }
  });
}

onMounted(() => {
  fetchVideos();
  const sections = document.querySelectorAll('.animate');
  observeElements(sections);
});
</script>

<template>
  <main>
    <!-- Featured Content Section -->
    <section class="content-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey" class="section-title">{{ t('_contentTitle') }}</h1>
          </Transition>
          <div class="divider"></div>
        </div>

        <div v-if="videos.length">
          <!-- Main Featured Video -->
          <div class="featured-wrapper">
            <transition name="fade-blur" mode="out-in">
              <div class="featured-video" @click="openVideoSelected(videos[0])" :key="currentLocaleKey">
                <div class="featured-thumbnail">
                  <img :src="videos[0].thumbnails?.high" :alt="videos[0].title?.[locale]" />
                  <div class="video-overlay">
                    <div class="play-icon">▶</div>
                  </div>
                </div>
              </div>
            </transition> 

            <transition name="fade-blur" mode="out-in">
             <div class="featured-info" :key="currentLocaleKey">
              <div class="video-meta">
                <span class="video-tag">Palavras</span>
                <span class="video-date">{{ formatDate(videos[0].publishedAt) }}</span>
              </div>
              <h2 class="featured-title">{{ videos[0].title?.[locale] }}</h2>
              <p class="featured-description" v-if="videos[0].description">
                {{ videos[0].description?.[locale] }}
              </p>
              <button class="btn-watch" @click="openVideoSelected(videos[0])">
                <font-awesome-icon icon="fa-solid fa-play" />
                Assistir Agora
              </button>
            </div>
            </transition>
          </div>

          <!-- Secondary Videos Grid -->
          <div class="secondary-section">
            <transition name="fade-blur" mode="out-in">
              <h3 class="secondary-title">{{ t('_videoRecent._title') || 'Vídeos Recentes' }}</h3>
            </transition>
            <transition name="fade-blur" mode="out-in">
              <div class="secondary-grid" :key="currentLocaleKey">
                <div 
                  v-for="video in videos.slice(1, 5)" 
                  :key="video.id"
                  class="video-card"
                  @click="openVideoSelected(video)"
                >
                  <div class="card-thumbnail">
                    <img :src="video.thumbnails?.medium" :alt="video.title?.[locale]" />
                    <div class="video-overlay">
                      <div class="play-icon-small">▶</div>
                    </div>
                  </div>
                  <div class="card-content">
                    <div class="video-meta">
                      <span class="video-tag-small">Palavras</span>
                      <span class="video-date-small">{{ formatDate(video.publishedAt) }}</span>
                    </div>
                    <h4 class="card-title">{{ video.title?.[locale] }}</h4>
                  </div>
                </div>
              </div>
            </transition> 
          </div>
        </div>

        <!-- View All Button -->
        <transition name="fade-blur" mode="out-in">
          <div class="view-all-wrapper" :key="currentLocaleKey">
            <router-link to="/content" class="btn-view-all">
              {{ t('_contentDescription') }}
              <font-awesome-icon icon="fa-solid fa-arrow-right" />
            </router-link>
          </div>
        </transition>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Content Section */
.content-section {
  padding: 4rem 0 6rem 0;
  background: var(--color-background);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  margin: 0 auto;
  border-radius: 2px;
}

/* Animation */
.animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Featured Video Section */
.featured-wrapper {
  display: flex;
  gap: 3rem;
  margin-bottom: 5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.featured-wrapper:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.featured-video {
  flex: 1.2;
  cursor: pointer;
}

.featured-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}

.featured-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.featured-video:hover .featured-thumbnail img {
  transform: scale(1.05);
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-video:hover .video-overlay {
  opacity: 1;
}

.play-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #000;
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.featured-video:hover .play-icon {
  transform: scale(1);
}

/* Featured Info */
.featured-info {
  flex: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.video-tag {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.video-date {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.7;
}

.featured-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.3;
  margin: 0 0 1rem 0;
}

.featured-description {
  font-size: 1rem;
  color: var(--color-text);
  line-height: 1.7;
  opacity: 0.8;
  margin-bottom: 2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-watch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.btn-watch:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

/* Secondary Videos Section */
.secondary-section {
  margin-bottom: 4rem;
}

.secondary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 2rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
}

.secondary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Video Card */
.video-card {
  cursor: pointer;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.card-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .card-thumbnail img {
  transform: scale(1.08);
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.play-icon-small {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #000;
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.video-card:hover .play-icon-small {
  transform: scale(1);
}

.card-content {
  padding: 1.25rem;
}

.video-tag-small {
  padding: 0.375rem 0.75rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.video-date-small {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.4;
  margin: 1rem 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.video-card:hover .card-title {
  color: var(--color-primary);
}

/* View All Button */
.view-all-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 3rem;
  background: transparent;
  color: var(--color-heading);
  border: 2px solid var(--color-border);
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-view-all:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.btn-view-all:hover svg {
  transform: translateX(4px);
}

.btn-view-all svg {
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
  .featured-wrapper {
    flex-direction: column;
    gap: 0;
  }

  .featured-info {
    padding: 2rem;
  }

  .secondary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .content-section {
    padding: 3rem 0 4rem 0;
  }

  .featured-wrapper {
    margin-bottom: 3rem;
  }

  .featured-info {
    padding: 1.5rem;
  }

  .featured-description {
    -webkit-line-clamp: 2;
  }

  .secondary-grid {
    grid-template-columns: 1fr;
  }

  .btn-watch {
    width: 100%;
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .content-section {
    padding: 2rem 0 3rem 0;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .featured-info {
    padding: 1.25rem;
  }

  .featured-title {
    font-size: 1.3rem;
  }

  .btn-watch {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }

  .btn-view-all {
    padding: 1rem 2rem;
    font-size: 0.95rem;
  }

  .play-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .play-icon-small {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
}
</style>