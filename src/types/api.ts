import type { RoleEnum, AppointmentStatus } from "./enums";

type ISOTimestamp = string;

type DecimalString = string;

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiError {
  detail: string | ValidationError[];
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  user: UserDTO;
}

export interface RefreshResponse {
  access_token: string;
  token_type: "bearer";
}

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

export interface WorkScheduleDTO {
  id: string;
  professional_id: string;
  
  weekday: number;
  
  start_time: string;
  end_time: string;
  is_active: boolean;
}

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

  service_name?: string | null;
  professional_name?: string | null;
  store_name?: string | null;
  price?: string | null;
  duration_minutes?: number | null;

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

export interface SlotsResponse {
  date: string; 
  professional_id: string;
  service_id: string;
  duration_minutes: number;
  slots: { start: ISOTimestamp; end: ISOTimestamp }[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}
