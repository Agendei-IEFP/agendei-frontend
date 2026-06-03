import api from "@/lib/api/axios";
import type { AppointmentDTO } from "@/types/api";

export async function listMyProfessionalAppointments(): Promise<AppointmentDTO[]> {
  const { data } = await api.get<AppointmentDTO[]>("/me/professional-appointments");
  return data;
}

export async function getAvailableSlots(
  professionalStoreId: string,
  offeringId: string,
  date: string,
): Promise<{ start: string; end: string }[]> {
  const { data } = await api.get<{ start: string; end: string }[]>(
    `/professional-stores/${professionalStoreId}/available-slots`,
    { params: { offering_id: offeringId, date } },
  );
  return data;
}

export async function createAppointment(body: {
  professional_store_id: string;
  offering_id: string;
  starts_at: string;
  notes?: string;
}): Promise<AppointmentDTO> {
  const { data } = await api.post<AppointmentDTO>("/appointments", body);
  return data;
}
