import { useState } from "react";
import { Copy, Check, Store, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useMyStores } from "@/hooks/useStores";
import { useCreateInvite } from "@/hooks/useInvites";
import { getApiErrorMessage } from "@/lib/api/errorUtils";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ModalState = "selecting" | "loading" | "ready";

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const [state, setState] = useState<ModalState>("selecting");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: stores } = useMyStores();
  const { mutate: createInvite } = useCreateInvite();

  function handleSelectStore(storeId: string) {
    setState("loading");
    setError(null);
    createInvite(storeId, {
      onSuccess: (data) => {
        setInviteUrl(data.url);
        setState("ready");
      },
      onError: (err) => {
        setError(getApiErrorMessage(err));
        setState("selecting");
      },
    });
  }

  function handleCopy() {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      setState("selecting");
      setInviteUrl(null);
      setCopied(false);
      setError(null);
    }
    onOpenChange(val);
  }

  function handleConfirmRegenerate() {
    setShowConfirm(false);
    setInviteUrl(null);
    setState("selecting");
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold tracking-tight">
              Convidar profissional
            </DialogTitle>
            <DialogDescription>
              {state === "ready"
                ? "Link gerado com sucesso. Copie e compartilhe com o profissional."
                : "Selecione a loja para gerar o link de convite."}
            </DialogDescription>
          </DialogHeader>

          {/* Estado: selecionando loja */}
          {(state === "selecting" || state === "loading") && (
            <div className="flex flex-col gap-2 mt-2">
              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              {stores?.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  disabled={state === "loading"}
                  onClick={() => handleSelectStore(store.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors",
                    "hover:border-salmon-200 hover:bg-muted",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {state === "loading" ? (
                      <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    ) : (
                      <Store className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{store.name}</p>
                    <p className="text-xs text-muted-foreground">Clique para gerar o link</p>
                  </div>
                </button>
              ))}
              {stores?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma loja encontrada. Crie uma loja primeiro.
                </p>
              )}
            </div>
          )}

          {/* Estado: link pronto */}
          {state === "ready" && inviteUrl && (
            <div className="flex flex-col gap-4 mt-2">
              {/* Link copiável */}
              <div className="flex gap-2">
                <input
                  readOnly
                  value={inviteUrl}
                  className={cn(
                    "flex-1 rounded-lg border border-input bg-muted px-3 py-2 text-xs text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring/20",
                  )}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                    copied
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-primary text-primary-foreground btn-salmon",
                  )}
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>

              {/* Aviso */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 leading-relaxed">
                <strong>Atenção:</strong> este link expira em 24 horas, permite apenas 1 uso e
                não será exibido novamente ao fechar este modal.
              </div>

              {/* Placeholder compartilhamento social */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Compartilhar via
                </p>
                <div className="flex gap-3">
                  {(["WhatsApp", "Telegram", "Email"] as const).map((label) => (
                    <div key={label} className="relative">
                      <button
                        type="button"
                        disabled
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-muted opacity-40 cursor-not-allowed"
                      >
                        <div className="size-6 rounded-full bg-border" />
                        {label}
                      </button>
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-muted-foreground text-white px-1 rounded-full leading-tight">
                        Em breve
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gerar outro link */}
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors self-start"
              >
                Gerar outro link
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmação para gerar outro link */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gerar novo link?</AlertDialogTitle>
            <AlertDialogDescription>
              Você copiou o link anterior? Uma vez que você confirmar, o link atual não poderá
              ser recuperado. O novo link também expirará em 24 horas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRegenerate}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
