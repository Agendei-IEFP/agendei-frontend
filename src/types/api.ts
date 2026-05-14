import type { RoleEnum, AppointmentStatus } from "./enums";

// ---------------------------------------------------------------------------
// Primitivos reutilizáveis
// ---------------------------------------------------------------------------

/** Timestamps chegam do backend como string ISO 8601 UTC */
type ISOTimestamp = string;

/** Preço chega como string porque o backend usa Decimal(10,2) */
type DecimalString = string;

// ---------------------------------------------------------------------------
// Erros da API
// ---------------------------------------------------------------------------

/** Erro de validação do FastAPI (campo inválido) */
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * FastAPI retorna erros assim:
 *   { detail: "mensagem" }          — erros simples (401, 404, etc.)
 *   { detail: ValidationError[] }   — erros de validação (422)
 */
export interface ApiError {
  detail: string | ValidationError[];
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  user: UserDTO;
}

export interface RefreshResponse {
  access_token: string;
  token_type: "bearer";
}

// ---------------------------------------------------------------------------
// Usuário
// ---------------------------------------------------------------------------

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: RoleEnum;
  created_at: ISOTimestamp;
}

// ---------------------------------------------------------------------------
// Loja
// ---------------------------------------------------------------------------

export interface StoreDTO {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

// ---------------------------------------------------------------------------
// Profissional
// ---------------------------------------------------------------------------

export interface ProfessionalDTO {
  id: string;
  user_id: string;
  /** Nome vem do Usuario relacionado — o backend desnormaliza para evitar joins no frontend */
  name: string;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
}

export interface ProfessionalStoreDTO {
  id: string;
  professional_id: string;
  store_id: string;
  is_active: boolean;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

export interface ProfessionalWithStoreDTO {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  store_id: string;
  store_name: string;
}

// ---------------------------------------------------------------------------
// Serviço
// ---------------------------------------------------------------------------

export interface ServiceDTO {
  id: string;
  professional_store_id: string;
  name: string;
  description: string | null;
  /** Decimal(10,2) serializado como string pelo backend */
  price: DecimalString;
  duration_minutes: number;
  is_active: boolean;
}

// ---------------------------------------------------------------------------
// Horário de trabalho
// ---------------------------------------------------------------------------

export interface WorkScheduleDTO {
  id: string;
  professional_store_id: string;
  /** 0 = segunda ... 6 = domingo */
  weekday: number;
  /** Formato "HH:MM:SS" */
  start_time: string;
  end_time: string;
  is_active: boolean;
}

// ---------------------------------------------------------------------------
// Agendamento
// ---------------------------------------------------------------------------

export interface AppointmentDTO {
  id: string;
  client_id: string;
  professional_id: string;
  offering_id: string;
  starts_at: ISOTimestamp;
  ends_at: ISOTimestamp;
  status: AppointmentStatus;
  notes: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  reminder_sent: boolean;
  created_at: ISOTimestamp;
  // Relações opcionais — incluídas quando o endpoint expande os dados
  client?: UserDTO;
  professional?: ProfessionalDTO;
  offering?: ServiceDTO;
}

// ---------------------------------------------------------------------------
// Disponibilidade
// ---------------------------------------------------------------------------

/** Retornado por GET /professionals/{id}/available-slots */
export interface SlotsResponse {
  date: string; // "YYYY-MM-DD"
  professional_store_id: string;
  offering_id: string;
  duration_minutes: number;
  slots: { start: ISOTimestamp; end: ISOTimestamp }[];
}

// ---------------------------------------------------------------------------
// Convites
// ---------------------------------------------------------------------------

export interface InviteCreatedDTO {
  token: string;
  url: string;
  expires_at: ISOTimestamp;
}

export interface InvitePublicDTO {
  store_id: string;
  store_name: string;
  expires_at: ISOTimestamp;
}

export interface InviteAcceptResponseDTO {
  professional_store: ProfessionalStoreDTO;
  access_token?: string;
  refresh_token?: string;
}

// ---------------------------------------------------------------------------
// Paginação
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}
