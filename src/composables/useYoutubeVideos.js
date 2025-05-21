import { fetchYoutubeVideos } from './youtubedata'
import { collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export const useYoutubeVideos = async () => {
  const db = useFirestore() 
  const youtubeVideos = await fetchYoutubeVideos()

  const snapshot = await getDocs(collection(db, 'videos'))
  const firestoreIds = snapshot.docs.map(doc => doc.data().youtubeId)


  return youtubeVideos.filter(video => !firestoreIds.includes(video.youtubeId))
}
