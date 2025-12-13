import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/userStore";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Dashboard from "@/views/Dashboard.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";

const routes = [
  { path: "/", redirect: "/login" },

  // Rutas públicas
  { path: "/login", component: Login, meta: { guest: true } },
  { path: "/register", component: Register, meta: { guest: true } },
  { path: "/forgot-password", component: ForgotPassword, meta: { guest: true } },
  { path: "/reset-password/:token", component: ResetPassword, meta: { guest: true } },

  // Rutas privadas
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Navigation Guard Global
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.token;

  // Rutas que requieren estar logueado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  // Rutas solo para invitados
  if (to.meta.guest && isAuthenticated) {
    return next("/dashboard");
  }

  next();
});
