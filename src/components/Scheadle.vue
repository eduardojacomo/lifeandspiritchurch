<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CardScheadle from './CardScheadle.vue';
import {useLanguage} from '../stores/languageStore'
import {storeToRefs} from 'pinia';
import { useCollection } from 'vuefire'
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
        <div class="title animate">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey">{{t('_scheadleTitle')}}</h1>
          </Transition>
        </div>
        <div class="column">
          <!-- <div class="socials">
            <div class="linha-vertical"></div>
          </div> -->
          <div class="row">
            <!-- <div class="content animate">
              <p>{{ about }}</p>
            </div> -->
            <font-awesome-icon icon="" />
            <div class="cards animate">
                <!-- <Transition name="fade-blur" mode="out-in">
                  <CardScheadle :icon="'fa-solid fa-mobile'" :title="t('_event1')"  
                  :content="{day:t('_day3Weekend'), hour:'7:00 PM'}" :key="currentLocaleKey" />
                </Transition> 
                <Transition name="fade-blur" mode="out-in">
                  <CardScheadle :icon="'fa-solid fa-terminal'" :title="t('_event2')" :link="'developer'" :content="{day:t('_day5Weekend'), hour:'7:30 PM'}" :key="currentLocaleKey" />
                </Transition> 
                <Transition name="fade-blur" mode="out-in">
                  <CardScheadle :icon="'fa-solid fa-robot'" :title="t('_event3')" :link="'bots'" :content="{day:t('_day6Weekend'), hour:'6:30 PM'}" :key="currentLocaleKey" />                  
                </Transition> 
                <Transition name="fade-blur" mode="out-in">
                  <CardScheadle :icon="'fa-solid fa-laptop-code'" :title="t('_event4')" :link="'websolutions'" :content="{day:t('_day7Weekend'), hour:'7:00 PM'}" :key="currentLocaleKey" />
                </Transition> 
                <Transition name="fade-blur" mode="out-in">
                  <CardScheadle :icon="'fa-solid fa-laptop-code'" :title="t('_event5')" :link="'websolutions'" :content="{day:t('_day1Weekend'), hour:'6:30 PM'}" :key="currentLocaleKey" />
                </Transition>  -->
                <Transition name="fade-blur" mode="out-in" v-for="a in activities" :key="a.id">
                  <CardScheadle :icon="'fa-solid fa-mobile'" :title="a.title[locale]"  
                  :content="{day:a.day[locale], hour:a.hour}" :key="currentLocaleKey" />
                </Transition>
            </div>
          </div>
        </div>
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
  padding: 0 3.5rem;
  justify-content: center;
  align-items: center;
}


.column, .card-content {
    display: flex;
    flex-direction: row;
}

.row {
    display: flex;
    flex-direction: column;
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

  .icon {
    visibility: collapse;
    padding: 0;
    font-size: 0;
  }
  .content.animate p{
    padding: 0;
  }

  .container{
    padding: 70px .5rem 1rem .5rem;
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
