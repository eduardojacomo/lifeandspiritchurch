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
  // loading.value = true;
  const q = query(collection(db, 'videos'), orderBy('publishedAt', 'desc'), limit(5));
  const snapshot = await getDocs(q);

  videos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //loading.value = false;
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
  setVideo (videoData);
  router.push({
    name: 'videowatch',
    params: {
      id: videoData.youtubeId // O parâmetro que você espera na sua rota (ex: /detalhes-video/:id)
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
      <div class="hero-content animate">
         <Transition name="fade-blur" mode="out-in">
              <h1 :key="currentLocaleKey" class="hero-title">{{ t('_contentTitle') }}</h1>
            </Transition>
            <div class="divider"></div>
            <!-- <Transition name="fade-blur" mode="out-in">
              <h3 :key="currentLocaleKey">{{ t('_contentDescription') }}</h3>
            </Transition> -->

        </div>

      <div class="container">
        <div class="content-grid" v-if="videos.length">
          <!-- Main Featured Video -->
          <div class="video-featured" @click="openVideoSelected(videos[0])">
            <div class="video-thumbnail">
              <img :src="videos[0].thumbnails?.high" :alt="videos[0].title?.[locale]" />
              <div class="video-overlay">
                <div class="play-icon">▶</div>
              </div>
            </div>
            <div class="video-details">
              <div class="video-meta">
                <span class="video-tag">Palavras</span>
                <span class="video-date">{{ formatDate(videos[0].publishedAt) }}</span>
              </div>
              <h2 class="video-title">{{ videos[0].title?.[locale] }}</h2>
            </div>
          </div>

          <!-- Secondary Videos -->
          <div class="videos-secondary">
            <div 
              v-for="video in videos.slice(1, 3)" 
              :key="video.id"
              class="video-secondary"
              @click="openVideoSelected(video)"
            >
              <div class="video-thumbnail">
                <img :src="video.thumbnails?.medium" :alt="video.title?.[locale]" />
                <div class="video-overlay">
                  <div class="play-icon">▶</div>
                </div>
              </div>
              <div class="video-details">
                <div class="video-meta">
                  <span class="video-tag">Palavras</span>
                  <span class="video-date">{{ formatDate(video.publishedAt) }}</span>
                </div>
                <h3 class="video-title">{{ video.title?.[locale] }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="view-all-wrapper">
          <router-link to="/content" class="btn-view-all">
           {{ t('_contentDescription') }}
            <font-awesome-icon icon="fa-solid fa-arrow-right" />
          </router-link>
        </div>
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
.divider {
  width: 80px;
  height: 4px;
  background: var(--color-heading);
  margin: 0 auto;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
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

.animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Featured Video */
.video-featured {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.video-featured:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.video-featured:hover .video-thumbnail img,
.video-secondary:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.video-featured:hover .video-overlay,
.video-secondary:hover .video-overlay {
  opacity: 1;
}

.play-icon {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #000;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.video-featured:hover .play-icon,
.video-secondary:hover .play-icon {
  transform: scale(1);
}

.video-details {
  padding: 1.5rem;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.video-tag {
  padding: 0.375rem 0.875rem;
  background: var(--color-heading);
  color: #000;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.video-date {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.video-featured .video-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.video-featured:hover .video-title {
  color: var(--color-text);
}

/* Secondary Videos */
.videos-secondary {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.video-secondary {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.video-secondary:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.video-secondary .play-icon {
  width: 50px;
  height: 50px;
  font-size: 1.3rem;
}

.video-secondary .video-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.video-secondary:hover .video-title {
  color: var(--color-text);
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
  background: var(--color-heading);
  color: #000;
  border: none;
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
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
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
  .hero-section {
    height: 40vh;
    min-height: 350px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .videos-secondary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
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

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .content-section {
    padding: 3rem 0 4rem 0;
  }

  .content-grid {
    gap: 1.5rem;
  }

  .videos-secondary {
    grid-template-columns: 1fr;
  }

  .video-details {
    padding: 1.25rem;
  }

  .video-featured .video-title {
    font-size: 1.3rem;
  }

  .video-secondary .video-title {
    font-size: 1rem;
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

  .hero-subtitle {
    font-size: 1rem;
  }

  .content-section {
    padding: 2rem 0 3rem 0;
  }

  .video-details {
    padding: 1rem;
  }

  .video-featured .video-title {
    font-size: 1.2rem;
  }

  .video-secondary .video-title {
    font-size: 0.95rem;
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

  .video-secondary .play-icon {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }
}
</style>
