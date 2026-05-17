import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "@/components/shared/FormDialog";
import { workScheduleSchema, type WorkScheduleFormData } from "@/lib/validations/workSchedule";
import type { WorkScheduleDTO } from "@/types/api";

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 " +
  "focus:ring-ring/20 transition-colors duration-150";

interface ScheduleBlockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WorkScheduleFormData) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
  /** Present when editing an existing block */
  block?: WorkScheduleDTO;
}

export function ScheduleBlockFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  errorMessage,
  block,
}: ScheduleBlockFormDialogProps) {
  const isEdit = !!block;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkScheduleFormData>({
    resolver: zodResolver(workScheduleSchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        block
          ? {
              start_time: block.start_time.slice(0, 5),
              end_time: block.end_time.slice(0, 5),
            }
          : { start_time: "", end_time: "" },
      );
    }
  }, [open, block, reset]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Editar bloco" : "Adicionar bloco"}
      submitLabel={isEdit ? "Salvar" : "Adicionar"}
      submittingLabel={isEdit ? "Salvando…" : "Adicionando…"}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      formId="schedule-block-form"
    >
      <form
        id="schedule-block-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Início
          </label>
          <input type="time" {...register("start_time")} className={inputClass} />
          {errors.start_time && (
            <p className="mt-1 text-xs text-destructive">{errors.start_time.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Término
          </label>
          <input type="time" {...register("end_time")} className={inputClass} />
          {errors.end_time && (
            <p className="mt-1 text-xs text-destructive">{errors.end_time.message}</p>
          )}
        </div>
      </form>
    </FormDialog>
  );
}
