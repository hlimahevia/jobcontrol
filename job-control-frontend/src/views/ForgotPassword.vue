<template>
  <div class="forgot-password">
    <form @submit.prevent="handleSubmit">
      <h2>Recuperar contraseña</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        required
      />
      <button type="submit">Enviar enlace</button>
      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const email = ref('');
const message = ref('');
const error = ref('');

const handleSubmit = async () => {
  message.value = '';
  error.value = '';
  try {
    await api.post('/auth/forgot-password', { email: email.value });
    message.value = 'Correo enviado. Revisa tu bandeja de entrada.';
  } catch (err) {
    error.value = 'No se pudo enviar el correo. Verifica el email.';
  }
};
</script>

<style scoped>
.forgot-password {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
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
