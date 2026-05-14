import { z } from "zod";

export const inviteRegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial"),
  accepted_terms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os Termos e Condições",
  }),
});

export type InviteRegisterFormData = z.infer<typeof inviteRegisterSchema>;
