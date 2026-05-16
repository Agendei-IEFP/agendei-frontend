import { useState, useCallback } from "react";
import { FormDialog } from "@/components/shared/FormDialog";
import { ServiceForm } from "./ServiceForm";
import type { ServiceFormData } from "@/lib/validations/service";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  serviceId?: string;
  defaultValues?: Partial<ServiceFormData> & { is_active?: boolean };
}

const FORM_ID = "service-form";

export function ServiceFormDialog({
  open,
  onOpenChange,
  mode,
  serviceId,
  defaultValues,
}: ServiceFormDialogProps) {
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
      title={mode === "create" ? "Novo serviço" : "Editar serviço"}
      description={
        mode === "create"
          ? "Crie um serviço canónico para o seu perfil"
          : "Atualize os dados deste serviço"
      }
      submitLabel={mode === "create" ? "Criar serviço" : "Salvar alterações"}
      submittingLabel={mode === "create" ? "Criando..." : "Salvando..."}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      formId={FORM_ID}
    >
      <ServiceForm
        formId={FORM_ID}
        mode={mode}
        serviceId={serviceId}
        defaultValues={defaultValues}
        onSuccess={handleSuccess}
        onError={setErrorMessage}
        onSubmittingChange={setIsSubmitting}
      />
    </FormDialog>
  );
}
