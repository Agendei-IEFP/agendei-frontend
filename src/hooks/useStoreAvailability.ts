import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listStoreAvailability,
  createStoreAvailability,
  deleteStoreAvailability,
  replaceStoreAvailability,
} from "@/lib/api/storeAvailability";

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
