<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/userStore";
import logo from "@/assets/logoBlue.png";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

/* Mostrar header solo en dashboard */
const showHeader = computed(() => route.path === "/dashboard");

/* Estado del header */
const isCollapsed = ref(false);

/* Detectar scroll */
const handleScroll = () => {
  const y = window.scrollY;
  isCollapsed.value = y > 30; // cuando bajas 30px, contrae el header
};

/* Activar y desactivar el listener */
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

/* Nombre del usuario */
const username = computed(() => {
  if (userStore.user?.nombre) return userStore.user.nombre;
  return "User";
});

/* Logout */
const logout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<template>
  <header v-if="showHeader" class="header" :class="{ collapsed: isCollapsed }">
    <div class="header-content">
      <div class="header-left">
        <img :src="logo" alt="Job-Control logo" class="header-logo" />
        <h2 class="logo-text">Job-Control</h2>
      </div>

      <div class="header-right">
        <span class="welcome-text">Hello, {{ username }}</span>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* =========================
   HEADER BASE
========================= */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--text-dark);
  color: white;
  padding: 16px 22px;
  box-sizing: border-box;
  z-index: 2000;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);

  /* Altura normal */
  height: 70px;

  /* Animación suave */
  transition: all 0.25s ease;
}

/* Header colapsado */
.header.collapsed {
  height: 48px;
  padding-top: 6px;
  padding-bottom: 6px;
}

/* =========================
   CONTENIDO INTERNO
========================= */
.header-content {
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: all 0.25s ease;
}

/* =========================
   IZQUIERDA: LOGO + TEXTO
========================= */
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Logo imagen */
.header-logo {
  height: 38px;
  transition: all 0.25s ease;
}

/* Texto del logo */
.logo-text {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  transition: all 0.25s ease;
}

/* Tamaños en modo colapsado */
.header.collapsed .header-logo {
  height: 28px;
}

.header.collapsed .logo-text {
  font-size: 1.2rem;
}

/* =========================
   DERECHA: USUARIO + LOGOUT
========================= */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  font-size: 1rem;
  opacity: 0.9;
  transition: all 0.25s ease;
}

.header.collapsed .welcome-text {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* =========================
   LOGOUT BUTTON
========================= */
.logout-btn {
  padding: 6px 14px;
  background: var(--red-pastel);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.25s ease;
}

.logout-btn:hover {
  background: #dc2626; /* opcional: puedes crear --red-pastel-dark */
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
