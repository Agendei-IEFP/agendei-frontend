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
  accepted_terms_at: ISOTimestamp | null;
  accepted_terms_version: string | null;
}

// ---------------------------------------------------------------------------
// Loja
// ---------------------------------------------------------------------------

export type StoreType =
  | "hair_salon"
  | "barbershop"
  | "nails"
  | "aesthetics"
  | "massage"
  | "treatments";

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
  store_types: StoreType[];
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
  professional_count: number;
  service_count: number;
}

export interface StoreServiceDTO {
  service_id: string;
  service_name: string;
  price: DecimalString;
  duration_minutes: number;
  professional_id: string;
  professional_name: string;
}

export interface StoreProfessionalDTO {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
}

// ---------------------------------------------------------------------------
// Profissional
// ---------------------------------------------------------------------------

export interface ProfessionalDTO {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  store_id: string | null;
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
  professional_id: string;
  name: string;
  description: string | null;
  price: DecimalString;
  duration_minutes: number;
  is_active: boolean;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

// ---------------------------------------------------------------------------
// Horário de trabalho
// ---------------------------------------------------------------------------

export interface WorkScheduleDTO {
  id: string;
  professional_id: string;
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
  service_id: string;
  store_id: string;
  starts_at: ISOTimestamp;
  ends_at: ISOTimestamp;
  status: AppointmentStatus;
  notes: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  reminder_sent: boolean;
  created_at: ISOTimestamp;
  // Campos expandidos — presentes em GET /me/appointments (AppointmentClientPublic)
  service_name?: string | null;
  professional_name?: string | null;
  store_name?: string | null;
  price?: string | null;
  duration_minutes?: number | null;
  // Campos retornados por /me/professional-appointments
  client_name?: string | null;
  client_phone?: string | null;
  client_email?: string | null;
}

export interface AppointmentAdminDTO {
  id: string;
  starts_at: ISOTimestamp;
  ends_at: ISOTimestamp;
  status: AppointmentStatus;
  client_name: string | null;
  professional_name: string | null;
  service_name: string | null;
  store_name: string | null;
  duration_minutes: number | null;
  price: DecimalString | null;
}

// ---------------------------------------------------------------------------
// Disponibilidade
// ---------------------------------------------------------------------------

/** Retornado por GET /professionals/{id}/available-slots */
export interface SlotsResponse {
  date: string; // "YYYY-MM-DD"
  professional_id: string;
  service_id: string;
  duration_minutes: number;
  slots: { start: ISOTimestamp; end: ISOTimestamp }[];
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
