import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const useProjects = defineStore("projects", ()=>{
    const projectStore = ref ([]);
    const project = computed(()=> projectStore.value);
    
    function setProject(_project){
        projectStore.value = _project;
    }
    

    return{
       setProject,
       projectStore,
       project
    }
});