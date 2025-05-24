import { fetchYoutubeVideosPaginated } from './youtubedata'
import { collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export const useYoutubeVideos = async (pageToken = null) => {
  const db = useFirestore()

  const { videos, nextPageToken } = await fetchYoutubeVideosPaginated(pageToken)

  const snapshot = await getDocs(collection(db, 'videos'))
  const firestoreIds = snapshot.docs.map(doc => doc.data().youtubeId)

  const unregisteredVideos = videos.filter(video => !firestoreIds.includes(video.youtubeId))

  if (unregisteredVideos.length === 0 && nextPageToken) {
    // Recursivamente tenta a próxima página
    return await useYoutubeVideos(nextPageToken)
  }

  return {
    videos: unregisteredVideos,
    nextPageToken
  }
}
