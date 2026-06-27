import { z } from "zod";

const storeTypeEnum = z.enum([
  "hair_salon",
  "barbershop",
  "nails",
  "aesthetics",
  "massage",
  "treatments",
]);

export const storeSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  phone: z
    .string()
    .regex(/^\d{3}\s?\d{3}\s?\d{3}$/, "Número inválido (ex: 912 345 678)")
    .optional()
    .or(z.literal("")),
  email: z.email("Email inválido").optional().or(z.literal("")),
  address: z.string().max(255, "Máximo 255 caracteres").optional(),
  logo_url: z.url("URL inválida").optional().or(z.literal("")),
  banner_url: z.url("URL inválida").optional().or(z.literal("")),
  store_types: z.array(storeTypeEnum).max(3, "Máximo de 3 tipos por estabelecimento"),
});

export type StoreFormData = z.infer<typeof storeSchema>;
