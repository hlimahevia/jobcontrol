import { defineStore } from "pinia";
import api from "@/services/api"; // usa tu instancia de axios ya configurada

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        this.token = response.data.token;
        localStorage.setItem("token", this.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        return true;
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
  },
});
