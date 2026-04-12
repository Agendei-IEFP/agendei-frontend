import { Role, StatusAgendamento } from "./enums";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

export interface Loja {
  id: string;
  nome: string;
  descricao: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  logo_url: string | null;
  is_active: boolean;
}

export interface Profissional {
  id: string;
  nome: string;
  bio: string | null;
  foto_url: string | null;
  is_active: boolean;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  preco: string;
  duracao_minutos: number;
  is_active: boolean;
}

export interface Agendamento {
  id: string;
  status: StatusAgendamento;
  data_hora_inicio: string;
  data_hora_fim: string;
  notas: string | null;
  cancelado_motivo: string | null;
  cliente: User;
  profissional: Profissional;
  servico: Servico;
  loja: Loja;
}

export interface SlotsResponse {
  data: string;
  profissional_id: string;
  servico_id: string;
  duracao_minutos: number;
  slots: string[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}