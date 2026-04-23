import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/store/authStore"
import { login, register, logout } from "@/lib/api/auth"
import type { RoleEnum } from "@/types/enums"

function redirectByRole(
  navigate: ReturnType<typeof useNavigate>,
  role: RoleEnum,
) {
  if (role === "admin_loja") {
    navigate({ to: "/admin/dashboard" })
  } else if (role === "profissional") {
    navigate({ to: "/profissional/dashboard" })
  } else {
    navigate({ to: "/lojas" })
  }
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      redirectByRole(navigate, data.user.role)
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      redirectByRole(navigate, data.user.role)
    },
  })
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    // onSettled roda mesmo se a chamada à API falhar —
    // queremos limpar o estado local independentemente
    onSettled: () => {
      clearAuth()
      navigate({ to: "/login" })
    },
  })
}
