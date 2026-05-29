import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStore, getMyStores, updateStore } from "@/lib/api/stores";
import type { StoreFormData } from "@/lib/validations/store";

export function useMyStores() {
  return useQuery({
    queryKey: ["stores", "mine"],
    queryFn: getMyStores,
    throwOnError: false,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<StoreFormData> }) =>
      updateStore(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
