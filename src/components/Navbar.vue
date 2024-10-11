<template>
    <nav class="navbar" ref="navbarRef">
      <!-- Logo Section -->
      <div class="logo">
        <a href="#">MyLogo</a>
      </div>
  
      <!-- Hamburger Icon for All Devices -->
      <div class="hamburger" @click="toggleMenu">
        <font-awesome-icon :icon="isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" />
      </div>
  
      <!-- Navigation Links -->
      <ul :class="['nav-links', { open: isOpen }]">
        <li><a href="#home" @click="closeMenu" @click.prevent="scrollTo('home')">Home</a></li>
        <li><a href="#about" @click="closeMenu" @click.prevent="scrollTo('about')">About</a></li>
        <li><a href="#portfolio" @click="closeMenu" @click.prevent="scrollTo('portfolio')">Portfolio</a></li>
        <li><a href="#contact" @click="closeMenu" @click.prevent="scrollTo('contact')">Contact</a></li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const isOpen = ref(false);
  const navbarRef = ref(null);
  
  const scrollTo = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    menuOpen.value = false; // Close menu after scrolling
    document.getElementById('menu-checkbox').checked = false; // Reset checkbox state
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
  
  @media (max-width: 768px) {
    .nav-links {
      width: 100%;
    }
  }
  </style>
  