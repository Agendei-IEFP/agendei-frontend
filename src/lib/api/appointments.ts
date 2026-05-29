import api from "@/lib/api/axios";
import type { AppointmentDTO } from "@/types/api";

export async function listMyProfessionalAppointments(): Promise<AppointmentDTO[]> {
  const { data } = await api.get<AppointmentDTO[]>("/me/professional-appointments");
  return data;
}
