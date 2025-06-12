import {defineStore} from 'pinia';
import {ref, computed} from 'vue'

export const useLanguage = defineStore("language", ()=>{
  const currentLocaleKey = ref(0); 
  const locale = ref('pt'); 
  const currentkey = computed(()=> currentLocaleKey.value);
  const local = computed(()=> locale.value);
 
  
  // function setProject(_project){
  //     projectStore.value = _project;
  // }
  const setLanguage = ((language) => {
    locale.value = language;
    currentLocaleKey.value++; 
  })
  

  return{
    locale, 
    currentLocaleKey,
    currentkey, 
    local,
    setLanguage
  }
});