<template>
    <nav class="navbar" ref="navbarRef">

      <div class="logo">
        <a href="#">MyLogo</a>
      </div>

      <input type="checkbox" id="checkboxInput">
      <label for="checkboxInput" class="toggleSwitch" @click="toggleLanguage">
      <div class="speaker">{{ currentLanguageLabel }}</div>
      <div class="mute-speaker">{{ currentLanguageLabel }}</div>
      </label>

      <div class="hamburger" @click="toggleMenu">
        <font-awesome-icon :icon="isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" />
      </div>
  

      <ul :class="['nav-links', { open: isOpen }]">
        <template v-if="isHomePage">
      <li><a href="#home" @click="closeMenu" @click.prevent="scrollTo('home')">Home</a></li>
      <li><a href="#about" @click="closeMenu" @click.prevent="scrollTo('about')">About</a></li>
      <li><a href="#portfolio" @click="closeMenu" @click.prevent="scrollTo('portfolio')">Portfolio</a></li>
      <li><a href="#contact" @click="closeMenu" @click.prevent="scrollTo('contact')">Contact</a></li>
    </template>

    <!-- Caso não esteja na página principal, use router-link -->
    <template v-else>
      <li><router-link to="/" @click="closeMenu">Home</router-link></li>
      <li><router-link to="/#about" @click="closeMenu">About</router-link></li>
      <li><router-link to="/#portfolio" @click="closeMenu">Portfolio</router-link></li>
      <li><router-link to="/#contact" @click="closeMenu">Contact</router-link></li>
    </template>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n();

  // Alterna o idioma entre 'pt' e 'en'
  function toggleLanguage() {
    locale.value = locale.value === 'pt' ? 'en' : 'pt';
  }

  // Computed para mostrar o idioma atual no botão
  const currentLanguageLabel = computed(() => (locale.value === 'pt' ? 'PT' : 'EN'));
  const isOpen = ref(false);
  const navbarRef = ref(null);
  
  const route = useRoute();
  const isHomePage = computed(() => route.path === '/' || route.path === '/home');

  const scrollTo = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    isOpen.value = false; // Close menu after scrolling
  }
};

  // Toggle menu open/close
  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };
  
  // Close the menu when a link is clicked
  const closeMenu = () => {
    isOpen.value = false;
  };
  
  // Handle clicks outside the navbar
  const handleClickOutside = (event) => {
    if (navbarRef.value && !navbarRef.value.contains(event.target)) {
      isOpen.value = false;
    }
  };
  
  // Add event listener to detect clicks outside
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  // Remove event listener when component is destroyed
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  </script>
  
  <style scoped>
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
  
  .logo a {
    text-decoration: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
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

  /*toogle */
  .toggleSwitch {
  width: 50px;
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-bottom:solid 1px gray;
  cursor: pointer;
  transition-duration: .3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.13);
  overflow: hidden;
}

/* Hide default HTML checkbox */
  #checkboxInput {
    display: none;
  }



 

  .speaker {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition-duration: .3s;
  }

  .mute-speaker {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    z-index: 3;
    transition-duration: .3s;
  }

  #checkboxInput:checked +.toggleSwitch .speaker {
    opacity: 0;
    transition-duration: .3s;
  }

  #checkboxInput:checked +.toggleSwitch .mute-speaker {
    opacity: 1;
    transition-duration: .3s;
  }

  #checkboxInput:active + .toggleSwitch {
    transform: scale(0.7);
  }

  #checkboxInput:hover + .toggleSwitch {
    background-color: var(--color-background-mute);
    /* background-color: rgb(61, 61, 61); */
  }


  @media (max-width: 768px) {
    .nav-links {
      width: 100%;
    }
  }
  </style>
  