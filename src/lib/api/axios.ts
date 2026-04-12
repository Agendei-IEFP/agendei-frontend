import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // necessário para o cookie do refresh token
});

export default api;