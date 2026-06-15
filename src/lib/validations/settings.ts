import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Informe a senha atual"),
    new_password: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
    confirm_password: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "As senhas não conferem",
    path: ["confirm_password"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
