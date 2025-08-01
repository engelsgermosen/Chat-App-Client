// src/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // tu URL de la API
  withCredentials: false, // si usas cookies/autenticación
});

// Interceptor de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor devuelve 401 en cualquier request…
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
