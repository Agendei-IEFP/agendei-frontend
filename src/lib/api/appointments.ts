import api from "@/lib/api/axios";
import type { AppointmentAdminDTO, AppointmentDTO } from "@/types/api";

export async function listMyProfessionalAppointments(): Promise<AppointmentDTO[]> {
  const { data } = await api.get<AppointmentDTO[]>("/me/professional-appointments");
  return data;
}

export async function getAvailableSlots(
  professionalId: string,
  serviceId: string,
  date: string,
): Promise<{ start: string; end: string }[]> {
  const { data } = await api.get<{ start: string; end: string }[]>(
    `/professionals/${professionalId}/available-slots`,
    { params: { service_id: serviceId, date } },
  );
  return data;
}

export async function createAppointment(body: {
  professional_id: string;
  service_id: string;
  starts_at: string;
  notes?: string;
}): Promise<AppointmentDTO> {
  const { data } = await api.post<AppointmentDTO>("/appointments", body);
  return data;
}

export async function listMyAppointments(): Promise<AppointmentDTO[]> {
  const { data } = await api.get<AppointmentDTO[]>("/me/appointments");
  return data;
}

export async function cancelAppointment(id: string, reason?: string): Promise<AppointmentDTO> {
  const { data } = await api.patch<AppointmentDTO>(`/appointments/${id}/status`, {
    status: "cancelled",
    reason,
  });
  return data;
}

export async function getStoreAppointments(
  storeId: string,
  date?: string,
): Promise<AppointmentAdminDTO[]> {
  const { data } = await api.get<AppointmentAdminDTO[]>(`/stores/${storeId}/appointments`, {
    params: date ? { date } : {},
  });
  return data;
}
