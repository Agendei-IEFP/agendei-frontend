import { useQuery } from "@tanstack/react-query";
import { getMyProfessionals, getMyProfessionalStores } from "@/lib/api/professionals";

export function useMyProfessionals() {
  return useQuery({
    queryKey: ["professionals", "mine"],
    queryFn: getMyProfessionals,
  });
}

export function useMyProfessionalStores() {
  return useQuery({
    queryKey: ["professional-stores", "mine"],
    queryFn: getMyProfessionalStores,
  });
}
