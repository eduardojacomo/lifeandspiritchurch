// composables/useImageUpload.js
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import { getFirestore, collection, addDoc, doc, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export function useImageUpload() {
  const storage = getStorage()
  const db = getFirestore()
  const auth = getAuth()

  const uploadImage = async (image) => {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')

    const blob = await fetch(image.preview).then(r => r.blob())
    const filename = image.name

    /* =====================
       Regra de negócio
    ===================== */
    if (image.page === 'home' && image.location === 'hero') {
      const q = query(
        collection(db, 'images'),
        where('page', '==', 'home'),
        where('location', '==', 'hero'),
        where('status', '==', 'active')
      )

      const snapshot = await getDocs(q)
      await Promise.all(
        snapshot.docs.map(docSnap =>
          updateDoc(docSnap.ref, { status: 'inactive' })
        )
      )
    }

    /* =====================
       Upload Storage
    ===================== */
    const fileRef = storageRef(storage, `images/${filename}`)
    await uploadBytes(fileRef, blob, {
      cacheControl: 'public,max-age=31536000',
      contentType: 'image/webp'
    })

    /* =====================
       Firestore
    ===================== */
    await addDoc(collection(db, 'images'), {
      name: filename,
      page: image.page,
      location: image.location,
      format: image.desktop && image.mobile ? 'all' : image.desktop ? 'desktop' : 'mobile',
      status: 'active',
      created_at: new Date().toISOString(),
      userId: user.uid
    })
  }

  const uploadMultiple = async (images) => {
    for (const img of images) {
      await uploadImage(img)
    }
  }

  return {
    uploadImage,
    uploadMultiple
  }
}
