import { cn } from "@/lib/utils";
import {
  isSameDay,
  isToday,
  isPastDay,
  occupancyPercent,
  appointmentsForDay,
  toWeekdayIndex,
  type WorkBlock,
} from "@/lib/agenda";
import type { AppointmentDTO } from "@/types/api";

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

interface WeekStripProps {
  weekDays: Date[];
  selectedDay: Date;
  appointments: AppointmentDTO[];
  onSelectDay: (day: Date) => void;
  /** Work blocks per weekday (index 0=Mon … 6=Sun). Used for accurate occupancy. */
  workBlocksByWeekday?: WorkBlock[][];
}

export function WeekStrip({
  weekDays,
  selectedDay,
  appointments,
  onSelectDay,
  workBlocksByWeekday,
}: WeekStripProps) {
  return (
    <div className="flex gap-1.5">
      {weekDays.map((day, idx) => {
        const dayAppts = appointmentsForDay(appointments, day);
        const weekday = toWeekdayIndex(day);
        const dayBlocks = workBlocksByWeekday?.[weekday];
        const pct = occupancyPercent(dayAppts, dayBlocks);
        const selected = isSameDay(day, selectedDay);
        const today = isToday(day);
        const past = isPastDay(day);
        const isSunday = idx === 6;
        const hasContent = dayAppts.length > 0 || (dayBlocks && dayBlocks.length > 0);
        const isDisabled = isSunday && !hasContent;

        return (
          <button
            key={idx}
            onClick={() => !isDisabled && onSelectDay(day)}
            disabled={isDisabled}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 rounded-lg py-1.5 px-1 transition-colors",
              selected && !isDisabled && "bg-muted border border-border",
              !selected && !isDisabled && "hover:bg-muted/60",
              isDisabled && "opacity-30 cursor-not-allowed",
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

            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              {pct > 0 && (
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    past ? "bg-violet-400/60" : "bg-chart-3",
                  )}
                  style={{ width: `${pct}%` }}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
