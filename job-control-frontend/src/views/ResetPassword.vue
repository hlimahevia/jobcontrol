<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import logo from "@/assets/logoColor.png";

import LoadingSpinner from "@/components/LoadingSpinner.vue";
import MessageAlert from "@/components/MessageAlert.vue";

const route = useRoute();
const router = useRouter();

const token = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const showPassword = ref(false);
const showConfirm = ref(false);

const message = ref("");
const error = ref("");
const loading = ref(false);

onMounted(() => {
  token.value = route.query.token || "";
  if (!token.value) {
    error.value = "Invalid or missing token.";
  }
});

const handleReset = async () => {
  error.value = "";
  message.value = "";
  loading.value = true;

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    loading.value = false;
    return;
  }

  try {
    await api.post("/auth/reset-password", {
      token: token.value,
      newPassword: newPassword.value,
    });

    message.value = "Password updated successfully. Redirecting...";
    setTimeout(() => router.push("/login"), 3000);
  } catch (err) {
    error.value = err.response?.data?.message || "Error resetting password.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="reset-wrapper">
    <form class="reset-form" @submit.prevent="handleReset">
      <!-- LOGO -->
      <img :src="logo" alt="Job-Control logo" class="reset-logo" />

      <!-- TITLE -->
      <h2>Set new password</h2>

      <!-- PASSWORD -->
      <div class="input-password">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="newPassword"
          placeholder="New password"
          required
        />
        <button
          type="button"
          class="eye-btn"
          @click="showPassword = !showPassword"
        >
          <!-- eye closed -->
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

          <!-- eye open -->
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

      <!-- CONFIRM -->
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
          @click="showConfirm = !showConfirm"
        >
          <svg
            v-if="!showConfirm"
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

      <button type="submit">Update password</button>

      <LoadingSpinner v-if="loading" />
      <MessageAlert v-if="message" type="success" :message="message" />
      <MessageAlert v-if="error" type="error" :message="error" />
    </form>
  </div>
</template>

<style scoped>
.reset-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
}

.reset-form {
  background-color: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.reset-logo {
  width: 150px;
  margin: 0 auto 12px;
  display: block;
}

.reset-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

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
</style>
