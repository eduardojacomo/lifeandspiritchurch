import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, getDocs, orderBy } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

export function useActivityRepository() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage(); 
  
  const user = ref(null);
  const activities = ref([]);
  const isLoading = ref(false);

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });

  const fetchActivities = async () => {
    isLoading.value = true;
    try {
      const q = query(collection(db, 'activities'), orderBy('title.pt', 'asc'));
      const snapshot = await getDocs(q);
      activities.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } finally {
      isLoading.value = false;
    }
  };

  const saveActivity = async (data) => {
    if (!user.value) throw new Error("Acesso negado.");
    isLoading.value = true;

    try {
      let finalUrl = data.url;

      // Upload da imagem se for nova (base64)
        if (data.newImagePreview && data.newImagePreview.startsWith('data:')) {
        const fileName = `${Date.now()}_activity.webp`;
        const sRef = storageRef(storage, `activities/${fileName}`);
        
        // Criamos o metadado para forçar o Content-Type
        const metadata = {
            contentType: 'image/webp' // ou extraia do base64 dinamicamente
        };

        await uploadString(sRef, data.newImagePreview, 'data_url', metadata); // <--- Adicione metadata aqui
        finalUrl = await getDownloadURL(sRef);
        }

      const docData = {
        title: data.title, // { pt, en }
        day: data.day,     // { pt, en }
        description: data.description, // { pt, en }
        url: finalUrl,
        updated_at: new Date().toISOString()
      };

      if (data.id) {
        await updateDoc(doc(db, 'activities', data.id), docData);
      } else {
        docData.created_at = new Date().toISOString();
        await addDoc(collection(db, 'activities'), docData);
      }
      await fetchActivities();
    } finally {
      isLoading.value = false;
    }
  };

  const deleteActivity = async (id, url) => {
    isLoading.value = true;
    try {
      await deleteDoc(doc(db, 'activities', id));
      if (url) await deleteObject(storageRef(storage, url)).catch(() => {});
      await fetchActivities();
    } finally {
      isLoading.value = false;
    }
  };

  return { activities, isLoading, fetchActivities, saveActivity, deleteActivity };
}