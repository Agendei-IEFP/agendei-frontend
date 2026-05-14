import type { InviteCreatedDTO, InvitePublicDTO, InviteAcceptResponseDTO } from "@/types/api";
import api from "./axios";

export async function createInvite(storeId: string): Promise<InviteCreatedDTO> {
  const { data } = await api.post<InviteCreatedDTO>(`/stores/${storeId}/invites`);
  return data;
}

export async function getInvitePublic(token: string): Promise<InvitePublicDTO> {
  const { data } = await api.get<InvitePublicDTO>(`/invites/${token}`);
  return data;
}

interface AcceptInviteAnonymousBody {
  name: string;
  email: string;
  password: string;
  accepted_terms: true;
}

export async function acceptInvite(
  token: string,
  body?: AcceptInviteAnonymousBody,
): Promise<InviteAcceptResponseDTO> {
  const { data } = await api.post<InviteAcceptResponseDTO>(
    `/invites/${token}/accept`,
    body ?? {},
  );
  return data;
}
