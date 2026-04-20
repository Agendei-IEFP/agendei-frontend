import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getMinhasLojas, criarLoja, atualizarLoja } from "@/lib/api/lojas";
import type { LojaFormData } from "@/lib/validations/loja";

export function useMinhasLojas() {
  return useQuery({
    queryKey: ["minhas-lojas"],
    queryFn: getMinhasLojas,
  });
}

export function useCreateLoja() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LojaFormData) => criarLoja(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minhas-lojas"] });
      navigate({ to: "/admin/dashboard" });
    },
  });
}

export function useUpdateLoja(lojaId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LojaFormData) => atualizarLoja(lojaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minhas-lojas"] });
      navigate({ to: "/admin/dashboard" });
    },
  });
}
