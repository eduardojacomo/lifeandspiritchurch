const API_KEY = 'AIzaSyAJoQPTBMbDZC8Szh4EkouGYrMk_QES9dY';
const CHANNEL_ID = 'UC1Fk9GbEVI5IPlnLckrsDEg';
const MAX_RESULTS = 5;

export const fetchYoutubeVideos = async () => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;

  const res = await fetch(url);
  const data = await res.json();
  console.log('dados api google',data);

  return data.items
    .filter(item => item.id.kind === 'youtube#video')
    .map(video => ({
      youtubeId: video.id.videoId,
      title: { en: video.snippet.title, pt: '' }, // Deixe pt vazio para preencher depois
      description: { en: video.snippet.description, pt: '' },
      publishedAt: video.snippet.publishedAt,
      thumbnails:{default:video.snippet.thumbnails.default.url, high:video.snippet.thumbnails.high.url, medium:video.snippet.thumbnails.medium.url}
    }));
};

export const fetchVideosByIds = async (videoIds = []) => {
  const ids = videoIds.join(',');
  const url = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${ids}&part=snippet`;

  const res = await fetch(url);
  const data = await res.json();

  return data.items.map(video => ({
    youtubeId: video.id,
    title: { en: video.snippet.title, pt: '' },
    description: { en: video.snippet.description, pt: '' },
    publishedAt: video.snippet.publishedAt,
    thumbnails: {
      default: video.snippet.thumbnails.default.url,
      high: video.snippet.thumbnails.high.url,
      medium: video.snippet.thumbnails.medium.url
    }
  }));
};

export const fetchVideosAfterDate = async (dateISOString) => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50`;

  const res = await fetch(url);
  const data = await res.json();

  return data.items
    .filter(item => item.id.kind === 'youtube#video')
    .filter(item => new Date(item.snippet.publishedAt) > new Date(dateISOString))
    .map(video => ({
      youtubeId: video.id.videoId,
      title: { en: video.snippet.title, pt: '' },
      description: { en: video.snippet.description, pt: '' },
      publishedAt: video.snippet.publishedAt,
      thumbnails: {
        default: video.snippet.thumbnails.default.url,
        high: video.snippet.thumbnails.high.url,
        medium: video.snippet.thumbnails.medium.url
      }
    }));
};

/**
 * Busca vídeos do canal com suporte a paginação.
 * @param {string|null} pageToken Token da página atual (opcional).
 * @returns {object} Objetos com vídeos e o nextPageToken.
 */
export const fetchYoutubeVideosPaginated = async (pageToken = null) => {
  const baseUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;
  const url = pageToken ? `${baseUrl}&pageToken=${pageToken}` : baseUrl;

  const res = await fetch(url);
  const data = await res.json();

  const videos = data.items
    .filter(item => item.id.kind === 'youtube#video')
    .map(video => ({
      youtubeId: video.id.videoId,
      title: { en: video.snippet.title, pt: '' },
      description: { en: video.snippet.description, pt: '' },
      publishedAt: video.snippet.publishedAt,
      thumbnails: {
        default: video.snippet.thumbnails.default.url,
        medium: video.snippet.thumbnails.medium.url,
        high: video.snippet.thumbnails.high.url,
      }
    }));

  return {
    videos,
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null
  };
};