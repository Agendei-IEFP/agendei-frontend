import { isAxiosError } from "axios";

export function getApiErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) return "Algo deu errado. Tente novamente.";

  const detail = err.response?.data?.detail;
  const status = err.response?.status;

  if (typeof detail === "string") return detail;

  if (status === 422) return "Dados inválidos. Verifique os campos.";

  return "Algo deu errado. Tente novamente.";
}
