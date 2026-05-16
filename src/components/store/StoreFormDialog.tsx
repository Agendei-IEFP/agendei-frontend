import { useState, useCallback } from "react";
import { FormDialog } from "@/components/shared/FormDialog";
import { StoreForm } from "./StoreForm";
import type { StoreFormData } from "@/lib/validations/store";

interface StoreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  storeId?: string;
  defaultValues?: Partial<StoreFormData>;
}

const FORM_ID = "store-form";

export function StoreFormDialog({
  open,
  onOpenChange,
  mode,
  storeId,
  defaultValues,
}: StoreFormDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) setErrorMessage(null);
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const handleSuccess = useCallback(() => {
    setErrorMessage(null);
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={mode === "create" ? "Nova loja" : "Editar loja"}
      description={
        mode === "create"
          ? "Preencha os dados do seu estabelecimento"
          : "Atualize os dados desta loja"
      }
      submitLabel={mode === "create" ? "Criar loja" : "Salvar alterações"}
      submittingLabel={mode === "create" ? "Criando loja..." : "Salvando..."}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      formId={FORM_ID}
    >
      <StoreForm
        formId={FORM_ID}
        mode={mode}
        storeId={storeId}
        defaultValues={defaultValues}
        onSuccess={handleSuccess}
        onError={setErrorMessage}
        onSubmittingChange={setIsSubmitting}
      />
    </FormDialog>
  );
}
