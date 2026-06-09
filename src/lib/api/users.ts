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

export async function deleteMe(): Promise<void> {
  await api.delete("/me/user");
}
