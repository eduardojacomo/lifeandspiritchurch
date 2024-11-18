<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Card from './Card.vue';
import { useI18n } from 'vue-i18n';
import {useLanguage} from '../stores/languageStore'
import {storeToRefs} from 'pinia';

const uselanguage = useLanguage();
const { currentLocaleKey} = storeToRefs(uselanguage);

const { t, locale } = useI18n();


const skills = ref([
  { icon: 'devicon-html5-plain-wordmark colored', label: 'HTML', group:'Front-End' },
  { icon: 'devicon-css3-plain colored', label: 'CSS' , group:'Front-End' },
  { icon: 'devicon-javascript-plain colored', label: 'JavaScript' , group:'Front-End' },
  { icon: 'devicon-vuejs-plain colored', label: 'Vue' , group:'Framework' },
  { icon: 'devicon-bootstrap-plain colored', label: 'Bootstrap' , group:'Framework' },
  { icon: 'devicon-bulma-plain colored', label: 'Bulma' , group:'Framework' },
  { icon: 'devicon-dotnetcore-plain colored', label: '.Net' , group:'Back-End' },
  { icon: 'devicon-python-plain colored', label: 'Python', group:'Back-End' },
  { icon: 'devicon-nextjs-original-wordmark', label: 'Next JS', group:'Back-End' },
  { icon: 'devicon-microsoftsqlserver-plain-wordmark colored', label: 'SQL Server' , group:'Database' },
  { icon: 'devicon-postgresql-plain colored', label: 'Postgre SQL' , group:'Database' },
  { icon: 'devicon-mongodb-plain colored', label: 'MongoDB' , group:'Database' }
]);

          
const groupedSkills = computed(() => {
  const groups = {};
  skills.value.forEach(skill => {
    if (!groups[skill.group]) {
      groups[skill.group] = [];
    }
    groups[skill.group].push(skill);
  });
  return groups;
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
        <div class="title animate">
          <Transition name="fade" mode="out-in">
            <h1 :key="currentLocaleKey">{{ t('_aboutTitle') }}</h1>
          </Transition>
        </div>
        <div class="row">
          <div class="content animate">
              <div class="image animate">
                  <img src="/src/assets/about.webp" alt="Me" />
              </div>
              <div class="row">
                <Transition name="fade" mode="out-in">
                  <p :key="currentLocaleKey">{{ t('_aboutDescription') }}</p>
                </Transition>
                <div class="title animate">
              <h2>Skills</h2>
            </div>
  
            <!-- Iterar sobre os grupos de habilidades -->
            <div class="cards">
              <!-- <div v-for="(skills, groupName) in groupedSkills" :key="groupName" class="category animate">
                  <div class="skills-group">
                    <h3>{{ groupName }}</h3>
                    <div class="card-content animate">
                        <div v-for="(skill, index) in skills" :key="index" class="animate">
                            <Card :icon="skill.icon" :label="skill.label" />
                        </div>
                    </div>
                </div>
              </div> -->
                <div class="card-content animate">
                    <div v-for="(skill, index) in skills" :key="index" class="animate">
                        <Card :icon="skill.icon" :label="skill.label" class="card-skill" />
                    </div>
                  </div>
            </div>
              </div>
            </div>
            
          
          </div>

      </div>
    </main>
  </template>
  

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
}

.title h2{
    font-size: 1.5rem;
  font-weight: 500;
}

.card-skill{
  border: none;
  border-radius: 8px;
  background-color: var(--color-background-soft);
}

.content {
  display: flex;
  padding: 0 3rem;
  text-align: justify;
  align-items: flex-start;
  justify-content: center;
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

.row {
    display: flex;
    flex-direction: column;
}
.linha-vertical {
  border-left: 2px solid var(--color-text);
  height: 180px;
  margin: 0 0 0 8px;
}

.image{
    display: flex;
    padding: 1rem 2rem;
    justify-content: center;
    align-items: center;
    font-size: 7rem;
    width: 380px;
}

.image img{
  overflow: hidden;
  width: 350px;
  border: none;
  border-radius: 8px;
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
}

</style>
