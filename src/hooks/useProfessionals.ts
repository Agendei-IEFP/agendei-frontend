import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  getMyProfessionals,
  unlinkProfessional,
  updateProfessional,
} from "@/lib/api/professionals";

export function useMyProfile() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });
}

export function useMyProfessionals() {
  return useQuery({
    queryKey: ["professionals", "mine"],
    queryFn: getMyProfessionals,
  });
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      storeId,
      professionalId,
      updates,
    }: {
      storeId: string;
      professionalId: string;
      updates: Partial<{ bio: string | null; photo_url: string | null; is_active: boolean }>;
    }) => updateProfessional(storeId, professionalId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useUnlinkProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storeId, professionalId }: { storeId: string; professionalId: string }) =>
      unlinkProfessional(storeId, professionalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}
