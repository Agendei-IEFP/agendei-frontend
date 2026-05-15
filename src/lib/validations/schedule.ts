import { z } from "zod";

export const scheduleSchema = z
  .object({
    weekday: z.number().min(0).max(6),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (HH:MM)"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (HH:MM)"),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "Hora de fim deve ser depois da hora de início",
    path: ["end_time"],
  });

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
