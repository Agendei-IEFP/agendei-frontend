import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listWorkSchedules, replaceWorkSchedules } from "@/lib/api/workSchedule";

interface SchedulePayload {
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export function useWorkSchedules(professionalId: string) {
  return useQuery({
    queryKey: ["schedules", professionalId],
    queryFn: () => listWorkSchedules(professionalId),
    enabled: !!professionalId,
  });
}

export function useReplaceWorkSchedules(professionalId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedules: SchedulePayload[]) =>
      replaceWorkSchedules(professionalId, schedules),
    onSuccess: (data) => {
      queryClient.setQueryData(["schedules", professionalId], data);
    },
  });
}
