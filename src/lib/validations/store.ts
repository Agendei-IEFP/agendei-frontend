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
  phone: z.string().max(20, "Máximo 20 caracteres").optional(),
  email: z.email("Email inválido").optional().or(z.literal("")),
  address: z.string().max(255, "Máximo 255 caracteres").optional(),
  logo_url: z.url("URL inválida").optional().or(z.literal("")),
  store_types: z.array(storeTypeEnum).max(3, "Máximo de 3 tipos por estabelecimento"),
});

export type StoreFormData = z.infer<typeof storeSchema>;
