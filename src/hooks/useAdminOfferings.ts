import { useQueries } from "@tanstack/react-query";
import { useMyStores } from "@/hooks/useStores";
import { listOfferings } from "@/lib/api/services";
import { listStoreProfessionals } from "@/lib/api/stores";
import type { StoreDTO, StoreProfessionalDTO, OfferingDTO } from "@/types/api";

export interface AdminOfferingRow {
  offering: OfferingDTO;
  professional: StoreProfessionalDTO;
  store: StoreDTO;
}

export function useAdminOfferings() {
  const { data: stores = [], isLoading: storesLoading } = useMyStores();

  // Step 2: fetch professionals for each store in parallel
  const professionalQueries = useQueries({
    queries: stores.map((store) => ({
      queryKey: ["stores", store.id, "professionals"],
      queryFn: () => listStoreProfessionals(store.id),
    })),
  });

  const professionalsLoading = professionalQueries.some((q) => q.isLoading);

  // Pair each professional with their store once loaded
  const professionalStoreLinks = stores.flatMap((store, i) => {
    const professionals = professionalQueries[i]?.data ?? [];
    return professionals.map((p) => ({ professional: p, store }));
  });

  // Step 3: fetch offerings for each professional_store_id in parallel
  const offeringQueries = useQueries({
    queries: professionalStoreLinks.map(({ professional }) => ({
      queryKey: ["offerings", professional.professional_store_id],
      queryFn: () => listOfferings(professional.professional_store_id),
      enabled: !professionalsLoading,
    })),
  });

  const offeringsLoading = offeringQueries.some((q) => q.isLoading);

  const rows: AdminOfferingRow[] = professionalStoreLinks.flatMap(({ professional, store }, i) => {
    const offerings = offeringQueries[i]?.data ?? [];
    return offerings.map((offering) => ({ offering, professional, store }));
  });

  return {
    rows,
    isLoading: storesLoading || professionalsLoading || offeringsLoading,
    stores,
  };
}
