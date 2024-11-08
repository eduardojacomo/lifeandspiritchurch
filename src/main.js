import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faGithub, faTwitter, faFacebook, faLinkedin, faInstagram, faVuejs, faJs, faHtml5, faPython } from '@fortawesome/free-brands-svg-icons';
import { faBars, faTimes, faArrowRight, faChevronRight, faChevronLeft, faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, 
    faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faHighlighter,
    faFillDrip
} from '@fortawesome/free-solid-svg-icons';
library.add(faGithub, faTwitter, faFacebook, faBars, faTimes, faLinkedin, faInstagram, faArrowRight, faChevronLeft, faChevronRight, 
    faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, 
    faAlignJustify, faAlignLeft, faAlignRight, faFillDrip, faHighlighter);

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
