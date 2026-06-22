import api from "@/lib/api/axios";
import type { WorkScheduleDTO } from "@/types/api";

interface ScheduleEntry {
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export async function listWorkSchedules(professionalId: string): Promise<WorkScheduleDTO[]> {
  const { data } = await api.get(`/professionals/${professionalId}/schedules`);
  return data;
}

export async function replaceWorkSchedules(
  professionalId: string,
  schedules: ScheduleEntry[],
): Promise<WorkScheduleDTO[]> {
  const { data } = await api.put(`/professionals/${professionalId}/schedules`, {
    schedules,
  });
  return data;
}
