import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAppointment, listMyProfessionalAppointments } from "@/lib/api/appointments";

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
    },
  });
}
