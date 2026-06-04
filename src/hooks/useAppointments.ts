import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
