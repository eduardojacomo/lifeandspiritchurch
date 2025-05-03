<script setup>
import {ref, onMounted} from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const error = ref(null)
const email = ref('');
const password = ref('');
const resposta = ref('');

const login = async () => {
    error.value = null; // Limpa qualquer erro anterior
    console.log('executando aqui')
    try {
        console.log('chegou aqui?')
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        console.log('Usuário logado:', user);
        console.log(auth.currentUser);
        resposta.value = 'Login realizado com sucesso!';
    } catch (err) {
        console.error('Erro ao fazer login:', err.message);
        error.value = 'Falha ao autenticar. Verifique seu email e senha.';
        resposta.value = 'Erro ao tentar logar.';
    }
};

</script>

<template>
    <main>
        <div class="row">
            <p v-if="error" style="color: red;">{{ error }}</p>
            <p v-if="resposta">{{ resposta }}</p>
            <div class="form-container">
                <div class="logo-container">
                    Welcome Back!
                </div>

                <div class="line"></div>
                <form class="form" @submit.prevent="login">
                    <div class="form-group">
                    <label for="email">Email</label>
                    <input required="" placeholder="Enter your email" name="email" id="email" type="text" v-model="email">
                    </div>

                    <div class="form-group">
                    <label for="password">Password</label>
                    <input required="" name="password" placeholder="Enter your password" id="password" type="password" v-model="password">
                    </div>

                    <button type="submit" class="form-submit-btn" @click="login">Sign In</button>
                </form>

                <a class="forgot-password-link link" href="#">Forgot Password</a>

                <!-- <p class="signup-link">
                    Don't have an account?
                    <a class="signup-link link" href="#"> Sign up now</a>
                </p> -->
            </div>
        </div>
    </main>
</template>

<style scoped>
main{
    padding: 80px 2rem 0 2rem;
}
.row{
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.form-container {
    width: 350px;
    background-color: var(--color-background-mute);
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
  }

  .form-container button:active {
    scale: 0.95;
  }

  .form-container .logo-container {
    margin-bottom: 12px;
    text-align: center;
    font-weight: 700;
    font-size: 20px;
  }

  .form-container .social-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .form-container .social-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-family: inherit;
    color: #fff;
    border: none;
    padding: 12px 16px;
    gap: 8px;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
  }

  .form-container .social-button svg {
    width: 22px;
    height: 22px;
    fill: white;
  }

  .form-container .social-button.facebook {
    background-color: #1778f2;
  }

  .form-container .social-button.apple {
    background-color: #212121;
  }

  .form-container .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-container .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .form-container .form-group input[type="text"],
  .form-container .form-group input[type="password"] {
    width: 100%;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: inherit;
    border: 1px solid #ccc;
  }

  .form-container .form-group input::placeholder {
    opacity: 0.5;
  }

  .form-container .form-group input[type="text"]:focus,
  .form-container .form-group input[type="password"]:focus {
    outline: none;
    border-color: #1778f2;
  }

  .form-container .form-submit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: inherit;
    color: #fff;
    background-color: #212121;
    border: none;
    width: 100%;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin: 12px 0;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
  }

  .form-container .form-submit-btn:hover {
    background-color: #313131;
  }

  .form-container .link {
    color: #1778f2;
    text-decoration: none;
  }

  .form-container .forgot-password-link {
    align-self: flex-end;
    margin-top: -20px;
  }

  .form-container .signup-link {
    align-self: center;
    font-weight: 500;
  }

  .form-container .signup-link .link {
    font-weight: 400;
  }

  .form-container .link:hover {
    text-decoration: underline;
  }

  .form-container .line {
    width: 100%;
    height: 1px;
    background-color: #212121;
    opacity: 0.1;
  }
</style>