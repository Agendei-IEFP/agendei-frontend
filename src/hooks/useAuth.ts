import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/lib/api/auth";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,

    onSettled: () => {
      clearAuth();
      navigate({ to: "/stores" });
    },
  });
}
