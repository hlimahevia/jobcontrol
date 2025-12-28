<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import logo from "@/assets/logoColor.png";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  try {
    await userStore.login(email.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Error al iniciar sesión";
  }
};
</script>

<template>
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="handleLogin">
      <!-- LOGO -->
      <img :src="logo" alt="Job-Control logo" class="login-logo" />

      <!-- TITLE -->
      <h2>Iniciar sesión</h2>

      <!-- EMAIL -->
      <input
        type="email"
        v-model="email"
        placeholder="Correo electrónico"
        required
      />

      <!-- PASSWORD -->
      <div class="input-password">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Contraseña"
          required
        />

        <!-- EYE ICON -->
        <button
          type="button"
          class="eye-btn"
          @click="showPassword = !showPassword"
          aria-label="Mostrar u ocultar contraseña"
        >
          <!-- Ojo tachado (password oculto) -->
          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.81 21.81 0 0 1 5.06-6.88"
            />
            <path d="M1 1l22 22" />
            <path
              d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.86 21.86 0 0 1-2.16 3.19"
            />
            <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
          </svg>

          <!-- Ojo abierto (password visible) -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <!-- BUTTON -->
      <button type="submit">Entrar</button>

      <!-- ERROR -->
      <p v-if="error" class="error">{{ error }}</p>

      <!-- LINKS -->
      <p class="register-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>

      <p class="forgot-link">
        <router-link to="/forgot-password">
          ¿Olvidaste tu contraseña?
        </router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
}

/* Card */
.login-form {
  background-color: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

/* Logo */
.login-logo {
  width: 150px;
  margin: 0 auto 12px;
  display: block;
}

/* Title */
.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Inputs */
input {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  border-color: var(--blue-pastel);
}

/* Password wrapper */
.input-password {
  position: relative;
}

/* Eye icon button */
.eye-btn {
  position: absolute;
  right: 12px;
  top: 38%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #6b7280;
  line-height: 0;
}

.eye-btn:hover,
.eye-btn:focus,
.eye-btn:active {
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  color: var(--blue-pastel);
}

/* Submit button */
button[type="submit"] {
  background-color: #e0b93f;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button[type="submit"]:hover {
  background-color: white;
  color: #d4a017;
  border: 2px solid;
}

/* Error */
.error {
  color: var(--red-pastel);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

/* Links */
.register-link,
.forgot-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.register-link a,
.forgot-link a {
  border-color: var(--blue-pastel);
  text-decoration: none;
}

.register-link a:hover,
.forgot-link a:hover {
  text-decoration: underline;
}
</style>
