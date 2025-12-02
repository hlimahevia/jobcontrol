<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

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
      <h2>Iniciar sesión</h2>

      <input
        type="email"
        v-model="email"
        placeholder="Correo electrónico"
        required
      />

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

      <button type="submit">Entrar</button>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="register-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>
      <p class="forgot-link">
        <router-link to="/forgot-password"
          >¿Olvidaste tu contraseña?</router-link
        >
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

.login-form {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.login-form h2 {
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

.register-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.forgot-link {
  margin-top: 1rem;
  text-align: center;
}

.forgot-link a {
  color: #007bff;
  text-decoration: none;
}

.forgot-link a:hover {
  text-decoration: underline;
}
</style>
