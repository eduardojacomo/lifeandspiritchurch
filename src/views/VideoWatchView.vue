<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useVideoWatch } from '@/stores/videoviewStore';
import { useLanguage } from '../stores/languageStore';
import videoWatch from '@/components/videoWatch.vue';
import SwiperVideosRelacionados from '@/components/SwiperVideosRelacionados.vue';

const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);

const usevideowatch = useVideoWatch();
const { videoviewStore } = storeToRefs(usevideowatch);

// Pegando o parâmetro da rota
const route = useRoute();
const videoIdFromRoute = ref(route.params.id);

// Atualiza quando o ID mudar
watch(() => route.params.id, (newId) => {
  videoIdFromRoute.value = newId;
});

</script>

<template>
  <div class="video-container-view">
      <div class="video-content">
        <div class="column space-between">
            <router-link to="">Voltar para palavras</router-link>
            <div class="column">
                <router-link to="">Home</router-link>
                <span>/</span>
                <router-link to="">Conteudo</router-link>
            </div>
        </div>
        <div class="video-view">
            <videoWatch :videoId="videoIdFromRoute" :key="videoIdFromRoute" :autoplay="false" />
        </div>
        <div class="video-details">
            <h2>{{videoviewStore.title?.[locale]}}</h2>
            
            <p>{{videoviewStore.description?.[locale]}}</p>
            <div class="video-swiper">
                <SwiperVideosRelacionados />
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.video-container-view{
    padding: 72px 5rem 1rem 5rem;
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