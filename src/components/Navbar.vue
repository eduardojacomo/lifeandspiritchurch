<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {useLanguage} from '../stores/languageStore'
import {storeToRefs} from 'pinia';

const uselanguage = useLanguage();
const { locale, currentLocaleKey} = storeToRefs(uselanguage);

// function setLanguage() {
//   uselanguage.setLanguage();
//  }
const { t, locale: i18nLocale } = useI18n();
 

const isOpen = ref(false);
const navbarRef = ref(null);
const route = useRoute();
const isHomePage = computed(() => route.path === '/' || route.path === '/home');
const isTop   = ref(true);

const menuItems = ref([
  {
    labelKey: '_nav._home',
    route: '/'
  },
  {
    labelKey: '_nav._about',
    children: [
      { labelKey: '_about._about_us', route: '/aboutus' },
      { labelKey: '_about._our_pastors', route: '/pastors' },
      { labelKey: '_about._our_activities', route: '/activities' }
    ]
  },
  {
    labelKey: '_nav._scheadle',
    route: '/scheadle'
  },
  {
    labelKey: '_nav._content',
    children: [
      { labelKey: '_content._news', route: '/news' },
      { labelKey: '_content._content', route: '/content' }
    ]
  },
  {
    labelKey: '_nav._contact',
    route: '/contact'
  },
]);

const isSubmenuVisible = ref(menuItems.value.map(() => false));
const submenuPositions = ref(menuItems.value.map(() => 0));
const menuItemRefs = ref([]);

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function setLanguage(lang) {
  // Seu método para trocar de idioma
  // locale.value = lang
  uselanguage.setLanguage(lang);
  showDropdown.value = false
}

// Clique fora para fechar
function handleClickOutsideLanguage(event) {
  const dropdown = document.querySelector('.language-selector')
  if (dropdown && !dropdown.contains(event.target)) {
    closeDropdown()
  }
}


const handleMouseEnter = (index) => {
  isTop.value = false;
  isSubmenuVisible.value = isSubmenuVisible.value.map((_, i) => i === index);
  if (menuItemRefs.value[index]) {
    const rect = menuItemRefs.value[index].getBoundingClientRect();
    submenuPositions.value[index] = rect.left;
  }
};

const handleMouseLeave = (index) => {
  setTimeout(() => {
    isSubmenuVisible.value[index] = false;
  }, 300);
  onScroll();
};

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
  document.addEventListener('click', handleClickOutsideLanguage)
  window.addEventListener('scroll', onScroll, { passive: true });
  menuItemRefs.value = Array(menuItems.value.length).fill(null);
  onScroll(); // inicializa
});


onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('click', handleClickOutsideLanguage);
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
      <nav class="navbar-new">
        <ul class="main-menu">
          <li
            v-for="(item, index) in menuItems"
            :key="index"
            class="menu-item"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <router-link v-if="item.route" :to="item.route">{{ t(item.labelKey) }}</router-link>
            <span v-else>{{ t(item.labelKey) }} <font-awesome-icon icon="fa-solid fa-caret-down" /></span>
            <Transition name="submenu-transition">
              <ul v-if="isSubmenuVisible[index]" class="submenu">
                <li v-for="child in item.children" :key="child.labelKey" class="submenu-item">
                  <router-link :to="child.route">{{ t(child.labelKey) }}</router-link>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </nav>
      
      <div class="btn-actions-menu">
    
          <div class="language-selector">
            <button class="languageButton" @click="toggleDropdown">
              <font-awesome-icon icon="fa-solid fa-language" />
            </button>

            <ul v-if="showDropdown" class="language-dropdown">
              <li @click="setLanguage('pt')">PT-BR</li>
              <li @click="setLanguage('en')">EN</li>
            </ul>
          </div>
        <div class="hamburger" @click="toggleMenu">
          <font-awesome-icon :icon="isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" />
        </div>

      </div>
      
      <Transition name="fade" mode="out-in">
            
        <ul :class="['nav-links', { open: isOpen }]" :key="isOpen">
          <template v-for="(item, index) in menuItems" :key="index">
            <li v-if="item.route">
              <router-link :to="item.route" @click="closeMenu">{{ t(item.labelKey) }}</router-link>
            </li>
            <li v-else-if="item.children">
              <span class="submenu-label">{{ t(item.labelKey) }}</span>
              <ul class="mobile-submenu">
                <li v-for="child in item.children" :key="child.labelKey">
                  <router-link :to="child.route" @click="closeMenu">{{ t(child.labelKey) }}</router-link>
                </li>
              </ul>
            </li>
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
  transition: background-color .3s ease;
  color: white;
  z-index: 2000;
  /*transition: background-color 0.4s ease-in-out;*/
  /* position:relative; */
  transition: background-color 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out, box-shadow 0.4s;

}

.navbar--transparent {
  background-color: transparent !important;
}

/* cor padrão em todo resto */
.navbar--solid {
  /* background-color: var(--color-background) !important; */
  background-color: #000 !important;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/*novo menu */

.navbar-new{
  display: block;
}

/* Transição */
.submenu-transition-enter-active,
.submenu-transition-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.submenu-transition-enter-from,
.submenu-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.submenu-transition-enter-to,
.submenu-transition-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.main-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center; /* Centraliza os itens principais */
}

.menu-item {
  position: relative;
  padding: 10px 20px;
}

.menu-item > a,
.menu-item > span {
  display: block;
  text-decoration: none;
  color: var(--color-text);
  cursor: pointer;
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--color-background-mute);
  border:none;
  z-index: 10;
  min-width: 100%; /* Largura mínima do submenu */
}

.submenu-item a, .full-width-submenu-item a {
  display: block;
  padding: 10px 25px 10px 15px;
  text-decoration: none;
  color: white;
}

.submenu-item a:hover, .full-width-submenu-item a:hover {
  background-color: #555;
}

.submenu-label {
  font-weight: bold;
  color: white;
  text-align: center;
  margin-top: 1rem;
}

.mobile-submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  /*padding-left: 1rem;
  margin-bottom: 1rem;*/
  background-color: #444;
}

.mobile-submenu li a {
  font-size: .9rem;
  color: white;
  text-decoration: none;
}

.mobile-submenu li a:hover {
  text-decoration: underline;
}

/*fim novo menu */
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

/* menu language */
.language-selector {
  position: relative;
}

.language-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--color-background-soft);
  /* border-radius: 5px; */
  width: 100px;
  padding: 0;
  margin-top: 0.5rem;
  z-index: 999;
  list-style: none;
}

.language-dropdown li {
  padding: 10px;
  cursor: pointer;
  color: var(--color-heading);
}

.language-dropdown li:hover {
  background-color: var(--color-background-mute);
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

  .navbar--transparent {
    background-color: var(--color-background) !important;
  }

  .navbar-new {
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
  