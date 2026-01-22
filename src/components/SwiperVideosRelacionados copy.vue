<script setup>
import { ref, computed, onMounted } from 'vue';
import {storeToRefs} from 'pinia';
import { useRouter } from 'vue-router';
import {useLanguage} from '../stores/languageStore'
import { useVideoWatch } from '@/stores/videoviewStore';

const uselanguage = useLanguage();
const { currentLocaleKey, locale} = storeToRefs(uselanguage);

const usevideowatch = useVideoWatch();
const {setVideo} = usevideowatch;
const {videoviewStore} = storeToRefs(usevideowatch);

const props = defineProps({
  videos: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
});

const router = useRouter();
const currentIndex = ref(0);
const visibleCount = 5;

const canGoPrev = computed(() => currentIndex.value > 0);
const canGoNext = computed(() => currentIndex.value + visibleCount < props.videos.length);

function prev() {
  if (canGoPrev.value) currentIndex.value -= 1;
}

function next() {
  if (canGoNext.value) currentIndex.value += 1;
}

function openVideoSelected(videoData){
  setVideo (videoData);
  router.push({ name: 'videowatch', params: { id: videoData.youtubeId } }).catch(() => {});

}


</script>

<template>
  <section class="carousel-container">
    <h2>{{ props.title }}</h2>
    <button class="nav-button left" :disabled="!canGoPrev" @click="prev">‹</button>
    <button class="nav-button right" :disabled="!canGoNext" @click="next">›</button>
    <div class="carousel-wrapper">

      <div class="carousel-viewport">
        <div
          class="carousel-track"
          :style="{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
          }"
        >
          <div class="video-card" v-for="video in props.videos" :key="video.id">
            <img :src="video.thumbnails?.medium" :alt="video.title" />
            <button @click="openVideoSelected(video)"><h3>{{ video.title?.[locale] }}</h3></button>
            <!-- <p class="categories">{{ video.categories.join(', ') }}</p> -->
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.carousel-container {
  padding: 0 1rem;
  background-color: transparent;
  color: #fff;
  position: relative;
}

.carousel-container h2 {
  font-size: 1rem;
  font-weight: 700;
  /* margin-bottom: 1rem; */
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.nav-button {
  background-color: #333;
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 0.5rem .8rem; */
  font-weight: 700;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s;
}

.nav-button.left{
 position: absolute;
 top: 40%;
 left: 10px;
 z-index: 100;
}

.nav-button.right{
 position: absolute;
 top: 40%;
 right: 10px;
 z-index: 100;
}

.nav-button:disabled {
  opacity: 0.3;
}

.carousel-viewport {
  overflow: hidden;
  width: 100%;
  /* flex: 0 1 780px; */
}

.carousel-track {
  display: flex;
  transition: transform 0.4s ease-in-out;
  width: calc(100% * (5 / 4)); 
}

.video-card {
  flex: 0 0 calc(100% / 5);
  max-width: calc(100% / 5);
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

@media screen and (max-width: 768px){
  .carousel-track{
    width: calc(100% * (3 / 2));
  }

  .video-card{
    flex: 0 0 calc(100% / 3);
    max-width: calc(100% / 3);
  }
}
</style>
