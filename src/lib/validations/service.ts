import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional().nullable(),
  default_price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
    .refine((v) => parseFloat(v) >= 0, "Preço deve ser maior ou igual a 0"),
  default_duration_minutes: z
    .number({ error: "Duração deve ser um número" })
    .min(15, "Duração mínima é 15 minutos"),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const offeringSchema = z.object({
  service_id: z.string().min(1, "Selecione um serviço"),
  price_override: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
    .optional()
    .nullable(),
  duration_override: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .optional()
    .nullable(),
});

export type OfferingFormData = z.infer<typeof offeringSchema>;

export const offeringUpdateSchema = z.object({
  price_override: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
    .optional()
    .nullable(),
  duration_override: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .optional()
    .nullable(),
  is_enabled: z.boolean().optional(),
});

export type OfferingUpdateFormData = z.infer<typeof offeringUpdateSchema>;
