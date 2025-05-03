import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebaseApp'

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error('Erro ao fazer login:', error.message)
    throw error
  }
}

export async function logout() {
  await signOut(auth)
}