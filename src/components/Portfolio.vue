<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useProjects} from '@/stores/projectStore'
import {useLanguage} from '../stores/languageStore'

const uselanguage = useLanguage();
const { currentLocaleKey} = storeToRefs(uselanguage);

const router = useRouter();
const useprojects = useProjects();
const {projectStore, setProject} = storeToRefs(useprojects);
const resolucao = ref('');
const { t } = useI18n();

const projects = ref([
  {
    codigo: 'p1',
    title: 'Site para Psicóloga Renata',
    url: 'www.psirenatamachado.com',
    links: [{plataforma: 'Preview', link:'https://www.psirenatamachado.com', icon:'fa-solid fa-eye'}],
    tags:['HTML', 'CSS', 'JavaScript', 'Vue'],
    imagesNavegador: [{ src: new URL('/src/assets/psirenatamachado.png', import.meta.url).href, alt: 'Image 1'}, { src: new URL('/src/assets/psirenatamachado _all.jpeg', import.meta.url).href, alt: 'Image 2'}],
    imagesTablet: [{ src: new URL('/src/assets/psirenatamachado.png', import.meta.url).href, alt: 'Image 1'}, { src: new URL('/src/assets/psirenatamachado _all.jpeg', import.meta.url).href, alt: 'Image 2'}],
    imagesSmartphone: [{ src: new URL('/src/assets/psirenatamachado.png', import.meta.url).href, alt: 'Image 1'}, { src: new URL('/src/assets/psirenatamachado _all.jpeg', import.meta.url).href, alt: 'Image 2'}],
    legend: ['Tela inicial do site'],
    description: 'Site moderno, responsivo, rápido e que atende as necessidades do cliente',
    details: 'A psicóloga Renata, especialista em terapia cognitico comportamental, precisava de um website moderno e funcional para melhorar sua presença online e ampliar a captação de pacientes.'
  },
  {
    codigo: 'p2',
    title: 'Sistema de Pedidos',
    url:'localhost',
    links: [{plataforma: 'Code', link:'https://www.psirenatamachado.com', icon:'fa-brands fa-github'}, {plataforma: 'Preview', link:'https://www.psirenatamachado.com', icon:'fa-solid fa-eye'}],
    tags:['HTML', 'CSS', 'JavaScript', 'Vue'],
    imagesNavegador: [{ src: new URL('/src/assets/makeburguer_home.png', import.meta.url).href, alt: 'Image 1'}, 
    { src: new URL('/src/assets/make-burguer-capa-website.jpeg', import.meta.url).href, alt: 'Image 2'}, 
    { src: new URL('/src/assets/make-burguer-pedidos-website.jpeg', import.meta.url).href, alt: 'Image 3'}],
    imagesTablet: [{ src: new URL('/src/assets/makeburguer_home.png', import.meta.url).href, alt: 'Image 1'}, 
    { src: new URL('/src/assets/make-burguer-capa-ipad.jpeg', import.meta.url).href, alt: 'Image 2'}, 
    { src: new URL('/src/assets/make-burguer-pedido-ipad.jpeg', import.meta.url).href, alt: 'Image 3'}],
    imagesSmartphone: [{ src: new URL('/src/assets/makeburguer_home.png', import.meta.url).href, alt: 'Image 1'}, 
    { src: new URL('/src/assets/make-burguer-capa-smartphone.jpeg', import.meta.url).href, alt: 'Image 2'}, 
    { src: new URL('/src/assets/make-burguer-pedidos-smartphone.jpeg', import.meta.url).href, alt: 'Image 3'}],
    legend: ['Tela de gerência de pedidos', 'Tela inicial da aplicação.', 'Tela onde o burguer é montado.'],
    description: 'Sistema gerenciador de pedidos utilizando o framework VueJS',
    details: 'Esse projeto simula um sistema de pedidos, onde o cliente pode escolher o tipo de pão, a carne e os complementos.'
  },
  {
    codigo: 'p3',
    title: 'CourseAPI',
    url: 'https://github.com/eduardojacomo/CoursesAPI',
    links: [{plataforma: 'Code', link:'https://github.com/eduardojacomo/CoursesAPI' , icon:'fa-brands fa-github'}, {plataforma: 'Preview', link:'', icon:'fa-solid fa-eye'}],
    tags:['.Net', 'SQL Server'],
    imagesNavegador: [{ src: new URL('/src/assets/CourseAPI.png', import.meta.url).href, alt: 'Image 1'}],
    imagesTablet: [{ src: new URL('/src/assets/apiCourseTablet.jpeg', import.meta.url).href, alt: 'Image 1'}],
    imagesSmartphone: [{ src: new URL('/src/assets/apiCourseSmartphone.jpeg', import.meta.url).href, alt: 'Image 1'}],
    legend: ['Tela inicial do site'],
    description: 'API RestFull utilizando as tecnologias .NET, SQL Server, Entity Framework, Swager',
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

function setProjectDetail(project){
  projectStore.value = project;
  router.push({ name: 'projects'});
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

function verifyResolution(){
  let _width = window.innerWidth;
  if (_width <= '480'){
    resolucao.value = 'Smartphone'
  } else if ( _width > '480' && _width <= '780'){
    resolucao.value = 'Tablet'
  }else{
    resolucao.value = 'Navegador'
  }

}

onUnmounted(() => {
      window.removeEventListener('resize', verifyResolution);
    });


onMounted(() => {
  const projectElements = document.querySelectorAll('.column_portifolio');
  verifyResolution();
  window.addEventListener('resize', verifyResolution);
  observeElements(projectElements);
});
</script>

<template>
    <main>
      <div class="container">
        <div class="title">
          <Transition name="fade-blur" mode="out-in">
            <h1 :key="currentLocaleKey">{{ t('_projectsTitle') }}</h1>
          </Transition>
          <Transition name="fade-blur" mode="out-in">
            <h3 :key="currentLocaleKey">{{ t('_projectsDescription') }}</h3>
          </Transition>
        </div>

          <!-- <div class="socials">
            <div class="linha-vertical"></div>
          </div> -->
          <div class="projects">
            <div
              v-for="(project, index) in projects"
              :key="index"
              class="column_portifolio animate"
            >
              <div 
              class="image-content"
              @mouseover="hoveredProjectIndex = index"
              @mouseleave="hoveredProjectIndex = null" >
                <Transition name="fade-blur" mode="out-in">
                  <img :src="project.imagesNavegador[0].src" :alt="project.imagesNavegador[0].alt" class="image" :key="currentLocaleKey"/>
                </Transition>
                  
                <Transition name="slide-fade">
                    <button v-if="hoveredProjectIndex === index" @click="setProjectDetail(project)">
                      <font-awesome-icon icon="fa-solid fa-external-link" />
                    </button>
                 </Transition>
                 <!-- <Transition class="slide-fade">
                     <div class="text"  v-if="hoveredProjectIndex === index">
                      <h2><strong>{{ project.title }}</strong></h2>
                      <p>{{ project.description }}</p>
                    </div> 
                 </Transition>-->
            </div>
            <div class="text">
              <Transition name="fade-blur" mode="out-in">
                <h2 :key="currentLocaleKey"><strong>{{t(`_${project.codigo}._title`)}} </strong></h2>
              </Transition>
              <Transition name="fade-blur" mode="out-in">
                <p :key="currentLocaleKey">{{ t(`_${project.codigo}._description`) }}</p>
              </Transition>
            </div>
            <!-- <div v-else class="image-content-mobile">
                <img :src="project.imagesNavegador[0].src" :alt="project.imagesNavegador[0].alt" class="image" />
                <div class="mobile-details">
                  <div class="text-mobile">
                    <h2><strong>{{ project.title }}</strong></h2>
                  </div>
                  <button @click="setProjectDetail(project)">
                    <font-awesome-icon icon="fa-solid fa-external-link" />
                  </button>

                </div>
            </div> -->
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
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 0.8rem 1rem;
}

.title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
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
  padding: 20px;
  border: solid 1px var(--color-border);
  /* border-radius: 8px; */
  /* background-color: var(--color-background-mute); */
  width: clamp(400px, 100%, 550px);
  gap: .5rem;
}

.image-content {
  position: relative;
  height: clamp(210px, 100%, 337px);
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: none;
  border-radius: 8px;
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
  flex-direction: column;
  padding: 0 1rem 1rem 1rem;
  text-align: justify;
  color: var(--color-text);
  gap: 1rem;
  /* position: absolute; */
  /* bottom: 20px;
  left: 0; */
  /* opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease-in-out; */
}

.image-content-mobile {
  display: flex;
  flex-direction: column;
  height: clamp(210px, 100%, 337px);
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  color: var(--color-heading);
}

.image-content-mobile img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
.mobile-details{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap:.5rem;
  width: 100%;
  background-color: var(--color-background-soft);
  
}

.mobile-details button {
  background-color: transparent;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  font-size: 1rem;
  color:var(--color-text);
}


.text-mobile {
  display: flex;
  flex-direction: column;
  padding: .5rem;
  text-align: justify;
  align-content: center;
  color:var(--color-text);
}

/* .image-content:hover .text {
  opacity: 1;
  transform: translateY(0);
} */

.text h2, .text-mobile h2 {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.text p, .text-mobile p {
  font-size: 1rem;
}

.animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.in-view {
  opacity: 1;
  transform: translateY(0);
}

@media screen and (max-width: 1092px){
  .projects{
    justify-content: center;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 70px 0.5rem 0.5rem 0.5rem;
  }

  .projects {
    padding: 1rem;
  }

  .image-content {
    flex-direction: column;
  }

  .text h2 {
    font-size: 1.1rem;
  }

  .text p {
    font-size: 0.9rem;
  }
}


</style>
