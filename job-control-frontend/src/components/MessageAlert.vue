<script setup>
defineProps({
  type: String, // "success" | "error"
  message: String
});
</script>

<template>
  <p :class="['alert', type]">{{ message }}</p>
</template>

<style scoped>
.alert {
  padding: 0.8rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
