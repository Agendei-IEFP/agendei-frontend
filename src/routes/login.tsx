import { createFileRoute, useSearch } from "@tanstack/react-router";
import { LoginForm } from "../components/auth/LoginForm";
import { z } from "zod";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = useSearch({ from: "/login" });
  return <LoginForm redirectTo={redirect} />;
}
