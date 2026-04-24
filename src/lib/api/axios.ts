import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { refresh } from "./auth";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // envia o cookie httpOnly do refresh token automaticamente
});

// Enquanto um refresh está em andamento, todas as outras requisições
// que receberem 401 vão esperar essa mesma promise — sem chamar /auth/refresh
// um monte de vezes em paralelo.
let refreshPromise: Promise<string> | null = null;

// ---------------------------------------------------------------------------
// Request interceptor — injeta o access token em toda requisição
// ---------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — trata token expirado (401)
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as typeof error.config & {
      _retried?: boolean;
    };

    // Não é 401 ou já tentou uma vez — rejeita normalmente
    if (error.response?.status !== 401 || originalRequest._retried) {
      return Promise.reject(error);
    }

    // Endpoints de auth pública (login, register, refresh) não devem entrar no
    // ciclo de refresh — rejeita diretamente para o erro chegar ao componente
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        useAuthStore.getState().logout();
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      // Se já existe um refresh em andamento, espera ele em vez de disparar outro
      if (!refreshPromise) {
        refreshPromise = refresh()
          .then((data) => data.access_token)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      useAuthStore.getState().setAccessToken(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      // Refaz a requisição original com o novo token
      return api(originalRequest);
    } catch {
      // Refresh falhou — sessão encerrada
      useAuthStore.getState().logout();
      window.location.replace("/login");
      return Promise.reject(error);
    }
  },
);

export default api;
