import type { ProfessionalDTO, ProfessionalStoreWithStoreDTO } from "@/types/api";
import api from "./axios";

export async function getMyProfile(): Promise<ProfessionalDTO> {
  const { data } = await api.get<ProfessionalDTO>("/me/professional");
  return data;
}

export async function updateMyProfile(
  updates: Partial<{ bio: string | null; photo_url: string | null; is_active: boolean }>,
): Promise<ProfessionalDTO> {
  const { data } = await api.patch<ProfessionalDTO>("/me/professional", updates);
  return data;
}

export async function getMyProfessionalStores(): Promise<ProfessionalStoreWithStoreDTO[]> {
  const { data } = await api.get<ProfessionalStoreWithStoreDTO[]>("/me/professional-stores");
  return data;
}
