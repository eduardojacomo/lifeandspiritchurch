import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import EditVideo from '@/views/EditVideoView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin/videos',
      name: 'editvideo',
      component: EditVideo
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      const element = document.querySelector(to.hash);
      if (element) {
        return { el: to.hash, behavior: 'smooth' };
      }
    }
    return savedPosition || { top: 0 };
  }
})

export default router
