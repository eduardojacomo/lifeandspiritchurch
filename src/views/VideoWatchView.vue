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
  <div class="video-container-view">
      <div class="video-content">
        <div class="column space-between">
            <router-link class="links" to="/content/">{{ t('_linkBackContnet') }}</router-link>
            <div class="column">
                <router-link class="links" to="/">Home</router-link>
                <span> | </span>
                <router-link class="links" to="/content/">{{ t('_nav._content') }} </router-link>
            </div>
        </div>
        <div class="video-view">
            <videoWatch :videoId="videoIdFromRoute" :key="videoIdFromRoute" :autoplay="false" />
        </div>
        <div class="video-details">
            <div class="column space-between">
              <h2>{{videoviewStore.title?.[locale]}}</h2>
              <div class="share-container">
                <button class="btn-share" @click="toggleMenu()">
                  <font-awesome-icon icon="fa-solid fa-share-nodes" /> 
                  <span>{{ t('_btnShare') }}</span> 
                </button>

                <div v-if="show" class="share-menu">
                  <button @click="shareFacebook">Facebook</button>
                  <button @click="shareWhatsApp">WhatsApp</button>
                  <button @click="copyLink">{{ t('_btnCopyLink') }}</button>
                </div>
              </div>
            </div>
            
            <p>{{videoviewStore.description?.[locale]}}</p>
            <br>
            <div class="video-swiper">
                <SwiperVideosRelacionados :videos="videos" :title="t('_videoWatch._title')"/>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.video-container-view{
    padding: 100px 5rem 1rem 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.column{
    display: flex;
    flex-direction: row;
}

.space-between{
    justify-content: space-between;
    gap: 1rem;
}

.links{
    text-decoration: none;
    font-size: .8rem;
    color: var(--color-text);
    font-weight: 700;
}

.links span{
    font-size: .8rem;
}

.video-content{
    display: flex;
    flex-direction: column;
    /* gap: .5rem; */
    width: 100%;
    max-width: 800px;
    min-width: 400px;
}
.video-details{
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: 1rem 0;
    background-color: var(--color-background-soft);
}

.video-view {
  width: 100%;
  /* max-width: 600px;
  min-width: 380px; */
  aspect-ratio: 16 / 9;
  position: relative;
}

.video-view iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.video-details h2{
    font-size: 1.1rem;
    color: var(--color-heading);
    font-weight: 700;
    margin-bottom: 10px;
    padding: 0 1rem;
}

.video-details p{
    font-size: .9rem;
    padding: 0 1rem;
}

.btn-share{
  display: flex;
  flex-direction: row;
  width: 120px;
  gap: .5rem;
  background-color: var(--cor-azul-medio);
  padding: .5rem;
  cursor: pointer;
  border: solid 1px var(--color-border);
  border-radius: 5px;
  justify-content: space-evenly;
  align-items: center;
  margin-right: 1rem;
  color: var(--color-text);
  transition: all .3s ease;
}

.btn-share span{
  text-align: center;
}

.btn-share:hover{
  background-color: var(--cor-azul-claro);
}

.share-container {
  position: relative;
  display: inline-block;
}

.share-menu {
  position: absolute;
  top: 35px;
  right: 20px;
  background: #222;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.share-menu button {
  background: none;
  border: none;
  color: white;
  padding: 0.5rem;
  text-align: left;
  cursor: pointer;
}

.share-menu button:hover {
  background: #444;
}

</style>