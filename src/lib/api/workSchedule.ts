import api from "@/lib/api/axios";
import type { WorkScheduleDTO } from "@/types/api";

interface ScheduleBlock {
  weekday: number;
  start_time: string;
  end_time: string;
}

export async function replaceWorkSchedules(
  professionalStoreId: string,
  blocks: ScheduleBlock[],
): Promise<WorkScheduleDTO[]> {
  const { data } = await api.put(
    `/professional-stores/${professionalStoreId}/schedules`,
    { blocks },
  );
  return data;
}
