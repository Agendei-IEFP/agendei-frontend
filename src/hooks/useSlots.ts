import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "@/lib/api/appointments";

export function useAvailableSlots(
  professionalId: string | null,
  serviceId: string | null,
  date: string,
) {
  return useQuery({
    queryKey: ["slots", professionalId, serviceId, date],
    queryFn: () => getAvailableSlots(professionalId!, serviceId!, date),
    enabled: !!professionalId && !!serviceId && !!date,
  });
}
