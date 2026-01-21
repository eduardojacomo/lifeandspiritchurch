<script setup>
import { ref } from 'vue'
import NewVideos from '@/components/Admin/NewVideos.vue'
import EditVideos from '@/components/Admin/EditVideos.vue'

const option = ref('myvideos')
</script>

<template>
  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>Gerenciamento de Vídeos</h1>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: option === 'newvideos' }"
        @click="option = 'newvideos'"
      >
        📤 New Videos
      </button>

      <button
        class="tab"
        :class="{ active: option === 'myvideos' }"
        @click="option = 'myvideos'"
      >
        🎬 My Videos
      </button>
    </div>

    <!-- Conteúdo -->
    <div class="tab-content">
      <NewVideos v-show="option === 'newvideos'" />
      <EditVideos v-show="option === 'myvideos'" />
    </div>

  </div>
</template>

<style scoped>
/* ===== Container base ===== */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 90px 2rem 2rem;
  background: #000;
  color: #fff;
  min-height: 100vh;
}

/* ===== Header ===== */
.header {
  background: #0a0a0a;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}

/* ===== Tabs ===== */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab {
  padding: 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab:hover {
  color: rgba(255, 255, 255, 0.9);
}

.tab.active {
  color: #fff;
  border-bottom-color: #fff;
}

/* ===== Tab content ===== */
.tab-content {
  animation: fadeIn 0.3s ease;
  margin-top: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== Responsivo ===== */
@media (max-width: 768px) {
  .container {
    padding: 90px 1rem 1.5rem;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .tab {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .header {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>
