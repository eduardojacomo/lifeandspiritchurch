import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faBars, faTimes, faArrowRight, faChevronRight, faChevronLeft, faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, 
    faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faHighlighter,
    faFillDrip, faEye, faLanguage} from '@fortawesome/free-solid-svg-icons';
library.add(faBars, faTimes, faArrowRight, faChevronLeft, faChevronRight, faExternalLink, faXmark, faCode, faArrowLeft, faHandshake, 
    faBold, faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faAlignCenter, 
    faAlignJustify, faAlignLeft, faAlignRight, faFillDrip, faHighlighter, faEye, faLanguage);

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';

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


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
