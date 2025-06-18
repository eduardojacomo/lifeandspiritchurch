import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import EditVideo from '@/views/EditVideoView.vue'
import LoginView from '@/views/LoginView.vue'
import VideoWatchView from '@/views/VideoWatchView.vue'
import ListVideosView from '@/views/ListVideosView.vue'
import AboutView from '@/views/AboutView.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configurar NProgress (opcional)
NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/video-watch/:id',
      name: 'videowatch',
      component: VideoWatchView,
      props: true
    },
    {
      path: '/about',
      name: 'aboutview',
      component: AboutView
    },
    {
      path: '/content',
      name: 'contentvideos',
      component: ListVideosView
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
// Mostra a barra ao começar a navegar
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

// Finaliza a barra ao terminar a navegação
router.afterEach(() => {
  NProgress.done()
})

export default router
