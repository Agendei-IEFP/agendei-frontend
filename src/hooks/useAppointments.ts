import { useQuery } from "@tanstack/react-query";
import { listMyProfessionalAppointments } from "@/lib/api/appointments";

export function useMyProfessionalAppointments() {
  return useQuery({
    queryKey: ["my-professional-appointments"],
    queryFn: listMyProfessionalAppointments,
  });
}
