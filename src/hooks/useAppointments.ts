import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelAppointment,
  createAppointment,
  getStoreAppointments,
  listMyAppointments,
  listMyProfessionalAppointments,
} from "@/lib/api/appointments";

export function useMyProfessionalAppointments() {
  return useQuery({
    queryKey: ["my-professional-appointments"],
    queryFn: listMyProfessionalAppointments,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useMyAppointments() {
  return useQuery({
    queryKey: ["my-appointments"],
    queryFn: listMyAppointments,
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["my-professional-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useStoreAppointments(storeId: string, date: string) {
  return useQuery({
    queryKey: ["store-appointments", storeId, date],
    queryFn: () => getStoreAppointments(storeId, date),
    enabled: !!storeId,
  });
}

export function useAllStoreAppointments(storeIds: string[]) {
  const results = useQueries({
    queries: storeIds.map((storeId) => ({
      queryKey: ["store-appointments", storeId],
      queryFn: () => getStoreAppointments(storeId),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  const now = new Date();
  const all = results.flatMap((r) => r.data ?? []);
  const upcoming = all
    .filter((a) => new Date(a.starts_at) >= now)
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  const past = all
    .filter((a) => new Date(a.starts_at) < now)
    .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());

  return { data: [...upcoming, ...past], total: all.length, isLoading };
}
