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
    <div class="carousel-header">
      <h2>{{ props.title }}</h2>
      <div class="carousel-nav">
        <button 
          class="nav-button" 
          :class="{ disabled: !canGoPrev }" 
          :disabled="!canGoPrev" 
          @click="prev"
        >
          ‹
        </button>
        <button 
          class="nav-button" 
          :class="{ disabled: !canGoNext }" 
          :disabled="!canGoNext" 
          @click="next"
        >
          ›
        </button>
      </div>
    </div>

    <div class="carousel-wrapper">
      <div class="carousel-viewport">
        <div
          class="carousel-track"
          :style="{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
          }"
        >
          <div 
            class="video-card" 
            v-for="video in props.videos" 
            :key="video.id"
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
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-container {
  width: 100%;
  position: relative;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.carousel-header h2 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.carousel-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text);
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover:not(.disabled) {
  background: var(--color-heading);
  color: #000;
  border-color: var(--color-heading);
  transform: scale(1.1);
}

.nav-button.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-wrapper {
  width: 100%;
}

.carousel-viewport {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: calc(100% * (5 / 4)); 
}

.video-card {
  flex: 0 0 calc(100% / 5);
  max-width: calc(100% / 5);
  padding: 0 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-8px);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  margin-bottom: 1rem;
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
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
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
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #000;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.video-card:hover .play-icon {
  transform: scale(1);
}

.video-info {
  padding: 0 0.5rem;
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

/* Responsive */
@media screen and (max-width: 1200px) {
  .carousel-track {
    width: calc(100% * (4 / 3));
  }

  .video-card {
    flex: 0 0 calc(100% / 4);
    max-width: calc(100% / 4);
  }
}

@media screen and (max-width: 968px) {
  .carousel-track {
    width: calc(100% * (3 / 2));
  }

  .video-card {
    flex: 0 0 calc(100% / 3);
    max-width: calc(100% / 3);
  }

  .carousel-header h2 {
    font-size: 1.3rem;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }
}

@media screen and (max-width: 768px) {
  .carousel-track {
    width: calc(100% * (2 / 1));
  }

  .video-card {
    flex: 0 0 calc(100% / 2);
    max-width: calc(100% / 2);
  }

  .carousel-header {
    margin-bottom: 1.5rem;
  }

  .carousel-header h2 {
    font-size: 1.2rem;
  }

  .video-info h3 {
    font-size: 0.85rem;
  }
}

@media screen and (max-width: 480px) {
  .video-card {
    padding: 0 0.5rem;
  }

  .video-thumbnail {
    border-radius: 8px;
    margin-bottom: 0.75rem;
  }

  .carousel-header h2 {
    font-size: 1.1rem;
  }

  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .play-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>
