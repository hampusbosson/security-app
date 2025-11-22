import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: false,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle global errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    //auto-logout on 401
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;