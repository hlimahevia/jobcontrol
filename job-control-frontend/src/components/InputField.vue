<script setup>
defineProps({
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: "text"
  },
  placeholder: String
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="input-field">
    <label class="label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
    />
  </div>
</template>

<style scoped>
.input-field {
  margin-bottom: 1rem;
}
.label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: block;
}
.input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
