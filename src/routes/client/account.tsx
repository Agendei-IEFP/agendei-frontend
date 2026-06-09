import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { useAuthStore } from "@/store/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteMe, updateMe } from "@/lib/api/users";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/client/account")({
  component: ClientAccountPage,
});

function ClientAccountPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(null);
    setIsLoadingSubmit(true);

    try {
      const response = await updateMe({
        email: email.trim() || undefined,
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
      });

      setUser({ ...user, ...response });

      setSaveSuccess(true);
    } catch (err) {
      setSaveError(getApiErrorMessage(err));
    } finally {
      setIsLoadingSubmit(false);
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsLoadingDelete(true);
    try {
      await deleteMe();
      logout();
      void navigate({ to: "/" });
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setIsLoadingDelete(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4 flex flex-col gap-6">
      <h1 className="font-heading font-extrabold text-xl text-foreground">A minha conta</h1>

      {/* Profile form */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4"
      >
        <h2 className="text-sm font-semibold text-foreground">Dados pessoais</h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Nome</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaveSuccess(false);
            }}
            placeholder="O teu nome"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Telefone</label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setSaveSuccess(false);
            }}
            placeholder="+351 900 000 000"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSaveSuccess(false);
            }}
            placeholder="o-teu@email.com"
          />
        </div>

        {saveError && <p className="text-sm text-destructive">{saveError}</p>}
        {saveSuccess && <p className="text-sm text-green-600">Dados guardados com sucesso.</p>}

        <button
          type="submit"
          disabled={isLoadingSubmit}
          className={cn(
            "self-start px-5 py-2.5 rounded-xl text-sm font-bold text-white",
            "bg-linear-to-br from-chart-3 to-primary",
            "shadow-[0_3px_14px_rgba(224,80,64,0.28)] disabled:opacity-50 transition-opacity",
          )}
        >
          {isLoadingSubmit ? "A guardar..." : "Guardar"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 bg-card p-5 shadow-sm flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-destructive">Zona de perigo</h2>
        <p className="text-xs text-muted-foreground">
          Ao apagar a conta, os teus dados serão desativados permanentemente e serás desconectado.
        </p>

        {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="self-start text-sm font-semibold text-destructive border border-red-200 rounded-xl px-4 py-2 hover:bg-red-50 transition-colors">
              Apagar conta
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tens a certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é permanente. A tua conta será desativada e não poderás recuperá-la.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isLoadingDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isLoadingDelete ? "A apagar..." : "Apagar conta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
