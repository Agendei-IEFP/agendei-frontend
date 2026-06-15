import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { updateMe, changePassword, anonymizeMe, deleteMe } from "@/lib/api/users";
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

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}

export function useAnonymizeMe() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: anonymizeMe,
    onSuccess: () => {
      logout();
      void navigate({ to: "/" });
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
