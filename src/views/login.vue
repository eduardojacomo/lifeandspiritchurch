<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

const auth = getAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // Usuário autenticado com sucesso
    console.log("Login realizado com sucesso")
  } catch (error) {
    errorMessage.value = "Erro ao fazer login: " + error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label>Senha</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Entrando..." : "Login" }}
      </button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>