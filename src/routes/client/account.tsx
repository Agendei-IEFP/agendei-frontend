import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { useAuthStore } from "@/store/authStore";
import { useUpdateMe, useDeleteMe } from "@/hooks/useMe";
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

export const Route = createFileRoute("/client/account")({
  component: ClientAccountPage,
});

const inputClass = cn(
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20",
  "transition-colors duration-150",
);

function ClientAccountPage() {
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateMe = useUpdateMe();
  const deleteMe = useDeleteMe();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await updateMe.mutateAsync({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(getApiErrorMessage(err));
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    try {
      await deleteMe.mutateAsync();
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
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
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaveSuccess(false);
            }}
            className={inputClass}
            placeholder="O teu nome"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Telefone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setSaveSuccess(false);
            }}
            className={inputClass}
            placeholder="+351 900 000 000"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSaveSuccess(false);
            }}
            className={inputClass}
            placeholder="o-teu@email.com"
          />
        </div>

        {saveError && <p className="text-sm text-destructive">{saveError}</p>}
        {saveSuccess && <p className="text-sm text-green-600">Dados guardados com sucesso.</p>}

        <button
          type="submit"
          disabled={updateMe.isPending}
          className={cn(
            "self-start px-5 py-2.5 rounded-xl text-sm font-bold text-white",
            "bg-linear-to-br from-chart-3 to-primary",
            "shadow-[0_3px_14px_rgba(224,80,64,0.28)] disabled:opacity-50 transition-opacity",
          )}
        >
          {updateMe.isPending ? "A guardar..." : "Guardar"}
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
                disabled={deleteMe.isPending}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {deleteMe.isPending ? "A apagar..." : "Apagar conta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
