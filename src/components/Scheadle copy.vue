<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CardScheadle from './CardScheadle.vue';
import {useLanguage} from '../stores/languageStore'
import {storeToRefs} from 'pinia';

import { collection, query, where, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
const db = useFirestore()
const error = ref('');
// const activitiesCollection = useCollection(collection(db, 'activities'))
const activities = ref([]);

const fetchActiveActivities = async () => {
  try {
    const colRef = collection(db, 'activities') // ⬅️ usa diretamente a coleção
    const q = query(colRef, where('active', '==', true))
    const querySnapshot = await getDocs(q)

    activities.value = []
    querySnapshot.forEach((doc) => {
      activities.value.push({ id: doc.id, ...doc.data() })
    })
  } catch (e) {
    console.log('Erro ao buscar atividades ativas:', e)
    error.value = 'Erro ao buscar as atividades ativas.'
  }
}

const uselanguage = useLanguage();
const { currentLocaleKey} = storeToRefs(uselanguage);

const { t, locale } = useI18n();

const onlineactivities = computed(() => {
  return activities.value.filter(a =>
    a.day.en?.toLowerCase() === "saturday" ||
    a.day.pt?.toLowerCase() === "sábado"
  );
});

const observeElements = (el) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  });

  el.forEach((element) => observer.observe(element));
};

onMounted(() => {
  const sections = document.querySelectorAll('.animate');
  fetchActiveActivities();
  observeElements(sections);
});
</script>

<template>
    <main>
      <div class="container">
        <div class="scrolling-text-container">
            <div class="scrolling-text">
              <div class="scrolling-text-content">
                <span>CELEBRATIONS - </span>
                <span>CELEBRATIONS - </span>
                <!-- <span>MISSION & VISION - </span>
                <span>MISSION & VISION - </span> -->
              </div>
              <div class="scrolling-text-content">
                <span>CELEBRATIONS - </span>
                <span>CELEBRATIONS - </span>
                <!-- <span>MISSION & VISION - </span>
                <span>MISSION & VISION - </span> -->
              </div>
            </div>
          </div>
        <div class="card__container">
          <div class="title animate">
            <Transition name="fade-blur" mode="out-in">
              <h1 :key="currentLocaleKey">{{t('_scheadleTitle')}}</h1>
            </Transition>
          </div>
          <div class="scheadle-column animate">
            <div class="image">
              <img src="../assets/DSC00267.jpeg" alt="celebration">
            </div>
            <div class="row">
              <ul>
              <br>
                <li v-for="a in activities" :key="a.id">
                  <div class="row-buttom">
      
                    <h2>{{a.title[locale]}} </h2>
                    <span>{{ a.day[locale] }} - {{a.hour}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

          <!-- <div class="scheadle-column animate">
            <div class="image">
              <img src="../assets/DSC00267.jpeg" alt="celebration">
            </div>
            <div class="row">
              <h3>Online</h3>
              <ul>
              <br>
                <li v-for="a in onlineactivities" :key="a.id">
                  <div class="row">
                    <span>{{a.title[locale]}} </span>
                    <span>{{ a.day[locale] }} - {{a.hour}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div> -->

      </div>
    </main>
  </template>
  

<style scoped>
main{
  /* background-image: linear-gradient(to top, #2e3b58 0%, #28282b 100%); */
  /* background: linear-gradient(to bottom, #181818, #283593); */
  background: linear-gradient(135deg, #0f20278c, #203a436f, #2c53644d);
  /* background: linear-gradient(135deg, #1e3c72, #2a5298); */
  /* background: linear-gradient(to bottom, #031922, #0f2d37, #213f6c, #135784); */
}

.container {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  min-height: 87vh;
  width: 100%;
  padding: 70px 2rem 2rem 2rem;
  position: relative;
  align-items: center;
}

.card__container{
  max-width: 1280px;
}

.title {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
}

.title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

.title h2{
    font-size: 1.5rem;
  font-weight: 500;
}

.content {
  display: flex;
  padding: 0 7rem;
  text-align: justify;
}

.content.animate p{
    font-size: 1rem;
    padding: 1rem 0 1rem 3rem;
}

.cards {
  display: flex;
  gap: 1.5rem;
  /* padding: 0 6rem 1rem 8rem; */
  flex-wrap: wrap;
  padding: 0 5rem;
  justify-content: space-around;
  align-items: center;
}

.image{
  width: clamp(320px, 100%, 450px);
  display: flex;
  overflow: hidden;
  border: none;
  border-radius: 8px;
}

.image img{
  object-fit: contain;
  max-width: 100%;
}

.column, .card-content {
    display: flex;
    flex-direction: row;
}

.row {
    display: flex;
    flex-direction: column;
}

.row-buttom{
  display: flex;
  flex-direction: column;
  /* border-top: solid 1px var(--color-border);
  border-bottom:  solid 1px var(--color-border); */
  padding: .5rem 0;
}

.row-buttom h2{
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
}

li {
  padding: 0.5rem 3rem 0.5rem 1rem;
  border-top: 1px solid var(--color-border);
}

li:last-child {
  border-bottom: 1px solid var(--color-border);
}

.row span{
  font-size: .8rem;
}

.g-1{
  gap: .5rem
}

ul{
  list-style: none;
  padding: 0;
  margin: 0;
}

ul li{
  padding-bottom: .5rem;
}

.scheadle-column{
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0 10rem 2rem 10rem;
  gap: 2rem;
}

.category h3 {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  /* margin-bottom: .5rem; */
}

/* Animação ao aparecer no scroll */
.animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.in-view {
  opacity: 1;
  transform: translateY(0);
}

.scrolling-text-container {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  /* padding: 500px 0 0 0;
  z-index: 100; */
  bottom: 50px;
  left:0;
  position: absolute;
}

.scrolling-text {
  display: flex;
  width: max-content;
  animation: scroll-x 20s linear infinite;
  font-size: 72px;
}

.scrolling-text-content {
  display: flex;
}

.scrolling-text span {
  display: inline-block;
  margin-right: 50px;
  font-size: 2em;
  font-weight: bold;
  color: var(--color-text);
  opacity: 0.1;
}

/* Scroll contínuo */
@keyframes scroll-x {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media screen and (max-width: 1024px) {
  .content{
    padding: 0 2rem;
  }
  .icon {
    visibility: collapse;
    padding: 0;
    font-size: 0;
  }
  .cards{
    padding: 0;
  }
}

@media screen and (max-width: 768px) {
  .content {
    padding: 0 1rem;
  }

  .scheadle-column{
    flex-direction: column;
    padding: 0 1rem 0 1rem;
  }

  .icon {
    visibility: collapse;
    padding: 0;
    font-size: 0;
  }
  .content.animate p{
    padding: 0;
  }

  .container{
    padding: 1rem .5rem;
  }
  /* .linha-vertical{
    margin: 0;
  }
  .socials{
    padding: 0 0 .5rem 0;
  } */
}

@media screen and (max-width: 480px) {
  .title h1 {
    font-size: 1.8rem;
  }

  .content.animate p {
    font-size: 1rem;
  }

  .cards {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .icon {
    visibility: hidden;
  }

  .content {
    padding: 0 1rem;
  }
  .socials{
    padding: 0 0 0.5rem 0 !important;
  }
}

</style>
