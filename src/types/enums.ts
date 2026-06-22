export const RoleEnum = {
  client: "client",
  professional: "professional",
  store_admin: "store_admin",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];

export const AppointmentStatus = {
  confirmed: "confirmed",
  cancelled: "cancelled",
  completed: "completed",
} as const;

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const DiaSemana = {
  SEGUNDA: 0,
  TERCA: 1,
  QUARTA: 2,
  QUINTA: 3,
  SEXTA: 4,
  SABADO: 5,
  DOMINGO: 6,
} as const;

export type DiaSemana = (typeof DiaSemana)[keyof typeof DiaSemana];

export const DiaSemanaLabel: Record<DiaSemana, string> = {
  [DiaSemana.SEGUNDA]: "Segunda-feira",
  [DiaSemana.TERCA]: "Terça-feira",
  [DiaSemana.QUARTA]: "Quarta-feira",
  [DiaSemana.QUINTA]: "Quinta-feira",
  [DiaSemana.SEXTA]: "Sexta-feira",
  [DiaSemana.SABADO]: "Sábado",
  [DiaSemana.DOMINGO]: "Domingo",
};
