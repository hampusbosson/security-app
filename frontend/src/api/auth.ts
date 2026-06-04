import api from "./http";
import type { User } from "@/types/auth";

export const AuthAPI = {
  getCurrentUser: async (): Promise<User> => {
    const res = await api.get("/api/auth/get-user");
    return res.data.user;
  },

  refreshUser: async (): Promise<User> => {
    const res = await api.get("/api/auth/get-user");
    return res.data.user;
  },

  loginUser: (redirectPath = "/dashboard") => {
    sessionStorage.setItem("postAuthRedirect", redirectPath);
    window.location.href = `http://localhost:4000/api/auth/login?redirect=${encodeURIComponent(
      redirectPath
    )}`;
  },

  logoutUser: () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  },
};
