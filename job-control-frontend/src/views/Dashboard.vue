<template>
  <div class="dashboard">
    <h1>Bienvenido, {{ user?.email }}</h1>

    <p>Este es tu panel personal</p>

    <button @click="handleLogout">Cerrar sesión</button>
  </div>
</template>

<script>
import { useUserStore } from "@/store/userStore";
import { onMounted } from "vue";
import api from "@/services/api";

export default {
  setup() {
    const userStore = useUserStore();

    // Obtener datos del usuario desde backend
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        userStore.user = res.data.user;
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };

    onMounted(fetchUser);

    const handleLogout = () => {
      userStore.logout();
      window.location.href = "/login";
    };

    return {
      user: userStore,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 40px auto;
}
</style>
