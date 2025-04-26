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
const isTop   = ref(true);

function onScroll() {
  isTop.value = window.scrollY === 0
}

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
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // inicializa
});


onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
    <nav class="navbar" ref="navbarRef" :class="{
    'navbar--transparent': isHomePage && isTop,
    'navbar--solid': !(isHomePage && isTop)
  }">

      <div class="logo">
        <a href="#"><img src="../assets/logo.png" alt="logo"></a>
      </div>
      <div class="menu">
        <ul>
          <li><a href="#home" @click="closeMenu" @click.prevent="scrollTo('home')">{{ t('_nav._home') }}</a></li>
          <li><a href="#about" @click="closeMenu" @click.prevent="scrollTo('about')">{{ t('_nav._about') }}</a></li>
          <li><a href="#scheadle" @click="closeMenu" @click.prevent="scrollTo('scheadle')">{{ t('_nav._scheadle') }}</a></li>
          <li><a href="#content" @click="closeMenu" @click.prevent="scrollTo('content')">{{ t('_nav._content') }}</a></li>
          <li><a href="#contact" @click="closeMenu" @click.prevent="scrollTo('contact')">{{ t('_nav._contact') }}</a></li>
        </ul>
      </div>
      
      <div class="btn-actions-menu">
        <button class="languageButton" @click="setLanguage">
          <font-awesome-icon icon="fa-solid fa-language" /> <span>{{ locale === 'pt' ? 'PT-BR' : 'EN' }} </span>
        </button>
        <div class="hamburger" @click="toggleMenu">
          <font-awesome-icon :icon="isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" />
        </div>

      </div>
      
      <Transition name="fade" mode="out-in">
            
        <ul :class="['nav-links', { open: isOpen }]" :key="isOpen">
          <template v-if="isHomePage">
            <li><a href="#home" @click="closeMenu" @click.prevent="scrollTo('home')">{{ t('_nav._home') }}</a></li>
            <li><a href="#about" @click="closeMenu" @click.prevent="scrollTo('about')">{{ t('_nav._about') }}</a></li>
            <li><a href="#scheadle" @click="closeMenu" @click.prevent="scrollTo('scheadle')">{{ t('_nav._scheadle') }}</a></li>
            <li><a href="#content" @click="closeMenu" @click.prevent="scrollTo('content')">{{ t('_nav._content') }}</a></li>
            <li><a href="#contact" @click="closeMenu" @click.prevent="scrollTo('contact')">{{ t('_nav._contact') }}</a></li>
          </template>
  
          <template v-else>
            <li><router-link to="/" @click="closeMenu">{{ t('_nav._home') }}</router-link></li>
            <li><router-link to="/#about" @click="closeMenu">{{ t('_nav._about') }}</router-link></li>
            <li><router-link to="/#scheadle" @click="closeMenu">{{ t('_nav._scheadle') }}</router-link></li>
            <li><router-link to="/#content" @click="closeMenu">{{ t('_nav._content') }}</router-link></li>
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
  padding: .5rem 2rem;
  /* background-color: var(--color-background); */
  transition: background-color .3s ease;
  color: white;
  z-index: 2000;
}

.navbar--transparent {
  background-color: transparent !important;
}

/* cor padrão em todo resto */
.navbar--solid {
  background-color: var(--color-background) !important;
}

.btn-actions-menu{
  display: flex;
  flex-direction: row;
  gap: .5rem;
}

.menu ul{
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: .5rem;
  background-color: transparent;
}

.menu li a {
  text-decoration: none;
  color: white;
  font-size: 1rem;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.menu li a:hover {
  background-color: #444;
  color: #ddd;
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
  display: none;
  
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

  .menu {
    display: none;
  }

  .hamburger{
    z-index: 100;
    display: block;
  }
  .nav-links.open {
    justify-content: center;
  }
}
</style>
  