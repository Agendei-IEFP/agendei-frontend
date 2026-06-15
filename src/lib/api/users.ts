import api from "@/lib/api/axios";
import type { UserDTO } from "@/types/api";

export async function updateMe(body: {
  name?: string;
  phone?: string;
  email?: string;
}): Promise<UserDTO> {
  const { data } = await api.patch<UserDTO>("/me/user", body);
  return data;
}

export async function changePassword(body: {
  current_password: string;
  new_password: string;
}): Promise<void> {
  await api.patch("/me/password", body);
}

export async function anonymizeMe(): Promise<void> {
  await api.post("/me/anonymize");
}

export async function deleteMe(): Promise<void> {
  await api.delete("/me/user");
}
