<script setup>
import { ref, onMounted } from 'vue'
import { fetchYoutubeVideos } from '../composables/youtubedata'

const videos = ref([])

onMounted(async () => {
  videos.value = await fetchYoutubeVideos()
})
</script>

<template>
  <main>
    <ul>
      <li v-for="i in videos" :key="i.youtubeId">
        <strong>{{ i.title.en }}</strong> <br />
        Publicado em: {{ new Date(i.publishedAt).toLocaleDateString() }}
        <img :src="i.thumbnails.medium" alt="">
      </li>
    </ul>
  </main>
</template>
