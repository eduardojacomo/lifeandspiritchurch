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
              <button class="btn-contact">{{t('_contactButton')}}</button>
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
  padding: 1rem;
  border: solid 1px var(--color-border);
  background-color: transparent;
  cursor: pointer;
  color: var(--color-text);
  align-items: center;
  justify-content: center;
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
  color: var(--color-text);
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
