import { useQuery } from "@tanstack/react-query";
import { getMyProfessionals } from "@/lib/api/professionals";

export function useMyProfessionals() {
  return useQuery({
    queryKey: ["professionals", "mine"],
    queryFn: getMyProfessionals,
  });
}
