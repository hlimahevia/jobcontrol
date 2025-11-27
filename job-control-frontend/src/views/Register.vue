<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

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
      <h2>Crear cuenta</h2>

      <input type="text" v-model="nombre" placeholder="Nombre" required />
      <input type="text" v-model="apellidos" placeholder="Apellidos" required />
      <input type="email" v-model="email" placeholder="Correo electrónico" required />

      <div class="input-password">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Contraseña"
          required
        />
        <span class="toggle-icon" @click="showPassword = !showPassword">
          {{ showPassword ? "👁️" : "🙈" }}
        </span>
      </div>

      <div class="input-password">
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Repetir contraseña"
          required
        />
        <span class="toggle-icon" @click="showConfirm = !showConfirm">
          {{ showConfirm ? "👁️" : "🙈" }}
        </span>
      </div>

      <button type="submit">Registrarse</button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Usuario registrado correctamente.</p>

      <p class="login-link">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* pantalla completa */
  padding: 1rem;
}

.register-form {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

input {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  border-color: #007bff;
}

.input-password {
  position: relative;
}

.toggle-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

button {
  background-color: #d4a017;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: white;
  color: #d4a017;
  border: 2px solid #d4a017;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.success {
  color: green;
  margin-top: 1rem;
  text-align: center;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}
</style>
