import type { LojaDTO } from "@/types/api";
import api from "./axios";

export async function getMinhasLojas(): Promise<LojaDTO[]> {
  const { data } = await api.get<LojaDTO[]>("/lojas/minhas");
  return data;
}
