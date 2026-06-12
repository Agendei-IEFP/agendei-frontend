import { z } from "zod";

export const professionalEditSchema = z.object({
  bio: z.string().nullable().optional(),
  photo_url: z.string().url("URL inválida").nullable().optional(),
  is_active: z.boolean(),
});

export type ProfessionalEditFormData = z.infer<typeof professionalEditSchema>;

export const professionalCreateSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  phone: z.string().optional(),
});

export type ProfessionalCreateFormData = z.infer<typeof professionalCreateSchema>;
