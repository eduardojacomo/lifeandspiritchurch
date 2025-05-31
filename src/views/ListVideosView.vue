<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useVideoWatch } from '@/stores/videoviewStore';
import { useLanguage } from '../stores/languageStore';
import { useI18n } from 'vue-i18n';
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { fetchMostViewedVideos } from '@/composables/youtubedata';
import SwiperVideosRelacionados from '@/components/SwiperVideosRelacionados.vue';
import SkeltonCardVideos from '@/components/Tools/SkeltonCardVideos.vue'

const mostviewdVideos = ref([]);
const recentVideos = ref([]);
const db = getFirestore();

const qtde = 4;
const fetchVideosFromFirestoreByIds = async (ids = []) => {
  const videosRef = collection(db, 'videos');

  const chunks = [];
  while (ids.length) {
    const chunk = ids.splice(0, 10); // Firestore permite no máx. 10 por where-in
    chunks.push(chunk);
  }
    const results = [];
  for (const chunk of chunks) {
    const q = query(videosRef, where('youtubeId', 'in', chunk));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
  }

  return results;
};

const fetchVideos = async () => {
  const q = query(collection(db, 'videos'), orderBy('publishedAt', 'desc'), limit(10));
  const snapshot = await getDocs(q);

  recentVideos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);
const { t } = useI18n();

const usevideowatch = useVideoWatch();
const { videoviewStore } = storeToRefs(usevideowatch);

onMounted(async ()=>{
    const topIds = await fetchMostViewedVideos();
    mostviewdVideos.value =  await fetchVideosFromFirestoreByIds([...topIds]);
    await fetchVideos();
})

</script>

<template>
  <div class="video-container-view">
      <div class="video-content">
        <div class="column space-between">
            <h2>Palavras:</h2>
            <router-link class="links" to="/">Home</router-link>
        </div>
        <div class="column padding2">
            <div class="form-group">
                <!-- <label for="searchVideos">Search</label> -->
                <input type="text" id="searchVideos" placeholder="Buscar por título">
                <button class="form-submit-btn">{{t('_btnSearch')}}</button>
            </div>
        </div>
    
        <div>
            <SkeltonCardVideos v-if="mostviewdVideos.length === 0" :qtde="4"/>
            <SwiperVideosRelacionados v-else :videos="mostviewdVideos" :title="t('_videoPopular._title')"/>
        </div>
        <div>
            <SkeltonCardVideos v-if="recentVideos.length === 0" :qtde="4" />
            <SwiperVideosRelacionados v-else :videos="recentVideos" :title="t('_videoRecent._title')"/>
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
.padding2{
    padding: 0.5rem 1rem 2rem 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group{
    display: flex;
    gap: .5rem;
    flex: 1 1 350px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: inherit;
    background-color: var(--color-background-soft);
    border: 1px solid #ccc;
}

.form-group input::placeholder {
    opacity: 0.5;
  }

.form-group input:focus {
    outline: none;
    border-color: #1778f2;
}

.form-submit-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: inherit;
    color: #fff;
    
    border: none;
    width: 150px;
    padding: 12px 16px;
    font-size: inherit;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
  }

  .form-submit-btn{
    background-color: var(--cor-azul-medio);
  }

  .form-submit-btn:hover{
    background-color: var(--cor-azul-claro);
  }

.space-between{
    justify-content: space-between;
    gap: 1rem;
    padding: 0 1rem;
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

</style>