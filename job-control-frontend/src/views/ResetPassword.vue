<template>
  <div class="reset-password">
    <form @submit.prevent="handleSubmit">
      <h2>Restablecer contraseña</h2>
      <div class="input-password">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="newPassword"
          placeholder="Nueva contraseña"
          required
        />
        <span class="toggle-icon" @click="showPassword = !showPassword">
          {{ showPassword ? '🙈' : '👁️' }}
        </span>
      </div>

      <button type="submit">Actualizar</button>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const newPassword = ref('');
const message = ref('');
const error = ref('');
const showPassword = ref(false);
let token = '';

onMounted(() => {
  token = route.query.token;
  if (!token) {
    error.value = 'Token no proporcionado';
  }
});

const handleSubmit = async () => {
  error.value = '';
  message.value = '';

  if (!token) {
    error.value = 'Token inválido';
    return;
  }

  try {
    await api.post('/auth/reset-password', {
      token,
      newPassword: newPassword.value,
    });
    message.value = 'Contraseña actualizada correctamente. Puedes iniciar sesión.';
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    error.value = 'Error al actualizar la contraseña';
  }
};
</script>

<style scoped>
.reset-password {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.input-password {
  position: relative;
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  padding-right: 2.5rem;
  box-sizing: border-box;
}

.toggle-icon {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
}

button {
  width: 100%;
  padding: 0.7rem;
}

.success {
  color: green;
}
.error {
  color: red;
}
</style>
