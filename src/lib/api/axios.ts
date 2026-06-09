import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { refresh } from "./auth";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as typeof error.config & { _retried?: boolean };

    if (error.response?.status !== 401 || config._retried) {
      return Promise.reject(error);
    }

    if (error.config.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    config._retried = true;

    try {
      const { access_token } = await refresh();
      useAuthStore.getState().setAccessToken(access_token);
      config.headers.Authorization = `Bearer ${access_token}`;
      return api(config);
    } catch {
      useAuthStore.getState().logout();
      window.location.replace("/login");
      return Promise.reject(error);
    }
  },
);

export default api;
