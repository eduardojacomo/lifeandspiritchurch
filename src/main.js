import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faBars, faTimes, faArrowRight, faChevronRight, faChevronLeft, faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, 
    faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faHighlighter,
    faFillDrip, faEye, faLanguage, faMobile, faTerminal, faRobot, faLaptopCode, faCaretDown, faPlay, faBible, faHeart, faClipboardList, 
    faShareNodes, faGlobe, faChevronDown, faAngleLeft, faAngleRight, faCalendar, faLocationDot} from '@fortawesome/free-solid-svg-icons';


library.add(faBars, faTimes, faArrowRight, faChevronLeft, faChevronRight, faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, 
    faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, faMobile, faTerminal, faRobot, faLaptopCode, 
    faAlignJustify, faAlignLeft, faAlignRight, faFillDrip, faHighlighter, faEye, faLanguage, faCaretDown, faPlay, faBible, faHeart, faClipboardList, 
    faShareNodes, faGlobe, faChevronDown, faAngleLeft, faAngleRight, faCalendar, faLocationDot);

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';
// import { initializeApp } from 'firebase/app';
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'
import { db } from './firebaseApp'

// Importar os arquivos de tradução
import en from './locales/en.json';
import pt from './locales/pt.json';

// Configurar o Vue I18n
const i18n = createI18n({
  locale: 'pt', // Idioma padrão
  fallbackLocale: 'en', // Idioma alternativo se uma chave não for encontrada no idioma atual
  messages: {
    en,
    pt
  }
});

// const firebaseConfig = {
//   apiKey: "AIzaSyCja7gwfxH6iqGQb0i__87JDwGVT3Z-AKk",
//   authDomain: "church-lifeandspirit.firebaseapp.com",
//   projectId: "church-lifeandspirit",
//   storageBucket: "church-lifeandspirit.firebasestorage.app",
//   messagingSenderId: "578571975042",
//   appId: "1:578571975042:web:2860d6807d4dfb4173b79b",
//   measurementId: "G-24YHRV3350"
// };


// initializeApp(firebaseConfig)
const app = createApp(App)
app.use(VueFire, {
  firestore: db,
})
app.use(createPinia())
app.use(router)
app.use(i18n)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
