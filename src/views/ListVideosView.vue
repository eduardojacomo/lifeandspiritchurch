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

function selectType(type) {
  appTipoVideo.value = type;
  filterTipo.value = false;
};

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
  <div class="videos-page">
    <!-- Header Section -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>{{ t('_titleListVideosYoutube') }}</h1>
          <router-link class="btn-home" to="/">
            <font-awesome-icon icon="fa-solid fa-home" />
            Home
          </router-link>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-wrapper">
          <!-- Search -->
          <div class="search-group">
            <input 
              type="text" 
              :placeholder="t('_searchVideosPlaceholder') || 'Buscar por título'" 
              v-model="titleSearchVideo"
              @keyup.enter="fetchFilteredVideos(1)"
            >
            <button class="btn-search" @click="fetchFilteredVideos(1)">
              {{ t('_btnSearch') }}
            </button>
          </div>

          <!-- Filters -->
          <div class="filters-controls">
            <!-- Type Filter -->
            <div class="filter-item">
              <button class="btn-filter" @click="filterTipo = !filterTipo">
                {{ t('_btnTypeVideos') }}
                <font-awesome-icon icon="fa-solid fa-caret-down" />
              </button>
              <span v-if="appTipoVideo && appTipoVideo !== 'All'" class="filter-badge">
                {{ appTipoVideo }}
              </span>
              
              <Transition name="dropdown">
                <div v-if="filterTipo === true" class="dropdown-menu">
                  <button 
                    class="dropdown-item" 
                    @click="selectType('All')"
                    :class="{ active: appTipoVideo === 'All' }"
                  >
                    Todos
                  </button>
                  <button 
                    v-for="(t, index) in typeVideos" 
                    :key="index"
                    class="dropdown-item"
                    @click="selectType(t.value)"
                    :class="{ active: appTipoVideo === t.value }"
                  >
                    {{ t.name?.[locale] }}
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Date Filter -->
            <div class="filter-item">
              <button class="btn-filter" @click="toggleFilter">
                {{ t('_btnDateVideos') }}
                <font-awesome-icon icon="fa-solid fa-caret-down" />
              </button>
              <span v-if="appSelectedDate" class="filter-badge">
                {{ formattedSelectedDate(appSelectedDate) }}
              </span>
              
              <Transition name="dropdown">
                <div class="dropdown-date" v-if="filterData">
                  <DatePicker @date-selected="handleDateSelected" :lang="locale" :key="locale" />
                </div>
              </Transition>
            </div>

            <!-- Clear Filters -->
            <button class="btn-clear" @click="clearFilters()">
              {{ t('_btnClearFilter') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <!-- Carousel View (No Search) -->
        <div v-if="searchVideosStatus === false" class="carousel-view">
          <div v-if="mostviewdVideos.length === 0">
            <SkeltonCardVideos :qtde="4"/>
          </div>
          <SwiperVideosRelacionados 
            v-else 
            :videos="mostviewdVideos" 
            :title="t('_videoPopular._title')"
          />
          
          <div v-if="recentVideos.length === 0">
            <SkeltonCardVideos :qtde="4" />
          </div>
          <SwiperVideosRelacionados 
            v-else 
            :videos="recentVideos" 
            :title="t('_videoRecent._title')"
          />
        </div>

        <!-- Grid View (Search Results) -->
        <div v-else class="search-results">
          <div class="results-info">
            <span>{{ videosSearch.length }} vídeos encontrados</span>
          </div>

          <div class="videos-grid">
            <div 
              v-for="video in videosSearch" 
              :key="video.youtubeId"
              class="video-card"
              @click="openVideoSelected(video)"
            >
              <div class="video-thumbnail">
                <img :src="video.thumbnails?.medium" :alt="video.title" />
                <div class="video-overlay">
                  <div class="play-icon">▶</div>
                </div>
              </div>
              <div class="video-info">
                <h3>{{ video.title?.[locale] }}</h3>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
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
    </section>
  </div>
</template>

<style scoped>
.videos-page {
  min-height: 100vh;
  background: var(--color-background);
  padding-top: 80px;
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Page Header */
.page-header {
  padding: 2rem 0 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

.btn-home {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-home:hover {
  background: var(--color-heading);
  color: #000;
  border-color: var(--color-heading);
}

/* Filters Section */
.filters-section {
  padding: 1.5rem 0;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

.filters-wrapper {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.search-group {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  max-width: 500px;
}

.search-group input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-group input:focus {
  outline: none;
  border-color: var(--color-heading);
}

.search-group input::placeholder {
  opacity: 0.5;
}

.btn-search {
  padding: 0.75rem 1.5rem;
  background: var(--color-heading);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.95rem;
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.filters-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-filter:hover {
  border-color: var(--color-heading);
}

.filter-badge {
  padding: 0.375rem 0.75rem;
  background: var(--color-heading);
  color: #000;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.dropdown-menu,
.dropdown-date {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.dropdown-item {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: transparent;
  border: none;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background: var(--color-background-soft);
}

.dropdown-item.active {
  background: var(--color-heading);
  color: #000;
  font-weight: 600;
}

.btn-clear {
  padding: 0.75rem 1rem;
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-clear:hover {
  background: rgba(255, 68, 68, 0.1);
  border-color: #ff4444;
  color: #ff4444;
}

/* Content Section */
.content-section {
  padding: 3rem 0 5rem 0;
}

.carousel-view {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Search Results */
.results-info {
  margin-bottom: 1.5rem;
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.95rem;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.video-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-5px);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  margin-bottom: 0.75rem;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.play-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #000;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.video-card:hover .play-icon {
  transform: scale(1);
}

.video-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.video-card:hover .video-info h3 {
  color: var(--color-heading);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination button {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.pagination button:hover:not(.active) {
  background: var(--color-heading);
  color: #000;
  border-color: var(--color-heading);
}

.pagination button.active {
  background: var(--color-heading);
  color: #000;
  border-color: var(--color-heading);
  cursor: default;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .filters-wrapper {
    flex-wrap: wrap;
  }

  .search-group {
    max-width: 100%;
  }

  .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .videos-page {
    padding-top: 70px;
  }

  .page-header {
    padding: 1.5rem 0 1rem 0;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filters-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .search-group {
    max-width: 100%;
  }

  .filters-controls {
    flex-wrap: wrap;
  }

  .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .content-section {
    padding: 2rem 0 3rem 0;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .search-group {
    flex-direction: column;
  }

  .btn-search {
    width: 100%;
  }

  .filters-controls {
    flex-direction: column;
    width: 100%;
  }

  .filter-item,
  .btn-filter,
  .btn-clear {
    width: 100%;
  }

  .videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>