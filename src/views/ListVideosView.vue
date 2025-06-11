<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVideoWatch } from '@/stores/videoviewStore';
import { storeToRefs } from 'pinia';
import { useLanguage } from '../stores/languageStore';
import { useI18n } from 'vue-i18n';
import { getFirestore, collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { fetchMostViewedVideos } from '@/composables/youtubedata';
import SwiperVideosRelacionados from '@/components/SwiperVideosRelacionados.vue';
import SkeltonCardVideos from '@/components/Tools/SkeltonCardVideos.vue';
import DatePicker from '@/components/Tools/DatePicker.vue';

const mostviewdVideos = ref([]);
const recentVideos = ref([]);
const db = getFirestore();
const router = useRouter();

const filterTipo = ref(false);
const filterData = ref(false);
const dropdownWrapper = ref(null);

const appSelectedDate = ref(null);
const appTipoVideo = ref('');
const typeVideos = ref([]);
const titleSearchVideo = ref('');

const searchVideosStatus = ref(false);
const videosSearch = ref([]);

const qtde = 4;

const PAGE_SIZE = 10;
const pageCursors = ref([]); // Armazena snapshot da primeira doc de cada página
const currentPage = ref(1);
const totalPages = ref(1);
const totalResults = ref(0);

const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);
const { t } = useI18n();

const usevideowatch = useVideoWatch();
const { videoviewStore } = storeToRefs(usevideowatch);
const {setVideo} = usevideowatch;


async function fetchtypeVideos(){
  const typeSnapshot = await getDocs(collection(db, 'type_videos'));
  typeVideos.value = typeSnapshot.docs.map(doc => doc.data());
  console.log('tipos:', typeVideos.value);

}

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

// serach-videos
// begin
async function fetchFilteredVideos(pageNumber) {
  let q = collection(db, 'videos');

  if (appTipoVideo.value && appTipoVideo.value !== 'All') {
    q = query(q, where('type', '==', appTipoVideo.value));
  }

  if (appSelectedDate.value) {
    const start = new Date(appSelectedDate.value);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    q = query(q,
      where('publishedAt', '>=', start.toISOString()),
      where('publishedAt', '<', end.toISOString())
    );
  }

  q = query(q, orderBy('publishedAt', 'desc'), limit(PAGE_SIZE));

  // Se for página > 1, pegar o cursor da página anterior
  if (pageNumber > 1 && pageCursors.value[pageNumber - 2]) {
    q = query(q, startAfter(pageCursors.value[pageNumber - 2]));
  }

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    videosSearch.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    currentPage.value = pageNumber;
    pageCursors.value[pageNumber - 1] = snapshot.docs[snapshot.docs.length - 1];
    searchVideosStatus.value = true;
  }
  console.log('teste video search',videosSearch.value);
}


//paginacao
async function fetchTotalCount() {
  let q = collection(db, 'videos');

  if (appTipoVideo.value && appTipoVideo.value !== 'All') {
    q = query(q, where('type', '==', appTipoVideo.value));
  }

  if (appSelectedDate.value) {
    const start = new Date(appSelectedDate.value);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    q = query(q,
      where('publishedAt', '>=', start.toISOString()),
      where('publishedAt', '<', end.toISOString())
    );
  }

  const snapshot = await getDocs(q);
  totalResults.value = snapshot.size;
  totalPages.value = Math.ceil(snapshot.size / PAGE_SIZE);
}


//end


const toggleFilter = () => {
  filterData.value = !filterData.value;
};

function formattedSelectedDate (date) {
  console.log(locale.value);
    return date.toLocaleDateString(locale.value);
};

function handleDateSelected(date) {
  //appSelectedDate.value =  formattedSelectedDate(date);
  appSelectedDate.value =  date;
  console.log(date);
  filterData.value = false;
};

function clearFilters(){
  appSelectedDate.value = null;
  titleSearchVideo.value = '';
  appTipoVideo.value = '';
}

const handleClickOutside = (event) => {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(event.target)) {
    filterData.value = false;
  }
};

function openVideoSelected(videoData){
  setVideo (videoData);
  router.push({ name: 'videowatch', params: { id: videoData.youtubeId } }).catch(() => {});

};

onMounted(async ()=>{
    const topIds = await fetchMostViewedVideos();
    await fetchtypeVideos()
    await fetchVideos();
    await fetchTotalCount();
    mostviewdVideos.value =  await fetchVideosFromFirestoreByIds([...topIds]);
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="video-container-view">
      <div class="video-content">
        <div class="column space-between">
            <h2>Palavras:</h2>
            <router-link class="links" to="/">Home</router-link>
        </div>
        <div class="column">
            <div class="form-group">
                <!-- <label for="searchVideos">Search</label> -->
                <input type="text" id="searchVideos" placeholder="Buscar por título" v-model="titleSearchVideo">
                <button class="form-submit-btn" @click="fetchFilteredVideos(1)" >{{t('_btnSearch')}}</button>
            </div>
        </div>
          
        <div class="filters_form">
          <div>
            <div ref="dropdownWrapper" class="dropdown-wrapper">
              <button class="btn-filter" @click="filterTipo = !filterTipo" ><span> Tipo </span><font-awesome-icon icon="fa-solid fa-caret-down" />
                
                <div v-if="filterTipo === true" class="options-filter">
                  <ul>
                    <li><button @click="appTipoVideo = 'All'">Todos</button></li>
                    <li v-for="(t, index) in typeVideos" :key="index"><button @click="appTipoVideo = t.value">{{t.name?.[locale]}}</button></li>
                    <!-- <li><button @click="appTipoVideo = 'Série'">Série</button></li>
                    <li><button @click="appTipoVideo = 'Palavras'">Palavras</button></li> -->
                  </ul>
                </div>
              </button>
            </div>
            <span v-if="appTipoVideo"> {{ appTipoVideo }} </span>
              <div ref="dropdownWrapper" class="dropdown-wrapper">
                <button class="btn-filter" @click="toggleFilter">
                  <span> Data </span>
                  <font-awesome-icon icon="fa-solid fa-caret-down" />
                </button>
                
                <div class="options-data" v-if="filterData">
                  <DatePicker @date-selected="handleDateSelected" :lang="locale" :key="locale" />
                </div>
              </div>
              <span v-if="appSelectedDate">{{ formattedSelectedDate(appSelectedDate) }}</span>
          </div>
          <div>
            <button class="btn-filter" @click="clearFilters()">Limpar Filtros</button>
          </div>
        </div>
        <div class="related-videos" v-if="searchVideosStatus === false">
          <div class="carrouselrow">
            <SkeltonCardVideos v-if="mostviewdVideos.length === 0" :qtde="4"/>
            <SwiperVideosRelacionados v-else :videos="mostviewdVideos" :title="t('_videoPopular._title')"/>
            <SkeltonCardVideos v-if="recentVideos.length === 0" :qtde="4" />
            <SwiperVideosRelacionados v-else :videos="recentVideos" :title="t('_videoRecent._title')"/>
          </div>
          
        </div>
        <div class="row" v-else>
          <div class="related-videos" >
            <div class="video-card" v-for="video in videosSearch" :key="video.youtubeId">
              <img :src="video.thumbnails?.medium" :alt="video.title" />
                <button @click="openVideoSelected(video)"><h3>{{ video.title?.[locale] }}</h3></button>
            </div>
          </div>
          <div class="pagination">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="fetchFilteredVideos(page)"
              :class="{ active: page === currentPage }"
            >
              {{ page }}
            </button>
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
    color: var(--color-text);
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

.filters_form{
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: baseline;
  justify-content: space-between;
}

.btn-filter{
  background-color: transparent;
  color: var(--color-text);
  gap: .5rem;
  border:none;
  min-width: 60px;
  /* cursor: pointer; */
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}
.filters_form span{
  font-size: .8rem;
}

.options-filter{
  display: flex;
  flex-direction: column;
  border: solid 1px var(--color-border);
  background-color: var(--cor-azul-medio);
  color: var(--color-text);
  border-radius: 8px;
  position: absolute;
  top: 20px;
  left: 0;
  z-index: 900;
  justify-content: center;
  padding: .5rem 0;
}

.options-data{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 900;
}

.options-filter ul{
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.options-filter button{
  background-color: transparent;
  border: none;
  padding: .5rem 1rem;
  cursor: pointer;
  transition: all .3s ease;
  width: 100%;
  font-size: .7rem;
}

.options-filter button:hover{
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
    gap: .5rem;
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

.related-videos{
  display: flex;
  flex-direction: row;
  gap: .5rem;
  padding: 1.5rem 0;
  flex-wrap: wrap;
}

.carrouselrow{
  display: flex;
  flex-direction: column;
  max-width: 780px;
  width: 100%;
}

.video-card {
  flex: 0 0 calc(90% / 4);
  max-width: calc(100% / 4);
  box-sizing: border-box;
  padding: 1rem .5rem;
  background-color: transparent;
  border-radius: 8px;
  overflow: hidden;
}

.video-card button{
    background-color: transparent;
    cursor: pointer;
    border: none;
    text-align: left;
}

.video-card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  display: block;
}

.video-card h3 {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem;
  color: #fff;
}

.video-card .categories {
  font-size: 0.7rem;
  color: #ccc;
  padding: 0 0.5rem 0.5rem 0.5rem;
}

.pagination{
  display: flex;
  flex-direction: row;
  gap: .5rem;
  justify-content: center;
}

.pagination button{
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 1rem;
  font-weight: bold;
  color: var(--color-heading);
}

.pagination button.active {
  font-weight: italic;
  background-color: transparent;
  border: none;
  cursor: auto;
  padding: 1rem;
  color:#727272;
}

@media screen and (max-width: 768px){
  .video-card{
    flex: 0 0 calc(90% / 2);
    max-width: calc(100% / 2);
  }
}

</style>