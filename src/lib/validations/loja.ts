import { z } from "zod";

export const lojaSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().optional(),
  telefone: z.string().optional(),
  email: z.union([z.literal(""), z.email("Email inválido")]).optional(),
  endereco: z.string().optional(),
  logo_url: z.union([z.literal(""), z.url("URL inválida")]).optional(),
});

export type LojaFormData = z.infer<typeof lojaSchema>;
