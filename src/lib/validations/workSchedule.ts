import { z } from "zod";

export const workScheduleSchema = z
  .object({
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  })
  .refine((d) => d.end_time > d.start_time, {
    message: "O término deve ser depois do início",
    path: ["end_time"],
  });

export type WorkScheduleFormData = z.infer<typeof workScheduleSchema>;
