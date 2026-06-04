import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StoreAvailabilityDTO } from "@/types/api";
import {
  listStoreAvailability,
  createStoreAvailability,
  deleteStoreAvailability,
  replaceStoreAvailability,
} from "@/lib/api/storeAvailability";

/** Fetches StoreAvailability for multiple professional-store links in parallel. */
export function useAllStoreAvailability(professionalStoreIds: string[]): {
  data: StoreAvailabilityDTO[];
  isLoading: boolean;
} {
  const results = useQueries({
    queries: professionalStoreIds.map((id) => ({
      queryKey: ["storeAvailability", id],
      queryFn: () => listStoreAvailability(id),
      enabled: !!id,
    })),
  });

  return {
    isLoading: results.some((r) => r.isLoading),
    data: results.flatMap((r) => r.data ?? []),
  };
}

export function useStoreAvailability(professionalStoreId: string) {
  return useQuery({
    queryKey: ["storeAvailability", professionalStoreId],
    queryFn: () => listStoreAvailability(professionalStoreId),
    enabled: !!professionalStoreId,
  });
}

export function useCreateStoreAvailability(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof createStoreAvailability>[1]) =>
      createStoreAvailability(professionalStoreId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeAvailability", professionalStoreId] });
    },
  });
}

export function useDeleteStoreAvailability(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (availabilityId: string) =>
      deleteStoreAvailability(professionalStoreId, availabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeAvailability", professionalStoreId] });
    },
  });
}

export function useReplaceStoreAvailability(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blocks: { weekday: number; start_time: string; end_time: string }[]) =>
      replaceStoreAvailability(professionalStoreId, blocks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeAvailability", professionalStoreId] });
    },
  });
}
