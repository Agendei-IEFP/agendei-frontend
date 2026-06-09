import { z } from "zod";

export const professionalEditSchema = z.object({
  bio: z.string().nullable().optional(),
  photo_url: z.string().url("URL inválida").nullable().optional(),
  is_active: z.boolean(),
});

export type ProfessionalEditFormData = z.infer<typeof professionalEditSchema>;
