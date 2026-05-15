import type { CanonicalServiceDTO, OfferingDTO, WorkScheduleDTO } from "@/types/api";
import api from "./axios";

// ---------------------------------------------------------------------------
// Serviços canónicos (do profissional)
// ---------------------------------------------------------------------------

export async function listServices(): Promise<CanonicalServiceDTO[]> {
  const { data } = await api.get<CanonicalServiceDTO[]>("/services");
  return data;
}

export async function createService(body: {
  name: string;
  description?: string | null;
  default_price: string;
  default_duration_minutes: number;
}): Promise<CanonicalServiceDTO> {
  const { data } = await api.post<CanonicalServiceDTO>("/services", body);
  return data;
}

export async function updateService(
  id: string,
  body: Partial<{
    name: string;
    description: string | null;
    default_price: string;
    default_duration_minutes: number;
    is_active: boolean;
  }>,
): Promise<CanonicalServiceDTO> {
  const { data } = await api.patch<CanonicalServiceDTO>(`/services/${id}`, body);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}

// ---------------------------------------------------------------------------
// Offerings (por loja)
// ---------------------------------------------------------------------------

export async function listOfferings(professionalStoreId: string): Promise<OfferingDTO[]> {
  const { data } = await api.get<OfferingDTO[]>(
    `/professional-stores/${professionalStoreId}/offerings`,
  );
  return data;
}

export async function createOffering(
  professionalStoreId: string,
  body: { service_id: string; price_override?: string | null; duration_override?: number | null },
): Promise<OfferingDTO> {
  const { data } = await api.post<OfferingDTO>(
    `/professional-stores/${professionalStoreId}/offerings`,
    body,
  );
  return data;
}

export async function updateOffering(
  professionalStoreId: string,
  offeringId: string,
  body: Partial<{
    price_override: string | null;
    duration_override: number | null;
    is_enabled: boolean;
  }>,
): Promise<OfferingDTO> {
  const { data } = await api.patch<OfferingDTO>(
    `/professional-stores/${professionalStoreId}/offerings/${offeringId}`,
    body,
  );
  return data;
}

export async function deleteOffering(
  professionalStoreId: string,
  offeringId: string,
): Promise<void> {
  await api.delete(`/professional-stores/${professionalStoreId}/offerings/${offeringId}`);
}

// ---------------------------------------------------------------------------
// Horários (por loja)
// ---------------------------------------------------------------------------

export async function listSchedules(professionalStoreId: string): Promise<WorkScheduleDTO[]> {
  const { data } = await api.get<WorkScheduleDTO[]>(
    `/professional-stores/${professionalStoreId}/schedules`,
  );
  return data;
}

export async function createSchedule(
  professionalStoreId: string,
  body: { weekday: number; start_time: string; end_time: string },
): Promise<WorkScheduleDTO> {
  const { data } = await api.post<WorkScheduleDTO>(
    `/professional-stores/${professionalStoreId}/schedules`,
    body,
  );
  return data;
}

export async function updateSchedule(
  professionalStoreId: string,
  scheduleId: string,
  body: Partial<{ weekday: number; start_time: string; end_time: string; is_active: boolean }>,
): Promise<WorkScheduleDTO> {
  const { data } = await api.patch<WorkScheduleDTO>(
    `/professional-stores/${professionalStoreId}/schedules/${scheduleId}`,
    body,
  );
  return data;
}

export async function deleteSchedule(
  professionalStoreId: string,
  scheduleId: string,
): Promise<void> {
  await api.delete(`/professional-stores/${professionalStoreId}/schedules/${scheduleId}`);
}
