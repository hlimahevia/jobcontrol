<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import logo from "@/assets/logoColor.png";

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

<template>
  <div class="forgot-wrapper">
    <form class="forgot-form" @submit.prevent="handleSubmit">

      <!-- LOGO -->
      <img :src="logo" alt="Job-Control logo" class="forgot-logo" />

      <!-- TITLE -->
      <h2>Reset password</h2>

      <!-- EMAIL -->
      <input
        v-model="email"
        type="email"
        placeholder="Email address"
        required
      />

      <!-- BUTTON -->
      <button type="submit">Send reset link</button>

      <!-- MESSAGES -->
      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>

    </form>
  </div>
</template>


<style scoped>
.forgot-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
}

/* Card */
.forgot-form {
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
.forgot-logo {
  width: 150px;
  margin: 0 auto 12px;
  display: block;
}

/* Title */
.forgot-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

/* Input */
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
.success {
  color: var(--green-pastel);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.error {
  color: var(--red-pastel);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

</style>
