import type { ProfessionalDTO, ProfessionalWithStoreDTO } from "@/types/api";
import type { ProfessionalCreateFormData } from "@/lib/validations/professional";
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

export async function getMyProfessionals(): Promise<ProfessionalWithStoreDTO[]> {
  const { data } = await api.get<ProfessionalWithStoreDTO[]>("/me/professionals");
  return data;
}

export async function updateProfessional(
  storeId: string,
  professionalId: string,
  updates: Partial<{ bio: string | null; photo_url: string | null; is_active: boolean }>,
): Promise<ProfessionalDTO> {
  const { data } = await api.patch<ProfessionalDTO>(
    `/stores/${storeId}/professionals/${professionalId}`,
    updates,
  );
  return data;
}

export async function unlinkProfessional(storeId: string, professionalId: string): Promise<void> {
  await api.delete(`/stores/${storeId}/professionals/${professionalId}`);
}

export async function createProfessional(
  storeId: string,
  data: ProfessionalCreateFormData,
): Promise<ProfessionalDTO> {
  const { data: response } = await api.post<ProfessionalDTO>(
    `/stores/${storeId}/professionals`,
    { ...data, phone: data.phone || null },
  );
  return response;
}
