import { defineStore } from "pinia";
import api from "@/services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await api.post("/auth/login", { email, password });

        // Guardar token
        this.token = response.data.token;
        localStorage.setItem("token", this.token);

        // Guardar usuario completo (nombre, apellidos, email, id)
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));

        // Configurar axios
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
      localStorage.removeItem("user");

      delete api.defaults.headers.common["Authorization"];
    },
  },
});
