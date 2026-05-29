import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel: string;
  submittingLabel?: string;
  isSubmitting: boolean;
  errorMessage?: string | null;
  formId: string;
  children: React.ReactNode;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  submittingLabel,
  isSubmitting,
  errorMessage,
  formId,
  children,
}: FormDialogProps) {
  const isMobile = useIsMobile();

  const body = (
    <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
  );

  const footer = (
    <div className="border-t border-border bg-card px-5 py-3">
      {errorMessage && (
        <div className="mb-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {errorMessage}
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form={formId}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all disabled:opacity-60 disabled:transform-none"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? (submittingLabel ?? submitLabel) : submitLabel}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] p-0 rounded-t-2xl"
        >
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="font-heading font-bold tracking-[-0.02em]">
              {title}
            </SheetTitle>
            {description && (
              <SheetDescription className="text-xs">{description}</SheetDescription>
            )}
          </SheetHeader>
          {body}
          {footer}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0 sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden",
        )}
      >
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="font-heading font-bold text-lg tracking-[-0.02em]">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs">{description}</DialogDescription>
          )}
        </DialogHeader>
        {body}
        {footer}
      </DialogContent>
    </Dialog>
  );
}
