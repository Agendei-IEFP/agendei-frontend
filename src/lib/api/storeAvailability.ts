import type { StoreAvailabilityDTO } from "@/types/api";
import api from "./axios";

const base = (professionalStoreId: string) =>
  `/professional-stores/${professionalStoreId}/availability`;

export async function listStoreAvailability(
  professionalStoreId: string,
): Promise<StoreAvailabilityDTO[]> {
  const { data } = await api.get<StoreAvailabilityDTO[]>(base(professionalStoreId));
  return data;
}

export async function createStoreAvailability(
  professionalStoreId: string,
  body: { weekday: number; start_time: string; end_time: string },
): Promise<StoreAvailabilityDTO> {
  const { data } = await api.post<StoreAvailabilityDTO>(base(professionalStoreId), body);
  return data;
}

export async function updateStoreAvailability(
  professionalStoreId: string,
  availabilityId: string,
  body: Partial<{ start_time: string; end_time: string; is_active: boolean }>,
): Promise<StoreAvailabilityDTO> {
  const { data } = await api.patch<StoreAvailabilityDTO>(
    `${base(professionalStoreId)}/${availabilityId}`,
    body,
  );
  return data;
}

export async function deleteStoreAvailability(
  professionalStoreId: string,
  availabilityId: string,
): Promise<void> {
  await api.delete(`${base(professionalStoreId)}/${availabilityId}`);
}

export async function replaceStoreAvailability(
  professionalStoreId: string,
  blocks: { weekday: number; start_time: string; end_time: string }[],
): Promise<StoreAvailabilityDTO[]> {
  const { data } = await api.put<StoreAvailabilityDTO[]>(base(professionalStoreId), { blocks });
  return data;
}
