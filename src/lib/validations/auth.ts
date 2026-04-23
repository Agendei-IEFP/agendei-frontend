import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha obrigatória e no mínimo 8 caracteres"),
});

export const registerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  role: z.enum(["cliente", "admin_loja"]),
  // .refine() garante que só aceita checked — false ou undefined rejeitado
  accepted_terms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os Termos e Condições",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
