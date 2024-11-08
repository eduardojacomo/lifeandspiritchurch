<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from './Card.vue';
import EditorText from './EditorText.vue';
const about = 'Estou aguardando o seu contato. Vamos Criar juntos?'
const title = 'Contact';
const content = ref('');
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
          <h1>{{ title }}</h1>
        </div>
        <div class="column">
          <div class="socials">
            <div class="linha-vertical"></div>
          </div>
          <div class="row">
            <div class="content animate">
              <div class="icon">
                <font-awesome-icon icon="fa-solid fa-handshake" />
              </div>
              <p>{{ about }}</p>
              <EditorText @update="handleContentUpdate" />
              {{ content }}
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
  font-size: 3rem;
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

.content.animate p{
    font-size: 1.2rem;
    padding: 1rem 0 1rem 3rem;
}

.cards {
  display: flex;
  gap: 1.5rem;
  padding: 0 6rem 1rem 8rem;
  flex-wrap: wrap;
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
    padding: 1rem 5rem;
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
</style>
