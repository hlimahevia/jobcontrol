<script setup>
import HeaderBar from "@/components/HeaderBar.vue";
</script>

<template>
  <!-- Header always loads but decides internally whether to show itself -->
  <HeaderBar />

  <main class="app-container">
    <router-view />
  </main>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 980px;
  margin: auto;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
}
</style>
