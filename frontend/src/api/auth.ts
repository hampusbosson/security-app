import api from "./http";
import type { User } from "@/types/auth";

export const AuthAPI = {
  getCurrentUser: async (): Promise<User> => {
    const res = await api.get("/api/auth/get-user");
    return res.data.user;
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  },
};