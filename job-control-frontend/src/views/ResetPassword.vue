<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import MessageAlert from "@/components/MessageAlert.vue";

const route = useRoute();
const router = useRouter();

const token = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const message = ref("");
const error = ref("");
const loading = ref(false);

onMounted(() => {
  token.value = route.query.token || "";
  if (!token.value) {
    error.value = "Token inválido o faltante.";
  }
});

const handleReset = async () => {
  error.value = "";
  message.value = "";
  loading.value = true;

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden.";
    loading.value = false;
    return;
  }

  try {
    await api.post("/auth/reset-password", {
      token: token.value,
      newPassword: newPassword.value,
    });

    message.value = "Contraseña actualizada correctamente. Redirigiendo...";
    setTimeout(() => router.push("/login"), 3000);
  } catch (err) {
    error.value = err.response?.data?.message || "Error al restablecer contraseña.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="reset-password">
    <form @submit.prevent="handleReset">
      <h2>Restablecer Contraseña</h2>

      <input
        type="password"
        v-model="newPassword"
        placeholder="Nueva contraseña"
        required
      />
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirmar nueva contraseña"
        required
      />

      <button type="submit">Actualizar contraseña</button>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>

  <LoadingSpinner v-if="loading" />
  <MessageAlert v-if="message" type="success" :message="message" />
  <MessageAlert v-if="error" type="error" :message="error" />
</template>

<style scoped>
.reset-password {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus {
  border-color: #3498db;
  outline: none;
}

button {
  width: 100%;
  padding: 0.7rem;
  background-color: #f0b429;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: white;
  color: #f0b429;
  border: 2px solid #f0b429;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
