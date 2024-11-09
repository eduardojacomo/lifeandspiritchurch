import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faBars, faTimes, faArrowRight, faChevronRight, faChevronLeft, faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, 
    faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faHighlighter,
    faFillDrip, faEye} from '@fortawesome/free-solid-svg-icons';
library.add(faBars, faTimes, faArrowRight, faChevronLeft, faChevronRight, faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, 
    faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, 
    faAlignJustify, faAlignLeft, faAlignRight, faFillDrip, faHighlighter, faEye);

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
