<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {useLanguage} from '../stores/languageStore'
import {storeToRefs} from 'pinia';

const uselanguage = useLanguage();
const { locale, currentLocaleKey} = storeToRefs(uselanguage);

function setLanguage() {
  uselanguage.setLanguage();
  console.log(locale.value);
 }
const { t, locale: i18nLocale } = useI18n();
 

const isOpen = ref(false);
const navbarRef = ref(null);
// const menuitems = ref([]);
const route = useRoute();
const isHomePage = computed(() => route.path === '/' || route.path === '/home');


const scrollTo = (sectionId) => {
const section = document.getElementById(sectionId);
if (section) {
  section.scrollIntoView({ behavior: 'smooth' });
  isOpen.value = false; // Close menu after scrolling
}
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};
  
const handleClickOutside = (event) => {
  if (navbarRef.value && !navbarRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

watch(locale, (newLocale) => {
  i18nLocale.value = newLocale; // Atualiza o vue-i18n quando o Pinia mudar
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
});


onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <nav class="navbar" ref="navbarRef">

      <div class="logo">
        <a href="#"><img src="../assets/ej.webp" alt="logo"></a>
        <button class="languageButton" @click="setLanguage">
          <font-awesome-icon icon="fa-solid fa-language" /> <span>{{ locale === 'pt' ? 'PT-BR' : 'EN' }} </span>
      </button>
      </div>
      
      <div class="hamburger" @click="toggleMenu">
        <font-awesome-icon :icon="isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" />
      </div>
  
      <Transition name="fade" mode="out-in">
            
        <ul :class="['nav-links', { open: isOpen }]" :key="isOpen">
          <template v-if="isHomePage">
            <li><a href="#home" @click="closeMenu" @click.prevent="scrollTo('home')">{{ t('_nav._home') }}</a></li>
            <li><a href="#about" @click="closeMenu" @click.prevent="scrollTo('services')">{{ t('_nav._services') }}</a></li>
            <li><a href="#about" @click="closeMenu" @click.prevent="scrollTo('about')">{{ t('_nav._about') }}</a></li>
            <li><a href="#portfolio" @click="closeMenu" @click.prevent="scrollTo('portfolio')">{{ t('_nav._projects') }}</a></li>
            <li><a href="#contact" @click="closeMenu" @click.prevent="scrollTo('contact')">{{ t('_nav._contact') }}</a></li>
          </template>
  
          <template v-else>
            <li><router-link to="/" @click="closeMenu">{{ t('_nav._home') }}</router-link></li>
            <li><router-link to="/#services" @click="closeMenu">{{ t('_nav._services') }}</router-link></li>
            <li><router-link to="/#about" @click="closeMenu">{{ t('_nav._about') }}</router-link></li>
            <li><router-link to="/#portfolio" @click="closeMenu">{{ t('_nav._projects') }}</router-link></li>
            <li><router-link to="/#contact" @click="closeMenu">{{ t('_nav._contact') }}</router-link></li>
          </template>
        </ul>
      </Transition>    
    </nav>
  </template>
  
  <style scoped>
  /* Transitions */
  .fade-enter-active,
  .fade-leave-active {
  transition: all 0.5s ease-in;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(100px); 
}

.fade-enter-to {
  opacity: 1;
  transform: translateX(0); 
}

.fade-leave-from {
  opacity: 1;
  transform: translateX(0); 
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(100px); 
}
  /* General styles */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: var(--color-background);
    /* background-color: var(--color-background); */
    color: white;
    z-index: 2000;
  }
  
  .logo {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  .logo a {
    text-decoration: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .logo img{
    height: 38.40px;
  }
  
  /* Hamburger icon styles */
  .hamburger {
    font-size: 1.5rem;
    cursor: pointer;
    
  }
  
  /* Navigation links */
  .nav-links {
    list-style: none;
    display: none;
    flex-direction: column;
    gap: 1.5rem;
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--color-background-soft);
    padding: 1rem;
    height: 100vh;
    width: 250px;
  }
  
  .nav-links.open {
    display: flex;
  }
  
  .nav-links li {
    text-align: center;
  }
  
  .nav-links li a {
    text-decoration: none;
    color: white;
    font-size: 1.2rem;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .nav-links li a:hover {
    background-color: #444;
    color: #ddd;
  }

  .languageButton {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: .5rem;
    background-color: transparent;
    border: none;
    width: 150px;
    justify-content: flex-start;
    color: var(--color-heading);
    font-size: 1.2rem;
    align-items: center;
  }

  .languageButton span{
    font-size: .8rem;
  }

  @media (max-width: 768px) {
    .nav-links {
      width: 100%;
    }
    .hamburger{
      z-index: 100;
    }
    .nav-links.open {
      justify-content: center;
    }
  }
  </style>
  