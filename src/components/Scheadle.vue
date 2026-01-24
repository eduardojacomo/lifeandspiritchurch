<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '../stores/languageStore';
import { storeToRefs } from 'pinia';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from 'vuefire';

const db = useFirestore();
const error = ref('');
const activities = ref([]);

const fetchActiveActivities = async () => {
  try {
    const colRef = collection(db, 'activities');
    const q = query(colRef, where('active', '==', true));
    const querySnapshot = await getDocs(q);

    activities.value = [];
    querySnapshot.forEach((doc) => {
      activities.value.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.log('Erro ao buscar atividades ativas:', e);
    error.value = 'Erro ao buscar as atividades ativas.';
  }
};

const uselanguage = useLanguage();
const { currentLocaleKey } = storeToRefs(uselanguage);
const { t, locale } = useI18n();

const onlineactivities = computed(() => {
  return activities.value.filter(a =>
    a.day.en?.toLowerCase() === "saturday" ||
    a.day.pt?.toLowerCase() === "sábado"
  );
});

onMounted(() => {
  fetchActiveActivities();
});
</script>

<template>
  <main>
    <section class="schedule-section">
      <!-- Background Text Animation -->
      <div class="scrolling-text-container">
        <div class="scrolling-text">
          <div class="scrolling-text-content">
            <span>CELEBRATIONS - </span>
            <span>CELEBRATIONS - </span>
          </div>
          <div class="scrolling-text-content">
            <span>CELEBRATIONS - </span>
            <span>CELEBRATIONS - </span>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Section Title -->
        <div class="section-header">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey">{{ t('_scheadleTitle') }}</h1>
          </Transition>
        </div>

        <!-- Content Grid -->
        <div class="schedule-content">
          <!-- Image -->
          <div class="schedule-image">
            <img src="../assets/DSC00267.jpeg" alt="Church Celebration" />
          </div>

          <!-- Activities List -->
          <div class="activities-list">
            <div 
              v-for="activity in activities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-header">
                <h2>{{ activity.title[locale] }}</h2>
              </div>
              <div class="activity-time">
                <font-awesome-icon icon="fa-regular fa-clock" />
                <span>{{ activity.day[locale] }} - {{ activity.hour }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  position: relative;
  overflow: hidden;
}

/* Schedule Section */
.schedule-section {
  min-height: 87vh;
  padding: 4rem 0 6rem 0;
  position: relative;
}

/* Scrolling Text Background */
.scrolling-text-container {
  width: 100%;
  overflow: hidden;
  position: absolute;
  bottom: 10%;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.scrolling-text {
  display: flex;
  width: max-content;
  animation: scroll-x 25s linear infinite;
}

.scrolling-text-content {
  display: flex;
  white-space: nowrap;
}

.scrolling-text span {
  display: inline-block;
  margin-right: 80px;
  font-size: clamp(4rem, 10vw, 10rem);
  font-weight: 900;
  color: var(--color-text);
  opacity: 0.05;
  letter-spacing: -2px;
}

@keyframes scroll-x {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-heading);
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Schedule Content */
.schedule-content {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 4rem;
  align-items: start;
}

/* Schedule Image */
.schedule-image {
  position: sticky;
  top: 100px;
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  transition: all 0.4s ease;
}

.schedule-image:hover {
  transform: scale(1.02) translateY(-5px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
}

.schedule-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(20%);
  transition: all 0.4s ease;
}

.schedule-image:hover img {
  transform: scale(1.05);
  filter: grayscale(0%);
}

/* Activities List */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.05);
  padding-left: 2.5rem;
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
}

.activity-item:hover .activity-header h2 {
  color: rgba(255, 255, 255, 0.95);
}

.activity-time {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 1rem;
}

.activity-time svg {
  font-size: 1.1rem;
  color: var(--color-heading);
}

/* Transitions */
.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: all 0.5s ease;
}

.fade-blur-enter-from {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
}

.fade-blur-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(-20px);
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .schedule-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .schedule-image {
    position: relative;
    top: 0;
    max-width: 600px;
    height: 450px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 768px) {
  .schedule-section {
    padding: 3rem 0 4rem 0;
  }

  .container {
    padding: 0 1.5rem;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .section-header h1 {
    font-size: 2rem;
  }

  .schedule-content {
    gap: 2.5rem;
  }

  .schedule-image {
    height: 400px;
  }

  .activity-item {
    padding: 1.5rem 1rem;
  }

  .activity-item:hover {
    padding-left: 1.5rem;
  }

  .activity-header h2 {
    font-size: 1.3rem;
  }

  .activity-time {
    font-size: 0.95rem;
  }

  .scrolling-text {
    display: none;
  }
}

@media screen and (max-width: 480px) {
  .schedule-section {
    padding: 2rem 0 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-header h1 {
    font-size: 1.8rem;
  }

  .schedule-content {
    gap: 2rem;
  }

  .schedule-image {
    height: 350px;
  }

  .activity-item {
    padding: 1.25rem 0.875rem;
  }

  .activity-header h2 {
    font-size: 1.1rem;
  }

  .activity-time {
    font-size: 0.9rem;
  }
}
</style>