import type { ProfessionalWithStoreDTO } from "@/types/api";
import api from "./axios";

export async function getMyProfessionals(): Promise<ProfessionalWithStoreDTO[]> {
  const { data } = await api.get<ProfessionalWithStoreDTO[]>("/me/professionals");
  return data;
}
