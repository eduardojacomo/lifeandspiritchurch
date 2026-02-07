<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {useLanguage} from '../stores/languageStore'
import {storeToRefs} from 'pinia';

const uselanguage = useLanguage();
const { locale, currentLocaleKey} = storeToRefs(uselanguage);

const { t, locale: i18nLocale } = useI18n();

const isOpen = ref(false);
const navbarRef = ref(null);
const route = useRoute();
const isHomePage = computed(() => route.path === '/' || route.path === '/home');
const isTop = ref(true);

const menuItems = ref([
  {
    labelKey: '_nav._home',
    route: '/'
  },
  {
    labelKey: '_nav._about',
    children: [
      { labelKey: '_about._about_us', route: '/about' },
      { labelKey: '_about._our_pastors', route: '/our_team' },
      { labelKey: '_about._our_activities', route: '/activities' }
    ]
  },
  {
    labelKey: '_nav._content',
    children: [
      { labelKey: '_content._news', route: '/news' },
      { labelKey: '_content._content', route: '/content' }
    ]
  },
  {
    labelKey: '_nav._events',
    route: '/events'
  },
  {
    labelKey: '_nav._contact',
    route: '/contact'
  },
]);

const isSubmenuVisible = ref(menuItems.value.map(() => false));
const submenuPositions = ref(menuItems.value.map(() => 0));
const menuItemRefs = ref([]);

const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

function setLanguage(lang) {
  uselanguage.setLanguage(lang);
  showDropdown.value = false;
}

function handleClickOutsideLanguage(event) {
  const dropdown = document.querySelector('.language-selector');
  if (dropdown && !dropdown.contains(event.target)) {
    closeDropdown();
  }
}

const handleMouseEnter = (index) => {
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
};

function onScroll() {
  isTop.value = window.scrollY === 0;
}

const scrollTo = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    isOpen.value = false;
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
  i18nLocale.value = newLocale;
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('click', handleClickOutsideLanguage);
  window.addEventListener('scroll', onScroll, { passive: true });
  menuItemRefs.value = Array(menuItems.value.length).fill(null);
  onScroll();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('click', handleClickOutsideLanguage);
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <!-- <nav 
    class="navbar" 
    ref="navbarRef" 
    :class="{
      'navbar--transparent': isHomePage && isTop,
      'navbar--solid': !(isHomePage && isTop)
    }"
  > -->
  <nav 
    class="navbar navbar--solid" 
    ref="navbarRef" 
    
  >
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <img src="../assets/logo.png" alt="Life & Spirit Church">
        </router-link>
      </div>

      <!-- Desktop Menu -->
      <nav class="navbar-desktop">
        <ul class="main-menu">
          <li
            v-for="(item, index) in menuItems"
            :key="index"
            :ref="el => menuItemRefs[index] = el"
            class="menu-item"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <router-link v-if="item.route" :to="item.route" class="menu-link">
              {{ t(item.labelKey) }}
            </router-link>
            <span v-else class="menu-link">
              {{ t(item.labelKey) }}
              <font-awesome-icon icon="fa-solid fa-chevron-down" class="dropdown-icon" />
            </span>

            <!-- Submenu -->
            <Transition name="submenu">
              <ul v-if="isSubmenuVisible[index] && item.children" class="submenu">
                <li v-for="child in item.children" :key="child.labelKey" class="submenu-item">
                  <router-link :to="child.route" class="submenu-link">
                    {{ t(child.labelKey) }}
                  </router-link>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </nav>

      <!-- Actions -->
      <div class="navbar-actions">
        <!-- Language Selector -->
        <div class="language-selector">
          <button class="language-button" @click="toggleDropdown" aria-label="Select Language">
            <font-awesome-icon icon="fa-solid fa-globe" />
            <span class="current-lang">{{ locale.toUpperCase() }}</span>
          </button>

          <Transition name="dropdown">
            <ul v-if="showDropdown" class="language-dropdown">
              <li @click="setLanguage('pt')" :class="{ active: locale === 'pt' }">
                <span class="flag">🇧🇷</span>
                PT-BR
              </li>
              <li @click="setLanguage('en')" :class="{ active: locale === 'en' }">
                <span class="flag">🇺🇸</span>
                EN
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Hamburger -->
        <button class="hamburger" @click="toggleMenu" aria-label="Toggle Menu">
          <span class="hamburger-line" :class="{ open: isOpen }"></span>
          <span class="hamburger-line" :class="{ open: isOpen }"></span>
          <span class="hamburger-line" :class="{ open: isOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="isOpen" class="mobile-menu">
        <ul class="mobile-menu-list">
          <template v-for="(item, index) in menuItems" :key="index">
            <!-- Simple Link -->
            <li v-if="item.route" class="mobile-menu-item">
              <router-link :to="item.route" @click="closeMenu" class="mobile-menu-link">
                {{ t(item.labelKey) }}
              </router-link>
            </li>

            <!-- With Submenu -->
            <li v-else-if="item.children" class="mobile-menu-item">
              <span class="mobile-menu-label">{{ t(item.labelKey) }}</span>
              <ul class="mobile-submenu">
                <li v-for="child in item.children" :key="child.labelKey">
                  <router-link :to="child.route" @click="closeMenu" class="mobile-submenu-link">
                    {{ t(child.labelKey) }}
                  </router-link>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Navbar Base */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar--transparent {
  background-color: transparent;
}

.navbar--solid {
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.875rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  z-index: 2001;
}

.logo a {
  display: block;
  transition: all 0.3s ease;
}

.logo a:hover {
  transform: scale(1.05);
}

.logo img {
  height: 42px;
  width: auto;
  display: block;
}

/* Desktop Menu */
.navbar-desktop {
  display: block;
}

.main-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.menu-item {
  position: relative;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  letter-spacing: 0.3px;
}

.menu-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-icon {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.menu-item:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* Submenu */
.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: rgba(0, 0, 0, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 220px;
  list-style: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.submenu-item {
  margin: 0;
}

.submenu-link {
  display: block;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.submenu-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

/* Navbar Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 2001;
}

/* Language Selector */
.language-selector {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.current-lang {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgba(0, 0, 0, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 140px;
  list-style: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.language-dropdown li {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.language-dropdown li:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.language-dropdown li.active {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-weight: 600;
}

.flag {
  font-size: 1.2rem;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: #fff;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger-line.open:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
}

.hamburger-line.open:nth-child(2) {
  opacity: 0;
}

.hamburger-line.open:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.98);
  backdrop-filter: blur(20px);
  padding: 5rem 2rem 2rem 2rem;
  overflow-y: auto;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
}

.mobile-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.5rem;
}

.mobile-menu-link {
  display: block;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-menu-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.mobile-menu-label {
  display: block;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mobile-submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 1rem;
}

.mobile-submenu-link {
  display: block;
  padding: 0.875rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-submenu-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transform: translateX(4px);
}

/* Transitions */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 968px) {
  .navbar-desktop {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .language-button {
    padding: 0.5rem 0.75rem;
  }

  .current-lang {
    display: none;
  }

  .navbar--transparent {
    background-color: rgba(0, 0, 0, 0.95);
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0.75rem 1rem;
  }

  .logo img {
    height: 36px;
  }

  .mobile-menu {
    max-width: 100%;
  }
}
</style>