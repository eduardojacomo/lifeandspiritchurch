<script setup>
import { ref, onMounted } from 'vue';
 import { useYoutubeVideos } from '@/composables/useYoutubeVideos';
import { addDoc, collection } from 'firebase/firestore';
import { useFirestore } from 'vuefire'

const db = useFirestore()

// const fetchActiveActivities = async () => {
//   try {
//     const colRef = collection(db, 'activities') // ⬅️ usa diretamente a coleção
//     const q = query(colRef, where('active', '==', true))
//     const querySnapshot = await getDocs(q)

//     activities.value = []
//     querySnapshot.forEach((doc) => {
//       activities.value.push({ id: doc.id, ...doc.data() })
//     })
//   } catch (e) {
//     console.log('Erro ao buscar atividades ativas:', e)
//     error.value = 'Erro ao buscar as atividades ativas.'
//   }
// }

const videos = ref([]);
const selectedVideo = ref(null);
const form = ref({
  title: { pt: '', en: '' },
  description: { pt: '', en: '' }
});
const showModal = ref(false);

const openModal = (video) => {
  selectedVideo.value = video;
  form.value.title.en = video.title.en;
  form.value.description.en = video.description.en;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedVideo.value = null;
};

const saveVideo = async () => {
  await addDoc(collection(db, 'videos'), {
    youtubeId: selectedVideo.value.youtubeId,
    title: form.value.title,
    description: form.value.description,
    publishedAt: selectedVideo.value.publishedAt,
    thumbnails: selectedVideo.value.thumbnails
  });

  closeModal();
   videos.value = await useYoutubeVideos();
};

onMounted(async () => {
   videos.value = await useYoutubeVideos();
});
</script>

<template>
  <div>
    <h2>Vídeos não cadastrados</h2>
    <ul>
      <li v-for="video in videos" :key="video.youtubeId">
        <img :src="video.thumbnails.medium" width="120" />
        <p>{{ video.title.en }}</p>
        <button @click="openModal(video)">Cadastrar</button>
      </li>
    </ul>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Cadastrar Vídeo</h3>
        <img :src="selectedVideo.thumbnails.medium" />
        <form class="form" @submit.prevent="login">
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
                    <!-- <button type="submit" class="form-submit-btn" @click="login">Sign In</button> -->
            <div class="column">
                <button @click="saveVideo" class="form-submit-btn">Salvar</button>
                <button @click="closeModal" class="form-submit-btn">Cancelar</button>
            </div>
        </form>



      </div>
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
  width: 50%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.modal-content img{
    max-width: 350px;
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
    width: 300px;
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

  .modal-content .form-submit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: inherit;
    color: #fff;
    background-color: #212121;
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

  .modal-content .form-submit-btn:hover {
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
</style>
