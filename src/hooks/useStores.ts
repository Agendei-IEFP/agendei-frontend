import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStore,
  deleteStore,
  getMyStores,
  getStore,
  getStoreOfferings,
  listStores,
  listStoreProfessionals,
  updateStore,
} from "@/lib/api/stores";
import type { StoreFormData } from "@/lib/validations/store";
import type { StoreType } from "@/types/api";

export function useStores(storeType?: StoreType) {
  return useQuery({
    queryKey: ["stores", "public", storeType ?? "all"],
    queryFn: () => listStores(storeType),
  });
}

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
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<StoreFormData> & { is_active?: boolean };
    }) => updateStore(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useStore(storeId: string) {
  return useQuery({
    queryKey: ["stores", "detail", storeId],
    queryFn: () => getStore(storeId),
  });
}

export function useStoreOfferings(storeId: string) {
  return useQuery({
    queryKey: ["stores", storeId, "offerings"],
    queryFn: () => getStoreOfferings(storeId),
  });
}

export function useStoreProfessionals(storeId: string) {
  return useQuery({
    queryKey: ["stores", storeId, "professionals"],
    queryFn: () => listStoreProfessionals(storeId),
  });
}
