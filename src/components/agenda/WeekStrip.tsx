import { cn } from "@/lib/utils";
import { isSameDay, isToday, isPastDay } from "@/lib/agenda";

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

interface WeekStripProps {
  weekDays: Date[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
}

export function WeekStrip({ weekDays, selectedDay, onSelectDay }: WeekStripProps) {
  return (
    <div className="flex gap-1.5">
      {weekDays.map((day, idx) => {
        const selected = isSameDay(day, selectedDay);
        const today = isToday(day);
        const past = isPastDay(day);

        return (
          <button
            key={idx}
            onClick={() => onSelectDay(day)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 rounded-lg py-1.5 px-1 transition-colors",
              selected && "bg-muted border border-border",
              !selected && "hover:bg-muted/60",
            )}
          >
            <span
              className={cn(
                "text-[0.6rem] font-semibold",
                today && "text-chart-3",
                !today && past && "text-muted-foreground/50",
                !today && !past && "text-muted-foreground",
              )}
            >
              {DAY_LABELS[idx]}
            </span>

            {today ? (
              <span className="size-6 rounded-full bg-chart-3 text-white text-xs font-bold flex items-center justify-center">
                {day.getDate()}
              </span>
            ) : (
              <span
                className={cn(
                  "text-xs font-bold",
                  past ? "text-muted-foreground/50" : "text-foreground",
                )}
              >
                {day.getDate()}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
