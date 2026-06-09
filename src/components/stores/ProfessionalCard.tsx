import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";
import { useNavigate } from "@tanstack/react-router";
import type { StoreProfessionalDTO } from "@/types/api";

interface ProfessionalCardProps {
  professional: StoreProfessionalDTO;
  storeId: string;
}

export function ProfessionalCard({ professional, storeId }: ProfessionalCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      {professional.photo_url ? (
        <img
          src={professional.photo_url}
          alt={professional.name}
          className="size-12 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className={cn(
            "size-12 rounded-full flex items-center justify-center shrink-0",
            "bg-linear-to-br from-chart-3 to-primary text-white text-sm font-bold",
          )}
        >
          {getInitials(professional.name)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{professional.name}</p>
        {professional.bio && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{professional.bio}</p>
        )}
      </div>

      <button
        onClick={() =>
          void navigate({
            to: "/stores/$storeId/book",
            params: { storeId },
            search: { psid: professional.professional_store_id },
          })
        }
        className={cn(
          "shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg",
          "bg-linear-to-br from-chart-3 to-primary text-white",
          "shadow-[0_2px_8px_rgba(224,80,64,0.25)] transition-opacity hover:opacity-90",
          !professional.is_active && "opacity-40 pointer-events-none",
        )}
      >
        Agendar
      </button>
    </div>
  );
}
