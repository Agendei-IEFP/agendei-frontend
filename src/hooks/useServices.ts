import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listServices,
  createService,
  updateService,
  deleteService,
  listOfferings,
  createOffering,
  updateOffering,
  deleteOffering,
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "@/lib/api/services";
import { getMyProfile, getMyProfessionalStores } from "@/lib/api/professionals";

// ---------------------------------------------------------------------------
// Perfil do profissional
// ---------------------------------------------------------------------------

export function useMyProfile() {
  return useQuery({
    queryKey: ["professional", "me"],
    queryFn: getMyProfile,
  });
}

export function useMyProfessionalStores() {
  return useQuery({
    queryKey: ["professional", "stores"],
    queryFn: getMyProfessionalStores,
  });
}

// ---------------------------------------------------------------------------
// Serviços canónicos
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

// ---------------------------------------------------------------------------
// Offerings (por loja)
// ---------------------------------------------------------------------------

export function useOfferings(professionalStoreId: string) {
  return useQuery({
    queryKey: ["offerings", professionalStoreId],
    queryFn: () => listOfferings(professionalStoreId),
    enabled: !!professionalStoreId,
  });
}

export function useCreateOffering(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof createOffering>[1]) =>
      createOffering(professionalStoreId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings", professionalStoreId] });
    },
  });
}

export function useUpdateOffering(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      offeringId,
      body,
    }: {
      offeringId: string;
      body: Parameters<typeof updateOffering>[2];
    }) => updateOffering(professionalStoreId, offeringId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings", professionalStoreId] });
    },
  });
}

export function useDeleteOffering(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offeringId: string) => deleteOffering(professionalStoreId, offeringId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings", professionalStoreId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Horários (por loja)
// ---------------------------------------------------------------------------

export function useSchedules(professionalStoreId: string) {
  return useQuery({
    queryKey: ["schedules", professionalStoreId],
    queryFn: () => listSchedules(professionalStoreId),
    enabled: !!professionalStoreId,
  });
}

export function useCreateSchedule(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof createSchedule>[1]) =>
      createSchedule(professionalStoreId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", professionalStoreId] });
    },
  });
}

export function useUpdateSchedule(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      scheduleId,
      body,
    }: {
      scheduleId: string;
      body: Parameters<typeof updateSchedule>[2];
    }) => updateSchedule(professionalStoreId, scheduleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", professionalStoreId] });
    },
  });
}

export function useDeleteSchedule(professionalStoreId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(professionalStoreId, scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", professionalStoreId] });
    },
  });
}
