import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";
import type { ProfessionalWithStoreDTO } from "@/types/api";

interface ProfessionalCardProps {
  professional: ProfessionalWithStoreDTO;
  className?: string;
}

const AVATAR_COLORS = [
  "bg-salmon-100 text-chart-4",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
];

export function ProfessionalCard({ professional, className }: ProfessionalCardProps) {
  const colorIndex = professional.id.charCodeAt(0) % AVATAR_COLORS.length;
  const avatarColor = AVATAR_COLORS[colorIndex];
  const initials = getInitials(professional.name);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-salmon-200",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={cn(
            "size-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
            avatarColor,
          )}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground text-sm">{professional.name}</p>
            <span
              className={cn(
                "chip",
                professional.is_active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {professional.is_active ? "Ativo" : "Inativo"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{professional.store_name}</p>
        </div>
      </div>

      {/* Bio */}
      {professional.bio ? (
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {professional.bio}
        </p>
      ) : (
        <p className="text-xs text-muted-warm italic mb-4">Sem bio cadastrada</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          type="button"
          disabled
          className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-input text-secondary-foreground bg-secondary opacity-50 cursor-not-allowed"
        >
          Editar
        </button>
        <button
          type="button"
          disabled
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-destructive bg-red-50 opacity-50 cursor-not-allowed"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
