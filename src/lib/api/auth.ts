import type { RefreshResponse, TokenResponse, UserDTO } from "@/types/api";
import type { RoleEnum } from "@/types/enums";
import api from "./axios";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Exclude<RoleEnum, "professional">;
  accepted_terms: boolean;
}

export async function login(data: LoginInput): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/login", data);
  return response.data;
}

export async function register(data: RegisterInput): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/register", data);
  return response.data;
}

export async function refresh(): Promise<RefreshResponse> {
  const response = await api.post<RefreshResponse>("/auth/refresh");
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe(): Promise<UserDTO> {
  const { data } = await api.get<UserDTO>("/me/user");
  return data;
}
