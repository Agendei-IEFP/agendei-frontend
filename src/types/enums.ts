export const Role = {
  Cliente: "cliente",
  Profissional: "profissional",
  AdminLoja: "admin_loja",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const StatusAgendamento = {
  Pendente: "pendente",
  Confirmado: "confirmado",
  Cancelado: "cancelado",
  Concluido: "concluido",
} as const;

export type StatusAgendamento = (typeof StatusAgendamento)[keyof typeof StatusAgendamento];