import { useMutation, useQuery } from "@tanstack/react-query";
import { createInvite, getInvitePublic, acceptInvite } from "@/lib/api/invites";

export function useCreateInvite() {
  return useMutation({
    mutationFn: (storeId: string) => createInvite(storeId),
  });
}

export function useInvitePublic(token: string) {
  return useQuery({
    queryKey: ["invite", token],
    queryFn: () => getInvitePublic(token),
    retry: false,
  });
}

export function useAcceptInvite(token: string) {
  return useMutation({
    mutationFn: (body?: { name: string; email: string; password: string; accepted_terms: true }) =>
      acceptInvite(token, body),
  });
}
