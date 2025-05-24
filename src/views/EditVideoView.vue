<script setup>
import { ref, onMounted } from 'vue';
import NewVideos from '@/components/Admin/NewVideos.vue';
import EditVideos from '@/components/Admin/EditVideos.vue'

const option = ref('myvideos');

</script>

<template>
  <div class="videos-content">
       <div class="videos-options">
        <ul>
            <li><button class="btn-options" :class="{active: option === 'newvideos'}" @click="option = 'newvideos'"> New Videos </button></li>
            <li><button class="btn-options" :class="{active: option === 'myvideos'}" @click="option = 'myvideos'"> My videos</button></li>
        </ul>
       </div> 
       <div class="videos-view">
            <NewVideos v-if="option === 'newvideos'"/>
            <EditVideos v-if="option === 'myvideos'"/>
       </div>
  </div>
</template>

<style scoped>

.column{
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.row{
    display: flex;
    flex-direction: column;
}

.videos-content{
    gap: 1rem;
}

.videos-options{
    padding: 1rem 0;
}

.videos-content{
    display: flex;
    flex-direction: row;
    padding: 90px 5rem .5rem 5rem;
}

.videos-content ul{
    padding: 0;
    margin: 0;
    list-style: none;
}

.btn-options{
    background-color: transparent;
    border: solid 1px var(--color-border);
    width: 150px;
    padding: 1rem;
    color: var(--color-text);
    cursor: pointer;
}
.btn-options:hover{
    background-color: var(--cor-azul-medio);
}

.btn-options.active{
    background-color: var(--cor-azul-claro);
}


@media (max-width: 768px) {
  
  .list-content img{
    width: 250px;
  }  

  .column {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-content {
    padding: 1rem;
    width: clamp(300px,90%, 500px);
  }

  .modal-content .row {
    flex-direction: column;
  }

  .form-submit-btn, .insert-btn {
    font-size: 1rem;
  }
}

</style>
