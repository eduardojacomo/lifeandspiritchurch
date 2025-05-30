<script setup>
const props = defineProps({
  qtde: {
    type: Number,
    default: 1,
  },
});
</script>

<template>
   <div class="skeleton-group">
    <div v-for="n in props.qtde" :key="n" class="skeleton-item">
      <div class="thumbnail shimmer"></div>
      <!-- <div class="text shimmer"></div>
      <div class="text short shimmer"></div> -->
    </div>
  </div>
</template>

<style scoped>
.skeleton-group {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 1rem 0;
}
.skeleton-item {
  width: 220px;
  display: flex;
  flex-direction: column;
}
.thumbnail {
  width: 100%;
  height: 120px;
  background-color: #333;
  border-radius: 8px;
}
.text {
  height: 14px;
  background-color: #444;
  border-radius: 4px;
  margin-top: 10px;
}
.text.short {
  width: 60%;
  margin-top: 6px;
}
.shimmer {
  position: relative;
  overflow: hidden;
}
.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150px;
  width: 150px;
  height: 100%;
  background: linear-gradient(to right, transparent, #6666, transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(300%);
  }
}
</style>
