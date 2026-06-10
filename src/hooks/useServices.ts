import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/api/services";
import { getMyProfile } from "@/lib/api/professionals";

// ---------------------------------------------------------------------------
// Perfil do profissional
// ---------------------------------------------------------------------------

export function useMyProfile() {
  return useQuery({
    queryKey: ["professional", "me"],
    queryFn: getMyProfile,
  });
}

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: listServices,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof updateService>[1] }) =>
      updateService(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
