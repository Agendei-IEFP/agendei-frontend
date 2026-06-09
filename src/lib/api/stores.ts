import type { StoreDTO, StoreOfferingDTO, StoreProfessionalDTO } from "@/types/api";
import api from "./axios";
import { stripEmpty } from "../utils";
import type { StoreFormData } from "../validations/store";

export async function listStores(): Promise<StoreDTO[]> {
  const { data } = await api.get<StoreDTO[]>("/stores");
  return data;
}

export async function getMyStores(): Promise<StoreDTO[]> {
  const { data } = await api.get<StoreDTO[]>("/me/stores");
  return data;
}

export async function getStore(id: string): Promise<StoreDTO> {
  const { data } = await api.get<StoreDTO>(`/stores/${id}`);
  return data;
}

export async function getStoreOfferings(id: string): Promise<StoreOfferingDTO[]> {
  const { data } = await api.get<StoreOfferingDTO[]>(`/stores/${id}/offerings`);
  return data;
}

export async function listStoreProfessionals(id: string): Promise<StoreProfessionalDTO[]> {
  const { data } = await api.get<StoreProfessionalDTO[]>(`/stores/${id}/professionals`);
  return data;
}

export async function createStore(dados: StoreFormData): Promise<StoreDTO> {
  const { data } = await api.post<StoreDTO>("/stores", stripEmpty(dados));
  return data;
}

export async function updateStore(
  id: string,
  dados: Partial<StoreFormData> & { is_active?: boolean },
): Promise<StoreDTO> {
  const { data } = await api.patch<StoreDTO>(`/stores/${id}`, stripEmpty(dados));
  return data;
}

export async function deleteStore(id: string): Promise<void> {
  await api.delete(`/stores/${id}`);
}
