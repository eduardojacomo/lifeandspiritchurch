import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const useVideoWatch = defineStore("videos", ()=>{
    const videoviewStore = ref ([]);
    const videoview = computed(()=> videoviewStore.value);
    
    function setVideo(_videoData){
        videoviewStore.value = _videoData;
    }
    

    return{
       setVideo,
       videoviewStore,
       videoview
    }
});