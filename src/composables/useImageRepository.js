// composables/useImageRepository.js
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage'

export function useImageRepository() {
  const auth = getAuth();
  const user = ref(null);  
  const db = getFirestore()
  const storage = getStorage()
  const images = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });

  /* =========================
      Utils
  ========================= */
  const isExpired = (img) => {
    if (!img.expired_at) return false
    return img.expired_at < new Date().toISOString().split('T')[0]
  }

  // Helper para gerar nomes únicos
  const generateFileName = (location, type) => {
    const stamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${stamp}_${location}_${type}_${random}.webp`;
  }

  /* =========================
      Save Image (Upload Duplo)
  ========================= */
  const saveImage = async (imgData) => {
    if (!user.value) throw new Error("Autenticação necessária.");

    isLoading.value = true
    try {
      // 1. Upload Desktop (Obrigatório - Salvo como o 'path' principal)
      const desktopName = generateFileName(imgData.location, 'desktop');
      const desktopRef = storageRef(storage, `images/${desktopName}`);
      await uploadString(desktopRef, imgData.preview, 'data_url');
      const desktopURL = await getDownloadURL(desktopRef);

      // 2. Upload Mobile (Opcional)
      let mobileURL = null;
      let mobileName = null;

      if (imgData.previewMobile) {
        mobileName = generateFileName(imgData.location, 'mobile');
        const mobileRef = storageRef(storage, `images/${mobileName}`);
        await uploadString(mobileRef, imgData.previewMobile, 'data_url');
        mobileURL = await getDownloadURL(mobileRef);
      }

      // 3. Montar Documento do Firestore
      const docData = {
        name: desktopName, // Referência principal
        name_mobile: mobileName,
        page: imgData.page.toLowerCase(),
        location: imgData.location.toLowerCase(),
        alt: imgData.alt || '',
        status: 'active',
        created_at: new Date().toISOString(),
        expired_at: imgData.expirationDate || null,
        devices: imgData.devices, // { desktop: true, mobile: bool }
        url: desktopURL,          // Path Desktop
        url_mobile: mobileURL,    // Path Mobile (ou null)
        
        // Novos campos de tradução e Hero
        ...(imgData.heroTitle && {
          heroTitle: imgData.heroTitle, // { pt, en }
          heroDesc: imgData.heroDesc,   // { pt, en }
          order: imgData.order || 0,
          buttonLabel: imgData.buttonLabel, // { pt, en }
          buttonLink: imgData.buttonLink || '',
          textPosition: imgData.textPosition || 'left'
        })
      }

      const docRef = await addDoc(collection(db, 'images'), docData)
      return docRef.id

    } catch (err) {
      console.error("Erro no saveImage:", err)
      throw new Error("Falha ao salvar: " + err.message)
    } finally {
      isLoading.value = false
    }
  }

  /* =========================
      Fetch & Filters
  ========================= */
  const fetchImages = async ({
    page,
    location,
    status = 'active',
    includeExpired = false
  } = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const constraints = []
      if (page) constraints.push(where('page', '==', page.toLowerCase()))
      if (location) constraints.push(where('location', '==', location.toLowerCase()))
      if (status !== 'all') constraints.push(where('status', '==', status))

      const q = query(collection(db, 'images'), ...constraints);
      const snapshot = await getDocs(q)
      
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(data => includeExpired || !isExpired(data));

      images.value = results
      return results

    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Hero Helper atualizado
  const fetchHeroImages = async (page) => {
    return fetchImages({
      page,
      location: 'hero',
      status: 'active'
    })
  }

  return {
    user,
    images,
    isLoading,
    error,
    saveImage,
    fetchImages,
    fetchHeroImages
  }
}