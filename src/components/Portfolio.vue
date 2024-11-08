<script setup>
import { ref, onMounted } from 'vue';
import Modal from './Tools/Modal.vue';

const projects = ref([
  {
    title: 'Site para Psicóloga Renata',
    url: 'www.psirenatamachado.com',
    links: [{plataforma: 'Preview', link:'https://www.psirenatamachado.com', icon:'fa-solid fa-eye'}],
    tags:['HTML', 'CSS', 'JavaScript', 'Vue'],
    images: ['/src/assets/psirenatamachado.png','/src/assets/psirenatamachado _all.jpeg'],
    legend: ['Tela inicial do site'],
    details: 'A psicóloga Renata, especialista em terapia cognitico comportamental, precisava de um website moderno e funcional para melhorar sua presença online e ampliar a captação de pacientes.'
  },
  {
    title: 'Sistema de Pedidos',
    url:'localhost',
    links: [{plataforma: 'Code', link:'https://www.psirenatamachado.com', icon:'fa-brands fa-github'}, {plataforma: 'Preview', link:'https://www.psirenatamachado.com', icon:'fa-solid fa-eye'}],
    tags:['HTML', 'CSS', 'JavaScript', 'Vue'],
    images: ['/src/assets/makeburguer_home.png', '/src/assets/makeburguer_pedidos.png', '/src/assets/makeburguer_newpedido.png'],
    legend: ['Tela de gerência de pedidos', 'Tela inicial da aplicação.', 'Tela onde o burguer é montado.'],
    details: 'Esse projeto simula um sistema de pedidos, onde o cliente pode escolher o tipo de pão, a carne e os complementos.'
  },
  {
    title: 'CourseAPI',
    url: 'https://github.com/eduardojacomo/CoursesAPI',
    links: [{plataforma: 'Code', link:'https://github.com/eduardojacomo/CoursesAPI' , icon:'fa-brands fa-github'}, {plataforma: 'Preview', link:'', icon:'fa-solid fa-eye'}],
    tags:['.Net', 'SQL Server'],
    images: ['/src/assets/CourseAPI.png'],
    legend: ['Tela inicial do site'],
    details: 'Esse projeto visa em fornecer uma API para cursos, contendo dados de módulos, aulas, alunos, instrutores, notas, acompanhamento das aulas etc.'
  },
  // Outros projetos
]);

const showModal = ref(false);
const selectedProject = ref(null);
const hoveredProjectIndex = ref(null);

function openModal(project) {
  selectedProject.value = project;
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
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
  const projectElements = document.querySelectorAll('.column_portifolio');
  observeElements(projectElements);
});
</script>

<template>
    <main>
      <div class="container">
        <div class="title">
          <h1>Portifolio</h1>
        </div>
        <div class="column">
          <div class="socials">
            <div class="linha-vertical"></div>
          </div>
          <div class="projects">
            <div
              v-for="(project, index) in projects"
              :key="index"
              class="column_portifolio animate"
            >
              <div
                class="image-content"
                @mouseover="hoveredProjectIndex = index"
                @mouseleave="hoveredProjectIndex = null"
              >
                <img :src="project.images[0]" alt="" class="image" />
                <Transition name="slide-fade">
                    <button v-if="hoveredProjectIndex === index" @click="openModal(project)">
                      <font-awesome-icon icon="fa-solid fa-external-link" />
                    </button>
                 </Transition>
                 <Transition class="slide-fade">
                     <div class="text"  v-if="hoveredProjectIndex === index">
                      <h2><strong>{{ project.title }}</strong></h2>
                      <p>{{ project.description }}</p>
                    </div>
                 </Transition>
              </div>
            </div>
  
            <!-- Transições de fundo branco e preto e conteúdo do modal -->
            <transition name="modal">
              <div v-if="showModal" class="modal-wrapper">
                <div class="slide-background white-slide"></div>
                <div class="slide-background black-slide"></div>
                <div class="modal-content" v-if="!isAnimating">
                  <Modal :project="selectedProject" @close="closeModal" />
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </main>
  </template>
  

<style scoped>
/* Estilos para as animações do modal com translateX */
@keyframes slide-in-white {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-in-black {
  0% {
    transform: translateX(100%);
  }
  50%{
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

/* Transição para a opacidade do conteúdo do modal */
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Modal wrapper que contém todas as animações */
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  z-index: 9999;
}

/* Animação de fundo branco */
.white-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  animation: slide-in-white 0.5s ease forwards;
  z-index: 2;
}

/* Animação de fundo preto */
.black-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  animation: slide-in-black 1s ease forwards;
  z-index: 3;
}

/* Conteúdo do modal com transição de opacidade */
.modal-content {
  position: relative;
  z-index: 3;
  animation: fade-in 1s ease forwards;
  animation-delay: 1.5s;
  opacity: 0;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 87vh;
  width: 100%;
  padding: 70px 2rem 0.5rem 2rem;
}

.title {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem 1rem 0.8rem 1rem;
}

.title h1 {
  font-size: 3rem;
  font-weight: 700;
}

.projects {
  display: flex;
  gap: 1rem;
  padding: 1rem 1rem 1rem 5rem;
  flex-wrap: wrap;
}

.column_portifolio {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: clamp(400px, 100%, 600px);
}

.image-content {
  position: relative;
  height: clamp(210px, 100%,337px);
  justify-content: center;
  align-items: center;
  overflow: hidden; 
}

.image-content img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  transition: all 0.3s ease-in-out; 
}

.image-content:hover img {
  filter: brightness(10%);
}

.image-content button {
  background-color: var(--color-heading);
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 1rem;
  opacity: 0; 
  transform: translateY(20px); 
  transition: all 0.3s ease-in-out; 
}

.image-content:hover button {
  opacity: 1; 
  transform: translateY(0); 
}

.text {
  display: flex;
  position: absolute;
  flex-direction: column;
  bottom: 20px;
  left: 0;
  padding: 1rem 5rem 0 2rem;
  text-align: justify;
  color: var(--color-heading);
  opacity: 0; 
  transform: translateY(20px);
  transition: all 0.3s ease-in-out; 
}

.image-content:hover .text {
  opacity: 1;
  transform: translateY(0);
}

.text h2 {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.text p {
  font-size: 1rem;
}
</style>
