import { useQuery } from "@tanstack/react-query";
import { getMinhasLojas } from "@/lib/api/lojas";

export function useMinhasLojas() {
  return useQuery({
    queryKey: ["lojas", "minhas"],
    queryFn: getMinhasLojas,
    throwOnError: false,
  });
}
