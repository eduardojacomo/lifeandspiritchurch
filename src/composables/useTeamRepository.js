import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, collection, addDoc, updateDoc, deleteDoc, 
  doc, query, getDocs, orderBy, where, writeBatch
} from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadString, getDownloadURL, deleteObject } from 'firebase/storage'

export function useTeamRepository() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  
  const user = ref(null);
  const teamItems = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });

  // Helper para nomes únicos (seguindo seu padrão)
  const generateFileName = (nome) => {
    const stamp = Date.now();
    const cleanName = nome.replace(/\s+/g, '_').toLowerCase();
    return `${stamp}_team_${cleanName}.webp`;
  }

  /* =========================
      CRUD Actions
  ========================= */

  const fetchTeam = async () => {
    isLoading.value = true;
    try {
      const q = query(collection(db, 'team'), orderBy('nome', 'asc'));
      const snapshot = await getDocs(q);
      teamItems.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return teamItems.value;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  const saveMember = async (memberData) => {
    if (!user.value) throw new Error("Acesso negado.");
    isLoading.value = true;
    
    try {

      if (memberData.isMainAbout) {
        // Buscamos quem é o destaque atual para desativá-lo
        const q = query(collection(db, "team"), where("isMainAbout", "==", true));
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          // Se o destaque atual não for o mesmo que estamos editando
          if (doc.id !== memberData.id) {
            batch.update(doc.ref, { isMainAbout: false });
          }
        });
        await batch.commit(); // Executa o reset de forma atômica
      }

        let finalUrl = memberData.url;

      // Se houver uma nova imagem em base64/data_url
      if (memberData.newImagePreview) {
        const fileName = generateFileName(memberData.nome);
        const sRef = storageRef(storage, `team/${fileName}`);
        await uploadString(sRef, memberData.newImagePreview, 'data_url');
        finalUrl = await getDownloadURL(sRef);
      }

      const docData = {
        nome: memberData.nome,
        cargo: memberData.cargo, // { pt, en }
        about: memberData.about, // { pt, en }
        url: finalUrl,
        ministerio: memberData.ministerio,
        updated_at: new Date().toISOString(),
        isMainAbout: memberData.isMainAbout || false,
      };

      if (memberData.id) {
        // Update
        const docRef = doc(db, 'team', memberData.id);
        await updateDoc(docRef, docData);
      } else {
        // Create
        docData.created_at = new Date().toISOString();
        await addDoc(collection(db, 'team'), docData);
      }
      
      await fetchTeam(); // Refresh da lista
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const deleteMember = async (id, imageUrl) => {
    if (!user.value) throw new Error("Acesso negado.");
    isLoading.value = true;
    try {
      // 1. Deletar do Firestore
      await deleteDoc(doc(db, 'team', id));
      
      // 2. Deletar do Storage se houver URL
      if (imageUrl && imageUrl.includes('firebasestorage')) {
        const sRef = storageRef(storage, imageUrl);
        await deleteObject(sRef).catch(e => console.warn("Imagem não encontrada no Storage"));
      }
      
      await fetchTeam();
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    teamItems,
    isLoading,
    error,
    fetchTeam,
    saveMember,
    deleteMember
  }
}