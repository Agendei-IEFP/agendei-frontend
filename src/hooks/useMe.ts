import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { updateMe, deleteMe } from "@/lib/api/users";
import { useAuthStore } from "@/store/authStore";

export function useUpdateMe() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
  });
}

export function useDeleteMe() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      logout();
      void navigate({ to: "/" });
    },
  });
}
