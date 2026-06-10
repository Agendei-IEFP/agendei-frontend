import type { ServiceDTO } from "@/types/api";
import api from "./axios";

export async function listServices(): Promise<ServiceDTO[]> {
  const { data } = await api.get<ServiceDTO[]>("/services/me");
  return data;
}

export async function createService(body: {
  name: string;
  description?: string | null;
  price: string;
  duration_minutes: number;
}): Promise<ServiceDTO> {
  const { data } = await api.post<ServiceDTO>("/services", body);
  return data;
}

export async function updateService(
  id: string,
  body: Partial<{
    name: string;
    description: string | null;
    price: string;
    duration_minutes: number;
    is_active: boolean;
  }>,
): Promise<ServiceDTO> {
  const { data } = await api.patch<ServiceDTO>(`/services/${id}`, body);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}
