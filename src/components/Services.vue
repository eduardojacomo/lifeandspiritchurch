<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CardService from './CardService.vue';
import {useLanguage} from '../stores/languageStore'
import {storeToRefs} from 'pinia';

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
  observeElements(sections);
});
</script>

<template>
    <main>
      <div class="container">
        <div class="title animate">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey">{{t('_servicesTitle')}}</h1>
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
                <Transition name="fade-blur" mode="out-in">
                  <CardService :icon="'fa-solid fa-mobile'" :title="'APP'" :link="'mobile'" :content="t('_serviceAPP')" :key="currentLocaleKey" />
                </Transition> 
                <Transition name="fade-blur" mode="out-in">
                  <CardService :icon="'fa-solid fa-terminal'" :title="'Developer'" :link="'developer'" :content="t('_serviceDeveloper')" :key="currentLocaleKey" />
                </Transition> 
                <Transition name="fade-blur" mode="out-in">
                  <CardService :icon="'fa-solid fa-robot'" :title="'BOT'" :link="'bots'" :content="t('_serviceBots')" :key="currentLocaleKey" />                  
                </Transition> 
                <Transition name="fade-blur" mode="out-in">
                  <CardService :icon="'fa-solid fa-laptop-code'" :title="'Web Solutions'" :link="'websolutions'" :content="t('_serviceWeb')" :key="currentLocaleKey" />
                </Transition> 
     
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
}


.column, .card-content {
    display: flex;
    flex-direction: row;
}

.row {
    display: flex;
    flex-direction: column;
}
.linha-vertical {
  border-left: 2px solid var(--color-text);
  height: 180px;
  margin: 0 0 0 8px;
}

.icon{
    display: flex;
    padding: 1rem 2rem;
    justify-content: center;
    align-items: center;
    font-size: 7rem;
}

.category h3 {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  /* margin-bottom: .5rem; */
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

.socials {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: .5rem;
  padding: 0 0 .5rem 1rem;
  font-size: 1.2rem;
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
