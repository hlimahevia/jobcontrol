<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import logo from "@/assets/logoColor.png";

const router = useRouter();
const nombre = ref("");
const apellidos = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirm = ref(false);
const error = ref("");
const success = ref(false);

const handleRegister = async () => {
  error.value = "";
  success.value = false;

  if (password.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden";
    return;
  }

  try {
    await api.post("/auth/register", {
      nombre: nombre.value,
      apellidos: apellidos.value,
      email: email.value,
      password: password.value,
    });

    success.value = true;
    nombre.value = "";
    apellidos.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
  } catch (err) {
    console.error("Error al registrar:", err);
    error.value = err.response?.data?.message || "Error al registrar usuario";
  }
};
</script>

<template>
  <div class="register-wrapper">
    <form class="register-form" @submit.prevent="handleRegister">

      <!-- LOGO -->
      <img :src="logo" alt="Job-Control logo" class="register-logo" />

      <!-- TITLE -->
      <h2>Create account</h2>

      <input type="text" v-model="nombre" placeholder="First name" required />
      <input type="text" v-model="apellidos" placeholder="Last name" required />
      <input type="email" v-model="email" placeholder="Email" required />

      <!-- PASSWORD -->
      <div class="input-password">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Password"
          required
        />
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

      <!-- CONFIRM PASSWORD -->
      <div class="input-password">
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Confirm password"
          required
        />
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
      <button type="submit">Register</button>

      <!-- MESSAGES -->
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">User registered successfully.</p>

      <!-- LINK -->
      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
}

/* Card */
.register-form {
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
.register-logo {
  width: 150px;
  margin: 0 auto 12px;
  display: block;
}

/* Title */
.register-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

/* Inputs */
input {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
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

/* Eye icon */
.eye-btn {
  position: absolute;
  right: 12px;
  top: 38%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-muted);
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

/* Button */
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

/* Messages */
.error {
  color: var(--red-pastel);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.success {
  color: var(--green-pastel);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

/* Link */
.login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.login-link a {
  color: var(--blue-pastel);
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

</style>
