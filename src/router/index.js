import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import EditVideo from '@/views/EditVideoView.vue'
import LoginView from '@/views/LoginView.vue'
import VideoWatchView from '@/views/VideoWatchView.vue'
import ListVideosView from '@/views/ListVideosView.vue'
import AboutView from '@/views/AboutView.vue'
import OurTeamView from '@/views/OurTeamView.vue'
import OurActivitiesView from '@/views/OurActivitiesView.vue'
import ImageManagement from '@/components/Admin/ImageManagement.vue'
import EventsManager from '@/components/Admin/EventsManager.vue'
import ContactView from '@/views/ContactView.vue'
import EventsView from '@/views/EventsView.vue'
import EventDetailView from '@/views/EventDetailView.vue'
import ActivityAdmin from '@/components/Admin/Activity/ActivityAdmin.vue'
import demopage from '@/components/demopage.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import TeamManager from '@/components/Admin/Team/TeamManager.vue'

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
      path: '/events/detail_event/:id',
      name: 'eventsdetail',
      component: EventDetailView,
      props: true
    },
    {
      path: '/about',
      name: 'aboutview',
      component: AboutView
    },
    {
      path: '/our_team',
      name: 'ourteam',
      component: OurTeamView
    },
    {
      path: '/demopage',
      name: 'demopage',
      component: demopage
    },
    {
      path: '/activities',
      name: 'activities',
    component: OurActivitiesView
    },
    {
      path: '/contact',
      name: 'contactview',
    component: ContactView
    },
    {
      path: '/events',
      name: 'eventsview',
      component: EventsView
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
    {
      path: '/admin/images',
      name: 'imageManagement',
      component: ImageManagement
    },
    {
      path: '/admin/events',
      name: 'eventsManager',
      component: EventsManager
    },
    {
      path: '/admin/content/team',
      name: 'teamManager',
      component: TeamManager
    },
    {
      path: '/admin/content/activities',
      name: 'activitiesManager',
      component: ActivityAdmin
    }
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
