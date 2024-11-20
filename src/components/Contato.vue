<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const handleContentUpdate = (newContent) => {
  content.value = newContent;
};

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
          <h1>{{ t('_contactTitle') }}</h1>
        </div>
        <div class="column">
          <div class="icons">
            <div class="column-contact">
              <a href="https://www.linkedin.com/in/eduardojacomo/" target="_blank"><i class="devicon-linkedin-plain"></i><span>/eduardojacomo</span></a> 
            </div>
            <div class="column-contact">
              <a href="https://github.com/eduardojacomo/" target="_blank"><i class="devicon-github-original"></i><span>/eduardojacomo</span></a>
              
            </div>
          </div>
          <div class="row">
            <div class="content animate">
  
              <p>{{ t('_contactDescription') }}</p>
              
            </div>
            <div class="button">
              <a href="https://api.whatsapp.com/send/?phone=5524992397625&text&type=phone_number&app_absent=0" target="_blank" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="whatsapp_icon"><path fill="#ebebeba3" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg> {{t('_contactButton')}}</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
  

<style scoped>
/* Estilos para as animações */
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

.content {
  display: flex;
  padding: 0 7rem;
  text-align: justify;
}

.btn-contact{
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
  width: 250px;
  animation: all .5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.btn-contact:hover{
  background-color: var(--color-background-soft);
}

.content.animate p{
    font-size: 1.2rem;
    padding: 1rem 0 1rem 3rem;
}


.column, .column-contact {
    display: flex;
    flex-direction: row;
}

.column-contact{
  gap: .5rem;
  align-items: center;
  justify-content: center;
}

.row {
    display: flex;
    flex-direction: column;
}

.icons{
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem 1rem 5rem;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    gap: .5rem;
}

.icons a{
  text-decoration: none;
  color: var(--color-heading);
}

.category h3 {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  /* margin-bottom: .5rem; */
}


.button{
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0 7rem;
}

.whatsapp_icon{
  width: 25px;
  height: 25px;
  color: var(--color-text);
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
  .content {
    padding: 0 !important;
  }
}

@media screen and (max-width: 840px) {

  .column{
    flex-direction: column !important;
  }
  .container{
    padding: 70px 1rem 1rem 1rem;
  }
  .content.animate p, .icons{
    padding: 1rem;
}
}
</style>
