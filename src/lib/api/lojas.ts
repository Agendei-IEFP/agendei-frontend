import type { LojaDTO } from "@/types/api";
import api from "./axios";

export interface LojaCreateInput {
  nome: string;
  descricao?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  logo_url?: string;
}

export type LojaUpdateInput = Partial<LojaCreateInput>;

function stripEmpty<T extends object>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, v]) => v !== "" && v !== undefined),
  ) as Partial<T>;
}

export async function getMinhasLojas(): Promise<LojaDTO[]> {
  const { data } = await api.get<LojaDTO[]>("/lojas/minhas");
  return data;
}

export async function criarLoja(input: LojaCreateInput): Promise<LojaDTO> {
  const { data } = await api.post<LojaDTO>("/lojas", stripEmpty(input));
  return data;
}

export async function atualizarLoja(id: string, input: LojaUpdateInput): Promise<LojaDTO> {
  const { data } = await api.patch<LojaDTO>(`/lojas/${id}`, stripEmpty(input));
  return data;
}
