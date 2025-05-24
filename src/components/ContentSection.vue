<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useLanguage} from '../stores/languageStore'
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


onMounted(() => {
  fetchVideos();
  const sections = document.querySelectorAll('.animate');
  observeElements(sections);
});
</script>

<template>
    <main>
      <div class="container">
        <div class="title animate">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey">{{ t('_contentTitle') }}</h1>
          </Transition>
          <Transition name="fade-blur" mode="out-in">
            <h3 :key="currentLocaleKey">{{ t('_contentDescription') }}</h3>
          </Transition>
        </div>
        
        <div class="video-grid animate">
          <div class="video-main" v-if="videos.length">
            <img :src="videos[0].thumbnails?.high" alt="" />
            <div class="video-info-main">
              <span class="tag">Palavras</span>
              <span class="date">{{ formatDate(videos[0].publishedAt) }}</span>
              <h2>{{ videos[0].title?.[locale] }} </h2>
            </div>
          </div>

          <div class="video-side animate">
            <div class="video-side-item" v-for="video in videos.slice(1, 3)" :key="video.id">
              <img :src="video.thumbnails?.medium" alt="" />
              <div class="video-info">
                <span class="tag">Palavras</span>
                <span class="date">{{ formatDate(video.publishedAt) }}</span>
                <p>{{ video.title?.[locale] || 'Sem título' }}</p>
              </div>
            </div>
          </div>
        </div>

  
        
      </div>
    </main>
  </template>
  

<style scoped>

/* Estilos para as animações do modal com translateX */
@keyframes slide-in-white {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-in-black {
  0% {
    transform: translateX(100%);
  }
  50%{
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

/* Transição para a opacidade do conteúdo do modal */
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 87vh;
  width: 100%;
  padding: 70px 2rem 0.5rem 2rem;
}

.title {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 0.8rem 1rem;
}

.title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
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

.video-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  /* margin-top: 2rem; */
  padding: 0 10rem;
  justify-content: flex-start;
}

.video-main {
  position: relative;

  overflow: hidden;
  width: 610px;
  height: 390px;
}

.video-main img {
  width: 100%;
  border-radius: 8px;
  height: auto;
  object-fit: contain;
}

.video-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.video-side-item {
  position: relative;
  overflow: hidden;
}

.video-side-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.video-info, .video-info-main {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  background: rgba(0, 0, 0, 0.628);
  padding: 0.5rem;
  border-radius: 8px;
  max-width: 90%;
}

.video-info .tag, .video-info-main .tag {
  background: white;
  color: black;
  padding: 2px 8px;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 8px;
}

.video-info .date, .video-info-main .date {
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

.video-info h2, .video-info p, .video-info-main h2, .video-info-main p {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
}


@media screen and (max-width: 1092px){
  .projects{
    justify-content: center;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 70px 0.5rem 0.5rem 0.5rem;
  }

  .video-grid{
    padding: 0 1rem;
  }

  .projects {
    padding: 1rem;
  }

  .image-content {
    flex-direction: column;
  }

  .text h2 {
    font-size: 1.1rem;
  }

  .text p {
    font-size: 0.9rem;
  }
}


</style>
