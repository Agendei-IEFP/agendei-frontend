import type { RefreshResponse, TokenResponse } from "@/types/api";
import type { RoleEnum } from "@/types/enums";
import api from "./axios";

// ---------------------------------------------------------------------------
// Tipos de entrada
// ---------------------------------------------------------------------------

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  nome: string;
  email: string;
  password: string;
  role: Exclude<RoleEnum, "profissional">;
}

// ---------------------------------------------------------------------------
// Funções
// ---------------------------------------------------------------------------

/**
 * Autentica um usuário existente.
 * O refresh token é definido pelo backend como cookie httpOnly — entao não aparece aqui.
 */
export async function login(data: LoginInput): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/login", data);
  return response.data;
}

/**
 * Cadastra um novo usuário.
 * Retorna access token + dados do usuário, igual ao login.
 */
export async function register(data: RegisterInput): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/register", data);
  return response.data;
}

/**
 * Usa o refresh token (cookie httpOnly) para gerar um novo access token.
 * Chamado automaticamente pelo interceptor do axios quando recebe 401.
 * Também chamado no carregamento inicial da app para restaurar a sessão.
 */
export async function refresh(): Promise<RefreshResponse> {
  const response = await api.post<RefreshResponse>("/auth/refresh");
  return response.data;
}

/**
 * Invalida o refresh token no servidor.
 * O cookie é removido pelo backend via Set-Cookie.
 */
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
