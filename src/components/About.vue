<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Card from './Card.vue';
import { useI18n } from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useLanguage} from '../stores/languageStore'
import { useCollection } from 'vuefire'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
const db = useFirestore()

const users = useCollection(collection(db, 'users'))
const categories = useCollection(collection(db, 'activities'))

const uselanguage = useLanguage();
const { currentLocaleKey} = storeToRefs(uselanguage);

const { t, locale } = useI18n();

const nova = {
  "day": { "pt": "Domingo", "en": "Sanday" }, 
  "hour": "6:30 PM", 
  "active": true, 
  "location": { "en": "Church", "pt": "Igreja" }, 
  "title": { "en": "Youth Meeting", "pt": "Encontro de Jovens" }
}

async function addData(){
  await addDoc(collection(db, 'activities'), nova)
}

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

watch(locale, () => {
  // Isso forçará a atualização do conteúdo quando o idioma mudar
});

onMounted(() => {
  const sections = document.querySelectorAll('.animate');
  observeElements(sections);
});
</script>

<template>
    <main>
      <div class="container">
        <div class="row card-content">
          <div class="content-about animate">
            <div class="image-about animate">
              <Transition name="fade-blur" mode="out-in">
                <img src="/src/assets/aboutpicture.jpeg" alt="Me" :key="currentLocaleKey" />
              </Transition>
            </div>
            <div class="row-text">
              <div class="title animate">
              <Transition name="fade-blur" mode="out-in">
                <h1 :key="currentLocaleKey">{{ t('_aboutTitle') }}</h1>
              </Transition>
            </div>
            <div class="about-description">
              <Transition name="fade-blur" mode="out-in">
                <p :key="currentLocaleKey" >{{ t('_aboutDescription') }}</p>
              </Transition>
            </div>
                
            <div class="row about-pastor">
              <Transition name="fade-blur" mode="out-in">
                <h3 :key="currentLocaleKey">{{ t('_aboutPastor') }}</h3>
              </Transition>
              <Transition name="fade-blur" mode="out-in">
                <h3 :key="currentLocaleKey">{{ t('_aboutPastora') }}</h3>
              </Transition>
            </div>
                  
            <div style="padding: 2rem 0 0 0" class="about-button">
              <Transition name="fade-blur" mode="out-in">
                <button class="btn-more" :key="currentLocaleKey">{{ t('_aboutButton') }}</button>  
              </Transition>
            </div>

            </div>
        </div>
      </div>
    </div>

  </main>
</template>
  

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  min-height: 87vh;
  width: 100%;
  padding: 150px 2rem 2rem 2rem;
    align-items: center;
}

.card-content{

  max-width: 1280px;
}

.title {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  /* padding: 1rem; */
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

.card-skill{
  border: solid 1px var(--color-border);
  /* border-radius: 8px; */
  background-color: transparent;
}

.content-about {
  display: flex;
  padding: 0 10rem;
  flex-direction: row;
  text-align: justify;
  /* align-items: flex-start; */
  justify-content: center;
  /* flex-wrap: wrap-reverse; */
  gap: 3rem;
  width: 100%;
}

.content.animate p{
    font-size: 1rem;
    padding: 1rem 0 1rem 2rem;
}

.cards {
  display: flex;
  gap: 1.5rem;
  /* padding: 0 1rem; */
  flex-wrap: wrap;
  justify-content: center;
}

.column, .card-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.card-content{
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.row, .row-text {
    display: flex;
    flex-direction: column;
}

.row-text{
  gap: .5rem;
}

.image-about{
    display: flex;
    padding: .5 rem;
    justify-content: center;
    align-items: center;
    min-width: 380px !important;
    height: 380px;
    overflow: hidden;
    
}

.image-about img{
  /* overflow: hidden; */
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  object-fit: cover;
  object-position:top;
}

.category h3 {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: var(--color-text);
  /* margin-bottom: .5rem; */
}

h3{
  font-size: .8rem;
  font-weight: 500;
  color: var(--color-heading);
}

.skills-group {
  display: flex;
  flex-direction: column;
  gap: 1.0rem;
  flex-wrap: wrap;
  justify-content: center;
  background-color: var(--color-background-soft);
  border: none;
  border-radius: 5px;
  padding: 1rem;
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

.btn-more{
  display: flex;
  text-decoration: none;
  padding: 1rem;
  border: solid 1px var(--color-border);
  background-color: transparent;
  cursor: pointer;
  color: var(--color-text);
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: 150px;
  animation: all .5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.btn-more:hover{
  background-color: var(--color-background-soft);
}

@media screen and (max-width: 1024px) {
  .content-about{
    padding: 0 2rem;
    flex-wrap: wrap;
  }
  
}

@media screen and (max-width: 768px) {
  .content {
    padding: 0 1rem;
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

  .content {
    padding: 0 1rem;
  }
  .socials{
    padding: 0 0 0.5rem 0 !important;
  }
  .title{
    order: 1;
  }
  .image-about{
    order:2;
    padding: 0 1rem;
  }
  .about-description{
    order: 3;
  }
  .about-pastor{
    order:4;
    text-align: left;
    width: 100%;
  }
  .about-button{
    order: 5;
    width: 100%;
  }

}

</style>
