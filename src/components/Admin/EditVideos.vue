<script setup>
import { ref, onMounted } from 'vue';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  doc
} from 'firebase/firestore';
import { useFirestore } from 'vuefire';

const db = useFirestore();
const videos = ref([]);
const lastVisible = ref(null);
const loading = ref(false);
const showModal = ref(false);
const selectedVideo = ref(null);
const isEditing = ref(false);

const form = ref({
  title: { pt: '', en: '' },
  description: { pt: '', en: '' }
});

// Buscar página inicial
const fetchVideos = async () => {
  loading.value = true;
  const q = query(collection(db, 'videos'), orderBy('publishedAt', 'desc'), limit(5));
  const snapshot = await getDocs(q);

  videos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  lastVisible.value = snapshot.docs[snapshot.docs.length - 1];
  loading.value = false;
};

// Paginação
const fetchNextPage = async () => {
  if (!lastVisible.value) return;

  const q = query(
    collection(db, 'videos'),
    orderBy('publishedAt', 'desc'),
    startAfter(lastVisible.value),
    limit(5)
  );

  const snapshot = await getDocs(q);
  const newVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  videos.value.push(...newVideos);
  lastVisible.value = snapshot.docs[snapshot.docs.length - 1];
};

const openModal = (video) => {
  selectedVideo.value = video;
  form.value.title.pt = video.title?.pt || '';
  form.value.title.en = video.title?.en || '';
  form.value.description.pt = video.description?.pt || '';
  form.value.description.en = video.description?.en || '';
  isEditing.value = true;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedVideo.value = null;
  isEditing.value = false;
};

const saveVideo = async () => {
  if (!selectedVideo.value) return;

  const videoRef = doc(db, 'videos', selectedVideo.value.id);
  await updateDoc(videoRef, {
    title: form.value.title,
    description: form.value.description
  });

  // Atualiza localmente
  const index = videos.value.findIndex(v => v.id === selectedVideo.value.id);
  if (index !== -1) {
    videos.value[index].title = { ...form.value.title };
    videos.value[index].description = { ...form.value.description };
  }

  closeModal();
};

onMounted(() => {
  fetchVideos();
});
</script>


<template>
  <div class="newvideos-content">
    <h2>Vídeos Cadastrados</h2>
    <ul>
      <li v-for="video in videos" :key="video.id">
        <div class="list">
          <div class="list-content">
            <img :src="video.thumbnails?.default" />
            <p>{{ video.title?.en || 'Sem título' }}</p>    
          </div>
          <div class="list-button">
            <button class="insert-btn" @click="openModal(video)">Editar</button>
          </div>
        </div>
      </li>
    </ul>

    <button v-if="!loading" class="form-submit-btn" @click="fetchNextPage">
      Carregar Mais
    </button>
    <p v-else>Carregando...</p>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Editar Vídeo</h3>
        <img :src="selectedVideo.thumbnails?.medium" />
        <form class="form" @submit.prevent="saveVideo">
          <div class="column">
                <div class="row">
                    <div class="form-group">
                        <label for="titlePT">Title PT:</label>
                        <input required="" placeholder="Enter your email" name="titlePT" id="titlePT" type="text" v-model="form.title.pt">
                    </div>
                   
                    <div class="form-group">
                        <label for="descriptionPT">Description PT:</label>
                        <textarea required="" placeholder="Enter your email" name="descriptionPT" id="descriptionPT" v-model="form.description.pt"> </textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group">
                       <label for="titleEN">Title EN:</label>
                       <input required="" placeholder="Enter your email" name="titleEN" id="titleEN" type="text" v-model="form.title.en">
                   </div>
                   <div class="form-group">
                       <label for="descriptionEN">Title PT:</label>
                      <textarea required="" placeholder="Enter your email" name="descriptionEN" id="descriptionEN" v-model="form.description.en"> </textarea>
                   </div>
                </div>
            </div>
          <div class="column">
            <button @click="closeModal" class="form-cancel-btn">Cancelar</button>
            <button type="submit" class="form-submit-btn">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<style scoped>

.column, .list, .list-content{
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.row{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.list{
    /* width: 450px; */
    max-width: 900px;
    padding: .5rem;
    border: solid 1px var(--color-border);
    flex-wrap: wrap;
    justify-content: space-between;
}

.list-content{
    flex-wrap: wrap;
}

.list-content img{
    width: 150px;
}

.newvideos-content{
    gap: 1rem;
}

 .list p{
    max-width: 500px;
}

.list button{
    width: 100px;
}

.list-button{
    display: flex;
    align-items: start;
}

.newvideos-content{
    display: flex;
    flex-direction: column;
    padding: .5rem 2rem;
}

.newvideos-content ul{
    padding: 0;
    margin: 0;
    list-style: none;
}

.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background-color: var(--color-background-mute);
  padding: 2rem;
  width: 500px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.modal-content img{
    max-width: 450px;
}

.modal-content .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .modal-content .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    /* width: 300px; */
    max-width: 650px;
  }

  .modal-content .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .modal-content .form-group input,
  .modal-content .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: inherit;
    border: 1px solid #ccc;
  }

  .modal-content .form-group input::placeholder {
    opacity: 0.5;
  }

  .modal-content .form-group input:focus,
  .modal-content .form-group textarea:focus {
    outline: none;
    border-color: #1778f2;
  }

 .form-submit-btn, .form-cancel-btn, .insert-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: inherit;
    color: #fff;
    
    border: none;
    width: 100%;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin: 12px 0;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
  }

  .form-submit-btn{
    background-color: var(--cor-azul-medio);
  }

  .form-submit-btn:hover{
    background-color: var(--cor-azul-claro);
  }

  .form-cancel-btn, .insert-btn{
    background-color: #212121;
  }

  .form-cancel-btn:hover, .insert-btn:hover {
    background-color: #313131;
  }

  .modal-content .link {
    color: #1778f2;
    text-decoration: none;
  }

  .modal-content .forgot-password-link {
    align-self: flex-end;
    margin-top: -20px;
  }

  .modal-content .signup-link {
    align-self: center;
    font-weight: 500;
  }

  .modal-content .signup-link .link {
    font-weight: 400;
  }

  .modal-content .link:hover {
    text-decoration: underline;
  }

  .modal-content .line {
    width: 100%;
    height: 1px;
    background-color: #212121;
    opacity: 0.1;
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
