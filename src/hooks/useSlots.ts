import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "@/lib/api/appointments";

export function useAvailableSlots(
  professionalStoreId: string | null,
  offeringId: string | null,
  date: string,
) {
  return useQuery({
    queryKey: ["slots", professionalStoreId, offeringId, date],
    queryFn: () => getAvailableSlots(professionalStoreId!, offeringId!, date),
    enabled: !!professionalStoreId && !!offeringId && !!date,
  });
}
