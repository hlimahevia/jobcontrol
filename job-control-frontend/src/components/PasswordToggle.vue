<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String,
  placeholder: String
});
const emit = defineEmits(['update:modelValue']);

const showPassword = ref(false);
</script>

<template>
  <div class="password-toggle">
    <input
      :type="showPassword ? 'text' : 'password'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
    />
    <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
      {{ showPassword ? '🙈' : '👁️' }}
    </button>
  </div>
</template>

<style scoped>
.password-toggle {
  position: relative;
  display: flex;
}
.input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
}
.toggle-btn {
  background: #eee;
  border: 1px solid #ccc;
  border-left: none;
  padding: 0 0.75rem;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}
</style>
