import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional().nullable(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
    .refine((v) => parseFloat(v) >= 0, "Preço deve ser maior ou igual a 0"),
  duration_minutes: z
    .number({ error: "Duração deve ser um número" })
    .min(15, "Duração mínima é 15 minutos"),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
