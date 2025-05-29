<script setup>
import { computed } from 'vue'; 

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  controls: {
    type: Boolean,
    default: true,
  },
});


const videoSrc = computed(() => {
  let src = `https://www.youtube.com/embed/${props.videoId}`;
  const params = [];

  if (props.autoplay) {
    params.push('autoplay=1');
  }
  if (!props.controls) {
    params.push('controls=0');
  }
  

  if (params.length > 0) {
    src += `?${params.join('&')}`;
  }
  return src;
});
</script>

<template>
  <div class="video-container">
    <iframe
      :src="videoSrc"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </div>
</template>

<style scoped>
.video-container {
  /* Estilos para responsividade */
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  background: #000;
  display: flex; 
  justify-content: center;

}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>