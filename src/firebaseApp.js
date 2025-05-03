import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCja7gwfxH6iqGQb0i__87JDwGVT3Z-AKk",
  authDomain: "church-lifeandspirit.firebaseapp.com",
  projectId: "church-lifeandspirit",
  storageBucket: "church-lifeandspirit.firebasestorage.app",
  messagingSenderId: "578571975042",
  appId: "1:578571975042:web:2860d6807d4dfb4173b79b",
  measurementId: "G-24YHRV3350"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }